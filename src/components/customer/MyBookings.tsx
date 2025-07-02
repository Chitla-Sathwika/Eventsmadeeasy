import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
} from '@mui/material';
import { format } from 'date-fns';
import useBookingStore from '../../store/bookingStore';
import useAuthStore from '../../store/authStore';

const MyBookings: React.FC = () => {
  const { user } = useAuthStore();
  const { bookings, isLoading, fetchBookings } = useBookingStore();

  React.useEffect(() => {
    if (user?.id) {
      fetchBookings();
    }
  }, [user?.id, fetchBookings]);

  const customerBookings = bookings.filter(booking => booking.customerId === user?.id);

  if (isLoading) {
    return <Typography>Loading bookings...</Typography>;
  }

  if (customerBookings.length === 0) {
    return <Typography>No bookings yet.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {customerBookings.map((booking) => (
        <Grid item xs={12} key={booking.id}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                      Booking Details
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MyBookings; 