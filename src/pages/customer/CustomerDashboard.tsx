import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import MyBookings from '../../components/customer/MyBookings';
import { useWebSocket } from '../../hooks/useWebSocket';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Initialize WebSocket connection
  useWebSocket();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Customer Dashboard
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          My Bookings
        </Typography>
        <MyBookings />
      </Box>
    </Container>
  );
};

export default CustomerDashboard; 