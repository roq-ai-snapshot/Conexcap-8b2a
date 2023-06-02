import axios from 'axios';
import queryString from 'query-string';
import { InvestmentPortfolioInterface } from 'interfaces/investment-portfolio';
import { GetQueryInterface } from '../../interfaces';

export const getInvestmentPortfolios = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/investment-portfolios${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createInvestmentPortfolio = async (investmentPortfolio: InvestmentPortfolioInterface) => {
  const response = await axios.post('/api/investment-portfolios', investmentPortfolio);
  return response.data;
};

export const updateInvestmentPortfolioById = async (id: string, investmentPortfolio: InvestmentPortfolioInterface) => {
  const response = await axios.put(`/api/investment-portfolios/${id}`, investmentPortfolio);
  return response.data;
};

export const getInvestmentPortfolioById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/investment-portfolios/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteInvestmentPortfolioById = async (id: string) => {
  const response = await axios.delete(`/api/investment-portfolios/${id}`);
  return response.data;
};
