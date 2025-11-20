import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import api from "../api/api";
import ngoService from "../api/ngoService";

export default function NGODashboard() {
  const navigate = useNavigate();
  const { ngoId } = useParams();
  const [ngoProfile, setNgoProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Load opportunities from localStorage instead of hardcoded data
  const [opportunities, setOpportunities] = useState([]);

  const [applications] = useState([
    { id: 1, volunteer: "John Doe", opportunity: "Beach Cleanup", status: "Approved", date: "2025-11-20" },
    { id: 2, volunteer: "Jane Smith", opportunity: "Food Drive", status: "Pending", date: "2025-11-22" },
  ]);

  useEffect(() => {
    fetchNgoProfile();
    loadOpportunities();
    
    // Refresh opportunities when returning to this page
    const handleFocus = async () => {
      await loadOpportunities();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [ngoId]); // Add ngoId as dependency

  const loadOpportunities = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      // Get NGO ID from JWT token
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId || payload.sub || payload.id;
      
      // Use NGO ID from URL params or fall back to token userId
      const targetNgoId = ngoId || userId;
      
      console.log("🔍 Loading opportunities for NGO dashboard:", targetNgoId);
      
      const response = await ngoService.get(`/postings/ngo/${targetNgoId}`);
      
      console.log("✅ Opportunities loaded for dashboard:", response.data);
      
      // Handle both array response or paginated response
      const opportunitiesData = Array.isArray(response.data) ? response.data : response.data.content || [];
      
      setOpportunities(opportunitiesData);
    } catch (error) {
      console.error("❌ Error loading opportunities for dashboard:", error);
      // Set empty array on error to show "No opportunities yet" message
      setOpportunities([]);
    }
  };

  const fetchNgoProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Decode token to get user ID
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("🔍 JWT Payload:", payload);
      
      const userId = payload.userId || payload.sub || payload.id;
      
      // Use NGO ID from URL params or fall back to token userId
      const targetNgoId = ngoId || userId;
      
      console.log("Fetching NGO profile for ID:", targetNgoId);
      console.log("Using token:", token.substring(0, 50) + "...");
      
      const response = await api.get(`/users/ngos/${targetNgoId}`);
      console.log("NGO Profile loaded:", response.data);
      console.log("Phone from API:", response.data.phone);
      console.log("Address from API:", response.data.address);
      
      setNgoProfile(response.data);
      
      // If no NGO ID in URL, redirect to include it
      if (!ngoId && userId) {
        navigate(`/ngo-dashboard/${userId}`, { replace: true });
      }
    } catch (error) {
      console.error("Error fetching NGO profile:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      if (error.response?.status === 401) {
        console.log("Unauthorized - clearing token and redirecting to login");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      } else if (error.response?.status === 403) {
        // NGO can only view its own profile
        console.error("Access denied: NGO can only view its own profile");
        alert("Access denied: You can only view your own profile");
        navigate("/login");
      } else {
        // For other errors, still show them but don't redirect
        alert("Failed to load profile: " + (error.response?.data?.message || error.message));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your NGO profile? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Get user ID from token
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId || payload.sub || payload.id;
      
      console.log("🗑️ Deleting NGO profile for user ID:", userId);
      
      // Use the correct API endpoint with user ID
      await api.delete(`/users/${userId}`);
      
      showToastMessage("Profile deleted successfully!", "success");
      setTimeout(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error deleting profile:", error);
      showToastMessage(
        error.response?.data?.message || "Failed to delete profile",
        "error"
      );
    }
  };

  if (isLoading && !ngoProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading NGO dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl -z-10"></div>

      <Navbar />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
              toastType === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>



      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
                🏢
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-1">
                  Welcome, {ngoProfile?.name || 'NGO'}! 🌟
                </h1>
                <p className="text-gray-600">Manage your organization and connect with volunteers</p>
              </div>
            </div>
          </div>
          <div className="space-x-3">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              🚪 Logout
            </button>
          </div>
        </motion.div>

        {/* NGO Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl"
          >
            <div className="text-3xl mb-4">🏢</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Organization Details</h3>
            <p className="text-gray-600 text-sm mb-4">Your NGO information</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">{ngoProfile?.name || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{ngoProfile?.email || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Founded:</span>
                <span className="font-medium">{ngoProfile?.foundedYear || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sector:</span>
                <span className="font-medium">{ngoProfile?.sector || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Registration:</span>
                <span className="font-medium">{ngoProfile?.registrationNumber || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium">{ngoProfile?.phone || 'Not provided'}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl"
          >
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mission & Contact</h3>
            <p className="text-gray-600 text-sm mb-4">Organization mission and reach</p>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 text-sm">Mission:</span>
                <div className="mt-1">
                  <span className="text-sm font-medium">
                    {ngoProfile?.missionStatement 
                      ? `${ngoProfile.missionStatement.substring(0, 80)}${ngoProfile.missionStatement.length > 80 ? "..." : ""}`
                      : "Not provided"}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Website:</span>
                <div className="mt-1">
                  <span className="text-sm font-medium">
                    {ngoProfile?.websiteUrl 
                      ? <a href={ngoProfile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                          {ngoProfile.websiteUrl.replace(/^https?:\/\//, '')}
                        </a>
                      : "Not provided"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl"
          >
            <div className="text-3xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Location & Status</h3>
            <p className="text-gray-600 text-sm mb-4">Address and verification status</p>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 text-sm">Address:</span>
                <div className="mt-1">
                  <span className="text-sm font-medium">
                    {ngoProfile?.address 
                      ? `${ngoProfile.address.substring(0, 50)}${ngoProfile.address.length > 50 ? "..." : ""}`
                      : "Not provided"}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Status:</span>
                <div className="mt-1">
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    ngoProfile?.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                    ngoProfile?.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {ngoProfile?.verificationStatus || 'pending'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate("/manage-opportunities")}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer"
          >
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-2xl font-bold mb-3">Manage Opportunities</h3>
            <p className="text-green-100 mb-4">
              Create and manage volunteer opportunities for your organization
            </p>
            <div className="space-y-2">
              {opportunities.length > 0 ? (
                opportunities.slice(0, 2).map(opportunity => (
                  <div key={opportunity.id} className="bg-white/20 rounded-lg p-2 text-sm">
                    <div className="font-medium">{opportunity.title}</div>
                    <div className="text-green-100 text-xs">{opportunity.volunteersNeeded} volunteers needed • {opportunity.status}</div>
                  </div>
                ))
              ) : (
                <div className="bg-white/20 rounded-lg p-2 text-sm">
                  <div className="font-medium">No opportunities yet</div>
                  <div className="text-green-100 text-xs">Click to create your first opportunity</div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer"
          >
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-2xl font-bold mb-3">Volunteer Applications</h3>
            <p className="text-blue-100 mb-4">
              Review and manage volunteer applications for your opportunities
            </p>
            <div className="space-y-2">
              {applications.slice(0, 2).map(app => (
                <div key={app.id} className="bg-white/20 rounded-lg p-2 text-sm">
                  <div className="font-medium">{app.volunteer}</div>
                  <div className="text-blue-100 text-xs">{app.status} • {app.date}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold mb-3">Analytics & Reports</h3>
            <p className="text-purple-100 mb-4">
              Track your organization's impact and volunteer engagement
            </p>
            <div className="space-y-2">
              <div className="bg-white/20 rounded-lg p-2 text-sm">
                <div className="font-medium">Total Volunteers: 45</div>
                <div className="text-purple-100 text-xs">Active this month</div>
              </div>
              <div className="bg-white/20 rounded-lg p-2 text-sm">
                <div className="font-medium">Opportunities: 8</div>
                <div className="text-purple-100 text-xs">Currently available</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Delete Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
        >
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-800 mb-2">Danger Zone</h3>
          <p className="text-red-600 mb-6">
            Permanently delete your NGO profile and all associated data. This action cannot be undone.
          </p>
          <button
            onClick={handleDeleteProfile}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg transition-colors font-medium inline-flex items-center gap-2"
          >
            🗑️ Delete NGO Profile
          </button>
        </motion.div>
      </main>
    </div>
  );
}
