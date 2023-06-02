import * as yup from 'yup';
import { financialReportValidationSchema } from 'validationSchema/financial-reports';

export const organizationValidationSchema = yup.object().shape({
  name: yup.string().required(),
  owner_id: yup.string().nullable().required(),
  financial_report: yup.array().of(financialReportValidationSchema),
});
