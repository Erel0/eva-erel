import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'https://dummyjson.com', // Base URL for your API
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosInstance; 