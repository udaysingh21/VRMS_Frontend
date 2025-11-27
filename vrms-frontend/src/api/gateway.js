import axios from "axios";

// API Gateway Configuration
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8085";
const USE_GATEWAY = import.meta.env.VITE_USE_API_GATEWAY === "true" || false;

console.log("🌐 API Gateway Configuration:", { 
  API_GATEWAY_URL, 
  USE_GATEWAY,
  mode: USE_GATEWAY ? "API Gateway" : "Direct Services"
});

// API Gateway Service - Single entry point
export const gatewayApi = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API Gateway
gatewayApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    // Don't add Authorization header for login and register endpoints
    const isAuthEndpoint = config.url?.includes('/login') || config.url?.includes('/register');
    
    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 Gateway API Call: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
gatewayApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Service-specific API functions using Gateway
export const gatewayServices = {
  // User Service APIs
  users: {
    register: (userData) => gatewayApi.post('/api/users/register/volunteer', userData),
    registerNGO: (ngoData) => gatewayApi.post('/api/users/register/ngo', ngoData),
    registerCorporate: (corpData) => gatewayApi.post('/api/users/register/corporate', corpData),
    login: (credentials) => gatewayApi.post('/api/users/login', credentials),
    refreshToken: () => gatewayApi.post('/api/users/refresh-token'),
    getAll: (params) => gatewayApi.get('/api/users/', { params }),
    getVolunteers: (params) => gatewayApi.get('/api/users/volunteers', { params }),
    getNGOs: (params) => gatewayApi.get('/api/users/ngos', { params }),
    getById: (id) => gatewayApi.get(`/api/users/${id}`),
    delete: (id) => gatewayApi.delete(`/api/users/${id}`)
  },

  // NGO Posting Service APIs
  postings: {
    getAll: (params) => gatewayApi.get('/api/postings/', { params }),
    create: (postingData) => gatewayApi.post('/api/postings/', postingData),
    getById: (id) => gatewayApi.get(`/api/postings/${id}`),
    update: (id, postingData) => gatewayApi.put(`/api/postings/${id}`, postingData),
    delete: (id) => gatewayApi.delete(`/api/postings/${id}`),
    getByCategory: (category) => gatewayApi.get(`/api/postings/category/${category}`),
    search: (query) => gatewayApi.get('/api/postings/search', { params: { q: query } })
  },

  // Matching Service APIs
  matches: {
    getForVolunteer: (volunteerId) => gatewayApi.get(`/api/matches/volunteer/${volunteerId}`),
    getRecommendations: (volunteerId) => gatewayApi.get(`/api/matches/recommendations/${volunteerId}`),
    calculateMatch: (volunteerId, postingId) => gatewayApi.get(`/api/matches/calculate/${volunteerId}/${postingId}`)
  },

  // Analytics Service APIs
  analytics: {
    getDashboard: () => gatewayApi.get('/api/analytics/dashboard'),
    getVolunteerStats: () => gatewayApi.get('/api/analytics/volunteers/stats'),
    getPostingStats: () => gatewayApi.get('/api/analytics/postings/stats'),
    getMatchingStats: () => gatewayApi.get('/api/analytics/matching/stats')
  }
};

export default gatewayApi;