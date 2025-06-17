import mongoose from 'mongoose';

const taxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tax name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: [true, 'Tax rate is required'],
    min: 0,
  },
  frequency: {
    type: String,
    required: true,
    enum: ['Monthly', 'Quarterly', 'Annually'],
  },
  dueDate: {
    type: Number, // Day of the month when tax is due
    required: true,
    min: 1,
    max: 31,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Property', 'Income', 'Sales', 'Other'],
  },
  minimumAmount: {
    type: Number,
    default: 0,
  },
  latePaymentPenalty: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Tax || mongoose.model('Tax', taxSchema); 