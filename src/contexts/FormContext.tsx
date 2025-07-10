import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FormData, FormContextType, CustomField, RewardInfo } from '../types';

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
  // Estado principal usando useState
  const [formData, setFormData] = useState<FormData>(defaultFormData);

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

  // Função para resetar formulário (memoizada)
  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
  }, []);

  // Valor do contexto (memoizado para evitar re-renders desnecessários)
  const contextValue = React.useMemo(() => ({
    formData,
    updateFormData,
    addPhoto,
    removePhoto,
    addCustomField,
    updateCustomField,
    removeCustomField,
    resetForm
  }), [
    formData,
    updateFormData,
    addPhoto,
    removePhoto,
    addCustomField,
    updateCustomField,
    removeCustomField,
    resetForm
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