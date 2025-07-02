import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, MessageSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Booking, BookingStatus } from '../../types';
import useBookingStore from '../../store/bookingStore';

interface BookingCardProps {
  booking: Booking;
  vendorName?: string;
  serviceName: string;
  isVendorView?: boolean;
  onAccept?: () => Promise<void>;
  onDecline?: () => Promise<void>;
  onComplete?: () => Promise<void>;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  vendorName,
  serviceName,
  isVendorView = false,
  onAccept,
  onDecline,
  onComplete,
}) => {
  const { updateBookingStatus, isLoading } = useBookingStore();
  const navigate = useNavigate();
  
  const statusVariant: Record<BookingStatus, 'default' | 'primary' | 'success' | 'danger' | 'warning'> = {
    pending: 'warning',
    accepted: 'success',
    declined: 'danger',
    canceled: 'default',
    completed: 'primary',
  };
  
  const statusText: Record<BookingStatus, string> = {
    pending: 'Pending',
    accepted: 'Accepted',
    declined: 'Declined',
    canceled: 'Canceled',
    completed: 'Completed',
  };
  
  const handleAccept = async () => {
    if (onAccept) {
      await onAccept();
    } else {
      await updateBookingStatus(booking.id, 'accepted');
    }
  };
  
  const handleDecline = async () => {
    if (onDecline) {
      await onDecline();
    } else {
      await updateBookingStatus(booking.id, 'declined');
    }
  };

  const handleComplete = async () => {
    if (onComplete) {
      await onComplete();
    } else {
      await updateBookingStatus(booking.id, 'completed');
    }
  };

  const handleChatClick = () => {
    navigate(`/bookings/${booking.id}/chat`);
  };
  
  const formattedDate = booking.date;
  const createdAt = format(parseISO(booking.createdAt), 'MMM d, yyyy');
  
  return (
    <Card className="w-full">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold">{serviceName}</h3>
            {vendorName && (
              <p className="text-gray-600 text-sm">
                {isVendorView ? 'Customer' : 'Vendor'}: {vendorName}
              </p>
            )}
          </div>
          <Badge variant={statusVariant[booking.status]}>
            {statusText[booking.status]}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar size={16} className="mr-2" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock size={16} className="mr-2" />
            <span>{booking.time}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin size={16} className="mr-2" />
            <span>{booking.location}</span>
          </div>
        </div>
        
        {booking.notes && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Notes:</p>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {booking.notes}
            </p>
          </div>
        )}
        
        <div className="text-xs text-gray-500 mb-4">
          Booking created on {createdAt}
        </div>
        
        {isVendorView && booking.status === 'pending' && (
          <div className="flex space-x-2">
            <Button
              variant="success"
              onClick={handleAccept}
              isLoading={isLoading}
              fullWidth
            >
              Accept
            </Button>
            <Button
              variant="danger"
              onClick={handleDecline}
              isLoading={isLoading}
              fullWidth
            >
              Decline
            </Button>
          </div>
        )}
        
        {isVendorView && booking.status === 'accepted' && (
          <Button
            variant="primary"
            onClick={handleComplete}
            isLoading={isLoading}
            fullWidth
          >
            Mark as Completed
          </Button>
        )}
        
        {booking.status === 'accepted' && (
          <Button
            variant="primary"
            fullWidth
            className="flex items-center justify-center"
            onClick={handleChatClick}
          >
            <MessageSquare size={16} className="mr-2" />
            Chat with {isVendorView ? 'Customer' : 'Vendor'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCard;