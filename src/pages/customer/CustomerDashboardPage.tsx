import React, { useEffect, useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import BookingCard from '../../components/booking/BookingCard';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/authStore';
import useBookingStore from '../../store/bookingStore';
import useServiceStore from '../../store/serviceStore';
import useVendorStore from '../../store/vendorStore';
import { toast } from 'react-hot-toast';
import { Booking, Service, Vendor } from '../../types';

const CustomerDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { bookings, getBookingsByCustomerId, fetchBookings } = useBookingStore();
  const { services, fetchServices } = useServiceStore();
  const { vendors, fetchVendors } = useVendorStore();
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      // Fetch all required data
      Promise.all([
        fetchBookings(),
        fetchServices(),
        fetchVendors()
      ])
        .then(() => setLoading(false))
        .catch((error) => {
          console.error('Error fetching data:', error);
          toast.error('Failed to load data');
          setLoading(false);
        });
    }
  }, [user, fetchBookings, fetchServices, fetchVendors]);
  
  useEffect(() => {
    if (user) {
      const userBookings = getBookingsByCustomerId(user.id);
      setCustomerBookings(userBookings);
    }
  }, [user, bookings, getBookingsByCustomerId]);
  
  // Redirect if not authenticated or not a customer
  if (!isAuthenticated || !user || user.role !== 'customer') {
    return <Navigate to="/login" />;
  }
  
  const getVendorName = (vendorId: string): string => {
    const vendor = vendors.find((v: Vendor) => v.id === vendorId);
    if (!vendor) {
      console.warn(`Vendor not found for ID: ${vendorId}`);
    }
    return vendor ? vendor.name : 'Loading Vendor...';
  };

  const getVendorServiceCategory = (vendorId: string): string => {
    const vendor = vendors.find((v: Vendor) => v.id === vendorId);
    if (!vendor) {
      console.warn(`Vendor not found for ID: ${vendorId}`);
    }
    return vendor ? vendor.service.category : 'Loading Category...';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Loading bookings...</div>
      </div>
    );
  }
  
  const pendingBookings = customerBookings.filter(booking => booking.status === 'pending');
  const acceptedBookings = customerBookings.filter(booking => booking.status === 'accepted');
  const otherBookings = customerBookings.filter(
    booking => booking.status !== 'pending' && booking.status !== 'accepted'
  );
  
  const getServiceName = (serviceId: string): string => {
    const service = services.find((s: Service) => s.id === serviceId);
    if (!service) {
      console.warn(`Service not found for ID: ${serviceId}`);
    }
    return service ? service.name : 'Loading Service...';
  };

  // For demo purposes, we'll create some mock stats
  const totalBookings = customerBookings.length;
  const pendingCount = pendingBookings.length;
  const activeCount = acceptedBookings.length;
  const otherCount = otherBookings.length;
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">My Bookings</h1>
          <Button onClick={() => navigate('/services')}>Browse Services</Button>
        </div>
        
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
                <div className="p-3 rounded-full bg-yellow-100 mr-4">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-semibold">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-semibold">{activeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gray-100 mr-4">
                  <XCircle className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Other</p>
                  <p className="text-2xl font-semibold">{otherCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Pending Bookings */}
        {pendingBookings.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Pending Bookings</h2>
              <Badge variant="warning">{pendingBookings.length} Pending</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  vendorName={getVendorName(booking.vendorId)}
                  serviceName={getVendorServiceCategory(booking.vendorId)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Confirmed Bookings */}
        {acceptedBookings.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Confirmed Bookings</h2>
              <Badge variant="success">{acceptedBookings.length} Confirmed</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {acceptedBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  vendorName={getVendorName(booking.vendorId)}
                  serviceName={getVendorServiceCategory(booking.vendorId)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Past/Declined Bookings */}
        {otherBookings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Other Bookings</h2>
              <Badge variant="default">{otherBookings.length} Bookings</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  vendorName={getVendorName(booking.vendorId)}
                  serviceName={getVendorServiceCategory(booking.vendorId)}
                />
              ))}
            </div>
          </div>
        )}
        
        {customerBookings.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't made any bookings yet. Start by exploring our services.
              </p>
              <Link to="/services">
                <Button>Browse Services</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboardPage;