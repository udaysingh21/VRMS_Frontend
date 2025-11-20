import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

console.log("🔧 API Configuration:", { API_BASE_URL });

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // Removed to fix CORS issues
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    // Don't add Authorization header for login and register endpoints
    const isAuthEndpoint = config.url?.includes('/login') || config.url?.includes('/register');
    
    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
