import api from './apiClient';

export const getKpi = (dateRange?: string) =>
  api.get('/leads/dashboard/kpi/', dateRange ? { dateRange } : undefined);

export const getLeadsStatus = () => api.get('/leads/dashboard/leads-status/');

export const getUpcomingDemos = (days?: number) => api.get('/leads/dashboard/upcoming-demos/', days ? { days } : undefined);

export const getRecentActivity = (limit = 10, type?: string) =>
  api.get('/leads/dashboard/activity/', { limit, type });

export const getAnalytics = (params?: { period?: string }) =>
  api.get('/leads/analytics/', params);

export default { getKpi, getLeadsStatus, getUpcomingDemos, getRecentActivity, getAnalytics };
