import { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import api from "../api/api";

export default function CorporateRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    registrationNumber: "",
    industry: "",
    csrFocusAreas: "",
    budgetAllocated: "",
    address: "",
    phone: "",
    websiteUrl: "",
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
      role: "CORPORATE",
      registrationNumber: formData.registrationNumber,
      industry: formData.industry,
      csrFocusAreas: formData.csrFocusAreas
        ? formData.csrFocusAreas.split(",").map((s) => s.trim())
        : [],
      budgetAllocated: parseFloat(formData.budgetAllocated) || 0,
      websiteUrl: formData.websiteUrl,
    };

    try {
      const response = await api.post("/users/register/corporate", body);
      alert("Corporate registered successfully!");
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl -z-10"></div>

      <Navbar />

      <main className="flex-grow flex justify-center items-center px-6 py-12">
        <motion.div
          className="w-full max-w-2xl bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-10 border border-gray-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Corporate Registration
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Company Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Official Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            />

            {/* Registration Number */}
            <input
              type="text"
              name="registrationNumber"
              placeholder="Registration Number"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            />

            {/* Industry */}
            <input
              type="text"
              name="industry"
              placeholder="Industry (e.g., IT, Healthcare)"
              value={formData.industry}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            />

            {/* CSR Focus Areas */}
            <input
              type="text"
              name="csrFocusAreas"
              placeholder="CSR Focus Areas (comma-separated)"
              value={formData.csrFocusAreas}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            />

            {/* Budget Allocated */}
            <input
              type="number"
              name="budgetAllocated"
              placeholder="Budget Allocated (in USD)"
              value={formData.budgetAllocated}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            />

            {/* Address */}
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            />

            {/* Phone */}
            <input
              type="text"
              name="phone"
              placeholder="Contact Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            />

            {/* Website URL */}
            <input
              type="url"
              name="websiteUrl"
              placeholder="Website URL"
              value={formData.websiteUrl}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            />

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Register
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
