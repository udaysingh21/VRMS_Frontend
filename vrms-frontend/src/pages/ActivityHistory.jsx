import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock,
  CheckCircle, 
  Star,
  Award,
  Building,
  Users,
  TrendingUp,
  BarChart3
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function ActivityHistory() {
  const navigate = useNavigate();
  const { volunteerId } = useParams();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  useEffect(() => {
    loadActivityHistory();
  }, [volunteerId]);

  const loadActivityHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId || payload.sub || payload.id;
      const targetVolunteerId = volunteerId || userId;

      console.log("🔍 Loading activity history for volunteer:", targetVolunteerId);

      // Mock data for now - replace with actual API call when available
      const mockActivities = [
        {
          id: 1,
          title: "Tree Plantation Drive",
          organization: "EcoWarriors",
          organizationEmail: "contact@ecowarriors.org",
          status: "Completed",
          date: "2025-10-15",
          duration: "5 hours",
          location: "Central Park",
          volunteersParticipated: 45,
          impact: "Planted 200 trees",
          domain: "Environment",
          rating: 5,
          feedback: "Amazing experience! Well organized event with great impact on the community."
        },
        {
          id: 2,
          title: "Blood Donation Camp",
          organization: "Red Cross",
          organizationEmail: "donate@redcross.org",
          status: "Completed",
          date: "2025-09-28",
          duration: "3 hours",
          location: "Community Health Center",
          volunteersParticipated: 30,
          impact: "Collected 120 units of blood",
          domain: "Healthcare",
          rating: 4,
          feedback: "Great cause, well managed camp. Happy to contribute to saving lives."
        },
        {
          id: 3,
          title: "Teaching Kids Programming",
          organization: "Education First",
          organizationEmail: "teach@educationfirst.org",
          status: "Upcoming",
          date: "2025-12-05",
          duration: "2 hours",
          location: "Local Community Center",
          volunteersParticipated: 8,
          impact: "Teaching 25 kids",
          domain: "Education",
          rating: null,
          feedback: null
        },
        {
          id: 4,
          title: "Food Distribution Drive",
          organization: "Helping Hands",
          organizationEmail: "help@helpinghands.org",
          status: "Completed",
          date: "2025-08-20",
          duration: "4 hours",
          location: "Downtown Food Bank",
          volunteersParticipated: 20,
          impact: "Fed 300 families",
          domain: "Community Development",
          rating: 5,
          feedback: "Heartwarming experience helping families in need. Great team coordination."
        },
        {
          id: 5,
          title: "Beach Cleanup Initiative",
          organization: "Ocean Guardians",
          organizationEmail: "clean@oceanguardians.org",
          status: "Completed",
          date: "2025-07-12",
          duration: "3 hours",
          location: "Sunset Beach",
          volunteersParticipated: 60,
          impact: "Collected 500kg of trash",
          domain: "Environment",
          rating: 4,
          feedback: "Beautiful location, important cause. Great way to protect marine life."
        },
        {
          id: 6,
          title: "Senior Care Companion",
          organization: "Golden Years Foundation",
          organizationEmail: "care@goldenyears.org",
          status: "Completed",
          date: "2024-12-15",
          duration: "2 hours",
          location: "Sunset Senior Living",
          volunteersParticipated: 12,
          impact: "Brightened 30 seniors' day",
          domain: "Senior Care",
          rating: 5,
          feedback: "Such a rewarding experience spending time with the elderly. Will definitely volunteer again."
        }
      ];

      setActivities(mockActivities);
      console.log("✅ Activity history loaded:", mockActivities);

    } catch (error) {
      console.error("❌ Error loading activity history:", error);
      setError("Failed to load activity history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Upcoming":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Upcoming":
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  const filteredActivities = activities.filter(activity => {
    const statusMatch = selectedStatus === "all" || activity.status.toLowerCase() === selectedStatus.toLowerCase();
    const yearMatch = selectedYear === "all" || activity.date.startsWith(selectedYear);
    return statusMatch && yearMatch;
  });

  const stats = {
    totalActivities: activities.filter(a => a.status === "Completed").length,
    totalHours: activities.filter(a => a.status === "Completed").reduce((sum, a) => sum + parseInt(a.duration), 0),
    averageRating: activities.filter(a => a.rating).reduce((sum, a, _, arr) => sum + a.rating / arr.length, 0),
    topDomain: activities.reduce((acc, activity) => {
      acc[activity.domain] = (acc[activity.domain] || 0) + 1;
      return acc;
    }, {})
  };

  const topDomain = Object.keys(stats.topDomain).reduce((a, b) => 
    stats.topDomain[a] > stats.topDomain[b] ? a : b, ""
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activity history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl -z-10"></div>

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
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 hover:text-purple-600 hover:bg-purple-50"
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Activity History</h1>
          <p className="text-gray-600">View your volunteer journey and track your impact</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.totalActivities}</div>
            <div className="text-sm text-gray-600">Completed Activities</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.totalHours}</div>
            <div className="text-sm text-gray-600">Total Hours</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.averageRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{topDomain}</div>
            <div className="text-sm text-gray-600">Top Domain</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Activities</option>
                <option value="completed">Completed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Years</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="bg-purple-50 px-4 py-2 rounded-lg w-full text-center">
                <p className="text-sm text-gray-600">Filtered Results</p>
                <p className="text-2xl font-bold text-purple-600">{filteredActivities.length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity History List */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {filteredActivities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Activities Found</h3>
            <p className="text-gray-600 mb-6">
              {selectedStatus === "all" && selectedYear === "all"
                ? "You haven't participated in any volunteer activities yet. Start volunteering to build your history!"
                : "No activities found with the selected filters."
              }
            </p>
            <button
              onClick={() => navigate("/opportunities")}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Find Opportunities
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Activity Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{activity.title}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <Building className="w-4 h-4" />
                          <span className="text-sm">{activity.organization}</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(activity.status)}`}>
                        {getStatusIcon(activity.status)}
                        {activity.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{activity.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{activity.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{activity.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{activity.volunteersParticipated} volunteers</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-sm">{activity.impact}</span>
                      </div>
                      <div>
                        <span className="inline-block bg-gray-100 px-2 py-1 rounded-full text-sm">
                          {activity.domain}
                        </span>
                      </div>
                    </div>

                    {activity.rating && (
                      <div className="mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                          {renderStars(activity.rating)}
                        </div>
                      </div>
                    )}

                    {activity.feedback && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 italic">"{activity.feedback}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}