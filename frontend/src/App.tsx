import { useState, useEffect } from 'react'
import axios from 'axios'
import { Leaf, PlusCircle, BarChart3, Tractor, Trash2, FileDown, Calendar, LogOut } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Login } from './Login'

function App() {
  // --- ESTADOS DE AUTENTICAÇÃO ---
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('@AgroFocus:user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState<string | null>(localStorage.getItem('@AgroFocus:token'))

  // --- ESTADOS DO DASHBOARD ---
  const [stats, setStats] = useState<any>(null)
  const [historico, setHistorico] = useState<any[]>([])
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [categoria, setCategoria] = useState('Sementes')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

  // --- FUNÇÕES DE LOGIN/LOGOUT ---
  const handleLoginSuccess = (userToken: string, userData: any) => {
    localStorage.setItem('@AgroFocus:token', userToken)
    localStorage.setItem('@AgroFocus:user', JSON.stringify(userData))
    setToken(userToken)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.clear()
    setToken(null)
    setUser(null)
  }

  // --- BUSCA DE DADOS ---
  const fetchData = async () => {
    if (!token) return
    try {
      const resStats = await axios.get(`http://localhost:3333/stats`, {
        params: { inicio: dataInicio, fim: dataFim }
      })
      const resTalhoes = await axios.get('http://localhost:3333/talhoes')
      
      setStats(resStats.data)
      if (resTalhoes.data.length > 0) {
        setHistorico(resTalhoes.data[0].despesas || [])
      }
    } catch (err) { console.error("Erro ao buscar dados", err) }
  }

  useEffect(() => { 
    if (token) fetchData() 
  }, [token, dataInicio, dataFim])

  // --- AÇÕES ---
  const handleAddDespesa = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const talhoes = await axios.get('http://localhost:3333/talhoes')
      await axios.post('http://localhost:3333/despesas', {
        descricao, valor, categoria, talhaoId: talhoes.data[0].id
      })
      setDescricao(''); setValor(''); fetchData()
    } catch (err) { alert("Erro ao salvar") }
  }

  const exportarPDF = () => {
    const doc = new jsPDF()
    doc.text("AgroFocus - Relatório de Custos", 14, 15)
    autoTable(doc, {
      startY: 25,
      head: [['Descrição', 'Categoria', 'Data', 'Valor']],
      body: historico.map(d => [
        d.descricao, 
        d.categoria, 
        new Date(d.data).toLocaleDateString('pt-BR'), 
        `R$ ${d.valor.toFixed(2)}`
      ]),
    })
    doc.save("relatorio-agrofocus.pdf")
  }

  // --- PROTEÇÃO DE ROTA ---
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* HEADER */}
      <header className="mb-8 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-lg shadow-lg">
            <Leaf className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">AgroFocus</h1>
            <p className="text-xs text-slate-500 font-medium text-green-600">Olá, {user?.name}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={exportarPDF} className="flex gap-2 items-center bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-all">
            <FileDown size={18} /> Exportar PDF
          </button>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={22} />
          </button>
        </div>
      </header>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-2xl mb-8 flex flex-wrap gap-4 items-center border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-slate-500 font-medium"><Calendar size={18}/> Período:</div>
        <input type="date" className="border border-slate-200 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" onChange={e => setDataInicio(e.target.value)} />
        <span className="text-slate-400">até</span>
        <input type="date" className="border border-slate-200 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" onChange={e => setDataFim(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUNA ESQUERDA */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold mb-4 flex items-center gap-2"><PlusCircle size={18} className="text-green-600"/> Novo Lançamento</h3>
            <form onSubmit={handleAddDespesa} className="space-y-4">
              <input value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição" className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
              <input value={valor} onChange={e => setValor(e.target.value)} type="number" placeholder="Valor R$" className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
              <select value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-green-500">
                <option>Sementes</option><option>Fertilizantes</option><option>Diesel</option><option>Mão de Obra</option>
              </select>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-100 transition-all">Lançar no Sistema</button>
            </form>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-2xl text-white shadow-xl">
            <p className="text-sm opacity-80 font-medium">Investimento Total</p>
            <h2 className="text-4xl font-black mt-1">R$ {stats?.totalGeral?.toLocaleString('pt-BR')}</h2>
            <div className="mt-4 flex items-center gap-2 text-xs bg-white/20 w-fit px-3 py-1 rounded-full"><Tractor size={14}/> Gleba Norte - Ativa</div>
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-8"><BarChart3 size={20} className="text-slate-400"/><h2 className="text-xl font-bold">Distribuição de Custos</h2></div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.categorias}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                    {stats?.categorias?.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="font-bold mb-4 text-slate-800">Histórico de Lançamentos</h3>
             <div className="space-y-3">
               {historico.length > 0 ? historico.map((item) => (
                 <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-green-100 transition-all">
                   <div>
                     <p className="font-bold text-slate-700">{item.descricao}</p>
                     <p className="text-[10px] text-slate-400 uppercase font-black">{item.categoria}</p>
                   </div>
                   <div className="flex items-center gap-6">
                     <span className="font-bold text-green-700">R$ {item.valor.toLocaleString('pt-BR')}</span>
                     <button onClick={async () => { if(confirm("Excluir?")){ await axios.delete(`http://localhost:3333/despesas/${item.id}`); fetchData(); } }} className="text-red-300 hover:text-red-500 transition-colors">
                       <Trash2 size={18}/>
                     </button>
                   </div>
                 </div>
               )) : <p className="text-center text-slate-400 py-4">Nenhum dado encontrado.</p>}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App // <--- EXPORTAÇÃO PADRÃO GARANTIDA