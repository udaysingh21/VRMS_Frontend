import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Building, FileText, TrendingUp, ArrowLeft, BarChart3, PieChart, Activity, RefreshCw, MapPin, Download } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/api";
import ngoService from "../api/ngoService";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVolunteers: 0,
    totalNGOs: 0,
    totalOpportunities: 0,
    activeOpportunities: 0,
    completedOpportunities: 0
  });
  const [domainStats, setDomainStats] = useState([]);
  const [cityStats, setCityStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [volunteersData, setVolunteersData] = useState([]);
  const [ngosData, setNgosData] = useState([]);
  const [opportunitiesData, setOpportunitiesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVolunteers, setShowVolunteers] = useState(false);
  const [showNGOs, setShowNGOs] = useState(false);
  const [showOpportunities, setShowOpportunities] = useState(false);

  useEffect(() => {
    // Check if user is admin before loading dashboard
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/login");
      return;
    }

    // Decode token to check user role
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      if (tokenPayload.role !== "ADMIN") {
        console.log("User is not admin, access denied");
        navigate("/login");
        return;
      }
      
      // If admin, load dashboard data
      loadDashboardData();
    } catch (error) {
      console.error("Invalid token format:", error);
      navigate("/login");
      return;
    }
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check token validity first
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.log("❌ No token found, redirecting to login");
        navigate("/login");
        return;
      }

      // Check if token is expired
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (tokenPayload.exp && tokenPayload.exp < currentTime) {
          console.log("🔒 Token expired, redirecting to login...");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
          return;
        }
      } catch (e) {
        console.log("❌ Invalid token format, redirecting to login...");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
        return;
      }

      console.log("🔄 Loading admin dashboard data...");
      console.log("📍 API Base URLs:", {
        userService: "http://localhost:8080/api/v1",
        ngoService: "http://localhost:8082/api/v1"
      });

      // Check if services are running
      console.log("🔍 Checking service availability...");

      // Parallel API calls for better performance
      const [usersResponse, volunteersResponse, ngosResponse, postingsResponse] = await Promise.all([
        api.get('/users').catch(err => {
          console.error("❌ Failed to fetch users:", err.response?.status, err.response?.data || err.message);
          if (err.response?.status === 401 || err.message.includes('JWT expired')) {
            console.log("🔒 Token expired, redirecting to login...");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/login");
            return { data: [] };
          }
          setError(`User Service (8080) unavailable: ${err.message}`);
          return { data: [] };
        }),
        api.get('/users/volunteers').catch(err => {
          console.error("❌ Failed to fetch volunteers:", err.response?.status, err.response?.data || err.message);
          return { data: [] };
        }),
        api.get('/users/ngos').catch(err => {
          console.error("❌ Failed to fetch NGOs:", err.response?.status, err.response?.data || err.message);
          return { data: [] };
        }),
        ngoService.get('/postings').catch(err => {
          console.error("❌ Failed to fetch postings:", err.response?.status, err.response?.data || err.message);
          if (!error) setError(`NGO Service (8082) unavailable: ${err.message}`);
          return { data: [] };
        })
      ]);

      console.log("📊 Raw API responses:", {
        users: usersResponse.data?.length || 0,
        volunteers: volunteersResponse.data?.length || 0,
        ngos: ngosResponse.data?.length || 0,
        postings: postingsResponse.data?.length || 0
      });

      // Process users data
      const allUsers = Array.isArray(usersResponse.data) ? usersResponse.data : [];
      const volunteers = Array.isArray(volunteersResponse.data) ? volunteersResponse.data : [];
      const ngos = Array.isArray(ngosResponse.data) ? ngosResponse.data : [];
      
      // Process postings data - handle both direct array and paginated response
      const postingsData = Array.isArray(postingsResponse.data) ? postingsResponse.data : 
                          Array.isArray(postingsResponse.data?.content) ? postingsResponse.data.content : [];

      // Calculate basic stats
      const totalOpportunities = postingsData.length;
      const activeOpportunities = postingsData.filter(p => p.status === 'ACTIVE').length;
      const completedOpportunities = postingsData.filter(p => p.status === 'COMPLETED').length;

      setStats({
        totalUsers: allUsers.length,
        totalVolunteers: volunteers.length,
        totalNGOs: ngos.length,
        totalOpportunities: totalOpportunities,
        activeOpportunities: activeOpportunities,
        completedOpportunities: completedOpportunities
      });

      // Store user data for detailed views
      setVolunteersData(volunteers.map(v => ({
        id: v.id || v.user_id,
        name: v.name || `${v.first_name || ''} ${v.last_name || ''}`.trim() || 'N/A',
        email: v.email || 'N/A',
        address: v.address || 'N/A',
        phone: v.phone || 'N/A'
      })));

      setNgosData(ngos.map(n => ({
        id: n.id || n.user_id,
        organizationName: n.organization_name || n.name || 'N/A',
        email: n.email || 'N/A',
        address: n.address || 'N/A',
        phone: n.phone || 'N/A',
        domain: n.domain || 'N/A'
      })));

      // Store opportunities data for detailed view
      setOpportunitiesData(postingsData.map(p => ({
        id: p.id || p.posting_id,
        title: p.title || 'N/A',
        description: p.description || 'N/A',
        domain: p.domain || 'N/A',
        city: p.city || 'N/A',
        status: p.status || 'N/A',
        ngoId: p.ngo_id || p.ngoId || 'N/A',
        createdDate: p.created_date || p.createdAt || 'N/A'
      })));

      // Calculate domain statistics
      const domainCounts = {};
      postingsData.forEach(posting => {
        const domain = posting.domain || 'Other';
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
      });
      
      const domainStatsArray = Object.entries(domainCounts)
        .map(([domain, count]) => ({ 
          domain, 
          count, 
          percentage: totalOpportunities > 0 ? ((count / totalOpportunities) * 100).toFixed(1) : '0.0'
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 domains

      setDomainStats(domainStatsArray);

      // Calculate city statistics
      const cityCounts = {};
      postingsData.forEach(posting => {
        const city = posting.city || 'Unknown';
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      });
      
      const cityStatsArray = Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 cities

      setCityStats(cityStatsArray);

      // Generate recent activity based on real stats
      const activities = [
        { type: 'volunteer_registered', message: `${volunteers.length} volunteers registered`, color: 'green' },
        { type: 'opportunity_posted', message: `${activeOpportunities} active opportunities`, color: 'blue' },
        { type: 'ngo_registered', message: `${ngos.length} NGOs registered`, color: 'purple' },
        { type: 'opportunity_completed', message: `${completedOpportunities} opportunities completed`, color: 'orange' }
      ];

      setRecentActivity(activities);

      console.log("✅ Dashboard data loaded successfully:", {
        stats: {
          totalUsers: allUsers.length,
          totalVolunteers: volunteers.length,
          totalNGOs: ngos.length,
          totalOpportunities: totalOpportunities,
          activeOpportunities: activeOpportunities
        },
        domainStats: domainStatsArray,
        cityStats: cityStatsArray
      });

    } catch (error) {
      console.error("❌ Error loading dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'volunteer_registered': return 'bg-green-500';
      case 'opportunity_posted': return 'bg-blue-500';
      case 'ngo_registered': return 'bg-purple-500';
      case 'opportunity_completed': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const downloadCSV = (data, filename) => {
    if (data.length === 0) {
      alert('No data to download');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || 'N/A';
          // Escape commas and quotes in CSV
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">System overview and analytics</p>
            </div>
          </div>
          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Service Connection Error:</p>
            <p>{error}</p>
            {error.includes('expired') || error.includes('401') ? (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                <p className="font-medium">🔒 Authentication Issue Detected</p>
                <p className="text-sm mt-1">Your login session has expired. Please log in again.</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <div className="mt-2 text-sm">
                <p>Please check:</p>
                <ul className="list-disc ml-5">
                  <li>User Service is running on port 8080</li>
                  <li>NGO Service is running on port 8082</li>
                  <li>Services are accessible from browser</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : stats.totalUsers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">All registered users</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setShowVolunteers(!showVolunteers)}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Volunteers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : stats.totalVolunteers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Click to view list</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setShowNGOs(!showNGOs)}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active NGOs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : stats.totalNGOs.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Click to view list</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setShowOpportunities(!showOpportunities)}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : stats.totalOpportunities.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Click to view list</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Volunteers List */}
        {showVolunteers && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Volunteers ({volunteersData.length})</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadCSV(volunteersData, `volunteers_${new Date().toISOString().split('T')[0]}.csv`)}
                  className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  CSV
                </button>
                <button
                  onClick={() => setShowVolunteers(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {volunteersData.slice(0, 5).map((volunteer, index) => (
                  <div key={volunteer.id || index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{volunteer.name}</p>
                        <p className="text-xs text-gray-500">ID: {volunteer.id}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><span className="font-medium">Email:</span> {volunteer.email}</p>
                      <p><span className="font-medium">Address:</span> {volunteer.address}</p>
                      <p><span className="font-medium">Phone:</span> {volunteer.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
              {volunteersData.length > 5 && (
                <div className="text-center mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Showing 5 of {volunteersData.length} volunteers. 
                    <button 
                      onClick={() => downloadCSV(volunteersData, `volunteers_${new Date().toISOString().split('T')[0]}.csv`)}
                      className="text-green-600 hover:text-green-800 font-medium ml-1"
                    >
                      Download CSV for all data
                    </button>
                  </p>
                </div>
              )}
              {volunteersData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No volunteers found
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* NGOs List */}
        {showNGOs && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active NGOs ({ngosData.length})</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadCSV(ngosData, `ngos_${new Date().toISOString().split('T')[0]}.csv`)}
                  className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  CSV
                </button>
                <button
                  onClick={() => setShowNGOs(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ngosData.slice(0, 5).map((ngo, index) => (
                  <div key={ngo.id || index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <Building className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{ngo.organizationName}</p>
                        <p className="text-xs text-gray-500">ID: {ngo.id}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><span className="font-medium">Email:</span> {ngo.email}</p>
                      <p><span className="font-medium">Address:</span> {ngo.address}</p>
                      <p><span className="font-medium">Phone:</span> {ngo.phone}</p>
                      <p><span className="font-medium">Domain:</span> {ngo.domain}</p>
                    </div>
                  </div>
                ))}
              </div>
              {ngosData.length > 5 && (
                <div className="text-center mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Showing 5 of {ngosData.length} NGOs. 
                    <button 
                      onClick={() => downloadCSV(ngosData, `ngos_${new Date().toISOString().split('T')[0]}.csv`)}
                      className="text-purple-600 hover:text-purple-800 font-medium ml-1"
                    >
                      Download CSV for all data
                    </button>
                  </p>
                </div>
              )}
              {ngosData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No NGOs found
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Opportunities List */}
        {showOpportunities && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">All Opportunities ({opportunitiesData.length})</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadCSV(opportunitiesData, `opportunities_${new Date().toISOString().split('T')[0]}.csv`)}
                  className="flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  CSV
                </button>
                <button
                  onClick={() => setShowOpportunities(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {opportunitiesData.slice(0, 5).map((opportunity, index) => (
                  <div key={opportunity.id || index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                        <FileText className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm truncate">{opportunity.title}</p>
                        <p className="text-xs text-gray-500">ID: {opportunity.id}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        opportunity.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        opportunity.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {opportunity.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p className="truncate"><span className="font-medium">Description:</span> {opportunity.description}</p>
                      <p><span className="font-medium">Domain:</span> {opportunity.domain}</p>
                      <p><span className="font-medium">City:</span> {opportunity.city}</p>
                      <p><span className="font-medium">NGO ID:</span> {opportunity.ngoId}</p>
                      <p><span className="font-medium">Created:</span> {opportunity.createdDate}</p>
                    </div>
                  </div>
                ))}
              </div>
              {opportunitiesData.length > 5 && (
                <div className="text-center mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Showing 5 of {opportunitiesData.length} opportunities. 
                    <button 
                      onClick={() => downloadCSV(opportunitiesData, `opportunities_${new Date().toISOString().split('T')[0]}.csv`)}
                      className="text-orange-600 hover:text-orange-800 font-medium ml-1"
                    >
                      Download CSV for all data
                    </button>
                  </p>
                </div>
              )}
              {opportunitiesData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No opportunities found
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Domain Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Opportunity Domains</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : domainStats.length > 0 ? (
              <div className="space-y-4">
                {domainStats.map((item, index) => (
                  <div key={item.domain} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className={`w-3 h-3 rounded-full mr-3`}
                        style={{ 
                          backgroundColor: [
                            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
                          ][index % 5] 
                        }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{item.domain}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">{item.count}</span>
                      <span className="text-xs text-gray-500">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No domain data available
              </div>
            )}
          </motion.div>

          {/* Top Cities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Cities</h3>
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : cityStats.length > 0 ? (
              <div className="space-y-4">
                {cityStats.map((item, index) => (
                  <div key={item.city} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 mr-2">#{index + 1}</span>
                      <span className="text-sm font-medium text-gray-700">{item.city}</span>
                    </div>
                    <span className="text-sm text-gray-600">{item.count} opportunities</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No city data available
              </div>
            )}
          </motion.div>

          {/* Platform Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Platform Activity</h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Opportunities</span>
                <span className="text-lg font-semibold text-green-600">
                  {isLoading ? '...' : stats.activeOpportunities}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed Opportunities</span>
                <span className="text-lg font-semibold text-blue-600">
                  {isLoading ? '...' : stats.completedOpportunities}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Volunteer to NGO Ratio</span>
                <span className="text-lg font-semibold text-purple-600">
                  {isLoading ? '...' : stats.totalNGOs > 0 ? Math.round(stats.totalVolunteers / stats.totalNGOs) : 0}:1
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Opportunities per NGO</span>
                <span className="text-lg font-semibold text-orange-600">
                  {isLoading ? '...' : stats.totalNGOs > 0 ? Math.round(stats.totalOpportunities / stats.totalNGOs) : 0}
                </span>
              </div>
            </div>
          </motion.div>

          {/* System Statistics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">System Statistics</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-3 h-3 ${getActivityColor(activity.type)} rounded-full mr-3`}></div>
                  <span className="text-sm text-gray-600">{activity.message}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
