import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import useBookingStore from '../../store/bookingStore';
import useAuthStore from '../../store/authStore';
import { Vendor } from '../../types';

interface BookingFormProps {
  vendor: Vendor;
}

const BookingForm: React.FC<BookingFormProps> = ({ vendor }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createBooking, isLoading } = useBookingStore();
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const booking = await createBooking({
        customerId: user.id,
        vendorId: vendor.id,
        serviceId: vendor.service.id,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        notes: formData.notes,
      });
      
      navigate(`/bookings/${booking.id}/confirmation`);
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-bold">Book {vendor.service.name}</h2>
        <p className="text-gray-600 text-sm mt-1">
          Fill out the form below to request a booking with {vendor.name}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
              min={new Date().toISOString().split('T')[0]}
              fullWidth
            />
            
            <Input
              label="Time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              error={errors.time}
              fullWidth
            />
            
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              placeholder="Enter the event location"
              fullWidth
            />
            
            <Textarea
              label="Additional Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Provide any additional details about your event..."
              rows={4}
              fullWidth
            />
            
            <div className="pt-2">
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Request Booking
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                By submitting this request, you agree to our terms and conditions.
                The vendor will respond to your request within 24 hours.
              </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;