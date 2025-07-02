import { create } from 'zustand';
import { Service, ServiceCategory } from '../types';

interface ServiceState {
  services: Service[];
  isLoading: boolean;
  fetchServices: () => Promise<void>;
  getServicesByCategory: (category: ServiceCategory) => Service[];
  getServiceById: (id: string) => Service | undefined;
}

const API_URL = 'http://localhost:3001/api';

const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  isLoading: false,
  
  fetchServices: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/services`);
      if (!response.ok) throw new Error('Failed to fetch services');
      const services = await response.json();
      set({ services, isLoading: false });
    } catch (error) {
      console.error('Error fetching services:', error);
      set({ isLoading: false });
    }
  },
  
  getServicesByCategory: (category: ServiceCategory) => {
    return get().services.filter(service => service.category === category);
  },
  
  getServiceById: (id: string) => {
    return get().services.find(service => service.id === id);
  }
}));

export default useServiceStore;