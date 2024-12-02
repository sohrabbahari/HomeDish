// api.js
import axios from 'axios';
import baseURL from './apiConfig'; // Import baseURL from apiConfig.js
import store from './redux/store'; // Import the store to access the token

// Create an axios instance with baseURL
const api = axios.create({
    baseURL: baseURL, // Use the baseURL from apiConfig.js
    headers: {
        'Content-Type': 'application/json',
    },
});

// Adding a request interceptor to include the JWT token in the headers if it exists
api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.user?.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API to handle user login
export const login = async (email, password) => {
    try {
        const response = await api.post('/users/login', { email, password });
        const token = response.data.token;

        if (token) {
            // Save token to Redux store or AsyncStorage for use in future requests
            await AsyncStorage.setItem('token', token);
        }

        return response.data; // returning user data or token
    } catch (error) {
        console.error('Error logging in:', error);
        throw error; // Throwing error for better error handling in the component
    }
};

// API to handle user registration
export const register = async (name, email, password) => {
    try {
        const response = await api.post('/users/register', { name, email, password });
        return response.data; // Returning success or user data
    } catch (error) {
        console.error('Error registering user:', error);
        throw error; // Throwing error for better error handling in the component
    }
};

// API to place an order
export const placeOrder = async (orderData) => {
    try {
        const response = await api.post('/orders', orderData);
        return response.data; // Returning order confirmation details
    } catch (error) {
        console.error('Error placing order:', error);
        throw error; // Throwing error for better error handling in the component
    }
};

// Export the `api` instance for other general requests if needed
export default api;
