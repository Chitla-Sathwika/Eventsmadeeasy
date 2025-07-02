import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Service } from '../../types';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>
        <Link
          to={`/services/${service.category}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Providers
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;