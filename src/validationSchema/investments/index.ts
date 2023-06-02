import * as yup from 'yup';

export const investmentValidationSchema = yup.object().shape({
  amount: yup.number().required(),
  investment_portfolio_id: yup.string().nullable().required(),
  halal_investment_product_id: yup.string().nullable().required(),
});
