# Tests

Este diretório contém testes específicos do projeto.

## Estrutura

- `tests/` - Testes específicos e complexos
- `src/test/` - Configuração e utilitários de teste
- `*.test.tsx` - Testes co-localizados junto aos componentes

## Configuração

### Vitest + React Testing Library

O projeto está configurado com:
- **Vitest**: Framework de testes moderno
- **React Testing Library**: Para testes de componentes React
- **jsdom**: Ambiente de DOM simulado
- **@testing-library/jest-dom**: Matchers customizados

### Comandos Disponíveis

```bash
# Executar todos os testes uma vez
npm run test:run

# Executar testes em modo watch
npm run test

# Interface visual dos testes
npm run test:ui
```

### Exemplo de Teste

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent title="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Mocks Disponíveis

O arquivo `src/test/setup.ts` inclui mocks para:
- `matchMedia`
- `ResizeObserver`
- `scrollIntoView`

## Boas Práticas

1. Use `describe` para agrupar testes relacionados
2. Use `it` para casos de teste individuais
3. Use `screen.getByRole` sempre que possível
4. Teste comportamento, não implementação
5. Mantenha testes simples e focados 