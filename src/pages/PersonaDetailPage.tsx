import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Chip, Stack, Button, Rating, CircularProgress, Paper, Avatar, Divider } from '@mui/material';
import { getPersonaById } from '../services/firestore/personas';
import { Persona } from '../models/persona';

// Unique reviews for each astrologer
const personaReviews: Record<string, { user: string; rating: number; comment: string }[]> = {
  'pandit-vikram-sharma': [
    { user: 'Amit S.', rating: 5, comment: 'Pandit Vikram Sharma gave me clarity about my career. Highly recommended!' },
    { user: 'Priya K.', rating: 4.5, comment: 'Very patient and insightful. Thank you, Pandit Ji!' },
    { user: 'Rahul M.', rating: 4.8, comment: 'His predictions were spot on for my family matters.' },
  ],
  'jyotishi-hemant-rao': [
    { user: 'Sneha T.', rating: 5, comment: 'Jyotishi Hemant Rao is very empathetic and accurate in his readings.' },
    { user: 'Vikas P.', rating: 4.7, comment: 'He helped me understand my relationship better.' },
    { user: 'Rohit S.', rating: 4.9, comment: 'His tarot guidance was very helpful.' },
  ],
  'pandit-arvind-kapoor': [
    { user: 'Kiran D.', rating: 5, comment: 'Pandit Arvind Kapoor gave me hope during tough times. Thank you!' },
    { user: 'Meena R.', rating: 4.6, comment: 'Very knowledgeable and kind.' },
    { user: 'Suresh N.', rating: 4.8, comment: 'His advice on health was very useful.' },
  ],
  'rajendra-desai': [
    { user: 'Anjali M.', rating: 5, comment: 'Rajendra Desai is very professional and detailed.' },
    { user: 'Deepak L.', rating: 4.7, comment: 'He explained my horoscope in simple terms.' },
    { user: 'Pooja S.', rating: 4.9, comment: 'Great experience, will consult again.' },
  ],
  'radhe-joshi': [
    { user: 'Ritu G.', rating: 5, comment: 'Radhe Joshi is very intuitive and supportive.' },
    { user: 'Aakash J.', rating: 4.8, comment: 'His numerology reading was very accurate.' },
    { user: 'Manoj K.', rating: 4.7, comment: 'He gave me confidence in my decisions.' },
  ],
  'kavi-iyer': [
    { user: 'Sunita P.', rating: 5, comment: 'Kavi Iyer is very positive and motivating.' },
    { user: 'Harsh V.', rating: 4.6, comment: 'She helped me with my business queries.' },
    { user: 'Neha D.', rating: 4.8, comment: 'Very good at face reading and palmistry.' },
  ],
};

const PersonaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await getPersonaById(id!);
        if (!data) throw new Error('Astrologer not found');
        setPersona(data);
      } catch (err) {
        setError('Failed to load astrologer.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={48} color="primary" />
      </Box>
    );
  }
  if (error || !persona) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <Typography color="error" variant="h6">{error || 'Astrologer not found.'}</Typography>
      </Box>
    );
  }

  // Pick reviews for this persona, fallback to default if not found
  const reviews = personaReviews[persona.id] || [
    { user: 'Amit S.', rating: 5, comment: 'Very accurate and helpful guidance! Highly recommend.' },
    { user: 'Priya K.', rating: 4.5, comment: 'Great insights and very patient listener.' },
    { user: 'Rahul M.', rating: 4.8, comment: 'Helped me with my career decisions. Thank you!' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fffde4', py: { xs: 2, md: 6 } }}>
      <Container maxWidth="md">
        <Paper elevation={6} sx={{ borderRadius: 4, p: { xs: 2, md: 5 }, mb: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
            <Avatar src={persona.avatarUrl} alt={persona.name} sx={{ width: 140, height: 140, boxShadow: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#6C47FF', mb: 1 }}>{persona.name}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>{persona.experience} years experience • {persona.availability}</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                {persona.specializations.map((spec: string) => (
                  <Chip key={spec} label={spec} color="primary" size="small" sx={{ bgcolor: '#ffe066', color: '#222', fontWeight: 600 }} />
                ))}
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                {persona.languages.map((lang: string) => (
                  <Chip key={lang} label={lang} color="secondary" size="small" sx={{ bgcolor: '#e6b800', color: '#fff', fontWeight: 600 }} />
                ))}
              </Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={persona.rating} precision={0.1} readOnly size="medium" />
                <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600 }}>{persona.rating.toFixed(1)}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>({persona.reviews} reviews)</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#6C47FF', mb: 1 }}>
                {persona.rates.chatPerMinute} credits/min
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, borderRadius: 2, fontWeight: 700, fontSize: '1rem', px: 4, py: 1 }}
                onClick={() => navigate(`/chat/${id}`)}
              >
                Start Consultation
              </Button>
            </Box>
          </Stack>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>About</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>{persona.about}</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Reviews</Typography>
          <Stack spacing={2}>
            {reviews.map((review, idx) => (
              <Paper key={idx} sx={{ p: 2, borderRadius: 2, bgcolor: '#fffbe6' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 1 }}>{review.user[0]}</Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{review.user}</Typography>
                  <Rating value={review.rating} precision={0.1} readOnly size="small" sx={{ ml: 1 }} />
                </Box>
                <Typography variant="body2">{review.comment}</Typography>
              </Paper>
            ))}
          </Stack>
        </Paper>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/personas')}>
          Back to Directory
        </Button>
      </Container>
    </Box>
  );
};

export default PersonaDetailPage; 