import * as Yup from 'yup';

export const paymentSchema = Yup.object().shape({
  business: Yup.string()
    .required('Business is required')
    .matches(/^[0-9a-fA-F]{24}$/, 'Invalid business ID'),
  tax: Yup.string()
    .required('Tax is required')
    .matches(/^[0-9a-fA-F]{24}$/, 'Invalid tax ID'),
  amount: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be greater than or equal to 0'),
  dueDate: Yup.date()
    .required('Due date is required')
    .min(new Date(), 'Due date must be in the future'),
  paymentMethod: Yup.string()
    .required('Payment method is required')
    .oneOf(['Bank Transfer', 'Credit Card', 'Cash', 'Other'], 'Invalid payment method'),
  referenceNumber: Yup.string()
    .required('Reference number is required')
    .matches(/^[A-Z0-9-]+$/, 'Reference number must contain only uppercase letters, numbers, and hyphens'),
  period: Yup.object().shape({
    start: Yup.date()
      .required('Period start date is required')
      .max(Yup.ref('end'), 'Start date must be before end date'),
    end: Yup.date()
      .required('Period end date is required')
      .min(Yup.ref('start'), 'End date must be after start date'),
  }),
  notes: Yup.string()
    .max(500, 'Notes must not exceed 500 characters'),
}); 