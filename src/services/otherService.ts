import api from './apiClient';

// Activities
export const getActivities = (params?: Record<string, any>) => api.get('/leads/activities/', params);

// Analyticsg
export const getAnalytics = (params?: Record<string, any>) => api.get('/analytics/', params);

// Notifications
export const getNotifications = (params?: Record<string, any>) => api.get('/leads/notifications/', params);
export const getUnreadNotifications = (params?: Record<string, any>) => api.get('/leads/notifications/unread/', params);
export const markNotificationAsRead = (id: string) => api.patch(`/leads/notifications/${id}/read/`);
export const markAllNotificationsAsRead = () => api.patch('/leads/notifications/mark-all-read/');

// Settings / Profile
export const getProfile = () => api.get('/auth/settings/profile');
export const getCurrentUser = () => api.get('/users/me');
export const updateProfile = (payload: any) => api.put('/settings/profile', payload);
export const changePassword = (payload: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
  api.post('/settings/change-password', payload);

// Auth profile endpoints (used by Settings page)
export const getAuthProfile = () => api.get('/auth/profile/');
export const updateAuthProfile = (payload: any) => api.put('/auth/profile/update/', payload);
export const changePasswordAuth = (payload: { old_password: string; new_password: string; new_password_confirm: string }) =>
  api.post('/auth/password/change/', payload);

// Preferences
export const getUserPreferences = () => api.get('/users/preferences');
export const updateUserPreferences = (payload: any) => api.put('/users/preferences', payload);

// Organization
export const getOrganization = () => api.get('/organization');

// Staff
export const getStaff = (params?: Record<string, any>) => api.get('/leads/users/sales/', params);

export default {
  getActivities,
  getAnalytics,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getProfile,
  getCurrentUser,
  updateProfile,
  changePassword,
  getAuthProfile,
  updateAuthProfile,
  changePasswordAuth,
  getUserPreferences,
  updateUserPreferences,
  getOrganization,
  getStaff,
};
