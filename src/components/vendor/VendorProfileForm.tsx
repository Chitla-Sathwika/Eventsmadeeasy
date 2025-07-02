import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import useVendorStore from '../../store/vendorStore';
import useAuthStore from '../../store/authStore';
import { ServiceCategory } from '../../types';

const serviceCategories = [
  { value: 'catering', label: 'Catering' },
  { value: 'event-planning', label: 'Event Planning' },
  { value: 'decoration', label: 'Decoration & Stage Design' },
  { value: 'chef-bartender', label: 'Chefs & Bartenders' },
  { value: 'mehndi', label: 'Mehndi Artists' },
  { value: 'music', label: 'DJ & Music Bands' },
  { value: 'photography', label: 'Photography & Videography' },
  { value: 'entertainment', label: 'Entertainers & Anchors' },
  { value: 'invitation', label: 'Invitation & Printing' },
  { value: 'bridal', label: 'Bridal Wear & Makeup' },
  { value: 'gifts', label: 'Wedding Gifts & Favors' },
  { value: 'transportation', label: 'Transportation & Logistics' },
];

const VendorProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createVendorProfile, isLoading } = useVendorStore();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    serviceCategory: 'catering' as ServiceCategory,
    serviceName: '',
    serviceDescription: '',
    costStructure: '',
    serviceAreas: '',
    specializations: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required';
    }
    
    if (!formData.serviceName.trim()) {
      newErrors.serviceName = 'Service name is required';
    }
    
    if (!formData.serviceDescription.trim()) {
      newErrors.serviceDescription = 'Service description is required';
    }
    
    if (!formData.costStructure.trim()) {
      newErrors.costStructure = 'Cost structure is required';
    }
    
    if (!formData.serviceAreas.trim()) {
      newErrors.serviceAreas = 'Service areas are required';
    }
    
    if (!formData.specializations.trim()) {
      newErrors.specializations = 'Specializations are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      console.log('Creating vendor profile with user:', user);
      
      const serviceAreasArray = formData.serviceAreas
        .split(',')
        .map(area => area.trim())
        .filter(area => area);
      
      const specializationsArray = formData.specializations
        .split(',')
        .map(spec => spec.trim())
        .filter(spec => spec);

        async function fetchUnsplashImage(query) {
          const accessKey = "Iz0OtyPWuj_Dw2gaeZH15K38oKaaZev-TJ_ZM4Uu8zE"; // Replace with your Unsplash API key
          const response = await fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${accessKey}`);
          const data = await response.json();
          
          return data.urls && data.urls.regular ? data.urls.regular : "https://via.placeholder.com/800x600"; // Fallback image
      }


        const imageUrl = await fetchUnsplashImage(formData.serviceCategory);
      
      const vendorData = {
        id: user.id,
        email: user.email,
        password:user.password,
        name: formData.name,
        role: 'vendor' as const,
        createdAt: user.createdAt,
        service: {
          id: `service-${Date.now()}`,
          category: formData.serviceCategory,
          name: formData.serviceName,
          description: formData.serviceDescription,
          image: imageUrl,
        },
        costStructure: formData.costStructure,
        serviceAreas: serviceAreasArray,
        specializations: specializationsArray,
        bookings: [],
      };
      
      console.log('Sending vendor data:', vendorData);
      
      const newVendor = await createVendorProfile(vendorData);
      console.log('Vendor profile created:', newVendor);
      
      navigate('/vendor/dashboard');
    } catch (error) {
      console.error('Failed to create vendor profile:', error);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <h2 className="text-2xl font-bold">Complete Your Vendor Profile</h2>
        <p className="text-gray-600 mt-1">
          Provide details about your services to get started.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Business Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              fullWidth
            />
            
            <Select
              label="Service Category"
              name="serviceCategory"
              value={formData.serviceCategory}
              options={serviceCategories}
              onChange={(value) => handleSelectChange('serviceCategory', value)}
              fullWidth
            />
            
            <Input
              label="Service Name"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              error={errors.serviceName}
              placeholder="e.g., Premium Wedding Catering"
              fullWidth
            />
            
            <Textarea
              label="Service Description"
              name="serviceDescription"
              value={formData.serviceDescription}
              onChange={handleChange}
              error={errors.serviceDescription}
              placeholder="Describe your services in detail..."
              rows={4}
              fullWidth
            />
            
            <Textarea
              label="Cost Structure"
              name="costStructure"
              value={formData.costStructure}
              onChange={handleChange}
              error={errors.costStructure}
              placeholder="e.g., Starting at $25 per person, minimum 50 guests"
              rows={2}
              fullWidth
            />
            
            <Input
              label="Service Areas"
              name="serviceAreas"
              value={formData.serviceAreas}
              onChange={handleChange}
              error={errors.serviceAreas}
              placeholder="e.g., New York City, Long Island, Westchester (comma separated)"
              fullWidth
            />
            
            <Input
              label="Specializations"
              name="specializations"
              value={formData.specializations}
              onChange={handleChange}
              error={errors.specializations}
              placeholder="e.g., Wedding Receptions, Corporate Events, Cocktail Parties (comma separated)"
              fullWidth
            />
            
            <div className="pt-4">
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Complete Profile
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VendorProfileForm;