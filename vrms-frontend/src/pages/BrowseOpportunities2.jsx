import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Tag, MapPin, Calendar, Users, Clock,
  Mail, Phone, X, CheckCircle, AlertCircle
} from 'lucide-react';
import ngoService from '../api/ngoService';
import { matchingService } from '../api/api';

// Helper function to decode JWT token
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

const BrowseOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ pincode: '', domain: '', date: '' });
  const [registrationLoading, setRegistrationLoading] = useState(null);
  const [notification, setNotification] = useState(null);
  const [registeredOpportunities, setRegisteredOpportunities] = useState(new Set());

  const domains = [
    'Education', 'Environment', 'Healthcare', 'Community Development',
    'Animal Welfare', 'Disaster Relief', 'Youth Development',
    'Senior Care', 'Technology for Good', 'Arts & Culture',
    'Sports & Recreation', 'Human Rights'
  ];

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await ngoService.get('/postings');
        const data = Array.isArray(response.data) ? response.data : response.data.content || [];
        setOpportunities(data);
        setFilteredOpportunities(data);
      } catch (err) {
        console.error("Failed to load opportunities:", err);
        setError("Failed to load opportunities. Please try again later.");
        setOpportunities([]);
        setFilteredOpportunities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const hasAllFilters = filters.pincode && filters.domain && filters.date;
      const token = localStorage.getItem('access_token');

      if (hasAllFilters) {
        if (!token) {
          setError("Please login to get personalized recommendations.");
          setFilteredOpportunities([]);
          return;
        }

        const decodedToken = decodeJWT(token);
        const volunteerId = decodedToken?.userId || decodedToken?.user_id;
        if (!volunteerId) {
          setError("Invalid session. Please login again.");
          setFilteredOpportunities([]);
          return;
        }

        const params = new URLSearchParams();
        if (filters.pincode) params.append('location', filters.pincode);
        if (filters.domain) params.append('domain', filters.domain);
        if (filters.date) params.append('date', filters.date);

        const endpoint = `/matching/recommend/${volunteerId}?${params.toString()}`;
        const response = await matchingService.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const recommendedData = Array.isArray(response.data) ? response.data : [];
        setFilteredOpportunities(recommendedData);

      } else {
        let endpoint = '/postings';
        if (filters.domain && !filters.pincode && !filters.date) {
          endpoint = `/postings/domain/${encodeURIComponent(filters.domain)}`;
        }

        const response = await ngoService.get(endpoint);
        const opportunitiesData = Array.isArray(response.data) ? response.data : response.data.content || [];

        let filtered = opportunitiesData;
        if (filters.pincode) {
          filtered = filtered.filter(opp => opp.pincode && opp.pincode.toString().includes(filters.pincode));
        }
        if (filters.date) {
          filtered = filtered.filter(opp => {
            if (!opp.startDate) return false;
            const oppDate = new Date(opp.startDate);
            const filterDate = new Date(filters.date);
            return oppDate >= filterDate;
          });
        }
        setFilteredOpportunities(filtered);
        if (!filters.domain) setOpportunities(opportunitiesData);
      }
    } catch (err) {
      console.error("Search error:", err);
      const status = err.response?.status;
      switch (status) {
        case 401:
          setError("Session expired. Please login again to get recommendations.");
          localStorage.removeItem('access_token');
          break;
        case 404:
          setError("No opportunities found matching your criteria.");
          setFilteredOpportunities([]);
          break;
        default:
          setError("Failed to search opportunities. Please try again.");
      }
      if (!status) setError("Network error. Please check your connection.");
      setFilteredOpportunities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = async () => {
    setFilters({ pincode: '', domain: '', date: '' });
    try {
      setIsLoading(true);
      setError(null);
      const response = await ngoService.get('/postings');
      const opportunitiesData = Array.isArray(response.data) ? response.data : response.data.content || [];
      setOpportunities(opportunitiesData);
      setFilteredOpportunities(opportunitiesData);
    } catch (err) {
      console.error("Error clearing filters:", err);
      setError("Failed to load opportunities. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedOpportunity(null);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleApply = async (opportunityId) => {
    try {
      setRegistrationLoading(opportunityId);
      const token = localStorage.getItem('access_token');
      if (!token) {
        showNotification('Please login to register for opportunities', 'error');
        return;
      }
      const decodedToken = decodeJWT(token);
      const volunteerId = decodedToken?.userId || decodedToken?.user_id;
      if (!volunteerId) {
        showNotification('Invalid session. Please login again.', 'error');
        return;
      }
      if (registeredOpportunities.has(opportunityId)) {
        showNotification('You are already registered for this opportunity!', 'warning');
        return;
      }
      const response = await matchingService.post(
        `/matching/register/${volunteerId}/${opportunityId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRegisteredOpportunities(prev => new Set([...prev, opportunityId]));
      setFilteredOpportunities(prev => prev.map(opp =>
        opp.id === opportunityId
          ? { ...opp, volunteersSpotLeft: Math.max(0, (opp.volunteersSpotLeft ?? 0) - 1) }
          : opp
      ));
      setOpportunities(prev => prev.map(opp =>
        opp.id === opportunityId
          ? { ...opp, volunteersSpotLeft: Math.max(0, (opp.volunteersSpotLeft ?? 0) - 1) }
          : opp
      ));
      showNotification('Successfully registered for this opportunity! 🎉', 'success');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        const { status, data } = error.response;
        const err = data || {};
        const errorMessage = err.error || '';
        const fullMessage = err.message || '';
        if (status === 400) {
          if (
            errorMessage.toLowerCase().includes('already registered') ||
            fullMessage.toLowerCase().includes('already registered')
          ) {
            showNotification('You are already registered for this opportunity! ✅', 'warning');
            setRegisteredOpportunities(prev => new Set([...prev, opportunityId]));
          } else if (
            errorMessage.toLowerCase().includes('no slots') ||
            fullMessage.toLowerCase().includes('no slots')
          ) {
            showNotification('Sorry, no slots available for this opportunity. 😔', 'error');
          } else {
            showNotification(fullMessage || errorMessage || 'Registration failed. Please try again.', 'error');
          }
        } else if (status === 401) {
          showNotification('Session expired. Please login again. 🔐', 'error');
          localStorage.removeItem('access_token');
        } else if (status === 404) {
          showNotification('Opportunity or volunteer not found. 📝', 'error');
        } else {
          showNotification('Registration failed. Please try again later. ⚠️', 'error');
        }
      } else {
        showNotification('Network error. Please check your connection. 🌐', 'error');
      }
    } finally {
      setRegistrationLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* ... Your JSX UI code here, unchanged, omitted for brevity ... */}
    </div>
  );
};

export default BrowseOpportunities;
