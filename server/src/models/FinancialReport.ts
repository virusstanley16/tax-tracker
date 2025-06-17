import { Schema, model, Document } from 'mongoose';

export interface IFinancialReport extends Document {
  businessId: Schema.Types.ObjectId;
  year: number;
  quarter: number;
  revenue: number;
  expenses: number;
  taxAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  submittedBy: Schema.Types.ObjectId;
  reviewedBy?: Schema.Types.ObjectId;
  reviewDate?: Date;
  reviewNotes?: string;
  taxStatus: 'paid' | 'pending' | 'overdue';
  paymentDate?: Date;
}

const financialReportSchema = new Schema<IFinancialReport>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    quarter: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    revenue: {
      type: Number,
      required: true,
      min: 0,
    },
    expenses: {
      type: Number,
      required: true,
      min: 0,
    },
    taxAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    description: {
      type: String,
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewDate: {
      type: Date,
    },
    reviewNotes: {
      type: String,
    },
    taxStatus: {
      type: String,
      enum: ['paid', 'pending', 'overdue'],
      default: 'pending',
    },
    paymentDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique reports per business per quarter
financialReportSchema.index({ businessId: 1, year: 1, quarter: 1 }, { unique: true });

export const FinancialReport = model<IFinancialReport>('FinancialReport', financialReportSchema); 