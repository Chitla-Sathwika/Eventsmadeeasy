import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { MongoClient, Collection, ObjectId } from 'mongodb';
import { Vendor, Customer, Booking, Message } from './types';
import { sendOTP, verifyOTP } from './services/emailService';

// Load environment variables first
dotenv.config();

// Log environment variables on startup
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT || 3001;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event_services';
let db: any;
let vendorsCollection: Collection<Vendor>;
let customersCollection: Collection<Customer>;
let bookingsCollection: Collection<Booking>;
let messagesCollection: Collection<Message>;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    db = client.db();
    
    // Initialize collections
    vendorsCollection = db.collection('vendors');
    customersCollection = db.collection('customers');
    bookingsCollection = db.collection('bookings');
    messagesCollection = db.collection('messages');
    
    // Create indexes for faster queries
    await vendorsCollection.createIndex({ id: 1 }, { unique: true });
    await customersCollection.createIndex({ id: 1 }, { unique: true });
    await bookingsCollection.createIndex({ id: 1 }, { unique: true });
    await messagesCollection.createIndex({ bookingId: 1 });
    
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// WebSocket connections store
const connections = new Map<string, WebSocket>();

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const userId = req.url?.split('?userId=')[1];
  
  if (userId) {
    connections.set(userId, ws);
    console.log(`Client connected: ${userId}`);
    
    ws.on('close', () => {
      connections.delete(userId);
      console.log(`Client disconnected: ${userId}`);
    });
  }
});

// Helper function to notify clients
const notifyClients = (userId: string, data: any) => {
  const ws = connections.get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
};

// Vendor routes
app.get('/api/vendors', async (req, res) => {
  try {
    const vendors = await vendorsCollection.find().toArray();
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Failed to fetch vendor profiles' });
  }
});

app.post('/api/vendors', async (req, res) => {
  try {
    const newVendor: Vendor = {
      id: req.body.id,
      email: req.body.email || '',
      password : req.body.password || '',
      name: req.body.name || '',
      role: 'vendor',
      createdAt: req.body.createdAt || new Date().toISOString(),
      service: req.body.service || {
        id: '',
        category: 'catering',
        name: '',
        description: '',
        image: ''
      },
      costStructure: req.body.costStructure || '',
      serviceAreas: req.body.serviceAreas || [],
      specializations: req.body.specializations || [],
      bookings: []
    };

    const result = await vendorsCollection.insertOne(newVendor);
    res.status(201).json(newVendor);
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ error: 'Failed to create vendor profile' });
  }
});

app.put('/api/vendors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await vendorsCollection.findOneAndUpdate(
      { id },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ error: 'Failed to update vendor profile' });
  }
});

app.get('/api/vendors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await vendorsCollection.findOne({ id });
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    res.status(500).json({ error: 'Failed to fetch vendor profile' });
  }
});

// Customer routes
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await customersCollection.find().toArray();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customer profiles' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    
    const newCustomer: Customer = {
      id: `customer-${Date.now()}`,
      email: req.body.email || '',
      password : req.body.password || '',
      name: req.body.name || '',
      role: 'customer',
      createdAt: new Date().toISOString(),
      phoneNumber: req.body.phoneNumber || '',
      address: req.body.address || '',
      bookings: []
    };

    const result = await customersCollection.insertOne(newCustomer);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer profile' });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await customersCollection.findOneAndUpdate(
      { id },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer profile' });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await customersCollection.findOne({ id });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer profile' });
  }
});

