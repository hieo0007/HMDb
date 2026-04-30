# Roadmap & TO-DO

## 🎯 Visão Geral

Este documento descreve os planos futuros para o HMDb.

## 🚀 Próximas Versões

### v1.1.0 - Melhorias de UX
**Estimativa:** 4-6 semanas

- [ ] Sistema de avaliações e comentários
- [ ] Favoritos/Watchlist
- [ ] Compartilhamento social
- [ ] Notificações de novo conteúdo
- [ ] Dark mode toggle (já tem CSS, precisa state)
- [ ] Filtros avançados no catálogo

### v1.2.0 - Recomendações
**Estimativa:** 6-8 semanas

- [ ] Algoritmo de recomendações baseado em histórico
- [ ] Gêneros e tags
- [ ] Trend do dia/semana
- [ ] Personalizações por preferência
- [ ] Top rated/mais populares

### v2.0.0 - Arquitetura
**Estimativa:** 8-12 semanas

- [ ] Migração para TypeScript (front + back)
- [ ] Redux para gerenciamento de estado
- [ ] Testes automatizados (Vitest + Jest)
- [ ] PostgreSQL em vez de SQLite
- [ ] Redis para cache
- [ ] Docker containerization

### v2.1.0 - Backend Robusto
**Estimativa:** 6-8 semanas

- [ ] Rate limiting
- [ ] Autenticação social (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] Admin panel
- [ ] Analytics dashboard
- [ ] Backup automático

### v3.0.0 - Escalabilidade
**Estimativa:** 12-16 semanas

- [ ] Microserviços
- [ ] Message queue (RabbitMQ/Bull)
- [ ] Kubernetes deployment
- [ ] API GraphQL
- [ ] Mobile app (React Native)
- [ ] Service workers (offline mode)

## 🔧 TODO por Prioridade

### 🔴 Alta Prioridade (This Sprint)

- [ ] Melhorar tratamento de erros em APIs externas
- [ ] Adicionar validação de email
- [ ] Melhorar performance de busca
- [ ] Adicionar rate limiting no backend
- [ ] Tests básicos (Jest)

### 🟡 Média Prioridade (Next Sprint)

- [ ] Sistema de favoritos
- [ ] Melhorar mobile responsiveness
- [ ] Adicionar PWA capabilities
- [ ] Implementar caching estratégico
- [ ] Criar admin panel básico

### 🟢 Baixa Prioridade (Backlog)

- [ ] Otimizações de performance
- [ ] Análise de dados/analytics
- [ ] Suporte a múltiplos idiomas (i18n)
- [ ] Temas personalizáveis
- [ ] Integração com outros serviços

## 🐛 Known Issues

### Frontend
- [ ] Trailer não carrega em alguns casos (TMDB)
- [ ] Busca lenta em conexão lenta
- [ ] Mobile menu não fecha ao navegar

### Backend
- [ ] SQLite limit ~10k registros por performance
- [ ] Sem retry automático para APIs externas
- [ ] Sem cache de API responses

## ✅ Completed

- ✅ Autenticação com JWT
- ✅ Histórico de visualizações
- ✅ Integração TMDB
- ✅ Integração Google Books
- ✅ Design responsivo
- ✅ Reset de senha
- ✅ Newsletter signup

## 📊 Métricas de Sucesso

- [ ] 1000+ usuários ativos
- [ ] 100ms avg response time
- [ ] 95%+ uptime
- [ ] 90+ Lighthouse score
- [ ] <1% erro rate

## 🤝 Contribuições Bem-Vindas

Quer trabalhar em algo? Veja [CONTRIBUTING.md](CONTRIBUTING.md)!

**Para escolher uma tarefa:**
1. Procure uma issue em [GitHub](https://github.com/hieo0007/HMDb/issues)
2. Comente "Taking it!" para avisar
3. Crie uma branch e abra um PR

---

**Última atualização:** 2026-04-24
