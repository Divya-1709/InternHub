import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  XCircle, 
  RefreshCw, 
  Building2, 
  AlertCircle,
  Star,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Input from "../components/ui/Input";

const StudentInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "student") {
      navigate("/");
      return;
    }
    fetchInterviews();
  }, [navigate]);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await API.get("/interview/student");
      setInterviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load your interview schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInterview = async (interviewId) => {
    const reason = prompt("Reason for cancellation?");
    if (!reason) return;

    try {
      await API.put(`/interview/cancel/${interviewId}`, { reason });
      toast.success("Interview cancelled successfully");
      fetchInterviews();
    } catch (err) {
      toast.error("Failed to cancel interview");
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
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styles[status] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
        {status}
      </span>
    );
  };

  const upcoming = interviews.filter(i => 
    new Date(i.scheduledDate) >= new Date() && ["Scheduled", "Rescheduled"].includes(i.status)
  );

  const past = interviews.filter(i => 
    new Date(i.scheduledDate) < new Date() || ["Completed", "Cancelled", "No Show"].includes(i.status)
  );

  return (
    <div className="w-full space-y-10 text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Interview Rounds</h1>
            <p className="text-[var(--text-muted)] mt-1">Track your progress and stay on top of scheduled meetings.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/student')}>
            Back to Dashboard
          </Button>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          </div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm shadow-indigo-50">
             <Calendar size={48} className="text-slate-200 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-slate-900">No scheduled rounds</h3>
             <p className="text-slate-500 mt-1 max-w-sm mx-auto italic">When companies schedule a meeting or interview, you'll see them listed here.</p>
          </div>
        ) : (
          <>
            {/* Upcoming Section */}
            {upcoming.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  <h2 className="text-lg font-bold text-slate-800 uppercase tracking-widest text-[11px]">Upcoming Interviews</h2>
                </div>
                <div className="grid gap-4">
                  {upcoming.map(interview => (
                    <InterviewCard 
                      key={interview._id} 
                      interview={interview} 
                      getStatusBadge={getStatusBadge}
                      onCancel={handleCancelInterview}
                      onReschedule={(int) => { setSelectedInterview(int); setShowRescheduleModal(true); }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Past Section */}
            {past.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-1 opacity-50">
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  <h2 className="text-lg font-bold text-slate-800 uppercase tracking-widest text-[11px]">Past & Completed Records</h2>
                </div>
                <div className="grid gap-4">
                  {past.map(interview => (
                    <InterviewCard 
                      key={interview._id} 
                      interview={interview} 
                      getStatusBadge={getStatusBadge}
                      isPast
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Reschedule Modal */}
        <AnimatePresence>
          {showRescheduleModal && selectedInterview && (
            <RescheduleModal 
              interview={selectedInterview} 
              onClose={() => { setShowRescheduleModal(false); setSelectedInterview(null); }}
              onSuccess={() => { fetchInterviews(); setShowRescheduleModal(false); setSelectedInterview(null); }}
            />
          )}
        </AnimatePresence>
      </div>
  );
};

const InterviewCard = ({ interview, getStatusBadge, onCancel, onReschedule, isPast }) => {
  const isToday = new Date(interview.scheduledDate).toDateString() === new Date().toDateString();
  
  return (
    <Card className={`overflow-hidden border-slate-200 transition-all ${isToday && !isPast ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:border-slate-300'}`}>
      <CardContent className="p-0 flex flex-col md:flex-row">
         {/* Date Side */}
         <div className={`p-6 md:w-48 shrink-0 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-100 ${isToday && !isPast ? 'bg-indigo-50/50' : 'bg-slate-50/30'}`}>
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">
              {new Date(interview.scheduledDate).toLocaleDateString(undefined, { month: 'short' })}
            </span>
            <span className="text-3xl font-black text-slate-900 leading-none">
               {new Date(interview.scheduledDate).getDate()}
            </span>
            <span className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-tighter">
              {new Date(interview.scheduledDate).toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
            {isToday && !isPast && (
              <span className="mt-3 px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black rounded uppercase tracking-widest animate-pulse">Today</span>
            )}
         </div>

         {/* Info Side */}
         <div className="p-6 flex-1 space-y-4">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-xl font-bold text-slate-900">{interview.internshipId?.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mt-1">
                    <Building2 size={14} className="text-slate-400" />
                    {interview.internshipId?.companyId?.companyName}
                  </div>
               </div>
               {getStatusBadge(interview.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timing</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Clock size={16} className="text-indigo-500" />
                    {interview.scheduledTime} ({interview.duration}m)
                  </p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location / Format</p>
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    {interview.meetingLink ? (
                      <>
                        <Video size={16} className="text-indigo-500" />
                        <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">Virtual Round <ExternalLink size={12} /></a>
                      </>
                    ) : (
                      <>
                        <MapPin size={16} className="text-indigo-500" />
                        <span>{interview.location || 'In-person'}</span>
                      </>
                    )}
                  </div>
               </div>
            </div>

            {interview.feedback && interview.feedback.rating > 0 && (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-start gap-3">
                 <Star size={20} className="text-emerald-500 fill-emerald-500 shrink-0" />
                 <div>
                    <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-widest">Interview Outcome</h4>
                    <p className="text-sm text-slate-700 mt-1 italic">"{interview.feedback.comments || 'No specific comments provided.'}"</p>
                    <p className="text-xs font-bold text-emerald-800 mt-2">Decision: {interview.feedback.recommendation}</p>
                 </div>
              </div>
            )}
            
            {interview.instructions && (
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 text-blue-900">
                 <div className="flex items-center gap-2 mb-1">
                    <AlertCircle size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">Preparation Instructions</span>
                 </div>
                 <p className="text-xs leading-relaxed">{interview.instructions}</p>
              </div>
            )}

            {!isPast && interview.status === 'Scheduled' && (
              <div className="flex gap-3 pt-4">
                 <Button className="h-9 px-6 text-xs" onClick={() => onReschedule(interview)}>
                   <RefreshCw size={14} className="mr-2" />
                   Request Change
                 </Button>
                 <Button variant="ghost" color="danger" className="h-9 px-6 text-xs" onClick={() => onCancel(interview._id)}>
                   <XCircle size={14} className="mr-2" />
                   Cancel Round
                 </Button>
              </div>
            )}
         </div>
      </CardContent>
    </Card>
  );
};

const RescheduleModal = ({ interview, onClose, onSuccess }) => {
  const [data, setData] = useState({ scheduledDate: "", scheduledTime: "", reason: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put(`/interview/reschedule/${interview._id}`, data);
      toast.success("Reschedule request sent");
      onSuccess();
    } catch (err) {
      toast.error("Failed to request reschedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
       <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <Card className="shadow-2xl border-none">
             <CardHeader>
                <CardTitle>Request New Time</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Submit a request to change the interview slot.</p>
             </CardHeader>
             <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                   <Input 
                     label="Preferred Date" 
                     type="date" 
                     value={data.scheduledDate} 
                     onChange={(e) => setData({...data, scheduledDate: e.target.value})} 
                     required 
                   />
                   <Input 
                     label="Preferred Time" 
                     type="time" 
                     value={data.scheduledTime} 
                     onChange={(e) => setData({...data, scheduledTime: e.target.value})} 
                     required 
                   />
                   <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Reason for Change</label>
                      <textarea 
                        className="w-full h-24 rounded-lg border p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                        value={data.reason}
                        onChange={(e) => setData({...data, reason: e.target.value})}
                        required
                      />
                   </div>
                   <div className="flex gap-2 pt-4">
                      <Button className="flex-1" type="submit" isLoading={loading}>Request Change</Button>
                      <Button variant="ghost" onClick={onClose}>Cancel</Button>
                   </div>
                </form>
             </CardContent>
          </Card>
       </motion.div>
    </div>
  );
};

export default StudentInterviews;
