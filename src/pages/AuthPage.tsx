import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, Paper, TextField, Button, Tabs, Tab, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { signUpWithPhone, signInWithPhone, verifyPhoneCode, initializeRecaptcha } from '../services/auth';
import { useUser } from '../contexts/UserContext';
import { useTranslation } from 'react-i18next';

const PHONE_REGEX = /^\+[1-9]\d{1,14}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const OTP_REGEX = /^\d{6}$/;

const AuthPage: React.FC = () => {
  const [tab, setTab] = useState<'signin' | 'signup' | 'verify'>('signin');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [justSignedUp, setJustSignedUp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { t } = useTranslation();

  useEffect(() => {
    if (user && location.pathname === '/auth') {
      if (justSignedUp) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/profile', { replace: true });
      }
    }
  }, [user, justSignedUp, navigate, location]);

  useEffect(() => {
    // Initialize reCAPTCHA when component mounts
    if (recaptchaContainerRef.current) {
      initializeRecaptcha('recaptcha-container');
    }
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue as 'signin' | 'signup' | 'verify');
    setError(null);
    setSuccess(null);
    setPhoneNumber('');
    setPassword('');
    setConfirmPassword('');
    setOtpCode('');
    setIsOtpSent(false);
    setConfirmationResult(null);
  };

  const validateSignup = () => {
    if (!PHONE_REGEX.test(phoneNumber)) return 'Enter a valid phone number with country code (e.g., +1234567890).';
    if (!PASSWORD_REGEX.test(password)) return 'Password must be at least 8 characters, include uppercase, lowercase, and a digit.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const validateSignin = () => {
    if (!PHONE_REGEX.test(phoneNumber)) return 'Enter a valid phone number with country code (e.g., +1234567890).';
    if (!password) return 'Password is required.';
    return null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const validation = validateSignup();
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);
    try {
      const result = await signUpWithPhone(phoneNumber, password);
      setConfirmationResult(result.confirmationResult);
      setIsOtpSent(true);
      setTab('verify');
      setSuccess('OTP sent to your phone number!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const validation = validateSignin();
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithPhone(phoneNumber, password);
      setConfirmationResult(result.confirmationResult);
      setIsOtpSent(true);
      setTab('verify');
      setSuccess('OTP sent to your phone number!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signin failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!OTP_REGEX.test(otpCode)) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      const user = await verifyPhoneCode(confirmationResult, otpCode);
      setJustSignedUp(true);
      // The redirect will happen in useEffect when user is set
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPhone(phoneNumber, password);
      setConfirmationResult(result.confirmationResult);
      setSuccess('OTP resent to your phone number!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
    }}>
      <Container maxWidth="sm" data-testid="auth-page">
        <Paper elevation={6} sx={{
          borderRadius: 4,
          p: { xs: 2, sm: 4 },
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(4px)',
        }}>
          <Typography variant="h3" component="h1" align="center" sx={{ color: '#6C47FF', fontWeight: 700, mb: 2 }}>
            {t('welcome')}
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 3, color: '#333' }}>
            {t('appName')} - {t('yourAiAstrologyCompanion', 'Your AI-powered Astrology Companion')}
          </Typography>
          
          {/* Hidden reCAPTCHA container */}
          <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
          
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 2 }}
            aria-label="auth tabs"
          >
            <Tab label={t('signIn', 'Sign In')} value="signin" />
            <Tab label={t('signUp', 'Sign Up')} value="signup" />
            {isOtpSent && <Tab label="Verify OTP" value="verify" />}
          </Tabs>
          
          {tab === 'signup' && (
            <form onSubmit={handleSignup}>
              <TextField
                label="Phone Number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                fullWidth
                required
                margin="normal"
                autoComplete="tel"
                disabled={loading}
                sx={{ borderRadius: 2 }}
                placeholder="+1234567890"
                helperText="Enter phone number with country code"
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
                autoComplete="new-password"
                disabled={loading}
                sx={{ borderRadius: 2 }}
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
                autoComplete="new-password"
                disabled={loading}
                sx={{ borderRadius: 2 }}
              />
              {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, borderRadius: 2, fontWeight: 600, fontSize: '1.1rem' }}
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Sign Up'}
              </Button>
            </form>
          )}
          
          {tab === 'signin' && (
            <form onSubmit={handleSignin}>
              <TextField
                label="Phone Number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                fullWidth
                required
                margin="normal"
                autoComplete="tel"
                disabled={loading}
                sx={{ borderRadius: 2 }}
                placeholder="+1234567890"
                helperText="Enter phone number with country code"
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
                autoComplete="current-password"
                disabled={loading}
                sx={{ borderRadius: 2 }}
              />
              {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, borderRadius: 2, fontWeight: 600, fontSize: '1.1rem' }}
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Sign In'}
              </Button>
            </form>
          )}
          
          {tab === 'verify' && (
            <form onSubmit={handleVerifyOTP}>
              <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
                Enter the 6-digit code sent to {phoneNumber}
              </Typography>
              <TextField
                label="OTP Code"
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                fullWidth
                required
                margin="normal"
                autoComplete="one-time-code"
                disabled={loading}
                sx={{ borderRadius: 2 }}
                placeholder="123456"
                inputProps={{ maxLength: 6 }}
              />
              {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
                  {success}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, borderRadius: 2, fontWeight: 600, fontSize: '1.1rem' }}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button
                variant="text"
                fullWidth
                sx={{ mt: 2, borderRadius: 2 }}
                onClick={resendOTP}
                disabled={loading}
              >
                Resend OTP
              </Button>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthPage; 