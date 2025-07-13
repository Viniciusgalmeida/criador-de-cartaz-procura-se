
import React, { useState, useEffect, useRef } from 'react';
import { WelcomePopup } from '@/components/WelcomePopup';
import { PosterEditor, PosterEditorRef } from '@/components/PosterEditor';
import { PosterPreview } from '@/components/PosterPreview';
import { useLanguage } from '@/contexts/LanguageContext';

export interface PetData {
  photos: string[];
  lastSeenAddress: string;
  lostTime: string;
  petName: string;
  petDescription: string;
  ownerName: string;
  ownerPhone: string;
  accessories: string;
  reward: string;
  customFields: { label: string; value: string }[];
}

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const { t } = useLanguage();
  const posterEditorRef = useRef<PosterEditorRef>(null);
  
  const [petData, setPetData] = useState<PetData>({
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
  });

  // Função para validar campos obrigatórios
  const validateRequiredFields = (): boolean => {
    return posterEditorRef.current?.validateRequiredFields() ?? false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {showWelcome && <WelcomePopup onClose={() => setShowWelcome(false)} />}
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 relative">          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('app.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('app.subtitle')}
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="order-2 lg:order-1">
            <PosterEditor 
              ref={posterEditorRef}
              petData={petData} 
              setPetData={setPetData} 
            />
          </div>
          
          <div className="order-1 lg:order-2 lg:sticky lg:top-8">
            <PosterPreview 
              petData={petData} 
              onValidate={validateRequiredFields}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
