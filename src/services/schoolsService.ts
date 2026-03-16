import api from './apiClient';

export const getSchools = (params?: Record<string, any>) => api.get('/schools/', params);

export const getSchool = (id: string) => api.get(`/schools/${id}`);

export const getSchoolDetails = (id: string) => api.get(`/schools/${id}/details`);

export const createSchool = (payload: any) => api.post('/schools', payload);

export const updateSchool = (id: string, payload: any) => api.put(`/schools/${id}`, payload);

export const patchOnboarding = (id: string, payload: any) => api.patch(`/schools/${id}/onboarding`, payload);

export const upgradeSchool = (id: string, payload: any) => api.patch(`/schools/${id}/upgrade`, payload);

export const getSupport = (id: string, params?: Record<string, any>) => api.get(`/schools/${id}/support`, params);

export const createSupportTicket = (id: string, ticket: any) => api.post(`/schools/${id}/support/tickets`, ticket);

export default {
  getSchools,
  getSchool,
  getSchoolDetails,
  createSchool,
  updateSchool,
  patchOnboarding,
  upgradeSchool,
  getSupport,
  createSupportTicket,
};
