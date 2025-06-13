import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true,
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  contactPerson: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  businessType: {
    type: String,
    required: true,
    enum: ['Retail', 'Service', 'Manufacturing', 'Other'],
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active',
  },
  taxCategory: {
    type: String,
    required: true,
    enum: ['Small', 'Medium', 'Large'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Business || mongoose.model('Business', businessSchema); 