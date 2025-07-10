// Tipos globais da aplicação

export interface PetInfo {
  name: string;
  type: string;
  breed?: string;
  description?: string;
  lastSeenLocation: string;
  lastSeenDate?: string;
  accessories?: string;
  reward?: string;
  photos: string[];
}

export interface ContactInfo {
  ownerName: string;
  phone: string;
  email?: string;
}

export interface PosterData {
  pet: PetInfo;
  contact: ContactInfo;
  customFields?: Record<string, string>;
}

export interface Language {
  code: 'pt-BR' | 'en-US';
  name: string;
  flag: string;
}

export type FormStep = 'info' | 'photos' | 'preview' | 'download';

// Tipos específicos para o FormContext
export interface CustomField {
  label: string;
  value: string;
}

export interface RewardInfo {
  amount: number;
  currency: 'BRL' | 'USD';
}

export interface FormData {
  petName: string;
  ownerName: string;
  contactPhone: string;
  lastSeenLocation: string;
  lastSeenDateTime?: string;
  petDescription?: string;
  accessories?: string;
  reward?: RewardInfo;
  photos: string[];
  customFields: CustomField[];
}

// Tipos para validação
export type ValidationRule = 'required' | 'email' | 'phone' | 'minLength' | 'maxLength' | 'pattern' | 'custom';

export interface ValidationConfig {
  rule: ValidationRule;
  value?: string | number | RegExp;
  message?: string;
  customValidator?: (value: unknown) => boolean;
}

export interface FieldValidation {
  isValid: boolean;
  errorMessage?: string;
  isDirty?: boolean;
}

export interface FormValidationState {
  [key: string]: FieldValidation;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormValidationState;
  errorCount: number;
}

export interface AsyncValidationResult {
  isValid: boolean;
  errorMessage?: string;
  isLoading?: boolean;
}

export interface FormContextType {
  // Dados do formulário
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  addPhoto: (photo: string) => void;
  removePhoto: (index: number) => void;
  addCustomField: () => void;
  updateCustomField: (index: number, field: CustomField) => void;
  removeCustomField: (index: number) => void;
  resetForm: () => void;
  
  // Estados de persistência e error handling
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  retryOperation: () => void;
  clearError: () => void;
  
  // Estados de validação
  validationState: FormValidationState;
  validateField: (fieldName: string, value: unknown) => FieldValidation;
  validateForm: () => ValidationResult;
  clearFieldError: (fieldName: string) => void;
  isFormValid: boolean;
} 