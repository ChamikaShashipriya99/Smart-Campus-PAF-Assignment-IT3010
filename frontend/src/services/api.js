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
    },
});

// Interceptor to add JWT to every request
api.interceptors.request.use(
    (config) => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
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
