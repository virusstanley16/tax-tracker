import mongoose, { Document, Schema } from 'mongoose';

export interface IBusiness extends Document {
  name: string;
  ownerName: string;
  email: string;
  address: string;
  phone: string;
  businessType: string;
  registrationDate: Date;
  status: 'active' | 'inactive' | 'suspended';
  registeredBy: mongoose.Types.ObjectId; // Reference to government worker
  userAccount: mongoose.Types.ObjectId; // Reference to user account
}

const businessSchema = new Schema<IBusiness>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  businessType: {
    type: String,
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  registeredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userAccount: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export const Business = mongoose.model<IBusiness>('Business', businessSchema); 