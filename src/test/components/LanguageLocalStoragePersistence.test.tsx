import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import React from 'react';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Test component
const TestComponent = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="language">{language}</span>
      <button onClick={() => setLanguage('en')} data-testid="set-en">
        Set English
      </button>
      <button onClick={() => setLanguage('pt')} data-testid="set-pt">
        Set Portuguese
      </button>
    </div>
  );
};

describe('Language localStorage Persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('saves language to localStorage when changed', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('set-en'));
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('preferredLanguage', 'en');
  });

  it('loads saved language from localStorage on init', () => {
    localStorageMock.getItem.mockReturnValue('en');

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('language')).toHaveTextContent('en');
  });

  it('defaults to portuguese when localStorage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('language')).toHaveTextContent('pt');
  });
}); 