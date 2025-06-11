import { z } from 'zod';

export const createRegisterSchema = z.object({
  name: z.string().min(1, 'name is required').max(255),
  ownerName: z.string().min(1, 'ownername is required').max(255),
  address: z.string().min(1).max(255),
  phone_Number: z.number().min(1, 'phone_number is required').max(9999999999), // Assuming phone number is 10 digits
  tax_type: z.string().min(1).max(255),
  amount: z.number().min(1, 'Amount is').max(1000000),
  payment_date: z.string().refine((Date)),
  description: z.string().min(20).max(500),
});
