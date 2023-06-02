import axios from 'axios';
import queryString from 'query-string';
import { HalalInvestmentProductInterface } from 'interfaces/halal-investment-product';
import { GetQueryInterface } from '../../interfaces';

export const getHalalInvestmentProducts = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/halal-investment-products${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createHalalInvestmentProduct = async (halalInvestmentProduct: HalalInvestmentProductInterface) => {
  const response = await axios.post('/api/halal-investment-products', halalInvestmentProduct);
  return response.data;
};

export const updateHalalInvestmentProductById = async (
  id: string,
  halalInvestmentProduct: HalalInvestmentProductInterface,
) => {
  const response = await axios.put(`/api/halal-investment-products/${id}`, halalInvestmentProduct);
  return response.data;
};

export const getHalalInvestmentProductById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/halal-investment-products/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteHalalInvestmentProductById = async (id: string) => {
  const response = await axios.delete(`/api/halal-investment-products/${id}`);
  return response.data;
};
