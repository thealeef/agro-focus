import { useState } from 'react'
import axios from 'axios'
import { Leaf, Lock, Mail, User } from 'lucide-react'

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void
}

// DEFINIÇÃO DA URL DINÂMICA (Igual ao App.tsx)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export function Login({ onLoginSuccess }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const endpoint = isRegister ? '/register' : '/login'
      
      // ALTERADO: Usando a variável API_URL com crases
      const res = await axios.post(`${API_URL}${endpoint}`, {
        email, password, name
      })

      if (!isRegister) {
        onLoginSuccess(res.data.token, res.data.user)
      } else {
        alert("Conta criada! Agora faça login.")
        setIsRegister(false)
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro na operação. Verifique se o servidor está ligado.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 border border-slate-200">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-600 p-3 rounded-2xl mb-4 shadow-lg shadow-green-200">
            <Leaf className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-800">AgroFocus</h1>
          <p className="text-slate-500 text-sm">{isRegister ? 'Crie a sua conta gratuita' : 'Aceda ao seu painel agrícola'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input 
                type="text" placeholder="Nome Completo" required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                value={name} onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input 
              type="email" placeholder="E-mail" required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input 
              type="password" placeholder="Palavra-passe" required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-100 mt-2">
            {isRegister ? 'Criar Conta' : 'Entrar no Sistema'}
          </button>
        </form>

        <button 
          onClick={() => setIsRegister(!isRegister)}
          className="w-full mt-6 text-sm text-slate-500 hover:text-green-600 transition-colors"
        >
          {isRegister ? 'Já tem conta? Entre aqui' : 'Não tem conta? Registe-se agora'}
        </button>
      </div>
    </div>
  )
}