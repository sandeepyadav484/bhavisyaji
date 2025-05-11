import React from 'react';
import { Card, CardContent, Typography, Skeleton } from '@mui/material';

const HoroscopeWidget: React.FC = () => {
  // Placeholder loading state
  const loading = false;
  const horoscope = {
    sign: 'Aries',
    summary: "Today is a great day to focus on your goals and take action!"
  };

  return (
    <Card sx={{ minHeight: 160 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Today's Horoscope
        </Typography>
        {loading ? (
          <Skeleton variant="text" width={180} />
        ) : (
          <>
            <Typography variant="subtitle1" color="text.secondary">
              {horoscope.sign}
            </Typography>
            <Typography variant="body2" mt={1}>
              {horoscope.summary}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HoroscopeWidget; 