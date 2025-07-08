
import React, { useState, useEffect } from 'react';
import { WelcomePopup } from '@/components/WelcomePopup';
import { PosterEditor } from '@/components/PosterEditor';
import { PosterPreview } from '@/components/PosterPreview';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {showWelcome && <WelcomePopup onClose={() => setShowWelcome(false)} />}
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🐾 Encontre Meu Amigo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Crie um cartaz de procura-se para o seu pet perdido. 
            Vamos ajudar você a espalhar a notícia e encontrar seu melhor amigo.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="order-2 lg:order-1">
            <PosterEditor petData={petData} setPetData={setPetData} />
          </div>
          
          <div className="order-1 lg:order-2 sticky top-8">
            <PosterPreview petData={petData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
