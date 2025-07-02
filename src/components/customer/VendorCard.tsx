import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import { Vendor } from '../../types';

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  // In a real app, this would be actual ratings
  const rating = Math.floor(Math.random() * 2) + 4; // Random rating between 4 and 5
  
  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img
          src={vendor.service.image}
          alt={vendor.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{vendor.name}</h3>
          <div className="flex items-center">
            <Star size={16} className="text-yellow-500 fill-current" />
            <span className="ml-1 text-sm font-medium">{rating}.0</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {vendor.service.description}
        </p>
        
        <div className="flex items-center text-gray-500 text-xs mb-3">
          <MapPin size={14} className="mr-1" />
          <span>{vendor.serviceAreas.slice(0, 2).join(', ')}{vendor.serviceAreas.length > 2 ? '...' : ''}</span>
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-medium mb-1">Specializations:</p>
          <div className="flex flex-wrap gap-1">
            {vendor.specializations.slice(0, 3).map((spec, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
            {vendor.specializations.length > 3 && (
              <Badge variant="default" className="text-xs">
                +{vendor.specializations.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        
        <Link
          to={`/vendors/${vendor.id}`}
          className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md transition-colors"
        >
          View Details
        </Link>
      </CardContent>
    </Card>
  );
};

export default VendorCard;