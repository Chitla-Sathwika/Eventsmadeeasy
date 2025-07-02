export type ServiceCategory = 
  | 'catering'
  | 'event-planning'
  | 'decoration'
  | 'chef-bartender'
  | 'mehndi'
  | 'music'
  | 'photography'
  | 'entertainment'
  | 'invitation'
  | 'bridal'
  | 'gifts'
  | 'transportation';

export interface Service {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  image: string;
}

export interface Vendor {
  id: string;
  email: string;
  name: string;
  password:string,
  role: 'vendor';
  createdAt: string;
  service: {
    id: string;
    category: string;
    name: string;
    description: string;
    image: string;
  };
  costStructure: string;
  serviceAreas: string[];
  specializations: string[];
  bookings: string[];
}

export interface Customer {
  id: string;
  email: string;
  password:string;
  name: string;
  role: 'customer';
  createdAt: string;
  phoneNumber: string;
  address: string;
  bookings: string[];
}

export interface Booking {
  id: string;
  customerId: string;
  vendorId: string;
  serviceId: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  status: 'pending' | 'accepted' | 'declined' | 'canceled' | 'completed';
  createdAt: string;
} 

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  content: string;
  timestamp: string;
}