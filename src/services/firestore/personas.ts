import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Persona } from '../../models/persona';

// Synced astrologers for homepage and personas page
const personas: Persona[] = [
  {
    id: 'pandit-vikram-sharma',
    name: 'Pandit Vikram Sharma',
    avatarUrl: '/astrologer1.jpg',
    specializations: ['Vedic Astrology'],
    languages: ['Hindi', 'English'],
    rates: { chatPerMinute: 10, callPerMinute: 15 },
    rating: 4.9,
    reviews: 1200,
    experience: 15,
    about: 'Expert in Vedic astrology with 15+ years of experience. Known for accurate predictions and compassionate guidance.',
    availability: 'Available Now',
    popularity: 5000,
    priceRange: 'Medium',
    featured: true,
    location: 'Delhi',
    certifications: ['Jyotish Acharya'],
    tags: ['Accurate', 'Compassionate'],
  },
  {
    id: 'jyotishi-hemant-rao',
    name: 'Jyotishi Hemand Rao',
    avatarUrl: '/astrologer2.jpg',
    specializations: ['Vedic Astrology'],
    languages: ['English'],
    rates: { chatPerMinute: 12, callPerMinute: 18 },
    rating: 4.7,
    reviews: 980,
    experience: 8,
    about: 'Empowers clients with clarity and actionable insights.',
    availability: 'Available Now',
    popularity: 4200,
    priceRange: 'Medium',
    featured: false,
    location: 'Mumbai',
    certifications: ['Certified Tarot Reader'],
    tags: ['Empowering', 'Insightful'],
  },
  {
    id: 'pandit-arvind-kapoor',
    name: 'Pandit Arvind Kapoor',
    avatarUrl: '/astrologer3.jpg',
    specializations: ['Vedic Astrology'],
    languages: ['Hindi', 'Tamil'],
    rates: { chatPerMinute: 9, callPerMinute: 14 },
    rating: 4.8,
    reviews: 1100,
    experience: 12,
    about: 'Vastu and Vedic astrology specialist. Helps harmonize homes and lives.',
    availability: 'Busy',
    popularity: 3900,
    priceRange: 'Low',
    featured: false,
    location: 'Chennai',
    certifications: ['Vastu Shastra Expert'],
    tags: ['Harmonizing', 'Traditional'],
  },
  {
    id: 'rajendra-desai',
    name: 'Rajendra Desai',
    avatarUrl: '/astrologer4.jpg',
    specializations: ['Vedic Astrology'],
    languages: ['English', 'Kannada'],
    rates: { chatPerMinute: 11, callPerMinute: 16 },
    rating: 4.6,
    reviews: 850,
    experience: 10,
    about: 'Combines healing with astrology for holistic guidance.',
    availability: 'Available Now',
    popularity: 3100,
    priceRange: 'Medium',
    featured: false,
    location: 'Bangalore',
    certifications: ['Reiki Master'],
    tags: ['Holistic', 'Healing'],
  },
  {
    id: 'radhe-joshi',
    name: 'Radhe Joshi',
    avatarUrl: '/astrologer5.jpg',
    specializations: ['Vedic Astrology'],
    languages: ['Hindi', 'English', 'Marathi'],
    rates: { chatPerMinute: 15, callPerMinute: 20 },
    rating: 5.0,
    reviews: 2000,
    experience: 20,
    about: '20+ years in Vedic astrology and horoscope reading. Trusted by thousands for life-changing advice.',
    availability: 'Available Now',
    popularity: 8000,
    priceRange: 'High',
    featured: true,
    location: 'Pune',
    certifications: ['Jyotish Visharad'],
    tags: ['Trusted', 'Experienced'],
  },
  {
    id: 'kavi-iyer',
    name: 'Kavi Iyer',
    avatarUrl: '/astrologer6.jpg',
    specializations: ['Vedic Astrology'],
    languages: ['English', 'Hindi'],
    rates: { chatPerMinute: 13, callPerMinute: 17 },
    rating: 4.8,
    reviews: 1500,
    experience: 11,
    about: 'Specialist in Vedic astrology and numerology.',
    availability: 'Available Now',
    popularity: 6000,
    priceRange: 'Medium',
    featured: false,
    location: 'Lucknow',
    certifications: ['Numerology Expert'],
    tags: ['Numerology', 'Vedic'],
  },
];

export const getPersonas = async (): Promise<Persona[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'personas'));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Persona));
  } catch (e) {
    // fallback to local mock data if Firestore fails
    return personas;
  }
};

export const getPersonaById = async (id: string): Promise<Persona | undefined> => {
  try {
    const docRef = doc(db, 'personas', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Persona;
    }
    return undefined;
  } catch (e) {
    // fallback to local mock data if Firestore fails
    return personas.find((p) => p.id === id);
  }
};

export const filterPersonas = async (filters: {
  specializations?: string[];
  languages?: string[];
  minRating?: number;
  priceRange?: 'Low' | 'Medium' | 'High';
  sortBy?: 'rating' | 'popularity' | 'price';
  sortOrder?: 'asc' | 'desc';
}): Promise<Persona[]> => {
  // For now, just use getPersonas and filter in JS
  const all = await getPersonas();
  let filtered = all;
  if (filters.specializations && filters.specializations.length > 0) {
    filtered = filtered.filter((p) =>
      filters.specializations!.some((spec) => p.specializations.includes(spec))
    );
  }
  if (filters.languages && filters.languages.length > 0) {
    filtered = filtered.filter((p) =>
      filters.languages!.some((lang) => p.languages.includes(lang))
    );
  }
  if (filters.minRating) {
    filtered = filtered.filter((p) => p.rating >= filters.minRating!);
  }
  if (filters.priceRange) {
    filtered = filtered.filter((p) => p.priceRange === filters.priceRange);
  }
  // Sorting
  if (filters.sortBy) {
    filtered = [...filtered].sort((a, b) => {
      let aValue: number, bValue: number;
      switch (filters.sortBy) {
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'popularity':
          aValue = a.popularity;
          bValue = b.popularity;
          break;
        case 'price':
          aValue = a.rates.chatPerMinute;
          bValue = b.rates.chatPerMinute;
          break;
        default:
          aValue = 0;
          bValue = 0;
      }
      if (filters.sortOrder === 'asc') return aValue - bValue;
      return bValue - aValue;
    });
  }
  return filtered;
}; 