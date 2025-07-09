// Tipos globais da aplicação

export interface PetInfo {
  name: string;
  type: string;
  breed?: string;
  description?: string;
  lastSeenLocation: string;
  lastSeenDate?: string;
  accessories?: string;
  reward?: string;
  photos: string[];
}

export interface ContactInfo {
  ownerName: string;
  phone: string;
  email?: string;
}

export interface PosterData {
  pet: PetInfo;
  contact: ContactInfo;
  customFields?: Record<string, string>;
}

export interface Language {
  code: 'pt-BR' | 'en-US';
  name: string;
  flag: string;
}

export type FormStep = 'info' | 'photos' | 'preview' | 'download'; 