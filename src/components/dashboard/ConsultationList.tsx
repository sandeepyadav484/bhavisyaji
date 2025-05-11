import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Skeleton } from '@mui/material';

const ConsultationList: React.FC = () => {
  // Placeholder loading state
  const loading = false;
  const consultations = [
    { id: 1, astrologer: 'Astrologer A', date: '2024-05-04', summary: 'Discussed career and finance.' },
    { id: 2, astrologer: 'Astrologer B', date: '2024-05-02', summary: 'Relationship advice.' },
    { id: 3, astrologer: 'Astrologer C', date: '2024-04-30', summary: 'Health and wellness.' },
  ];

  return (
    <Card sx={{ minHeight: 160 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Recent Consultations
        </Typography>
        {loading ? (
          <>
            <Skeleton variant="text" width={200} />
            <Skeleton variant="text" width={180} />
            <Skeleton variant="text" width={160} />
          </>
        ) : (
          <List dense>
            {consultations.map((c) => (
              <ListItem key={c.id} disablePadding>
                <ListItemText
                  primary={`${c.astrologer} (${c.date})`}
                  secondary={c.summary}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsultationList; 