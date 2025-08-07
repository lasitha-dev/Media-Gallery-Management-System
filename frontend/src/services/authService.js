import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials) => {
  const response = await authApi.post('/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await authApi.post('/register', userData);
  return response.data;
};

export const verifyOTP = async (data) => {
  const response = await authApi.post('/verify-otp', data);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const resendOTP = async (email) => {
  const response = await authApi.post('/resend-otp', { email });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await authApi.post('/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await authApi.post('/reset-password', data);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};
