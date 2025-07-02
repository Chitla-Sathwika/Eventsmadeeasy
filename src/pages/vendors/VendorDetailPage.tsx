import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import BookingForm from '../../components/booking/BookingForm';
import useVendorStore from '../../store/vendorStore';
import { Vendor } from '../../types';

const VendorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { vendors, fetchVendors, getVendorById, isLoading } = useVendorStore();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);
  
  useEffect(() => {
    if (id && vendors.length > 0) {
      const foundVendor = getVendorById(id);
      if (foundVendor) {
        setVendor(foundVendor);
      }
    }
  }, [id, vendors, getVendorById]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Vendor Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            The vendor you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/services">
            <Button>Browse Services</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // In a real app, this would be actual ratings
  const rating = Math.floor(Math.random() * 2) + 4; // Random rating between 4 and 5
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={`/services/${vendor.service.category}`} className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to {vendor.service.category.replace('-', ' ')}
        </Link>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="h-64 overflow-hidden">
            <img
              src={vendor.service.image}
              alt={vendor.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{vendor.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{vendor.service.name}</p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    <Star size={20} className="text-yellow-500 fill-current mr-1" />
                    <span className="font-medium">{rating}.0</span>
                    <span className="text-gray-500 ml-1">(24 reviews)</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500">
                    <MapPin size={18} className="mr-1" />
                    <span>{vendor.serviceAreas.join(', ')}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Badge variant="primary" className="text-sm">
                  {vendor.service.category.replace('-', ' ')}
                </Badge>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-700 mb-6">
                {vendor.service.description}
              </p>
              
              <h2 className="text-xl font-semibold mb-4">Cost Structure</h2>
              <p className="text-gray-700 mb-6">
                {vendor.costStructure}
              </p>
              
              <h2 className="text-xl font-semibold mb-4">Specializations</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {vendor.specializations.map((spec, index) => (
                  <Badge key={index} variant="secondary">
                    {spec}
                  </Badge>
                ))}
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Why Choose Us</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-green-100 mr-3">
                    <CheckCircle size={18} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Professional Service</h3>
                    <p className="text-sm text-gray-600">Experienced team with attention to detail</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-green-100 mr-3">
                    <CheckCircle size={18} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Customizable Options</h3>
                    <p className="text-sm text-gray-600">Tailored to your specific needs</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-green-100 mr-3">
                    <CheckCircle size={18} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Competitive Pricing</h3>
                    <p className="text-sm text-gray-600">Great value for the quality provided</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">What to Expect</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-blue-100 mr-3">
                      <Calendar size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Booking Confirmation</h3>
                      <p className="text-sm text-gray-600">
                        Once you submit a booking request, the vendor will respond within 24 hours.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-blue-100 mr-3">
                      <Clock size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Communication</h3>
                      <p className="text-sm text-gray-600">
                        After confirmation, you'll be able to chat directly with the vendor to discuss details.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-blue-100 mr-3">
                      <CheckCircle size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Service Delivery</h3>
                      <p className="text-sm text-gray-600">
                        The vendor will provide the agreed services on the scheduled date and time.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> Booking requests that are not responded to within 24 hours will be automatically canceled.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <BookingForm vendor={vendor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailPage;