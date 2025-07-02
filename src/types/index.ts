export type UserRole = 'customer' | 'vendor';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Customer extends User {
  role: 'customer';
  bookings: Booking[];
}

export interface Vendor extends User {
  role: 'vendor';
  service: Service;
  costStructure: string;
  serviceAreas: string[];
  specializations: string[];
  bookings: Booking[];
}

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

export type BookingStatus = 'pending' | 'accepted' | 'declined' | 'canceled' | 'completed';

export interface Booking {
  id: string;
  customerId: string;
  vendorId: string;
  serviceId: string;
  date: string;
  time: string;
  location: string;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  content: string;
  timestamp: string;
}