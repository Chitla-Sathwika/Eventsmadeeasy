import fs from 'fs';
import path from 'path';
import { Vendor, Booking } from './types';

const VENDOR_PROFILES_PATH = path.join(__dirname, '../../data/vendorProfiles.json');
const BOOKINGS_PATH = path.join(__dirname, '../../data/bookings.json');

// Read current data
const vendorData = JSON.parse(fs.readFileSync(VENDOR_PROFILES_PATH, 'utf-8'));
const bookingData = JSON.parse(fs.readFileSync(BOOKINGS_PATH, 'utf-8'));

// Create a mapping of old IDs to new IDs
const idMapping = new Map<string, string>();

// Update vendor IDs
vendorData.vendors = vendorData.vendors.map((vendor: Vendor) => {
  const oldId = vendor.id;
  const newId = `user-${vendor.email.split('@')[0]}-vendor`;
  idMapping.set(oldId, newId);
  return { ...vendor, id: newId };
});

// Update booking vendor IDs
bookingData.bookings = bookingData.bookings.map((booking: Booking) => {
  const newVendorId = idMapping.get(booking.vendorId);
  if (newVendorId) {
    return { ...booking, vendorId: newVendorId };
  }
  return booking;
});

// Write updated data back to files
fs.writeFileSync(VENDOR_PROFILES_PATH, JSON.stringify(vendorData, null, 2));
fs.writeFileSync(BOOKINGS_PATH, JSON.stringify(bookingData, null, 2));

console.log('Migration completed successfully');
console.log('ID mapping:', Object.fromEntries(idMapping)); 