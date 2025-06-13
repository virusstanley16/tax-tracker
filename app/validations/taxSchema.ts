import * as Yup from 'yup';

export const taxSchema = Yup.object().shape({
  name: Yup.string()
    .required('Tax name is required')
    .min(2, 'Tax name must be at least 2 characters')
    .max(100, 'Tax name must not exceed 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  rate: Yup.number()
    .required('Tax rate is required')
    .min(0, 'Tax rate must be greater than or equal to 0')
    .max(100, 'Tax rate must be less than or equal to 100'),
  frequency: Yup.string()
    .required('Frequency is required')
    .oneOf(['Monthly', 'Quarterly', 'Annually'], 'Invalid frequency'),
  dueDate: Yup.number()
    .required('Due date is required')
    .min(1, 'Due date must be between 1 and 31')
    .max(31, 'Due date must be between 1 and 31'),
  category: Yup.string()
    .required('Category is required')
    .oneOf(['Property', 'Income', 'Sales', 'Other'], 'Invalid category'),
  minimumAmount: Yup.number()
    .min(0, 'Minimum amount must be greater than or equal to 0'),
  latePaymentPenalty: Yup.number()
    .min(0, 'Late payment penalty must be greater than or equal to 0'),
}); 