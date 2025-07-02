import { create } from 'zustand';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAfter: (email: string, password: string, role: UserRole) => Promise<void>;
  verifyOtp: (email: string, password:string, otp: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateProfilePicture: (imageUrl: string) => void;
}

const API_BASE_URL = 'http://localhost:3001/api';

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  updateProfilePicture: (imageUrl: string) => {
    set((state) => ({
      user: state.user ? { ...state.user, profilePicture: imageUrl } : null
    }));
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // include password here
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  loginAfter: async (email: string, password: string, role: UserRole) => {
    set({ isLoading: true });
   
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password ,role}), // include password here
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      const userId = `user-${email.split('@')[0]}-${role}`;

      const mockUser: User = {
        id: userId,
        email,
        password,
        name: email.split('@')[0],
        role,
        createdAt: new Date().toISOString(),
      };

      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });


    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  verifyOtp: async (email: string,password :string,otp: string, role: UserRole) => {
    set({ isLoading: true });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email,password,otp}),
      });

      if (!response.ok) {
        throw new Error('Invalid OTP');
      }

      // Create a mock user with a consistent ID based on email
      const userId = `user-${email.split('@')[0]}-${role}`;

      const mockUser: User = {
        id: userId,
        email,
        password,
        name: email.split('@')[0],
        role,
        createdAt: new Date().toISOString(),
      };

      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
