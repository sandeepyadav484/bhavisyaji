import React from 'react';

interface HoroscopeHeaderProps {
  sunSign: string;
  dateRange: string;
}

const HoroscopeHeader: React.FC<HoroscopeHeaderProps> = ({ sunSign, dateRange }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <span className="text-2xl font-bold text-purple-800">{sunSign}</span>
      <span className="text-xs bg-yellow-200 text-yellow-900 px-2 py-1 rounded-full font-semibold">{dateRange}</span>
    </div>
  </div>
);

export default HoroscopeHeader; 