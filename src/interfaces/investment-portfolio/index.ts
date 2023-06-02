import { InvestmentInterface } from 'interfaces/investment';
import { UserInterface } from 'interfaces/user';

export interface InvestmentPortfolioInterface {
  id?: string;
  user_id: string;
  investment?: InvestmentInterface[];
  user?: UserInterface;
  _count?: {
    investment?: number;
  };
}
