import { create } from 'zustand';
import { Vendor, ServiceCategory } from '../types';

interface VendorState {
  vendors: Vendor[];
  isLoading: boolean;
  fetchVendors: () => Promise<void>;
  getVendorsByService: (serviceCategory: ServiceCategory) => Vendor[];
  getVendorById: (id: string) => Vendor | undefined;
  createVendorProfile: (vendorData: Partial<Vendor>) => Promise<Vendor>;
  updateVendorProfile: (id: string, updates: Partial<Vendor>) => Promise<Vendor>;
}

const API_URL = 'http://localhost:3001/api';

const useVendorStore = create<VendorState>((set, get) => ({
  vendors: [],
  isLoading: false,
  
  fetchVendors: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/vendors`);
      if (!response.ok) throw new Error('Failed to fetch vendors');
      const vendors = await response.json();
      set({ vendors, isLoading: false });
    } catch (error) {
      console.error('Error fetching vendors:', error);
      set({ isLoading: false });
    }
  },
  
  getVendorsByService: (serviceCategory: ServiceCategory) => {
    return get().vendors.filter(vendor => vendor.service.category === serviceCategory);
  },
  
  getVendorById: (id: string) => {
    return get().vendors.find(vendor => vendor.id === id);
  },
  
  createVendorProfile: async (vendorData: Partial<Vendor>) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/vendors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
      });
      
      if (!response.ok) throw new Error('Failed to create vendor profile');
      
      const newVendor = await response.json();
      set(state => ({
        vendors: [...state.vendors, newVendor],
        isLoading: false
      }));
      
      return newVendor;
    } catch (error) {
      console.error('Error creating vendor profile:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  updateVendorProfile: async (id: string, updates: Partial<Vendor>) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/vendors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) throw new Error('Failed to update vendor profile');
      
      const updatedVendor = await response.json();
      set(state => ({
        vendors: state.vendors.map(vendor => 
          vendor.id === id ? updatedVendor : vendor
        ),
        isLoading: false
      }));
      
      return updatedVendor;
    } catch (error) {
      console.error('Error updating vendor profile:', error);
      set({ isLoading: false });
      throw error;
    }
  }
}));

export default useVendorStore;