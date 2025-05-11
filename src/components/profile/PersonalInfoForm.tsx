import React from 'react';
import { Box, Typography } from '@mui/material';

interface PersonalInfo {
  name: string;
  gender: 'male' | 'female' | 'other' | '';
}

interface PersonalInfoFormProps {
  value: PersonalInfo;
  onChange: (value: PersonalInfo) => void;
  error?: string;
  disabled?: boolean;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ value, onChange, error, disabled }) => {
  const handleChange = (field: keyof PersonalInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...value, [field]: e.target.value });
  };

  return (
    <Box>
      <div>
        <label id="full-name-label" htmlFor="full-name-input">
          Full Name
        </label>
        <input
          type="text"
          id="full-name-input"
          aria-label="Full Name"
          aria-labelledby="full-name-label"
          value={value.name}
          onChange={handleChange('name')}
          required
          role="textbox"
          disabled={disabled}
          className="w-full mt-2"
        />
      </div>
      <div className="mt-4">
        <label id="gender-label" htmlFor="gender-input">
          Gender
        </label>
        <select
          id="gender-input"
          aria-label="Gender"
          aria-labelledby="gender-label"
          value={value.gender}
          onChange={handleChange('gender')}
          required
          role="combobox"
          disabled={disabled}
          className="w-full mt-2"
          data-testid="mui-select"
        >
          <option value="" role="option" data-value="">Select Gender</option>
          <option value="male" role="option" data-value="male">Male</option>
          <option value="female" role="option" data-value="female">Female</option>
          <option value="other" role="option" data-value="other">Other</option>
        </select>
      </div>
      {error && (
        <Typography color="error" className="mt-2 mb-2 text-center">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default PersonalInfoForm; 