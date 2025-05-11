export type HoroscopeType = 'daily' | 'weekly' | 'monthly';

export interface HoroscopeSection {
  title: string;
  content: string;
}

export interface Horoscope {
  id: string;
  userId: string;
  type: HoroscopeType;
  sunSign: string;
  sections: {
    general: HoroscopeSection;
    love?: HoroscopeSection;
    career?: HoroscopeSection;
    health?: HoroscopeSection;
    [key: string]: HoroscopeSection | undefined;
  };
  createdAt: number;
  expiresAt: number;
} 