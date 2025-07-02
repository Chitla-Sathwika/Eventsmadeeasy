import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../../components/customer/ServiceCard';
import useServiceStore from '../../store/serviceStore';

const ServicesPage: React.FC = () => {
  const { services, fetchServices, isLoading } = useServiceStore();
  
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our wide range of event services from trusted professionals.
            Find the perfect match for your next event.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;