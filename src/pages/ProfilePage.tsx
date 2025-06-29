import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, Paper, Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useUser } from '../contexts/UserContext';
import PersonalInfoForm from '../components/profile/PersonalInfoForm';
import BirthDetailsForm from '../components/profile/BirthDetailsForm';
import LocationAutocomplete, { LocationValue } from '../components/common/LocationAutocomplete';
import { getUserProfile, saveUserProfile, updateUserProfile } from '../services/firestore/users';
import { UserProfile } from '../models/user';

const ProfilePage: React.FC = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const hasFetchedProfile = useRef(false);

  // Form state
  const [personalInfo, setPersonalInfo] = useState({ name: '', gender: '' as '' | 'male' | 'female' | 'other' });
  const [birthDetails, setBirthDetails] = useState({ day: '', month: '', year: '', hour: '', minute: '', second: '' });
  const [location, setLocation] = useState<LocationValue | null>(null);

  // Validation state
  const [formError, setFormError] = useState<string | null>(null);

  // Debug logging for user and loading state
  useEffect(() => {
    console.log('ProfilePage mounted/updated');
    console.log('Current user:', user);
    console.log('Current loading state:', loading);
  }, [user, loading]);

  useEffect(() => {
    const fetchProfile = async () => {
      console.log('Fetch profile useEffect triggered, user:', user);
      if (!user || hasFetchedProfile.current) {
        console.log('No user found or already fetched, skipping profile fetch');
        setLoading(false);
        return;
      }

      try {
        console.log('Starting profile fetch for user:', user.uid);
        setLoading(true);
        const data = await getUserProfile(user.uid);
        console.log('Profile fetch completed, data:', data);
        if (data) {
          setProfile(data);
          setPersonalInfo({ name: data.name, gender: data.gender });
          if (data.birthDetails?.date) {
            const date = new Date(data.birthDetails.date);
            setBirthDetails({
              day: String(date.getDate()),
              month: String(date.getMonth() + 1),
              year: String(date.getFullYear()),
              hour: data.birthDetails.time?.split(':')[0] || '',
              minute: data.birthDetails.time?.split(':')[1] || '',
              second: data.birthDetails.time?.split(':')[2] || '',
            });
          }
          setLocation(data.birthDetails?.location
            ? {
                name: data.birthDetails.location.name,
                latitude: data.birthDetails.location.latitude,
                longitude: data.birthDetails.location.longitude,
              }
            : null
          );
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        setError('Failed to load profile');
      } finally {
        console.log('Setting loading to false in fetchProfile');
        setLoading(false);
        hasFetchedProfile.current = true;
      }
    };

    fetchProfile();
  }, [user]);

  // Validation for all fields at once
  const validateAll = () => {
    if (!personalInfo.name.trim() || !personalInfo.gender) {
      setFormError('Name and gender are required.');
      return false;
    }
    if (!birthDetails.day || !birthDetails.month || !birthDetails.year) {
      setFormError('Birth date is required.');
      return false;
    }
    if (!birthDetails.hour || !birthDetails.minute || !birthDetails.second) {
      setFormError('Birth time is required.');
      return false;
    }
    if (!location || !location.name) {
      setFormError('Birth location is required.');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSave = async () => {
    if (!user) return;
    if (!validateAll()) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const now = new Date().toISOString();
      const dateStr = `${birthDetails.year}-${birthDetails.month.padStart(2, '0')}-${birthDetails.day.padStart(2, '0')}`;
      const timeStr = `${birthDetails.hour.padStart(2, '0')}:${birthDetails.minute.padStart(2, '0')}:${birthDetails.second.padStart(2, '0')}`;
      const userProfile: UserProfile = {
        uid: user.uid,
        name: personalInfo.name,
        gender: (personalInfo.gender || 'other') as 'male' | 'female' | 'other',
        phoneNumber: user.phoneNumber || '',
        profilePictureUrl: user.photoURL || '',
        birthDetails: {
          date: dateStr,
          time: timeStr,
          location: location!,
        },
        createdAt: profile?.createdAt || now,
        updatedAt: now,
      };
      if (profile) {
        await updateUserProfile(user.uid, userProfile);
      } else {
        await saveUserProfile(userProfile);
      }
      setProfile(userProfile);
      setSuccess(true);
      setFormError(null);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  console.log('ProfilePage loading state:', loading);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box className="min-h-screen flex items-center justify-center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ borderRadius: 4, p: 4, mt: 6, boxShadow: 6 }}>
        <Typography variant="h5" fontWeight={700} mb={3} align="center">
          Edit Profile
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          {/* Name */}
          <Typography fontWeight={600} mb={0.5}>
            Name <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter Name"
            value={personalInfo.name}
            onChange={e => setPersonalInfo({ ...personalInfo, name: e.target.value })}
            margin="normal"
          />

          {/* Gender */}
          <Typography fontWeight={600} mb={0.5}>
            Gender <span style={{ color: 'red' }}>*</span>
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select
              value={personalInfo.gender}
              onChange={e => setPersonalInfo({ ...personalInfo, gender: e.target.value as any })}
              label="Gender"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          {/* Birth Details */}
          <Typography fontWeight={600} mt={2} mb={1}>
            Birth Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField label="Day" fullWidth value={birthDetails.day} onChange={e => setBirthDetails({ ...birthDetails, day: e.target.value })} />
            </Grid>
            <Grid item xs={4}>
              <TextField label="Month" fullWidth value={birthDetails.month} onChange={e => setBirthDetails({ ...birthDetails, month: e.target.value })} />
            </Grid>
            <Grid item xs={4}>
              <TextField label="Year" fullWidth value={birthDetails.year} onChange={e => setBirthDetails({ ...birthDetails, year: e.target.value })} />
            </Grid>
            <Grid item xs={4}>
              <TextField label="Hour" fullWidth value={birthDetails.hour} onChange={e => setBirthDetails({ ...birthDetails, hour: e.target.value })} />
            </Grid>
            <Grid item xs={4}>
              <TextField label="Minute" fullWidth value={birthDetails.minute} onChange={e => setBirthDetails({ ...birthDetails, minute: e.target.value })} />
            </Grid>
            <Grid item xs={4}>
              <TextField label="Second" fullWidth value={birthDetails.second} onChange={e => setBirthDetails({ ...birthDetails, second: e.target.value })} />
            </Grid>
          </Grid>

          {/* Birth Place */}
          <Typography fontWeight={600} mt={2} mb={0.5}>
            Birth Place <span style={{ color: 'red' }}>*</span>
          </Typography>
          <LocationAutocomplete
            value={location}
            onChange={setLocation}
            label="Birth Place"
            disabled={saving}
          />

          {/* Save Button */}
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
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
          {formError && (
            <Typography color="error" className="mt-4 text-center">
              {formError}
            </Typography>
          )}
          {error && (
            <Typography color="error" className="mt-4 text-center">
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success" className="mt-4 text-center">
              Profile saved successfully!
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage; 