import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, TextField, Button, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { signUpWithEmail, signInWithEmail, sendPasswordResetEmail } from '../services/auth';
import { useUser } from '../contexts/UserContext';
import { useTranslation } from 'react-i18next';

const EMAIL_REGEX = /^[^\s@]+@[^"]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const AuthPage: React.FC = () => {
  const [tab, setTab] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [justSignedUp, setJustSignedUp] = useState(false);
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue as 'signin' | 'signup' | 'reset');
    setError(null);
    setSuccess(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const validateSignup = () => {
    if (!EMAIL_REGEX.test(email)) return 'Enter a valid email.';
    if (!PASSWORD_REGEX.test(password)) return 'Password must be at least 8 characters, include uppercase, lowercase, and a digit.';
    if (password !== confirmPassword) return 'Passwords do not match.';
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
      await signUpWithEmail(email, password);
      setJustSignedUp(true);
      // The redirect will happen in useEffect when user is set
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
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      setJustSignedUp(false);
      // The redirect will happen in useEffect when user is set
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signin failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!EMAIL_REGEX.test(email)) {
      setError('Enter a valid email.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email.');
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
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 2 }}
            aria-label="auth tabs"
          >
            <Tab label={t('signIn', 'Sign In')} value="signin" />
            <Tab label={t('signUp', 'Sign Up')} value="signup" />
            <Tab label={t('forgotPassword', 'Forgot Password')} value="reset" />
          </Tabs>
          {tab === 'signup' && (
            <form onSubmit={handleSignup}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                margin="normal"
                autoComplete="email"
                disabled={loading}
                sx={{ borderRadius: 2 }}
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
                <Typography color="error" sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, borderRadius: 2, fontWeight: 600, fontSize: '1.1rem' }}
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </form>
          )}
          {tab === 'signin' && (
            <form onSubmit={handleSignin}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                margin="normal"
                autoComplete="email"
                disabled={loading}
                sx={{ borderRadius: 2 }}
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
                <Typography color="error" sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, borderRadius: 2, fontWeight: 600, fontSize: '1.1rem' }}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              <Button
                color="secondary"
                fullWidth
                sx={{ mt: 2, borderRadius: 2 }}
                onClick={() => setTab('reset')}
                disabled={loading}
              >
                {t('forgotPassword', 'Forgot Password')}
              </Button>
            </form>
          )}
          {tab === 'reset' && (
            <form onSubmit={handleReset}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                margin="normal"
                autoComplete="email"
                disabled={loading}
                sx={{ borderRadius: 2 }}
              />
              {error && (
                <Typography color="error" sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                  {error}
                </Typography>
              )}
              {success && (
                <Typography color="primary" sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                  {success}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, borderRadius: 2, fontWeight: 600, fontSize: '1.1rem' }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Button
                color="secondary"
                fullWidth
                sx={{ mt: 2, borderRadius: 2 }}
                onClick={() => setTab('signin')}
                disabled={loading}
              >
                {t('signIn', 'Sign In')}
              </Button>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthPage; 