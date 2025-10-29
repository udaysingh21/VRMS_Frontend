import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-6 py-16 md:py-24">
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to <span className="text-green-600">Volunteer Connect</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-700 max-w-3xl mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Bringing together Volunteers, NGOs, and Corporates to create real social impact.  
          Join us and make a difference today.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-5 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <Link
            to="/register"
            className="px-10 py-4 bg-green-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-green-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-10 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Login
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">Volunteer Connect</h3>
              <p className="text-gray-400 text-sm">Making a difference, together.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 text-center">
              <a href="#about" className="text-gray-300 hover:text-green-500 transition-colors">About</a>
              <a href="#contact" className="text-gray-300 hover:text-green-500 transition-colors">Contact</a>
              <a href="#privacy" className="text-gray-300 hover:text-green-500 transition-colors">Privacy</a>
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