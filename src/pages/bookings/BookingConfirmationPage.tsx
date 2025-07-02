import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useBookingStore from '../../store/bookingStore';
import { Booking } from '../../../server/src/types';

const BookingConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBookingById, fetchBookings } = useBookingStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  
  useEffect(() => {
    const loadBooking = async () => {
      if (id) {
        await fetchBookings();
        const foundBooking = getBookingById(id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      }
    };
    
    loadBooking();
  }, [id, getBookingById, fetchBookings]);
  
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            The booking you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/customer/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Request Submitted!</h1>
              <p className="text-gray-600">
                Your booking request has been sent to the vendor. You'll receive a notification once they respond.
              </p>
            </div>
            
            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <Calendar size={20} className="mr-3 text-gray-500" />
                  <span><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Clock size={20} className="mr-3 text-gray-500" />
                  <span><strong>Time:</strong> {booking.time}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <MapPin size={20} className="mr-3 text-gray-500" />
                  <span><strong>Location:</strong> {booking.location}</span>
                </div>
                
                {booking.notes && (
                  <div className="mt-4">
                    <p className="font-semibold mb-1">Additional Notes:</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{booking.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-gray-600 text-sm mb-6">
              <p className="mb-2">
                <strong>Important:</strong> The vendor has 24 hours to respond to your request.
              </p>
              <p>
                If they don't respond within this timeframe, your booking will be automatically canceled,
                and you'll be notified.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Link to="/customer/dashboard" className="flex-1">
                <Button fullWidth>Go to Dashboard</Button>
              </Link>
              <Link to="/services" className="flex-1">
                <Button variant="outline" fullWidth>Browse More Services</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;