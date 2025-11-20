import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function OpportunityManagement() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    loadOpportunities();
    seedSampleDataIfEmpty();
  }, []);

  const seedSampleDataIfEmpty = () => {
    const existing = JSON.parse(localStorage.getItem("ngoOpportunities") || "[]");
    if (existing.length === 0) {
      const sampleOpportunity = {
        "id": 2,
        "title": "Beach Cleanup",
        "description": "Community beach cleanup",
        "domain": "Environment",
        "location": "Mumbai Beach",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "pincode": "400001",
        "effortRequired": "3 hours",
        "volunteersNeeded": 20,
        "startDate": "2025-12-01",
        "endDate": "2025-12-01",
        "ngoId": 4,
        "contactEmail": "contact@ngo.org",
        "contactPhone": "9876543210",
        "status": "ACTIVE",
        "createdAt": "2025-11-19T15:58:00.563951",
        "updatedAt": "2025-11-19T15:58:00.563993",
        "volunteersSpotLeft": 20,
        "volunteersRegistered": []
      };
      localStorage.setItem("ngoOpportunities", JSON.stringify([sampleOpportunity]));
      setOpportunities([sampleOpportunity]);
    }
  };

  const loadOpportunities = () => {
    // Load from localStorage for now (will replace with API call later)
    const savedOpportunities = JSON.parse(localStorage.getItem("ngoOpportunities") || "[]");
    setOpportunities(savedOpportunities);
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleViewOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setEditForm(opportunity);
    setIsEditing(false);
    setShowDetailModal(true);
  };

  const handleEditOpportunity = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    try {
      // Update localStorage (will replace with API call later)
      const updatedOpportunities = opportunities.map(opp => 
        opp.id === selectedOpportunity.id ? { ...editForm, updatedAt: new Date().toISOString() } : opp
      );
      setOpportunities(updatedOpportunities);
      localStorage.setItem("ngoOpportunities", JSON.stringify(updatedOpportunities));
      
      setSelectedOpportunity({ ...editForm, updatedAt: new Date().toISOString() });
      setIsEditing(false);
      showToastMessage("Opportunity updated successfully!", "success");
    } catch (error) {
      showToastMessage("Failed to update opportunity", "error");
    }
  };

  const handleDeleteOpportunity = () => {
    if (!window.confirm("Are you sure you want to delete this opportunity?")) {
      return;
    }

    try {
      // Remove from localStorage (will replace with API call later)
      const updatedOpportunities = opportunities.filter(opp => opp.id !== selectedOpportunity.id);
      setOpportunities(updatedOpportunities);
      localStorage.setItem("ngoOpportunities", JSON.stringify(updatedOpportunities));
      
      setShowDetailModal(false);
      showToastMessage("Opportunity deleted successfully!", "success");
    } catch (error) {
      showToastMessage("Failed to delete opportunity", "error");
    }
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'INACTIVE': 'bg-gray-100 text-gray-800',
      'COMPLETED': 'bg-blue-100 text-blue-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
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

      {/* Opportunity Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedOpportunity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Opportunity Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {!isEditing ? (
                /* View Mode */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedOpportunity.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedOpportunity.status)}`}>
                        {selectedOpportunity.status}
                      </span>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-3">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Domain:</span> {selectedOpportunity.domain}</p>
                        <p><span className="font-medium">Volunteers Needed:</span> {selectedOpportunity.volunteersNeeded}</p>
                        <p><span className="font-medium">Volunteers Registered:</span> {selectedOpportunity.volunteersRegistered?.length || 0}</p>
                        <p><span className="font-medium">Spots Left:</span> {selectedOpportunity.volunteersSpotLeft || selectedOpportunity.volunteersNeeded}</p>
                        <p><span className="font-medium">Effort Required:</span> {selectedOpportunity.effortRequired}</p>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-3">Location Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Location:</span> {selectedOpportunity.location}</p>
                        <p><span className="font-medium">City:</span> {selectedOpportunity.city}</p>
                        <p><span className="font-medium">State:</span> {selectedOpportunity.state}</p>
                        <p><span className="font-medium">Country:</span> {selectedOpportunity.country}</p>
                        <p><span className="font-medium">Pincode:</span> {selectedOpportunity.pincode}</p>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-3">Timeline</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Start Date:</span> {new Date(selectedOpportunity.startDate).toLocaleDateString()}</p>
                        <p><span className="font-medium">End Date:</span> {new Date(selectedOpportunity.endDate).toLocaleDateString()}</p>
                        <p><span className="font-medium">Created:</span> {new Date(selectedOpportunity.createdAt || Date.now()).toLocaleDateString()}</p>
                        <p><span className="font-medium">Updated:</span> {new Date(selectedOpportunity.updatedAt || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-3">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Email:</span> {selectedOpportunity.contactEmail}</p>
                        <p><span className="font-medium">Phone:</span> {selectedOpportunity.contactPhone}</p>
                        {selectedOpportunity.ngoId && (
                          <p><span className="font-medium">NGO ID:</span> {selectedOpportunity.ngoId}</p>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Description</h4>
                      <p className="text-sm text-gray-700">{selectedOpportunity.description}</p>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleEditOpportunity}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Edit Opportunity
                    </button>
                    <button
                      onClick={handleDeleteOpportunity}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Delete Opportunity
                    </button>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={editForm.title || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                      <select
                        name="domain"
                        value={editForm.domain || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      >
                        <option value="Environment">Environment</option>
                        <option value="Education">Education</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Community Service">Community Service</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        name="status"
                        value={editForm.status || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Volunteers Needed</label>
                      <input
                        type="number"
                        name="volunteersNeeded"
                        value={editForm.volunteersNeeded || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Effort Required</label>
                      <input
                        type="text"
                        name="effortRequired"
                        value={editForm.effortRequired || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={editForm.location || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={editForm.city || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={editForm.state || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={editForm.startDate || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={editForm.endDate || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={editForm.contactEmail || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={editForm.contactPhone || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={editForm.description || ""}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleSaveChanges}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Manage Opportunities</h1>
            <p className="text-gray-600">View and manage your volunteer opportunities</p>
          </div>
          <button
            onClick={() => navigate("/create-opportunity")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            + Create New Opportunity
          </button>
        </motion.div>

        {/* Opportunities List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.length > 0 ? (
            opportunities.map((opportunity) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer"
                onClick={() => handleViewOpportunity(opportunity)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800 truncate">{opportunity.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(opportunity.status)}`}>
                    {opportunity.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{opportunity.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Domain:</span>
                    <span className="font-medium">{opportunity.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">{opportunity.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Volunteers:</span>
                    <span className="font-medium">{opportunity.volunteersNeeded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Start Date:</span>
                    <span className="font-medium">{new Date(opportunity.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-2 lg:col-span-3 text-center py-12"
            >
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Opportunities Yet</h3>
              <p className="text-gray-600 mb-6">Create your first volunteer opportunity to get started</p>
              <button
                onClick={() => navigate("/create-opportunity")}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Create Your First Opportunity
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}