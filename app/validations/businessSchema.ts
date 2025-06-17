import * as Yup from 'yup';

export const businessSchema = Yup.object().shape({
  name: Yup.string()
    .required('Business name is required')
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must not exceed 100 characters'),
  registrationNumber: Yup.string()
    .required('Registration number is required')
    .matches(/^[A-Z0-9-]+$/, 'Registration number must contain only uppercase letters, numbers, and hyphens'),
  address: Yup.object().shape({
    street: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    postalCode: Yup.string()
      .required('Postal code is required')
      .matches(/^[0-9-]+$/, 'Postal code must contain only numbers and hyphens'),
  }),
  contactPerson: Yup.object().shape({
    name: Yup.string().required('Contact person name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9+\-() ]+$/, 'Invalid phone number format'),
  }),
  businessType: Yup.string()
    .required('Business type is required')
    .oneOf(['Retail', 'Service', 'Manufacturing', 'Other'], 'Invalid business type'),
  taxCategory: Yup.string()
    .required('Tax category is required')
    .oneOf(['Small', 'Medium', 'Large'], 'Invalid tax category'),
}); 