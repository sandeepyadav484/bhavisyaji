import React, { useState } from 'react';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { deleteUserProfile, deleteAuthUser } from '../services/firestore/users';
import { useNavigate } from 'react-router-dom';

const DeleteAccountPage: React.FC = () => {
  const { user } = useUser();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    setDeleting(true);
    setError('');
    setSuccess('');
    try {
      if (user?.uid) {
        await deleteUserProfile(user.uid);
        await deleteAuthUser();
        setSuccess('Your account has been deleted.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError('No user is logged in.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete account.');
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Delete Account
          </Typography>
          <Typography color="error" align="center">
            You must be logged in to delete your account.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Delete Account
        </Typography>
        <Typography align="center" sx={{ mb: 3 }}>
          Deleting your account is permanent and cannot be undone. All your data will be removed.
        </Typography>
        <Box display="flex" justifyContent="center">
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </Box>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success" align="center" sx={{ mt: 2 }}>
            {success}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default DeleteAccountPage; 