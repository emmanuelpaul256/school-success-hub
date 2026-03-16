import api from './apiClient';

export const login = (email: string, password: string) =>
  api.post('/auth/login/', { email, password });

export const logout = () =>
  api.post('/auth/logout/');

export const refreshToken = () =>
  api.post('/auth/refresh/');

export default {
  login,
  logout,
  refreshToken,
};
