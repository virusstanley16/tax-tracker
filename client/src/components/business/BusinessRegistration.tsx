import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerBusiness } from '../../features/business/businessSlice';
import FormInput from '../shared/FormInput';
import type { RootState } from '../../store';
import { useAuth } from '../../contexts/AuthContext';
import type { Business, BusinessFormValues } from '../../types/business';
import type { AppDispatch } from '../../store';
import axios from 'axios';

interface BusinessUser {
  _id: string;
  name: string;
  email: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Business name is required'),
  ownerName: Yup.string().required('Owner name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  address: Yup.string().required('Address is required'),
  phone: Yup.string().required('Phone number is required'),
  businessType: Yup.string().required('Business type is required'),
});

const BusinessRegistration: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, error } = useSelector((state: RootState) => state.business);
  const [businessUsers, setBusinessUsers] = useState<BusinessUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchBusinessUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await axios.get('http://localhost:5000/api/auth/business-users');
        setBusinessUsers(response.data);
      } catch (error) {
        console.error('Error fetching business users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchBusinessUsers();
  }, []);

  const formik = useFormik<BusinessFormValues>({
    initialValues: {
      name: '',
      ownerName: '',
      email: '',
      address: '',
      phone: '',
      businessType: '',
      userId: user?._id || '',
      status: 'active',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const selectedUser = businessUsers.find(user => user._id === values.ownerName);
        if (!selectedUser) {
          throw new Error('Please select a business owner');
        }

        const businessData: Omit<Business, '_id'> = {
          name: values.name,
          ownerName: selectedUser.name,
          email: values.email,
          address: values.address,
          phone: values.phone,
          businessType: values.businessType,
          status: 'active',
          userAccount: values.ownerName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await dispatch(registerBusiness(businessData)).unwrap();
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
              required
            />

            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                Business Owner
              </label>
              <select
                id="ownerName"
                name="ownerName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.ownerName}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                disabled={loadingUsers}
              >
                <option value="">Select a business owner</option>
                {businessUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {formik.touched.ownerName && formik.errors.ownerName && (
                <div className="mt-1 text-sm text-red-600">{formik.errors.ownerName}</div>
              )}
            </div>

            <FormInput
              label="Email"
              name="email"
              type="email"
              required
            />

            <FormInput
              label="Address"
              name="address"
              type="text"
              required
            />

            <FormInput
              label="Phone"
              name="phone"
              type="tel"
              required
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
                disabled={loading || loadingUsers}
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