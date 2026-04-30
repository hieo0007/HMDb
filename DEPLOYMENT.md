# Guia de Deploy

Este documento descreve como fazer deploy do HMDb em diferentes plataformas.

## 📋 Pré-requisitos Gerais

- Repositório no GitHub
- Conta em uma plataforma de hosting
- Chaves de API (TMDB, Google Books)
- Domínio (opcional)

## 🚀 Deploy do Frontend

### Netlify (Recomendado)

1. **Conectar repositório:**
   ```bash
   # Ir ao site netlify.com
   # Login com GitHub
   # New Site from Git
   # Selecionar repositório
   ```

2. **Configurar build:**
   - **Build command:** `cd cinerate-landing && npm run build`
   - **Publish directory:** `cinerate-landing/dist`

3. **Variáveis de ambiente:**
   - Ir para Site Settings → Build & Deploy → Environment
   - Adicionar:
     ```
     VITE_API_BASE_URL=https://seu-backend.com
     VITE_TMDB_API_KEY=sua_chave
     VITE_GOOGLE_BOOKS_API_KEY=sua_chave
     ```

4. **Deploy:**
   ```bash
   npm run build  # Build local para testar
   # Git push dispara deploy automático
   ```

### Vercel

1. **Importar projeto:**
   ```bash
   # vercel.json já está configurado
   npm i -g vercel
   vercel
   ```

2. **Configurar:**
   - Root Directory: `cinerate-landing`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Variáveis de ambiente:**
   ```bash
   vercel env add VITE_API_BASE_URL
   vercel env add VITE_TMDB_API_KEY
   vercel env add VITE_GOOGLE_BOOKS_API_KEY
   ```

## 🛠️ Deploy do Backend

### Opção 1: Heroku

1. **Preparar:**
   ```bash
   cd backend
   # Criar Procfile
   echo "web: node src/server.js" > Procfile
   ```

2. **Deploy:**
   ```bash
   npm install -g heroku
   heroku login
   heroku create seu-app-name
   git push heroku main
   ```

3. **Variáveis de ambiente:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=sua_chave_segura
   heroku config:set SMTP_HOST=smtp.gmail.com
   # ... outras variáveis
   ```

### Opção 2: Railway

1. **Conectar:**
   - https://railway.app
   - New Project → GitHub Repo
   - Selecionar repositório

2. **Configurar:**
   - Root Directory: `backend`
   - Start Command: `npm start`
   - Port: 3001

3. **Variáveis de ambiente:**
   - Settings → Variables
   - Adicionar todas as variáveis do `.env.example`

### Opção 3: Render

1. **Criar Web Service:**
   - https://render.com
   - New → Web Service
   - GitHub Repository

2. **Configurar:**
   - Name: hmdb-backend
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free tier

3. **Variáveis de ambiente:**
   - Ir para Environment
   - Adicionar variáveis

### Opção 4: DigitalOcean App Platform

1. **Criar App:**
   - https://cloud.digitalocean.com
   - Create → App
   - GitHub Repository

2. **Configurar:**
   - Source: GitHub
   - Repository: HMDb
   - Branch: main
   - Dockerfile presente? No
   - Build command: `cd backend && npm install`
   - Run command: `cd backend && npm start`

## 🔗 Conectando Frontend ao Backend

Após fazer deploy:

### Frontend (Netlify/Vercel)
```
Variável: VITE_API_BASE_URL
Valor: https://seu-backend-deploy-url.com
```

### Backend
```env
CORS_ORIGIN=https://seu-frontend-deploy-url.com
```

## 🔐 Segurança em Produção

### Frontend
- ✅ Build otimizado com `npm run build`
- ✅ Servir com GZIP ativado
- ✅ Headers de segurança configurados
- ✅ HTTPS obrigatório

### Backend
```env
# Em produção SEMPRE:
NODE_ENV=production
JWT_SECRET=<string_muito_longa_e_aleatoria>
CORS_ORIGIN=https://seu-dominio.com
# Usar HTTPS para todas as URLs
RESET_PASSWORD_URL=https://seu-frontend.com/reset-password
```

### Banco de dados
- Faça backup regularmente
- Use credenciais fortes
- Acesso apenas do backend

## 📊 Monitoramento

### Logs
- **Netlify:** Site Settings → Logs
- **Vercel:** Deployments → Logs
- **Railway/Render:** Logs dashboard

### Performance
- Usar Lighthouse (https://pagespeed.web.dev)
- Monitorar métricas Web Vitals
- Acompanhar erros JavaScript

### Uptime
- Usar https://uptimerobot.com (Free)
- Configurar alerts para /health endpoint

## 📝 Checklist de Deploy

### Antes do Deploy

- [ ] Testar localmente em produção (`npm run build` + `npm run preview`)
- [ ] Executar linter sem erros
- [ ] Verificar variáveis de ambiente
- [ ] Atualizar CHANGELOG.md
- [ ] Criar tag de versão: `git tag v1.0.0`

### Após o Deploy

- [ ] Testar fluxo completo
- [ ] Verificar autenticação
- [ ] Testar busca de conteúdo
- [ ] Verificar histórico do usuário
- [ ] Acompanhar logs por 24h

## 🔄 CI/CD (GitHub Actions)

Exemplo simples de workflow:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Frontend
        run: cd cinerate-landing && npm install && npm run build
      
      - name: Deploy to Netlify
        run: npx netlify-cli deploy --prod --site=${{ secrets.NETLIFY_SITE_ID }} --auth=${{ secrets.NETLIFY_TOKEN }}
```

## 🆘 Troubleshooting

### CORS Error
```
Backend não responde: Verificar CORS_ORIGIN
Certificar HTTPS no production
```

### Deploy falha
```
Verificar logs da plataforma
Confirmar Node.js version compatível
Rodar npm install localmente
```

### Database connection
```
Verificar DATABASE_PATH
Confirmar permissões de escrita
Checar espaço em disco
```

---

**Precisa de ajuda? Abra uma issue no GitHub! 🎉**
