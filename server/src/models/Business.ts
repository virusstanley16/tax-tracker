import { Schema, model, Document } from 'mongoose';

export interface IBusiness extends Document {
  name: string;
  type: string;
  registrationNumber: string;
  status: 'active' | 'suspended' | 'deactivated';
  ownerId: Schema.Types.ObjectId;
  taxStatus: 'paid' | 'pending' | 'overdue';
  lastTaxPaymentDate?: Date;
  nextTaxDueDate?: Date;
}

const businessSchema = new Schema<IBusiness>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'deactivated'],
      default: 'active',
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    taxStatus: {
      type: String,
      enum: ['paid', 'pending', 'overdue'],
      default: 'pending',
    },
    lastTaxPaymentDate: {
      type: Date,
    },
    nextTaxDueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Business = model<IBusiness>('Business', businessSchema); 