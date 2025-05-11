import React from 'react';
import { Box, Typography, Container, Paper, Button, Grid } from '@mui/material';

const ConsultationPage: React.FC = () => {
  return (
    <Container maxWidth="lg" data-testid="consultation-page">
      <Box className="min-h-screen py-12">
        <Typography variant="h4" component="h1" className="text-primary mb-8 text-center">
          AI Astrology Consultation
        </Typography>
        
        <Grid container spacing={4}>
          <Grid component="div" sx={{ width: { xs: '100%', md: '66.666667%' } }}>
            <Paper className="p-6 mb-6" elevation={3}>
              <Typography variant="h6" className="text-primary mb-4">
                Chat with AI Astrologer
              </Typography>
              <Box className="h-96 bg-background-light rounded-lg p-4 mb-4">
                {/* Chat messages will go here */}
                <Typography variant="body1" className="text-text-light text-center">
                  Start your consultation by sending a message
                </Typography>
              </Box>
              <Box className="flex gap-2">
                <Button 
                  variant="contained" 
                  color="primary"
                  className="bg-primary hover:bg-primary-dark"
                  data-testid="send-message-button"
                >
                  Send Message
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary"
                  data-testid="end-consultation-button"
                >
                  End Consultation
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid component="div" sx={{ width: { xs: '100%', md: '33.333333%' } }}>
            <Paper className="p-6" elevation={3}>
              <Typography variant="h6" className="text-primary mb-4">
                Consultation Details
              </Typography>
              <Box className="space-y-4">
                <Box>
                  <Typography variant="body2" className="text-text-light">
                    Duration
                  </Typography>
                  <Typography variant="body1" className="text-text-dark">
                    0 minutes
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" className="text-text-light">
                    Credits Used
                  </Typography>
                  <Typography variant="body1" className="text-text-dark">
                    0 credits
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" className="text-text-light">
                    Status
                  </Typography>
                  <Typography variant="body1" className="text-text-dark">
                    Not Started
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ConsultationPage; 