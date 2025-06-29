import React from 'react';
import { Grid, CircularProgress, Typography, Box } from '@mui/material';
import { Persona } from '../../models/persona';
import PersonaCard from './PersonaCard';

interface PersonaListProps {
  personas: Persona[];
  loading?: boolean;
  error?: string | null;
  onConsult?: (persona: Persona) => void;
}

const PersonaList: React.FC<PersonaListProps> = ({ personas, loading, error, onConsult }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={48} color="primary" />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }
  if (!personas || personas.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">No astrologers found matching your criteria.</Typography>
      </Box>
    );
  }
  return (
    <Grid container spacing={4} justifyContent="center">
      {personas.map((persona) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={persona.id}>
          <PersonaCard persona={persona} onConsult={onConsult} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PersonaList; 