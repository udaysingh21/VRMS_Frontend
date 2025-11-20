import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function NGODashboard() {
  const navigate = useNavigate();
  const [ngoProfile, setNgoProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editForm, setEditForm] = useState({});
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
    const handleFocus = () => {
      loadOpportunities();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadOpportunities = () => {
    const savedOpportunities = JSON.parse(localStorage.getItem("ngoOpportunities") || "[]");
    setOpportunities(savedOpportunities);
  };

  const fetchNgoProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Decode token to get email
      const payload = JSON.parse(atob(token.split(".")[1]));
      const ngoEmail = payload.sub;

      console.log("🔍 Fetching NGO profile for:", ngoEmail);
      const response = await api.get(`/users/profile/${ngoEmail}`);
      console.log("✅ NGO Profile loaded:", response.data);
      
      setNgoProfile(response.data);
    } catch (error) {
      console.error("❌ Error fetching NGO profile:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
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

  const openProfileModal = () => {
    setShowProfileModal(true);
    // Pre-populate form with current NGO data
    setEditForm({
      ...ngoProfile,
      foundedYear: ngoProfile?.foundedYear || ""
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      const updateData = { ...editForm };
      
      // Convert foundedYear to number if provided
      if (updateData.foundedYear) {
        updateData.foundedYear = parseInt(updateData.foundedYear);
      }
      
      // Remove undefined fields to prevent API issues
      Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
      );
      
      console.log('Updating NGO profile with data:', updateData);
      
      // Update profile through user service
      const response = await api.put("/users/profile", updateData);
      
      setNgoProfile(response.data);
      setShowProfileModal(false);
      showToastMessage("Profile updated successfully!", "success");
      
      // Refresh profile data
      await fetchNgoProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      showToastMessage(
        error.response?.data?.message || "Failed to update profile",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your NGO profile? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete("/users/profile");
      showToastMessage("Profile deleted successfully!", "success");
      setTimeout(() => {
        localStorage.removeItem("access_token");
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

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">NGO Profile Details</h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* NGO Profile Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                    <input
                      type="text"
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editForm.email || ""}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone || ""}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                    <input
                      type="text"
                      value={editForm.registrationNumber || ""}
                      onChange={(e) => setEditForm({ ...editForm, registrationNumber: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
                    <input
                      type="number"
                      value={editForm.foundedYear || ""}
                      onChange={(e) => setEditForm({ ...editForm, foundedYear: e.target.value })}
                      min="1800"
                      max={new Date().getFullYear()}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                    <input
                      type="text"
                      value={editForm.sector || ""}
                      onChange={(e) => setEditForm({ ...editForm, sector: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="e.g., Education, Environment, Healthcare"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={editForm.address || ""}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                    <input
                      type="url"
                      value={editForm.websiteUrl || ""}
                      onChange={(e) => setEditForm({ ...editForm, websiteUrl: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="https://example.org"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
                    <textarea
                      value={editForm.missionStatement || ""}
                      onChange={(e) => setEditForm({ ...editForm, missionStatement: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="Describe your organization's mission and goals"
                    />
                  </div>
                </div>

                <div className="flex justify-center space-x-4 pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteProfile}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </motion.div>
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
              <button
                onClick={openProfileModal}
                className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                title="View Profile"
              >
                🏢
              </button>
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
      </main>
    </div>
  );
}
