import React from 'react';
import { Card, CardContent, Typography, Button, Stack, Skeleton } from '@mui/material';

const QuickActions: React.FC = () => {
  // Placeholder loading state
  const loading = false;
  const actions = [
    { label: 'Book Consultation', onClick: () => {} },
    { label: 'Ask a Question', onClick: () => {} },
    { label: 'Buy Credits', onClick: () => {} },
    { label: 'View Reports', onClick: () => {} },
  ];

  return (
    <Card sx={{ minHeight: 120 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Quick Actions
        </Typography>
        {loading ? (
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rectangular" width={100} height={36} />
            <Skeleton variant="rectangular" width={100} height={36} />
            <Skeleton variant="rectangular" width={100} height={36} />
          </Stack>
        ) : (
          <Stack direction="row" spacing={2}>
            {actions.map((action, idx) => (
              <Button key={idx} variant="contained" color="primary" onClick={action.onClick} disableElevation>
                {action.label}
              </Button>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickActions; 