# Política de Segurança

## 🔒 Divulgação Responsável

Se você descobrir uma vulnerabilidade de segurança no HMDb, **não abra uma issue pública**. Em vez disso:

1. Envie um email para [seu-email@example.com] com detalhes da vulnerabilidade
2. Inclua instruções para reproduzir (se possível)
3. Aguarde uma resposta em até 48 horas

Após confirmar e corrigir a vulnerabilidade, você receberá crédito apropriado.

## 🛡️ Práticas de Segurança Implementadas

### Autenticação & Autorização
- ✅ Senhas criptografadas com bcryptjs (10 rounds)
- ✅ JWT com expiração configurável
- ✅ Tokens de reset de senha com expiração
- ✅ Proteção CORS habilitada

### Proteção de Dados
- ✅ HTTPS recomendado em produção
- ✅ Validação de entrada em frontend e backend
- ✅ Prepared statements no SQLite
- ✅ Variáveis de ambiente para dados sensíveis

### Integrações Externas
- ✅ Validação de URLs de API
- ✅ Tratamento seguro de respostas
- ✅ Timeout em requisições HTTP

## 🔐 Configuração Segura

### Variáveis de Ambiente Críticas

```env
# Backend
JWT_SECRET=use_uma_string_muito_longa_e_aleatoria_aqui
NODE_ENV=production

# Frontend
VITE_API_BASE_URL=https://seu-dominio.com  # Sempre HTTPS
```

### Recomendações

- 🔑 Nunca commithe `.env` ou chaves de API
- 🔒 Use `.env.example` como template
- 📝 Rotacione JWT_SECRET regularmente
- 🔐 Use HTTPS em produção
- 🛡️ Implemente rate limiting em endpoints críticos

## ⚠️ Vulnerabilidades Conhecidas

Nenhuma no momento. Será atualizado conforme descoberto.

## 📚 Recursos de Segurança

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security](https://react.dev/learn#security)

## 🔄 Atualizações de Segurança

Mantenha dependências atualizadas:

```bash
npm audit              # Verificar vulnerabilidades
npm audit fix          # Corrigir automaticamente
npm update            # Atualizar dependências
```

---

**Obrigado por ajudar a manter o HMDb seguro! 🙏**
