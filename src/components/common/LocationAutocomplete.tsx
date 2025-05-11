import React, { useRef, useEffect } from 'react';
import { TextField, CircularProgress, List, ListItem, ListItemText, Paper } from '@mui/material';

declare global { interface Window { google: any; } }

const GOOGLE_API_KEY = 'AIzaSyDjaIR4GRU1r0Cw0gv0q40ijdF5vNbOTwY';

export interface LocationValue {
  name: string;
  latitude: number;
  longitude: number;
}

interface LocationAutocompleteProps {
  value: LocationValue | null;
  onChange: (value: LocationValue | null) => void;
  label?: string;
  disabled?: boolean;
}

export const loadGoogleMapsScript = (callback: () => void) => {
  if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
    callback();
    return;
  }
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
};

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({ value, onChange, label = "Birth Place", disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<any[]>([]);
  const [inputValue, setInputValue] = React.useState(value?.name || '');

  useEffect(() => {
    loadGoogleMapsScript(() => {});
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setLoading(true);
    if (window.google && window.google.maps) {
      const service = new window.google.maps.places.AutocompleteService();
      if (e.target.value) {
        service.getPlacePredictions({ input: e.target.value }, (predictions: any) => {
          setSuggestions(predictions || []);
          setLoading(false);
        });
      } else {
        setSuggestions([]);
        setLoading(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (window.google && window.google.maps) {
      const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
      placesService.getDetails({ placeId: suggestion.place_id }, (place: any, status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.geometry) {
          const locationValue: LocationValue = {
            name: place.formatted_address || suggestion.description,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          };
          setInputValue(locationValue.name);
          setSuggestions([]);
          onChange(locationValue);
        }
      });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <TextField
        fullWidth
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        inputRef={inputRef}
        disabled={disabled}
        margin="normal"
        autoComplete="off"
      />
      {loading && <CircularProgress size={20} style={{ position: 'absolute', right: 10, top: 35 }} />}
      {suggestions.length > 0 && (
        <Paper style={{ position: 'absolute', zIndex: 10, left: 0, right: 0 }}>
          <List>
            {suggestions.map((suggestion) => (
              <ListItem button key={suggestion.place_id} onClick={() => handleSuggestionClick(suggestion)}>
                <ListItemText primary={suggestion.description} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default LocationAutocomplete; 