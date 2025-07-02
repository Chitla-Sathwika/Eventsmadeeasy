import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ChatInterface from '../../components/chat/ChatInterface';
import useAuthStore from '../../store/authStore';
import useBookingStore from '../../store/bookingStore';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Booking } from '../../types';
import { toast } from 'react-hot-toast';

const BookingChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuthStore();
  const { getBookingById, fetchBookings } = useBookingStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize WebSocket connection
  useWebSocket();
  
  useEffect(() => {
    const loadBooking = async () => {
      if (id) {
        setIsLoading(true);
        try {
          console.log('Fetching bookings...');
          await fetchBookings();
          console.log('Getting booking by ID:', id);
          const foundBooking = getBookingById(id);
          if (foundBooking) {
            console.log('Booking found:', foundBooking);
            setBooking(foundBooking);
          } else {
            console.log('Booking not found');
            toast.error('Booking not found');
          }
        } catch (error) {
          console.error('Error loading booking:', error);
          toast.error('Failed to load booking details');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadBooking();
  }, [id, getBookingById, fetchBookings]);
  
  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading booking details...</div>
        </div>
      </div>
    );
  }
  
  // Redirect if booking not found
  if (!booking) {
    return <Navigate to={user.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard'} />;
  }
  
  // Redirect if booking is not accepted
  if (booking.status !== 'accepted') {
    return <Navigate to={user.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard'} />;
  }
  
  // Check if user is part of this booking
  const isCustomer = booking.customerId === user.id;
  const isVendor = booking.vendorId === user.id;
  
  if (!isCustomer && !isVendor) {
    return <Navigate to={user.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard'} />;
  }
  
  // In a real app, we would fetch the other party's name from the database
  const recipientName = isCustomer ? 'Vendor' : 'Customer';
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to={user.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard'}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </Link>
        </div>
        
        <ChatInterface bookingId={booking.id} recipientName={recipientName} />
      </div>
    </div>
  );
};

export default BookingChatPage;