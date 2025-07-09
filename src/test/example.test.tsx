import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Componente simples para testar
function HelloWorld({ name = 'World' }: { name?: string }) {
  return <h1>Hello {name}!</h1>;
}

describe('HelloWorld Component', () => {
  it('should render hello world message', () => {
    render(<HelloWorld />);
    expect(screen.getByText('Hello World!')).toBeInTheDocument();
  });

  it('should render custom name', () => {
    render(<HelloWorld name="React" />);
    expect(screen.getByText('Hello React!')).toBeInTheDocument();
  });
}); 