import React from 'react';
import { Navigate } from 'react-router-dom';
import VendorProfileForm from '../../components/vendor/VendorProfileForm';
import useAuthStore from '../../store/authStore';

const VendorProfileSetupPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  
  // Redirect if not authenticated or not a vendor
  if (!isAuthenticated || !user || user.role !== 'vendor') {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Vendor Profile</h1>
          <p className="mt-2 text-lg text-gray-600">
            Tell us about your services to get started on EventsMadeEaze
          </p>
        </div>
        
        <div className="flex justify-center">
          <VendorProfileForm />
        </div>
      </div>
    </div>
  );
};

export default VendorProfileSetupPage;