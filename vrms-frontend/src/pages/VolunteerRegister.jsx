import { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import api from "../api/api"; 

export default function VolunteerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
    skills: "",
    interests: "",
    availability: "",
    languages: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      role: "VOLUNTEER",
      dob: formData.dob,
      gender: formData.gender,
      skills: formData.skills
        ? formData.skills.split(",").map((s) => s.trim())
        : [],
      interests: formData.interests
        ? formData.interests.split(",").map((i) => i.trim())
        : [],
      availability: formData.availability,
      languages: formData.languages
        ? formData.languages.split(",").map((l) => l.trim())
        : [],
    };

    try {
      const response = await api.post("/users/register/volunteer", body);
      alert("Volunteer registered successfully!");
      console.log("Server Response:", response.data);
    } catch (error) {
      console.error("Registration Error:", error);
      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl -z-10"></div>

      <Navbar />

      <main className="flex-grow flex justify-center items-center px-6 py-12">
        <motion.div
          className="w-full max-w-lg bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-10 border border-gray-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Volunteer Registration
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />

            {/* Phone */}
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />

            {/* Address */}
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />

            {/* DOB */}
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />

            {/* Gender */}
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>

            {/* Skills */}
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma-separated)"
              value={formData.skills}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />

            {/* Interests */}
            <input
              type="text"
              name="interests"
              placeholder="Interests (comma-separated)"
              value={formData.interests}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />

            {/* Availability */}
            <input
              type="text"
              name="availability"
              placeholder="Availability (e.g., Weekends, Full-time)"
              value={formData.availability}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />

            {/* Languages */}
            <input
              type="text"
              name="languages"
              placeholder="Languages (comma-separated)"
              value={formData.languages}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Register
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
