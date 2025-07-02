import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import BookingCard from '../../components/booking/BookingCard';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/authStore';
import useBookingStore from '../../store/bookingStore';
import useServiceStore from '../../store/serviceStore';
import useVendorStore from '../../store/vendorStore';
import useCustomerStore from '../../store/customerStore';
import { toast } from 'react-hot-toast';
import { Booking, Service, Vendor, Customer } from '../../types';

const VendorDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { bookings, getBookingsByVendorId, fetchBookings, updateBookingStatus } = useBookingStore();
  const { services, fetchServices } = useServiceStore();
  const { vendors, fetchVendors } = useVendorStore();
  const { customers, fetchCustomers } = useCustomerStore();
  const navigate = useNavigate();
  const [vendorBookings, setVendorBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      // Fetch all required data
      Promise.all([
        fetchBookings(),
        fetchServices(),
        fetchVendors(),
        fetchCustomers()
      ])
        .then(() => setLoading(false))
        .catch((error) => {
          console.error('Error fetching data:', error);
          toast.error('Failed to load data');
          setLoading(false);
        });
    }
  }, [user, fetchBookings, fetchServices, fetchVendors, fetchCustomers]);
  
  useEffect(() => {
    if (user) {
      const userBookings = getBookingsByVendorId(user.id);
      setVendorBookings(userBookings);
    }
  }, [user, bookings, getBookingsByVendorId]);
  
  // Redirect if not authenticated or not a vendor
  if (!isAuthenticated || !user || user.role !== 'vendor') {
    return <Navigate to="/login" />;
  }
  
  const handleStatusUpdate = async (bookingId: string, newStatus: 'accepted' | 'declined' | 'completed') => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking ${newStatus} successfully`);
      if (user?.id) {
        await fetchBookings();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const getCustomerName = (customerId: string): string => {
    const customer = customers.find((c: Customer) => c.id === customerId);
    if (!customer) {
      console.warn(`Customer not found for ID: ${customerId}`);
      return 'Loading Customer...';
    }
    return customer.name;
  };

  const getVendorServiceCategory = (vendorId: string): string => {
    const vendor = vendors.find((v: Vendor) => v.id === vendorId);
    if (!vendor) {
      console.warn(`Vendor not found for ID: ${vendorId}`);
      return 'Loading Category...';
    }
    return vendor.service.category;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Loading bookings and customer data...</div>
      </div>
    );
  }
  
  const pendingBookings = vendorBookings.filter(booking => booking.status === 'pending');
  const acceptedBookings = vendorBookings.filter(booking => booking.status === 'accepted');
  const completedBookings = vendorBookings.filter(booking => booking.status === 'completed');
  
  // For demo purposes, we'll create some mock stats
  const totalBookings = vendorBookings.length;
  const totalCustomers = new Set(vendorBookings.map(booking => booking.customerId)).size;
  const totalRevenue = 0; // Mock revenue
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Vendor Dashboard</h1>
        
        {/* <div className="flex justify-between items-center mb-6">
          <Button onClick={() => navigate('/vendor/services')}>Manage Services</Button>
        </div> */}
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-semibold">{totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-semibold">{totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 mr-4">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-semibold">Rs.{totalRevenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-semibold">{pendingBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Pending Bookings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Pending Booking Requests</h2>
            <Badge variant="warning">{pendingBookings.length} Pending</Badge>
          </div>
          
          {pendingBookings.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No pending booking requests at the moment.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  serviceName={getVendorServiceCategory(user?.id || '')}
                  isVendorView={true}
                  onAccept={() => handleStatusUpdate(booking.id, 'accepted')}
                  onDecline={() => handleStatusUpdate(booking.id, 'declined')}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Active Bookings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Active Bookings</h2>
            <Badge variant="success">{acceptedBookings.length} Confirmed</Badge>
          </div>
          
          {acceptedBookings.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No upcoming bookings at the moment.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {acceptedBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  serviceName={getVendorServiceCategory(user?.id || '')}
                  isVendorView={true}
                  onComplete={() => handleStatusUpdate(booking.id, 'completed')}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Completed Bookings */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Completed Bookings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                serviceName={getVendorServiceCategory(user?.id || '')}
                isVendorView={true}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default VendorDashboardPage;