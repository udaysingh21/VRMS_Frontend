import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  BarChart3, 
  Users, 
  Calendar, 
  TrendingUp, 
  Target,
  MapPin,
  Clock,
  Award,
  PieChart,
  LineChart,
  Activity
} from "lucide-react";
import Navbar from "../components/Navbar";
import ngoService from "../api/ngoService";

export default function AnalyticsReports() {
  const navigate = useNavigate();
  const { ngoId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalVolunteers: 0,
    activeOpportunities: 0,
    completedOpportunities: 0,
    totalApplications: 0,
    monthlyGrowth: 0,
    topDomains: [],
    recentActivity: []
  });

  useEffect(() => {
    loadAnalytics();
  }, [ngoId]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId || payload.sub || payload.id;
      const targetNgoId = ngoId || userId;

      console.log("🔍 Loading analytics for NGO:", targetNgoId);

      // Load opportunities to calculate analytics
      const response = await ngoService.get(`/postings/ngo/${targetNgoId}`);
      const opportunities = Array.isArray(response.data) ? response.data : response.data.content || [];

      // Calculate analytics from opportunities data
      const activeOpportunities = opportunities.filter(opp => opp.status === 'ACTIVE').length;
      const completedOpportunities = opportunities.filter(opp => opp.status === 'COMPLETED').length;
      
      let totalVolunteers = 0;
      let totalApplications = 0;
      const domainCounts = {};

      opportunities.forEach(opp => {
        if (opp.volunteersRegistered) {
          totalApplications += opp.volunteersRegistered.length;
          totalVolunteers += opp.volunteersRegistered.length;
        }
        
        // Count domains
        if (opp.domain) {
          domainCounts[opp.domain] = (domainCounts[opp.domain] || 0) + 1;
        }
      });

      const topDomains = Object.entries(domainCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([domain, count]) => ({ domain, count }));

      setAnalyticsData({
        totalVolunteers,
        activeOpportunities,
        completedOpportunities,
        totalApplications,
        monthlyGrowth: Math.floor(Math.random() * 20) + 5, // Placeholder
        topDomains,
        recentActivity: [
          { type: "application", message: "New volunteer applied for Beach Cleanup", time: "2 hours ago" },
          { type: "opportunity", message: "Food Drive opportunity was created", time: "1 day ago" },
          { type: "completion", message: "Community Garden project completed", time: "3 days ago" },
        ]
      });

    } catch (error) {
      console.error("❌ Error loading analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => {
    const colorClasses = {
      blue: "from-blue-500 to-blue-600 text-blue-600",
      green: "from-green-500 to-green-600 text-green-600",
      purple: "from-purple-500 to-purple-600 text-purple-600",
      orange: "from-orange-500 to-orange-600 text-orange-600",
      pink: "from-pink-500 to-pink-600 text-pink-600"
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`bg-gradient-to-r ${colorClasses[color]} bg-opacity-10 p-3 rounded-lg`}>
            <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[2]}`} />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-sm text-gray-600">{title}</div>
          </div>
        </div>
        {subtitle && (
          <div className="text-xs text-gray-500">{subtitle}</div>
        )}
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics & Reports</h1>
          <p className="text-gray-600">Track your organization's impact and volunteer engagement</p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Users}
            title="Total Volunteers"
            value={analyticsData.totalVolunteers}
            subtitle="Volunteers engaged"
            color="blue"
          />
          <StatCard 
            icon={Target}
            title="Active Opportunities"
            value={analyticsData.activeOpportunities}
            subtitle="Currently available"
            color="green"
          />
          <StatCard 
            icon={Award}
            title="Completed Projects"
            value={analyticsData.completedOpportunities}
            subtitle="Successfully finished"
            color="purple"
          />
          <StatCard 
            icon={TrendingUp}
            title="Monthly Growth"
            value={`+${analyticsData.monthlyGrowth}%`}
            subtitle="Volunteer applications"
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Domain Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-800">Top Domains</h3>
            </div>
            
            {analyticsData.topDomains.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.topDomains.map((domain, index) => (
                  <div key={domain.domain} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                        index === 0 ? 'from-purple-500 to-purple-600' :
                        index === 1 ? 'from-blue-500 to-blue-600' :
                        index === 2 ? 'from-green-500 to-green-600' :
                        index === 3 ? 'from-orange-500 to-orange-600' :
                        'from-pink-500 to-pink-600'
                      }`}></div>
                      <span className="text-gray-700">{domain.domain}</span>
                    </div>
                    <span className="text-gray-500 font-medium">{domain.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <PieChart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No domain data available</p>
              </div>
            )}
          </motion.div>

          {/* Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
            </div>
            
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'application' ? 'bg-blue-100' :
                    activity.type === 'opportunity' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    {activity.type === 'application' && <Users className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'opportunity' && <Target className="w-4 h-4 text-green-600" />}
                    {activity.type === 'completion' && <Award className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Placeholder Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Volunteer Engagement Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <LineChart className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">Volunteer Engagement</h3>
            </div>
            
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Chart Coming Soon</p>
                <p className="text-sm">Volunteer engagement trends will be displayed here</p>
              </div>
            </div>
          </motion.div>

          {/* Impact Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-800">Impact Metrics</h3>
            </div>
            
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Detailed Reports Coming Soon</p>
                <p className="text-sm">Organization impact analysis will be available here</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Export Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Export Reports</h3>
          <div className="flex flex-wrap gap-4">
            <button 
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => alert("PDF export feature coming soon!")}
            >
              Export as PDF
            </button>
            <button 
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              onClick={() => alert("CSV export feature coming soon!")}
            >
              Export as CSV
            </button>
            <button 
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              onClick={() => alert("Excel export feature coming soon!")}
            >
              Export as Excel
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}