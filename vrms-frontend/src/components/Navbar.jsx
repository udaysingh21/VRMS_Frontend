import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo / Brand */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent hover:opacity-80 transition"
        >
          Volunteer<span className="text-gray-900">Connect</span>
        </Link>

        {/* Centered Nav Links as Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-200"
          >
            Home
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all duration-200"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-900 transition-all duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
