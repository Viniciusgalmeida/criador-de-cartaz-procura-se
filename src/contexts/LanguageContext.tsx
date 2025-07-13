import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    'app.title': 'Gerador de Cartaz para Pet Perdido',
    'app.subtitle': 'Crie um cartaz personalizado para ajudar a encontrar seu pet perdido',
    'editor.title': 'Informações do Seu Pet',
    'editor.photos': 'Fotos do Pet',
    'editor.photos_max': 'máximo 3 fotos',
    'editor.photos_limit': 'Limite de fotos atingido',
    'editor.add_photos': 'Adicionar Fotos',
    'editor.owner_name': 'Nome do Responsável',
    'editor.owner_name_placeholder': 'Digite seu nome completo',
    'editor.owner_phone': 'Telefone para Contato',
    'editor.owner_phone_placeholder': 'Digite seu telefone',
    'editor.pet_name': 'Nome do Pet',
    'editor.pet_name_placeholder': 'Digite o nome do seu pet',
    'editor.last_seen': 'Último Local Visto',
    'editor.last_seen_placeholder': 'Digite a rua, bairro, cidade, etc.',
    'editor.additional_info': 'Informações Adicionais (Opcional)',
    'editor.lost_time': 'Data e Horário que se perdeu',
    'editor.lost_time_placeholder': 'Ex: 15/01/2024 às 14h30',
    'editor.pet_description': 'Descrição do Pet',
    'editor.pet_description_placeholder': 'Descreva características físicas, comportamento, etc.',
    'editor.accessories': 'Acessórios/Coleira',
    'editor.accessories_placeholder': 'Coleira vermelha, plaquinha, etc.',
    'editor.reward': 'Recompensa',
    'editor.reward_placeholder': 'Ofereça uma recompensa se desejar',
    'editor.custom_fields': 'Campos Personalizados',
    'editor.add_field': 'Adicionar Campo',
    'editor.field_name': 'Nome do campo',
    'editor.field_value': 'Valor do campo',
    'poster.preview': 'Pré-visualização do Cartaz',
    'poster.download': 'Baixar',
    
    'poster.title': 'PROCURA-SE',
    'poster.lost_at': 'Perdido em:',
    'poster.lost_time': 'Quando:',
    'poster.description': 'Descrição:',
    'poster.accessories': 'Acessórios:',
    'poster.reward': 'RECOMPENSA:',
    'poster.contact': 'SE ENCONTRAR, ENTRE EM CONTATO:',
    
    // Validation messages
    'validation.required': 'Preenchimento obrigatório',
    
  },
  en: {
    'app.title': 'Lost Pet Poster Generator',
    'app.subtitle': 'Create a personalized poster to help find your lost pet',
    'editor.title': 'Your Pet Information',
    'editor.photos': 'Pet Photos',
    'editor.photos_max': 'maximum 3 photos',
    'editor.photos_limit': 'Photo limit reached',
    'editor.add_photos': 'Add Photos',
    'editor.owner_name': 'Owner Name',
    'editor.owner_name_placeholder': 'Enter your full name',
    'editor.owner_phone': 'Contact Phone',
    'editor.owner_phone_placeholder': 'Enter your phone number',
    'editor.pet_name': 'Pet Name',
    'editor.pet_name_placeholder': 'Enter your pet name',
    'editor.last_seen': 'Last Seen Location',
    'editor.last_seen_placeholder': 'Enter where it was last seen',
    'editor.additional_info': 'Additional Information (Optional)',
    'editor.lost_time': 'Date and Time Lost',
    'editor.lost_time_placeholder': 'Ex: 01/15/2024 at 2:30 PM',
    'editor.pet_description': 'Pet Description',
    'editor.pet_description_placeholder': 'Describe physical characteristics, behavior, etc.',
    'editor.accessories': 'Accessories/Collar',
    'editor.accessories_placeholder': 'Red collar, name tag, etc.',
    'editor.reward': 'Reward',
    'editor.reward_placeholder': 'Offer a reward if desired',
    'editor.custom_fields': 'Custom Fields',
    'editor.add_field': 'Add Field',
    'editor.field_name': 'Field name',
    'editor.field_value': 'Field value',
    'poster.preview': 'Poster Preview',
    'poster.download': 'Download',
    
    'poster.title': 'LOST PET',
    'poster.lost_at': 'Lost at:',
    'poster.lost_time': 'When:',
    'poster.description': 'Description:',
    'poster.accessories': 'Accessories:',
    'poster.reward': 'REWARD:',
    'poster.contact': 'IF FOUND, PLEASE CONTACT:',
    
    // Validation messages
    'validation.required': 'Required field',
    
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage or default to 'pt'
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const savedLanguage = localStorage.getItem('preferredLanguage');
      return (savedLanguage === 'pt' || savedLanguage === 'en') ? savedLanguage : 'pt';
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
      return 'pt';
    }
  });

  // Update localStorage when language changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('preferredLanguage', lang);
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
  };

  // Sync language across tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'preferredLanguage') {
        const newLang = event.newValue;
        if (newLang === 'pt' || newLang === 'en') {
          setLanguageState(newLang);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['pt']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
