import React from 'react';
import { Box, Typography } from '@mui/material';

interface BirthDetailsFormProps {
  value: {
    date: string;
    time?: string;
    unknownTime: boolean;
  };
  onChange: (value: { date: string; time?: string; unknownTime: boolean }) => void;
  error?: string;
  disabled?: boolean;
}

const BirthDetailsForm: React.FC<BirthDetailsFormProps> = ({ value, onChange, error, disabled }) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, date: e.target.value });
  };
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, time: e.target.value });
  };
  const handleUnknownTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, unknownTime: e.target.checked, time: e.target.checked ? undefined : value.time });
  };

  return (
    <Box>
      <div className="mb-4">
        <label id="date-of-birth-label" htmlFor="date-of-birth-input">
          Date of Birth
        </label>
        <input
          type="date"
          id="date-of-birth-input"
          aria-label="Date of Birth"
          aria-labelledby="date-of-birth-label"
          value={value.date}
          onChange={handleDateChange}
          required
          role="textbox"
          disabled={disabled}
          className="w-full mt-2"
        />
      </div>
      <div className="mb-4">
        <label id="unknown-time-label" htmlFor="unknown-time-input" className="flex items-center">
          <input
            type="checkbox"
            id="unknown-time-input"
            aria-labelledby="unknown-time-label"
            role="checkbox"
            checked={value.unknownTime}
            onChange={handleUnknownTimeChange}
            disabled={disabled}
            className="mr-2"
          />
          I don't know my exact birth time
        </label>
      </div>
      <div className="mt-4">
        <label id="time-of-birth-label" htmlFor="time-of-birth-input">
          Time of Birth
        </label>
        <input
          type="time"
          id="time-of-birth-input"
          aria-label="Time of Birth"
          aria-labelledby="time-of-birth-label"
          value={value.time || ''}
          onChange={handleTimeChange}
          required={!value.unknownTime}
          role="textbox"
          disabled={disabled || value.unknownTime}
          className="w-full mt-2"
        />
      </div>
      {error && (
        <Typography color="error" className="mt-2 mb-2 text-center">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default BirthDetailsForm; 