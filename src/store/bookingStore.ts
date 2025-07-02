import { create } from 'zustand';
import { Booking } from '../../server/src/types';

interface BookingStore {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  getBookingsByCustomerId: (customerId: string) => Booking[];
  getBookingsByVendorId: (vendorId: string) => Booking[];
  getBookingById: (bookingId: string) => Booking | undefined;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<Booking>;
}

const API_URL = 'http://localhost:3001/api';

const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log('Fetching bookings from API...');
      const response = await fetch(`${API_URL}/bookings`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      console.log('Received bookings:', data);
      set({ bookings: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to fetch bookings', isLoading: false });
    }
  },

  getBookingsByCustomerId: (customerId: string) => {
    console.log('Getting bookings for customer:', customerId);
    console.log('Current bookings in store:', get().bookings);
    const filtered = get().bookings.filter(booking => {
      const matches = booking.customerId === customerId;
      console.log('Booking:', {
        id: booking.id,
        customerId: booking.customerId,
        vendorId: booking.vendorId,
        status: booking.status,
        matches
      });
      return matches;
    });
    console.log('Filtered customer bookings:', filtered);
    return filtered;
  },

  getBookingsByVendorId: (vendorId: string) => {
    console.log('Getting bookings for vendor:', vendorId);
    console.log('Current bookings in store:', get().bookings);
    const filtered = get().bookings.filter(booking => {
      const matches = booking.vendorId === vendorId;
      console.log('Booking:', {
        id: booking.id,
        customerId: booking.customerId,
        vendorId: booking.vendorId,
        status: booking.status,
        matches
      });
      return matches;
    });
    console.log('Filtered vendor bookings:', filtered);
    return filtered;
  },

  getBookingById: (bookingId: string) => {
    console.log('Getting booking by ID:', bookingId);
    console.log('Current bookings in store:', get().bookings);
    const booking = get().bookings.find(booking => booking.id === bookingId);
    console.log('Found booking:', booking);
    return booking;
  },

  createBooking: async (booking) => {
    try {
      set({ isLoading: true, error: null });
      console.log('Creating booking:', booking);
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      if (!response.ok) throw new Error('Failed to create booking');
      const newBooking = await response.json();
      console.log('Created booking:', newBooking);
      set(state => ({ 
        bookings: [...state.bookings, newBooking],
        isLoading: false 
      }));
      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to create booking', isLoading: false });
      throw error;
    }
  },

  updateBookingStatus: async (bookingId: string, status: Booking['status']) => {
    try {
      set({ isLoading: true, error: null });
      console.log('Updating booking status:', { bookingId, status });
      const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update booking status');
      const updatedBooking = await response.json();
      console.log('Updated booking:', updatedBooking);
      set(state => ({
        bookings: state.bookings.map(booking =>
          booking.id === bookingId ? updatedBooking : booking
        ),
        isLoading: false
      }));
      return updatedBooking;
    } catch (error) {
      console.error('Error updating booking status:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to update booking status', isLoading: false });
      throw error;
    }
  },
}));

export default useBookingStore;