import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Bell, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import useAuthStore from '../store/authStore';
import useBookingStore from '../store/bookingStore';
import useVendorStore from '../store/vendorStore';
import useCustomerStore from '../store/customerStore';
import { toast } from 'react-hot-toast';
import { Booking } from '../types';

const NotificationsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { bookings, getBookingsByVendorId, getBookingsByCustomerId, fetchBookings } = useBookingStore();
  const { vendors, fetchVendors } = useVendorStore();
  const { customers, fetchCustomers } = useCustomerStore();
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    timestamp: Date;
    type: 'info' | 'success' | 'warning' | 'error';
    booking: Booking;
  }>>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchBookings(),
        fetchVendors(),
        fetchCustomers()
      ])
        .then(() => {
          generateNotifications();
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          toast.error('Failed to load notifications');
          setLoading(false);
        });
    }
  }, [user, fetchBookings, fetchVendors, fetchCustomers]);

  const generateNotifications = () => {
    if (!user) return;

    const userBookings = user.role === 'vendor' 
      ? getBookingsByVendorId(user.id)
      : getBookingsByCustomerId(user.id);

    const notificationsList = userBookings.map(booking => {
      let message = '';
      let type: 'info' | 'success' | 'warning' | 'error' = 'info';

      if (user.role === 'vendor') {
        const customerName = customers.find(c => c.id === booking.customerId)?.name || 'A customer';
        
        switch (booking.status) {
          case 'pending':
            message = `${customerName} has requested a booking for ${new Date(booking.date).toLocaleDateString()}`;
            type = 'warning';
            break;
          case 'accepted':
            message = `You have accepted the booking from ${customerName}`;
            type = 'success';
            break;
          case 'declined':
            message = `You have declined the booking from ${customerName}`;
            type = 'error';
            break;
          case 'completed':
            message = `Booking with ${customerName} has been marked as completed`;
            type = 'success';
            break;
        }
      } else {
        const vendorName = vendors.find(v => v.id === booking.vendorId)?.name || 'The vendor';
        
        switch (booking.status) {
          case 'pending':
            message = `Your booking request with ${vendorName} is pending`;
            type = 'info';
            break;
          case 'accepted':
            message = `${vendorName} has accepted your booking request`;
            type = 'success';
            break;
          case 'declined':
            message = `${vendorName} has declined your booking request`;
            type = 'error';
            break;
          case 'completed':
            message = `Your booking with ${vendorName} has been completed`;
            type = 'success';
            break;
        }
      }

      return {
        id: booking.id,
        message,
        timestamp: new Date(booking.updatedAt || booking.createdAt),
        type,
        booking
      };
    });

    // Sort notifications by timestamp, most recent first
    notificationsList.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setNotifications(notificationsList);
  };

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <Bell className="h-6 w-6 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Calendar className="h-6 w-6 text-blue-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'warning':
        return <Badge variant="warning">New Request</Badge>;
      case 'error':
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="default">Info</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <Badge variant="default">{notifications.length} Updates</Badge>
        </div>

        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">
                You don't have any notifications at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.message}
                        </p>
                        {getNotificationBadge(notification.type)}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {notification.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;