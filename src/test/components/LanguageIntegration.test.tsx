import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PosterEditor } from '@/components/PosterEditor';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { PetData } from '@/pages/Index';
import React from 'react';

const mockSetPetData = vi.fn();

const initialPetData: PetData = {
  photos: [],
  lastSeenAddress: '',
  lostTime: '',
  petName: '',
  petDescription: '',
  ownerName: '',
  ownerPhone: '',
  accessories: '',
  reward: '',
  customFields: []
};

// Componente de teste que permite controlar o idioma
const TestWrapper = ({ children, initialLanguage = 'pt' }: { 
  children: React.ReactNode; 
  initialLanguage?: 'pt' | 'en' 
}) => {
  const [language, setLanguage] = React.useState(initialLanguage);
  
  return (
    <div>
      <button 
        onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
        data-testid="language-toggle"
      >
        Switch to {language === 'pt' ? 'EN' : 'PT'}
      </button>
      
      <LanguageProvider>
        <LanguageContextController language={language}>
          {children}
        </LanguageContextController>
      </LanguageProvider>
    </div>
  );
};

// Componente helper para controlar o contexto de linguagem
const LanguageContextController = ({ 
  children, 
  language 
}: { 
  children: React.ReactNode; 
  language: 'pt' | 'en' 
}) => {
  const { setLanguage } = useLanguage();
  
  React.useEffect(() => {
    setLanguage(language);
  }, [language, setLanguage]);
  
  return <>{children}</>;
};

