import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, MapPin, Tag, Users, Clock, Mail, Phone, X } from 'lucide-react';
import ngoService from '../api/ngoService';

const BrowseOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    pincode: '',
    domain: '',
    date: ''
  });

  // Domain options (same as NGO creation form)
  const domains = [
    'Education',
    'Environment',
    'Healthcare',
    'Community Development',
    'Animal Welfare',
    'Disaster Relief',
    'Youth Development',
    'Senior Care',
    'Technology for Good',
    'Arts & Culture',
    'Sports & Recreation',
    'Human Rights'
  ];

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("🔍 Fetching opportunities from NGO service...");
        const response = await ngoService.get('/postings');
        
        console.log("✅ Opportunities loaded:", response.data);
        
        // Handle both array response or paginated response
        const opportunitiesData = Array.isArray(response.data) ? response.data : response.data.content || [];
        
        setOpportunities(opportunitiesData);
        setFilteredOpportunities(opportunitiesData);
      } catch (error) {
        console.error("❌ Error fetching opportunities:", error);
        setError("Failed to load opportunities. Please try again later.");
        
        // Fallback to empty array
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
      
      let endpoint = '/postings';
      let filteredData = [];
      
      // If domain filter is selected, use domain-specific endpoint
      if (filters.domain) {
        console.log(`🔍 Fetching opportunities for domain: ${filters.domain}`);
        endpoint = `/postings/domain/${encodeURIComponent(filters.domain)}`;
      } else {
        console.log("🔍 Fetching all opportunities...");
      }
      
      const response = await ngoService.get(endpoint);
      console.log(`✅ Opportunities loaded from ${endpoint}:`, response.data);
      
      // Handle both array response or paginated response
      const opportunitiesData = Array.isArray(response.data) ? response.data : response.data.content || [];
      
      // Apply remaining filters on the client side (pincode and date)
      let filtered = opportunitiesData;

      if (filters.pincode) {
        filtered = filtered.filter(opp => 
          opp.pincode && opp.pincode.toString().includes(filters.pincode)
        );
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
      
      // Update main opportunities list if no domain filter (to maintain state)
      if (!filters.domain) {
        setOpportunities(opportunitiesData);
      }
      
    } catch (error) {
      console.error("❌ Error searching opportunities:", error);
      setError("Failed to search opportunities. Please try again.");
      setFilteredOpportunities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = async () => {
    // Reset filters
    setFilters({
      pincode: '',
      domain: '',
      date: ''
    });
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("🔄 Clearing filters and fetching all opportunities...");
      const response = await ngoService.get('/postings');
      
      console.log("✅ All opportunities loaded:", response.data);
      
      // Handle both array response or paginated response
      const opportunitiesData = Array.isArray(response.data) ? response.data : response.data.content || [];
      
      setOpportunities(opportunitiesData);
      setFilteredOpportunities(opportunitiesData);
    } catch (error) {
      console.error("❌ Error clearing filters:", error);
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

  const handleApply = (opportunityId) => {
    // TODO: Implement apply functionality with API
    alert('Apply functionality will be implemented with API integration');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Browse Opportunities</h1>
          <p className="text-gray-600">Find volunteer opportunities that match your interests and availability</p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex flex-wrap gap-4 items-end">
            {/* Pincode Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Pincode
              </label>
              <input
                type="text"
                value={filters.pincode}
                onChange={(e) => handleFilterChange('pincode', e.target.value)}
                placeholder="Enter pincode"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Domain Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline w-4 h-4 mr-1" />
                Domain
              </label>
              <select
                value={filters.domain}
                onChange={(e) => handleFilterChange('domain', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Domains</option>
                {domains.map((domain) => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                {isLoading ? 'Searching...' : 'Search'}
              </button>
              
              <button
                onClick={handleClearFilters}
                disabled={isLoading}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading opportunities...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-center"
          >
            <div className="text-red-600 text-lg font-medium mb-2">⚠️ Error Loading Opportunities</div>
            <p className="text-red-600">{error}</p>
          </motion.div>
        )}

        {/* Opportunities Grid */}
        {!isLoading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-6"
        >
          {filteredOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No opportunities found matching your criteria.</p>
            </div>
          ) : (
            filteredOpportunities.map((opportunity) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 
                      className="text-xl font-semibold text-blue-600 mb-2 cursor-pointer hover:text-blue-800 transition-colors"
                      onClick={() => handleViewDetails(opportunity)}
                    >
                      {opportunity.title}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{opportunity.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {opportunity.domain}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {opportunity.city}, {opportunity.state}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {opportunity.volunteersSpotLeft} spots left
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {opportunity.effortRequired}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <button
                      onClick={() => handleApply(opportunity.id)}
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
        )}
      </div>

      {/* Opportunity Details Popup */}
      {showDetails && selectedOpportunity && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleCloseDetails}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedOpportunity.title}</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Description</h3>
                    <p className="text-gray-600">{selectedOpportunity.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Domain</h3>
                    <p className="text-gray-600">{selectedOpportunity.domain}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Location</h3>
                    <p className="text-gray-600">
                      {selectedOpportunity.location}<br />
                      {selectedOpportunity.city}, {selectedOpportunity.state}<br />
                      {selectedOpportunity.country} - {selectedOpportunity.pincode}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Effort Required</h3>
                    <p className="text-gray-600">{selectedOpportunity.effortRequired}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Volunteers Needed</h3>
                    <p className="text-gray-600">{selectedOpportunity.volunteersNeeded} total</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Spots Available</h3>
                    <p className="text-gray-600">{selectedOpportunity.volunteersSpotLeft} spots left</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Duration</h3>
                    <p className="text-gray-600">
                      {new Date(selectedOpportunity.startDate).toLocaleDateString()} - {new Date(selectedOpportunity.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Contact Information</h3>
                    <div className="space-y-2">
                      <p className="text-gray-600 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {selectedOpportunity.contactEmail}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {selectedOpportunity.contactPhone}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Status</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedOpportunity.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedOpportunity.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={handleCloseDetails}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleApply(selectedOpportunity.id);
                    handleCloseDetails();
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Apply for this Opportunity
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BrowseOpportunities;