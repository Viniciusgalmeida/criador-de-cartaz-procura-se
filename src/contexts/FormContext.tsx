import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { FormData, FormContextType, CustomField, RewardInfo } from '../types';
import { 
  saveFormData, 
  loadFormData, 
  clearFormData, 
  isLocalStorageAvailable 
} from '../lib/localStorage';

// Estado inicial padrão do formulário
const defaultFormData: FormData = {
  petName: '',
  ownerName: '',
  contactPhone: '',
  lastSeenLocation: '',
  lastSeenDateTime: '',
  petDescription: '',
  accessories: '',
  reward: undefined,
  photos: [],
  customFields: []
};

// Context principal
const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider component
export const FormProvider = ({ children }: { children: ReactNode }) => {
  // Estados principais
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState<number>(0);

  // Configurações para retry mechanism
  const MAX_RETRY_ATTEMPTS = 3;
  const RETRY_DELAY = 1000; // 1 segundo

  // Função para limpar erros
  const clearError = useCallback(() => {
    setHasError(false);
    setErrorMessage('');
    setRetryCount(0);
  }, []);

  // Função para lidar com erros de localStorage
  const handleStorageError = useCallback((operation: string, error: unknown) => {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`LocalStorage ${operation} failed:`, error);
    
    setHasError(true);
    setErrorMessage(`Failed to ${operation} form data: ${errorMsg}`);
  }, []);

  // Função para carregar dados do localStorage com retry
  const loadDataWithRetry = useCallback(async (attempt: number = 1): Promise<void> => {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn('LocalStorage not available, using default form data');
        setIsLoading(false);
        return;
      }

      const loadedData = loadFormData(defaultFormData);
      setFormData(loadedData);
      setIsLoading(false);
      clearError();
      
      console.debug('Form data loaded successfully from localStorage');
    } catch (error) {
      if (attempt < MAX_RETRY_ATTEMPTS) {
        console.warn(`Load attempt ${attempt} failed, retrying in ${RETRY_DELAY}ms...`);
        setTimeout(() => {
          loadDataWithRetry(attempt + 1);
        }, RETRY_DELAY);
        setRetryCount(attempt);
      } else {
        handleStorageError('load', error);
        setIsLoading(false);
      }
    }
  }, [clearError, handleStorageError]);

  // Função para retry operation
  const retryOperation = useCallback(() => {
    if (isLoading) return;
    
    setIsLoading(true);
    clearError();
    loadDataWithRetry(1);
  }, [isLoading, clearError, loadDataWithRetry]);

  // Função para salvar dados com error handling
  const saveDataSafely = useCallback((data: FormData) => {
    try {
      if (isLocalStorageAvailable()) {
        saveFormData(data);
      }
    } catch (error) {
      handleStorageError('save', error);
    }
  }, [handleStorageError]);

  // Carregar dados iniciais do localStorage
  useEffect(() => {
    loadDataWithRetry();
  }, [loadDataWithRetry]);

  // Salvar automaticamente quando formData muda (exceto carregamento inicial)
  useEffect(() => {
    if (!isLoading && formData !== defaultFormData) {
      saveDataSafely(formData);
    }
  }, [formData, isLoading, saveDataSafely]);

  // Função para atualizar dados do formulário (memoizada para performance)
  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData(prevData => ({
      ...prevData,
      ...data
    }));
  }, []);

  // Função para adicionar foto (memoizada)
  const addPhoto = useCallback((photo: string) => {
    setFormData(prevData => ({
      ...prevData,
      photos: [...prevData.photos, photo]
    }));
  }, []);

  // Função para remover foto por índice (memoizada)
  const removePhoto = useCallback((index: number) => {
    setFormData(prevData => ({
      ...prevData,
      photos: prevData.photos.filter((_, i) => i !== index)
    }));
  }, []);

  // Função para adicionar campo personalizado (memoizada)
  const addCustomField = useCallback(() => {
    const newField: CustomField = { label: '', value: '' };
    setFormData(prevData => ({
      ...prevData,
      customFields: [...prevData.customFields, newField]
    }));
  }, []);

  // Função para atualizar campo personalizado (memoizada)
  const updateCustomField = useCallback((index: number, field: CustomField) => {
    setFormData(prevData => ({
      ...prevData,
      customFields: prevData.customFields.map((existingField, i) => 
        i === index ? field : existingField
      )
    }));
  }, []);

  // Função para remover campo personalizado (memoizada)
  const removeCustomField = useCallback((index: number) => {
    setFormData(prevData => ({
      ...prevData,
      customFields: prevData.customFields.filter((_, i) => i !== index)
    }));
  }, []);

  // Função para resetar formulário (memoizada) - agora também limpa localStorage
  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    try {
      if (isLocalStorageAvailable()) {
        clearFormData();
      }
    } catch (error) {
      handleStorageError('clear', error);
    }
  }, [handleStorageError]);

  // Valor do contexto (memoizado para evitar re-renders desnecessários)
  const contextValue = React.useMemo(() => ({
    formData,
    updateFormData,
    addPhoto,
    removePhoto,
    addCustomField,
    updateCustomField,
    removeCustomField,
    resetForm,
    isLoading,
    hasError,
    errorMessage,
    retryOperation,
    clearError
  }), [
    formData,
    updateFormData,
    addPhoto,
    removePhoto,
    addCustomField,
    updateCustomField,
    removeCustomField,
    resetForm,
    isLoading,
    hasError,
    errorMessage,
    retryOperation,
    clearError
  ]);

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

// Hook customizado para consumir o contexto
export const useFormData = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormData must be used within a FormProvider');
  }
  return context;
};

// Export para compatibilidade
export default FormContext; 