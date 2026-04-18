import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getProducts = (filters = {}) => api.get('/products', { params: filters });
export const getProductById = (id) => api.get(`/products/${id}`);
export const getRates = () => api.get('/rates');
export const getEstimate = (payload) => api.post('/estimate', payload);
export const aiMatch = (query, role) => api.post('/ai/match', { query, role });

export default api;
