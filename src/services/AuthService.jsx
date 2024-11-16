// src/api/authService.js
import axios from './axios';

// Login user
const login = async (email, password) => {
    try {
        const response = await axios.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Register a new user (patient, doctor)
const register = async (userData) => {
    const response = await axios.post('/auth/register/patient', userData);
    return response.data;
};

const authService = {
    login,
    register,
};

export default authService;
