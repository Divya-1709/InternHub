import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import StudentDashboard from "./pages/StudentDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MyApplications from "./pages/MyApplication";
import StudentProfile from "./pages/Studentprofile";
import StudentTasks from "./pages/StudentTasks";
import CompanyInterviews from "./pages/CompanyInterviews";
import StudentInterviews from "./pages/StudentInterviews";
import LandingPage from "./pages/LandingPage";
import InternshipMatcher from "./pages/InternshipMatcher";
import Settings from "./pages/Settings";
import PaymentPage from "./pages/PaymentPage";
import CompanyApplicants from "./pages/CompanyApplicants";
import CompanyInternships from "./pages/CompanyInternships";
import PostInternship from "./pages/PostInternship";
import CompanyPayouts from "./pages/CompanyPayouts";
import DashboardLayout from "./components/DashboardLayout";
import "./App.css";

const StudentLayout = ({ children }) => <DashboardLayout role="student">{children}</DashboardLayout>;
const CompanyLayout = ({ children }) => <DashboardLayout role="company">{children}</DashboardLayout>;
const AdminLayout = ({ children }) => <DashboardLayout role="admin">{children}</DashboardLayout>;

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/student" element={<StudentLayout><StudentDashboard /></StudentLayout>} />
          <Route path="/my-application" element={<StudentLayout><MyApplications /></StudentLayout>} />
          <Route path="/profile" element={<StudentLayout><StudentProfile /></StudentLayout>} />
          <Route path="/tasks" element={<StudentLayout><StudentTasks /></StudentLayout>} />
          <Route path="/student/interviews" element={<StudentLayout><StudentInterviews /></StudentLayout>} />
          <Route path="/smart-match" element={<StudentLayout><InternshipMatcher /></StudentLayout>} />
          <Route path="/settings" element={<StudentLayout><Settings /></StudentLayout>} />
          <Route path="/payment/:applicationId" element={<StudentLayout><PaymentPage /></StudentLayout>} />

          <Route path="/company" element={<CompanyLayout><CompanyDashboard /></CompanyLayout>} />
          <Route path="/company/applicants" element={<CompanyLayout><CompanyApplicants /></CompanyLayout>} />
          <Route path="/company/internships" element={<CompanyLayout><CompanyInternships /></CompanyLayout>} />
          <Route path="/company/post" element={<CompanyLayout><PostInternship /></CompanyLayout>} />
          <Route path="/company/payouts" element={<CompanyLayout><CompanyPayouts /></CompanyLayout>} />
          <Route path="/company/interviews" element={<CompanyLayout><CompanyInterviews /></CompanyLayout>} />

          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
