import { InvestmentPortfolioInterface } from 'interfaces/investment-portfolio';
import { HalalInvestmentProductInterface } from 'interfaces/halal-investment-product';

export interface InvestmentInterface {
  id?: string;
  investment_portfolio_id: string;
  halal_investment_product_id: string;
  amount: number;

  investment_portfolio?: InvestmentPortfolioInterface;
  halal_investment_product?: HalalInvestmentProductInterface;
  _count?: {};
}
