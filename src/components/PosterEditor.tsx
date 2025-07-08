import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Trash2 } from 'lucide-react';
import { PetData } from '@/pages/Index';
import { useLanguage } from '@/contexts/LanguageContext';

interface PosterEditorProps {
  petData: PetData;
  setPetData: (data: PetData) => void;
}

export const PosterEditor = ({
  petData,
  setPetData
}: PosterEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleInputChange = (field: keyof PetData, value: string) => {
    setPetData({
      ...petData,
      [field]: value
    });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const availableSlots = 3 - petData.photos.length;
      const filesToAdd = Math.min(files.length, availableSlots);
      if (filesToAdd > 0) {
        const newPhotos = Array.from(files).slice(0, filesToAdd).map(file => URL.createObjectURL(file));
        setPetData({
          ...petData,
          photos: [...petData.photos, ...newPhotos]
        });
      }
    }
    // Reset the input value so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = petData.photos.filter((_, i) => i !== index);
    setPetData({
      ...petData,
      photos: newPhotos
    });
  };

  const addCustomField = () => {
    setPetData({
      ...petData,
      customFields: [...petData.customFields, {
        label: '',
        value: ''
      }]
    });
  };

  const updateCustomField = (index: number, field: 'label' | 'value', value: string) => {
    const newFields = [...petData.customFields];
    newFields[index][field] = value;
    setPetData({
      ...petData,
      customFields: newFields
    });
  };

  const removeCustomField = (index: number) => {
    const newFields = petData.customFields.filter((_, i) => i !== index);
    setPetData({
      ...petData,
      customFields: newFields
    });
  };

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-800 flex items-center gap-2 text-left">
          {t('editor.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fotos do Pet */}
        <div>
          <Label className="text-lg font-semibold text-gray-700 mb-3 block">
            {t('editor.photos')} * ({t('editor.photos_max')})
          </Label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {petData.photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img 
                  src={photo} 
                  alt={`Pet ${index + 1}`} 
                  className="w-full h-24 object-cover rounded-lg border-2 border-gray-200" 
                />
                <button 
                  onClick={() => removePhoto(index)} 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            variant="outline" 
            className="w-full border-dashed border-2 border-purple-300 text-purple-600 hover:bg-purple-50" 
            disabled={petData.photos.length >= 3}
          >
            <Upload className="mr-2" size={20} />
            {petData.photos.length >= 3 ? t('editor.photos_limit') : `${t('editor.add_photos')} (${petData.photos.length}/3)`}
          </Button>
          <input 
            ref={fileInputRef} 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handlePhotoUpload} 
            className="hidden" 
          />
        </div>

        {/* Informações Obrigatórias */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ownerName" className="text-sm font-medium text-gray-700">
              {t('editor.owner_name')} *
            </Label>
            <Input 
              id="ownerName" 
              value={petData.ownerName} 
              onChange={e => handleInputChange('ownerName', e.target.value)} 
              className="mt-1 border-purple-200 focus:border-purple-400" 
              placeholder={t('editor.owner_name_placeholder')} 
            />
          </div>
          <div>
            <Label htmlFor="ownerPhone" className="text-sm font-medium text-gray-700">
              {t('editor.owner_phone')} *
            </Label>
            <Input 
              id="ownerPhone" 
              value={petData.ownerPhone} 
              onChange={e => handleInputChange('ownerPhone', e.target.value)} 
              className="mt-1 border-purple-200 focus:border-purple-400" 
              placeholder={t('editor.owner_phone_placeholder')} 
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="petName" className="text-sm font-medium text-gray-700">
              {t('editor.pet_name')} *
            </Label>
            <Input 
              id="petName" 
              value={petData.petName} 
              onChange={e => handleInputChange('petName', e.target.value)} 
              className="mt-1 border-purple-200 focus:border-purple-400" 
              placeholder={t('editor.pet_name_placeholder')} 
            />
          </div>
          <div>
            <Label htmlFor="lastSeenAddress" className="text-sm font-medium text-gray-700">
              {t('editor.last_seen')} *
            </Label>
            <Input 
              id="lastSeenAddress" 
              value={petData.lastSeenAddress} 
              onChange={e => handleInputChange('lastSeenAddress', e.target.value)} 
              className="mt-1 border-purple-200 focus:border-purple-400" 
              placeholder={t('editor.last_seen_placeholder')} 
            />
          </div>
        </div>

        {/* Informações Opcionais */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {t('editor.additional_info')}
          </h3>
          
          <div className="mb-4">
            <Label htmlFor="lostTime" className="text-sm font-medium text-gray-700">
              {t('editor.lost_time')}
            </Label>
            <Input 
              id="lostTime" 
              value={petData.lostTime} 
              onChange={e => handleInputChange('lostTime', e.target.value)} 
              className="mt-1 border-purple-200 focus:border-purple-400" 
              placeholder={t('editor.lost_time_placeholder')} 
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="petDescription" className="text-sm font-medium text-gray-700">
              {t('editor.pet_description')}
            </Label>
            <Textarea 
              id="petDescription" 
              value={petData.petDescription} 
              onChange={e => handleInputChange('petDescription', e.target.value)} 
              className="mt-1 border-purple-200 focus:border-purple-400" 
              placeholder={t('editor.pet_description_placeholder')} 
              rows={3} 
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="accessories" className="text-sm font-medium text-gray-700">
                {t('editor.accessories')}
              </Label>
              <Input 
                id="accessories" 
                value={petData.accessories} 
                onChange={e => handleInputChange('accessories', e.target.value)} 
                className="mt-1 border-purple-200 focus:border-purple-400" 
                placeholder={t('editor.accessories_placeholder')} 
              />
            </div>
            <div>
              <Label htmlFor="reward" className="text-sm font-medium text-gray-700">
                {t('editor.reward')}
              </Label>
              <Input 
                id="reward" 
                value={petData.reward} 
                onChange={e => handleInputChange('reward', e.target.value)} 
                className="mt-1 border-purple-200 focus:border-purple-400" 
                placeholder={t('editor.reward_placeholder')} 
              />
            </div>
          </div>
        </div>

        {/* Campos Customizados */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              {t('editor.custom_fields')}
            </h3>
            <Button onClick={addCustomField} variant="outline" size="sm">
              <Plus className="mr-2" size={16} />
              {t('editor.add_field')}
            </Button>
          </div>
          
          {petData.customFields.map((field, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input 
                value={field.label} 
                onChange={e => updateCustomField(index, 'label', e.target.value)} 
                placeholder={t('editor.field_name')} 
                className="border-purple-200 focus:border-purple-400" 
              />
              <Input 
                value={field.value} 
                onChange={e => updateCustomField(index, 'value', e.target.value)} 
                placeholder={t('editor.field_value')} 
                className="border-purple-200 focus:border-purple-400" 
              />
              <Button 
                onClick={() => removeCustomField(index)} 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
