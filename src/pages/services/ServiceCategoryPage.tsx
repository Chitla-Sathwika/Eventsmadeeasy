import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import VendorCard from '../../components/customer/VendorCard';
import Button from '../../components/ui/Button';
import useVendorStore from '../../store/vendorStore';
import { ServiceCategory } from '../../types';

const categoryNames: Record<ServiceCategory, string> = {
  'catering': 'Catering Services',
  'event-planning': 'Event Planning',
  'decoration': 'Decoration & Stage Design',
  'chef-bartender': 'Chefs & Bartenders',
  'mehndi': 'Mehndi Artists',
  'music': 'DJ & Music Bands',
  'photography': 'Photography & Videography',
  'entertainment': 'Entertainers & Anchors',
  'invitation': 'Invitation & Printing',
  'bridal': 'Bridal Wear & Makeup',
  'gifts': 'Wedding Gifts & Favors',
  'transportation': 'Transportation & Logistics',
};

const ServiceCategoryPage: React.FC = () => {
  const { category } = useParams<{ category: ServiceCategory }>();
  const { vendors, fetchVendors, getVendorsByService, isLoading } = useVendorStore();
  
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);
  
  if (!category || !Object.keys(categoryNames).includes(category)) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            The service category you're looking for doesn't exist.
          </p>
          <Link to="/services">
            <Button>View All Services</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const categoryVendors = getVendorsByService(category as ServiceCategory);
  const categoryName = categoryNames[category as ServiceCategory];
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Link to="/services" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
            ← Back to All Services
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{categoryName}</h1>
          <p className="text-lg text-gray-600">
            Browse our selection of trusted {categoryName.toLowerCase()} professionals for your event.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : categoryVendors.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No vendors available</h3>
            <p className="text-gray-600 mb-6">
              We don't have any {categoryName.toLowerCase()} professionals registered yet.
            </p>
            <Link to="/services">
              <Button>Browse Other Services</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCategoryPage;