# 🌿 AgroFocus - Gestão de Custos Agrícolas

# 👨‍💻 Desenvolvedor
## Alef Ribeiro Dias
**GitHub: thealeef**

**Projeto: AgroFocus**

Este projeto foi desenvolvido como parte de um portfólio focado em soluções para o agronegócio.

O **AgroFocus** é uma aplicação Fullstack moderna desenvolvida para auxiliar produtores rurais no controle financeiro de suas propriedades. O sistema permite o gerenciamento de despesas por talhão, visualização de indicadores através de gráficos e geração de relatórios profissionais.

---

## 🚀 Funcionalidades Principais

* **Autenticação de Usuários**: Sistema de login e cadastro com segurança via JWT e criptografia de senhas.
* **Dashboard Financeiro**: Resumo visual dos investimentos totais e distribuição por categorias.
* **Gráficos Reativos**: Visualização dinâmica de custos (Sementes, Fertilizantes, Diesel, Mão de Obra).
* **Filtros de Período**: Consulta de despesas baseada em intervalos de datas específicos.
* **Geração de Relatórios**: Exportação de todo o histórico de lançamentos para formato PDF.
* **Gestão de Lançamentos**: Adição e exclusão de despesas em tempo real com persistência no banco de dados.

## 🛠️ Tecnologias Utilizadas

### Frontend
* **React.js** + **Vite**: Base da aplicação para alta performance.
* **Tailwind CSS**: Estilização moderna e responsiva.
* **Recharts**: Biblioteca para renderização dos gráficos de custos.
* **Lucide React**: Conjunto de ícones minimalistas.
* **jsPDF & AutoTable**: Motores para geração do relatório PDF.

### Backend
* **Node.js** + **Fastify**: Servidor rápido e escalável.
* **Prisma ORM**: Gerenciamento e modelagem do banco de dados.
* **SQLite**: Banco de dados relacional local para desenvolvimento ágil.
* **JWT & Bcryptjs**: Proteção de rotas e segurança de dados do usuário.

---

## 📦 Como rodar o projeto localmente

### 1. Pré-requisitos
* Node.js instalado (versão 18 ou superior).
* Git para clonagem.

### 2. Configuração do Backend
```bash
# Entre na pasta do backend
cd agro-focus/backend

# Instale as dependências
npm install

# Execute as migrações do banco de dados
npx prisma migrate dev

# Inicie o servidor
npm run dev

3. Configuração do Frontend
Bash

# Entre na pasta do frontend (abra um novo terminal)
cd agro-focus/frontend

# Instale as dependências
npm install

# Inicie a aplicação
npm run dev
Acesse http://localhost:5173 no seu navegador.


---

### Como aplicar agora:
1. Abra o arquivo **README.md** no VS Code.
2. Selecione tudo (**Ctrl + A**) e apague.
3. Cole o código acima.
4. Salve o arquivo.
5. No terminal, envie a atualização para o GitHub:
   ```bash
   git add README.md
   git commit -m "docs: atualizando readme com especificacoes tecnicas"
   git push