import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  Search, 
  Clock, 
  Banknote, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2,
  Building2,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/Card";
import InternshipApplicationModal from "../components/InternshipApplicationModal";

const StudentDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [appliedInternships, setAppliedInternships] = useState(new Set());
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "student") {
      navigate("/");
      return;
    }
    
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          checkProfile(),
          fetchInternships(),
          fetchAppliedInternships()
        ]);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [navigate]);

  const checkProfile = async () => {
    try {
      const res = await API.get("/student/profile");
      if (res.data && res.data.phone) {
        setIsProfileComplete(true);
        setStudentProfile(res.data);
      }
    } catch (err) {
      setIsProfileComplete(false);
    }
  };

  const fetchInternships = async () => {
    try {
      const res = await API.get("/internship/all");
      setInternships(res.data);
    } catch (err) {
      toast.error("Failed to load internships");
    }
  };

  const fetchAppliedInternships = async () => {
    try {
      const res = await API.get("/application/my");
      const appliedIds = new Set(res.data.map((app) => app.internshipId?._id));
      setAppliedInternships(appliedIds);
    } catch (err) {
      console.error("Failed to fetch applied internships");
    }
  };

  const checkEligibility = (internship) => {
    if (!internship.eligibility || !studentProfile) {
      return { eligible: true, message: "" };
    }

    const eligibilityCriteria = internship.eligibility.toLowerCase();
    const gpaMatch = eligibilityCriteria.match(/gpa.*?(\d+\.?\d*)/i) || eligibilityCriteria.match(/cgpa.*?(\d+\.?\d*)/i);
    if (gpaMatch) {
      const requiredGPA = parseFloat(gpaMatch[1]);
      const studentGPA = parseFloat(studentProfile.gpa);
      if (studentGPA < requiredGPA) {
        return { eligible: false, message: `Min GPA: ${requiredGPA}. Yours: ${studentGPA}` };
      }
    }

    const yearMatch = eligibilityCriteria.match(/(\d+)(st|nd|rd|th)\s*year/i);
    if (yearMatch) {
      const requiredYear = parseInt(yearMatch[1]);
      const studentYear = parseInt(studentProfile.yearOfStudy);
      if (studentYear < requiredYear) {
        return { eligible: false, message: `Requires ${requiredYear}${yearMatch[2]} year+. You: ${studentYear}` };
      }
    }

    return { eligible: true, message: eligibilityCriteria };
  };

  const handleApplyClick = (internship) => {
    if (!isProfileComplete) {
      toast.error("Please complete your profile first.");
      navigate("/profile");
      return;
    }

    const eligibility = checkEligibility(internship);
    if (!eligibility.eligible) {
      toast.error(eligibility.message);
      return;
    }

    setSelectedInternship(internship);
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (applicationData) => {
    try {
      await API.post("/application/apply", {
        internshipId: selectedInternship._id,
        ...applicationData
      });
      
      toast.success("Application submitted successfully!");
      setAppliedInternships((prev) => new Set(prev).add(selectedInternship._id));
      setShowApplicationModal(false);
      setSelectedInternship(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Application failed");
    }
  };

  const filteredInternships = internships.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.companyId?.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Discover Opportunities</h1>
            <p className="text-slate-500 mt-1">Found {filteredInternships.length} internships matching your profile</p>
          </div>
          <div className="flex gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Profile Alert */}
        {!isProfileComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4"
          >
            <div className="bg-amber-100 p-2 rounded-lg text-amber-700">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">Incomplete Profile</h3>
              <p className="text-amber-700 text-sm mt-0.5">You need to complete your academic and contact details before applying.</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate("/profile")}>
              Complete Now
            </Button>
          </motion.div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-64 rounded-xl bg-slate-100 animate-shimmer" />
            ))}
          </div>
        ) : filteredInternships.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Briefcase size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No internships found</h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto">Try adjusting your search terms or check back later for new opportunities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship) => {
              const isApplied = appliedInternships.has(internship._id);
              const eligibility = studentProfile ? checkEligibility(internship) : { eligible: true };
              
              return (
                <Card key={internship._id} className="group hover:border-indigo-200 hover:shadow-md transition-all duration-300 flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                        <Clock size={12} />
                        {internship.duration}
                      </div>
                      {isApplied && (
                        <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                          <CheckCircle2 size={14} />
                          Applied
                        </span>
                      )}
                    </div>
                    <CardTitle className="group-hover:text-indigo-600 transition-colors line-clamp-1">{internship.title}</CardTitle>
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                      <Building2 size={14} />
                      {internship.companyId?.companyName}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed mb-4">
                      {internship.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        <Banknote size={14} className="text-slate-400" />
                        {internship.stipend || 'Unpaid'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        <ShieldCheck size={14} className="text-slate-400" />
                        Verified
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      className="w-full" 
                      variant={isApplied ? "outline" : "primary"}
                      disabled={isApplied || !eligibility.eligible}
                      onClick={() => handleApplyClick(internship)}
                    >
                      {isApplied ? "Already Applied" : eligibility.eligible ? "Apply Now" : "Not Eligible"}
                      {!isApplied && eligibility.eligible && <ArrowRight size={16} className="ml-2" />}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {showApplicationModal && selectedInternship && (
          <InternshipApplicationModal
            internship={selectedInternship}
            studentProfile={studentProfile}
            onClose={() => {
              setShowApplicationModal(false);
              setSelectedInternship(null);
            }}
            onSubmit={handleApplicationSubmit}
          />
        )}
      </div>
  );
};

export default StudentDashboard;
