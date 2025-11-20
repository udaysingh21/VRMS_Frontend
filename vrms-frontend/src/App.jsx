import "./index.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import NGODashboard from "./pages/NGODashboard";
import CorporateDashboard from "./pages/CorporateDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import VolunteerRegister from "./pages/VolunteerRegister";
import NGORegister from "./pages/NGORegister";
import CorporateRegister from "./pages/CorporateRegister";
import AboutPage from "./pages/AboutPage";
import BrowseOpportunities from './pages/BrowseOpportunities';
import OpportunityCreation from './pages/OpportunityCreation';
import OpportunityManagement from './pages/OpportunityManagement';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
      <Route path="/ngo-dashboard" element={<NGODashboard />} />
      <Route path="/corporate-dashboard" element={<CorporateDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/register/volunteer" element={<VolunteerRegister />} />
      <Route path="/register/ngo" element={<NGORegister />} />
      <Route path="/register/corporate" element={<CorporateRegister />} />
      <Route path="/create-opportunity" element={<OpportunityCreation />} />
      <Route path="/manage-opportunities" element={<OpportunityManagement />} />
                <Route path="/opportunities" element={<BrowseOpportunities />} />


    </Routes>
  );
}
