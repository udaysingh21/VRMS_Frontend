import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, CheckCircle, XCircle, Clock } from "lucide-react";
import Navbar from "../components/Navbar";
import ngoService from "../api/ngoService";

export default function VolunteerApplications() {
  const navigate = useNavigate();
  const { ngoId } = useParams();
  const [applications, setApplications] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOpportunity, setSelectedOpportunity] = useState("all");

  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("🔄 Starting loadApplications...");

      const token = localStorage.getItem("access_token");
      if (!token) {
        console.log("❌ No token found, redirecting to login");
        navigate("/login");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId || payload.sub || payload.id;
      const targetNgoId = ngoId || userId;

      console.log("🔍 Loading applications for NGO:", targetNgoId, "Filter:", selectedOpportunity);

      // Get opportunities for this NGO first
      console.log("📡 Fetching opportunities...");
      const opportunitiesResponse = await ngoService.get(`/postings/ngo/${targetNgoId}`);
      console.log("📡 Opportunities response:", opportunitiesResponse);
      
      const opportunitiesData = Array.isArray(opportunitiesResponse.data) 
        ? opportunitiesResponse.data 
        : opportunitiesResponse.data?.content || [];
      
      console.log("📋 Found opportunities:", opportunitiesData.length, opportunitiesData);
      
      // Check if any opportunities have volunteersRegistered data
      opportunitiesData.forEach(opp => {
        console.log(`🔍 Opportunity "${opp.title}" (ID: ${opp.id}):`, {
          volunteersNeeded: opp.volunteersNeeded,
          volunteersSpotLeft: opp.volunteersSpotLeft,
          volunteersRegistered: opp.volunteersRegistered
        });
      });
      
      // Set opportunities for the dropdown
      setOpportunities(opportunitiesData);

      // Simple check: if no opportunities, show empty state
      if (opportunitiesData.length === 0) {
        console.log("📭 No opportunities found for NGO");
        setApplications([]);
        return;
      }

      // NEW APPROACH: Use the new backend endpoint to get volunteers for each posting
      console.log("🚀 Using new backend endpoint to fetch volunteer applications...");
      
      let allApplications = [];
      
      // ALWAYS fetch volunteers for ALL opportunities to ensure complete data
      // We'll filter the display later based on selectedOpportunity
      let opportunitiesToProcess = opportunitiesData;
      console.log("📋 Processing ALL opportunities to get complete volunteer details:", opportunitiesToProcess.length);

      // For each opportunity, use the volunteersRegistered data that's already available
      for (const opportunity of opportunitiesToProcess) {
        try {
          console.log(`🔍 Processing opportunity ${opportunity.id} ("${opportunity.title}")...`);
          
          // Use volunteersRegistered array directly from opportunity data
          const volunteerIds = opportunity.volunteersRegistered || [];
          
          console.log(`👥 Found ${volunteerIds.length} volunteers registered for posting ${opportunity.id} ("${opportunity.title}"):`, volunteerIds);
          console.log(`📊 Opportunity data for posting ${opportunity.id}:`, {
            volunteersNeeded: opportunity.volunteersNeeded,
            volunteersSpotLeft: opportunity.volunteersSpotLeft,
            volunteersRegistered: opportunity.volunteersRegistered
          });
          
          // For each volunteer ID, try to get their details through NGO service
          for (const volunteerId of volunteerIds) {
            console.log(`👤 Fetching volunteer ${volunteerId} details through NGO service...`);
            
            let volunteer = null;
            let fetchSuccess = false;
          
          // Try to get volunteer details through NGO service API
          try {
            // Use NGO service endpoint that proxies to User service with proper authorization
            const response = await ngoService.get(`/postings/volunteers/${volunteerId}`);
            volunteer = response.data;
            fetchSuccess = true;
            console.log(`✅ Successfully fetched volunteer ${volunteerId} details through NGO service:`, volunteer);
          } catch (ngoServiceError) {
            console.warn(`⚠️ NGO service volunteer endpoint failed:`, ngoServiceError.message);
            console.warn(`⚠️ NGO service error status:`, ngoServiceError.response?.status);
            console.warn(`⚠️ NGO service error data:`, ngoServiceError.response?.data);
            
            // Try direct call to new User service NGO endpoint as fallback
            try {
              const response = await fetch(`http://localhost:8080/api/v1/users/volunteers/${volunteerId}/ngo-access`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
              });
              
              if (response.ok) {
                volunteer = await response.json();
                fetchSuccess = true;
                console.log(`✅ Direct call to NGO access endpoint succeeded for volunteer ${volunteerId}:`, volunteer);
              } else {
                console.warn(`⚠️ Direct NGO access call failed with status: ${response.status}`);
              }
            } catch (directError) {
              console.warn(`⚠️ Direct NGO access call also failed:`, directError.message);
            }
          }
          
          // Create application record based on whether we successfully fetched data
          if (fetchSuccess && volunteer) {
            allApplications.push({
              id: `${opportunity.id}_${volunteer.id}`,
              volunteer: {
                id: volunteer.id,
                name: volunteer.name || volunteer.username || `Volunteer ${volunteer.id}`,
                email: volunteer.email,
                phone: volunteer.phone,
                address: volunteer.address,
                dob: volunteer.dob,
                gender: volunteer.gender,
                skills: volunteer.skills || [],
                interests: volunteer.interests || [],
                availability: volunteer.availability,
                languages: volunteer.languages || []
              },
              opportunity: opportunity,
              status: "Applied",
              appliedDate: new Date().toISOString().split('T')[0]
            });
            console.log(`📝 Created application for volunteer ${volunteer.id}:`, {
              name: volunteer.name,
              email: volunteer.email,
              phone: volunteer.phone,
              address: volunteer.address,
              skills: volunteer.skills,
              interests: volunteer.interests
            });
          } else {
            // Create a minimal application record showing volunteer is registered
            // but details are not accessible due to privacy/permission restrictions
            allApplications.push({
              id: `${opportunity.id}_${volunteerId}`,
              volunteer: {
                id: volunteerId,
                name: `Registered Volunteer #${volunteerId}`,
                email: 'Privacy Protected',
                phone: 'Privacy Protected',
                address: 'Privacy Protected',
                skills: ['Contact admin for details'],
                interests: ['Contact admin for details'],
                availability: 'Contact admin for details',
                languages: ['Contact admin for details']
              },
              opportunity: opportunity,
              status: "Applied",
              appliedDate: new Date().toISOString().split('T')[0]
            });
            console.log(`📝 Created privacy-protected application record for volunteer ${volunteerId}`);
            }
          }
        } catch (postingError) {
          console.error(`❌ Error getting volunteers for posting ${opportunity.id}:`, postingError);
        }
      }

      // Store all applications (we'll filter for display later)
      setApplications(allApplications);
      console.log(`✅ Applications loaded: ${allApplications.length} total applications from all opportunities`, allApplications);

    } catch (error) {
      console.error("❌ Error loading applications:", error);
      setError(`Failed to load applications: ${error.message}`);
    } finally {
      setIsLoading(false);
      console.log("🏁 loadApplications completed");
    }
  }, [ngoId, selectedOpportunity, navigate]);

  useEffect(() => {
    loadApplications();
  }, [ngoId, selectedOpportunity, loadApplications]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      case "Applied":
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "Applied":
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Filter applications by both opportunity and status
  const filteredApplications = applications.filter(app => {
    // Add safety checks to prevent errors with undefined properties
    if (!app || !app.status || !app.opportunity) return false;
    
    // Filter by opportunity
    const opportunityMatch = selectedOpportunity === "all" || 
                           app.opportunity.id.toString() === selectedOpportunity;
    
    // Filter by status
    const statusMatch = selectedStatus === "all" || 
                       app.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return opportunityMatch && statusMatch;
  });

  // Add logging to track filtering
  console.log(`🔍 Filtering applications - Total: ${applications.length}, Selected Opportunity: ${selectedOpportunity}, Selected Status: ${selectedStatus}, Filtered: ${filteredApplications.length}`);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Volunteer Applications</h1>
          <p className="text-gray-600">Manage and review volunteer applications for your opportunities</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Opportunity</label>
              <select
                value={selectedOpportunity}
                onChange={(e) => setSelectedOpportunity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Opportunities</option>
                {opportunities.map(opportunity => (
                  <option key={opportunity.id} value={opportunity.id.toString()}>
                    {opportunity.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="applied">Applied</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-green-600">{filteredApplications.length}</p>
              </div>
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

        {filteredApplications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-6">
              When volunteers apply to your opportunities, their applications will appear here.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application, index) => {
              console.log(`🔍 Rendering application ${application.id}:`, application);
              console.log(`👤 Volunteer data:`, application.volunteer);
              return (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Volunteer Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <User className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{application.volunteer?.name || 'Unknown Volunteer'}</h3>
                        <p className="text-gray-600">{application.opportunity?.title || 'Unknown Opportunity'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{application.volunteer?.email || application.email || 'No email provided'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{application.volunteer?.phone || application.phone || 'No phone provided'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{application.volunteer?.address || application.address || 'No address provided'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Applied: {application.appliedDate || 'Date unknown'}</span>
                      </div>
                    </div>

                    {/* Skills and Interests */}
                    <div className="mb-4">
                      {(application.volunteer?.skills || application.skills) && (application.volunteer?.skills || application.skills).length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700 mr-2">Skills:</span>
                          {(application.volunteer?.skills || application.skills).map((skill, idx) => (
                            <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      {(application.volunteer?.interests || application.interests) && (application.volunteer?.interests || application.interests).length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-700 mr-2">Interests:</span>
                          {(application.volunteer?.interests || application.interests).map((interest, idx) => (
                            <span key={idx} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mr-1">
                              {interest}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Additional Information */}
                    <div className="mb-4">
                      {(application.volunteer?.availability || application.availability) && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700 mr-2">Availability:</span>
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {application.volunteer?.availability || application.availability}
                          </span>
                        </div>
                      )}
                      {(application.volunteer?.languages || application.languages) && (application.volunteer?.languages || application.languages).length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-700 mr-2">Languages:</span>
                          {(application.volunteer?.languages || application.languages).map((language, idx) => (
                            <span key={idx} className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mr-1">
                              {language}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col items-end gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(application.status || 'Applied')}`}>
                      {getStatusIcon(application.status || 'Applied')}
                      {application.status || 'Applied'}
                    </div>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}