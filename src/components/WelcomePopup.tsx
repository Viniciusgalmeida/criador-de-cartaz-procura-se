
import React from 'react';
import { X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomePopupProps {
  onClose: () => void;
}

export const WelcomePopup = ({ onClose }: WelcomePopupProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-2xl relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center">
          <div className="mb-6">
            <Heart className="mx-auto text-pink-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Uma mensagem especial
            </h2>
          </div>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            Sinto muito que você tenha que usar este serviço. Ficar sem o nosso melhor amigo 
            é algo que aperta o coração. Estou torcendo para que o encontre logo.
          </p>
          
          <Button 
            onClick={onClose}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Vamos começar 🐾
          </Button>
        </div>
      </div>
    </div>
  );
};
