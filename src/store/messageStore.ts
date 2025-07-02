import { create } from 'zustand';
import { Message } from '../types';
import { toast } from 'react-hot-toast';

interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  fetchMessages: (bookingId: string) => Promise<void>;
  sendMessage: (bookingId: string, senderId: string, content: string) => Promise<Message>;
  getMessagesByBookingId: (bookingId: string) => Message[];
}

const API_URL = 'http://localhost:3001/api';

const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  fetchMessages: async (bookingId: string) => {
    try {
      set({ isLoading: true, error: null });
      console.log('Fetching messages for booking:', bookingId);
      const response = await fetch(`${API_URL}/messages/${bookingId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch messages');
      }
      const data = await response.json();
      console.log('Received messages:', data);
      set({ messages: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching messages:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },
  
  sendMessage: async (bookingId: string, senderId: string, content: string) => {
    try {
      set({ isLoading: true, error: null });
      console.log('Sending message:', { bookingId, senderId, content });
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, senderId, content }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send message');
      }
      const newMessage = await response.json();
      console.log('Message sent:', newMessage);
      set(state => ({ 
        messages: [...state.messages, newMessage],
        isLoading: false 
      }));
      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },
  
  getMessagesByBookingId: (bookingId: string) => {
    return get().messages
      .filter(message => message.bookingId === bookingId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
}));

export default useMessageStore;