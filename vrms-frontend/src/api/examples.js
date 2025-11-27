// Example: How to update your components to use the API Gateway

// OLD WAY (Direct service calls):
// import api from '../api/api.js';
// import { ngoService } from '../api/api.js';
// 
// const registerVolunteerOld = async (userData) => {
//   const response = await api.post('/users/register/volunteer', userData);
//   return response.data;
// };
// 
// const getPostingsOld = async () => {
//   const response = await ngoService.get('/postings');
//   return response.data;
// };

// NEW WAY (Using API Gateway):
import { gatewayServices } from '../api/gateway.js';

// Register volunteer
const registerVolunteer = async (userData) => {
  const response = await gatewayServices.users.register(userData);
  return response.data;
};

// Get NGO postings
const getPostings = async () => {
  const response = await gatewayServices.postings.getAll();
  return response.data;
};

// Login example
const login = async (credentials) => {
  try {
    const response = await gatewayServices.users.login(credentials);
    localStorage.setItem('access_token', response.data.accessToken);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Get volunteer matches
const getMatches = async (volunteerId) => {
  const response = await gatewayServices.matches.getForVolunteer(volunteerId);
  return response.data;
};

// Get analytics dashboard
const getDashboard = async () => {
  const response = await gatewayServices.analytics.getDashboard();
  return response.data;
};

export {
  registerVolunteer,
  getPostings,
  login,
  getMatches,
  getDashboard
};