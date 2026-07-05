import axios from 'axios';

let rawBaseURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://post-social-0rr4.onrender.com/api');
if (rawBaseURL && !rawBaseURL.endsWith('/api')) {
    rawBaseURL = rawBaseURL.replace(/\/$/, '') + '/api';
}

const api = axios.create({
    baseURL: rawBaseURL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    console.log("Interceptor Token:", token);
    console.log("Request URL:", config.url);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;