# Manual do Projeto HMDb

Este documento e um manual de referencia do projeto: onde cada parte fica, o que faz e como operar.

## 1. Estrutura geral

- `cinerate-landing/`: frontend React + Vite.
- `backend/`: API Node + Express + SQLite.
- `descrição/`: documentacao interna.

Fluxo base:

1. Frontend renderiza telas e navega por rotas.
2. Frontend consome APIs externas (TMDB/Google Books/OpenLibrary) para catalogo.
3. Frontend consome backend para autenticacao e historico.
4. Backend salva dados no SQLite.

## 2. Arquivos da raiz

### `package.json`
- Pacote raiz minimo (nao e o app principal de build).

### `package-lock.json`
- Lockfile da raiz.

### `netlify.toml`
- Config de deploy Netlify.
- Build em `cinerate-landing`.
- Redirect SPA para `index.html`.

## 3. Backend (`backend/`)

### 3.1 Configuracao

#### `backend/package.json`
- Scripts:
  - `npm run dev`: sobe servidor com watch.
  - `npm start`: sobe servidor normal.

#### `backend/package-lock.json`
- Lockfile do backend.

### 3.2 Servidor e rotas

#### `backend/src/server.js`
- Inicializa Express, CORS, parser JSON, logs (`morgan`) e variaveis de ambiente.
- Rotas de autenticacao:
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
- Rotas de historico:
  - `POST /api/users/:userId/history`
  - `GET /api/users/:userId/history`
- Rota utilitaria:
  - `GET /health`
- Rota de captura de emails:
  - `POST /api/emails`

### 3.3 Banco e persistencia

#### `backend/src/db/database.js`
- Inicializa SQLite.
- Cria tabelas:
  - `users`
  - `emails`
  - `user_history`
  - `password_reset_tokens`

#### `backend/src/store/userStore.js`
- Operacoes de usuario:
  - buscar por email/id
  - criar
  - atualizar hash de senha

#### `backend/src/store/passwordResetStore.js`
- Operacoes de reset:
  - criar token
  - buscar token ativo
  - consumir token
  - limpar expirados

#### `backend/src/store/userHistoryStore.js`
- Operacoes de historico:
  - adicionar evento
  - listar eventos por usuario

#### `backend/src/store/emailStore.js`
- Salva email em tabela `emails` evitando duplicidade.

## 4. Frontend (`cinerate-landing/`)

### 4.1 Config de build e qualidade

#### `cinerate-landing/package.json`
- Scripts:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`
  - `npm run lint`

#### `cinerate-landing/vite.config.js`
- Plugin React.
- Proxy local de `/api` para backend `http://localhost:3001`.

#### `cinerate-landing/eslint.config.js`
- Regras de lint JS/JSX.

#### `cinerate-landing/vercel.json`
- Rewrite SPA para `index.html`.

#### `cinerate-landing/index.html`
- HTML base da SPA.

#### `cinerate-landing/public/_redirects`
- Redirect SPA para Netlify.

### 4.2 Entrada da aplicacao

#### `cinerate-landing/src/main.jsx`
- Entry point React.
- Renderiza `<App />`.

#### `cinerate-landing/src/App.jsx`
- Roteamento principal:
  - `/` -> `LandingPage`
  - `/filmes` -> `Films` (tema filmes)
  - `/series` -> `Films` (tema series)
  - `/livros` -> `Films` (tema livros)
  - `/detalhes/:contentType/:id` -> `DetalhesPage`
  - `/pagelogin` e `/login` -> `PageLogin`
- Mantem busca global para navbar + catalogo.

### 4.3 Paginas

#### `src/pages/LandingPage.jsx`
- Home principal com CTA de explorar catalogo e criar conta.
- Inclui `Footer`.

#### `src/pages/LandingPage.css`
- Estilo da home (tema dark/vermelho).

#### `src/pages/Films.jsx`
- Pagina de catalogo para filmes, series e livros.
- Responsabilidades:
  - carregar dados de APIs
  - normalizar itens
  - montar fileiras
  - aplicar busca com debounce
  - fallback de livros (Google Books -> OpenLibrary -> estatico)

#### `src/pages/Films.css`
- Layout do catalogo, rows e estados de loading/erro.

