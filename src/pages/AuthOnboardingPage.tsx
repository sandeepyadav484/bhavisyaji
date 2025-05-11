import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Box, MenuItem, CircularProgress, Alert, Grid, FormControl, InputLabel, Select } from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { saveUserProfile } from '../services/firestore/users';
import { useNavigate, useLocation } from 'react-router-dom';
import LocationAutocomplete, { LocationValue } from '../components/common/LocationAutocomplete';
import { addCredits } from '../services/credits';

// Helper arrays for dropdowns
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
  { value: '01', label: 'Jan' }, { value: '02', label: 'Feb' }, { value: '03', label: 'Mar' },
  { value: '04', label: 'Apr' }, { value: '05', label: 'May' }, { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' }, { value: '08', label: 'Aug' }, { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' }, { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' }
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 121 }, (_, i) => currentYear - i); // 1900 to current year
const hours = Array.from({ length: 24 }, (_, i) => i);
const minutesSeconds = Array.from({ length: 60 }, (_, i) => i);

const AuthOnboardingPage: React.FC = () => {
  const { signIn, signUp, user, loading, profile } = useUser();
  const [isSignup, setIsSignup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    gender: 'other',
    dob: '',
    tob: '',
    place: null as LocationValue | null,
    day: '',
    month: '',
    year: '',
    hour: '',
    minute: '',
    second: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Handle navigation after authentication
  useEffect(() => {
    if (user && !loading) {
      if (
        profile &&
        profile.name &&
        profile.gender &&
        profile.birthDetails &&
        profile.birthDetails.date &&
        profile.birthDetails.time &&
        profile.birthDetails.location &&
        profile.birthDetails.location.name // Only require name, not lat/lng
      ) {
        // If profile is complete, redirect to home
        navigate('/', { replace: true });
      } else {
        // If profile is incomplete, stay on this page
        console.log('Profile incomplete, staying on onboarding page');
      }
    }
  }, [user, loading, profile, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when user starts typing
  };

  const resetForm = () => {
    setForm({
      email: '',
      password: '',
      name: '',
      gender: 'other',
      dob: '',
      tob: '',
      place: null,
      day: '',
      month: '',
      year: '',
      hour: '',
      minute: '',
      second: '',
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isSignup) {
        const newUser = await signUp(form.email, form.password);
        if (!newUser.uid) throw new Error('User ID missing after signup');
        const now = new Date().toISOString();
        await saveUserProfile({
          uid: String(newUser.uid),
          name: form.name,
          gender: form.gender as 'male' | 'female' | 'other',
          email: form.email,
          profilePictureUrl: '',
          birthDetails: {
            date: form.dob,
            time: form.tob,
            location: form.place
              ? {
                  name: form.place.name,
                  latitude: form.place.latitude,
                  longitude: form.place.longitude,
                }
              : { name: '', latitude: 0, longitude: 0 },
          },
          createdAt: now,
          updatedAt: now,
        });
        await addCredits(String(newUser.uid), 10, 'Signup Bonus');
        await signIn(form.email, form.password);
        navigate('/', { replace: true });
      } else {
        await signIn(form.email, form.password);
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || JSON.stringify(err) || 'An error occurred during signup');
      if (err.code === 'auth/email-already-in-use') {
        setIsSignup(false); // Switch to sign in mode if email exists
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#fffde4">
      <Paper sx={{ p: 4, maxWidth: 500, width: '100%', borderRadius: 4, boxShadow: 6 }}>
        <Typography variant="h5" mb={2} align="center">{isSignup ? 'Sign Up & Onboarding' : 'Sign In'}</Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField 
            fullWidth 
            label="Email" 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            margin="normal" 
            required 
            disabled={isSubmitting}
          />
          <TextField 
            fullWidth 
            label="Password" 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={handleChange} 
            margin="normal" 
            required 
            disabled={isSubmitting}
          />
          {isSignup && (
            <>
              <Typography fontWeight={600} mt={2} mb={0.5}>
                Full Name <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField 
                fullWidth 
                placeholder="Enter Name"
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                margin="normal" 
                required 
                disabled={isSubmitting}
              />
              <Typography fontWeight={600} mb={0.5}>
                Gender <span style={{ color: 'red' }}>*</span>
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={form.gender}
                  onChange={e => setForm({ ...form, gender: e.target.value })}
                  label="Gender"
                  required
                  disabled={isSubmitting}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <Typography fontWeight={600} mt={2} mb={1}>
                Birth Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Day</InputLabel>
                    <Select
                      name="day"
                      value={form.day}
                      onChange={e => setForm({ ...form, day: e.target.value })}
                      label="Day"
                      required
                      disabled={isSubmitting}
                    >
                      {days.map(day => (
                        <MenuItem key={day} value={String(day).padStart(2, '0')}>{day}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Month</InputLabel>
                    <Select
                      name="month"
                      value={form.month}
                      onChange={e => setForm({ ...form, month: e.target.value })}
                      label="Month"
                      required
                      disabled={isSubmitting}
                    >
                      {months.map(month => (
                        <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Year</InputLabel>
                    <Select
                      name="year"
                      value={form.year}
                      onChange={e => setForm({ ...form, year: e.target.value })}
                      label="Year"
                      required
                      disabled={isSubmitting}
                    >
                      {years.map(year => (
                        <MenuItem key={year} value={String(year)}>{year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Hour</InputLabel>
                    <Select
                      name="hour"
                      value={form.hour}
                      onChange={e => setForm({ ...form, hour: e.target.value })}
                      label="Hour"
                      required
                      disabled={isSubmitting}
                    >
                      {hours.map(hour => (
                        <MenuItem key={hour} value={String(hour).padStart(2, '0')}>{hour}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Minute</InputLabel>
                    <Select
                      name="minute"
                      value={form.minute}
                      onChange={e => setForm({ ...form, minute: e.target.value })}
                      label="Minute"
                      required
                      disabled={isSubmitting}
                    >
                      {minutesSeconds.map(min => (
                        <MenuItem key={min} value={String(min).padStart(2, '0')}>{min}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Second</InputLabel>
                    <Select
                      name="second"
                      value={form.second}
                      onChange={e => setForm({ ...form, second: e.target.value })}
                      label="Second"
                      required
                      disabled={isSubmitting}
                    >
                      {minutesSeconds.map(sec => (
                        <MenuItem key={sec} value={String(sec).padStart(2, '0')}>{sec}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Typography fontWeight={600} mt={2} mb={0.5}>
                Birth Place <span style={{ color: 'red' }}>*</span>
              </Typography>
              <LocationAutocomplete
                value={form.place}
                onChange={loc => setForm({ ...form, place: loc })}
                label="Birth Place"
                disabled={isSubmitting}
              />
            </>
          )}
          <Button
            fullWidth
            sx={{
              mt: 4,
              borderRadius: 8,
              background: '#222',
              color: '#ffe066',
              fontWeight: 700,
              fontSize: '1.1rem',
              py: 1.5,
              boxShadow: 2,
              '&:hover': { background: '#ffe066', color: '#222' },
            }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSignup ? (isSubmitting ? 'Signing Up...' : 'Sign Up') : (isSubmitting ? 'Signing In...' : 'Sign In')}
          </Button>
          <Button
            fullWidth
            variant="text"
            sx={{ mt: 2, color: '#6C47FF', fontWeight: 600 }}
            onClick={() => { setIsSignup(!isSignup); setError(''); }}
            disabled={isSubmitting}
          >
            {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AuthOnboardingPage; 