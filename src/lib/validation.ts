import { FormData, ValidationConfig, FieldValidation, ValidationResult, FormValidationState } from '../types';

// Mensagens de erro em português
export const ERROR_MESSAGES = {
  required: 'Este campo é obrigatório',
  email: 'Digite um email válido',
  phone: 'Digite um telefone válido (ex: (11) 99999-9999)',
  minLength: (min: number) => `Digite pelo menos ${min} caracteres`,
  maxLength: (max: number) => `Digite no máximo ${max} caracteres`,
  pattern: 'Formato inválido',
  photos: 'Adicione pelo menos uma foto do pet',
  reward: 'Digite um valor válido para a recompensa',
  datetime: 'Digite uma data e hora válidas',
} as const;

// Expressões regulares para validação
const PATTERNS = {
  // Telefone brasileiro (com ou sem DDD, com ou sem formatação)
  phone: /^(?:\+55\s?)?(?:\(?[1-9]{2}\)?\s?)?(?:9\s?)?[0-9]{4}[-\s]?[0-9]{4}$/,
  // Email básico
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // Data no formato ISO ou brasileiro
  datetime: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}|\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}$/,
} as const;

// Validadores individuais
export const validators = {
  required: (value: unknown): boolean => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return !isNaN(value);
    return value != null && value !== undefined;
  },

  email: (value: string): boolean => {
    if (!value) return true; // Email é opcional
    return PATTERNS.email.test(value.trim());
  },

  phone: (value: string): boolean => {
    if (!value) return false; // Telefone é obrigatório
    return PATTERNS.phone.test(value.replace(/\s/g, ''));
  },

  minLength: (value: string, min: number): boolean => {
    if (!value) return true; // Se não tem valor, deixa outro validador lidar
    return value.trim().length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    if (!value) return true;
    return value.trim().length <= max;
  },

  pattern: (value: string, pattern: RegExp): boolean => {
    if (!value) return true;
    return pattern.test(value);
  },

  photos: (photos: string[]): boolean => {
    return Array.isArray(photos) && photos.length > 0;
  },

  reward: (reward: unknown): boolean => {
    if (!reward) return true; // Recompensa é opcional
    if (typeof reward !== 'object' || reward === null) return false;
    const rewardObj = reward as Record<string, unknown>;
    return (
      typeof rewardObj.amount === 'number' &&
      rewardObj.amount > 0 &&
      ['BRL', 'USD'].includes(rewardObj.currency as string)
    );
  },

  datetime: (value: string): boolean => {
    if (!value) return true; // Data é opcional
    return PATTERNS.datetime.test(value) && !isNaN(Date.parse(value));
  },
};

// Regras de validação para cada campo do formulário
export const FORM_VALIDATION_RULES: Record<keyof FormData, ValidationConfig[]> = {
  petName: [
    { rule: 'required', message: ERROR_MESSAGES.required },
    { rule: 'minLength', value: 2, message: ERROR_MESSAGES.minLength(2) },
    { rule: 'maxLength', value: 50, message: ERROR_MESSAGES.maxLength(50) },
  ],

  ownerName: [
    { rule: 'required', message: ERROR_MESSAGES.required },
    { rule: 'minLength', value: 2, message: ERROR_MESSAGES.minLength(2) },
    { rule: 'maxLength', value: 100, message: ERROR_MESSAGES.maxLength(100) },
  ],

  contactPhone: [
    { rule: 'required', message: ERROR_MESSAGES.required },
    { rule: 'phone', message: ERROR_MESSAGES.phone },
  ],

  lastSeenLocation: [
    { rule: 'required', message: ERROR_MESSAGES.required },
    { rule: 'minLength', value: 5, message: ERROR_MESSAGES.minLength(5) },
    { rule: 'maxLength', value: 200, message: ERROR_MESSAGES.maxLength(200) },
  ],

  lastSeenDateTime: [
    { rule: 'pattern', value: PATTERNS.datetime, message: ERROR_MESSAGES.datetime },
  ],

  petDescription: [
    { rule: 'maxLength', value: 500, message: ERROR_MESSAGES.maxLength(500) },
  ],

  accessories: [
    { rule: 'maxLength', value: 200, message: ERROR_MESSAGES.maxLength(200) },
  ],

  reward: [
    { rule: 'custom', customValidator: validators.reward, message: ERROR_MESSAGES.reward },
  ],

  photos: [
    { rule: 'custom', customValidator: validators.photos, message: ERROR_MESSAGES.photos },
  ],

  customFields: [
    // Validação customizada para array de campos personalizados
    {
      rule: 'custom',
      customValidator: (fields: Array<{ label: string; value: string }>) => {
        if (!Array.isArray(fields)) return true;
        return fields.every(field => 
          field.label?.trim().length > 0 && 
          field.label?.trim().length <= 50 &&
          field.value?.trim().length <= 200
        );
      },
      message: 'Campos personalizados devem ter rótulo (máx. 50 chars) e valor (máx. 200 chars)',
    },
  ],
};

