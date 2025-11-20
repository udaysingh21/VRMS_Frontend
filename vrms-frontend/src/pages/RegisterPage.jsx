import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navbar */}
      <Navbar />

      {/* Centered Registration Card */}
      <main className="flex-grow flex items-center justify-center px-6 py-16">
        <motion.div
          className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md text-center border border-gray-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Register as:
          </h2>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <button
              onClick={() => navigate("/register/volunteer")}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Volunteer
            </button>

            <button
              onClick={() => navigate("/register/ngo")}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            >
              NGO
            </button>

            <button
              onClick={() => navigate("/register/corporate")}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 text-white font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Corporate
            </button>
          </div>

          {/* Login Redirect */}
          <p className="text-gray-700 mt-6 text-sm">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        </motion.div>
      </main>

      {/* Decorative Gradient Circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-green-300/30 blur-3xl rounded-full -z-10"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-300/30 blur-3xl rounded-full -z-10"></div>
    </div>
  );
}
