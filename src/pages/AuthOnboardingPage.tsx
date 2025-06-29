import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Paper, Typography, Box, MenuItem, Alert, Grid, FormControl, InputLabel, Select, SelectChangeEvent, InputAdornment } from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { saveUserProfile } from '../services/firestore/users';
import { useNavigate } from 'react-router-dom';
import LocationAutocomplete, { LocationValue } from '../components/common/LocationAutocomplete';
import { addCredits } from '../services/credits';
import { signUpWithPhone, verifyPhoneCode, initializeRecaptcha } from '../services/auth';

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

const PHONE_REGEX = /^\d{10}$/;
const OTP_REGEX = /^\d{6}$/;

const recaptchaInitialized = { current: false };

const AuthOnboardingPage: React.FC = () => {
  const { user } = useUser();
  const [step, setStep] = useState(1); // 1: phone/otp, 2: profile
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneDigits, setPhoneDigits] = useState(''); // Only 10 digits
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [profileForm, setProfileForm] = useState({
    name: '',
    gender: 'other',
    day: '',
    month: '',
    year: '',
    hour: '',
    minute: '',
    second: '',
    place: null as LocationValue | null,
  });
  const [profileError, setProfileError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!recaptchaInitialized.current) {
      initializeRecaptcha('recaptcha-container-onboarding');
      recaptchaInitialized.current = true;
    }
  }, []);

  // Step 1: Phone/OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!PHONE_REGEX.test(phoneDigits)) {
      setError('Enter a valid 10-digit Indian phone number.');
      return;
    }
    setIsSubmitting(true);
    try {
      const fullPhone = '+91' + phoneDigits;
      const result = await signUpWithPhone(fullPhone, 'dummyPassword'); // password not used
      setConfirmationResult(result.confirmationResult);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!OTP_REGEX.test(otpCode)) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    setIsSubmitting(true);
    try {
      const user = await verifyPhoneCode(confirmationResult, otpCode);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Profile
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    setProfileError('');
  };
  const handleProfileSelectChange = (e: SelectChangeEvent<string>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    setProfileError('');
  };
  const handleProfileSave = async () => {
    setProfileError('');
    if (!profileForm.name) return setProfileError('Name is required.');
    if (!profileForm.gender) return setProfileError('Gender is required.');
    if (!profileForm.day || !profileForm.month || !profileForm.year) return setProfileError('Date of birth is required.');
    if (!profileForm.hour || !profileForm.minute || !profileForm.second) return setProfileError('Time of birth is required.');
    if (!profileForm.place) return setProfileError('Place of birth is required.');
    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const dateStr = `${profileForm.year}-${profileForm.month.padStart(2, '0')}-${profileForm.day.padStart(2, '0')}`;
      const timeStr = `${profileForm.hour.padStart(2, '0')}:${profileForm.minute.padStart(2, '0')}:${profileForm.second.padStart(2, '0')}`;
      await saveUserProfile({
        uid: user?.uid || '',
        name: profileForm.name,
        gender: profileForm.gender as 'male' | 'female' | 'other',
        phoneNumber: '+91' + phoneDigits,
        profilePictureUrl: '',
        birthDetails: {
          date: dateStr,
          time: timeStr,
          location: profileForm.place
            ? {
                name: profileForm.place.name,
                latitude: profileForm.place.latitude,
                longitude: profileForm.place.longitude,
              }
            : { name: '', latitude: 0, longitude: 0 },
        },
        createdAt: now,
        updatedAt: now,
      });
      await addCredits(user?.uid || '', 10, 'Signup Bonus');
      navigate('/');
    } catch (err) {
      setProfileError('Failed to save profile.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSkip = () => {
    navigate('/');
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#fffde4">
      {/* Always keep the reCAPTCHA container in the DOM, hidden off-screen */}
      <div id="recaptcha-container-onboarding" style={{ position: 'absolute', left: '-9999px', top: 0 }} />
      <Paper sx={{ p: 4, maxWidth: 500, width: '100%', borderRadius: 4, boxShadow: 6 }}>
        <Typography variant="h5" mb={2} align="center">
          {step === 1 ? 'Continue with Phone' : 'Complete Your Profile'}
        </Typography>
        {step === 1 && (
          <>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={confirmationResult ? handleVerifyOTP : handleSendOTP} autoComplete="off">
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={phoneDigits}
                onChange={e => setPhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 10))}
                margin="normal"
                required
                disabled={isSubmitting || !!confirmationResult}
                placeholder="XXXXXXXXXX"
                helperText="Enter your 10-digit mobile number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                }}
              />
              {confirmationResult && (
                <TextField
                  fullWidth
                  label="OTP Code"
                  name="otpCode"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  margin="normal"
                  required
                  disabled={isSubmitting}
                  placeholder="123456"
                  inputProps={{ maxLength: 6 }}
                />
              )}
              <Button
                fullWidth
                sx={{ mt: 3, borderRadius: 2, fontWeight: 600, fontSize: '1.1rem' }}
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                color="primary"
              >
                {confirmationResult ? (isSubmitting ? 'Verifying...' : 'Verify OTP') : (isSubmitting ? 'Sending OTP...' : 'Get OTP')}
              </Button>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            {profileError && <Alert severity="error" sx={{ mb: 2 }}>{profileError}</Alert>}
            <form autoComplete="off" onSubmit={e => { e.preventDefault(); handleProfileSave(); }}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                margin="normal"
                required
                disabled={isSubmitting}
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={profileForm.gender}
                  onChange={handleProfileSelectChange}
                  disabled={isSubmitting}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <Typography fontWeight={600} mt={2} mb={1}>Date of Birth</Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Day</InputLabel>
                    <Select
                      name="day"
                      value={profileForm.day}
                      onChange={handleProfileSelectChange}
                      disabled={isSubmitting}
                    >
                      {days.map(day => (
                        <MenuItem key={day} value={day.toString()}>{day}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Month</InputLabel>
                    <Select
                      name="month"
                      value={profileForm.month}
                      onChange={handleProfileSelectChange}
                      disabled={isSubmitting}
                    >
                      {months.map(month => (
                        <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Year</InputLabel>
                    <Select
                      name="year"
                      value={profileForm.year}
                      onChange={handleProfileSelectChange}
                      disabled={isSubmitting}
                    >
                      {years.map(year => (
                        <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Typography fontWeight={600} mt={2} mb={1}>Time of Birth</Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Hour</InputLabel>
                    <Select
                      name="hour"
                      value={profileForm.hour}
                      onChange={handleProfileSelectChange}
                      disabled={isSubmitting}
                    >
                      {hours.map(hour => (
                        <MenuItem key={hour} value={hour.toString()}>{hour.toString().padStart(2, '0')}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Minute</InputLabel>
                    <Select
                      name="minute"
                      value={profileForm.minute}
                      onChange={handleProfileSelectChange}
                      disabled={isSubmitting}
                    >
                      {minutesSeconds.map(minute => (
                        <MenuItem key={minute} value={minute.toString()}>{minute.toString().padStart(2, '0')}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Second</InputLabel>
                    <Select
                      name="second"
                      value={profileForm.second}
                      onChange={handleProfileSelectChange}
                      disabled={isSubmitting}
                    >
                      {minutesSeconds.map(second => (
                        <MenuItem key={second} value={second.toString()}>{second.toString().padStart(2, '0')}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Typography fontWeight={600} mt={2} mb={0.5}>Place of Birth</Typography>
              <LocationAutocomplete
                value={profileForm.place}
                onChange={loc => setProfileForm({ ...profileForm, place: loc })}
                label="Birth Place"
                disabled={isSubmitting}
              />
              <Button
                fullWidth
                sx={{ mt: 4, borderRadius: 8, background: '#222', color: '#ffe066', fontWeight: 700, fontSize: '1.1rem', py: 1.5, boxShadow: 2, '&:hover': { background: '#ffe066', color: '#222' } }}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button
                fullWidth
                variant="text"
                sx={{ mt: 2, color: '#6C47FF', fontWeight: 600 }}
                onClick={handleSkip}
                disabled={isSubmitting}
              >
                Skip
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default AuthOnboardingPage; 