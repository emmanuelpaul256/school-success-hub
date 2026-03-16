import api from './apiClient';

export const getDemos = (params?: Record<string, any>) => api.get('/leads/demos/', params);

export const getDemo = (id: string) => api.get(`/leads/demos/${id}/`);

export const createDemo = (payload: any) => api.post('/leads/demos/', payload);

export const updateDemo = (id: string, payload: any) => api.put(`/leads/demos/${id}/`, payload);

export const updateDemoStatus = (id: string, body: any) => api.patch(`/leads/demos/${id}/status/`, body);

export const getCalendar = (year?: number, month?: number, staffId?: string) =>
  api.get('/demos/calendar/', { year, month, staffId });

export const getUpcoming = (days?: number, staffId?: string) => api.get('/leads/demos/upcoming/', { days, staffId });

export const addAttendee = (id: string, attendee: any) => api.post(`/leads/demos/${id}/attendees/`, attendee);

export const cancelDemo = (id: string, reason?: string) => api.del(`/leads/demos/${id}/`, reason ? { reason } : undefined);
export const deleteDemo = (id: string) => api.del(`/leads/demos/${id}/`);

export default {
  getDemos,
  getDemo,
  createDemo,
  updateDemo,
  updateDemoStatus,
  getCalendar,
  getUpcoming,
  addAttendee,
  cancelDemo,
  deleteDemo,
};
