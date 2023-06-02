import { OrganizationInterface } from 'interfaces/organization';

export interface FinancialReportInterface {
  id?: string;
  organization_id: string;
  report_date: Date;
  report_data: string;

  organization?: OrganizationInterface;
  _count?: {};
}
