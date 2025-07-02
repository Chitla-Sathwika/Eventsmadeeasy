import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import useCustomerStore from '../../store/customerStore';
import useAuthStore from '../../store/authStore';

const CustomerProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createCustomerProfile, isLoading } = useCustomerStore();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: '',
    address: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
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
      
      await createCustomerProfile({
        id: user.id,
        email: user.email,
        password:user.password,
        name: formData.name,
        role: 'customer',
        createdAt: user.createdAt,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        bookings: []
      });
      
      navigate('/customer/dashboard');
    } catch (error) {
      console.error('Failed to create customer profile:', error);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <h2 className="text-2xl font-bold">Complete Your Customer Profile</h2>
        <p className="text-gray-600 mt-1">
          Provide your details to get started.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              fullWidth
            />
            
            <Input
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
              placeholder="Enter your phone number"
              fullWidth
            />
            
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              placeholder="Enter your address"
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

export default CustomerProfileForm; 