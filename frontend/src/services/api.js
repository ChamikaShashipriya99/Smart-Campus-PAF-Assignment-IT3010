import axios from 'axios';

/**
 * Centeralized Axios instance for the Smart Campus API.
 * Using a dedicated instance allows us to:
 * 1. Define a base URL to avoid repetition.
 * 2. Set common headers (like Auth tokens).
 * 3. Add interceptors for global error handling or logging.
 */
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
        // Basic Auth for 'admin' : 'admin123'
        // btoa('admin:admin123') = 'YWRtaW46YWRtaW4xMjM='
        'Authorization': 'Basic YWRtaW46YWRtaW4xMjM=',
    },
});

// Optional: Add request interceptors (e.g., for JWT)
api.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Optional: Add response interceptors for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
