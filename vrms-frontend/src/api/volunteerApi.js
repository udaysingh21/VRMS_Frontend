import axios from "axios";

// Volunteer Service API (port 8080) for profile updates
const VOLUNTEER_API_BASE_URL = "http://localhost:8080/api/v1";

const volunteerApi = axios.create({
  baseURL: VOLUNTEER_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

volunteerApi.interceptors.request.use(
  (config) => {
    console.log("🚀 Volunteer API Request:", {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      data: config.data,
    });
    
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Volunteer API Request Error:", error);
    return Promise.reject(error);
  }
);

volunteerApi.interceptors.response.use(
  (response) => {
    console.log("✅ Volunteer API Response:", {
      status: response.status,
      data: response.data,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    console.error("❌ Volunteer API Error:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export default volunteerApi;