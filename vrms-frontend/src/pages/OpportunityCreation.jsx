import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function OpportunityCreation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "",
    location: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    effortRequired: "",
    volunteersNeeded: "",
    startDate: "",
    endDate: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const opportunityData = {
        ...formData,
        volunteersNeeded: parseInt(formData.volunteersNeeded) || 1,
      };

      // TODO: Replace localStorage with actual API call
      // const response = await api.post("/opportunities", opportunityData);
      
      // For now, we'll store in localStorage since we don't have opportunity service yet
      const existingOpportunities = JSON.parse(localStorage.getItem("ngoOpportunities") || "[]");
      const newOpportunity = {
        ...opportunityData,
        id: Date.now(), // Simple ID generation
        status: "Active",
        createdDate: new Date().toISOString(),
      };
      
      existingOpportunities.push(newOpportunity);
      localStorage.setItem("ngoOpportunities", JSON.stringify(existingOpportunities));

      showToastMessage("Opportunity created successfully!", "success");
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate("/ngo-dashboard");
      }, 2000);

    } catch (error) {
      console.error("Error creating opportunity:", error);
      showToastMessage("Failed to create opportunity. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl -z-10"></div>

      <Navbar />

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
              toastType === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create New Opportunity</h1>
          <p className="text-gray-600">Post a new volunteer opportunity for your organization</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Opportunity Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="e.g., Community Beach Cleanup Drive"
                />
              </div>

              {/* Domain */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="">Select Domain</option>
                  <option value="Environment">Environment</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Community Service">Community Service</option>
                  <option value="Food & Nutrition">Food & Nutrition</option>
                  <option value="Animal Welfare">Animal Welfare</option>
                  <option value="Disaster Relief">Disaster Relief</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Volunteers Needed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Volunteers Needed</label>
                <input
                  type="number"
                  name="volunteersNeeded"
                  value={formData.volunteersNeeded}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="e.g., 20"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="e.g., Mumbai Beach, Central Park"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="e.g., Mumbai"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="e.g., Maharashtra"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="e.g., India"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="e.g., 400001"
                />
              </div>

              {/* Effort Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Effort Required</label>
                <input
                  type="text"
                  name="effortRequired"
                  value={formData.effortRequired}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="e.g., 3 hours, Half day, Full day"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="contact@ngo.org"
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="9876543210"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="Describe the volunteer opportunity, activities involved, and impact..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/ngo-dashboard")}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                {isLoading ? "Creating..." : "Create Opportunity"}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}