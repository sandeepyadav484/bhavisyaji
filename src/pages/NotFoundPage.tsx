import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" data-testid="not-found-page">
      <Box className="min-h-screen flex flex-col items-center justify-center py-12">
        <Typography variant="h1" component="h1" className="text-primary mb-4">
          404
        </Typography>
        <Typography variant="h4" component="h2" className="text-text-dark mb-8 text-center">
          Page Not Found
        </Typography>
        <Typography variant="body1" className="text-text-light mb-8 text-center">
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className="bg-primary hover:bg-primary-dark"
          onClick={() => navigate('/')}
          data-testid="go-home-button"
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage; 