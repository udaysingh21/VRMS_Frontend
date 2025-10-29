import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
          Volunteer<span className="text-green-600">Connect</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-8">
          <Link
            to="/"
            className="text-gray-700 font-medium hover:text-blue-600 transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/register"
            className="text-gray-700 font-medium hover:text-green-600 transition duration-200"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="text-gray-700 font-medium hover:text-blue-600 transition duration-200"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu (Optional Future Enhancement) */}
        <div className="md:hidden text-gray-700">
          <button className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
