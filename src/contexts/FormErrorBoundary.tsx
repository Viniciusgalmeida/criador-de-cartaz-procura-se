import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary específico para o FormContext
 * Captura erros relacionados ao localStorage e outros problemas de persistência
 */
export class FormErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Atualiza o state para mostrar a UI de erro
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log do erro para debugging
    console.error('FormContext Error Boundary caught an error:', error, errorInfo);
    
    // Atualiza state com informações detalhadas do erro
    this.setState({
      error,
      errorInfo
    });

    // Se for erro relacionado ao localStorage, tenta limpar dados corrompidos
    if (this.isLocalStorageError(error)) {
      this.handleLocalStorageError();
    }
  }

  private isLocalStorageError(error: Error): boolean {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';
    
    // Verifica se é erro relacionado ao localStorage
    return (
      message.includes('localstorage') ||
      message.includes('quota') ||
      message.includes('storage') ||
      stack.includes('localstorage') ||
      error.name === 'QuotaExceededError' ||
      error.name === 'SecurityError'
    );
  }

  private handleLocalStorageError() {
    try {
      // Tenta limpar dados corrompidos do localStorage
      const formDataKey = 'petPosterFormData';
      
      if (typeof Storage !== 'undefined' && localStorage) {
        localStorage.removeItem(formDataKey);
        console.info('Cleared corrupted localStorage data due to error');
      }
    } catch (cleanupError) {
      console.error('Failed to cleanup localStorage after error:', cleanupError);
    }
  }

  private handleRetry = () => {
    // Reset do error boundary
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleClearData = () => {
    try {
      // Limpa completamente os dados e reinicia
      if (typeof Storage !== 'undefined' && localStorage) {
        localStorage.clear();
        console.info('Cleared all localStorage data');
      }
      
      // Reset do error boundary
      this.handleRetry();
      
      // Recarrega a página para reiniciar completamente
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  };

  render() {
    if (this.state.hasError) {
      // UI customizada de erro ou fallback do props
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI padrão de erro do FormContext
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="mx-auto max-w-md rounded-lg border border-destructive/20 bg-card p-6 shadow-lg">
            <div className="flex items-center space-x-2 text-destructive">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h2 className="text-lg font-semibold">Erro no Formulário</h2>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Ocorreu um problema ao carregar ou salvar os dados do formulário. 
                Isso pode ser devido a problemas de armazenamento local.
              </p>
              
              {this.state.error && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                    Detalhes técnicos
                  </summary>
                  <pre className="mt-2 max-h-32 overflow-auto rounded bg-muted p-2 text-xs">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>

            <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <button
                onClick={this.handleRetry}
                className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Tentar Novamente
              </button>
              
              <button
                onClick={this.handleClearData}
                className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Limpar Dados
              </button>
            </div>
            
            <p className="mt-4 text-xs text-muted-foreground">
              Se o problema persistir, tente usar o navegador em modo privado ou 
              limpar os dados de navegação.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default FormErrorBoundary; 