import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traduções
const translations = {
  pt: {
    'app.title': '🐾 Encontre Meu Amigo',
    'app.subtitle': 'Crie um cartaz de procura-se para o seu pet perdido. Vamos ajudar você a espalhar a notícia e encontrar seu melhor amigo.',
    'poster.title': 'PROCURA-SE',
    'poster.preview': 'Visualização do Cartaz',
    'poster.download': 'Baixar',
    'poster.share': 'Compartilhar no WhatsApp',
    'poster.lost_at': 'PERDIDO EM:',
    'poster.lost_time': 'HORÁRIO QUE SE PERDEU:',
    'poster.description': 'DESCRIÇÃO DO PET:',
    'poster.accessories': 'ACESSÓRIOS:',
    'poster.reward': 'RECOMPENSA:',
    'poster.contact': 'SE ENCONTRAR, ENTRE EM CONTATO:',
    'poster.share_message': '🙏 Por favor, compartilhe para ajudar a encontrar nosso amigo!',
    'whatsapp.message': '🚨 PROCURA-SE: {name} 🚨\n\n{details}\n\n🙏 Ajudem a compartilhar para encontrarmos nosso amigo!',
    'editor.title': 'Informações do Seu Pet',
    'editor.photos': 'Fotos do Pet',
    'editor.photos_max': 'máximo 3',
    'editor.photos_limit': 'Máximo de 3 fotos atingido',
    'editor.add_photos': 'Adicionar Fotos',
    'editor.owner_name': 'Nome do Dono',
    'editor.owner_name_placeholder': 'Seu nome',
    'editor.owner_phone': 'Telefone de Contato',
    'editor.owner_phone_placeholder': '(11) 99999-9999',
    'editor.pet_name': 'Nome do Pet',
    'editor.pet_name_placeholder': 'Nome do seu pet',
    'editor.last_seen': 'Endereço onde foi visto pela última vez',
    'editor.last_seen_placeholder': 'Rua, bairro, cidade onde o pet se perdeu',
    'editor.additional_info': 'Informações Adicionais (Opcional)',
    'editor.lost_time': 'Horário aproximado que se perdeu',
    'editor.lost_time_placeholder': 'Ex: Por volta das 14h',
    'editor.pet_description': 'Descrição do Pet (manchas, características especiais)',
    'editor.pet_description_placeholder': 'Descreva as características do seu pet, como manchas, tamanho, etc.',
    'editor.accessories': 'Acessórios (coleira, etc.)',
    'editor.accessories_placeholder': 'Ex: Coleira vermelha, sem plaquinha',
    'editor.reward': 'Recompensa',
    'editor.reward_placeholder': 'Ex: R$ 200,00 de recompensa',
    'editor.custom_fields': 'Campos Personalizados',
    'editor.add_field': 'Adicionar Campo',
    'editor.field_name': 'Nome do campo',
    'editor.field_value': 'Valor'
  },
  en: {
    'app.title': '🐾 Find My Friend',
    'app.subtitle': 'Create a missing pet poster. Let\'s help you spread the word and find your best friend.',
    'poster.title': 'MISSING',
    'poster.preview': 'Poster Preview',
    'poster.download': 'Download',
    'poster.share': 'Share on WhatsApp',
    'poster.lost_at': 'LAST SEEN AT:',
    'poster.lost_time': 'TIME LOST:',
    'poster.description': 'PET DESCRIPTION:',
    'poster.accessories': 'ACCESSORIES:',
    'poster.reward': 'REWARD:',
    'poster.contact': 'IF FOUND, PLEASE CONTACT:',
    'poster.share_message': '🙏 Please share to help find our friend!',
    'whatsapp.message': '🚨 MISSING: {name} 🚨\n\n{details}\n\n🙏 Please help share to find our friend!',
    'editor.title': 'Pet Information',
    'editor.photos': 'Pet Photos',
    'editor.photos_max': 'maximum 3',
    'editor.photos_limit': 'Maximum of 3 photos reached',
    'editor.add_photos': 'Add Photos',
    'editor.owner_name': 'Owner Name',
    'editor.owner_name_placeholder': 'Your name',
    'editor.owner_phone': 'Contact Phone',
    'editor.owner_phone_placeholder': '(555) 123-4567',
    'editor.pet_name': 'Pet Name',
    'editor.pet_name_placeholder': 'Your pet\'s name',
    'editor.last_seen': 'Address where last seen',
    'editor.last_seen_placeholder': 'Street, neighborhood, city where the pet was lost',
    'editor.additional_info': 'Additional Information (Optional)',
    'editor.lost_time': 'Approximate time lost',
    'editor.lost_time_placeholder': 'Ex: Around 2 PM',
    'editor.pet_description': 'Pet Description (spots, special characteristics)',
    'editor.pet_description_placeholder': 'Describe your pet\'s characteristics, like spots, size, etc.',
    'editor.accessories': 'Accessories (collar, etc.)',
    'editor.accessories_placeholder': 'Ex: Red collar, no tag',
    'editor.reward': 'Reward',
    'editor.reward_placeholder': 'Ex: $200 reward',
    'editor.custom_fields': 'Custom Fields',
    'editor.add_field': 'Add Field',
    'editor.field_name': 'Field name',
    'editor.field_value': 'Value'
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
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
