import mongoose, { Document, Schema } from 'mongoose';

export interface IFinancialReport extends Document {
  business: mongoose.Types.ObjectId;
  year: number;
  quarter: number;
  revenue: number;
  expenses: number;
  netIncome: number;
  submittedBy: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  taxAmount?: number;
  taxStatus: 'pending' | 'paid' | 'overdue';
}

const financialReportSchema = new Schema<IFinancialReport>({
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  quarter: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  revenue: {
    type: Number,
    required: true,
    min: 0
  },
  expenses: {
    type: Number,
    required: true,
    min: 0
  },
  netIncome: {
    type: Number,
    required: true
  },
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  taxAmount: {
    type: Number,
    min: 0
  },
  taxStatus: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export const FinancialReport = mongoose.model<IFinancialReport>('FinancialReport', financialReportSchema); 