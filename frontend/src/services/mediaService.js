import axios from 'axios';

const API_URL = 'http://localhost:5000/api/media';

// Add request interceptor to include authentication token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadMedia = async (formData) => {
  const response = await axios.post(`${API_URL}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
  return response.data;
};

export const getOwnMedia = async (page = 1, limit = 12, tags = '') => {
  const response = await axios.get(
    `${API_URL}/my?page=${page}&limit=${limit}&tags=${tags}`,
    { withCredentials: true }
  );
  return response.data;
};

export const getSharedMedia = async (page = 1, limit = 12, tags = '') => {
  const response = await axios.get(
    `${API_URL}/shared?page=${page}&limit=${limit}&tags=${tags}`,
    { withCredentials: true }
  );
  return response.data;
};

export const updateMedia = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteMedia = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const downloadMediaAsZip = async (mediaIds) => {
  const response = await axios.post(
    `${API_URL}/download-zip`,
    { mediaIds },
    {
      withCredentials: true,
      responseType: 'blob',
    }
  );
  return response.data;
};
