# CHECKLIST DE DESENVOLVIMENTO - Gerador de Cartaz Procura-se

Antes de iniciar qualquer trabalho, revise este checklist que é **OBRIGATÓRIO** para qualquer tipo de desenvolvimento:

## 🕒 VERIFICAÇÃO DE DATA OBRIGATÓRIA (PRIMEIRO PASSO)
- [ ] Execute `date` no terminal e anote a data/hora atual
- [ ] Esta será a referência para TODOS os timestamps durante esta sessão
- [ ] Formato obrigatório: `YYYY-MM-DD HH:MM:00 UTC-3`

## 📋 PRÉ-REQUISITOS DO AMBIENTE

### Stack Tecnológico
- [ ] Node.js ativo e funcional (`node --version`)
- [ ] npm dependencies instaladas (`npm install` se necessário)
- [ ] Vite development server funcional (`npm run dev`)
- [ ] TypeScript configurado e funcionando (`npm run typecheck`)
- [ ] ESLint configurado com as regras do projeto (`npm run lint`)
- [ ] Vitest configurado e funcionando (`npm run test:run`)

### Verificação do Projeto
- [ ] Estrutura de pastas padrão mantida (`src/`, `tests/`, `docs/`, etc.)
- [ ] Arquivo `.env.example` como referência para configurações
- [ ] Task Master configurado e acessível
- [ ] Estrutura de tipos em `src/types/` criada
- [ ] Configuração de testes em `src/test/` configurada

## 🎯 WORKFLOW DE DESENVOLVIMENTO

### 1. Ao Trabalhar numa Sub-tarefa
- [ ] **Task Master MCP ativo** - Use as ferramentas Task Master via MCP
- [ ] **Analise a sub-tarefa**: Execute `get_task` para entender completamente o escopo
- [ ] **Branch Git**: Se primeira sub-tarefa da tarefa pai, crie branch com template:
  ```bash
  git checkout -b task/<task-number>-<task-name-em-inglês>
  ```
- [ ] **Status Management**: 
  - [ ] Marque sub-tarefa como `in-progress`
  - [ ] Marque tarefa pai como `in-progress` (se primeira sub-tarefa)
- [ ] **Dependências**: Verifique se todas as dependências da tarefa estão completas

### 2. Durante o Desenvolvimento

#### Verificações de Código
- [ ] **TypeScript Strict**: Código segue TypeScript strict mode
- [ ] **React Best Practices**: 
  - [ ] Componentes funcionais com hooks apropriados
  - [ ] Props tipadas com interfaces TypeScript
  - [ ] useState/useEffect utilizados corretamente
- [ ] **Estrutura de Arquivos**:
  - [ ] Componentes em `src/components/`
  - [ ] Hooks customizados em `src/hooks/`
  - [ ] Tipos em `src/types/`
  - [ ] Testes em `tests/` ou co-localizados (`src/test/`)
  - [ ] Configuração de testes em `src/test/setup.ts`

#### Padrões de Código Específicos
- [ ] **Naming Conventions**:
  - [ ] Componentes em PascalCase
  - [ ] Arquivos de componentes com extensão `.tsx`
  - [ ] Hooks com prefixo `use`
  - [ ] Interfaces com prefixo `I` quando aplicável
- [ ] **CSS/Styling**:
  - [ ] Classes CSS bem organizadas
  - [ ] Responsividade implementada
  - [ ] Acessibilidade básica (alt tags, aria-labels quando necessário)

### 3. Quality Assurance (QA) - OBRIGATÓRIO

#### Execução Sequencial de Ferramentas
```bash
npm run lint          # ESLint - correção automática quando possível
npm run typecheck     # TypeScript - zero erros permitidos
npm run build         # Build production - deve gerar sem erros
npm run test:run      # Vitest - todos os testes devem passar
```

- [ ] **ESLint**: Zero erros, warnings podem ser avaliados caso a caso
- [ ] **TypeScript**: Zero erros de tipagem
- [ ] **Build**: Build de produção executa sem erros
- [ ] **Testes**: 100% dos testes passando