// Função para validar um campo específico
export function validateField(fieldName: string, value: unknown): FieldValidation {
  const rules = FORM_VALIDATION_RULES[fieldName as keyof FormData];
  if (!rules) {
    return { isValid: true };
  }

  for (const rule of rules) {
    let isValid = true;
    let errorMessage = '';

    switch (rule.rule) {
      case 'required':
        isValid = validators.required(value);
        break;
      case 'email':
        isValid = validators.email(value as string);
        break;
      case 'phone':
        isValid = validators.phone(value as string);
        break;
      case 'minLength':
        isValid = validators.minLength(value as string, rule.value as number);
        break;
      case 'maxLength':
        isValid = validators.maxLength(value as string, rule.value as number);
        break;
      case 'pattern':
        isValid = validators.pattern(value as string, rule.value as RegExp);
        break;
      case 'custom':
        isValid = rule.customValidator ? rule.customValidator(value) : true;
        break;
    }

    if (!isValid) {
      errorMessage = rule.message || ERROR_MESSAGES.pattern;
      return {
        isValid: false,
        errorMessage,
        isDirty: true,
      };
    }
  }

  return {
    isValid: true,
    isDirty: true,
  };
}

// Função para validar todo o formulário
export function validateForm(formData: FormData): ValidationResult {
  const errors: FormValidationState = {};
  let errorCount = 0;

  // Validar cada campo do formulário
  Object.keys(formData).forEach(fieldName => {
    const fieldValue = formData[fieldName as keyof FormData];
    const validation = validateField(fieldName, fieldValue);
    
    errors[fieldName] = validation;
    if (!validation.isValid) {
      errorCount++;
    }
  });

  return {
    isValid: errorCount === 0,
    errors,
    errorCount,
  };
}

// Função para limpar erro de um campo específico
export function clearFieldError(validationState: FormValidationState, fieldName: string): FormValidationState {
  return {
    ...validationState,
    [fieldName]: {
      isValid: true,
      isDirty: false,
    },
  };
}

// Função para verificar se o formulário está válido
export function isFormValid(validationState: FormValidationState): boolean {
  return Object.values(validationState).every(field => field.isValid);
}

// Utilitário para formatar telefone brasileiro
export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  } else if (numbers.length === 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }
  
  return value;
}

// Utilitário para validação assíncrona (para futuras funcionalidades)
export async function validateFieldAsync(
  fieldName: string, 
  value: unknown,
  apiValidator?: (value: unknown) => Promise<boolean>
): Promise<{ isValid: boolean; errorMessage?: string }> {
  // Primeiro, validação local
  const localValidation = validateField(fieldName, value);
  if (!localValidation.isValid) {
    return {
      isValid: false,
      errorMessage: localValidation.errorMessage,
    };
  }

  // Se há validador assíncrono, executar
  if (apiValidator) {
    try {
      const isValid = await apiValidator(value);
      return {
        isValid,
        errorMessage: isValid ? undefined : 'Validação falhou no servidor',
      };
    } catch (error) {
      return {
        isValid: false,
        errorMessage: 'Erro na validação do servidor',
      };
    }
  }

  return { isValid: true };
} 