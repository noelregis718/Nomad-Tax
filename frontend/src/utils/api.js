import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const travelApi = {
  // Mock initialization for demo
  initMock: () => api.post('/init-mock'),

  // Stays
  getStays: (userId) => api.get(`/stays/${userId}`),
  addStay: (stayData) => api.post('/stays', stayData),

  // Summary
  getSummary: (userId, countryCode) => api.get(`/summary/${userId}/${countryCode}`),
};

export default api;
