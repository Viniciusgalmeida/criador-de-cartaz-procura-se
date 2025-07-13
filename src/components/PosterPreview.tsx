import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { PetData } from '@/pages/Index';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import html2canvas from 'html2canvas';

interface PosterPreviewProps {
  petData: PetData;
  onValidate?: () => boolean;
}

export const PosterPreview = ({
  petData,
  onValidate
}: PosterPreviewProps) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  const downloadPoster = async () => {
    // Validar campos obrigatórios antes de baixar
    if (onValidate && !onValidate()) {
      // Se validação falhar, não prosseguir com o download
      return;
    }
    
    if (posterRef.current) {
      try {
        // Pequeno delay para garantir que o DOM esteja completamente renderizado
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Obter dimensões reais exibidas na tela
        const rect = posterRef.current.getBoundingClientRect();
        const displayWidth = rect.width;
        const displayHeight = rect.height;
        
        // Verificar se as dimensões são válidas
        if (displayWidth === 0 || displayHeight === 0) {
          console.warn('Dimensões inválidas detectadas');
          throw new Error('Dimensões inválidas para captura');
        }
        
        console.log('Capturando poster com dimensões exatas da tela:', { displayWidth, displayHeight });
        
        // Configurações simples para html2canvas - captura exata do que está na tela
        const canvas = await html2canvas(posterRef.current, {
          backgroundColor: '#ffffff',
          scale: 2, // Qualidade alta (2x resolution)
          useCORS: true,
          allowTaint: false,
          // Não forçar dimensões - usar as dimensões naturais do elemento
          width: displayWidth,
          height: displayHeight,
          // Posicionamento exato
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          // Manter as proporções da janela
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight
        });
        
        console.log('Canvas gerado com sucesso:', { 
          canvasWidth: canvas.width, 
          canvasHeight: canvas.height,
          aspectRatio: canvas.width / canvas.height
        });
        
        // Criar link de download
        const link = document.createElement('a');
        link.download = `cartaz-${petData.petName ? petData.petName.replace(/[^a-zA-Z0-9]/g, '-') : 'pet'}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        
        // Iniciar download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('Download do cartaz concluído com sucesso');
      } catch (error) {
        console.error('Erro ao gerar download do cartaz:', error);
        // Fallback silencioso - usuário pode tentar novamente
      }
    }
  };



  const renderPhotos = () => {
    const photos = petData.photos;
    if (photos.length === 0) return null;

    if (photos.length === 1) {
      // Uma foto: grande e centralizada, preservando proporções
      return (
        <div className="flex justify-center mb-6">
          <div className="max-w-80 max-h-80 flex items-center justify-center">
            <img 
              src={photos[0]} 
              alt="Pet" 
              className="max-w-full max-h-full object-contain rounded-lg border-2 border-gray-300" 
            />
          </div>
        </div>
      );
    }

    if (photos.length === 2) {
      // Duas fotos: lado a lado centralizadas, preservando proporções
      return (
        <div className="flex justify-center gap-4 mb-6">
          {photos.slice(0, 2).map((photo, index) => (
            <div key={index} className="max-w-64 max-h-64 flex items-center justify-center">
              <img 
                src={photo} 
                alt={`Pet ${index + 1}`} 
                className="max-w-full max-h-full object-contain rounded-lg border-2 border-gray-300" 
              />
            </div>
          ))}
        </div>
      );
    }

    if (photos.length >= 3) {
      // Três fotos: primeira à esquerda centralizada verticalmente, duas à direita menores empilhadas
      return (
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="max-w-64 max-h-80 flex items-center justify-center">
            <img 
              src={photos[0]} 
              alt="Pet 1" 
              className="max-w-full max-h-full object-contain rounded-lg border-2 border-gray-300" 
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="max-w-48 max-h-38 flex items-center justify-center">
              <img 
                src={photos[1]} 
                alt="Pet 2" 
                className="max-w-full max-h-full object-contain rounded-lg border-2 border-gray-300" 
              />
            </div>
            <div className="max-w-48 max-h-38 flex items-center justify-center">
              <img 
                src={photos[2]} 
                alt="Pet 3" 
                className="max-w-full max-h-full object-contain rounded-lg border-2 border-gray-300" 
              />
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-800 flex items-center gap-2 text-left">
          {t('poster.preview')}
        </CardTitle>
        <div className="flex gap-2">
          <Button onClick={downloadPoster} variant="outline" size="sm">
            <Download className="mr-2" size={16} />
            {t('poster.download')}
          </Button>
          <LanguageSelector />
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={posterRef} 
          data-poster-ref
          className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg" 
          style={{
            width: '100%',
            maxWidth: '1080px'
          }}
        >
          {/* Poster Content */}
          <div className="flex flex-col p-6 relative min-h-fit">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-4xl md:text-6xl font-black text-red-600 mb-2 tracking-wider">
                {t('poster.title')}
              </h1>
            </div>

            {/* Photos */}
            {renderPhotos()}

            {/* Pet Info */}
            <div className="flex-1 space-y-3 text-gray-800">
              {petData.petName && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-purple-700">
                    {petData.petName}
                  </h2>
                </div>
              )}

              {petData.lastSeenAddress && (
                <div>
                  <span className="font-bold text-red-600">📍 {t('poster.lost_at')} </span>
                  <span className="text-lg">{petData.lastSeenAddress}</span>
                </div>
              )}

              {petData.lostTime && (
                <div>
                  <span className="font-bold text-red-600">🕐 {t('poster.lost_time')} </span>
                  <span>{petData.lostTime}</span>
                </div>
              )}

              {petData.petDescription && (
                <div>
                  <span className="font-bold text-red-600">📝 {t('poster.description')} </span>
                  <span>{petData.petDescription}</span>
                </div>
              )}

              {petData.accessories && (
                <div>
                  <span className="font-bold text-red-600">🎯 {t('poster.accessories')} </span>
                  <span>{petData.accessories}</span>
                </div>
              )}

              {petData.customFields.map((field, index) => 
                field.label && field.value && (
                  <div key={index}>
                    <span className="font-bold text-red-600">
                      {field.label.toUpperCase()}:{' '}
                    </span>
                    <span>{field.value}</span>
                  </div>
                )
              )}

              {petData.reward && (
                <div className="bg-yellow-100 p-3 rounded-lg border-2 border-yellow-400 text-center">
                  <span className="font-bold text-green-700">🎁 {t('poster.reward')} </span>
                  <span className="text-lg font-bold text-green-700">{petData.reward}</span>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="mt-6 pt-4 border-t-2 border-red-600 bg-red-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-lg font-bold text-red-700 mb-2">
                  {t('poster.contact')}
                </p>
                {petData.ownerName && (
                  <p className="text-xl font-bold text-gray-800">{petData.ownerName}</p>
                )}
                {petData.ownerPhone && (
                  <p className="text-2xl font-black text-red-600">{petData.ownerPhone}</p>
                )}
              </div>
            </div>

            {/* Footer with site link */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                Feito no Criador de Cartaz Procura-se - <a href="https://criador-de-cartaz-procura-se.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">https://criador-de-cartaz-procura-se.vercel.app</a>
              </p>
            </div>


          </div>
        </div>
      </CardContent>
    </Card>
  );
};
