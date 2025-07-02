import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextFieldProps } from '@mui/material/TextField';
import useBookingStore from '../../store/bookingStore';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface BookingFormProps {
  vendorId: string;
  serviceId: string;
  onSuccess?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ vendorId, serviceId, onSuccess }) => {
  const { user } = useAuthStore();
  const { createBooking } = useBookingStore();
  const navigate = useNavigate();

  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user?.id) {
      navigate('/login');
      return;
    }

    if (!date || !time || !location) {
      setError('Please fill in all required fields');
      return;
    }

    console.log('Creating booking with data:', {
      customerId: user.id,
      vendorId,
      serviceId,
      date: date.toISOString(),
      time: time.toLocaleTimeString(),
      location,
      notes,
      status: 'pending'
    });

    try {
      const newBooking = await createBooking({
        customerId: user.id,
        vendorId,
        serviceId,
        date: date.toISOString(),
        time: time.toLocaleTimeString(),
        location,
        notes,
        status: 'pending',
      });

      console.log('Booking created successfully:', newBooking);

      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/bookings/${newBooking.id}/confirmation`);
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
      setError(error instanceof Error ? error.message : 'Failed to create booking');
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Book Service
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={(newValue: Date | null) => setDate(newValue)}
                  renderInput={(params: TextFieldProps) => <TextField {...params} fullWidth required />}
                  minDate={new Date()}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Time"
                  value={time}
                  onChange={(newValue: Date | null) => setTime(newValue)}
                  renderInput={(params: TextFieldProps) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes (Optional)"
                value={notes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
                multiline
                rows={4}
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!date || !time || !location}
                >
                  Book Now
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm; 