#### `src/pages/DetalhesPage.jsx`
- Tela de detalhes de filme/serie.
- Mostra poster, trailer, nota, sinopse, diretor e generos.
- Busca providers BR quando disponivel.

#### `src/pages/DetalhesPage.css`
- Estilo da tela de detalhes.

#### `src/pages/PageLogin.jsx`
- Login/cadastro/esqueci senha.
- Integracao com backend:
  - `/api/auth/login`
  - `/api/auth/signup`
  - `/api/auth/forgot-password`
  - `/api/auth/reset-password`
- Guarda sessao em `localStorage` ou `sessionStorage`.

#### `src/pages/PageLogin.css`
- Estilo da tela de autenticacao.

### 4.4 Componentes em uso direto no fluxo atual

#### `src/components/Navbar.jsx`
- Header fixo.
- Busca global.
- Estado de usuario logado.
- Logout e menu mobile.

#### `src/components/Navbar.css`
- Estilos da navbar.

#### `src/components/Footer.jsx`
- Rodape com links principais e marca.

#### `src/components/Footer.css`
- Estilo do rodape.

#### `src/components/HeroPrincipal.jsx`
- Hero com trailer rotativo para filmes/series.
- Controles de slide e audio.

#### `src/components/HeroPrincipal.css`
- Estilo do hero principal.

#### `src/components/BooksHero.jsx`
- Hero rotativo para livros.

#### `src/components/BooksHero.css`
- Estilo do hero de livros.

#### `src/components/MovieRow.jsx`
- Linha horizontal de cards com scroll lateral.

#### `src/components/MovieRow.css`
- Estilo das rows e setas de navegacao.

### 4.5 Componentes auxiliares/legado (nao usados na rota principal atual)

#### `src/components/MovieCard.jsx` + `MovieCard.css`
- Card individual usado pelo `Trending`.

#### `src/components/Trending.jsx` + `Trending.css`
- Secao de trending baseada em TMDB.

#### `src/components/Hero.jsx` + `Hero.css`
- Hero alternativo antigo.

#### `src/components/CTA.jsx` + `CTA.css`
- Bloco de CTA independente.

#### `src/components/DetalhesModal.jsx` + `DetalhesModal.css`
- Modal de detalhes (alternativa a `DetalhesPage`).

#### `src/components/StarRating.jsx`
- Renderizacao de rating simbolico.

#### `src/components/Testimonials.jsx`
- Arquivo vazio atualmente.

#### `src/components/TrailerHero.css`
- CSS sem componente correspondente ativo.

### 4.6 Servicos e dados

#### `src/services/api.js`
- Centraliza endpoints/chaves por variaveis de ambiente.

#### `src/data/mockData.js`
- Dados mockados; atualmente fora do fluxo principal.

#### `src/styles/global.css`, `src/index.css`, `src/App.css`
- Camadas de estilo global/base/tema.

## 5. Variaveis de ambiente

### Frontend (`cinerate-landing/.env`)
- `VITE_CONTENT_API_KEY` ou `VITE_TMDB_API_KEY`
- `VITE_CONTENT_API_BASE_URL`
- `VITE_CONTENT_IMAGE_BASE_URL`
- `VITE_BOOKS_API_BASE_URL`
- `VITE_VIDEO_EMBED_BASE_URL`
- `VITE_BACKEND_BASE_URL`

### Backend (`backend/.env`)
- `PORT`
- `FRONTEND_ORIGIN`
- `RESET_CODE_TTL_MINUTES`
- `DATABASE_PATH`

## 6. Operacao local

1. Subir backend:
   - `cd backend`
   - `npm install`
   - `npm run dev`
2. Subir frontend:
   - `cd cinerate-landing`
   - `npm install`
   - `npm run dev`
3. Acessar URL local do Vite.

## 7. Checklist rapido de manutencao

1. Alterou rotas no frontend:
   - validar `App.jsx`
   - validar links da `Navbar`.
2. Alterou autenticacao:
   - validar endpoints em `server.js`
   - validar fluxo em `PageLogin.jsx`.
3. Alterou dados de catalogo:
   - validar normalizacao em `Films.jsx`
   - testar filmes, series e livros.
4. Alterou estilos globais:
   - revisar `global.css`, `index.css`, `App.css`.
5. Antes de publicar:
   - rodar `npm run build` em `cinerate-landing`.

