import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  id: String,
  category: String,
  name: String,
  description: String,
  image: String,
});

const VendorSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // Custom ID format
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: "vendor" },
  createdAt: { type: Date, default: Date.now },
  service: ServiceSchema, // Embedded service object
  costStructure: String,
  serviceAreas: [String], // Array of strings
  specializations: [String], // Array of strings
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking", // Reference to bookings
    },
  ],
});

export const Vendor1 = mongoose.model('Vendor', VendorSchema);
