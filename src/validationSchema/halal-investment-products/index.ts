import * as yup from 'yup';
import { investmentValidationSchema } from 'validationSchema/investments';

export const halalInvestmentProductValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  performance: yup.number().required(),
  investment: yup.array().of(investmentValidationSchema),
});
