import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, Paper, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TranslateIcon from '@mui/icons-material/Translate';
import EventIcon from '@mui/icons-material/Event';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ReportsGallery from '../components/ReportsGallery';
import { getPersonas } from '../services/firestore/personas';

const features = [
  {
    icon: <ChatBubbleOutlineIcon sx={{ fontSize: 40, color: '#e75480' }} />,
    label: 'Chat with Astrologer',
    path: '/personas'
  },
  {
    icon: <LocalFloristIcon sx={{ fontSize: 40, color: '#4f8cff' }} />,
    label: 'Horoscopes',
    path: '/horoscope'
  },
  {
    icon: <AssessmentIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
    label: 'Reports',
    path: '/reports'
  }
];

const navagraha = [
  'Surya (Sun)',
  'Chandra (Moon)',
  'Mangala (Mars)',
  'Budha (Mercury)',
  'Brihaspati (Jupiter)',
  'Shukra (Venus)',
  'Shani (Saturn)',
  'Rahu (North lunar node)',
  'Ketu (South lunar node)'
];

const benefits = [
  { icon: <AccessTimeIcon />, text: '24×7 access to AI astrologers—no appointments required' },
  { icon: <StarIcon />, text: 'Virtual experts curated by seasoned Vedic scholars' },
  { icon: <PsychologyIcon />, text: 'No travel or wait-lists—your first chat is half-price' },
  { icon: <TranslateIcon />, text: 'From core planetary readings to tarot, numerology, Reiki and palmistry' },
  { icon: <EventIcon />, text: 'Free live sessions, temple Aartis and interactive Q&As nationwide' }
];

