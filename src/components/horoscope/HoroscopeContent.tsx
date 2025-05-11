import React from 'react';
import { HoroscopeSection } from '../../models/horoscope';

interface HoroscopeContentProps {
  sections: Record<string, HoroscopeSection | undefined>;
}

const HoroscopeContent: React.FC<HoroscopeContentProps> = ({ sections }) => (
  <div>
    {Object.entries(sections).map(([key, section]) => (
      section && (
        <div key={key} className="mb-4">
          <div className="font-semibold text-indigo-700 mb-1">{section.title}</div>
          <div className="text-gray-800">{section.content}</div>
        </div>
      )
    ))}
  </div>
);

export default HoroscopeContent; 