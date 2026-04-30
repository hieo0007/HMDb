# Perguntas Frequentes (FAQ)

## 🚀 Primeiros Passos

### Como começo a usar o HMDb?

1. Clone o repositório: `git clone https://github.com/hieo0007/HMDb.git`
2. Instale dependências: `npm install`
3. Configure variáveis de ambiente (veja [Backend](.env.example) e [Frontend](cinerate-landing/.env.example))
4. Execute: `npm run dev` (backend) e `npm run dev` (frontend em outro terminal)

### Preciso de quais APIs?

- **TMDB API:** Filmes e séries (grátis em https://www.themoviedb.org/settings/api)
- **Google Books:** Livros (grátis em https://console.developers.google.com)
- **OpenLibrary:** Fallback de livros (grátis, sem autenticação)

### Qual é a stack tecnológica?

**Frontend:** React 18, Vite, React Router
**Backend:** Node.js, Express, SQLite
**Autenticação:** JWT, bcryptjs

---

## 💡 Como Usar

### Como fazer login?

1. Clique em "Login" na navbar
2. Escolha entre "Entrar" ou "Criar Conta"
3. Preenchha os dados e confirme
4. Suas credenciais são salvas no SQLite do backend

### Como resetar minha senha?

1. Clique em "Esqueci a Senha" na tela de login
2. Digite seu email
3. Verifique seu email para o link de reset
4. Clique no link e defina uma nova senha

### Como funciona o histórico?

- Cada vez que você visualiza detalhes de um filme/série/livro, é registrado
- Veja seu histórico em seu perfil (quando implementado)
- O histórico é pessoal (requer autenticação)

### Posso buscar offline?

Não, HMDb requer internet para:
- Buscar filmes/séries/livros
- Fazer login/logout
- Carregar trailers

Os dados já carregados podem aparecer em cache, mas não há suporte offline formal.

---

## 🐛 Problemas Comuns

### CORS Error ao fazer login

**Problema:** Erro "Access-Control-Allow-Origin" no console

**Solução:**
- Verificar se backend está rodando (`http://localhost:3001`)
- Verificar CORS no `backend/src/server.js`
- Usar proxy no `cinerate-landing/vite.config.js`

```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
}
```

### Não consigo recuperar senha

**Verificar:**
- SMTP configurado corretamente em `.env`
- Email provider permite apps de terceiros
- Verificar pasta de spam
- Logs do backend para erros SMTP

### Filmes/livros não aparecem

**Soluções:**
1. Verificar se chaves de API estão corretas
2. Verificar limite de requisições atingido
3. Verificar console do navegador para erros
4. Testar API diretamente (curl/Postman)

### Banco de dados corrompido

**Solução:**
```bash
# Deletar banco e recriar
rm backend/data/database.sqlite
npm run dev  # Vai recriar o banco
```

---

## 🔐 Segurança

### Minha senha é segura?

✅ Sim! Usamos bcryptjs com 10 rounds de salt.

### Meus dados são privados?

✅ Sim! Dados de usuário são:
- Criptografados no banco
- Apenas acessíveis com seu JWT
- CORS protegido

### Como se proteger?

- Use senhas fortes (mínimo 8 caracteres)
- Não compartilhe seu JWT
- Limpe cache do navegador ao sair
- Use HTTPS em produção

---

## 🛠️ Desenvolvimento

### Posso contribuir?

✅ Sim! Veja [CONTRIBUTING.md](CONTRIBUTING.md)

### Como estruturo um novo componente?

```jsx
// src/components/MyComponent.jsx
const MyComponent = ({ title, onClick }) => {
  return <div onClick={onClick}>{title}</div>;
};

export default MyComponent;
```

### Como adiciono uma nova página?

1. Crie `src/pages/MyPage.jsx`
2. Adicione rota em `App.jsx`:
```jsx
<Route path="/my-page" element={<MyPage />} />
```
3. Linke na navbar (opcional)

### Como me conecto ao backend?

```javascript
// src/services/api.js já tem axios configurado
import api from './api';

// GET
const data = await api.get('/api/endpoint');

// POST
const result = await api.post('/api/endpoint', { data });
```

### Como depuro o backend?

```bash
cd backend
npm run dev  # Com --inspect para debugger
node --inspect src/server.js
# Abra chrome://inspect
```

---

## 📊 Performance

### Como otimizo as buscas?

- Debounce já está implementado (300ms)
- Cache em React.useMemo quando necessário
- Lazy load de imagens

### Como reduz o bundle size?

```bash
npm run build  # Gera relatório
# Verificar cinerate-landing/dist/
```

---

## 📱 Mobile

### HMDb funciona em mobile?

✅ Sim! Design 100% responsivo

### Como testo em mobile?

```bash
# Acessar do celular na mesma rede
ipconfig getifaddr en0  # Mac
hostname -I             # Linux
ipconfig                # Windows
```

---

## 🚀 Deploy

### Como faço deploy?

Veja [DEPLOYMENT.md](DEPLOYMENT.md) para guia completo.

### Onde colocar em produção?

**Frontend:** Netlify, Vercel, GitHub Pages
**Backend:** Heroku, Railway, Render, DigitalOcean

### Quanto custa?

- **Frontend:** Gratuito em Netlify/Vercel
- **Backend:** $7-15/mês em Railway/Render (tier pago)

---

## 📞 Suporte

### Encontrei um bug!

1. Verifique [Issues existentes](https://github.com/hieo0007/HMDb/issues)
2. Abra uma nova issue com detalhes

### Como reporto um bug?

Inclua:
- Navegador e versão
- Passos para reproduzir
- Comportamento esperado
- Screenshot/vídeo
- Erro de console

### Como sugiro uma feature?

Abra uma issue com label `enhancement` descrevendo:
- O que quer fazer
- Por quê é importante
- Possível implementação

---

## 📚 Recursos

- [React Docs](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Vite Docs](https://vitejs.dev)
- [SQLite Docs](https://www.sqlite.org/docs.html)

---

**Tem mais dúvidas? Abra uma issue com label `question`! 🎉**
