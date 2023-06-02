import * as yup from 'yup';

export const educationalResourceValidationSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup.string().required(),
  category: yup.string().required(),
});
