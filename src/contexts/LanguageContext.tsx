
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
    'whatsapp.message': '🚨 PROCURA-SE: {name} 🚨\n\n{details}\n\n🙏 Ajudem a compartilhar para encontrarmos nosso amigo!'
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
    'whatsapp.message': '🚨 MISSING: {name} 🚨\n\n{details}\n\n🙏 Please help share to find our friend!'
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
