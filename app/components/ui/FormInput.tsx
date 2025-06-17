import React from 'react';
import { useField } from 'formik';
import { motion } from 'framer-motion';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  className = '',
}) => {
  const [field, meta] = useField(name);

  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <motion.input
        {...field}
        type={type}
        id={name}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          meta.touched && meta.error
            ? 'border-red-500'
            : 'border-gray-300'
        }`}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      />
      {meta.touched && meta.error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1"
        >
          {meta.error}
        </motion.div>
      )}
    </div>
  );
};

export default FormInput; 