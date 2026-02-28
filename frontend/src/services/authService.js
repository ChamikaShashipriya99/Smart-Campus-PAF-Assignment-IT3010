import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

/**
 * Authentication Service to handle login and token management.
 */
const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password,
        });

        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
};

const getToken = () => {
    const user = getCurrentUser();
    return user?.token || null;
};

const authService = {
    login,
    logout,
    getCurrentUser,
    getToken,
};

export default authService;
