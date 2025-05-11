import React from 'react';

interface PlanetaryInfluenceProps {
  planets: Record<string, string>;
}

const PlanetaryInfluence: React.FC<PlanetaryInfluenceProps> = ({ planets }) => (
  <div className="bg-indigo-50 rounded-lg p-3 mb-4">
    <div className="font-semibold text-purple-700 mb-2">Planetary Positions</div>
    <div className="flex flex-wrap gap-3">
      {Object.entries(planets).map(([planet, sign]) => (
        <div key={planet} className="px-2 py-1 bg-white rounded shadow text-xs text-gray-700">
          <span className="font-bold text-indigo-600">{planet}:</span> {sign}
        </div>
      ))}
    </div>
  </div>
);

export default PlanetaryInfluence; 