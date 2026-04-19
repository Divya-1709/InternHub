import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  ClipboardList, 
  Building2, 
  ExternalLink, 
  PlayCircle, 
  Upload, 
  AlertCircle,
  Calendar,
  BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Input from "../components/ui/Input";

const StudentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    submissionLink: "",
    submissionNotes: ""
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "student") {
      navigate("/");
      return;
    }
    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await API.get("/student/tasks");
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await API.put(`/student/task-status/${taskId}`, { status });
      toast.success(`Task marked as ${status}`);
      fetchTasks();
    } catch (err) {
      toast.error("Failed to update task status");
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.put(`/student/submit-task/${selectedTask._id}`, submissionData);
      toast.success("Task submitted successfully!");
      setShowSubmitModal(false);
      setSubmissionData({ submissionLink: "", submissionNotes: "" });
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit task");
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'High': return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' };
      case 'Medium': return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' };
      default: return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
    }
  };

  return (
    <div className="w-full space-y-8 text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Project Tasks</h1>
          <p className="text-[var(--text-muted)] mt-1">Manage and submit assignments from your employers.</p>
        </div>
          <div className="flex gap-2 text-sm text-slate-500 font-medium">
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> {tasks.filter(t => t.status === 'Assigned').length} New</span>
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> {tasks.filter(t => t.status === 'In Progress').length} Active</span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse" />)}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <ClipboardList size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">All clear!</h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto">You don't have any pending tasks. Tasks assigned by your company will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {tasks.map((task) => {
              const priority = getPriorityInfo(task.priority);
              const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'Completed' && task.status !== 'Reviewed';
              
              return (
                <Card key={task._id} className={`hover:shadow-md transition-all border-slate-200 ${isOverdue ? 'border-red-200 shadow-red-50/50' : ''}`}>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${priority.bg} ${priority.color} ${priority.border}`}>
                           {task.priority} Priority
                         </span>
                         <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                           {task.status}
                         </span>
                      </div>
                      {isOverdue && (
                        <span className="flex items-center gap-1 text-red-600 text-[10px] font-bold uppercase tracking-wider">
                           <AlertCircle size={12} /> Overdue
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl">{task.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                       <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <Building2 size={14} className="text-slate-400" />
                          {task.internshipId?.companyId?.companyName}
                       </div>
                       <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <Calendar size={14} className="text-slate-400" />
                          Due: {new Date(task.deadline).toLocaleDateString()}
                       </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed italic mb-6">
                       {task.description}
                    </div>

                    <div className="flex flex-wrap gap-3">
                       {task.status === "Assigned" && (
                         <Button size="sm" onClick={() => updateTaskStatus(task._id, "In Progress")}>
                           <PlayCircle size={16} className="mr-2" />
                           Start Task
                         </Button>
                       )}
                       {(task.status === "Assigned" || task.status === "In Progress") && (
                         <Button size="sm" variant="secondary" onClick={() => { setSelectedTask(task); setShowSubmitModal(true); }}>
                           <Upload size={16} className="mr-2" />
                           Submit Work
                         </Button>
                       )}
                       {task.submissionLink && (
                         <Button variant="outline" size="sm" onClick={() => window.open(task.submissionLink, '_blank')}>
                           <ExternalLink size={16} className="mr-2" />
                           View Submission
                         </Button>
                       )}
                    </div>

                    {task.feedback && (
                      <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-start gap-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                           <BadgeCheck size={20} className="text-indigo-600 shrink-0" />
                           <div>
                              <p className="text-xs font-bold text-indigo-900 uppercase tracking-widest mb-1">Company Feedback</p>
                              <p className="text-sm text-slate-700 italic">"{task.feedback}"</p>
                           </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Submit Modal */}
        <AnimatePresence>
          {showSubmitModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg"
              >
                <Card className="shadow-2xl border-none">
                  <CardHeader>
                    <CardTitle>Submit Assignment</CardTitle>
                    <p className="text-slate-500 text-xs mt-1">Enter your work link and any additional notes.</p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitTask} className="space-y-4">
                      <Input
                        label="Submission Link"
                        placeholder="https://github.com/... or Google Drive URL"
                        value={submissionData.submissionLink}
                        onChange={(e) => setSubmissionData({ ...submissionData, submissionLink: e.target.value })}
                        required
                      />
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 ml-0.5">Additional Notes</label>
                        <textarea
                          placeholder="Tell the reviewer about your approach..."
                          value={submissionData.submissionNotes}
                          onChange={(e) => setSubmissionData({ ...submissionData, submissionNotes: e.target.value })}
                          className="min-h-[100px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button className="flex-1" type="submit" isLoading={submitting}>
                           Complete Submission
                        </Button>
                        <Button variant="ghost" type="button" onClick={() => setShowSubmitModal(false)}>
                           Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
  );
};

export default StudentTasks;
