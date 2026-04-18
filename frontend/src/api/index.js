import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const api = axios.create({ baseURL: `${API_URL}/api` });

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
