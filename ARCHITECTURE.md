# Arquitetura do HMDb

## 🏗️ Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTE (Browser)                      │
│                    React 18 + React Router                  │
└─────────────────────────────────────────────────────────────┘
                             ↓
                    (HTTPS/Proxy /api)
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                     NODE.JS/EXPRESS API                     │
│  Autenticação | Histórico | Emails | Health Check          │
└─────────────────────────────────────────────────────────────┘
           ↓                          ↓
      ┌─────────┐           ┌────────────────┐
      │ SQLite  │           │ APIs Externas  │
      │ Database│           │ (TMDB, Books)  │
      └─────────┘           └────────────────┘
```

## 📦 Componentes Principais

### Frontend (React + Vite)

#### Estrutura de Pastas
```
src/
├── pages/              # Páginas principais
│   ├── LandingPage     # Home
│   ├── Films           # Catálogo (filmes, séries, livros)
│   ├── DetalhesPage    # Detalhes de item
│   └── PageLogin       # Autenticação
├── components/         # Componentes reutilizáveis
│   ├── Navbar          # Header com busca
│   ├── Footer          # Rodapé
│   ├── HeroPrincipal   # Hero rotativo
│   └── MovieCard       # Card de filme/série
├── services/           # Integração com APIs
│   └── api.js          # Cliente HTTP
├── data/              # Dados mockados
├── App.jsx            # Roteamento principal
└── main.jsx           # Entry point
```

#### Fluxo de Dados

```
User Input
    ↓
Component State (React.useState)
    ↓
API Call (axios em services/api.js)
    ↓
Backend Response
    ↓
Update State & Re-render
    ↓
Display to User
```

#### Integrações com APIs Externas

1. **TMDB API** (Filmes/Séries)
   ```
   GET /api/search/multi?query=...
   GET /api/tv/{id}
   GET /api/movie/{id}
   ```

2. **Google Books** (Livros)
   ```
   GET /books/v1/volumes?q=...
   ```

3. **OpenLibrary** (Fallback/Alternativa)
   ```
   GET /api/search.json?title=...
   ```

### Backend (Node.js + Express)

#### Estrutura de Pastas
```
backend/
├── src/
│   ├── server.js       # Configuração Express e rotas
│   ├── db/
│   │   └── database.js # Inicialização SQLite
│   └── store/          # Funções de persistência
│       ├── userStore.js
│       ├── passwordResetStore.js
│       ├── userHistoryStore.js
│       └── emailStore.js
├── data/               # Banco SQLite
└── package.json
```

#### Rotas da API

```
POST /api/auth/signup
├─ Body: { email, password }
├─ Hash password
└─ Save user to users table

POST /api/auth/login
├─ Body: { email, password }
├─ Verify password
└─ Return JWT token

POST /api/auth/forgot-password
├─ Body: { email }
├─ Generate reset token
└─ Send email (SMTP)

POST /api/auth/reset-password
├─ Body: { token, newPassword }
├─ Verify token
└─ Update password

POST /api/users/:userId/history
├─ Body: { contentType, contentId, title }
├─ Auth required (JWT)
└─ Save to user_history table

GET /api/users/:userId/history
├─ Auth required (JWT)
└─ Return user's viewing history

GET /health
└─ Return server status

POST /api/emails
├─ Body: { email }
└─ Save newsletter signup
```

#### Modelo de Dados (SQLite)

```sql
-- Usuários
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Histórico de visualizações
CREATE TABLE user_history (
  id INTEGER PRIMARY KEY,
  userId INTEGER NOT NULL,
  contentType TEXT,      -- 'movie', 'tv', 'book'
  contentId TEXT NOT NULL,
  title TEXT,
  watchedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id)
);

-- Tokens de reset de senha
CREATE TABLE password_reset_tokens (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expiresAt DATETIME NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter emails
CREATE TABLE emails (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔑 Fluxo de Autenticação

```
1. User → Frontend: Submete login
                    ↓
2. Frontend → Backend: POST /api/auth/login
              ├─ email & password criptografado
                    ↓
3. Backend: Busca usuário
              ├─ Verifica password hash
              ├─ Gera JWT token
                    ↓
4. Backend → Frontend: { token, userId, email }
                    ↓
5. Frontend: Salva token em localStorage
              ├─ Inclui em Authorization header futuro
                    ↓
6. Frontend → Backend (com JWT): GET /api/users/:userId/history
              ├─ Backend verifica JWT
              ├─ Retorna dados protegidos
```

## 🔄 Fluxo de Busca de Conteúdo

```
1. User digita na barra de busca
                    ↓
2. Debounce 300ms dispara
                    ↓
3. Frontend chama TMDB API OU Google Books
                    ↓
4. Normaliza dados (estrutura uniforme)
                    ↓
5. Renderiza resultados em cards
                    ↓
6. User clica em item
                    ↓
7. Frontend → Backend: POST /api/users/:userId/history
              (registra visualização)
                    ↓
8. Frontend → redireciona para /detalhes/:contentType/:id
```

## 🔍 Decisões Arquiteturais

### Por que SQLite?
- ✅ Leve e sem servidor
- ✅ Perfeito para prototipagem
- ✅ Migração fácil para PostgreSQL depois
- ❌ Não é ideal para escala massive

### Por que React Router v7?
- ✅ SPA moderno
- ✅ Nested routes
- ✅ Ativa novos features
- ✅ Comunidade grande

### Por que Vite?
- ✅ HMR rápido
- ✅ Build otimizado
- ✅ Suporta React nativamente
- ✅ Menor bundle size vs Webpack

### Por que JWT?
- ✅ Stateless (não precisa de sessão)
- ✅ Escalável
- ✅ Seguro com HTTPS
- ✅ Funciona bem com SPAs

## 🚀 Escalabilidade Futura

### Frontend
```
Adicionar:
├─ TypeScript para type safety
├─ Redux/Context para estado global
├─ Service Workers para offline
└─ Testes com Vitest/Playwright
```

### Backend
```
Migrar para:
├─ PostgreSQL (escala melhor)
├─ Redis (cache/session)
├─ Message queue (jobs assíncronos)
├─ Microserviços (separar auth/history)
└─ Docker + Kubernetes (deploy)
```

## 📈 Performance

### Frontend
- ✅ Vite código splitting automático
- ✅ Lazy loading de rotas
- ✅ Debounce em busca
- ✅ Otimização de imagens

### Backend
- ✅ Compressão GZIP
- ✅ Morgan logging eficiente
- ✅ Connection pooling SQLite
- ✅ Prepared statements

## 🔐 Segurança

### Frontend
- XSS Protection via React (escape by default)
- CORS configurado
- HTTPS em produção

### Backend
- HTTPS obrigatório em produção
- JWT expira em 7 dias
- Senhas com bcryptjs 10 rounds
- SQL Injection prevented com sqlite3 library
- Rate limiting recomendado

## 🧪 Testes (Futuro)

```javascript
// Frontend - Vitest + React Testing Library
test('Login flow', async () => {
  render(<PageLogin />);
  // ...
});

// Backend - Jest/Supertest
test('POST /api/auth/login', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    // ...
});
```

---

**Quer estender a arquitetura? Veja [CONTRIBUTING.md](CONTRIBUTING.md)!**
