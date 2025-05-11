import { db } from '../../config/firebase';
import { collection, doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { Horoscope, HoroscopeType } from '../../models/horoscope';
import { sendMessageToOpenAI } from '../openai';
import { generateAstroContext } from '../../utils/astrology';

const HOROSCOPE_COLLECTION = 'horoscopes';

export async function fetchHoroscope(userId: string, type: HoroscopeType): Promise<Horoscope | null> {
  const q = query(collection(db, HOROSCOPE_COLLECTION), where('userId', '==', userId), where('type', '==', type));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const data = snap.docs[0].data() as Horoscope;
  // Check expiration
  if (Date.now() > data.expiresAt) return null;
  return data;
}

export async function saveHoroscope(horoscope: Horoscope): Promise<void> {
  const ref = doc(collection(db, HOROSCOPE_COLLECTION));
  await setDoc(ref, horoscope);
}

export function getHoroscopeExpiration(type: HoroscopeType): number {
  const now = Date.now();
  if (type === 'daily') return now + 24 * 60 * 60 * 1000;
  if (type === 'weekly') return now + 7 * 24 * 60 * 60 * 1000;
  if (type === 'monthly') return now + 30 * 24 * 60 * 60 * 1000;
  return now + 24 * 60 * 60 * 1000;
}

export async function generateHoroscope({
  userId,
  birthDate,
  birthPlace,
  type = 'daily',
}: {
  userId: string;
  birthDate: Date;
  birthPlace?: string;
  type?: HoroscopeType;
}): Promise<Horoscope> {
  // Check cache first
  const cached = await fetchHoroscope(userId, type);
  if (cached) return cached;

  const astroContext = generateAstroContext(birthDate, birthPlace);
  const prompt = `Generate a ${type} horoscope for the following astrological context.\n${astroContext}\nFormat the response in sections: General, Love, Career, Health.`;
  const aiContent = await sendMessageToOpenAI({
    personaContext: 'You are a skilled astrologer generating insightful horoscopes.',
    chatHistory: [],
    userMessage: prompt,
    model: 'gpt-3.5-turbo',
    maxTokens: 512,
    temperature: 0.8,
  });

  // Parse AI response into sections
  const sections = parseHoroscopeSections(aiContent);
  const now = Date.now();
  const horoscope: Horoscope = {
    id: '',
    userId,
    type,
    sunSign: astroContext.split('Sun sign: ')[1]?.split('.')[0] || '',
    sections,
    createdAt: now,
    expiresAt: getHoroscopeExpiration(type),
  };
  await saveHoroscope(horoscope);
  return horoscope;
}

function parseHoroscopeSections(aiContent: string): Horoscope['sections'] {
  // Simple parser: expects sections like "General:", "Love:", etc.
  const sectionTitles = ['General', 'Love', 'Career', 'Health'];
  const sections: any = {};
  let current: string | null = null;
  aiContent.split('\n').forEach((line) => {
    const match = sectionTitles.find((title) => line.trim().toLowerCase().startsWith(title.toLowerCase() + ':'));
    if (match) {
      current = match.toLowerCase();
      sections[current] = { title: match, content: line.replace(/^[^:]+:/, '').trim() };
    } else if (current && line.trim()) {
      sections[current].content += ' ' + line.trim();
    }
  });
  return sections;
} 