import { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import api from "../api/api";

export default function NGORegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    registrationNumber: "",
    foundedYear: "",
    sector: "",
    missionStatement: "",
    address: "",
    phone: "",
    websiteUrl: "",
    verificationStatus: "pending",
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
      role: "NGO",
      registrationNumber: formData.registrationNumber,
      foundedYear: parseInt(formData.foundedYear) || 0,
      sector: formData.sector,
      websiteUrl: formData.websiteUrl,
      missionStatement: formData.missionStatement,
      verificationStatus: formData.verificationStatus || "pending",
    };

    try {
      const response = await api.post("/users/register/ngo", body);
      alert("NGO registered successfully!");
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
      {/* Decorative background */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl -z-10"></div>

      <Navbar />

      <main className="flex-grow flex justify-center items-center px-6 py-12">
        <motion.div
          className="w-full max-w-2xl bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-10 border border-gray-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            NGO Registration
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Organization Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Official Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />

            {/* Registration Number */}
            <input
              type="text"
              name="registrationNumber"
              placeholder="Registration Number"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />

            {/* Founded Year */}
            <input
              type="number"
              name="foundedYear"
              placeholder="Founded Year (e.g., 2005)"
              value={formData.foundedYear}
              onChange={handleChange}
              required
              min="1800"
              max={new Date().getFullYear()}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />

            {/* Sector */}
            <input
              type="text"
              name="sector"
              placeholder="Sector (e.g., Education, Environment)"
              value={formData.sector}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />

            {/* Mission Statement */}
            <textarea
              name="missionStatement"
              placeholder="Mission Statement"
              value={formData.missionStatement}
              onChange={handleChange}
              rows="3"
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

            {/* Phone */}
            <input
              type="text"
              name="phone"
              placeholder="Contact Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />

            {/* Website URL */}
            <input
              type="url"
              name="websiteUrl"
              placeholder="Website URL"
              value={formData.websiteUrl}
              onChange={handleChange}
              required
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

            {/* Submit */}
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
