import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  isLocalStorageAvailable,
  saveFormData,
  loadFormData,
  clearFormData,
  migrateDataIfNeeded,
  STORAGE_KEYS
} from '../../lib/localStorage';
import { FormData } from '../../types';

describe('localStorage utilities', () => {
  const mockFormData: FormData = {
    petName: 'Rex',
    ownerName: 'João Silva',
    contactPhone: '11999999999',
    lastSeenLocation: 'Parque Vila Lobos',
    lastSeenDateTime: '2024-01-15 14:30',
    petDescription: 'Cachorro golden retriever',
    accessories: 'Coleira vermelha',
    reward: {
      amount: 500,
      currency: 'BRL'
    },
    photos: ['photo1.jpg', 'photo2.jpg'],
    customFields: [
      { label: 'Idade', value: '3 anos' }
    ]
  };

  // Storage mock simples
  let mockStorage: { [key: string]: string } = {};

  beforeEach(() => {
    // Reset storage
    mockStorage = {};
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();

    // Mock localStorage methods
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => mockStorage[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          mockStorage[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete mockStorage[key];
        }),
        clear: vi.fn(() => {
          mockStorage = {};
        }),
        get length() {
          return Object.keys(mockStorage).length;
        },
        key: vi.fn((index: number) => Object.keys(mockStorage)[index] || null)
      },
      writable: true
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('basic localStorage operations', () => {
    it('should save and retrieve data correctly', () => {
      const testKey = 'testKey';
      const testData = { name: 'test', value: 123 };

      const saveResult = saveToLocalStorage(testKey, testData);
      expect(saveResult).toBe(true);

      const retrievedData = getFromLocalStorage(testKey, {});
      expect(retrievedData).toEqual(testData);
    });

    it('should return default value when no data exists', () => {
      const defaultValue = { default: true };
      const result = getFromLocalStorage('nonexistent', defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it('should remove data correctly', () => {
      const testKey = 'testKey';
      saveToLocalStorage(testKey, { test: 'data' });
      
      const removeResult = removeFromLocalStorage(testKey);
      expect(removeResult).toBe(true);
      
      const result = getFromLocalStorage(testKey, null);
      expect(result).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle localStorage save errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Mock setItem to throw error
      vi.mocked(window.localStorage.setItem).mockImplementation(() => {
        const error = new DOMException('Quota exceeded', 'QuotaExceededError');
        throw error;
      });

      const result = saveToLocalStorage('test', { data: 'test' });
      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('localStorage quota exceeded'),
        expect.any(DOMException)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle localStorage get errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const defaultValue = { default: true };

      // Mock getItem to throw error
      vi.mocked(window.localStorage.getItem).mockImplementation(() => {
        throw new Error('Read error');
      });

      const result = getFromLocalStorage('test', defaultValue);
      expect(result).toEqual(defaultValue);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('data versioning', () => {
    it('should save data with version information', () => {
      saveToLocalStorage('versionTest', { data: 'test' });
      
      const rawData = mockStorage['versionTest'];
      expect(rawData).toBeTruthy();
      
      const parsed = JSON.parse(rawData);
      expect(parsed).toHaveProperty('version');
      expect(parsed).toHaveProperty('data');
      expect(parsed).toHaveProperty('timestamp');
      expect(parsed.data).toEqual({ data: 'test' });
    });

    it('should handle version mismatch gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const defaultValue = { new: 'default' };

      // Manually set old version data
      const oldVersionData = {
        version: '0.1.0',
        data: { old: 'data' },
        timestamp: Date.now()
      };
      mockStorage['versionTest'] = JSON.stringify(oldVersionData);

      const result = getFromLocalStorage('versionTest', defaultValue);
      expect(result).toEqual(defaultValue);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Data version mismatch')
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('localStorage availability', () => {
    it('should detect localStorage availability', () => {
      expect(isLocalStorageAvailable()).toBe(true);
    });

    it('should handle localStorage unavailable', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Mock setItem to throw error
      vi.mocked(window.localStorage.setItem).mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      expect(isLocalStorageAvailable()).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('form data specific functions', () => {
    it('should save form data with debounce', () => {
      saveFormData(mockFormData);
      
      // Verifica que ainda não foi salvo (devido ao debounce)
      expect(window.localStorage.setItem).not.toHaveBeenCalled();
      
      // Avança o timer do debounce
      vi.advanceTimersByTime(300);
      
      // Agora deve ter sido salvo
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.FORM_DATA,
        expect.any(String)
      );
    });

    it('should load form data correctly', () => {
      // Primeiro salva os dados manualmente no mock storage
      const versionedData = {
        version: '1.0.0',
        data: mockFormData,
        timestamp: Date.now()
      };
      mockStorage[STORAGE_KEYS.FORM_DATA] = JSON.stringify(versionedData);
      
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

      const result = loadFormData(defaultFormData);
      expect(result).toEqual(mockFormData);
    });

    it('should clear form data correctly', () => {
      // Primeiro salva os dados
      saveToLocalStorage(STORAGE_KEYS.FORM_DATA, mockFormData);
      
      const clearResult = clearFormData();
      expect(clearResult).toBe(true);
      
      // Verifica que foi removido
      expect(window.localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.FORM_DATA);
    });
  });

  describe('data migration', () => {
    it('should migrate old data format', () => {
      const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      // Simula dados antigos sem versionamento
      const oldData = { petName: 'Old Pet', ownerName: 'Old Owner' };
      mockStorage[STORAGE_KEYS.FORM_DATA] = JSON.stringify(oldData);
      
      migrateDataIfNeeded();
      
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringContaining('Migrating old localStorage data')
      );

      consoleInfoSpy.mockRestore();
    });

    it('should not migrate already versioned data', () => {
      const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      // Simula dados já versionados
      const versionedData = {
        version: '1.0.0',
        data: { petName: 'Versioned Pet' },
        timestamp: Date.now()
      };
      mockStorage[STORAGE_KEYS.FORM_DATA] = JSON.stringify(versionedData);
      
      migrateDataIfNeeded();
      
      expect(consoleInfoSpy).not.toHaveBeenCalled();

      consoleInfoSpy.mockRestore();
    });
  });

  describe('data compression', () => {
    it('should remove empty values during compression', () => {
      const dataWithEmptyValues = {
        petName: 'Rex',
        ownerName: '',
        contactPhone: '11999999999',
        photos: [],
        customFields: undefined
      };

      saveToLocalStorage('compressionTest', dataWithEmptyValues);
      
      const rawData = mockStorage['compressionTest'];
      const parsed = JSON.parse(rawData);
      
      // Verifica que valores vazios foram removidos
      expect(parsed.data).not.toHaveProperty('ownerName');
      expect(parsed.data).not.toHaveProperty('photos');
      expect(parsed.data).not.toHaveProperty('customFields');
      expect(parsed.data.petName).toBe('Rex');
      expect(parsed.data.contactPhone).toBe('11999999999');
    });
  });
}); 