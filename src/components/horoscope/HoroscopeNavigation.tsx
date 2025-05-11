import React from 'react';
import { HoroscopeType } from '../../models/horoscope';

interface HoroscopeNavigationProps {
  current: HoroscopeType;
  onChange: (type: HoroscopeType) => void;
}

const TABS: HoroscopeType[] = ['daily', 'weekly', 'monthly'];

const HoroscopeNavigation: React.FC<HoroscopeNavigationProps> = ({ current, onChange }) => (
  <div className="flex gap-2 mb-4">
    {TABS.map((t) => (
      <button
        key={t}
        className={`px-4 py-2 rounded-full font-semibold ${current === t ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        onClick={() => onChange(t)}
      >
        {t.charAt(0).toUpperCase() + t.slice(1)}
      </button>
    ))}
  </div>
);

export default HoroscopeNavigation; 