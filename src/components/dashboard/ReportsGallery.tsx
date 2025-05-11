import React from 'react';
import { Card, CardContent, Typography, Button, Box, Skeleton } from '@mui/material';

const ReportsGallery: React.FC = () => {
  // Placeholder loading state
  const loading = false;
  const reports = [
    { id: 1, title: 'Annual Horoscope', date: '2024-01-01' },
    { id: 2, title: 'Compatibility Report', date: '2024-03-15' },
    { id: 3, title: 'Career Analysis', date: '2024-02-10' },
  ];

  return (
    <Card sx={{ minHeight: 160 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Your Reports
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rectangular" width={120} height={80} />
            <Skeleton variant="rectangular" width={120} height={80} />
            <Skeleton variant="rectangular" width={120} height={80} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
            {reports.map((report) => (
              <Card key={report.id} sx={{ minWidth: 120, flex: '0 0 auto' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={500} noWrap>
                    {report.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {report.date}
                  </Typography>
                  <Button size="small" sx={{ mt: 1 }} variant="outlined">
                    View
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportsGallery; 