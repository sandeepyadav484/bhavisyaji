import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface PersonaSortProps {
  sortBy: 'rating' | 'popularity' | 'price';
  sortOrder: 'asc' | 'desc';
  onChange: (sortBy: 'rating' | 'popularity' | 'price', sortOrder: 'asc' | 'desc') => void;
}

const sortOptions = [
  { value: 'rating', label: 'Rating (Highest First)', order: 'desc' },
  { value: 'popularity', label: 'Popularity', order: 'desc' },
  { value: 'price', label: 'Price (Lowest First)', order: 'asc' },
];

const PersonaSort: React.FC<PersonaSortProps> = ({ sortBy, sortOrder, onChange }) => {
  const handleChange = (event: SelectChangeEvent) => {
    const selected = sortOptions.find(opt => opt.value === event.target.value);
    if (selected) {
      onChange(selected.value as 'rating' | 'popularity' | 'price', selected.order as 'asc' | 'desc');
    }
  };

  return (
    <Box sx={{ minWidth: 0, width: { xs: '100%', sm: 200 }, mb: { xs: 2, sm: 0 } }}>
      <FormControl fullWidth size="small">
        <InputLabel id="persona-sort-label">Sort By</InputLabel>
        <Select
          labelId="persona-sort-label"
          value={sortBy}
          label="Sort By"
          onChange={handleChange}
        >
          {sortOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default PersonaSort;

 