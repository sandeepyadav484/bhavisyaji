import React, { useState } from 'react';
import { Box, Typography, Container, Paper, TextField, Button, Alert } from '@mui/material';

const OnboardingPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [place, setPlace] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!fullName || !dob || !tob || !place) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    // Here you would save to Firestore
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <Container maxWidth="sm" data-testid="onboarding-page">
      <Box className="min-h-screen flex items-center justify-center py-12">
        <Paper className="w-full p-4 sm:p-8" elevation={3}>
          <Typography variant="h4" component="h1" className="text-primary mb-6 text-center">
            Onboarding: Birth Details
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
              required
              margin="normal"
              disabled={loading}
            />
            <TextField
              label="Date of Birth"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
              disabled={loading}
            />
            <TextField
              label="Time of Birth"
              type="time"
              value={tob}
              onChange={(e) => setTob(e.target.value)}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
              disabled={loading}
            />
            <TextField
              label="Place of Birth"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              fullWidth
              required
              margin="normal"
              disabled={loading}
            />
            {error && (
              <Alert severity="error" className="mt-2 mb-2">{error}</Alert>
            )}
            {success && (
              <Alert severity="success" className="mt-2 mb-2">Birth details saved successfully!</Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="mt-4 bg-primary hover:bg-primary-dark"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save & Continue'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default OnboardingPage; 