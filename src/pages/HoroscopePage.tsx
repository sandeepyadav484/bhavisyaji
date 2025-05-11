import React, { useEffect, useState } from 'react';
import { generateHoroscope } from '../services/horoscope';
import { Horoscope, HoroscopeType } from '../models/horoscope';
import HoroscopeHeader from '../components/horoscope/HoroscopeHeader';
import HoroscopeNavigation from '../components/horoscope/HoroscopeNavigation';
import PlanetaryInfluence from '../components/horoscope/PlanetaryInfluence';
import HoroscopeContent from '../components/horoscope/HoroscopeContent';
import HoroscopeSharing from '../components/horoscope/HoroscopeSharing';
import { getPlanetaryPositions } from '../utils/astrology';

const mockUserId = 'user-123';
const mockBirthDate = new Date(1995, 4, 15); // May 15, 1995
const mockBirthPlace = 'Delhi, India';

const TABS: HoroscopeType[] = ['daily', 'weekly', 'monthly'];

const HoroscopePage: React.FC = () => {
  const [tab, setTab] = useState<HoroscopeType>('daily');
  const [horoscope, setHoroscope] = useState<Horoscope | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    generateHoroscope({
      userId: mockUserId,
      birthDate: mockBirthDate,
      birthPlace: mockBirthPlace,
      type: tab,
    })
      .then(setHoroscope)
      .catch(() => setError('Failed to generate horoscope.'))
      .finally(() => setLoading(false));
  }, [tab]);

  const dateRange = tab === 'daily'
    ? new Date().toLocaleDateString()
    : tab === 'weekly'
      ? 'This Week'
      : 'This Month';

  const shareUrl = window.location.href;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-purple-900">Your Horoscope</h1>
      <HoroscopeNavigation current={tab} onChange={setTab} />
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</div>}
      {horoscope && (
        <div className="bg-white rounded-xl shadow p-4">
          <HoroscopeHeader sunSign={horoscope.sunSign} dateRange={dateRange} />
          <PlanetaryInfluence planets={getPlanetaryPositions(mockBirthDate)} />
          <HoroscopeContent sections={horoscope.sections} />
          <div className="text-xs text-gray-400 mt-2">Generated: {new Date(horoscope.createdAt).toLocaleString()}</div>
          <HoroscopeSharing shareUrl={shareUrl} text={`My ${tab} horoscope for ${horoscope.sunSign} on Bhavisyaji!`} />
        </div>
      )}
    </div>
  );
};

export default HoroscopePage; 