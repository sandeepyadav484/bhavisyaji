import React from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import { useUser } from '../contexts/UserContext';

// Mock data for reports
const reports = [
  {
    id: 1,
    title: 'Birth Chart Analysis',
    date: '2024-03-15',
    type: 'PDF',
    size: '2.4 MB'
  },
  {
    id: 2,
    title: 'Yearly Horoscope 2024',
    date: '2024-03-10',
    type: 'PDF',
    size: '1.8 MB'
  },
  {
    id: 3,
    title: 'Career Path Reading',
    date: '2024-03-05',
    type: 'PDF',
    size: '3.1 MB'
  },
  {
    id: 4,
    title: 'Relationship Compatibility',
    date: '2024-02-28',
    type: 'PDF',
    size: '2.7 MB'
  }
];

const ReportsGallery: React.FC = () => {
  const { user, profile } = useUser();

  const handleDownload = async (report: any) => {
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: profile?.birthDetails?.birthDate,
          birthTime: profile?.birthDetails?.birthTime,
          birthPlace: profile?.birthDetails?.birthPlace,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate report');
      }
      
      // Get the PDF blob directly from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Could not download report: ' + err.message);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report.id}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                bgcolor: '#fff',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DescriptionIcon sx={{ fontSize: 40, color: '#4CAF50', mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {report.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {report.date}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {report.type} • {report.size}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(report)}
                  sx={{
                    bgcolor: '#4CAF50',
                    '&:hover': { bgcolor: '#388E3C' }
                  }}
                >
                  Download
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReportsGallery; 