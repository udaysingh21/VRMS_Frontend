import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  MapPin, 
  Clock,
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Mail,
  Phone,
  Building,
  Trash2
} from "lucide-react";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import volunteerApi, { unregisterVolunteerFromPosting } from "../api/volunteerApi";
import ngoService from "../api/ngoService";

export default function MyApplications() {
  const navigate = useNavigate();
  const { volunteerId } = useParams();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); // newest or oldest
  
  // Toast and confirmation dialog states
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, postingId: null, title: '' });

  useEffect(() => {
    loadApplications();
  }, [volunteerId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("access_token");
      if (!token) {
        console.log("❌ No access token found, redirecting to login");
        navigate("/login");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("🔍 JWT Payload:", payload);
      
      const userId = payload.userId || payload.user_id || payload.sub || payload.id;
      const targetVolunteerId = volunteerId || userId;

      console.log("🔍 Loading applications for volunteer:", targetVolunteerId);
      console.log("🔍 API URL will be:", `/users/volunteers/${targetVolunteerId}/postings`);

      // Get the list of posting IDs that the volunteer is registered for
      const response = await volunteerApi.get(`/users/volunteers/${targetVolunteerId}/postings`);
      
      console.log("✅ Raw API Response:", response);
      console.log("✅ Response Data:", response.data);
      console.log("✅ Response Status:", response.status);
      
      // Handle the actual backend format: { volunteerId, postings: Set<Long>, count }
      console.log("🔄 Backend response structure:", response.data);
      
      let postingIds = [];
      if (response.data && response.data.postings) {
        // Convert Set to Array if needed
        postingIds = Array.isArray(response.data.postings) 
          ? response.data.postings 
          : Array.from(response.data.postings);
      }
      
      console.log("🔄 Extracted posting IDs:", postingIds);
      
      let transformedApplications = [];
      
      if (postingIds.length > 0) {
        console.log("🔍 Posting IDs to fetch:", postingIds);
        
        // We have posting IDs, need to fetch full details from NGO service
        console.log("🔄 Fetching full posting details for IDs:", postingIds);
        const postingPromises = postingIds.map(async (postingId) => {
          try {
            console.log(`🔄 Fetching details for posting ID: ${postingId}`);
            const postingResponse = await ngoService.get(`/postings/${postingId}`);
            const posting = postingResponse.data;
            
            return {
              id: posting.id,
              title: posting.title || "Untitled Opportunity",
              organization: posting.ngoName || posting.organizationName || "NGO Organization",
              organizationEmail: posting.ngoEmail || posting.contactEmail || "contact@ngo.org",
              organizationPhone: posting.ngoPhone || posting.contactPhone || "Contact NGO",
              status: "Applied",
              appliedDate: posting.appliedDate || posting.createdAt || new Date().toISOString().split('T')[0],
              description: posting.description || "",
              location: posting.location || "",
              date: posting.date || posting.startDate || "",
              duration: posting.duration || "TBD",
              volunteersNeeded: posting.volunteersNeeded || 0,
              domain: posting.domain || "General"
            };
          } catch (error) {
            console.error(`Error fetching posting ${postingId}:`, error);
            return {
              id: postingId,
              title: "Failed to load posting",
              organization: "Unknown",
              organizationEmail: "unknown@email.com",
              organizationPhone: "Unknown",
              status: "Applied",
              appliedDate: new Date().toISOString().split('T')[0],
              description: "Failed to load posting details",
              location: "Unknown",
              date: "Unknown",
              duration: "Unknown",
              volunteersNeeded: 0,
              domain: "Unknown"
            };
          }
        });
        
        transformedApplications = await Promise.all(postingPromises);
      }

      console.log("✅ Final transformed applications:", transformedApplications);
      setApplications(transformedApplications);

    } catch (error) {
      console.error("❌ Error loading applications:", error);
      console.error("❌ Error response:", error.response);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error data:", error.response?.data);
      
      setError(`Failed to load applications: ${error.response?.data?.message || error.message}`);
      
      // Set empty array but don't hide the error
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      case "Applied":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "Applied":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Sort applications based on applied date
  const sortedApplications = [...applications].sort((a, b) => {
    const dateA = new Date(a.appliedDate);
    const dateB = new Date(b.appliedDate);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const handleWithdrawApplication = (postingId, opportunityTitle) => {
    if (!volunteerId) {
      console.error('❌ No volunteer ID available');
      showToast('Unable to withdraw: No volunteer ID found', 'error');
      return;
    }

    // Show confirmation dialog
    setConfirmDialog({
      show: true,
      postingId,
      title: opportunityTitle
    });
  };

  const confirmWithdraw = async () => {
    const { postingId } = confirmDialog;
    setConfirmDialog({ show: false, postingId: null, title: '' });

    try {
      console.log(`🔄 Withdrawing volunteer ${volunteerId} from posting ${postingId}`);
      
      const response = await unregisterVolunteerFromPosting(volunteerId, postingId);
      console.log('✅ Withdraw response:', response.data);
      
      // Remove the application from the local state immediately
      setApplications(prevApplications => 
        prevApplications.filter(app => app.id !== postingId)
      );
      
      // Clear any existing registration data from localStorage to ensure fresh data
      const registrationKey = `volunteer_${volunteerId}_registrations`;
      localStorage.removeItem(registrationKey);
      
      // Also clear any cached opportunities data to ensure fresh spot counts
      // This will force BrowseOpportunities to reload from server with updated counts
      localStorage.removeItem('cached_opportunities');
      localStorage.removeItem('cached_filtered_opportunities');
      
      // Set a flag to indicate that opportunities data should be refreshed
      localStorage.setItem('opportunities_need_refresh', 'true');
      
      // Show success toast
      showToast('Successfully withdrawn from the opportunity! The spot is now available for other volunteers.', 'success');
      
    } catch (error) {
      console.error('❌ Error withdrawing application:', error);
      console.error('❌ Error response:', error.response);
      
      let errorMessage = 'Failed to withdraw application';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(`Withdrawal failed: ${errorMessage}`);
      showToast(`Failed to withdraw: ${errorMessage}`, 'error');
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
          <p className="text-xs text-gray-500 mt-2">Debug: Volunteer ID = {volunteerId}</p>
        </div>
      </div>
    );
  }

  // Add debug info in console for troubleshooting
  console.log("🎯 MyApplications render - applications:", applications);
  console.log("🎯 MyApplications render - sortedApplications:", sortedApplications);
  console.log("🎯 MyApplications render - sortOrder:", sortOrder);
  console.log("🎯 MyApplications render - isLoading:", isLoading);
  console.log("🎯 MyApplications render - error:", error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl -z-10"></div>

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 hover:text-green-600 hover:bg-green-50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">My Applications</h1>
              <p className="text-gray-600">Track your volunteer applications and manage commitments</p>
            </div>
            <button
              onClick={loadApplications}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Refreshing...
                </>
              ) : (
                'Refresh'
              )}
            </button>
          </div>
        </motion.div>

        {/* Stats and Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Total Count */}
            <div className="bg-blue-50 px-6 py-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Total Applications</div>
              <div className="text-3xl font-bold text-blue-700">{applications.length}</div>
            </div>
            
            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort Applications</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {sortedApplications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Applications Found</h3>
            <p className="text-gray-600 mb-6">
              You haven't applied to any opportunities yet. Start exploring opportunities to make a difference!
            </p>
            <button
              onClick={() => navigate("/opportunities")}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Browse Opportunities
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {sortedApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Application Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{application.title}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <Building className="w-4 h-4" />
                          <span className="text-sm">{application.organization}</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(application.status)}`}>
                        {getStatusIcon(application.status)}
                        {application.status}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 text-sm">{application.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{application.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{application.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{application.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{application.organizationEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{application.organizationPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span className="text-sm">{application.volunteersNeeded} volunteers needed</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Applied on: {application.appliedDate}</span>
                      <span className="inline-block bg-gray-100 px-2 py-1 rounded-full">
                        {application.domain}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-[120px]">
                    {application.status === "Applied" && (
                      <button
                        onClick={() => handleWithdrawApplication(application.id, application.title)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Withdraw
                      </button>
                    )}
                    {application.status === "Confirmed" && (
                      <div className="text-center">
                        <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                          Ready to Volunteer
                        </div>
                      </div>
                    )}
                    {application.status === "Completed" && (
                      <div className="text-center">
                        <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
                          Thank You!
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={hideToast}
        duration={4000}
      />
      
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.show}
        onClose={() => setConfirmDialog({ show: false, postingId: null, title: '' })}
        onConfirm={confirmWithdraw}
        title="Withdraw Application"
        message={`Are you sure you want to withdraw your application for "${confirmDialog.title}"? This action cannot be undone.`}
        confirmText="Yes, Withdraw"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}