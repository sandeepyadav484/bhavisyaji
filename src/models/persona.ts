export interface Persona {
  id: string;
  name: string;
  avatarUrl: string;
  specializations: string[];
  languages: string[];
  rates: {
    chatPerMinute: number;
    callPerMinute: number;
  };
  rating: number;
  reviews: number;
  experience: number; // years
  about: string;
  availability: 'Available Now' | 'Busy' | 'Offline';
  popularity: number; // e.g., number of consultations
  priceRange: 'Low' | 'Medium' | 'High';
  featured?: boolean;
  location?: string;
  certifications?: string[];
  tags?: string[];
  // Add more fields as needed for future features
} 