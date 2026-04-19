import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Link as LinkIcon, 
  XCircle, 
  Briefcase, 
  Star,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/Card";

const CompanyInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "company") {
      navigate("/");
      return;
    }
    fetchInterviews();
  }, [navigate]);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await API.get("/interview/company");
      setInterviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, reason = "") => {
    try {
      if (status === "Cancelled") {
        await API.put(`/interview/cancel/${id}`, { reason });
      } else {
        await API.put(`/interview/status/${id}`, { status });
      }
      toast.success(`Interview ${status.toLowerCase()} successfully`);
      fetchInterviews();
    } catch (err) {
      toast.error("Failed to update interview");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Scheduled: "bg-blue-50 text-blue-700 border-blue-100",
      Rescheduled: "bg-amber-50 text-amber-700 border-amber-100",
      Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Cancelled: "bg-red-50 text-red-700 border-red-100",
      "No Show": "bg-slate-50 text-slate-600 border-slate-100",
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const filteredInterviews = interviews.filter(i => filter === "All" || i.status === filter);

  return (
    <div className="w-full space-y-8 text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Interview Pipeline</h1>
            <p className="text-[var(--text-muted)] mt-1">Manage schedules, meeting links, and candidate feedback.</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => navigate('/company')}>
               Dashboard Overview
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {["All", "Scheduled", "Completed", "Cancelled"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                filter === item 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-400'
              }`}
            >
              {item === "All" ? "Every Interview" : item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />)}
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
             <Calendar size={48} className="text-slate-200 mx-auto mb-4" />
             <h3 className="font-bold text-slate-900">No interviews found</h3>
             <p className="text-slate-500 text-sm">Matches will appear here once you schedule them with applicants.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterviews.map((interview) => (
              <Card key={interview._id} className="hover:border-indigo-300 transition-all border-slate-200 shadow-sm flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {interview.studentId?.name?.charAt(0)}
                     </div>
                     {getStatusBadge(interview.status)}
                  </div>
                  <CardTitle className="text-lg mt-3">{interview.studentId?.name}</CardTitle>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Briefcase size={12} /> {interview.internshipId?.title}
                  </p>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                         <Calendar size={14} className="text-indigo-500" />
                         {new Date(interview.scheduledDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                         <Clock size={14} className="text-indigo-500" />
                         {interview.scheduledTime} ({interview.duration} mins)
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                         {interview.meetingLink ? (
                           <>
                             <LinkIcon size={14} className="text-indigo-500" />
                             <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Join Virtual Meeting</a>
                           </>
                         ) : (
                           <>
                             <MapPin size={14} className="text-indigo-500" />
                             {interview.location || 'Location Not Set'}
                           </>
                         )}
                      </div>
                   </div>

                   {interview.feedback && interview.feedback.rating && (
                     <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 text-emerald-800">
                        <div className="flex items-center gap-1 mb-1">
                           <Star size={12} fill="currentColor" />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Rated {interview.feedback.rating}/5</span>
                        </div>
                        <p className="text-xs italic line-clamp-2">"{interview.feedback.comments}"</p>
                     </div>
                   )}
                </CardContent>

                <CardFooter className="pt-4 border-t border-slate-50 gap-2">
                   {interview.status === "Scheduled" && (
                     <>
                        <Button className="flex-1 h-9 text-xs" onClick={() => updateStatus(interview._id, "Completed")}>
                           Mark Done
                        </Button>
                        <Button variant="outline" color="danger" className="h-9 px-3" onClick={() => {
                          const reason = prompt("Reason for cancellation?");
                          if (reason) updateStatus(interview._id, "Cancelled", reason);
                        }}>
                           <XCircle size={16} />
                        </Button>
                     </>
                   )}
                   {interview.status === "Completed" && !interview.feedback?.rating && (
                     <Button className="w-full h-9 text-xs" variant="secondary" onClick={() => { setSelectedInterview(interview); setShowFeedbackModal(true); }}>
                        <MessageSquare size={14} className="mr-2" />
                        Write Feedback
                     </Button>
                   )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Feedback Modal Rendering */}
        <AnimatePresence>
          {showFeedbackModal && selectedInterview && (
             <FeedbackModal 
               interview={selectedInterview} 
               onClose={() => { setShowFeedbackModal(false); setSelectedInterview(null); }} 
               onSuccess={() => { fetchInterviews(); setShowFeedbackModal(false); setSelectedInterview(null); }}
             />
          )}
        </AnimatePresence>
      </div>
  );
};

const FeedbackModal = ({ interview, onClose, onSuccess }) => {
  const [feedback, setFeedback] = useState({
    rating: 5,
    comments: "",
    strengths: "",
    improvements: "",
    recommendation: "Recommended"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put(`/interview/feedback/${interview._id}`, feedback);
      toast.success("Feedback submitted!");
      onSuccess();
    } catch (err) {
      toast.error("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <Card className="shadow-2xl border-none overflow-hidden">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle>Interview Feedback</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Candidate: {interview.studentId?.name}</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center gap-4 py-4">
                {[1,2,3,4,5].map(v => (
                  <button key={v} type="button" onClick={() => setFeedback({...feedback, rating: v})}>
                    <Star size={32} className={v <= feedback.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'} />
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-700">Recommendation</label>
                   <select 
                     className="w-full h-10 rounded-lg border px-3 text-sm focus:ring-2 focus:ring-indigo-500"
                     value={feedback.recommendation}
                     onChange={(e) => setFeedback({...feedback, recommendation: e.target.value})}
                   >
                     <option>Highly Recommended</option>
                     <option>Recommended</option>
                     <option>Maybe</option>
                     <option>Not Recommended</option>
                   </select>
                 </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Feedback Breakdown</label>
                <textarea 
                  placeholder="Summary of performance..."
                  className="w-full min-h-[100px] rounded-lg border p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                  value={feedback.comments}
                  onChange={(e) => setFeedback({...feedback, comments: e.target.value})}
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1" type="submit" isLoading={loading}>Save Feedback</Button>
                <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CompanyInterviews;
