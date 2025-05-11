import React, { useState } from 'react';
import { Box, Chip, FormControl, InputLabel, MenuItem, Select, OutlinedInput, Slider, Typography, Stack, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';

const specializations = [
  'Vedic Astrology',
  'Tarot',
  'Numerology',
  'Palmistry',
  'Vastu',
  'Horoscope',
  'Reiki',
];
const languages = [
  'Hindi',
  'English',
  'Tamil',
  'Kannada',
  'Marathi',
];
const priceRanges = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

interface PersonaFiltersProps {
  filters: {
    specializations: string[];
    languages: string[];
    minRating: number;
    priceRange?: 'Low' | 'Medium' | 'High';
  };
  onChange: (filters: { specializations: string[]; languages: string[]; minRating: number; priceRange?: 'Low' | 'Medium' | 'High' }) => void;
  onReset?: () => void;
}

const PersonaFilters: React.FC<PersonaFiltersProps> = ({ filters, onChange, onReset }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSpecChange = (spec: string) => {
    const newSpecs = localFilters.specializations.includes(spec)
      ? localFilters.specializations.filter((s) => s !== spec)
      : [...localFilters.specializations, spec];
    setLocalFilters({ ...localFilters, specializations: newSpecs });
    onChange({ ...localFilters, specializations: newSpecs });
  };

  const handleLangChange = (event: any) => {
    const value = event.target.value;
    setLocalFilters({ ...localFilters, languages: value });
    onChange({ ...localFilters, languages: value });
  };

  const handleRatingChange = (_: any, value: number | number[]) => {
    setLocalFilters({ ...localFilters, minRating: value as number });
    onChange({ ...localFilters, minRating: value as number });
  };

  const handlePriceRangeChange = (_: any, value: 'Low' | 'Medium' | 'High' | null) => {
    setLocalFilters({ ...localFilters, priceRange: value || undefined });
    onChange({ ...localFilters, priceRange: value || undefined });
  };

  const handleReset = () => {
    const resetFilters = { specializations: [], languages: [], minRating: 0, priceRange: undefined };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
    if (onReset) onReset();
  };

  return (
    <Box sx={{ mb: 4, p: { xs: 2, sm: 3 }, bgcolor: '#fffbe6', borderRadius: 3, boxShadow: 1, boxSizing: 'border-box', maxWidth: '100vw' }}>
      <Stack
        direction="column"
        spacing={2.5}
        alignItems="stretch"
        justifyContent="flex-start"
      >
        {/* Specializations */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
            Specializations
          </Typography>
          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              gap: 1,
              pb: 1,
              maxWidth: '100vw',
              boxSizing: 'border-box',
              '&::-webkit-scrollbar': { height: 6 },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#ffe066', borderRadius: 3 },
            }}
          >
            {specializations.map((spec) => (
              <Chip
                key={spec}
                label={spec}
                clickable
                color={localFilters.specializations.includes(spec) ? 'primary' : 'default'}
                onClick={() => handleSpecChange(spec)}
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '0.95rem' },
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  whiteSpace: 'nowrap',
                }}
              />
            ))}
          </Box>
        </Box>
        {/* Languages */}
        <FormControl sx={{ width: '100%' }}>
          <InputLabel id="language-select-label">Languages</InputLabel>
          <Select
            labelId="language-select-label"
            multiple
            value={localFilters.languages}
            onChange={handleLangChange}
            input={<OutlinedInput label="Languages" />}
            renderValue={(selected) => (selected as string[]).join(', ')}
            sx={{ bgcolor: '#fff', borderRadius: 2 }}
          >
            {languages.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Min Rating */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
            Min Rating
          </Typography>
          <Slider
            value={localFilters.minRating}
            onChange={handleRatingChange}
            min={0}
            max={5}
            step={0.1}
            marks={[{ value: 0, label: '0' }, { value: 5, label: '5' }]}
            valueLabelDisplay="auto"
            sx={{ width: '100%', maxWidth: 300, ml: 1 }}
          />
        </Box>
        {/* Price Range */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
            Price Range
          </Typography>
          <ToggleButtonGroup
            value={localFilters.priceRange || null}
            exclusive
            onChange={handlePriceRangeChange}
            size="large"
            color="primary"
            sx={{ display: 'flex', gap: 2, width: '100%' }}
          >
            {priceRanges.map((pr) => (
              <ToggleButton
                key={pr.value}
                value={pr.value}
                sx={{
                  fontWeight: 600,
                  flex: 1,
                  borderRadius: 2,
                  fontSize: { xs: '1rem', sm: '1rem' },
                  py: 1.2,
                }}
              >
                {pr.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        {/* Reset Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              px: 4,
              py: 1.2,
              fontSize: { xs: '1rem', sm: '1rem' },
              borderColor: '#a084e8',
              color: '#a084e8',
              '&:hover': { borderColor: '#7c3aed', color: '#7c3aed', bgcolor: '#f3e8ff' },
            }}
          >
            RESET
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default PersonaFilters; 