// src/api/axiosClient.js
// ------------------------------------------------------------
// Axios client configuration
// This file creates a reusable Axios instance with default
// settings, interceptors, and API versioning support.
// ------------------------------------------------------------

import axios from 'axios';

// ------------------------------------------------------------
// Environment configuration (provided by Vite)
// Vite exposes env vars prefixed with VITE_ to the client
// ------------------------------------------------------------

// Base API URL - the root domain of your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// API version - change this value (v1, v2, v3) to switch versions
// All requests will be prefixed with `/api/{API_VERSION}`
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

// Request timeout in milliseconds
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;

// ------------------------------------------------------------
// Build the full API base path including version segment
// Example: https://api.quorda.com/api/v1
// ------------------------------------------------------------
const API_BASE_PATH = `${API_BASE_URL}/api/${API_VERSION}`;

// ------------------------------------------------------------
// Create the Axios instance with default configuration
// ------------------------------------------------------------
const axiosClient = axios.create({
  baseURL: API_BASE_PATH,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ------------------------------------------------------------
// REQUEST INTERCEPTOR
// Runs before every request is sent.
// Used here to attach the auth token (JWT, etc.) to headers.
// ------------------------------------------------------------
axiosClient.interceptors.request.use(
  (config) => {
    // Retrieve the authentication token from localStorage
    // (or from a state management store / cookie if you use one)
    const token = localStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors (e.g., network issues before sending)
    return Promise.reject(error);
  }
);

// ------------------------------------------------------------
// RESPONSE INTERCEPTOR
// Runs after a response is received.
// Used for centralized error handling and token refresh.
// ------------------------------------------------------------
axiosClient.interceptors.response.use(
  (response) => {
    // Successful response - just pass it through
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with a non-2xx status code
      const status = error.response.status;

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          // Redirect to login or refresh token here
          console.error('Unauthorized - please login again');
          localStorage.removeItem('authToken');
          // Optional: redirect to login page
          // window.location.href = '/login';
          break;

        case 403:
          // Forbidden - user does not have permission
          console.error('Forbidden - access denied');
          break;

        case 404:
          // Not found
          console.error('Resource not found');
          break;

        case 500:
          // Internal server error
          console.error('Server error - please try again later');
          break;

        default:
          console.error('Request failed', error.response.data);
      }
    } else if (error.request) {
      // No response received (network error, timeout, etc.)
      console.error('Network error - please check your connection');
    }

    return Promise.reject(error);
  }
);

// ------------------------------------------------------------
// EXPORT
// The configured Axios instance ready to use in your app.
// Import it in any component/service: 
//   import axiosClient from '@/api/axiosClient';
// ------------------------------------------------------------
export default axiosClient;