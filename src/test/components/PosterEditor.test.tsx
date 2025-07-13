import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PosterEditor } from '@/components/PosterEditor';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { PetData } from '@/pages/Index';

// Mock das funções do componente
const mockSetPetData = vi.fn();

// Dados iniciais vazios
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

// Dados preenchidos para testes
const filledPetData: PetData = {
  photos: ['mock-photo-1.jpg', 'mock-photo-2.jpg'],
  lastSeenAddress: 'Parque Central',
  lostTime: '15/01/2024 às 14h30',
  petName: 'Rex',
  petDescription: 'Golden Retriever dourado, muito amigável',
  ownerName: 'João Silva',
  ownerPhone: '(11) 99999-9999',
  accessories: 'Coleira vermelha com plaquinha',
  reward: 'R$ 500,00',
  customFields: [
    { label: 'Idade', value: '5 anos' },
    { label: 'Castrado', value: 'Sim' }
  ]
};

// Componente wrapper com providers necessários
const renderWithProviders = (petData: PetData = initialPetData) => {
  return render(
    <LanguageProvider>
      <PosterEditor petData={petData} setPetData={mockSetPetData} />
    </LanguageProvider>
  );
};

describe('PosterEditor Component', () => {
  beforeEach(() => {
    mockSetPetData.mockClear();
    // Mock para URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-object-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  describe('Component Rendering', () => {
    it('renders the editor title correctly in Portuguese', () => {
      renderWithProviders();
      expect(screen.getByText('Informações do Seu Pet')).toBeInTheDocument();
    });

    it('renders all required fields with proper labels', () => {
      renderWithProviders();
      
      // Campos obrigatórios
      expect(screen.getByLabelText(/nome do pet/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/último local visto/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nome do responsável/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/telefone para contato/i)).toBeInTheDocument();
      expect(screen.getByText(/fotos do pet/i)).toBeInTheDocument();
    });

    it('renders all optional fields correctly', () => {
      renderWithProviders();
      
      // Campos opcionais
      expect(screen.getByLabelText(/data e horário que se perdeu/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/descrição do pet/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/acessórios\/coleira/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/recompensa/i)).toBeInTheDocument();
    });

    it('renders custom fields section', () => {
      renderWithProviders();
      
      expect(screen.getByText(/campos personalizados/i)).toBeInTheDocument();
      expect(screen.getByText(/adicionar campo/i)).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('calls setPetData when pet name is changed', () => {
      renderWithProviders();
      
      const petNameInput = screen.getByLabelText(/nome do pet/i);
      fireEvent.change(petNameInput, { target: { value: 'Rex' } });
      
      expect(mockSetPetData).toHaveBeenCalledWith({
        ...initialPetData,
        petName: 'Rex'
      });
    });

    it('calls setPetData when last seen address is changed', () => {
      renderWithProviders();
      
      const addressInput = screen.getByLabelText(/último local visto/i);
      fireEvent.change(addressInput, { target: { value: 'Parque Central' } });
      
      expect(mockSetPetData).toHaveBeenCalledWith({
        ...initialPetData,
        lastSeenAddress: 'Parque Central'
      });
    });

    it('calls setPetData when owner name is changed', () => {
      renderWithProviders();
      
      const ownerNameInput = screen.getByLabelText(/nome do responsável/i);
      fireEvent.change(ownerNameInput, { target: { value: 'João Silva' } });
      
      expect(mockSetPetData).toHaveBeenCalledWith({
        ...initialPetData,
        ownerName: 'João Silva'
      });
    });

    it('calls setPetData when owner phone is changed', () => {
      renderWithProviders();
      
      const phoneInput = screen.getByLabelText(/telefone para contato/i);
      fireEvent.change(phoneInput, { target: { value: '(11) 99999-9999' } });
      
      expect(mockSetPetData).toHaveBeenCalledWith({
        ...initialPetData,
        ownerPhone: '(11) 99999-9999'
      });
    });

    it('calls setPetData when pet description is changed', () => {
      renderWithProviders();
      
      const descriptionInput = screen.getByLabelText(/descrição do pet/i);
      fireEvent.change(descriptionInput, { target: { value: 'Golden Retriever amigável' } });
      
      expect(mockSetPetData).toHaveBeenCalledWith({
        ...initialPetData,
        petDescription: 'Golden Retriever amigável'
      });
    });
  });

  describe('Photo Upload Functionality', () => {
    it('displays photo upload button when no photos are uploaded', () => {
      renderWithProviders();
      
      const uploadButton = screen.getByText(/adicionar fotos/i);
      expect(uploadButton).toBeInTheDocument();
      expect(uploadButton).not.toBeDisabled();
    });

    it('handles photo upload correctly', async () => {
      renderWithProviders();
      
      const file = new File(['dummy content'], 'test-photo.jpg', { type: 'image/jpeg' });
      const input = screen.getByRole('button', { name: /adicionar fotos/i }).parentElement?.querySelector('input[type="file"]');
      
      expect(input).toBeInTheDocument();
      
      if (input) {
        Object.defineProperty(input, 'files', {
          value: [file],
          writable: false,
        });
        
        fireEvent.change(input);
        
        expect(mockSetPetData).toHaveBeenCalledWith({
          ...initialPetData,
          photos: ['mock-object-url']
        });
      }
    });

    it('displays uploaded photos with remove buttons', () => {
      renderWithProviders(filledPetData);
      
      // Verifica se as fotos são exibidas
      const photoImages = screen.getAllByAltText(/pet \d+/i);
      expect(photoImages).toHaveLength(2);
      
      // Verifica se os botões de remover estão presentes
      const removeButtons = screen.getAllByRole('button');
      const trashButtons = removeButtons.filter(button => 
        button.querySelector('svg') && button.className.includes('group-hover:opacity-100')
      );
      expect(trashButtons.length).toBeGreaterThan(0);
    });

    it('removes photo when remove button is clicked', () => {
      renderWithProviders(filledPetData);
      
      const removeButtons = screen.getAllByRole('button');
      const firstRemoveButton = removeButtons.find(button => 
        button.querySelector('svg') && button.className.includes('group-hover:opacity-100')
      );
      
      if (firstRemoveButton) {
        fireEvent.click(firstRemoveButton);
        
        expect(mockSetPetData).toHaveBeenCalledWith({
          ...filledPetData,
          photos: ['mock-photo-2.jpg']
        });
      }
    });

    it('disables upload button when 3 photos are uploaded', () => {
      const threePhotosData = {
        ...initialPetData,
        photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg']
      };
      
      renderWithProviders(threePhotosData);
      
      const uploadButton = screen.getByText(/limite de fotos atingido/i);
      expect(uploadButton).toBeInTheDocument();
      expect(uploadButton).toBeDisabled();
    });
  });

  describe('Custom Fields Functionality', () => {
    it('adds a new custom field when add button is clicked', () => {
      renderWithProviders();
      
      const addButton = screen.getByText(/adicionar campo/i);
      fireEvent.click(addButton);
      
      expect(mockSetPetData).toHaveBeenCalledWith({
        ...initialPetData,
        customFields: [{ label: '', value: '' }]
      });
    });

    it('displays existing custom fields', () => {
      renderWithProviders(filledPetData);
      
      // Verifica se os campos customizados são exibidos
      expect(screen.getByDisplayValue('Idade')).toBeInTheDocument();
      expect(screen.getByDisplayValue('5 anos')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Castrado')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Sim')).toBeInTheDocument();
    });

    it('updates custom field label', () => {
      renderWithProviders(filledPetData);
      
      const labelInput = screen.getByDisplayValue('Idade');
      fireEvent.change(labelInput, { target: { value: 'Idade do Pet' } });
      
      expect(mockSetPetData).toHaveBeenCalledWith({
        ...filledPetData,
        customFields: [
          { label: 'Idade do Pet', value: '5 anos' },
          { label: 'Castrado', value: 'Sim' }
        ]
      });
    });

    it('updates custom field value', () => {
      // Usa dados isolados para este teste específico
      const isolatedData = {
        ...initialPetData,
        customFields: [
          { label: 'Peso', value: '25kg' },
          { label: 'Cor', value: 'Marrom' }
        ]
      };
      
      renderWithProviders(isolatedData);
      
      const valueInput = screen.getByDisplayValue('25kg');
      fireEvent.change(valueInput, { target: { value: '30kg' } });
      
      expect(mockSetPetData).toHaveBeenCalledWith({
        ...isolatedData,
        customFields: [
          { label: 'Peso', value: '30kg' },
          { label: 'Cor', value: 'Marrom' }
        ]
      });
    });

    it('removes custom field when trash button is clicked', () => {
      renderWithProviders(filledPetData);
      
      // Encontra botões de lixeira para campos customizados
      const trashButtons = screen.getAllByRole('button');
      const customFieldTrashButton = trashButtons.find(button => 
        button.className.includes('text-red-500')
      );
      
      if (customFieldTrashButton) {
        fireEvent.click(customFieldTrashButton);
        
        expect(mockSetPetData).toHaveBeenCalledWith({
          ...filledPetData,
          customFields: [
            { label: 'Castrado', value: 'Sim' }
          ]
        });
      }
    });
  });

  describe('Form Validation States', () => {
    it('displays proper placeholders for all fields', () => {
      renderWithProviders();
      
      expect(screen.getByPlaceholderText(/digite o nome do seu pet/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Digite a rua, bairro, cidade, etc./i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/digite seu nome completo/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/digite seu telefone/i)).toBeInTheDocument();
    });

    it('shows current values in form fields', () => {
      renderWithProviders(filledPetData);
      
      expect(screen.getByDisplayValue('Rex')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Parque Central')).toBeInTheDocument();
      expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument();
      expect(screen.getByDisplayValue('(11) 99999-9999')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper labels associated with inputs', () => {
      renderWithProviders();
      
      const petNameInput = screen.getByLabelText(/nome do pet/i);
      expect(petNameInput).toHaveAttribute('id', 'petName');
      
      const addressInput = screen.getByLabelText(/último local visto/i);
      expect(addressInput).toHaveAttribute('id', 'lastSeenAddress');
    });

    it('marks required fields with asterisk', () => {
      renderWithProviders();
      
      expect(screen.getByText(/nome do pet \*/i)).toBeInTheDocument();
      expect(screen.getByText(/último local visto \*/i)).toBeInTheDocument();
      expect(screen.getByText(/nome do responsável \*/i)).toBeInTheDocument();
      expect(screen.getByText(/telefone para contato \*/i)).toBeInTheDocument();
    });
  });
}); 