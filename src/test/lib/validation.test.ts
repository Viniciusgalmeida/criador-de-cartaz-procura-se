import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateField,
  validateForm,
  clearFieldError,
  isFormValid,
  formatPhone,
  validators,
  ERROR_MESSAGES,
  FORM_VALIDATION_RULES,
} from '../../lib/validation';
import { FormData, FormValidationState } from '../../types';

// Mock form data para testes
const validFormData: FormData = {
  petName: 'Bilu',
  ownerName: 'João Silva',
  contactPhone: '(11) 99999-9999',
  lastSeenLocation: 'Parque do Ibirapuera, São Paulo',
  lastSeenDateTime: '2024-07-10T15:30',
  petDescription: 'Cachorro pequeno, preto e branco',
  accessories: 'Coleira vermelha',
  reward: { amount: 100, currency: 'BRL' },
  photos: ['photo1.jpg'],
  customFields: [{ label: 'Chip', value: 'Sim' }],
};

const invalidFormData: FormData = {
  petName: '', // Obrigatório vazio
  ownerName: 'A', // Muito curto
  contactPhone: '123', // Formato inválido
  lastSeenLocation: 'SP', // Muito curto
  lastSeenDateTime: 'invalid-date', // Data inválida
  petDescription: 'A'.repeat(501), // Muito longo
  accessories: 'B'.repeat(201), // Muito longo
  reward: { amount: -10, currency: 'EUR' as unknown as 'BRL' | 'USD' }, // Valor inválido
  photos: [], // Array vazio
  customFields: [{ label: '', value: 'test' }], // Label vazio
};

describe('Validation - Individual Validators', () => {
  describe('validators.required', () => {
    it('should validate strings correctly', () => {
      expect(validators.required('test')).toBe(true);
      expect(validators.required('')).toBe(false);
      expect(validators.required('   ')).toBe(false);
    });

    it('should validate arrays correctly', () => {
      expect(validators.required(['item'])).toBe(true);
      expect(validators.required([])).toBe(false);
    });

    it('should validate numbers correctly', () => {
      expect(validators.required(0)).toBe(true);
      expect(validators.required(42)).toBe(true);
      expect(validators.required(NaN)).toBe(false);
    });

    it('should validate null/undefined correctly', () => {
      expect(validators.required(null)).toBe(false);
      expect(validators.required(undefined)).toBe(false);
    });
  });

  describe('validators.phone', () => {
    it('should validate Brazilian phone numbers', () => {
      // Formatos válidos
      expect(validators.phone('(11) 99999-9999')).toBe(true);
      expect(validators.phone('11999999999')).toBe(true);
      expect(validators.phone('+55 11 99999-9999')).toBe(true);
      expect(validators.phone('(11) 9 9999-9999')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validators.phone('123')).toBe(false);
      expect(validators.phone('(00) 99999-9999')).toBe(false);
      expect(validators.phone('abc')).toBe(false);
      expect(validators.phone('')).toBe(false);
    });
  });

  describe('validators.email', () => {
    it('should validate emails correctly', () => {
      expect(validators.email('test@example.com')).toBe(true);
      expect(validators.email('user.name@domain.co.uk')).toBe(true);
      expect(validators.email('')).toBe(true); // Email é opcional
    });

    it('should reject invalid emails', () => {
      expect(validators.email('invalid-email')).toBe(false);
      expect(validators.email('@domain.com')).toBe(false);
      expect(validators.email('test@')).toBe(false);
    });
  });

  describe('validators.minLength', () => {
    it('should validate minimum length correctly', () => {
      expect(validators.minLength('hello', 3)).toBe(true);
      expect(validators.minLength('hello', 5)).toBe(true);
      expect(validators.minLength('hi', 5)).toBe(false);
      expect(validators.minLength('', 1)).toBe(true); // Vazio passa, deixa required lidar
    });
  });

  describe('validators.maxLength', () => {
    it('should validate maximum length correctly', () => {
      expect(validators.maxLength('hello', 10)).toBe(true);
      expect(validators.maxLength('hello', 5)).toBe(true);
      expect(validators.maxLength('hello world', 5)).toBe(false);
      expect(validators.maxLength('', 5)).toBe(true);
    });
  });

  describe('validators.photos', () => {
    it('should validate photo arrays correctly', () => {
      expect(validators.photos(['photo1.jpg'])).toBe(true);
      expect(validators.photos(['photo1.jpg', 'photo2.jpg'])).toBe(true);
      expect(validators.photos([])).toBe(false);
    });
  });

  describe('validators.reward', () => {
    it('should validate reward objects correctly', () => {
      expect(validators.reward({ amount: 100, currency: 'BRL' })).toBe(true);
      expect(validators.reward({ amount: 50, currency: 'USD' })).toBe(true);
      expect(validators.reward(undefined)).toBe(true); // Recompensa é opcional
    });

    it('should reject invalid reward objects', () => {
      expect(validators.reward({ amount: -10, currency: 'BRL' })).toBe(false);
      expect(validators.reward({ amount: 100, currency: 'EUR' })).toBe(false);
      expect(validators.reward({ amount: 'invalid', currency: 'BRL' })).toBe(false);
    });
  });

  describe('validators.datetime', () => {
    it('should validate datetime strings correctly', () => {
      expect(validators.datetime('2024-07-10T15:30')).toBe(true);
      expect(validators.datetime('10/07/2024 15:30')).toBe(true);
      expect(validators.datetime('')).toBe(true); // Data é opcional
    });

    it('should reject invalid datetime strings', () => {
      expect(validators.datetime('invalid-date')).toBe(false);
      expect(validators.datetime('2024-13-10T15:30')).toBe(false);
    });
  });
});

