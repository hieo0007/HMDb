# Convenção de Commits

Este projeto segue [Conventional Commits](https://www.conventionalcommits.org/pt-br) para uma história de commits clara e legível.

## Formato

```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé(s) opcional(is)]
```

## Tipos de Commit

### ✨ `feat` - Feature Nova
```bash
git commit -m "feat(auth): adicionar autenticação social com Google"
```

### 🐛 `fix` - Correção de Bug
```bash
git commit -m "fix(search): corrigir debounce que não funcionava"
```

### 📚 `docs` - Documentação
```bash
git commit -m "docs: atualizar README com instruções de deploy"
```

### 🎨 `style` - Estilização (sem lógica)
```bash
git commit -m "style(navbar): ajustar padding e cores"
```

### ♻️ `refactor` - Refatoração de Código
```bash
git commit -m "refactor(api): simplificar tratamento de erros"
```

### ⚡ `perf` - Performance
```bash
git commit -m "perf(search): otimizar debounce de busca"
```

### ✅ `test` - Testes
```bash
git commit -m "test(auth): adicionar testes de login"
```

### 🔧 `chore` - Dependências, Build, etc
```bash
git commit -m "chore: atualizar dependências"
```

### 🚀 `ci` - Integração Contínua
```bash
git commit -m "ci: adicionar GitHub Actions para lint"
```

## Escopo

O escopo deve especificar qual parte do projeto:

- `frontend` ou `cinerate-landing`
- `backend`
- `auth` - autenticação
- `search` - busca
- `history` - histórico
- `ui` - interface
- `api` - APIs externas
- `db` - banco de dados

## Descrição

- Use imperativo: "adicionar" em vez de "adicionado"
- Não capitalize primeira letra
- Sem ponto no final
- Máximo 50 caracteres
- Em português

## Exemplos

### Bom ✅
```bash
git commit -m "feat(auth): implementar recuperação de senha"
git commit -m "fix(search): corrigir busca com caracteres especiais"
git commit -m "docs(readme): adicionar instruções de instalação"
git commit -m "refactor(api): melhorar tratamento de erros"
```

### Ruim ❌
```bash
git commit -m "update"
git commit -m "Fixed bug in auth module"
git commit -m "feat: add many things"
git commit -m "chore(backend): Atualizar dependências."
```

## Corpo (Opcional)

Para mudanças complexas, inclua explicação no corpo:

```bash
git commit -m "fix(search): corrigir debounce em busca lenta

O debounce não estava funcionando corretamente quando
o usuário fazia buscas rápidas consecutivas. Aumentei
o delay de 100ms para 300ms e adicionei teste de timeout."
```

## Rodapé (Opcional)

Para referenciar issues:

```bash
git commit -m "fix(auth): corrigir login com email

Fixes #42"
```

Ou:

```bash
git commit -m "feat(notifications): adicionar alertas

Closes #15
Fixes #20"
```

## Break Changes

Se sua mudança quebra a API:

```bash
git commit -m "refactor(api)!: remover endpoint /api/old

BREAKING CHANGE: endpoint /api/old foi removido.
Use /api/new em seu lugar."
```

## Dicas

- Commit frequentemente (lógica separada)
- Rebase antes de PR
- Squash commits pequenos relacionados
- Escreva como se estivesse instruindo alguém

---

**Dúvidas? Veja [Conventional Commits](https://www.conventionalcommits.org/) oficial.**
