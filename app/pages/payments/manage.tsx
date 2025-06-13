import React from 'react';
import { Formik, Form } from 'formik';
import { motion } from 'framer-motion';
import { paymentSchema } from '@/validations/paymentSchema';
import FormInput from '@/components/ui/FormInput';
import FormSelect from '@/components/ui/FormSelect';
import FormButton from '@/components/ui/FormButton';

const paymentMethods = [
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Credit Card', label: 'Credit Card' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Other', label: 'Other' },
];

const PaymentManage = () => {
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      // TODO: Implement API call to create/update payment
      console.log('Form values:', values);
      setSubmitting(false);
    } catch (error) {
      console.error('Error managing payment:', error);
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
            Manage Payment
          </h2>
          <Formik
            initialValues={{
              business: '',
              tax: '',
              amount: '',
              dueDate: '',
              paymentMethod: '',
              referenceNumber: '',
              period: {
                start: '',
                end: '',
              },
              notes: '',
            }}
            validationSchema={paymentSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <FormInput
                  label="Business ID"
                  name="business"
                  required
                />
                <FormInput
                  label="Tax ID"
                  name="tax"
                  required
                />
                <FormInput
                  label="Amount"
                  name="amount"
                  type="number"
                  required
                />
                <FormInput
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  required
                />
                <FormSelect
                  label="Payment Method"
                  name="paymentMethod"
                  options={paymentMethods}
                  required
                />
                <FormInput
                  label="Reference Number"
                  name="referenceNumber"
                  required
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Payment Period</h3>
                  <FormInput
                    label="Start Date"
                    name="period.start"
                    type="date"
                    required
                  />
                  <FormInput
                    label="End Date"
                    name="period.end"
                    type="date"
                    required
                  />
                </div>

                <FormInput
                  label="Notes"
                  name="notes"
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
                    Save Payment
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

export default PaymentManage; 