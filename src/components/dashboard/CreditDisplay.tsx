import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton, Avatar } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const CreditDisplay: React.FC = () => {
  // Placeholder loading state
  const loading = false;
  const credits = 120;

  return (
    <Card sx={{ minHeight: 100, display: 'flex', alignItems: 'center' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'gold', width: 48, height: 48 }}>
          <MonetizationOnIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Credits
          </Typography>
          {loading ? (
            <Skeleton variant="text" width={60} />
          ) : (
            <Typography variant="h5" fontWeight={700} color="primary">
              {credits}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreditDisplay; 