import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Register as:
        </h2>

        {/* Role Selection */}
        <div className="flex justify-around">
          <button
            onClick={() => navigate("/register/volunteer")}
            className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-blue-600 hover:text-white transition"
          >
            Volunteer
          </button>

          <button
            onClick={() => navigate("/register/ngo")}
            className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-blue-600 hover:text-white transition"
          >
            NGO
          </button>

          <button
            onClick={() => navigate("/register/corporate")}
            className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-blue-600 hover:text-white transition"
          >
            Corporate
          </button>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
