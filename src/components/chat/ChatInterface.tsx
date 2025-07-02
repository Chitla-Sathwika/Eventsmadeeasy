import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import useMessageStore from '../../store/messageStore';
import useAuthStore from '../../store/authStore';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Message } from '../../types';
import { format, parseISO } from 'date-fns';

interface ChatInterfaceProps {
  bookingId: string;
  recipientName: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ bookingId, recipientName }) => {
  const { user } = useAuthStore();
  const { messages, sendMessage, getMessagesByBookingId, fetchMessages, isLoading } = useMessageStore();
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize WebSocket connection
  useWebSocket();
  
  useEffect(() => {
    // Fetch messages for this booking
    fetchMessages(bookingId);
  }, [bookingId, fetchMessages]);
  
  useEffect(() => {
    // Get messages for this booking
    const bookingMessages = getMessagesByBookingId(bookingId);
    setChatMessages(bookingMessages);
  }, [bookingId, messages, getMessagesByBookingId]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;
    
    try {
      await sendMessage(bookingId, user.id, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-white rounded-lg shadow-md">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat with {recipientName}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          chatMessages.map((message) => {
            const isCurrentUser = message.senderId === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isCurrentUser
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {format(parseISO(message.timestamp), 'h:mm a')}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="resize-none"
            rows={1}
            fullWidth
          />
          <Button type="submit" className="flex-shrink-0">
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;