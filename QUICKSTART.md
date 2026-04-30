# 🚀 Quick Start Guide

Guia rápido para começar a usar o HMDb em 5 minutos.

## 1️⃣ Clone o Repositório

```bash
git clone https://github.com/hieo0007/HMDb.git
cd HMDb
```

## 2️⃣ Instale Dependências

```bash
npm install
```

## 3️⃣ Configure Variáveis de Ambiente

### Backend (backend/.env)

```bash
cd backend
cp .env.example .env
```

Edite `backend/.env` e adicione:
- `JWT_SECRET` - Uma string aleatória segura
- `TMDB_API_KEY` - Obtenha em https://www.themoviedb.org/settings/api

### Frontend (cinerate-landing/.env.local)

```bash
cd ../cinerate-landing
cp .env.example .env.local
```

Edite `cinerate-landing/.env.local` e adicione:
- `VITE_TMDB_API_KEY` - Mesmo da acima
- `VITE_GOOGLE_BOOKS_API_KEY` - Obtenha em https://console.developers.google.com

## 4️⃣ Execute Localmente

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Disponível em http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd cinerate-landing
npm run dev
# Disponível em http://localhost:5173
```

## 5️⃣ Teste a Aplicação

1. Abra http://localhost:5173
2. Clique em "Login"
3. Crie uma conta
4. Busque um filme
5. Visualize detalhes
6. Veja seu histórico em seu perfil

## 🎉 Pronto!

Você está rodando o HMDb localmente! Veja a seção de desenvolvimento para próximos passos.

## 🆘 Problemas?

- Verifique [FAQ.md](FAQ.md)
- Abra uma [issue no GitHub](https://github.com/hieo0007/HMDb/issues)

---

Para mais detalhes, veja [README.md](README.md) ou [DEPLOYMENT.md](DEPLOYMENT.md).