describe('Validation - Field Validation', () => {
  it('should validate required fields correctly', () => {
    const result = validateField('petName', 'Bilu');
    expect(result.isValid).toBe(true);

    const emptyResult = validateField('petName', '');
    expect(emptyResult.isValid).toBe(false);
    expect(emptyResult.errorMessage).toBe(ERROR_MESSAGES.required);
  });

  it('should validate phone field correctly', () => {
    const validResult = validateField('contactPhone', '(11) 99999-9999');
    expect(validResult.isValid).toBe(true);

    const invalidResult = validateField('contactPhone', '123');
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errorMessage).toBe(ERROR_MESSAGES.phone);
  });

  it('should validate photos field correctly', () => {
    const validResult = validateField('photos', ['photo1.jpg']);
    expect(validResult.isValid).toBe(true);

    const invalidResult = validateField('photos', []);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errorMessage).toBe(ERROR_MESSAGES.photos);
  });

  it('should validate custom fields correctly', () => {
    const validFields = [{ label: 'Chip', value: 'Sim' }];
    const validResult = validateField('customFields', validFields);
    expect(validResult.isValid).toBe(true);

    const invalidFields = [{ label: '', value: 'test' }]; // Label vazio
    const invalidResult = validateField('customFields', invalidFields);
    expect(invalidResult.isValid).toBe(false);
  });

  it('should return valid for unknown fields', () => {
    const result = validateField('unknownField', 'any value');
    expect(result.isValid).toBe(true);
  });
});

describe('Validation - Form Validation', () => {
  it('should validate a complete valid form', () => {
    const result = validateForm(validFormData);
    expect(result.isValid).toBe(true);
    expect(result.errorCount).toBe(0);
  });

  it('should detect all errors in invalid form', () => {
    const result = validateForm(invalidFormData);
    expect(result.isValid).toBe(false);
    expect(result.errorCount).toBeGreaterThan(0);
    
    // Verificar erros específicos
    expect(result.errors.petName?.isValid).toBe(false);
    expect(result.errors.contactPhone?.isValid).toBe(false);
    expect(result.errors.photos?.isValid).toBe(false);
  });

  it('should validate partially filled form', () => {
    const partialData: FormData = {
      ...validFormData,
      petDescription: '', // Campo opcional vazio
      reward: undefined, // Campo opcional não definido
    };

    const result = validateForm(partialData);
    expect(result.isValid).toBe(true);
  });
});

