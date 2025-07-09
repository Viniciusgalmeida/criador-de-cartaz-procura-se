import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PosterPreview } from '@/components/PosterPreview';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { PetData } from '@/pages/Index';
import React from 'react';

// Mock global functions
Object.defineProperty(window, 'open', {
  value: vi.fn(),
  writable: true,
});

// Mock useRef to avoid refs issues in tests
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: () => ({ current: document.createElement('div') }),
  };
});

// Test component that allows language control
const TestWrapperWithLanguageControl = ({ 
  children, 
  initialLanguage = 'pt' 
}: { 
  children: React.ReactNode; 
  initialLanguage?: 'pt' | 'en' 
}) => {
  const [language, setLanguage] = React.useState<'pt' | 'en'>(initialLanguage);
  
  return (
    <div>
      <button 
        onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
        data-testid="language-toggle"
      >
        Switch to {language === 'pt' ? 'EN' : 'PT'}
      </button>
      <LanguageProvider>
        <LanguageControlledContent language={language}>
          {children}
        </LanguageControlledContent>
      </LanguageProvider>
    </div>
  );
};

// Component to control language programmatically
const LanguageControlledContent = ({ 
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

const completePetData: PetData = {
  photos: ['photo1.jpg', 'photo2.jpg'],
  lastSeenAddress: 'Central Park, New York',
  lostTime: 'This morning at 8:30 AM',
  petName: 'Buddy',
  petDescription: 'Friendly golden retriever, very playful',
  ownerName: 'John Smith',
  ownerPhone: '+1 (555) 123-4567',
  accessories: 'Blue collar with tag',
  reward: '$200',
  customFields: [
    { label: 'Age', value: '3 years' },
    { label: 'Weight', value: '30kg' }
  ]
};

const renderWithLanguageControl = (petData: PetData, initialLanguage: 'pt' | 'en' = 'pt') => {
  return render(
    <TestWrapperWithLanguageControl initialLanguage={initialLanguage}>
      <PosterPreview petData={petData} />
    </TestWrapperWithLanguageControl>
  );
};

describe('PosterPreview Language Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Portuguese (PT) Language', () => {
    it('renders all Portuguese labels correctly', () => {
      renderWithLanguageControl(completePetData, 'pt');
      
      // Header elements
      expect(screen.getByText('Pré-visualização do Cartaz')).toBeInTheDocument();
      expect(screen.getByText('PROCURA-SE')).toBeInTheDocument();
      
      // Field labels
      expect(screen.getByText('📍 Perdido em:')).toBeInTheDocument();
      expect(screen.getByText('🕐 Quando:')).toBeInTheDocument();
      expect(screen.getByText('📝 Descrição:')).toBeInTheDocument();
      expect(screen.getByText('🎯 Acessórios:')).toBeInTheDocument();
      expect(screen.getByText('🎁 RECOMPENSA:')).toBeInTheDocument();
      
      // Contact section
      expect(screen.getByText('SE ENCONTRAR, ENTRE EM CONTATO:')).toBeInTheDocument();
      
      // Footer message
      expect(screen.getByText('Ajude compartilhando este cartaz!')).toBeInTheDocument();
      
      // Buttons
      expect(screen.getByRole('button', { name: /baixar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /compartilhar/i })).toBeInTheDocument();
    });
  });

  describe('English (EN) Language', () => {
    it('renders all English labels correctly', () => {
      renderWithLanguageControl(completePetData, 'en');
      
      // Header elements
      expect(screen.getByText('Poster Preview')).toBeInTheDocument();
      expect(screen.getByText('LOST PET')).toBeInTheDocument();
      
      // Field labels
      expect(screen.getByText('📍 Lost at:')).toBeInTheDocument();
      expect(screen.getByText('🕐 When:')).toBeInTheDocument();
      expect(screen.getByText('📝 Description:')).toBeInTheDocument();
      expect(screen.getByText('🎯 Accessories:')).toBeInTheDocument();
      expect(screen.getByText('🎁 REWARD:')).toBeInTheDocument();
      
      // Contact section
      expect(screen.getByText('IF FOUND, PLEASE CONTACT:')).toBeInTheDocument();
      
      // Footer message
      expect(screen.getByText('Help by sharing this poster!')).toBeInTheDocument();
      
      // Buttons
      expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    });
  });

  describe('Language Switching', () => {
    it('updates all labels when switching from PT to EN', () => {
      renderWithLanguageControl(completePetData, 'pt');
      
             // Verify PT labels are present
       expect(screen.getByText('Pré-visualização do Cartaz')).toBeInTheDocument();
       expect(screen.getByText('PROCURA-SE')).toBeInTheDocument();
       expect(screen.getByText('📍 Perdido em:')).toBeInTheDocument();
       
       // Switch to English
       const languageToggle = screen.getByTestId('language-toggle');
       fireEvent.click(languageToggle);
       
       // Verify EN labels are now present
       expect(screen.getByText('Poster Preview')).toBeInTheDocument();
       expect(screen.getByText('LOST PET')).toBeInTheDocument();
       expect(screen.getByText('📍 Lost at:')).toBeInTheDocument();
       
       // Verify PT labels are gone
       expect(screen.queryByText('Pré-visualização do Cartaz')).not.toBeInTheDocument();
       expect(screen.queryByText('PROCURA-SE')).not.toBeInTheDocument();
       expect(screen.queryByText('📍 Perdido em:')).not.toBeInTheDocument();
    });

    it('updates all labels when switching from EN to PT', () => {
      renderWithLanguageControl(completePetData, 'en');
      
             // Verify EN labels are present
       expect(screen.getByText('Poster Preview')).toBeInTheDocument();
       expect(screen.getByText('LOST PET')).toBeInTheDocument();
       expect(screen.getByText('IF FOUND, PLEASE CONTACT:')).toBeInTheDocument();
       
       // Switch to Portuguese
       const languageToggle = screen.getByTestId('language-toggle');
       fireEvent.click(languageToggle);
       
       // Verify PT labels are now present
       expect(screen.getByText('Pré-visualização do Cartaz')).toBeInTheDocument();
       expect(screen.getByText('PROCURA-SE')).toBeInTheDocument();
       expect(screen.getByText('SE ENCONTRAR, ENTRE EM CONTATO:')).toBeInTheDocument();
       
       // Verify EN labels are gone
       expect(screen.queryByText('Poster Preview')).not.toBeInTheDocument();
       expect(screen.queryByText('LOST PET')).not.toBeInTheDocument();
       expect(screen.queryByText('IF FOUND, PLEASE CONTACT:')).not.toBeInTheDocument();
    });

    it('preserves pet data content across language changes', () => {
      renderWithLanguageControl(completePetData, 'pt');
      
      // Verify pet data is present in PT
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.getByText('Central Park, New York')).toBeInTheDocument();
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      
      // Switch to English
      const languageToggle = screen.getByTestId('language-toggle');
      fireEvent.click(languageToggle);
      
      // Verify pet data is still present in EN
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.getByText('Central Park, New York')).toBeInTheDocument();
      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });

    it('updates button functionality across languages', () => {
      renderWithLanguageControl(completePetData, 'pt');
      
      // Test WhatsApp share in PT
      const ptShareButton = screen.getByRole('button', { name: /compartilhar/i });
      fireEvent.click(ptShareButton);
      
             expect(window.open).toHaveBeenCalledTimes(1);
       let mockWindowOpen = window.open as ReturnType<typeof vi.fn>;
       let call = mockWindowOpen.mock.calls[0];
       let url = decodeURIComponent(call[0]);
       expect(url).toContain('PET PERDIDO');
       
       // Clear mocks and switch to English
       vi.clearAllMocks();
       const languageToggle = screen.getByTestId('language-toggle');
       fireEvent.click(languageToggle);
       
       // Test WhatsApp share in EN
       const enShareButton = screen.getByRole('button', { name: /share/i });
       fireEvent.click(enShareButton);
       
       expect(window.open).toHaveBeenCalledTimes(1);
       mockWindowOpen = window.open as ReturnType<typeof vi.fn>;
       call = mockWindowOpen.mock.calls[0];
       url = decodeURIComponent(call[0]);
      expect(url).toContain('LOST PET');
    });

    it('updates custom fields labels format across languages', () => {
      renderWithLanguageControl(completePetData, 'pt');
      
      // Verify custom fields in PT
      expect(screen.getByText('AGE:')).toBeInTheDocument();
      expect(screen.getByText('WEIGHT:')).toBeInTheDocument();
      expect(screen.getByText('3 years')).toBeInTheDocument();
      expect(screen.getByText('30kg')).toBeInTheDocument();
      
      // Switch to English
      const languageToggle = screen.getByTestId('language-toggle');
      fireEvent.click(languageToggle);
      
      // Verify custom fields still work in EN (labels are uppercase regardless)
      expect(screen.getByText('AGE:')).toBeInTheDocument();
      expect(screen.getByText('WEIGHT:')).toBeInTheDocument();
      expect(screen.getByText('3 years')).toBeInTheDocument();
      expect(screen.getByText('30kg')).toBeInTheDocument();
    });

    it('handles empty pet name correctly across languages', () => {
      const emptyNameData = { ...completePetData, petName: '' };
      renderWithLanguageControl(emptyNameData, 'pt');
      
             // Test WhatsApp share with empty name in PT
       const ptShareButton = screen.getByRole('button', { name: /compartilhar/i });
       fireEvent.click(ptShareButton);
       
       let mockWindowOpen = window.open as ReturnType<typeof vi.fn>;
       let call = mockWindowOpen.mock.calls[0];
       let url = decodeURIComponent(call[0]);
       expect(url).toContain('PET PERDIDO');
       
       // Clear mocks and switch to English
       vi.clearAllMocks();
       const languageToggle = screen.getByTestId('language-toggle');
       fireEvent.click(languageToggle);
       
       // Test WhatsApp share with empty name in EN
       const enShareButton = screen.getByRole('button', { name: /share/i });
       fireEvent.click(enShareButton);
       
       mockWindowOpen = window.open as ReturnType<typeof vi.fn>;
       call = mockWindowOpen.mock.calls[0];
       url = decodeURIComponent(call[0]);
      expect(url).toContain('Lost pet');
    });
  });

  describe('Dynamic Content Updates with Language', () => {
    it('maintains language when pet data is updated', () => {
      const { rerender } = renderWithLanguageControl(completePetData, 'en');
      
             // Verify we're in English
       expect(screen.getByText('Poster Preview')).toBeInTheDocument();
       expect(screen.getByText('Buddy')).toBeInTheDocument();
       
       // Update pet data
       const updatedData = { ...completePetData, petName: 'Max' };
       rerender(
         <TestWrapperWithLanguageControl initialLanguage="en">
           <PosterPreview petData={updatedData} />
         </TestWrapperWithLanguageControl>
       );
       
       // Verify language is maintained and data is updated
       expect(screen.getByText('Poster Preview')).toBeInTheDocument();
       expect(screen.getByText('Max')).toBeInTheDocument();
      expect(screen.queryByText('Buddy')).not.toBeInTheDocument();
    });

    it('updates reward section translation when reward is added', () => {
      const noRewardData = { ...completePetData, reward: '' };
      const { rerender } = renderWithLanguageControl(noRewardData, 'en');
      
             // Verify no reward section initially
       expect(screen.queryByText('🎁 REWARD:')).not.toBeInTheDocument();
       
       // Add reward
       const withRewardData = { ...completePetData, reward: '$500' };
       rerender(
         <TestWrapperWithLanguageControl initialLanguage="en">
           <PosterPreview petData={withRewardData} />
         </TestWrapperWithLanguageControl>
       );
       
       // Verify reward section appears in English
       expect(screen.getByText('🎁 REWARD:')).toBeInTheDocument();
       expect(screen.getByText('$500')).toBeInTheDocument();
    });
  });
}); 