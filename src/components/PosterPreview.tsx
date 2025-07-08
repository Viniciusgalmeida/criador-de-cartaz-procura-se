import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MessageCircle } from 'lucide-react';
import { PetData } from '@/pages/Index';
import { useLanguage } from '@/contexts/LanguageContext';

interface PosterPreviewProps {
  petData: PetData;
}

export const PosterPreview = ({
  petData
}: PosterPreviewProps) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  const downloadPoster = () => {
    if (posterRef.current) {
      // Aqui você pode implementar a funcionalidade de download
      // Por exemplo, usando html2canvas
      console.log('Download functionality would be implemented here');
    }
  };

  const shareWhatsApp = () => {
    const details = [
      petData.petName ? `${language === 'pt' ? 'Nome' : 'Name'}: ${petData.petName}` : '',
      petData.lastSeenAddress ? `📍 ${t('poster.lost_at')} ${petData.lastSeenAddress}` : '',
      petData.lostTime ? `🕐 ${t('poster.lost_time')} ${petData.lostTime}` : '',
      petData.petDescription ? `📝 ${t('poster.description')} ${petData.petDescription}` : '',
      petData.accessories ? `🎯 ${t('poster.accessories')} ${petData.accessories}` : '',
      petData.reward ? `🎁 ${t('poster.reward')} ${petData.reward}` : '',
      '',
      t('poster.contact'),
      petData.ownerName ? `👤 ${petData.ownerName}` : '',
      petData.ownerPhone ? `📱 ${petData.ownerPhone}` : ''
    ].filter(Boolean).join('\n');

    const message = t('whatsapp.message')
      .replace('{name}', petData.petName || (language === 'pt' ? 'Pet perdido' : 'Lost pet'))
      .replace('{details}', details);

    const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsAppUrl, '_blank');
  };

  const renderPhotos = () => {
    const photos = petData.photos;
    if (photos.length === 0) return null;

    if (photos.length === 1) {
      // Uma foto: grande e centralizada
      return (
        <div className="flex justify-center mb-6">
          <img 
            src={photos[0]} 
            alt="Pet" 
            className="w-80 h-80 object-cover rounded-lg border-2 border-gray-300" 
          />
        </div>
      );
    }

    if (photos.length === 2) {
      // Duas fotos: lado a lado centralizadas e maiores
      return (
        <div className="flex justify-center gap-4 mb-6">
          {photos.slice(0, 2).map((photo, index) => (
            <img 
              key={index}
              src={photo} 
              alt={`Pet ${index + 1}`} 
              className="w-64 h-64 object-cover rounded-lg border-2 border-gray-300" 
            />
          ))}
        </div>
      );
    }

    if (photos.length >= 3) {
      // Três fotos: primeira à esquerda centralizada verticalmente, duas à direita menores empilhadas
      return (
        <div className="flex justify-center items-center gap-4 mb-6">
          <img 
            src={photos[0]} 
            alt="Pet 1" 
            className="w-64 h-80 object-cover rounded-lg border-2 border-gray-300" 
          />
          <div className="flex flex-col gap-4">
            <img 
              src={photos[1]} 
              alt="Pet 2" 
              className="w-48 h-38 object-cover rounded-lg border-2 border-gray-300" 
            />
            <img 
              src={photos[2]} 
              alt="Pet 3" 
              className="w-48 h-38 object-cover rounded-lg border-2 border-gray-300" 
            />
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
          <Button onClick={shareWhatsApp} variant="outline" size="sm">
            <MessageCircle className="mr-2" size={16} />
            {t('poster.share')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={posterRef} 
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
              <div className="h-1 bg-red-600 w-full mb-4"></div>
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

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 italic">
                {t('poster.share_message')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
