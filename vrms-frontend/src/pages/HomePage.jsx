import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-green-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300/30 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar stays on top */}
      <Navbar />

      {/* Centered Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-6 py-10">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to{" "}
          <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
            Volunteer Connect
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-700 max-w-2xl mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Bringing together Volunteers, NGOs, and Corporates to create real social impact.  
          Join us and make a difference today.
        </motion.p>

        {/* Only main buttons here */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <Link
            to="/register"
            className="px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
          >
            Login
          </Link>
        </motion.div>
      </main>

      {/* Footer stays at bottom */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">Volunteer Connect</h3>
              <p className="text-gray-400 text-sm">Making a difference, together.</p>
            </div>
            
            {/* Footer buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/about"
                className="px-5 py-2 bg-gray-800 rounded-lg text-gray-300 hover:text-white hover:bg-green-600 transition-all"
              >
                About
              </Link>
              <Link
                to="#contact"
                className="px-5 py-2 bg-gray-800 rounded-lg text-gray-300 hover:text-white hover:bg-green-600 transition-all"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Volunteer Connect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
