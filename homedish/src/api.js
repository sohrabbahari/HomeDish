// api.js
import axios from 'axios';
import baseURL from './apiConfig'; // Import baseURL from apiConfig.js

const api = axios.create({
    baseURL: baseURL, // Use the baseURL from apiConfig.js
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
