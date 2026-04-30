# HMDb - Movie, Series & Books Database Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF.svg)](https://vitejs.dev/)

Uma plataforma completa para explorar e gerenciar um catálogo integrado de filmes, séries e livros com autenticação de usuário e histórico personalizado.

## 📋 Visão Geral

HMDb é uma aplicação web full-stack que integra dados de múltiplas APIs externas (TMDB, Google Books, OpenLibrary) para fornecer um catálogo unificado. Os usuários podem buscar conteúdo, visualizar detalhes, autenticar-se e manter um histórico de visualizações.

### ✨ Principais Características

- 🎬 **Catálogo Integrado**: Filmes, séries e livros em uma única plataforma
- 👤 **Autenticação Segura**: Registro, login e recuperação de senha com JWT
- 📚 **Histórico Pessoal**: Rastreie seu histórico de visualizações
- 🔍 **Busca Avançada**: Busca em tempo real com debounce otimizado
- 📱 **Design Responsivo**: Totalmente adaptado para mobile e desktop
- 🌙 **Tema Dark**: Interface moderna com tema escuro
- 🎯 **Detalhes Ricos**: Trailers, sinopses, avaliações e provedores de streaming

## 🚀 Stack Tecnológico

### Frontend
- **React 18+** - Biblioteca UI
- **Vite** - Build tool moderno
- **React Router v7** - Roteamento SPA
- **CSS3** - Estilização com suporte responsivo

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite** - Banco de dados leve
- **JWT** - Autenticação segura
- **bcryptjs** - Criptografia de senhas
- **CORS** - Controle de origem cruzada

### Integrações Externas
- **TMDB API** - Dados de filmes e séries
- **Google Books API** - Informações de livros
- **OpenLibrary API** - Fallback para livros

## 📁 Estrutura do Projeto

```
HMDb/
├── backend/                    # API Node.js + Express
│   ├── src/
│   │   ├── server.js          # Configuração Express e rotas
│   │   ├── db/
│   │   │   └── database.js    # Inicialização SQLite
│   │   └── store/
│   │       ├── userStore.js
│   │       ├── passwordResetStore.js
│   │       ├── userHistoryStore.js
│   │       └── emailStore.js
│   ├── data/                  # Dados persistidos
│   └── package.json
│
├── cinerate-landing/           # Frontend React + Vite
│   ├── src/
│   │   ├── pages/             # Páginas principais
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── services/          # Integração com APIs
│   │   └── data/              # Dados mockados
│   ├── public/                # Assets estáticos
│   ├── vite.config.js         # Configuração Vite
│   ├── vercel.json            # Deploy Vercel
│   └── package.json
│
├── netlify.toml               # Configuração Netlify
├── package.json               # Dependências raiz
└── README.md                  # Este arquivo
```

## 🔧 Pré-requisitos

- **Node.js** v16.0.0 ou superior
- **npm** v7 ou superior (ou yarn/pnpm)
- Chaves de API:
  - [TMDB API Key](https://www.themoviedb.org/settings/api)
  - [Google Books API Key](https://developers.google.com/books)

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/hieo0007/HMDb.git
cd HMDb
```

### 2. Instale dependências raiz

```bash
npm install
```

### 3. Configure o Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/`:

```env
NODE_ENV=development
PORT=3001
DATABASE_PATH=./data/database.sqlite
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_EXPIRES_IN=7d
SMTP_HOST=seu_host_smtp
SMTP_PORT=587
SMTP_USER=seu_email
SMTP_PASS=sua_senha
RESET_PASSWORD_URL=http://localhost:5173/reset-password
```

### 4. Configure o Frontend

```bash
cd ../cinerate-landing
npm install
```

Crie um arquivo `.env.local` na pasta `cinerate-landing/`:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_TMDB_API_KEY=sua_chave_tmdb_aqui
VITE_GOOGLE_BOOKS_API_KEY=sua_chave_google_aqui
```

## 🏃 Como Executar

### Modo Desenvolvimento (recomendado)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend disponível em: `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd cinerate-landing
npm run dev
```
Frontend disponível em: `http://localhost:5173`

### Modo Produção

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd cinerate-landing
npm run build
npm run preview
```

## 🔌 API Endpoints

### Autenticação
```
POST   /api/auth/signup              # Registro novo usuário
POST   /api/auth/login               # Login com email/senha
POST   /api/auth/forgot-password     # Solicitar reset de senha
POST   /api/auth/reset-password      # Confirmar reset de senha
```

### Histórico do Usuário
```
POST   /api/users/:userId/history    # Adicionar ao histórico
GET    /api/users/:userId/history    # Listar histórico
```

### Utilitários
```
GET    /health                       # Health check
POST   /api/emails                   # Capturar newsletter
```

## 🧪 Testes e Qualidade

Executar linter:
```bash
cd cinerate-landing
npm run lint
```

## 📝 Fluxo da Aplicação

1. **Frontend** renderiza interface e rotas
2. **Usuário** busca conteúdo via TMDB/Google Books/OpenLibrary
3. **Frontend** faz requisições ao **Backend** para:
   - Autenticação (JWT)
   - Histórico de visualizações
   - Newsletter/emails
4. **Backend** persiste dados no SQLite

## 🌐 Deploy

### Frontend - Netlify
A configuração está em `netlify.toml`:
```bash
npm run build  # Gera dist/
# Deploy automático via Git
```

### Frontend - Vercel
Configuração em `vercel.json` pronta para deploy.

### Backend
Deploy recomendado em:
- Heroku
- Railway
- Render
- DigitalOcean

## 🔐 Segurança

- ✅ Senhas criptografadas com bcryptjs
- ✅ JWT para sessões seguras
- ✅ CORS configurado
- ✅ Validação de entrada
- ✅ Proteção contra SQL Injection (prepared statements)
- ✅ Tokens de reset de senha com expiração

## 🤝 Contribuição

1. Faça um Fork
2. Crie uma branch (`git checkout -b feature/melhoria`)
3. Commit suas mudanças (`git commit -m 'Adiciona melhoria'`)
4. Push para a branch (`git push origin feature/melhoria`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma [Issue](https://github.com/hieo0007/HMDb/issues)
- Envie um Pull Request

## 🙏 Créditos

- [TMDB](https://www.themoviedb.org/) - Dados de filmes e séries
- [Google Books](https://developers.google.com/books) - API de livros
- [OpenLibrary](https://openlibrary.org/api) - Dados alternativos de livros

---

**Desenvolvido com ❤️ por [hieo0007](https://github.com/hieo0007)**
