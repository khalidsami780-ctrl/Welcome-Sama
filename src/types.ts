export type SceneId = 1 | 2 | 3 | 4 | 5;

export type Language = 'en' | 'ar';

export interface RoseData {
  id: string;
  nameEn: string;
  nameAr: string;
  botanicalName: string;
  poeticVerseEn: string;
  poeticVerseAr: string;
  fragranceProfile: string;
  colorHint: string;
  personalityEn: string;
  personalityAr: string;
  position: { x: number; y: number }; // percentage 0-100
  scale?: number;
  bloomDelay?: number;
}

export interface SoundscapeState {
  enabled: boolean;
  initialized: boolean;
}
