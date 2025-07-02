import fs from 'fs';
import path from 'path';
import { Booking } from './types';

const BOOKINGS_PATH = path.join(__dirname, '../../data/bookings.json');

// Read current data
const bookingData = JSON.parse(fs.readFileSync(BOOKINGS_PATH, 'utf-8'));

// Map old status values to new ones
const statusMap: Record<string, string> = {
  'rejected': 'declined',
  'cancelled': 'canceled'
};

// Update booking statuses
bookingData.bookings = bookingData.bookings.map((booking: Booking) => {
  const newStatus = statusMap[booking.status] || booking.status;
  return { ...booking, status: newStatus };
});

// Write updated data back to file
fs.writeFileSync(BOOKINGS_PATH, JSON.stringify(bookingData, null, 2));

console.log('Migration completed successfully');
console.log('Updated bookings:', bookingData.bookings); 