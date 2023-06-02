import { FinancialReportInterface } from 'interfaces/financial-report';
import { UserInterface } from 'interfaces/user';

export interface OrganizationInterface {
  id?: string;
  name: string;
  owner_id: string;
  financial_report?: FinancialReportInterface[];
  user?: UserInterface;
  _count?: {
    financial_report?: number;
  };
}
