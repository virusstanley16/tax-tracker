import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerBusiness } from '../../features/business/businessSlice';
import FormInput from '../shared/FormInput';
import { RootState } from '../../store';

const validationSchema = Yup.object({
  name: Yup.string().required('Business name is required'),
  ownerName: Yup.string().required('Owner name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  address: Yup.string().required('Address is required'),
  phone: Yup.string().required('Phone number is required'),
  businessType: Yup.string().required('Business type is required'),
});

const BusinessRegistration: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.business);

  const formik = useFormik({
    initialValues: {
      name: '',
      ownerName: '',
      email: '',
      address: '',
      phone: '',
      businessType: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(registerBusiness(values)).unwrap();
        navigate('/dashboard');
      } catch (err) {
        // Error is handled by the slice
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register Your Business
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <FormInput
              label="Business Name"
              name="name"
              type="text"
              formik={formik}
            />

            <FormInput
              label="Owner Name"
              name="ownerName"
              type="text"
              formik={formik}
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              formik={formik}
            />

            <FormInput
              label="Address"
              name="address"
              type="text"
              formik={formik}
            />

            <FormInput
              label="Phone"
              name="phone"
              type="tel"
              formik={formik}
            />

            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                Business Type
              </label>
              <select
                id="businessType"
                name="businessType"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.businessType}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select a business type</option>
                <option value="sole_proprietorship">Sole Proprietorship</option>
                <option value="partnership">Partnership</option>
                <option value="corporation">Corporation</option>
                <option value="llc">LLC</option>
              </select>
              {formik.touched.businessType && formik.errors.businessType && (
                <div className="mt-1 text-sm text-red-600">{formik.errors.businessType}</div>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Register Business'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistration; 