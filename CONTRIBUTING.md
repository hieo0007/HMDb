# Guia de Contribuição

Obrigado por ter interesse em contribuir para o HMDb! Este documento fornece diretrizes e instruções para contribuir.

## 📋 Código de Conduta

Todos os contribuintes devem seguir nosso código de conduta baseado em respeito mútuo e inclusão.

## 🐛 Reportando Bugs

Antes de criar um relatório de bug, verifique a lista de issues pois você pode descobrir que o bug já foi relatado.

**Como enviar um bom relatório de bug:**

- **Título descritivo** que resume o problema
- **Descrição clara** do comportamento observado
- **Exemplo específico** para demonstrar os passos
- **Comportamento observado** e o que você esperava
- **Screenshots/vídeos** se aplicável
- **Seu ambiente**: OS, navegador, versões

## ✨ Sugerindo Melhorias

Sugestões de melhoria são bem-vindas! Ao criar uma sugestão:

- **Descrição clara** da melhoria
- **Exemplos concretos** de como seria utilizado
- **Por que** isso seria útil
- **Possível implementação** (opcional)

## 🔧 Pull Requests

**Processo:**

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

**Padrões de Código:**

- Siga o ESLint do projeto
- Escreva código limpo e legível
- Adicione comentários para lógica complexa
- Use nomes descritivos para variáveis e funções

**Commits:**

- Use mensagens claras em inglês ou português
- Separe concerns em commits diferentes
- Rebase antes de fazer push

## 📚 Estilo de Código

### Frontend (React)

```javascript
// ✅ Bom
const MyComponent = ({ title, onClick }) => {
  const [state, setState] = useState(false);
  
  const handleClick = () => {
    setState(!state);
    onClick();
  };
  
  return <button onClick={handleClick}>{title}</button>;
};

export default MyComponent;
```

### Backend (Node.js)

```javascript
// ✅ Bom
const createUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return userStore.create({ email, password: hashedPassword });
};
```

## 📝 Documentação

- Mantenha o README atualizado
- Documente funções complexas
- Adicione exemplos de uso quando aplicável

## 🧪 Testes

Apesar de não haver testes automatizados ainda, teste manualmente:

- Testar em múltiplos navegadores
- Testar responsividade
- Verificar console de erros
- Testar autenticação e segurança

## ⚡ Performance

Ao contribuir, considere:

- Otimizar bundle size
- Minimizar re-renders desnecessários
- Usar debounce/throttle quando apropriado
- Implementar lazy loading

## 🚀 Publicação de Versões

(A ser definido conforme o projeto cresce)

## 📞 Questões?

Sinta-se livre para abrir uma issue com a label `question`.

---

**Obrigado por contribuir para o HMDb! 🎉**