const ASTRO_CARDS_VISIBLE = 4;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [astroIndex, setAstroIndex] = React.useState(0);
  const [astrologers, setAstrologers] = useState<any[]>([]);
  const maxIndex = astrologers.length - ASTRO_CARDS_VISIBLE;
  const [reportsOpen, setReportsOpen] = useState(false);

  useEffect(() => {
    getPersonas().then(setAstrologers);
  }, []);

  const handlePrev = () => setAstroIndex((i) => Math.max(i - 1, 0));
  const handleNext = () => setAstroIndex((i) => Math.min(i + 1, maxIndex));

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fffbe6 0%, #fffde4 100%)',
      py: { xs: 2, md: 8 },
      px: { xs: 1, sm: 2, md: 0 }
    }}>
      <Container maxWidth="lg" data-testid="home-page">
        {/* Hero Section */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            p: { xs: 3, sm: 4 },
            mb: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'linear-gradient(90deg, #fffbe6 60%, #ffe066 100%)',
            minHeight: { xs: 180, sm: 200 },
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.1rem', sm: '1.2rem' } }}>
              Decode Your Destiny with <span style={{ color: '#e6b800' }}>Bhavisyaji</span>
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.4rem', sm: '1.5rem' } }}>
              Chat With Astrologer
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#222',
                color: '#fff',
                borderRadius: 8,
                px: { xs: 4, sm: 5 },
                py: { xs: 1.5, sm: 1.8 },
                fontWeight: 700,
                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                boxShadow: 2,
                '&:hover': { bgcolor: '#e6b800', color: '#222' },
                width: { xs: '100%', sm: 'auto' },
              }}
              onClick={() => navigate('/personas')}
            >
              Chat Now
            </Button>
          </Box>
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            mt: { xs: 2, sm: 0 },
            '& img': {
              maxWidth: { xs: 120, sm: 140 },
              borderRadius: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }
          }}>
            <img
              src="/astrologer-hero.jpg"
              alt="Astrologer"
            />
          </Box>
        </Paper>

        {/* Quick Actions */}
        <Box sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: { xs: 2.5, sm: 3 },
          py: { xs: 3, sm: 4 },
          px: { xs: 2, sm: 3 },
          bgcolor: '#f7f7f7',
          borderRadius: 2,
          '&::-webkit-scrollbar': {
            height: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#e6b800',
            borderRadius: '3px',
          },
        }}>
          {features.map((feature) => (
            <Paper
              key={feature.label}
              sx={{
                minWidth: { xs: 160, sm: 180 },
                maxWidth: { xs: 180, sm: 200 },
                height: { xs: 140, sm: 160 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 3,
                boxShadow: 2,
                bgcolor: '#fff',
                flex: '0 0 auto',
                p: { xs: 2, sm: 3 },
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
                '& .MuiSvgIcon-root': {
                  fontSize: { xs: 48, sm: 56 },
                }
              }}
              onClick={() => feature.label === 'Reports' ? setReportsOpen(true) : navigate(feature.path)}
            >
              {feature.icon}
              <Typography variant="body1" sx={{ 
                mt: 2, 
                fontWeight: 600, 
                textAlign: 'center',
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}>
                {feature.label}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Reports Modal */}
        <Dialog open={reportsOpen} onClose={() => setReportsOpen(false)} maxWidth="md" fullWidth fullScreen={window.innerWidth < 600}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Your Reports
            <IconButton onClick={() => setReportsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <ReportsGallery />
          </DialogContent>
        </Dialog>

        {/* Our Astrologers Section */}
        <Box sx={{ width: '100%', height: 12, bgcolor: '#f7f7f7', my: { xs: 3, sm: 4 } }} />

        <Box sx={{ 
          overflowX: 'auto', 
          display: 'flex', 
          gap: { xs: 2.5, sm: 3 }, 
          py: { xs: 3, sm: 4 },
          px: { xs: 2, sm: 3 },
          '&::-webkit-scrollbar': {
            height: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#e6b800',
            borderRadius: '3px',
          },
        }}>
          {astrologers.map((astro) => (
            <Link 
              key={astro.id}
              to={`/personas/${astro.id}`}
              style={{ textDecoration: 'none' }}
            >
              <Paper
                elevation={2}
                sx={{
                  minWidth: { xs: 160, sm: 180 },
                  maxWidth: { xs: 180, sm: 200 },
                  p: { xs: 2.5, sm: 3 },
                  borderRadius: 3,
                  textAlign: 'center',
                  bgcolor: '#fff',
                  boxShadow: '0 4px 20px rgba(31, 38, 135, 0.1)',
                  flex: '0 0 auto',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <Avatar 
                  src={astro.avatarUrl} 
                  alt={astro.name} 
                  sx={{ 
                    width: { xs: 70, sm: 80 }, 
                    height: { xs: 70, sm: 80 }, 
                    mx: 'auto', 
                    mb: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Typography 
                  variant="subtitle1" 
                  fontWeight={700} 
                  sx={{ 
                    mb: 1, 
                    fontSize: { xs: '1.1rem', sm: '1.2rem' } 
                  }}
                >
                  {astro.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    lineHeight: 1.4
                  }}
                >
                  {astro.specializations?.[0]}
                </Typography>
              </Paper>
            </Link>
          ))}
        </Box>

        {/* Why Astrology Section */}
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#222', mb: 3, textAlign: 'center' }}>
            WHY ASTROLOGY?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
            At Bhavisyaji, we see astrology as a timeless roadmap to your inner potential and life's turning points. Rooted in centuries-old techniques, it's a predictive science that uses cosmic patterns—primarily the nine "Navagraha" bodies—to illuminate everything from your personal strengths to upcoming challenges. Even as the world changes, astrology's ability to connect us with universal rhythms continues to inspire deep belief and practical guidance.
          </Typography>
          
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            The Nine Navagraha
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {navagraha.map((planet) => (
              <Grid item xs={12} sm={6} md={4} key={planet}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fffbe6' }}>
                  <Typography variant="subtitle1">{planet}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Services Section */}
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#222', mb: 3, textAlign: 'center' }}>
            ONLINE ASTROLOGY CONSULTATION & SERVICES
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Instant Access" secondary="Chat or voice sessions with specialized AI 'astrologer' personas" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Flexible Billing" secondary="Start with a 5-message free trial, then pay per message or per minute" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TranslateIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Multilingual Support" secondary="Converse in Hindi, English or any of 10+ Indian languages" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Rich Reports" secondary="Download PDF or audio horoscopes—daily, weekly, monthly or deep-dive birth-chart analyses" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PsychologyIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Live Events & Workshops" secondary="Free group sessions, temple Aartis and festival-based webinars" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>

        {/* Why Choose Bhavisyaji */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#222', mb: 3, textAlign: 'center' }}>
            WHY CHOOSE BHAVISYAJI?
          </Typography>
          <List>
            {benefits.map((benefit, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {benefit.icon}
                </ListItemIcon>
                <ListItemText primary={benefit.text} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;
export {}; 