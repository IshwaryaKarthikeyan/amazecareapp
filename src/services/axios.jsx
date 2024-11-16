// src/api/axios.js
import axios from 'axios';

// Create an axios instance with default settings
const instance = axios.create({
    baseURL: 'http://localhost:8080/api',  // Replace with your actual backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to automatically include the JWT token (if available) in every request
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Get token from local storage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Add token to request header
        }
        return config;  // Return the modified config
    },
    (error) => {
        // Handle the error if the request could not be made (e.g., no internet)
        return Promise.reject(error);
    }
);

// Interceptor to handle unauthorized responses (e.g., token expiration)
instance.interceptors.response.use(
    (response) => {
        return response;  // Return the response data as-is
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized error (e.g., log the user out if token is expired)
            localStorage.removeItem('token');  // Clear token if unauthorized
            window.location.href = '/login';   // Redirect to login page
        }
        return Promise.reject(error);  // Return the error for further handling
    }
);

export default instance;
