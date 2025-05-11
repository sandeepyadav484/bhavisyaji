import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

export interface LocationValue {
  name: string;
  latitude: number;
  longitude: number;
}

interface LocationSearchInputProps {
  value: LocationValue | null;
  onChange: (value: LocationValue) => void;
  error?: string;
  disabled?: boolean;
}

// Mock search function (replace with real API later)
const mockLocations = [
  { name: 'Mumbai, India', latitude: 19.076, longitude: 72.8777 },
  { name: 'Delhi, India', latitude: 28.6139, longitude: 77.209 },
  { name: 'Bangalore, India', latitude: 12.9716, longitude: 77.5946 },
  { name: 'Chennai, India', latitude: 13.0827, longitude: 80.2707 },
];

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({ value, onChange, error, disabled }) => {
  const [search, setSearch] = useState(value?.name || '');
  const [results, setResults] = useState<LocationValue[]>([]);

  const handleSearch = () => {
    // Simple filter for mock data
    setResults(
      mockLocations.filter(loc =>
        loc.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const handleSelect = (loc: LocationValue) => {
    onChange(loc);
    setResults([]);
    setSearch(loc.name);
  };

  return (
    <Box>
      <div>
        <label id="location-label" htmlFor="location-input">
          Birth Location
        </label>
        <input
          type="text"
          id="location-input"
          data-testid="location-input"
          aria-label="Birth Location"
          aria-labelledby="location-label"
          value={search}
          onChange={e => setSearch(e.target.value)}
          required
          role="textbox"
          disabled={disabled}
          className="w-full mt-2"
        />
      </div>
      <button
        type="button"
        onClick={handleSearch}
        disabled={disabled}
        className="mt-4 mb-2 px-4 py-2 bg-blue-500 text-white rounded"
        aria-label="Search"
      >
        Search
      </button>
      {results.length > 0 && (
        <ul role="listbox" className="mt-2">
          {results.map((loc) => (
            <li key={loc.name} role="option">
              <button
                type="button"
                onClick={() => handleSelect(loc)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {loc.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {value && (
        <Typography variant="body2" className="mt-2 mb-2 text-center">
          Selected: {value.name} ({value.latitude}, {value.longitude})
        </Typography>
      )}
      {error && (
        <Typography color="error" className="mt-2 mb-2 text-center">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default LocationSearchInput; 