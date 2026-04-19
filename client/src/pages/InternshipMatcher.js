import React, { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  Target, 
  BrainCircuit, 
  Search, 
  SlidersHorizontal, 
  Star, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  AlertCircle,
  ChevronRight,
  Building2,
  Clock,
  DollarSign
} from 'lucide-react';
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import InternshipApplicationModal from "../components/InternshipApplicationModal";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

const ScoreDial = ({ score }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const getColor = (s) => {
    if (s >= 80) return "text-emerald-500 stroke-emerald-500";
    if (s >= 60) return "text-indigo-600 stroke-indigo-600";
    if (s >= 40) return "text-amber-500 stroke-amber-500";
    return "text-slate-400 stroke-slate-400";
  };

  const colors = getColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-20 h-20 transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-slate-100"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={colors}
        />
      </svg>
      <span className={`absolute text-md font-black tracking-tighter ${getColor(score).split(' ')[0]}`}>
        {score}%
      </span>
    </div>
  );
};

const BreakdownBar = ({ label, score, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
      <span>{label}</span>
      <span>{score}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  </div>
);

const InternshipMatcher = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/match/recommendations");
      setData(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("Profile incomplete. Please update your details.");
      } else {
        toast.error("Failed to load match results");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "student") { navigate("/"); return; }
    fetchMatches();
  }, [navigate, fetchMatches]);

  const handleApply = (internship) => {
    setSelectedInternship(internship);
    setShowModal(true);
  };

  const handleApplicationSubmit = async (applicationData) => {
    try {
      await API.post("/application/apply", { internshipId: selectedInternship._id, ...applicationData });
      toast.success("Application submitted successfully!");
      setShowModal(false);
      setSelectedInternship(null);
      fetchMatches();
    } catch (err) {
      toast.error(err.response?.data?.message || "Application failed");
    }
  };

  const visibleResults = (data?.results || [])
    .filter((r) => filterTier === "All" || r.tier === filterTier)
    .filter((r) =>
      !searchTerm ||
      r.internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.internship.companyId?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="w-full space-y-8 text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
              <Target className="text-[var(--brand-primary)]" /> Smart Match Engine
            </h1>
            <p className="text-[var(--text-muted)] font-medium">Ranked opportunities based on your technical profile and preferences.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
               <input 
                 className="h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-64 shadow-sm"
                 placeholder="Search by role or company..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <Button variant="outline" size="sm" onClick={fetchMatches}>
               Refresh AI Score
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="font-bold text-xs uppercase tracking-widest">Calculating compatibility scores...</p>
          </div>
        ) : !data ? (
           <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center space-y-4">
                 <AlertCircle size={48} className="text-amber-500 mx-auto" />
                 <h3 className="font-bold text-slate-900">Profile Data Missing</h3>
                 <p className="text-slate-500 text-sm">We need your education details and skills to generate personalized matches.</p>
                 <Button className="w-full" onClick={() => navigate('/profile')}>Complete Profile</Button>
              </CardContent>
           </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Stats */}
            <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8">
               <Card className="bg-indigo-600 border-none shadow-indigo-100 shadow-xl text-white">
                  <CardContent className="p-6 text-center space-y-4">
                     <BrainCircuit size={40} className="mx-auto text-indigo-200" />
                     <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-100">Profile Readiness</h3>
                     <div className="text-4xl font-black">{data.profileStrength?.completenessScore}%</div>
                     <p className="text-xs text-indigo-100/70">Your match accuracy depends on profile completeness.</p>
                     <Button variant="secondary" className="w-full text-indigo-700 bg-white hover:bg-slate-100" onClick={() => navigate('/profile')}>
                       Update Profile
                     </Button>
                  </CardContent>
               </Card>

               <div className="space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Filter by Tier</p>
                 <div className="grid gap-1">
                   {["All", "Excellent", "Good", "Fair"].map(tier => (
                     <button
                       key={tier}
                       onClick={() => setFilterTier(tier)}
                       className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                         filterTier === tier 
                         ? 'bg-slate-100 text-slate-900 border-l-4 border-indigo-600' 
                         : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                       }`}
                     >
                       <span className="flex items-center gap-2">
                         {tier === 'All' ? <SlidersHorizontal size={14} /> : tier === 'Excellent' ? <Star size={14} className="text-amber-500" /> : tier === 'Good' ? <TrendingUp size={14} /> : <Zap size={14} />}
                         {tier}
                       </span>
                       <span className="text-[10px] bg-slate-200/50 px-1.5 py-0.5 rounded-full">
                         {tier === 'All' ? data.results.length : data.results.filter(r => r.tier === tier).length}
                       </span>
                     </button>
                   ))}
                 </div>
               </div>
            </div>

            {/* Match Grid */}
            <div className="lg:col-span-9">
               {visibleResults.length === 0 ? (
                 <div className="py-20 text-center bg-white rounded-3xl border border-slate-100">
                    <Zap size={48} className="text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">No matches found for "{filterTier}" tier.</p>
                 </div>
               ) : (
                 <div className="grid gap-6">
                   {visibleResults.map((result, idx) => (
                     <Card key={result.internship._id} className="hover:shadow-lg transition-all border-slate-200 overflow-hidden group">
                       <CardContent className="p-0 flex flex-col md:flex-row">
                          <div className="p-6 md:w-48 shrink-0 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-50 bg-slate-50/30">
                             <ScoreDial score={result.totalScore} />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Match Score</span>
                          </div>
                          
                          <div className="p-6 flex-1 flex flex-col justify-between">
                             <div>
                                <div className="flex justify-between items-start mb-2">
                                   <div className="flex gap-2">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                                        result.tier === 'Excellent' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        result.tier === 'Good' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                                        'bg-amber-50 text-amber-600 border-amber-100'
                                      }`}>
                                        {result.tier} Compatibility
                                      </span>
                                      {result.alreadyApplied && (
                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                          <ShieldCheck size={10} /> Applied
                                        </span>
                                      )}
                                   </div>
                                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Rank #{idx + 1}</span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{result.internship.title}</h3>
                                <div className="flex items-center gap-4 mt-2 mb-4">
                                   <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                      <Building2 size={14} className="text-slate-400" />
                                      {result.internship.companyId?.companyName || 'Verified Partner'}
                                   </div>
                                   <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                      <Clock size={14} className="text-slate-400" />
                                      {result.internship.duration}
                                   </div>
                                   {result.internship.stipendAmount > 0 && (
                                     <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                                        <DollarSign size={14} />
                                        ₹{result.internship.stipendAmount.toLocaleString()}
                                     </div>
                                   )}
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 mt-6 pt-6 border-t border-slate-50">
                                   <BreakdownBar label="Skills Match" score={result.breakdown.skills.score} color="bg-indigo-600" />
                                   <BreakdownBar label="Academic/GPA" score={result.breakdown.gpa.score} color="bg-emerald-500" />
                                   <BreakdownBar label="Branch Relevance" score={result.breakdown.branch.score} color="bg-amber-500" />
                                </div>
                             </div>

                             <div className="flex gap-2 mt-8 pt-6 border-t border-slate-50">
                                {!result.alreadyApplied ? (
                                  <Button className="flex-1 shadow-indigo-100 shadow-lg" onClick={() => handleApply(result.internship)}>
                                    Quick Apply <ChevronRight size={16} className="ml-1" />
                                  </Button>
                                ) : (
                                  <Button variant="outline" className="flex-1" disabled>
                                    Application Pending
                                  </Button>
                                )}
                                <Button variant="ghost" className="px-4" onClick={() => toast.info("Full match breakdown coming soon!")}>
                                   <BrainCircuit size={18} className="text-slate-400" />
                                </Button>
                             </div>
                          </div>
                       </CardContent>
                     </Card>
                   ))}
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Application Modal Integration */}
        {showModal && selectedInternship && (
          <InternshipApplicationModal
            internship={selectedInternship}
            studentProfile={data?.studentProfile}
            onClose={() => { setShowModal(false); setSelectedInternship(null); }}
            onSubmit={handleApplicationSubmit}
          />
        )}
      </div>
  );
};

export default InternshipMatcher;