describe('Language Integration with PosterEditor', () => {
  beforeEach(() => {
    mockSetPetData.mockClear();
    global.URL.createObjectURL = vi.fn(() => 'mock-object-url');
  });

  describe('Portuguese Language (Default)', () => {
    it('renders form in Portuguese by default', () => {
      render(
        <LanguageProvider>
          <PosterEditor petData={initialPetData} setPetData={mockSetPetData} />
        </LanguageProvider>
      );
      
      expect(screen.getByText('Informações do Seu Pet')).toBeInTheDocument();
      expect(screen.getByText(/nome do pet/i)).toBeInTheDocument();
      expect(screen.getByText(/último local visto/i)).toBeInTheDocument();
      expect(screen.getByText(/nome do responsável/i)).toBeInTheDocument();
      expect(screen.getByText(/telefone para contato/i)).toBeInTheDocument();
    });

    it('displays Portuguese placeholders', () => {
      render(
        <LanguageProvider>
          <PosterEditor petData={initialPetData} setPetData={mockSetPetData} />
        </LanguageProvider>
      );
      
      expect(screen.getByPlaceholderText('Digite o nome do seu pet')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite onde foi visto pela última vez')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite seu nome completo')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite seu telefone')).toBeInTheDocument();
    });

    it('shows Portuguese photo upload text', () => {
      render(
        <LanguageProvider>
          <PosterEditor petData={initialPetData} setPetData={mockSetPetData} />
        </LanguageProvider>
      );
      
      expect(screen.getByText(/adicionar fotos/i)).toBeInTheDocument();
      expect(screen.getByText(/máximo 3 fotos/i)).toBeInTheDocument();
    });

    it('displays Portuguese custom fields section', () => {
      render(
        <LanguageProvider>
          <PosterEditor petData={initialPetData} setPetData={mockSetPetData} />
        </LanguageProvider>
      );
      
      expect(screen.getByText('Campos Personalizados')).toBeInTheDocument();
      expect(screen.getByText('Adicionar Campo')).toBeInTheDocument();
    });
  });

  describe('English Language', () => {
    it('renders form in English when language is set to English', () => {
      render(
        <TestWrapper initialLanguage="en">
          <PosterEditor petData={initialPetData} setPetData={mockSetPetData} />
        </TestWrapper>
      );
      
      expect(screen.getByText('Your Pet Information')).toBeInTheDocument();
      expect(screen.getByText(/pet name/i)).toBeInTheDocument();
      expect(screen.getByText(/last seen location/i)).toBeInTheDocument();
      expect(screen.getByText(/owner name/i)).toBeInTheDocument();
      expect(screen.getByText(/contact phone/i)).toBeInTheDocument();
    });

    it('displays English placeholders', () => {
      render(
        <TestWrapper initialLanguage="en">
          <PosterEditor petData={initialPetData} setPetData={mockSetPetData} />
        </TestWrapper>
      );
      
      expect(screen.getByPlaceholderText('Enter your pet name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter where it was last seen')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your phone number')).toBeInTheDocument();
    });

    it('shows English photo upload text', () => {
      render(
        <TestWrapper initialLanguage="en">
          <PosterEditor petData={initialPetData} setPetData={mockSetPetData} />
        </TestWrapper>
      );
      
      expect(screen.getByText(/add photos/i)).toBeInTheDocument();
      expect(screen.getByText(/maximum 3 photos/i)).toBeInTheDocument();
    });

    it('displays English custom fields section', () => {
      render(
        <TestWrapper initialLanguage="en">
          <PosterEditor petData={initialPetData} setPetData={mockSetPetData} />
        </TestWrapper>
      );
      
      expect(screen.getByText('Custom Fields')).toBeInTheDocument();
      expect(screen.getByText('Add Field')).toBeInTheDocument();
    });
  });

  describe('Language Context Integration', () => {
    it.skip('provides translation function through useLanguage hook', () => {
      const TestComponent = () => {
        const { t, language } = useLanguage();
        return (
          <div>
            <span data-testid="current-language">{language}</span>
            <span data-testid="translated-title">{t('editor.title')}</span>
          </div>
        );
      };

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('current-language')).toHaveTextContent('pt');
      expect(screen.getByTestId('translated-title')).toHaveTextContent('Informações do Seu Pet');
    });

    it.skip('updates translations when language changes', () => {
      const TestComponent = () => {
        const { t, language, setLanguage } = useLanguage();
        return (
          <div>
            <span data-testid="current-language">{language}</span>
            <span data-testid="translated-title">{t('editor.title')}</span>
            <button onClick={() => setLanguage('en')}>Switch to English</button>
          </div>
        );
      };

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      // Inicial em português
      expect(screen.getByTestId('current-language')).toHaveTextContent('pt');
      expect(screen.getByTestId('translated-title')).toHaveTextContent('Informações do Seu Pet');

      // Muda para inglês
      fireEvent.click(screen.getByText('Switch to English'));
      
      expect(screen.getByTestId('current-language')).toHaveTextContent('en');
      expect(screen.getByTestId('translated-title')).toHaveTextContent('Your Pet Information');
    });

    it('handles missing translation keys gracefully', () => {
      const TestComponent = () => {
        const { t } = useLanguage();
        return <span data-testid="missing-key">{t('non.existent.key')}</span>;
      };

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('missing-key')).toHaveTextContent('non.existent.key');
    });
  });

  describe('Form Fields Translation', () => {
    it.skip('translates all form field labels correctly in Portuguese', () => {
      render(
        <LanguageProvider>
          <PosterEditor petData={initialPetData} setPetData={mockSetPetData} />
        </LanguageProvider>
      );

      const expectedPortugueseLabels = [
        'Nome do Pet',
        'Último Local Visto',
        'Nome do Responsável',
        'Telefone para Contato',
        'Data e Horário que se perdeu',
        'Descrição do Pet',
        'Acessórios/Coleira',
        'Recompensa'
      ];

      expectedPortugueseLabels.forEach(label => {
        expect(screen.getByText(new RegExp(label, 'i'))).toBeInTheDocument();
      });
    });

    it('translates all form field labels correctly in English', () => {
      render(
        <TestWrapper initialLanguage="en">
          <PosterEditor petData={initialPetData} setPetData={mockSetPetData} />
        </TestWrapper>
      );

      const expectedEnglishLabels = [
        'Pet Name',
        'Last Seen Location',
        'Owner Name',
        'Contact Phone',
        'Date and Time Lost',
        'Pet Description',
        'Accessories/Collar',
        'Reward'
      ];

      expectedEnglishLabels.forEach(label => {
        expect(screen.getByText(new RegExp(label, 'i'))).toBeInTheDocument();
      });
    });
  });

  describe('Functional Behavior with Language Changes', () => {
    it.skip('maintains form functionality when language changes', () => {
      render(
        <TestWrapper initialLanguage="pt">
          <PosterEditor petData={initialPetData} setPetData={mockSetPetData} />
        </TestWrapper>
      );

      // Preenche campo em português
      const petNameInput = screen.getByLabelText(/nome do pet/i);
      fireEvent.change(petNameInput, { target: { value: 'Rex' } });

      expect(mockSetPetData).toHaveBeenCalledWith({
        ...initialPetData,
        petName: 'Rex'
      });

      // Muda idioma
      fireEvent.click(screen.getByTestId('language-toggle'));

      // Verifica que o campo ainda funciona em inglês
      const petNameInputEn = screen.getByLabelText(/pet name/i);
      fireEvent.change(petNameInputEn, { target: { value: 'Max' } });

      expect(mockSetPetData).toHaveBeenCalledWith({
        ...initialPetData,
        petName: 'Max'
      });
    });
  });
}); 