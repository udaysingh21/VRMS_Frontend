import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MatchingDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, [navigate]);

  if (isLoading) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Opportunity Matching Dashboard 🎯
              </h1>
              <p className="text-gray-600 mt-2">
                Discover volunteer opportunities tailored to your skills and interests
              </p>
            </div>
            <button
              onClick={() => navigate("/volunteer-dashboard")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center py-12">
            <div className="text-8xl mb-6">🚧</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Coming Soon!
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              We're building an intelligent matching system that will connect you with 
              volunteer opportunities based on your skills, interests, availability, 
              and location preferences.
            </p>
            
            {/* Feature Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-blue-800 mb-2">Smart Matching</h3>
                <p className="text-blue-600 text-sm">
                  AI-powered recommendations based on your profile
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">📍</div>
                <h3 className="font-semibold text-green-800 mb-2">Location Based</h3>
                <p className="text-green-600 text-sm">
                  Find opportunities near you or remote options
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-xl">
                <div className="text-3xl mb-3">⏰</div>
                <h3 className="font-semibold text-purple-800 mb-2">Time Flexible</h3>
                <p className="text-purple-600 text-sm">
                  Match with your available schedule and commitments
                </p>
              </div>
            </div>

            {/* Placeholder Content */}
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-gray-50 rounded-xl p-6 text-left">
                <h4 className="font-semibold text-gray-800 mb-4">What to expect:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Browse opportunities by category and cause
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Filter by time commitment and skill requirements
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Apply directly through the platform
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Track your application status
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Communicate with NGOs and organizations
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}