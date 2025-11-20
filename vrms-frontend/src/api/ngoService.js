import axios from "axios";

// NGO Service API (port 8082) for opportunity management
const NGO_API_BASE_URL = "http://localhost:8082/api/v1";

console.log("NGO Service Configuration:", { NGO_API_BASE_URL });

const ngoService = axios.create({
  baseURL: NGO_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Prevent CORS preflight issues
});

// Add a simple connectivity test function
ngoService.testConnection = async () => {
  try {
    console.log("Testing NGO service connection...");
    const response = await axios.get(`${NGO_API_BASE_URL}/postings`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: false,
    });
    console.log("Connection test successful:", response.status);
    return true;
  } catch (error) {
    console.error("Connection test failed:", error);
    return false;
  }
};

ngoService.interceptors.request.use(
  (config) => {
    console.log("NGO Service API Request:", {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data,
    });
    
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Adding Authorization header with token:", token.substring(0, 20) + "...");
    }
    
    // Log final headers being sent
    console.log("Final request headers:", config.headers);
    
    return config;
  },
  (error) => {
    console.error("NGO Service API Request Error:", error);
    return Promise.reject(error);
  }
);

ngoService.interceptors.response.use(
  (response) => {
    console.log("NGO Service API Response:", {
      status: response.status,
      data: response.data,
      url: response.config.url,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    console.error("NGO Service API Error:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      headers: error.config?.headers,
      responseHeaders: error.response?.headers,
    });
    
    // Special handling for CORS errors
    if (error.message?.includes('CORS') || error.response?.status === 0) {
      console.error("CORS Error detected. Check backend CORS configuration.");
    }
    
    return Promise.reject(error);
  }
);

export default ngoService;