# CI/CD Pipeline Setup

Este documento descreve o pipeline de Integração Contínua e Deploy Contínuo implementado para o projeto **Criador de Cartaz Procura-se**.

## 📋 Visão Geral

O pipeline foi configurado usando **GitHub Actions** e inclui:

- ✅ Testes automatizados
- ✅ Verificação de qualidade de código (ESLint + TypeScript)
- ✅ Build para diferentes ambientes
- ✅ Deploy automático para staging e produção
- ✅ Análise de segurança e dependências
- ✅ Monitoramento de performance

## 🔄 Workflows Implementados

### 1. CI/CD Principal (`.github/workflows/ci.yml`)

**Triggers:**
- Push para `main` e `develop`
- Pull Requests para `main` e `develop`
- Releases publicados

**Jobs:**

#### `test` - Verificação de Qualidade
- ✅ TypeScript check (`npm run typecheck`)
- ✅ ESLint (`npm run lint`)
- ✅ Testes unitários (`npm run test:run`)

#### `build` - Build Multi-ambiente
- ✅ Build para desenvolvimento (`npm run build:dev`)
- ✅ Build para produção (`npm run build`)
- ✅ Upload de artefatos

#### `deploy-staging` - Deploy Automático para Staging
- **Trigger:** Pull Request para `main`
- **Target:** https://staging.criador-de-cartaz-procura-se.vercel.app
- **Build:** Desenvolvimento

#### `deploy-production` - Deploy Automático para Produção
- **Trigger:** Release publicado
- **Target:** https://criador-de-cartaz-procura-se.vercel.app
- **Build:** Produção

### 2. Segurança (`.github/workflows/security.yml`)

**Triggers:**
- Push para `main` e `develop`
- Pull Requests para `main`
- Agenda semanal (segundas-feiras às 9h UTC)

**Jobs:**
- ✅ Auditoria de segurança (`npm audit`)
- ✅ Verificação de dependências desatualizadas
- ✅ Review de dependências em PRs

### 3. Performance (`.github/workflows/performance.yml`)

**Triggers:**
- Pull Requests para `main`
- Push para `main`

**Jobs:**
- ✅ Análise de tamanho do bundle
- ✅ Auditoria Lighthouse
- ✅ Métricas de performance

## 🚀 Deploy Strategy

### Staging Environment
- **Quando:** Automaticamente em PRs para `main`
- **Ambiente:** Desenvolvimento
- **URL:** https://staging.criador-de-cartaz-procura-se.vercel.app
- **Propósito:** Testes e validação antes da produção

### Production Environment
- **Quando:** Release tag publicado
- **Ambiente:** Produção otimizada
- **URL:** https://criador-de-cartaz-procura-se.vercel.app
- **Propósito:** Versão final para usuários

## 🔧 Configuração Necessária

### Secrets do GitHub (Repository Settings > Secrets)

```bash
VERCEL_TOKEN=<seu_token_vercel>
VERCEL_ORG_ID=<seu_org_id>
VERCEL_PROJECT_ID=<seu_project_id>
```

### Variáveis de Ambiente

Ver arquivo `src/types/env.d.ts` para variáveis suportadas:

```typescript
VITE_APP_NAME=Criador de Cartaz Procura-se
VITE_APP_VERSION=0.0.0
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.exemplo.com
```

## 📊 Métricas e Monitoramento

### Bundle Size Limits
- ⚠️ Warning: Arquivos JS > 1MB
- 📊 Relatório automático em PRs

### Lighthouse Scores (Mínimos)
- **Performance:** 80%
- **Accessibility:** 90%
- **Best Practices:** 85%
- **SEO:** 80%

### Security Audits
- 🔒 Audit level: `moderate`
- 📅 Verificação semanal automática
- 🚨 Falha em vulnerabilidades críticas

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build:dev    # Build de desenvolvimento

# Produção
npm run build        # Build de produção
npm run preview      # Preview do build

# Qualidade
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run test         # Testes (watch mode)
npm run test:run     # Todos os testes (CI)
npm run test:ui      # Interface visual de testes
```

## 🎯 Workflow de Development

1. **Feature Development:**
   ```bash
   git checkout -b feature/nova-funcionalidade
   # Desenvolver...
   git push origin feature/nova-funcionalidade
   ```

2. **Pull Request:**
   - CI executa automaticamente
   - Deploy para staging se PR for para `main`
   - Review e merge

3. **Release:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   # GitHub Release automático
   ```

4. **Deploy Produção:**
   - Automático ao publicar release
   - Build otimizado
   - Deploy para produção

## 🔍 Troubleshooting

### Build Failing
1. Verificar `npm run typecheck`
2. Verificar `npm run lint`
3. Verificar `npm run test:run`

### Deploy Failing
1. Verificar secrets do Vercel
2. Verificar configuração `vercel.json`
3. Verificar logs do GitHub Actions

### Performance Issues
1. Verificar relatório de bundle size
2. Analisar Lighthouse report
3. Otimizar imports e code splitting

---

**✅ CI/CD Pipeline configurado com sucesso!** 