import React, { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { User, Mail, UserCircle, Camera } from 'lucide-react';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateProfilePicture } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        updateProfilePicture(imageUrl);
        toast.success('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-8 relative group">
              <div className="relative">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="p-4 rounded-full bg-blue-100">
                    <UserCircle className="h-24 w-24 text-blue-600" />
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  title="Upload profile picture"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center border-b border-gray-200 pb-4">
                <div className="p-2 rounded-full bg-gray-100 mr-4">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg font-medium text-gray-900">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center border-b border-gray-200 pb-4">
                <div className="p-2 rounded-full bg-gray-100 mr-4">
                  <Mail className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="text-lg font-medium text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-2 rounded-full bg-gray-100 mr-4">
                  <UserCircle className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="text-lg font-medium text-gray-900 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;