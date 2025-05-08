import React from 'react';
import { TextField, Box, Typography } from '@mui/material';

export interface LocationValue {
  name: string;
  latitude: number;
  longitude: number;
}

interface LocationSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({ value, onChange, error, disabled }) => {
  return (
    <Box>
      <TextField
        label="Birth Location"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        required
        margin="normal"
        disabled={disabled}
        error={!!error}
        InputLabelProps={{ shrink: true }}
        inputProps={{
          'data-testid': 'location-input',
          'aria-label': 'Birth Location'
        }}
      />
      {error && (
        <Typography color="error" className="mt-2 mb-2 text-center">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default LocationSearchInput; 