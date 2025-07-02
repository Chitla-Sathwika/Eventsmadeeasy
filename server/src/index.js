"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var express_1 = require("express");
var cors_1 = require("cors");
var http_1 = require("http");
var ws_1 = require("ws");
var mongodb_1 = require("mongodb");
var emailService_1 = require("./services/emailService");
// Load environment variables first
dotenv_1.default.config();
// Log environment variables on startup
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');
var app = (0, express_1.default)();
var server = (0, http_1.createServer)(app);
var wss = new ws_1.WebSocketServer({ server: server });
var PORT = process.env.PORT || 3001;
// MongoDB Connection
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event_services';
var db;
var vendorsCollection;
var customersCollection;
var bookingsCollection;
var messagesCollection;
// Connect to MongoDB
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var client, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    client = new mongodb_1.MongoClient(MONGODB_URI);
                    return [4 /*yield*/, client.connect()];
                case 1:
                    _a.sent();
                    console.log('Connected to MongoDB');
                    db = client.db();
                    // Initialize collections
                    vendorsCollection = db.collection('vendors');
                    customersCollection = db.collection('customers');
                    bookingsCollection = db.collection('bookings');
                    messagesCollection = db.collection('messages');
                    // Create indexes for faster queries
                    return [4 /*yield*/, vendorsCollection.createIndex({ id: 1 }, { unique: true })];
                case 2:
                    // Create indexes for faster queries
                    _a.sent();
                    return [4 /*yield*/, customersCollection.createIndex({ id: 1 }, { unique: true })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, bookingsCollection.createIndex({ id: 1 }, { unique: true })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, messagesCollection.createIndex({ bookingId: 1 })];
                case 5:
                    _a.sent();
                    return [2 /*return*/, client];
                case 6:
                    error_1 = _a.sent();
                    console.error('Error connecting to MongoDB:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// WebSocket connections store
var connections = new Map();
// WebSocket connection handler
wss.on('connection', function (ws, req) {
    var _a;
    var userId = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split('?userId=')[1];
    if (userId) {
        connections.set(userId, ws);
        console.log("Client connected: ".concat(userId));
        ws.on('close', function () {
            connections.delete(userId);
            console.log("Client disconnected: ".concat(userId));
        });
    }
});
// Helper function to notify clients
var notifyClients = function (userId, data) {
    var ws = connections.get(userId);
    if (ws && ws.readyState === ws_1.WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
};
// Vendor routes
app.get('/api/vendors', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var vendors, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, vendorsCollection.find().toArray()];
            case 1:
                vendors = _a.sent();
                res.json(vendors);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching vendors:', error_2);
                res.status(500).json({ error: 'Failed to fetch vendor profiles' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/vendors', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newVendor, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                newVendor = {
                    id: req.body.id,
                    email: req.body.email || '',
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
                return [4 /*yield*/, vendorsCollection.insertOne(newVendor)];
            case 1:
                result = _a.sent();
                res.status(201).json(newVendor);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error creating vendor:', error_3);
                res.status(500).json({ error: 'Failed to create vendor profile' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put('/api/vendors/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, vendorsCollection.findOneAndUpdate({ id: id }, { $set: req.body }, { returnDocument: 'after' })];
            case 1:
                result = _a.sent();
                if (!result) {
                    return [2 /*return*/, res.status(404).json({ error: 'Vendor not found' })];
                }
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error updating vendor:', error_4);
                res.status(500).json({ error: 'Failed to update vendor profile' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/vendors/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, vendor, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, vendorsCollection.findOne({ id: id })];
            case 1:
                vendor = _a.sent();
                if (!vendor) {
                    return [2 /*return*/, res.status(404).json({ error: 'Vendor not found' })];
                }
                res.json(vendor);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error fetching vendor:', error_5);
                res.status(500).json({ error: 'Failed to fetch vendor profile' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Customer routes
app.get('/api/customers', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var customers, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, customersCollection.find().toArray()];
            case 1:
                customers = _a.sent();
                res.json(customers);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error fetching customers:', error_6);
                res.status(500).json({ error: 'Failed to fetch customer profiles' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/customers', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newCustomer, result, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                newCustomer = {
                    id: "customer-".concat(Date.now()),
                    email: req.body.email || '',
                    name: req.body.name || '',
                    role: 'customer',
                    createdAt: new Date().toISOString(),
                    phoneNumber: req.body.phoneNumber || '',
                    address: req.body.address || '',
                    bookings: []
                };
                return [4 /*yield*/, customersCollection.insertOne(newCustomer)];
            case 1:
                result = _a.sent();
                res.status(201).json(newCustomer);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Error creating customer:', error_7);
                res.status(500).json({ error: 'Failed to create customer profile' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put('/api/customers/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, customersCollection.findOneAndUpdate({ id: id }, { $set: req.body }, { returnDocument: 'after' })];
            case 1:
                result = _a.sent();
                if (!result) {
                    return [2 /*return*/, res.status(404).json({ error: 'Customer not found' })];
                }
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.error('Error updating customer:', error_8);
                res.status(500).json({ error: 'Failed to update customer profile' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/customers/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, customer, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, customersCollection.findOne({ id: id })];
            case 1:
                customer = _a.sent();
                if (!customer) {
                    return [2 /*return*/, res.status(404).json({ error: 'Customer not found' })];
                }
                res.json(customer);
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.error('Error fetching customer:', error_9);
                res.status(500).json({ error: 'Failed to fetch customer profile' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Booking routes
app.get('/api/bookings', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var bookings, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('Fetching all bookings...');
                return [4 /*yield*/, bookingsCollection.find().toArray()];
            case 1:
                bookings = _a.sent();
                console.log('Found bookings:', bookings);
                res.json(bookings);
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                console.error('Error fetching bookings:', error_10);
                res.status(500).json({ error: 'Failed to fetch bookings' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/bookings', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newBooking, result, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                console.log('Creating new booking:', req.body);
                newBooking = {
                    id: "booking-".concat(Date.now()),
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
                return [4 /*yield*/, bookingsCollection.insertOne(newBooking)];
            case 1:
                result = _a.sent();
                // Update vendor and customer bookings arrays
                return [4 /*yield*/, vendorsCollection.updateOne({ id: newBooking.vendorId }, { $push: { bookings: newBooking.id } })];
            case 2:
                // Update vendor and customer bookings arrays
                _a.sent();
                return [4 /*yield*/, customersCollection.updateOne({ id: newBooking.customerId }, { $push: { bookings: newBooking.id } })];
            case 3:
                _a.sent();
                // Notify the vendor about the new booking
                console.log('Notifying vendor:', newBooking.vendorId);
                notifyClients(newBooking.vendorId, {
                    type: 'new_booking',
                    booking: newBooking
                });
                res.status(201).json(newBooking);
                return [3 /*break*/, 5];
            case 4:
                error_11 = _a.sent();
                console.error('Error creating booking:', error_11);
                res.status(500).json({ error: 'Failed to create booking' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.put('/api/bookings/:id/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, statusMap, newStatus, result, updatedBooking, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('Updating booking status:', { id: req.params.id, status: req.body.status });
                id = req.params.id;
                statusMap = {
                    'rejected': 'declined',
                    'cancelled': 'canceled'
                };
                newStatus = statusMap[req.body.status] || req.body.status;
                return [4 /*yield*/, bookingsCollection.findOneAndUpdate({ id: id }, { $set: { status: newStatus } }, { returnDocument: 'after' })];
            case 1:
                result = _a.sent();
                if (!result) {
                    console.log('Booking not found:', id);
                    return [2 /*return*/, res.status(404).json({ error: 'Booking not found' })];
                }
                updatedBooking = result;
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
                return [3 /*break*/, 3];
            case 2:
                error_12 = _a.sent();
                console.error('Error updating booking status:', error_12);
                res.status(500).json({ error: 'Failed to update booking status' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Chat message endpoints
app.get('/api/messages/:bookingId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var bookingId, messages, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                bookingId = req.params.bookingId;
                return [4 /*yield*/, messagesCollection.find({ bookingId: bookingId }).toArray()];
            case 1:
                messages = _a.sent();
                res.json(messages);
                return [3 /*break*/, 3];
            case 2:
                error_13 = _a.sent();
                console.error('Error fetching messages:', error_13);
                res.status(500).json({ error: 'Failed to fetch messages' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/messages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, bookingId, senderId, content, newMessage, result, booking, recipientId, error_14;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, bookingId = _a.bookingId, senderId = _a.senderId, content = _a.content;
                newMessage = {
                    id: "message-".concat(Date.now()),
                    bookingId: bookingId,
                    senderId: senderId,
                    content: content,
                    timestamp: new Date().toISOString()
                };
                return [4 /*yield*/, messagesCollection.insertOne(newMessage)];
            case 1:
                result = _b.sent();
                return [4 /*yield*/, bookingsCollection.findOne({ id: bookingId })];
            case 2:
                booking = _b.sent();
                if (booking) {
                    recipientId = senderId === booking.customerId ? booking.vendorId : booking.customerId;
                    notifyClients(recipientId, {
                        type: 'new_message',
                        message: newMessage
                    });
                }
                res.json(newMessage);
                return [3 /*break*/, 4];
            case 3:
                error_14 = _b.sent();
                console.error('Error sending message:', error_14);
                res.status(500).json({ error: 'Failed to send message' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Service endpoints
app.get('/api/services', function (req, res) {
    try {
        var services = [
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
    }
    catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});
// OTP routes
app.post('/api/auth/send-otp', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, success, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                email = req.body.email;
                if (!email) {
                    return [2 /*return*/, res.status(400).json({ error: 'Email is required' })];
                }
                return [4 /*yield*/, (0, emailService_1.sendOTP)(email)];
            case 1:
                success = _a.sent();
                if (success) {
                    res.json({ message: 'OTP sent successfully' });
                }
                else {
                    res.status(500).json({ error: 'Failed to send OTP' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_15 = _a.sent();
                console.error('Error sending OTP:', error_15);
                res.status(500).json({ error: 'Failed to send OTP' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/auth/verify-otp', function (req, res) {
    try {
        var _a = req.body, email = _a.email, otp = _a.otp;
        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }
        var isValid = (0, emailService_1.verifyOTP)(email, otp);
        if (isValid) {
            res.json({ message: 'OTP verified successfully' });
        }
        else {
            res.status(400).json({ error: 'Invalid or expired OTP' });
        }
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
});
// Start the server
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Connect to MongoDB first
                return [4 /*yield*/, connectToDatabase()];
                case 1:
                    // Connect to MongoDB first
                    _a.sent();
                    // Then start the server
                    server.listen(PORT, function () {
                        console.log("Server is running on port ".concat(PORT));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// Start the application
startServer().catch(console.error);
