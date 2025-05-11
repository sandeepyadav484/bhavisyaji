import React, { useState } from 'react';
import { Box, Typography, Grid, Container, Dialog, DialogTitle, DialogContent, IconButton, Card, CardContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QuickActions from '../components/dashboard/QuickActions';
import HoroscopeWidget from '../components/dashboard/HoroscopeWidget';
import ConsultationList from '../components/dashboard/ConsultationList';
import ReportsGallery from '../components/dashboard/ReportsGallery';
import CreditDisplay from '../components/dashboard/CreditDisplay';

const DashboardPage: React.FC = () => {
  const [reportsOpen, setReportsOpen] = useState(false);
  // Placeholder user name; replace with real user context/service
  const userName = 'User';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Welcome back, {userName}!
      </Typography>
      <QuickActions />
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} md={6} lg={4}>
          <HoroscopeWidget />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ minHeight: 160, cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }} onClick={() => setReportsOpen(true)}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Reports
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                View your astrology and compatibility reports
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ConsultationList />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <CreditDisplay />
        </Grid>
      </Grid>
      <Dialog open={reportsOpen} onClose={() => setReportsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Your Reports
          <IconButton onClick={() => setReportsOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ReportsGallery />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default DashboardPage; 