#### Verificações Adicionais
- [ ] **Performance**: Build não deve aumentar significativamente o bundle size
- [ ] **Console**: Limpar console.log de desenvolvimento
- [ ] **Imports**: Remover imports não utilizados
- [ ] **Dead Code**: Remover código comentado ou não utilizado

### 4. Testes (Quando Aplicável)

#### React Testing Library + Vitest
- [ ] **Componentes**: Testes de renderização e interação
- [ ] **Hooks**: Testes de hooks customizados quando aplicável
- [ ] **Utilities**: Testes de funções utilitárias
- [ ] **Coverage**: Cobertura adequada das funcionalidades implementadas
- [ ] **Setup**: Arquivo `src/test/setup.ts` configurado com mocks básicos

#### Padrões de Teste
- [ ] Testes descritivos e bem organizados
- [ ] Setup/teardown apropriados
- [ ] Mocks utilizados quando necessário (matchMedia, ResizeObserver, etc.)
- [ ] Testes de integração quando aplicável
- [ ] Testes seguem padrão describe/it/expect

## ✅ CONCLUSÃO DA SUB-TAREFA

### Git Workflow
- [ ] **Staging**: `git add --all` (verificar se todos os arquivos relevantes estão incluídos)
- [ ] **Commit**: Seguir **Conventional Commits** em inglês
  ```
  feat: add user authentication
  fix: resolve shopping list state bug
  test: add tests for shopping list component
  docs: update API documentation
  refactor: improve component structure
  ```
- [ ] **Não incluir**: ID da task nem da sub task na mensagem de commit

### Verificação Final
- [ ] **QA Re-run**: Executar todas as ferramentas QA novamente
- [ ] **Task Master**: Marcar sub-tarefa como `done`
- [ ] **Progress Log**: Atualizar `docs/PROGRESS.md` com:
  - [ ] Timestamp correto (verificar `date` novamente)
  - [ ] Descrição do que foi implementado
  - [ ] Desafios encontrados e soluções
  - [ ] Links para commits relevantes

### 🔍 CHECKPOINT FINAL - PROGRESS.MD
- [ ] Executei `date` e tenho a data atual anotada?
- [ ] O timestamp corresponde à data atual do sistema?
- [ ] NÃO estou copiando data de entrada anterior?
- [ ] Formato correto: `YYYY-MM-DD HH:MM:00 UTC`?
- [ ] Descrição técnica adequada incluída?

## 🚀 WORKFLOW AVANÇADO

### Para Tarefas Complexas
- [ ] **Research**: Utilizar `research` tool do Task Master para informações atualizadas
- [ ] **Task Breakdown**: Considerar `expand_task` se tarefa for muito complexa
- [ ] **Dependencies**: Verificar e atualizar dependências entre tarefas

### Considerações de Performance
- [ ] **Bundle Analysis**: Verificar impacto no bundle quando aplicável
- [ ] **Lazy Loading**: Implementar quando apropriado
- [ ] **Otimizações**: Code splitting, tree shaking preservados

### Acessibilidade
- [ ] **ARIA**: Labels e roles quando necessário
- [ ] **Keyboard Navigation**: Funcionalidade acessível via teclado
- [ ] **Screen Readers**: Compatibilidade básica
- [ ] **Color Contrast**: Verificar contraste adequado

---

**📚 RECURSOS IMPORTANTES:**
- Task Master MCP para gerenciamento de tarefas
- Conventional Commits para padronização
- TypeScript strict mode para type safety
- Vitest + React Testing Library para testes
- ESLint para qualidade de código
- Vite para desenvolvimento e build

**🎯 COMANDOS DISPONÍVEIS:**
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run lint         # Verificação ESLint
npm run typecheck    # Verificação TypeScript
npm run test         # Testes em modo watch
npm run test:run     # Executar todos os testes
npm run test:ui      # Interface visual dos testes
npm run preview      # Preview do build
```

**⚡ LEMBRE-SE:**
- Sempre executar QA antes de marcar como done
- Commits pequenos e frequentes são melhores
- Documentar decisões importantes no PROGRESS.md
- Usar Task Master para tracking completo do progresso
- Executar `npm run test:run` para validar testes
- Usar `npm run typecheck` para verificar tipos