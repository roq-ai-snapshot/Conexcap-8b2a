import { InvestmentInterface } from 'interfaces/investment';

export interface HalalInvestmentProductInterface {
  id?: string;
  name: string;
  description?: string;
  performance: number;
  investment?: InvestmentInterface[];

  _count?: {
    investment?: number;
  };
}
