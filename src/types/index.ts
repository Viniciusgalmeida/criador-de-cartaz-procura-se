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
} 