
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { PetData } from '@/pages/Index';

interface PosterPreviewProps {
  petData: PetData;
}

export const PosterPreview = ({ petData }: PosterPreviewProps) => {
  const posterRef = useRef<HTMLDivElement>(null);

  const downloadPoster = () => {
    if (posterRef.current) {
      // Aqui você pode implementar a funcionalidade de download
      // Por exemplo, usando html2canvas
      console.log('Download functionality would be implemented here');
    }
  };

  const sharePoster = () => {
    if (navigator.share) {
      navigator.share({
        title: `PROCURA-SE: ${petData.petName || 'Pet perdido'}`,
        text: `Ajude a encontrar ${petData.petName || 'este pet'}! Perdido em ${petData.lastSeenAddress}`,
      });
    }
  };

  const renderPhotos = () => {
    const photos = petData.photos;
    
    if (photos.length === 0) return null;
    
    if (photos.length === 1) {
      // Uma foto: grande e centralizada
      return (
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src={photos[0]}
              alt="Pet"
              className="w-80 h-80 object-cover rounded-2xl shadow-2xl border-4 border-white"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      );
    }
    
    if (photos.length === 2) {
      // Duas fotos: lado a lado centralizadas
      return (
        <div className="flex justify-center gap-6 mb-8">
          {photos.slice(0, 2).map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={photo}
                alt={`Pet ${index + 1}`}
                className="w-48 h-48 object-cover rounded-2xl shadow-xl border-4 border-white"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          ))}
        </div>
      );
    }
    
    if (photos.length >= 3) {
      // Três fotos: primeira à esquerda grande, duas à direita menores empilhadas
      return (
        <div className="flex justify-center gap-6 mb-8">
          <div className="relative">
            <img
              src={photos[0]}
              alt="Pet 1"
              className="w-64 h-80 object-cover rounded-2xl shadow-2xl border-4 border-white"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <img
                src={photos[1]}
                alt="Pet 2"
                className="w-48 h-38 object-cover rounded-2xl shadow-xl border-4 border-white"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="relative">
              <img
                src={photos[2]}
                alt="Pet 3"
                className="w-48 h-38 object-cover rounded-2xl shadow-xl border-4 border-white"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
          👀 Visualização do Cartaz
        </CardTitle>
        <div className="flex gap-2">
          <Button onClick={downloadPoster} variant="outline" size="sm">
            <Download className="mr-2" size={16} />
            Baixar
          </Button>
          <Button onClick={sharePoster} variant="outline" size="sm">
            <Share2 className="mr-2" size={16} />
            Compartilhar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={posterRef}
          className="bg-gradient-to-br from-white via-gray-50 to-white border-0 rounded-3xl overflow-hidden shadow-2xl"
          style={{ width: '100%', maxWidth: '1080px' }}
        >
          {/* Poster Content */}
          <div className="flex flex-col p-8 relative min-h-fit">
            {/* Modern Header with Gradient */}
            <div className="text-center mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 rounded-2xl opacity-10"></div>
              <div className="relative py-6 px-8">
                <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-red-600 via-pink-600 to-red-700 bg-clip-text text-transparent mb-2 tracking-tight">
                  PROCURA-SE
                </h1>
                <div className="h-1 bg-gradient-to-r from-red-500 to-pink-500 w-32 mx-auto rounded-full"></div>
              </div>
            </div>

            {/* Photos */}
            {renderPhotos()}

            {/* Pet Info with Modern Cards */}
            <div className="flex-1 space-y-4 text-gray-800">
              {petData.petName && (
                <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {petData.petName}
                  </h2>
                </div>
              )}

              {petData.lastSeenAddress && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-red-100">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 rounded-full p-2 flex-shrink-0">
                      <span className="text-red-600 text-xl">📍</span>
                    </div>
                    <div>
                      <span className="font-bold text-red-600 text-sm uppercase tracking-wide">PERDIDO EM</span>
                      <p className="text-lg font-medium text-gray-800 mt-1">{petData.lastSeenAddress}</p>
                    </div>
                  </div>
                </div>
              )}

              {petData.lostTime && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-orange-100">
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
                      <span className="text-orange-600 text-xl">🕐</span>
                    </div>
                    <div>
                      <span className="font-bold text-orange-600 text-sm uppercase tracking-wide">HORÁRIO</span>
                      <p className="text-lg font-medium text-gray-800 mt-1">{petData.lostTime}</p>
                    </div>
                  </div>
                </div>
              )}

              {petData.petDescription && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                      <span className="text-blue-600 text-xl">📝</span>
                    </div>
                    <div>
                      <span className="font-bold text-blue-600 text-sm uppercase tracking-wide">DESCRIÇÃO</span>
                      <p className="text-lg font-medium text-gray-800 mt-1">{petData.petDescription}</p>
                    </div>
                  </div>
                </div>
              )}

              {petData.accessories && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-green-100">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                      <span className="text-green-600 text-xl">🎯</span>
                    </div>
                    <div>
                      <span className="font-bold text-green-600 text-sm uppercase tracking-wide">ACESSÓRIOS</span>
                      <p className="text-lg font-medium text-gray-800 mt-1">{petData.accessories}</p>
                    </div>
                  </div>
                </div>
              )}

              {petData.customFields.map((field, index) => (
                field.label && field.value && (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-indigo-100">
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 rounded-full p-2 flex-shrink-0">
                        <span className="text-indigo-600 text-xl">ℹ️</span>
                      </div>
                      <div>
                        <span className="font-bold text-indigo-600 text-sm uppercase tracking-wide">{field.label}</span>
                        <p className="text-lg font-medium text-gray-800 mt-1">{field.value}</p>
                      </div>
                    </div>
                  </div>
                )
              ))}

              {petData.reward && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 shadow-xl border-2 border-yellow-200">
                  <div className="flex items-center justify-center gap-3">
                    <div className="bg-yellow-200 rounded-full p-3">
                      <span className="text-yellow-700 text-2xl">🎁</span>
                    </div>
                    <div className="text-center">
                      <span className="font-bold text-yellow-700 text-sm uppercase tracking-wide block">RECOMPENSA</span>
                      <span className="text-2xl font-black text-yellow-800">{petData.reward}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modern Contact Info */}
            <div className="mt-8 pt-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-2xl">
              <div className="text-center">
                <p className="text-lg font-bold mb-4 opacity-90">
                  SE ENCONTRAR, ENTRE EM CONTATO:
                </p>
                {petData.ownerName && (
                  <p className="text-xl font-bold mb-2">{petData.ownerName}</p>
                )}
                {petData.ownerPhone && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 inline-block">
                    <p className="text-2xl font-black">{petData.ownerPhone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modern Footer */}
            <div className="text-center mt-6">
              <div className="bg-gray-50 rounded-2xl p-4 inline-block">
                <p className="text-sm text-gray-600 font-medium">
                  🙏 Compartilhe para ajudar a encontrar nosso amigo!
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
