import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import LanguageSelector from '../components/common/LanguageSelector';
import { useUser } from '../contexts/UserContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, profile, setUser, setProfile, signOut } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };
  const handleSignOut = async () => {
    handleMenuClose();
    setUser(null);
    setProfile(null);
    await signOut();
    navigate('/auth-onboarding');
  };

  return (
    <Box className="min-h-screen flex flex-col" data-testid="main-layout">
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#fff', boxShadow: '0 1px 6px 0 rgba(60,72,88,0.08)' }}>
        <Toolbar
          sx={{
            flexDirection: { xs: 'row', sm: 'row' },
            alignItems: 'center',
            px: { xs: 1, sm: 3 },
            py: { xs: 1, sm: 2 },
            gap: { xs: 1, sm: 0 }
          }}
        >
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            <img
              src="/logo.jpg"
              alt="Bhavisyaji Logo"
              style={{ height: 52, width: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </Box>
          {/* <Box sx={{ mr: 2 }}>
            <LanguageSelector />
          </Box> */}
          {user ? (
            <>
              <IconButton onClick={handleMenuOpen} color="inherit" sx={{ ml: 2 }}>
                <Avatar 
                  src={profile?.profilePictureUrl || ''} 
                  alt={profile?.name || user.phoneNumber || 'Profile'} 
                  sx={{ 
                    bgcolor: '#FFF9DB', 
                    border: '2px solid #FFE066', 
                    color: '#222',
                  }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Box px={2} py={1}>
                  <Typography variant="subtitle1">{profile?.name || user.phoneNumber}</Typography>
                  <Typography variant="body2" color="text.secondary">{user.phoneNumber}</Typography>
                </Box>
                <MenuItem onClick={handleProfile}>Edit Profile</MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                <MenuItem component={RouterLink} to="/privacy-policy" onClick={handleMenuClose}>Privacy Policy</MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/auth"
              data-testid="auth-nav-button"
              sx={{ ml: 2, fontWeight: 600, borderRadius: 2, bgcolor: '#fff', color: '#6C47FF', px: 3, boxShadow: 1, '&:hover': { bgcolor: '#f3e8ff' } }}
            >
              Sign In
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box className="flex-grow" sx={{ px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 3 } }}>
        {children}
      </Box>

      <Box className="bg-background-dark py-6" sx={{ py: { xs: 2, sm: 6 } }}>
        <Container>
          <Typography variant="body2" className="text-center text-text-light" sx={{ fontSize: { xs: 12, sm: 14 } }}>
            © {new Date().getFullYear()} Bhavisyaji - Your AI Astrology Companion. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout; 