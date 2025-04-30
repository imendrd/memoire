import api from './api';

// Save auth data to localStorage
const setAuthData = (token: string, user: any) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove auth data from localStorage
const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get current user from localStorage
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Login user
const login = async (email: string, password: string) => {
  try {
    const response = await api.login(email, password);
    setAuthData(response.token, response.user);
    return response.user;
  } catch (error) {
    throw error;
  }
};

// Register user
const register = async (name: string, email: string, password: string) => {
  try {
    const response = await api.register(name, email, password);
    setAuthData(response.token, response.user);
    return response.user;
  } catch (error) {
    throw error;
  }
};

// Logout user
const logout = () => {
  clearAuthData();
};

// Update user profile
const updateProfile = async (data: { name?: string; email?: string }) => {
  try {
    const response = await api.updateProfile(data);
    // Update user in localStorage
    const user = getCurrentUser();
    if (user) {
      const updatedUser = { ...user, ...response };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser,
  updateProfile,
};