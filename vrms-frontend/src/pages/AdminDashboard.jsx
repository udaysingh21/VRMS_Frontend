import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: "", user_id: "" });

  useEffect(() => {
    // Check if user is admin before fetching data
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/login");
      return;
    }

    // Decode token to check user role (basic check)
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      if (tokenPayload.role !== "ADMIN") {
        console.log("User is not admin, redirecting to login");
        navigate("/login");
        return;
      }
      
      // Set user info from token
      setUserInfo({
        email: tokenPayload.email || "admin@example.com",
        user_id: tokenPayload.user_id || "1"
      });
      
    } catch (error) {
      console.error("Invalid token format:", error);
      navigate("/login");
      return;
    }

    fetchAnalytics();
  }, [navigate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No access token found");
        navigate("/login");
        return;
      }

      console.log("Fetching analytics with token...");
      const response = await fetch("http://localhost:8000/api/v1/admin/analytics/user-insights", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Analytics data received:", data);
        setAnalytics(data || []);
        setError(false);
      } else {
        console.error("API response error:", response.status, response.statusText);
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
          return;
        }
        throw new Error(`API failed with status: ${response.status}`);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError(true);
      // Fallback data
      setAnalytics([
        { role: "ADMIN", count: 1 },
        { role: "VOLUNTEER", count: 3 },
        { role: "NGO", count: 3 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  // Calculate totals
  const totalUsers = analytics.reduce((sum, item) => sum + item.count, 0);
  const adminCount = analytics.find(item => item.role === "ADMIN")?.count || 0;
  const volunteerCount = analytics.find(item => item.role === "VOLUNTEER")?.count || 0;
  const ngoCount = analytics.find(item => item.role === "NGO")?.count || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🧑‍💼 Welcome Admin!
            </h1>
            <p className="text-gray-600">VRMS Analytics Dashboard</p>
            {userInfo.email && (
              <p className="text-sm text-gray-500 mt-1">
                Logged in as: {userInfo.email} (ID: {userInfo.user_id})
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            🚪 Logout
          </button>
        </div>

        {/* Centered User Analytics */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  📊 User Analytics
                </h2>
                {loading && <p className="text-blue-500">Loading data...</p>}
                {error && <p className="text-yellow-600">Using demo data (API unavailable)</p>}
                {!loading && !error && <p className="text-green-600">Live data from analytics API</p>}
              </div>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold">{totalUsers}</div>
                  <div className="text-blue-100 mt-1">Total Users</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold">{volunteerCount}</div>
                  <div className="text-green-100 mt-1">Volunteers</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold">{ngoCount}</div>
                  <div className="text-purple-100 mt-1">NGOs</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold">{adminCount}</div>
                  <div className="text-orange-100 mt-1">Admins</div>
                </div>
              </div>

              {/* Role Distribution */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 text-center mb-6">Role Distribution</h3>
                {analytics.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">
                        {item.role === "ADMIN" ? "🧑‍💼" :
                         item.role === "VOLUNTEER" ? "🙋‍♀️" :
                         item.role === "NGO" ? "🏢" : "👤"}
                      </span>
                      <span className="font-semibold text-lg text-gray-800">{item.role}</span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold text-lg">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* Refresh Button */}
              <div className="text-center mt-8">
                <button
                  onClick={fetchAnalytics}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  disabled={loading}
                >
                  {loading ? "🔄 Loading..." : "🔄 Refresh Data"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
