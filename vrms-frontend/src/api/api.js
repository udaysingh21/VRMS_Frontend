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

// NGO Service (Port 8082)
export const ngoService = axios.create({
  baseURL: "http://localhost:8082/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

ngoService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Analytics Service (Port 8000)
export const analyticsService = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

analyticsService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Matching Service (Port 8081)
export const matchingService = axios.create({
  baseURL: "http://localhost:8081/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

matchingService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
