import axios from 'axios';
import queryString from 'query-string';
import { EducationalResourceInterface } from 'interfaces/educational-resource';
import { GetQueryInterface } from '../../interfaces';

export const getEducationalResources = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/educational-resources${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEducationalResource = async (educationalResource: EducationalResourceInterface) => {
  const response = await axios.post('/api/educational-resources', educationalResource);
  return response.data;
};

export const updateEducationalResourceById = async (id: string, educationalResource: EducationalResourceInterface) => {
  const response = await axios.put(`/api/educational-resources/${id}`, educationalResource);
  return response.data;
};

export const getEducationalResourceById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/educational-resources/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteEducationalResourceById = async (id: string) => {
  const response = await axios.delete(`/api/educational-resources/${id}`);
  return response.data;
};
