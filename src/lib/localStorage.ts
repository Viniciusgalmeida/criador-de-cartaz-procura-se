import { FormData } from '../types';

// Configurações da persistência
const STORAGE_KEYS = {
  FORM_DATA: 'petPosterFormData',
  DATA_VERSION: 'petPosterDataVersion'
} as const;

const CURRENT_DATA_VERSION = '1.0.0';
const DEBOUNCE_DELAY = 300; // ms

// Interface para dados versionados
interface VersionedData<T> {
  version: string;
  data: T;
  timestamp: number;
}

// Map para controlar debounce por chave
const debounceTimers = new Map<string, NodeJS.Timeout>();

/**
 * Função utilitária para debounce
 */
function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number,
  key: string
): (...args: Parameters<T>) => void {
  return (...args: Parameters<T>) => {
    // Limpa timer anterior se existir
    const existingTimer = debounceTimers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Cria novo timer
    const timer = setTimeout(() => {
      func(...args);
      debounceTimers.delete(key);
    }, delay);

    debounceTimers.set(key, timer);
  };
}

/**
 * Compressão básica de dados usando JSON.stringify otimizado
 */
function compressData<T>(data: T): string {
  try {
    // Remove espaços desnecessários e propriedades vazias
    const cleanData = JSON.parse(JSON.stringify(data, (key, value) => {
      // Remove strings vazias, arrays vazios e propriedades undefined
      if (value === '' || value === undefined || (Array.isArray(value) && value.length === 0)) {
        return undefined;
      }
      return value;
    }));
    
    return JSON.stringify(cleanData);
  } catch (error) {
    console.warn('Failed to compress data, using raw JSON:', error);
    return JSON.stringify(data);
  }
}

/**
 * Descompressão de dados
 */
function decompressData<T>(compressedData: string): T {
  return JSON.parse(compressedData);
}

/**
 * Salva dados no localStorage com versionamento e compressão
 */
function saveToLocalStorage<T>(key: string, data: T): boolean {
  try {
    // Cria dados versionados
    const versionedData: VersionedData<T> = {
      version: CURRENT_DATA_VERSION,
      data,
      timestamp: Date.now()
    };

    // Comprime e salva
    const compressedData = compressData(versionedData);
    localStorage.setItem(key, compressedData);
    
    console.debug(`Data saved to localStorage: ${key}`);
    return true;
  } catch (error) {
    // Handle localStorage quota exceeded, disabled, etc.
    if (error instanceof DOMException) {
      switch (error.name) {
        case 'QuotaExceededError':
          console.error('localStorage quota exceeded:', error);
          break;
        case 'SecurityError':
          console.error('localStorage access denied (private mode?):', error);
          break;
        default:
          console.error('localStorage save failed:', error);
      }
    } else {
      console.error('Unexpected error saving to localStorage:', error);
    }
    return false;
  }
}

/**
 * Recupera dados do localStorage com validação de versão
 */
function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      console.debug(`No data found in localStorage for key: ${key}`);
      return defaultValue;
    }

    // Descomprime dados
    const parsed = decompressData<VersionedData<T>>(stored);
    
    // Verifica se tem estrutura versionada
    if (!parsed.version || !parsed.data) {
      console.warn(`Invalid data structure in localStorage for key: ${key}, using default`);
      return defaultValue;
    }

    // Verifica versão dos dados
    if (parsed.version !== CURRENT_DATA_VERSION) {
      console.warn(
        `Data version mismatch for key: ${key}. Current: ${CURRENT_DATA_VERSION}, Stored: ${parsed.version}. Using default value.`
      );
      return defaultValue;
    }

    console.debug(`Data loaded from localStorage: ${key}`);
    return parsed.data;
  } catch (error) {
    console.error(`Failed to retrieve data from localStorage for key: ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Remove dados do localStorage
 */
function removeFromLocalStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    console.debug(`Data removed from localStorage: ${key}`);
    return true;
  } catch (error) {
    console.error(`Failed to remove data from localStorage for key: ${key}:`, error);
    return false;
  }
}

/**
 * Verifica se localStorage está disponível
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('localStorage is not available:', error);
    return false;
  }
}

/**
 * Salva dados do formulário com debounce
 */
const saveFormData = debounce((formData: FormData) => {
  saveToLocalStorage(STORAGE_KEYS.FORM_DATA, formData);
}, DEBOUNCE_DELAY, STORAGE_KEYS.FORM_DATA);

/**
 * Carrega dados do formulário
 */
function loadFormData(defaultFormData: FormData): FormData {
  return getFromLocalStorage(STORAGE_KEYS.FORM_DATA, defaultFormData);
}

/**
 * Remove dados do formulário
 */
function clearFormData(): boolean {
  return removeFromLocalStorage(STORAGE_KEYS.FORM_DATA);
}

/**
 * Migra dados antigos se necessário (para versionamento futuro)
 */
function migrateDataIfNeeded(): void {
  try {
    // Verifica se existem dados em formato antigo
    const oldData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
    if (oldData) {
      const parsed = JSON.parse(oldData);
      
      // Se não tem estrutura versionada, é dados antigos
      if (!parsed.version) {
        console.info('Migrating old localStorage data to new versioned format');
        
        // Salva no novo formato
        saveToLocalStorage(STORAGE_KEYS.FORM_DATA, parsed);
      }
    }
  } catch (error) {
    console.warn('Failed to migrate old localStorage data:', error);
  }
}

// Export das funções públicas
export {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  isLocalStorageAvailable,
  saveFormData,
  loadFormData,
  clearFormData,
  migrateDataIfNeeded,
  STORAGE_KEYS
}; 