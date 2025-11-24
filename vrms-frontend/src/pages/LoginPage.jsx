import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import api from "../api/api"; 

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/users/login", { email, password });
      const data = response.data;

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      const payload = JSON.parse(atob(data.access_token.split(".")[1]));
      console.log("🔍 Login JWT Payload:", payload);
      
      const role = payload.role?.toUpperCase() || "VOLUNTEER";
      const userId = payload.userId || payload.sub || payload.id;
      
      console.log("🔍 Extracted role:", role);
      console.log("🔍 Extracted userId:", userId);

      // Redirect immediately after successful login
      switch (role) {
        case "NGO":
          console.log("Redirecting to NGO dashboard with ID:", userId);
          navigate(`/ngo-dashboard/${userId}`);
          break;
        case "CORPORATE":
          navigate("/corporate-dashboard");
          break;
        case "ADMIN":
          navigate("/admin-dashboard");
          break;
        default:
          console.log("🔄 Redirecting to Volunteer dashboard with ID:", userId);
          navigate(`/volunteer-dashboard/${userId}`);
          break;
      }

    } catch (error) {
      console.error("Login Error:", error);
      const errorMsg =
        error.response?.data?.message || "Login failed. Please try again.";
      setErrorMessage(errorMsg);
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl -z-10"></div>

      {/* Navbar */}
      <Navbar />

      {/* Centered form */}
      <main className="flex-grow flex justify-center items-center px-6 py-12">
        <motion.div
          className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-10 border border-gray-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            User Login
          </h2>

          {/* Error message */}
          {errorMessage && (
            <motion.div
              className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {errorMessage}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg transition-all ${
                isLoading 
                  ? 'opacity-75 cursor-not-allowed' 
                  : 'hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Register links */}
          <div className="mt-6 text-center text-gray-600">
            <p>Don’t have an account?</p>
            <div className="mt-2 space-x-3">
              <Link
                to="/register/ngo"
                className="text-blue-600 font-semibold hover:underline"
              >
                Register as NGO
              </Link>
              <span>•</span>
              <Link
                to="/register/corporate"
                className="text-blue-600 font-semibold hover:underline"
              >
                Register as Corporate
              </Link>
              <span>•</span>
              <Link
                to="/register/volunteer"
                className="text-blue-600 font-semibold hover:underline"
              >
                Register as Volunteer
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
