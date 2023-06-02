import * as yup from 'yup';

export const financialReportValidationSchema = yup.object().shape({
  report_date: yup.date().required(),
  report_data: yup.string().required(),
  organization_id: yup.string().nullable().required(),
});
