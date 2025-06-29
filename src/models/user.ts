export interface BirthLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export interface BirthDetails {
  date: string; // ISO date string (YYYY-MM-DD)
  time?: string; // Optional, ISO time string (HH:mm) or undefined if unknown
  location: BirthLocation;
}

export interface UserProfile {
  uid: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  profilePictureUrl?: string;
  birthDetails: BirthDetails;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
} 