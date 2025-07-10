import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PosterPreview } from '@/components/PosterPreview';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { PetData } from '@/pages/Index';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn(() => Promise.resolve({
    toDataURL: vi.fn(() => 'data:image/png;base64,mock-canvas-data')
  }))
}));

// Mock global functions
Object.defineProperty(window, 'open', {
  value: vi.fn(),
  writable: true,
});

// Mock URL.createObjectURL for file uploads
global.URL.createObjectURL = vi.fn(() => 'mock-url');

const mockConsoleLog = vi.fn();
console.log = mockConsoleLog;

// Mock useRef to avoid refs issues in tests
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: () => ({ current: document.createElement('div') }),
  };
});

// Helper function to render with LanguageProvider
const renderWithLanguageProvider = (petData: PetData, language: 'pt' | 'en' = 'pt') => {
  return render(
    <LanguageProvider>
      <PosterPreview petData={petData} />
    </LanguageProvider>
  );
};

// Empty pet data
const emptyPetData: PetData = {
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

// Minimal pet data with required fields
const minimalPetData: PetData = {
  photos: [],
  lastSeenAddress: 'Rua das Flores, 123',
  lostTime: '',
  petName: 'Rex',
  petDescription: '',
  ownerName: 'João Silva',
  ownerPhone: '(11) 99999-9999',
  accessories: '',
  reward: '',
  customFields: []
};

// Complete pet data
const completePetData: PetData = {
  photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
  lastSeenAddress: 'Parque do Ibirapuera, São Paulo',
  lostTime: 'Hoje pela manhã, às 08:30',
  petName: 'Bella',
  petDescription: 'Cachorra de porte médio, muito carinhosa e brincalhona',
  ownerName: 'Maria Santos',
  ownerPhone: '(11) 98765-4321',
  accessories: 'Coleira vermelha com plaquinha',
  reward: 'R$ 500,00',
  customFields: [
    { label: 'Idade', value: '3 anos' },
    { label: 'Peso', value: '15kg' },
    { label: 'Castrado', value: 'Sim' }
  ]
};

describe('PosterPreview Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders preview title and buttons', () => {
      renderWithLanguageProvider(emptyPetData);
      
      expect(screen.getByText('Pré-visualização do Cartaz')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /baixar/i })).toBeInTheDocument();
    });

    it('renders poster title "PROCURA-SE"', () => {
      renderWithLanguageProvider(emptyPetData);
      
      expect(screen.getByText('PROCURA-SE')).toBeInTheDocument();
    });

    it('renders contact section', () => {
      renderWithLanguageProvider(emptyPetData);
      
      expect(screen.getByText('SE ENCONTRAR, ENTRE EM CONTATO:')).toBeInTheDocument();
    });


  });

  describe('Pet Information Rendering', () => {
    it('renders pet name when provided', () => {
      renderWithLanguageProvider(minimalPetData);
      
      expect(screen.getByText('Rex')).toBeInTheDocument();
    });

    it('renders last seen address when provided', () => {
      renderWithLanguageProvider(minimalPetData);
      
      expect(screen.getByText('Rua das Flores, 123')).toBeInTheDocument();
      expect(screen.getByText('📍 Perdido em:')).toBeInTheDocument();
    });

    it('renders lost time when provided', () => {
      renderWithLanguageProvider(completePetData);
      
      expect(screen.getByText('Hoje pela manhã, às 08:30')).toBeInTheDocument();
      expect(screen.getByText('🕐 Quando:')).toBeInTheDocument();
    });

    it('renders pet description when provided', () => {
      renderWithLanguageProvider(completePetData);
      
      expect(screen.getByText('Cachorra de porte médio, muito carinhosa e brincalhona')).toBeInTheDocument();
      expect(screen.getByText('📝 Descrição:')).toBeInTheDocument();
    });

    it('renders accessories when provided', () => {
      renderWithLanguageProvider(completePetData);
      
      expect(screen.getByText('Coleira vermelha com plaquinha')).toBeInTheDocument();
      expect(screen.getByText('🎯 Acessórios:')).toBeInTheDocument();
    });

    it('renders reward with special styling when provided', () => {
      renderWithLanguageProvider(completePetData);
      
      expect(screen.getByText('R$ 500,00')).toBeInTheDocument();
      expect(screen.getByText('🎁 RECOMPENSA:')).toBeInTheDocument();
    });

    it('renders custom fields when provided', () => {
      renderWithLanguageProvider(completePetData);
      
      expect(screen.getByText('IDADE:')).toBeInTheDocument();
      expect(screen.getByText('3 anos')).toBeInTheDocument();
      expect(screen.getByText('PESO:')).toBeInTheDocument();
      expect(screen.getByText('15kg')).toBeInTheDocument();
      expect(screen.getByText('CASTRADO:')).toBeInTheDocument();
      expect(screen.getByText('Sim')).toBeInTheDocument();
    });

    it('does not render empty fields', () => {
      renderWithLanguageProvider(minimalPetData);
      
      expect(screen.queryByText('📝 Descrição:')).not.toBeInTheDocument();
      expect(screen.queryByText('🎯 Acessórios:')).not.toBeInTheDocument();
      expect(screen.queryByText('🎁 RECOMPENSA:')).not.toBeInTheDocument();
      expect(screen.queryByText('🕐 Quando:')).not.toBeInTheDocument();
    });
  });

  describe('Contact Information', () => {
    it('renders owner name when provided', () => {
      renderWithLanguageProvider(minimalPetData);
      
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    it('renders owner phone when provided', () => {
      renderWithLanguageProvider(minimalPetData);
      
      expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument();
    });

    it('renders contact section even without owner info', () => {
      renderWithLanguageProvider(emptyPetData);
      
      expect(screen.getByText('SE ENCONTRAR, ENTRE EM CONTATO:')).toBeInTheDocument();
    });
  });

  describe('Photo Rendering', () => {
    it('does not render photos section when no photos provided', () => {
      renderWithLanguageProvider(emptyPetData);
      
      const images = screen.queryAllByRole('img');
      expect(images).toHaveLength(0);
    });

    it('renders single photo correctly', () => {
      const singlePhotoData = { ...emptyPetData, photos: ['photo1.jpg'] };
      renderWithLanguageProvider(singlePhotoData);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1);
      expect(images[0]).toHaveAttribute('src', 'photo1.jpg');
      expect(images[0]).toHaveAttribute('alt', 'Pet');
    });

    it('renders two photos correctly', () => {
      const twoPhotosData = { ...emptyPetData, photos: ['photo1.jpg', 'photo2.jpg'] };
      renderWithLanguageProvider(twoPhotosData);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', 'photo1.jpg');
      expect(images[0]).toHaveAttribute('alt', 'Pet 1');
      expect(images[1]).toHaveAttribute('src', 'photo2.jpg');
      expect(images[1]).toHaveAttribute('alt', 'Pet 2');
    });

    it('renders three photos correctly', () => {
      renderWithLanguageProvider(completePetData);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
      expect(images[0]).toHaveAttribute('src', 'photo1.jpg');
      expect(images[0]).toHaveAttribute('alt', 'Pet 1');
      expect(images[1]).toHaveAttribute('src', 'photo2.jpg');
      expect(images[1]).toHaveAttribute('alt', 'Pet 2');
      expect(images[2]).toHaveAttribute('src', 'photo3.jpg');
      expect(images[2]).toHaveAttribute('alt', 'Pet 3');
    });

    it('renders only first three photos when more than three provided', () => {
      const manyPhotosData = { 
        ...emptyPetData, 
        photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg'] 
      };
      renderWithLanguageProvider(manyPhotosData);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
    });
  });

  describe('Button Functionality', () => {
    it('calls download function when download button is clicked', async () => {
      renderWithLanguageProvider(completePetData);
      
      const downloadButton = screen.getByRole('button', { name: /baixar/i });
      fireEvent.click(downloadButton);
      
      // Wait for async operation to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify that html2canvas was called (mocked)
      const html2canvas = await import('html2canvas');
      expect(html2canvas.default).toHaveBeenCalled();
    });
  });

  describe('Data Updates', () => {
    it('updates preview when pet data changes', () => {
      const { rerender } = renderWithLanguageProvider(minimalPetData);
      
      expect(screen.getByText('Rex')).toBeInTheDocument();
      expect(screen.queryByText('Luna')).not.toBeInTheDocument();
      
      const updatedData = { ...minimalPetData, petName: 'Luna' };
      rerender(
        <LanguageProvider>
          <PosterPreview petData={updatedData} />
        </LanguageProvider>
      );
      
      expect(screen.getByText('Luna')).toBeInTheDocument();
      expect(screen.queryByText('Rex')).not.toBeInTheDocument();
    });

    it('adds reward section when reward is added', () => {
      const { rerender } = renderWithLanguageProvider(minimalPetData);
      
      expect(screen.queryByText('🎁 RECOMPENSA:')).not.toBeInTheDocument();
      
      const dataWithReward = { ...minimalPetData, reward: 'R$ 200,00' };
      rerender(
        <LanguageProvider>
          <PosterPreview petData={dataWithReward} />
        </LanguageProvider>
      );
      
      expect(screen.getByText('🎁 RECOMPENSA:')).toBeInTheDocument();
      expect(screen.getByText('R$ 200,00')).toBeInTheDocument();
    });

    it('updates photos when photo list changes', () => {
      const { rerender } = renderWithLanguageProvider(emptyPetData);
      
      expect(screen.queryAllByRole('img')).toHaveLength(0);
      
      const dataWithPhotos = { ...emptyPetData, photos: ['new-photo.jpg'] };
      rerender(
        <LanguageProvider>
          <PosterPreview petData={dataWithPhotos} />
        </LanguageProvider>
      );
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1);
      expect(images[0]).toHaveAttribute('src', 'new-photo.jpg');
    });
  });
}); 