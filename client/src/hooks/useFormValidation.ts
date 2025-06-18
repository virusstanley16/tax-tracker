import { useFormik } from 'formik';
import * as Yup from 'yup';

interface ValidationSchema {
  [key: string]: any;
}

export const useFormValidation = (
  initialValues: any,
  validationSchema: ValidationSchema,
  onSubmit: (values: any) => void
) => {
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape(validationSchema),
    onSubmit,
  });

  return formik;
}; 