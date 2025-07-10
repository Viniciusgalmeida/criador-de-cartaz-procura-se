import { useState, useCallback, useMemo } from 'react';
import { 
  FormData, 
  FormValidationState, 
  FieldValidation, 
  ValidationResult 
} from '../types';
import { 
  validateField, 
  validateForm, 
  clearFieldError, 
  isFormValid,
  validateFieldAsync 
} from '../lib/validation';

interface UseFormValidationOptions {
  initialData?: Partial<FormData>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useFormValidation(options: UseFormValidationOptions = {}) {
  const {
    initialData = {},
    validateOnChange = true,
    validateOnBlur = true,
  } = options;

  // Estado de validação para todos os campos
  const [validationState, setValidationState] = useState<FormValidationState>({});
  
  // Estado para validações assíncronas em progresso
  const [asyncValidations, setAsyncValidations] = useState<Record<string, boolean>>({});

  // Validar um campo específico
  const handleValidateField = useCallback((fieldName: string, value: unknown): FieldValidation => {
    const validation = validateField(fieldName, value);
    
    setValidationState(prev => ({
      ...prev,
      [fieldName]: validation,
    }));

    return validation;
  }, []);

  // Validar um campo de forma assíncrona
  const handleValidateFieldAsync = useCallback(async (
    fieldName: string, 
    value: unknown,
    apiValidator?: (value: unknown) => Promise<boolean>
  ) => {
    // Marcar como validando
    setAsyncValidations(prev => ({ ...prev, [fieldName]: true }));

    try {
      const result = await validateFieldAsync(fieldName, value, apiValidator);
      
      setValidationState(prev => ({
        ...prev,
        [fieldName]: {
          isValid: result.isValid,
          errorMessage: result.errorMessage,
          isDirty: true,
        },
      }));

      return result;
    } finally {
      // Remover estado de validação
      setAsyncValidations(prev => {
        const newState = { ...prev };
        delete newState[fieldName];
        return newState;
      });
    }
  }, []);

  // Validar todo o formulário
  const handleValidateForm = useCallback((formData: FormData): ValidationResult => {
    const result = validateForm(formData);
    setValidationState(result.errors);
    return result;
  }, []);

  // Limpar erro de um campo específico
  const handleClearFieldError = useCallback((fieldName: string) => {
    setValidationState(prev => clearFieldError(prev, fieldName));
  }, []);

  // Limpar todos os erros
  const clearAllErrors = useCallback(() => {
    setValidationState({});
  }, []);

  // Resetar estado de validação
  const resetValidation = useCallback(() => {
    setValidationState({});
    setAsyncValidations({});
  }, []);

  // Verificar se um campo específico é válido
  const isFieldValid = useCallback((fieldName: string): boolean => {
    const fieldValidation = validationState[fieldName];
    return fieldValidation ? fieldValidation.isValid : true;
  }, [validationState]);

  // Verificar se um campo tem erro
  const hasFieldError = useCallback((fieldName: string): boolean => {
    const fieldValidation = validationState[fieldName];
    return fieldValidation ? !fieldValidation.isValid && fieldValidation.isDirty : false;
  }, [validationState]);

  // Obter mensagem de erro de um campo
  const getFieldError = useCallback((fieldName: string): string | undefined => {
    const fieldValidation = validationState[fieldName];
    return fieldValidation?.isDirty && !fieldValidation.isValid 
      ? fieldValidation.errorMessage 
      : undefined;
  }, [validationState]);

  // Verificar se um campo está sendo validado assincronamente
  const isFieldValidating = useCallback((fieldName: string): boolean => {
    return asyncValidations[fieldName] || false;
  }, [asyncValidations]);

  // Computar se o formulário inteiro é válido
  const formIsValid = useMemo(() => {
    return isFormValid(validationState);
  }, [validationState]);

  // Contar número de erros
  const errorCount = useMemo(() => {
    return Object.values(validationState).filter(field => !field.isValid && field.isDirty).length;
  }, [validationState]);

  // Handler para onChange com validação opcional
  const createFieldChangeHandler = useCallback((
    fieldName: string,
    onChange: (value: unknown) => void,
    validate: boolean = validateOnChange
  ) => {
    return (value: unknown) => {
      onChange(value);
      if (validate) {
        handleValidateField(fieldName, value);
      }
    };
  }, [handleValidateField, validateOnChange]);

  // Handler para onBlur com validação opcional
  const createFieldBlurHandler = useCallback((
    fieldName: string,
    value: unknown,
    validate: boolean = validateOnBlur
  ) => {
    return () => {
      if (validate) {
        handleValidateField(fieldName, value);
      }
    };
  }, [handleValidateField, validateOnBlur]);

  // Obter todas as props necessárias para um campo
  const getFieldProps = useCallback((
    fieldName: string,
    value: unknown,
    onChange: (value: unknown) => void,
    options: {
      validateOnChange?: boolean;
      validateOnBlur?: boolean;
      asyncValidator?: (value: unknown) => Promise<boolean>;
    } = {}
  ) => {
    const {
      validateOnChange: fieldValidateOnChange = validateOnChange,
      validateOnBlur: fieldValidateOnBlur = validateOnBlur,
      asyncValidator,
    } = options;

    return {
      value,
      onChange: createFieldChangeHandler(fieldName, onChange, fieldValidateOnChange),
      onBlur: createFieldBlurHandler(fieldName, value, fieldValidateOnBlur),
      isValid: isFieldValid(fieldName),
      hasError: hasFieldError(fieldName),
      errorMessage: getFieldError(fieldName),
      isValidating: isFieldValidating(fieldName),
      // Função para validação assíncrona manual
      validateAsync: asyncValidator 
        ? () => handleValidateFieldAsync(fieldName, value, asyncValidator)
        : undefined,
    };
  }, [
    validateOnChange,
    validateOnBlur,
    createFieldChangeHandler,
    createFieldBlurHandler,
    isFieldValid,
    hasFieldError,
    getFieldError,
    isFieldValidating,
    handleValidateFieldAsync,
  ]);

  return {
    // Estado
    validationState,
    isFormValid: formIsValid,
    errorCount,

    // Funções de validação
    validateField: handleValidateField,
    validateFieldAsync: handleValidateFieldAsync,
    validateForm: handleValidateForm,

    // Funções de limpeza
    clearFieldError: handleClearFieldError,
    clearAllErrors,
    resetValidation,

    // Funções de verificação
    isFieldValid,
    hasFieldError,
    getFieldError,
    isFieldValidating,

    // Helpers para criação de handlers
    createFieldChangeHandler,
    createFieldBlurHandler,
    getFieldProps,
  };
} 