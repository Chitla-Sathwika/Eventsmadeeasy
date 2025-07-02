import React, { useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import useAuthStore from '../../store/authStore';
import useBookingStore from '../../store/bookingStore';
import { useNavigate } from 'react-router-dom';
import BookingRequests from '../../components/vendor/BookingRequests';
import { useWebSocket } from '../../hooks/useWebSocket';

const VendorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchBookings } = useBookingStore();
  const navigate = useNavigate();

  // Initialize WebSocket connection
  useWebSocket();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch bookings when component mounts
    fetchBookings();
  }, [user, navigate, fetchBookings]);

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Vendor Dashboard
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Booking Requests
        </Typography>
        <BookingRequests />
      </Box>
    </Container>
  );
};

export default VendorDashboard; 