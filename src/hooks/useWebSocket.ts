import { useEffect, useRef, useCallback } from 'react';
import useAuthStore from '../store/authStore';
import useBookingStore from '../store/bookingStore';
import useMessageStore from '../store/messageStore';
import { toast } from 'react-hot-toast';

const WS_URL = 'ws://localhost:3001';

export const useWebSocket = () => {
  const ws = useRef<WebSocket | null>(null);
  const { user } = useAuthStore();
  const { fetchBookings } = useBookingStore();
  const { fetchMessages } = useMessageStore();

  const connect = useCallback(() => {
    if (!user?.id) {
      console.log('No user ID available for WebSocket connection');
      return;
    }

    try {
      console.log('Attempting to connect to WebSocket server...');
      ws.current = new WebSocket(`${WS_URL}?userId=${user.id}`);

      ws.current.onopen = () => {
        console.log('WebSocket connected successfully');
        toast.success('Connected to chat server');
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          switch (data.type) {
            case 'new_booking':
              console.log('New booking received:', data.booking);
              toast.success('New booking request received!');
              fetchBookings();
              break;
            case 'booking_status_update':
              console.log('Booking status updated:', data.booking);
              toast.success('Booking status updated!');
              fetchBookings();
              break;
            case 'new_message':
              console.log('New message received:', data.message);
              toast.success('New message received!');
              // Fetch messages for the booking
              fetchMessages(data.message.bookingId);
              break;
            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Connection error. Retrying...');
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        toast.error('Connection lost. Retrying...');
        // Attempt to reconnect after 5 seconds
        setTimeout(connect, 5000);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      toast.error('Failed to connect to chat server');
    }
  }, [user?.id, fetchBookings, fetchMessages]);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        console.log('Closing WebSocket connection');
        ws.current.close();
      }
    };
  }, [connect]);

  return ws.current;
}; 