// Booking routes
app.get('/api/bookings', async (req, res) => {
  try {
    console.log('Fetching all bookings...');
    const bookings = await bookingsCollection.find().toArray();
    console.log('Found bookings:', bookings);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    console.log('Creating new booking:', req.body);
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      customerId: req.body.customerId || '',
      vendorId: req.body.vendorId || '',
      serviceId: req.body.serviceId || '',
      date: req.body.date || '',
      time: req.body.time || '',
      location: req.body.location || '',
      notes: req.body.notes || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    console.log('Saving new booking:', newBooking);
    const result = await bookingsCollection.insertOne(newBooking);

    // Update vendor and customer bookings arrays
    await vendorsCollection.updateOne(
      { id: newBooking.vendorId },
      { $push: { bookings: newBooking.id } }
    );
    
    await customersCollection.updateOne(
      { id: newBooking.customerId },
      { $push: { bookings: newBooking.id } }
    );

    // Notify the vendor about the new booking
    console.log('Notifying vendor:', newBooking.vendorId);
    notifyClients(newBooking.vendorId, {
      type: 'new_booking',
      booking: newBooking
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

app.put('/api/bookings/:id/status', async (req, res) => {
  try {
    console.log('Updating booking status:', { id: req.params.id, status: req.body.status });
    const { id } = req.params;
    
    // Map old status values to new ones
    const statusMap: Record<string, string> = {
      'rejected': 'declined',
      'cancelled': 'canceled'
    };

    const newStatus = statusMap[req.body.status] || req.body.status;
    
    const result = await bookingsCollection.findOneAndUpdate(
      { id },
      { $set: { status: newStatus } },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      console.log('Booking not found:', id);
      return res.status(404).json({ error: 'Booking not found' });
    }

    const updatedBooking = result;

    // Notify both vendor and customer about the status change
    console.log('Notifying vendor and customer about status update');
    notifyClients(updatedBooking.vendorId, {
      type: 'booking_status_update',
      booking: updatedBooking
    });

    notifyClients(updatedBooking.customerId, {
      type: 'booking_status_update',
      booking: updatedBooking
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Chat message endpoints
app.get('/api/messages/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const messages = await messagesCollection.find({ bookingId }).toArray();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { bookingId, senderId, content } = req.body;
    
    const newMessage = {
      id: `message-${Date.now()}`,
      bookingId,
      senderId,
      content,
      timestamp: new Date().toISOString()
    };
    
    const result = await messagesCollection.insertOne(newMessage);
    
    // Notify the recipient via WebSocket
    const booking = await bookingsCollection.findOne({ id: bookingId });
    
    if (booking) {
      const recipientId = senderId === booking.customerId ? booking.vendorId : booking.customerId;
      notifyClients(recipientId, {
        type: 'new_message',
        message: newMessage
      });
    }
    
    res.json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Service endpoints
app.get('/api/services', (req, res) => {
  try {
    const services = [
      {
        id: 'catering',
        category: 'catering',
        name: 'Catering Services',
        description: 'Professional catering services for your events',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
        id: 'event-planning',
        category: 'event-planning',
        name: 'Event Planning',
        description: 'Complete event planning and coordination',
        image: 'https://images.unsplash.com/photo-1589050820342-d666e6116a45?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGV2ZW50c3xlbnwwfHwwfHx8MA%3D%3D'
      },
      {
        id: 'decoration',
        category: 'decoration',
        name: 'Decoration & Stage Design',
        description: 'Beautiful decorations and stage designs',
        image: 'https://i.pinimg.com/736x/e1/78/3c/e1783cd88905958e04053af38243c1c4.jpg'
      },
      {
        id: 'chef-bartender',
        category: 'chef-bartender',
        name: 'Chefs & Bartenders',
        description: 'Professional chefs and bartenders',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        id: 'mehndi',
        category: 'mehndi',
        name: 'Mehndi Artists',
        description: 'Skilled mehndi artists for your celebrations',
        image: 'https://i.pinimg.com/474x/3d/2e/c0/3d2ec00ea4133931b3d579173d8b24d5.jpg'
      },
      {
        id: 'music',
        category: 'music',
        name: 'DJ & Music Bands',
        description: 'Entertainment services for your events',
        image: 'https://i.pinimg.com/474x/ff/0f/ac/ff0fac03490309a5e360d9ff3bb467ce.jpg'
      },
      {
        id: 'photography',
        category: 'photography',
        name: 'Photography & Videography',
        description: 'Professional photography and videography services',
        image: 'https://i.pinimg.com/736x/64/97/8d/64978d041abc120be9bf7b0e0135ae02.jpg'
      },
      {
        id: 'entertainment',
        category: 'entertainment',
        name: 'Entertainers & Anchors',
        description: 'Professional entertainers and event anchors',
        image: 'https://i.pinimg.com/736x/7c/b8/85/7cb885f5e42ceebb4dfad02d0cb8a965.jpg'
      },
      {
        id: 'invitation',
        category: 'invitation',
        name: 'Invitation & Printing',
        description: 'Custom invitations and printing services',
        image: 'https://i.pinimg.com/474x/43/b2/0c/43b20c31b732872b98fb4024646a6b8f.jpg'
      },
      {
        id: 'bridal',
        category: 'bridal',
        name: 'Bridal Wear & Makeup',
        description: 'Bridal wear and professional makeup services',
        image: 'https://i.pinimg.com/474x/9d/1e/91/9d1e917e7a91eff99de0ff89999b2e04.jpg'
      },
      {
        id: 'gifts',
        category: 'gifts',
        name: 'Wedding Gifts & Favors',
        description: 'Custom wedding gifts and party favors',
        image: 'https://i.pinimg.com/474x/19/7f/e8/197fe8d6c8b32fa154f110c129313622.jpg'
      },
      {
        id: 'transportation',
        category: 'transportation',
        name: 'Transportation & Logistics',
        description: 'Transportation and logistics services',
        image: 'https://i.pinimg.com/474x/3d/b1/34/3db13449e7fc78b7644afea4219a4d77.jpg'
      }
    ];
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
      const { email, password,role } = req.body;
      if (!email || !password) {
          return res.status(400).json({ error: 'Email and password are required' });
      }
     let user=null;
      // Find the vendor by email and password (assuming passwords are stored in plain text)
      if(role==="vendor")
         user = await vendorsCollection.findOne({ email, password });
    else
       user = await customersCollection.findOne({ email, password });
      console.log()

      if (!user) {
          return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Successful login
      res.json({ message: 'Login successful', userId: user._id });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// OTP routes
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email,password } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const success = await sendOTP(email);
    
    if (success) {
      res.json({ message: 'OTP sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

app.post('/api/auth/verify-otp', (req, res) => {
  try {
    const { email,password, otp } = req.body;
    
    if (!email || !otp || !password) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const isValid = verifyOTP(email, otp);
    
    if (isValid) {
      res.json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid or expired OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Start the server
async function startServer() {
  // Connect to MongoDB first
  await connectToDatabase();
  
  // Then start the server
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Start the application
startServer().catch(console.error);