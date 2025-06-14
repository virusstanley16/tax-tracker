'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { motion } from 'framer-motion';
import { businessSchema } from '@/app/validations/businessSchema';
import FormInput from '@/app/components/ui/FormInput';
import FormSelect from '@/app/components/ui/FormSelect';
import FormButton from '@/app/components/ui/FormButton';


const businessTypes = [
  { value: 'Retail', label: 'Retail' },
  { value: 'Service', label: 'Service' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Other', label: 'Other' },
];

const taxCategories = [
  { value: 'Small', label: 'Small' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Large', label: 'Large' },
];

const BusinessRegister = () => {
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      // TODO: Implement API call to register business
      console.log('Form values:', values);
      setSubmitting(false);
    } catch (error) {
      console.error('Error registering business:', error);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Register New Business
          </h2>
          <Formik
            initialValues={{
              name: '',
              registrationNumber: '',
              address: {
                street: '',
                city: '',
                state: '',
                postalCode: '',
              },
              contactPerson: {
                name: '',
                email: '',
                phone: '',
              },
              businessType: '',
              taxCategory: '',
            }}
            validationSchema={businessSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <FormInput
                  label="Business Name"
                  name="name"
                  required
                />
                <FormInput
                  label="Registration Number"
                  name="registrationNumber"
                  required
                />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Address</h3>
                  <FormInput
                    label="Street"
                    name="address.street"
                    required
                  />
                  <FormInput
                    label="City"
                    name="address.city"
                    required
                  />
                  <FormInput
                    label="State"
                    name="address.state"
                    required
                  />
                  <FormInput
                    label="Postal Code"
                    name="address.postalCode"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Contact Person</h3>
                  <FormInput
                    label="Name"
                    name="contactPerson.name"
                    required
                  />
                  <FormInput
                    label="Email"
                    name="contactPerson.email"
                    type="email"
                    required
                  />
                  <FormInput
                    label="Phone"
                    name="contactPerson.phone"
                    required
                  />
                </div>

                <FormSelect
                  label="Business Type"
                  name="businessType"
                  options={businessTypes}
                  required
                />
                <FormSelect
                  label="Tax Category"
                  name="taxCategory"
                  options={taxCategories}
                  required
                />

                <div className="flex justify-end space-x-4">
                  <FormButton
                    type="button"
                    variant="secondary"
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </FormButton>
                  <FormButton
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Register Business
                  </FormButton>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>
    </div>
  );
};

export default BusinessRegister; 