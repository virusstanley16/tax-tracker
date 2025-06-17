import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  tax: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tax',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: 0,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Bank Transfer', 'Credit Card', 'Cash', 'Other'],
  },
  referenceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  latePaymentFee: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
  },
  period: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
}, {
  timestamps: true,
});

// Index for efficient querying
paymentSchema.index({ business: 1, tax: 1, status: 1 });
paymentSchema.index({ dueDate: 1, status: 1 });

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema); 