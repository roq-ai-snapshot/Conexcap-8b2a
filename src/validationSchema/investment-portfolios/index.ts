import * as yup from 'yup';
import { investmentValidationSchema } from 'validationSchema/investments';

export const investmentPortfolioValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  investment: yup.array().of(investmentValidationSchema),
});