describe('Validation - Utility Functions', () => {
  let validationState: FormValidationState;

  beforeEach(() => {
    validationState = {
      petName: { isValid: true, isDirty: true },
      contactPhone: { isValid: false, errorMessage: 'Invalid phone', isDirty: true },
      photos: { isValid: true, isDirty: false },
    };
  });

  describe('clearFieldError', () => {
    it('should clear error for specific field', () => {
      const newState = clearFieldError(validationState, 'contactPhone');
      
      expect(newState.contactPhone.isValid).toBe(true);
      expect(newState.contactPhone.isDirty).toBe(false);
      expect(newState.petName).toEqual(validationState.petName); // Outros campos inalterados
    });
  });

  describe('isFormValid', () => {
    it('should return true when all fields are valid', () => {
      const allValidState: FormValidationState = {
        petName: { isValid: true, isDirty: true },
        contactPhone: { isValid: true, isDirty: true },
      };
      
      expect(isFormValid(allValidState)).toBe(true);
    });

    it('should return false when any field is invalid', () => {
      expect(isFormValid(validationState)).toBe(false);
    });

    it('should return true for empty validation state', () => {
      expect(isFormValid({})).toBe(true);
    });
  });

  describe('formatPhone', () => {
    it('should format 11-digit numbers correctly', () => {
      expect(formatPhone('11999999999')).toBe('(11) 99999-9999');
    });

    it('should format 10-digit numbers correctly', () => {
      expect(formatPhone('1199999999')).toBe('(11) 9999-9999');
    });

    it('should return original value for invalid lengths', () => {
      expect(formatPhone('123')).toBe('123');
      expect(formatPhone('119999999999')).toBe('119999999999');
    });

    it('should handle already formatted numbers', () => {
      expect(formatPhone('(11) 99999-9999')).toBe('(11) 99999-9999');
    });
  });
});

describe('Validation - Error Messages', () => {
  it('should have proper error messages for all validation types', () => {
    expect(ERROR_MESSAGES.required).toBeDefined();
    expect(ERROR_MESSAGES.email).toBeDefined();
    expect(ERROR_MESSAGES.phone).toBeDefined();
    expect(ERROR_MESSAGES.photos).toBeDefined();
    expect(ERROR_MESSAGES.reward).toBeDefined();
    expect(ERROR_MESSAGES.datetime).toBeDefined();
  });

  it('should have dynamic error messages for length validators', () => {
    expect(ERROR_MESSAGES.minLength(5)).toContain('5');
    expect(ERROR_MESSAGES.maxLength(100)).toContain('100');
  });
});

describe('Validation - Form Rules Configuration', () => {
  it('should have validation rules for all FormData fields', () => {
    const formDataKeys: (keyof FormData)[] = [
      'petName', 'ownerName', 'contactPhone', 'lastSeenLocation',
      'lastSeenDateTime', 'petDescription', 'accessories', 'reward',
      'photos', 'customFields'
    ];

    formDataKeys.forEach(key => {
      expect(FORM_VALIDATION_RULES[key]).toBeDefined();
      expect(Array.isArray(FORM_VALIDATION_RULES[key])).toBe(true);
    });
  });

  it('should have required validation for mandatory fields', () => {
    const requiredFields = ['petName', 'ownerName', 'contactPhone', 'lastSeenLocation'];
    
    requiredFields.forEach(field => {
      const rules = FORM_VALIDATION_RULES[field as keyof FormData];
      const hasRequiredRule = rules.some(rule => rule.rule === 'required');
      expect(hasRequiredRule).toBe(true);
    });
  });

  it('should have phone validation for contact phone', () => {
    const phoneRules = FORM_VALIDATION_RULES.contactPhone;
    const hasPhoneRule = phoneRules.some(rule => rule.rule === 'phone');
    expect(hasPhoneRule).toBe(true);
  });

  it('should have custom validation for complex fields', () => {
    const complexFields = ['photos', 'reward', 'customFields'];
    
    complexFields.forEach(field => {
      const rules = FORM_VALIDATION_RULES[field as keyof FormData];
      const hasCustomRule = rules.some(rule => rule.rule === 'custom');
      expect(hasCustomRule).toBe(true);
    });
  });
}); 