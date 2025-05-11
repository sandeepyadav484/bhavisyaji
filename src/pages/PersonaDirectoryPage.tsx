import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, TextField, InputAdornment, IconButton, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { filterPersonas } from '../services/firestore/personas';
import { Persona } from '../models/persona';
import PersonaFilters from '../components/personas/PersonaFilters';
import PersonaList from '../components/personas/PersonaList';
import PersonaSort from '../components/personas/PersonaSort';

const defaultFilters: { specializations: string[]; languages: string[]; minRating: number; priceRange?: 'Low' | 'Medium' | 'High' } = {
  specializations: [],
  languages: [],
  minRating: 0,
  priceRange: undefined,
};

const PersonaDirectoryPage: React.FC = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [search, setSearch] = useState('');
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'popularity' | 'price'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    (async () => {
      try {
        let data = await filterPersonas({ ...filters, sortBy, sortOrder });
        if (search.trim()) {
          data = data.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.specializations.some((s) => s.toLowerCase().includes(search.toLowerCase()))
          );
        }
        setPersonas(data);
      } catch (err) {
        setError('Failed to load astrologers.');
      } finally {
        setLoading(false);
      }
    })();
  }, [filters, search, sortBy, sortOrder]);

  const handleConsult = (persona: Persona) => {
    navigate(`/personas/${persona.id}`);
  };

  const handleSortChange = (newSortBy: 'rating' | 'popularity' | 'price', newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fffde4', py: { xs: 2, md: 6 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#6C47FF', textAlign: 'center' }}>
          Choose Your Astrologer
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <TextField
            placeholder="Search by name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearch('')}>
                    ✕
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 400 } }}
            size="small"
            variant="outlined"
          />
        </Box>
        {/* Responsive filter/sort layout */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Box sx={{ order: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 'auto' } }}>
            <PersonaSort sortBy={sortBy} sortOrder={sortOrder} onChange={handleSortChange} />
          </Box>
          <Box sx={{ order: { xs: 2, sm: 1 }, width: { xs: '100%', sm: 'auto' } }}>
            <PersonaFilters filters={filters} onChange={setFilters} />
          </Box>
        </Stack>
        <PersonaList personas={personas} loading={loading} error={error} onConsult={handleConsult} />
      </Container>
    </Box>
  );
};

export default PersonaDirectoryPage; 