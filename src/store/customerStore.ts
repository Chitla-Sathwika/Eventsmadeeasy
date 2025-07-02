import { create } from 'zustand';
import { Customer } from '../types';

interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  fetchCustomers: () => Promise<void>;
  getCustomerById: (id: string) => Customer | undefined;
  createCustomerProfile: (customerData: Partial<Customer>) => Promise<Customer>;
  updateCustomerProfile: (id: string, updates: Partial<Customer>) => Promise<Customer>;
}

const API_URL = 'http://localhost:3001/api';

const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  isLoading: false,
  
  fetchCustomers: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/customers`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      const customers = await response.json();
      set({ customers, isLoading: false });
    } catch (error) {
      console.error('Error fetching customers:', error);
      set({ isLoading: false });
    }
  },
  
  getCustomerById: (id: string) => {
    return get().customers.find(customer => customer.id === id);
  },
  
  createCustomerProfile: async (customerData: Partial<Customer>) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      
      if (!response.ok) throw new Error('Failed to create customer profile');
      
      const newCustomer = await response.json();
      set(state => ({
        customers: [...state.customers, newCustomer],
        isLoading: false
      }));
      
      return newCustomer;
    } catch (error) {
      console.error('Error creating customer profile:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  updateCustomerProfile: async (id: string, updates: Partial<Customer>) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) throw new Error('Failed to update customer profile');
      
      const updatedCustomer = await response.json();
      set(state => ({
        customers: state.customers.map(customer => 
          customer.id === id ? updatedCustomer : customer
        ),
        isLoading: false
      }));
      
      return updatedCustomer;
    } catch (error) {
      console.error('Error updating customer profile:', error);
      set({ isLoading: false });
      throw error;
    }
  }
}));

export default useCustomerStore; 