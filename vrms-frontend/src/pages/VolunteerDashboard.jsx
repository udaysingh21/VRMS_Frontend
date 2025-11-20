import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api"; // User service (port 8082)
import volunteerApi from "../api/volunteerApi"; // Volunteer service (port 8080)

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const { volunteerId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Mock data for applications and activities
  const [applications] = useState([
    { id: 1, title: "Beach Cleanup Drive", organization: "Green Earth NGO", status: "Applied", date: "2025-11-20" },
    { id: 2, title: "Food Distribution", organization: "Helping Hands", status: "Confirmed", date: "2025-11-25" },
  ]);

  const [activityHistory] = useState([
    { id: 1, title: "Tree Plantation Drive", organization: "EcoWarriors", status: "Completed", date: "2025-10-15" },
    { id: 2, title: "Blood Donation Camp", organization: "Red Cross", status: "Completed", date: "2025-09-28" },
    { id: 3, title: "Teaching Kids", organization: "Education First", status: "Upcoming", date: "2025-12-05" },
  ]);

  // Fetch user profile from user service (port 8082)
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Decode JWT to get user ID
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId || payload.sub || payload.id;
      
      // Use volunteer ID from URL params or fall back to token userId
      const targetVolunteerId = volunteerId || userId;
      
      console.log("🔍 Fetching volunteer profile for ID:", targetVolunteerId);
      
      // Get volunteer profile from user service using specific volunteers endpoint
      const response = await api.get(`/users/volunteers/${targetVolunteerId}`);
      
      console.log("Volunteer profile loaded:", response.data);
      setUserProfile(response.data);
      
      // If no volunteer ID in URL, redirect to include it
      if (!volunteerId && userId) {
        navigate(`/volunteer-dashboard/${userId}`, { replace: true });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      } else if (error.response?.status === 403) {
        console.error("Access denied: Volunteer can only view its own profile");
        alert("Access denied: You can only view your own profile");
        navigate("/login");
      } else {
        showToastMessage("Error fetching profile data", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your volunteer profile? This action cannot be undone.")) {
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Get user ID from token
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId || payload.sub || payload.id;
      
      console.log("🗑️ Deleting volunteer profile for user ID:", userId);
      
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
    } finally {
      setIsLoading(false);
    }
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  if (isLoading && !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl -z-10"></div>

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

      {/* Main Dashboard Content - Added proper spacing from navbar */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
                👤
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-1">
                  Welcome, {userProfile?.name?.split(' ')[0] || 'Volunteer'}! 👋
                </h1>
                <p className="text-gray-600">Ready to make a difference in your community?</p>
              </div>
            </div>
          </div>
          <div className="space-x-3">
            <button
              onClick={handleDeleteProfile}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              🗑️ Delete Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              🚪 Logout
            </button>
          </div>
        </motion.div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl"
          >
            <div className="text-3xl mb-4">👤</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Personal Details</h3>
            <p className="text-gray-600 text-sm mb-4">Your basic information</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">{userProfile?.name || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{userProfile?.email || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date of Birth:</span>
                <span className="font-medium">{userProfile?.dob ? new Date(userProfile.dob).toLocaleDateString() : 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Gender:</span>
                <span className="font-medium">{userProfile?.gender || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium">{userProfile?.phone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Address:</span>
                <span className="font-medium">{userProfile?.address ? `${userProfile.address.substring(0, 20)}...` : 'Not provided'}</span>
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
            <h3 className="text-xl font-bold text-gray-800 mb-2">Skills & Interests</h3>
            <p className="text-gray-600 text-sm mb-4">Your capabilities and passions</p>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 text-sm">Skills:</span>
                <div className="mt-1">
                  <span className="text-sm font-medium">
                    {Array.isArray(userProfile?.skills) 
                      ? userProfile.skills.slice(0, 3).join(", ") + (userProfile.skills.length > 3 ? "..." : "")
                      : userProfile?.skills ? `${userProfile.skills.substring(0, 40)}${userProfile.skills.length > 40 ? "..." : ""}`
                      : "Not provided"}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Interests:</span>
                <div className="mt-1">
                  <span className="text-sm font-medium">
                    {Array.isArray(userProfile?.interests) 
                      ? userProfile.interests.slice(0, 3).join(", ") + (userProfile.interests.length > 3 ? "..." : "")
                      : userProfile?.interests ? `${userProfile.interests.substring(0, 40)}${userProfile.interests.length > 40 ? "..." : ""}`
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
            <div className="text-3xl mb-4">⏰</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Availability & Languages</h3>
            <p className="text-gray-600 text-sm mb-4">When you're available and languages you speak</p>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 text-sm">Availability:</span>
                <div className="mt-1">
                  <span className="text-sm font-medium">
                    {userProfile?.availability || "Not provided"}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Languages:</span>
                <div className="mt-1">
                  <span className="text-sm font-medium">
                    {Array.isArray(userProfile?.languages) 
                      ? userProfile.languages.join(", ")
                      : userProfile?.languages || "Not provided"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate("/opportunities")}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white cursor-pointer shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-3">Browse Opportunities</h3>
            <p className="text-blue-100 mb-4">
              Discover volunteer opportunities that match your skills and interests
            </p>
            <div className="flex items-center text-blue-100">
              <span>Explore now</span>
              <span className="ml-2">→</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer"
          >
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-2xl font-bold mb-3">My Applications</h3>
            <p className="text-green-100 mb-4">
              Track your volunteer applications and manage commitments
            </p>
            <div className="space-y-2">
              {applications.slice(0, 2).map(app => (
                <div key={app.id} className="bg-white/20 rounded-lg p-2 text-sm">
                  <div className="font-medium">{app.title}</div>
                  <div className="text-green-100 text-xs">{app.status} • {app.date}</div>
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
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-2xl font-bold mb-3">Activity History</h3>
            <p className="text-purple-100 mb-4">
              View your volunteer journey and track your impact
            </p>
            <div className="space-y-2">
              {activityHistory.slice(0, 2).map(activity => (
                <div key={activity.id} className="bg-white/20 rounded-lg p-2 text-sm">
                  <div className="font-medium">{activity.title}</div>
                  <div className="text-purple-100 text-xs">{activity.status} • {activity.date}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
