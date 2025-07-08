import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { PetData } from '@/pages/Index';
interface PosterPreviewProps {
  petData: PetData;
}
export const PosterPreview = ({
  petData
}: PosterPreviewProps) => {
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
        text: `Ajude a encontrar ${petData.petName || 'este pet'}! Perdido em ${petData.lastSeenAddress}`
      });
    }
  };
  const renderPhotos = () => {
    const photos = petData.photos;
    if (photos.length === 0) return null;
    if (photos.length === 1) {
      // Uma foto: grande e centralizada
      return <div className="flex justify-center mb-6">
          <img src={photos[0]} alt="Pet" className="w-80 h-80 object-cover rounded-lg border-2 border-gray-300" />
        </div>;
    }
    if (photos.length === 2) {
      // Duas fotos: lado a lado centralizadas e maiores
      return <div className="flex justify-center gap-4 mb-6">
          {photos.slice(0, 2).map((photo, index) => <img key={index} src={photo} alt={`Pet ${index + 1}`} className="w-64 h-64 object-cover rounded-lg border-2 border-gray-300" />)}
        </div>;
    }
    if (photos.length >= 3) {
      // Três fotos: primeira à esquerda com altura total, duas à direita menores empilhadas
      return <div className="flex justify-center gap-4 mb-6">
          <img src={photos[0]} alt="Pet 1" className="w-64 h-80 object-cover rounded-lg border-2 border-gray-300" />
          <div className="flex flex-col gap-4">
            <img src={photos[1]} alt="Pet 2" className="w-48 h-38 object-cover rounded-lg border-2 border-gray-300" />
            <img src={photos[2]} alt="Pet 3" className="w-48 h-38 object-cover rounded-lg border-2 border-gray-300" />
          </div>
        </div>;
    }
  };
  return <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-800 flex items-center gap-2 text-left">Visualização do Cartaz</CardTitle>
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
        <div ref={posterRef} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg" style={{
        width: '100%',
        maxWidth: '1080px'
      }}>
          {/* Poster Content */}
          <div className="flex flex-col p-6 relative min-h-fit">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-4xl md:text-6xl font-black text-red-600 mb-2 tracking-wider">
                PROCURA-SE
              </h1>
              <div className="h-1 bg-red-600 w-full mb-4"></div>
            </div>

            {/* Photos */}
            {renderPhotos()}

            {/* Pet Info */}
            <div className="flex-1 space-y-3 text-gray-800">
              {petData.petName && <div className="text-center">
                  <h2 className="text-2xl font-bold text-purple-700">
                    {petData.petName}
                  </h2>
                </div>}

              {petData.lastSeenAddress && <div>
                  <span className="font-bold text-red-600">📍 PERDIDO EM: </span>
                  <span className="text-lg">{petData.lastSeenAddress}</span>
                </div>}

              {petData.lostTime && <div>
                  <span className="font-bold text-red-600">🕐 HORÁRIO QUE SE PERDEU: </span>
                  <span>{petData.lostTime}</span>
                </div>}

              {petData.petDescription && <div>
                  <span className="font-bold text-red-600">📝 DESCRIÇÃO: </span>
                  <span>{petData.petDescription}</span>
                </div>}

              {petData.accessories && <div>
                  <span className="font-bold text-red-600">🎯 ACESSÓRIOS: </span>
                  <span>{petData.accessories}</span>
                </div>}

              {petData.customFields.map((field, index) => field.label && field.value && <div key={index}>
                    <span className="font-bold text-red-600">{field.label.toUpperCase()}: </span>
                    <span>{field.value}</span>
                  </div>)}

              {petData.reward && <div className="bg-yellow-100 p-3 rounded-lg border-2 border-yellow-400">
                  <span className="font-bold text-green-700">🎁 RECOMPENSA: </span>
                  <span className="text-lg font-bold text-green-700">{petData.reward}</span>
                </div>}
            </div>

            {/* Contact Info */}
            <div className="mt-6 pt-4 border-t-2 border-red-600 bg-red-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-lg font-bold text-red-700 mb-2">
                  SE ENCONTRAR, ENTRE EM CONTATO:
                </p>
                {petData.ownerName && <p className="text-xl font-bold text-gray-800">{petData.ownerName}</p>}
                {petData.ownerPhone && <p className="text-2xl font-black text-red-600">{petData.ownerPhone}</p>}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 italic">
                🙏 Por favor, compartilhe para ajudar a encontrar nosso amigo!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
