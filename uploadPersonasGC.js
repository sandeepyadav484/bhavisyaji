const {Firestore} = require('@google-cloud/firestore');
const personas = [
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

const firestore = new Firestore({
  projectId: 'bhavisyaji1',
  keyFilename: './serviceAccountKey.json'
});

async function uploadPersonas() {
  for (const persona of personas) {
    try {
      await firestore.collection('personas').doc(persona.id).set(persona, { merge: true });
      console.log(`Uploaded ${persona.name} (${persona.id})`);
    } catch (err) {
      console.error(`Error uploading ${persona.name} (${persona.id}):`, err);
    }
  }
  console.log('All personas uploaded!');
  process.exit(0);
}

uploadPersonas(); 