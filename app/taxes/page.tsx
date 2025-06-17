import React from 'react';
import { Formik, Form } from 'formik';
import { motion } from 'framer-motion';
import { taxSchema } from '@/app/validations/taxSchema';
import FormInput from '@/app/components/ui/FormInput';
import FormSelect from '@/app/components/ui/FormSelect';
import FormButton from '@/app/components/ui/FormButton';

const frequencies = [
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Quarterly', label: 'Quarterly' },
  { value: 'Annually', label: 'Annually' },
];

const categories = [
  { value: 'Property', label: 'Property' },
  { value: 'Income', label: 'Income' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Other', label: 'Other' },
];

const TaxManage = () => {
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      // TODO: Implement API call to create/update tax
      console.log('Form values:', values);
      setSubmitting(false);
    } catch (error) {
      console.error('Error managing tax:', error);
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
            Manage Tax
          </h2>
          <Formik
            initialValues={{
              name: '',
              description: '',
              rate: '',
              frequency: '',
              dueDate: '',
              category: '',
              minimumAmount: '',
              latePaymentPenalty: '',
            }}
            validationSchema={taxSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <FormInput
                  label="Tax Name"
                  name="name"
                  required
                />
                <FormInput
                  label="Description"
                  name="description"
                  required
                />
                <FormInput
                  label="Rate (%)"
                  name="rate"
                  type="number"
                  required
                />
                <FormSelect
                  label="Frequency"
                  name="frequency"
                  options={frequencies}
                  required
                />
                <FormInput
                  label="Due Date (Day of Month)"
                  name="dueDate"
                  type="number"
                  required
                />
                <FormSelect
                  label="Category"
                  name="category"
                  options={categories}
                  required
                />
                <FormInput
                  label="Minimum Amount"
                  name="minimumAmount"
                  type="number"
                />
                <FormInput
                  label="Late Payment Penalty (%)"
                  name="latePaymentPenalty"
                  type="number"
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
                    Save Tax
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

export default TaxManage; 