import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid, Chip, Box, CircularProgress } from '@mui/material';
import useBookingStore from '../../store/bookingStore';
import useAuthStore from '../../store/authStore';
import { format } from 'date-fns';
import { Booking } from '../../../server/src/types';

const BookingRequests: React.FC = () => {
  const { user } = useAuthStore();
  const { bookings, isLoading, fetchBookings, updateBookingStatus } = useBookingStore();

  useEffect(() => {
    if (user?.id) {
      console.log('Fetching bookings for user:', user.id);
      console.log('User role:', user.role);
      fetchBookings();
    }
  }, [user?.id, fetchBookings]);

  // Log all bookings and user info when they change
  useEffect(() => {
    console.log('Current user:', user);
    console.log('All bookings:', bookings);
  }, [user, bookings]);

  const vendorBookings = bookings.filter((booking: Booking) => {
    const matches = booking.vendorId === user?.id;
    console.log('Booking:', {
      id: booking.id,
      vendorId: booking.vendorId,
      customerId: booking.customerId,
      status: booking.status,
      matches
    });
    return matches;
  });

  console.log('Filtered vendor bookings:', vendorBookings);

  const handleStatusUpdate = async (bookingId: string, status: 'accepted' | 'rejected') => {
    try {
      await updateBookingStatus(bookingId, status);
      // Refresh bookings after status update
      await fetchBookings();
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!user?.id) {
    return (
      <Typography color="error">
        Please log in to view booking requests.
      </Typography>
    );
  }

  if (user.role !== 'vendor') {
    return (
      <Typography color="error">
        This page is only accessible to vendors.
      </Typography>
    );
  }

  if (vendorBookings.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" color="textSecondary" align="center">
            No booking requests yet.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid container spacing={2}>
      {vendorBookings.map((booking: Booking) => (
        <Grid item xs={12} key={booking.id}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                      Booking Request
                    </Typography>
                    <Chip
                      label={booking.status}
                      color={
                        booking.status === 'pending'
                          ? 'warning'
                          : booking.status === 'accepted'
                          ? 'success'
                          : booking.status === 'rejected'
                          ? 'error'
                          : 'default'
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Date: {format(new Date(booking.date), 'PPP')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Time: {booking.time}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Location: {booking.location}
                  </Typography>
                </Grid>
                {booking.notes && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Notes: {booking.notes}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  {booking.status === 'pending' && (
                    <Box display="flex" gap={2}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleStatusUpdate(booking.id, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default BookingRequests; 