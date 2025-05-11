import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box, Button, Stack, Rating, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { Persona } from '../../models/persona';

interface PersonaCardProps {
  persona: Persona;
  onConsult?: (persona: Persona) => void;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ persona, onConsult }) => {
  const handleConsult = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onConsult) onConsult(persona);
  };

  return (
    <Link to={`/personas/${persona.id}`} style={{ textDecoration: 'none' }}>
      <Box
        sx={{ cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 8 } }}
      >
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: 4,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-6px) scale(1.03)',
              boxShadow: 8,
            },
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            bgcolor: '#fff',
          }}
        >
          <CardMedia
            component="img"
            image={persona.avatarUrl}
            alt={persona.name}
            sx={{
              height: 160,
              width: 160,
              borderRadius: '50%',
              objectFit: 'cover',
              mx: 'auto',
              mt: 3,
              boxShadow: 2,
            }}
          />
          <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {persona.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {persona.experience} yrs exp • {persona.availability}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ mb: 1 }}>
              {persona.specializations.map((spec: string) => (
                <Chip key={spec} label={spec} color="primary" size="small" sx={{ bgcolor: '#ffe066', color: '#222', fontWeight: 600 }} />
              ))}
            </Stack>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ mb: 1 }}>
              {persona.languages.map((lang: string) => (
                <Chip key={lang} label={lang} color="secondary" size="small" sx={{ bgcolor: '#e6b800', color: '#fff', fontWeight: 600 }} />
              ))}
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <Rating value={persona.rating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600 }}>{persona.rating.toFixed(1)}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>({persona.reviews})</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 1, color: '#555' }}>
              {persona.about}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#6C47FF', mb: 1 }}>
              {persona.rates.chatPerMinute} credits/min
            </Typography>
            <Tooltip title={persona.availability} arrow>
              <Chip
                label={persona.availability}
                color={persona.availability === 'Available Now' ? 'success' : 'warning'}
                size="small"
                sx={{ fontWeight: 600, mb: 1 }}
              />
            </Tooltip>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleConsult}
              sx={{ mt: 2, borderRadius: 2, fontWeight: 700, fontSize: '1rem', py: 1 }}
            >
              Consult
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Link>
  );
};

export default PersonaCard; 