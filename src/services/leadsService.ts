import api from './apiClient';

export const getLeads = (params?: Record<string, any>) => api.get('/leads/', params);

export const getLead = (id: string) => api.get(`/leads/${id}/`);

export const createLead = (payload: any) => api.post('/leads/', payload);

export const updateLead = (id: string, payload: any) => api.put(`/leads/${id}/`, payload);

export const patchLeadStatus = (id: string, status: string) => api.patch(`/leads/${id}/status/`, { status });

export const addLeadNote = (id: string, note: string) => api.post(`/leads/${id}/notes/`, { note });

export const getLeadCommunications = (id: string) => api.get(`/leads/${id}/communications/`);

export const getSalesUsers = () => api.get('/leads/users/sales/');

export default {
  getLeads,
  getLead,
  createLead,
  updateLead,
  patchLeadStatus,
  addLeadNote,
  getLeadCommunications,
  getSalesUsers,
};
