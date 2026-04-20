import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Mail,
  Search,
  Star,
  Users2,
  XCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import Input from "../components/ui/Input";
import ScheduleInterviewModal from "../components/ScheduleInterviewModel";

const defaultTaskForm = {
  title: "",
  description: "",
  deadline: "",
  priority: "Medium"
};

const normalizeStatus = (status) => (status === "Applied" ? "Pending" : status || "Pending");

const CompanyApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState(defaultTaskForm);
  const [savingTask, setSavingTask] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchApplicants();
  }, []);

  const jobFilter = searchParams.get("job");

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await API.get("/application/company");
      setApplicants(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/application/update/${id}`, { status });
      toast.success(`Status updated to ${status}`);
      await fetchApplicants();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleScheduleInterview = async (interviewData) => {
    if (!selectedApplication) return;

    try {
      await API.post("/interview/schedule", {
        applicationId: selectedApplication._id,
        studentId: selectedApplication.studentId?._id,
        internshipId: selectedApplication.internshipId?._id,
        ...interviewData
      });
      toast.success("Interview scheduled successfully");
      setShowInterviewModal(false);
      setSelectedApplication(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to schedule interview");
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!selectedApplication) return;

    setSavingTask(true);
    try {
      await API.post("/company/assign-task", {
        applicationId: selectedApplication._id,
        studentId: selectedApplication.studentId?._id,
        internshipId: selectedApplication.internshipId?._id,
        ...taskForm
      });
      toast.success("Task assigned successfully");
      setShowTaskModal(false);
      setSelectedApplication(null);
      setTaskForm(defaultTaskForm);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign task");
    } finally {
      setSavingTask(false);
    }
  };

  const filteredApplicants = useMemo(
    () =>
      applicants.filter((app) => {
        const normalizedStatus = normalizeStatus(app.status);
        const matchesFilter = filter === "All" || normalizedStatus === filter;
        const matchesSearch =
          app.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.internshipId?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesJob = !jobFilter || app.internshipId?._id === jobFilter;
        return matchesFilter && matchesSearch && matchesJob;
      }),
    [applicants, filter, jobFilter, searchTerm]
  );

  const openInterviewModal = (application) => {
    setSelectedApplication(application);
    setShowInterviewModal(true);
  };

  const openTaskModal = (application) => {
    setSelectedApplication(application);
    setShowTaskModal(true);
  };

  return (
    <div className="space-y-8 text-[var(--text-primary)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Applicant Tracking</h1>
          <p className="mt-1 text-[var(--text-muted)]">
            Review candidates, update statuses, assign tasks, and schedule interviews.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input
            type="text"
            placeholder="Search candidates or jobs..."
            className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] py-2 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {["All", "Pending", "Shortlisted", "Approved", "Rejected"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-bold transition-all ${
              filter === item
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-[var(--text-inverse)]"
                : "border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-[var(--bg-tertiary)]" />
          ))}
        </div>
      ) : filteredApplicants.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] py-20 text-center">
          <Users2 size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-20" />
          <h3 className="font-bold text-[var(--text-primary)]">No applicants found</h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Try a different filter or wait for new applications.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredApplicants.map((app) => {
            const normalizedStatus = normalizeStatus(app.status);
            const canAdvance = normalizedStatus === "Pending" || normalizedStatus === "Shortlisted";
            const canSchedule = normalizedStatus === "Shortlisted" || normalizedStatus === "Approved";

            return (
              <Card key={app._id} className="transition-all hover:border-[var(--brand-primary)]">
                <CardContent className="flex flex-col gap-6 p-6">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-tertiary)] text-lg font-black uppercase text-[var(--brand-primary)]">
                        {app.studentId?.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <h3 className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
                          {app.studentId?.name}
                          {normalizedStatus === "Shortlisted" && (
                            <Star size={14} className="fill-amber-400 text-amber-400" />
                          )}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
                          <span className="flex items-center gap-1 font-medium text-[var(--text-muted)]">
                            <Mail size={12} />
                            {app.studentId?.email}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-[var(--border-color)]" />
                          <span className="flex items-center gap-1 font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                            <Briefcase size={12} />
                            {app.internshipId?.title}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                        normalizedStatus === "Approved"
                          ? "border-[var(--success-bg)] bg-[var(--success-bg)] text-[var(--success-text)]"
                          : normalizedStatus === "Shortlisted"
                            ? "border-[var(--warning-bg)] bg-[var(--warning-bg)] text-[var(--warning-text)]"
                            : normalizedStatus === "Rejected"
                              ? "border-[var(--error-bg)] bg-[var(--error-bg)] text-[var(--error-text)]"
                              : "border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                      }`}
                    >
                      {normalizedStatus === "Approved" ? <CheckCircle2 size={12} /> : null}
                      {normalizedStatus === "Rejected" ? <XCircle size={12} /> : null}
                      {(normalizedStatus === "Pending" || normalizedStatus === "Applied") ? <Clock size={12} /> : null}
                      {normalizedStatus}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {normalizedStatus === "Pending" && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => updateStatus(app._id, "Shortlisted")}>
                          Shortlist
                        </Button>
                        <Button size="sm" onClick={() => updateStatus(app._id, "Approved")}>
                          Approve
                        </Button>
                        <Button variant="outline" color="danger" size="sm" onClick={() => updateStatus(app._id, "Rejected")}>
                          Reject
                        </Button>
                      </>
                    )}

                    {canAdvance && normalizedStatus !== "Pending" && (
                      <>
                        <Button size="sm" onClick={() => updateStatus(app._id, "Approved")}>
                          Approve
                        </Button>
                        <Button variant="outline" color="danger" size="sm" onClick={() => updateStatus(app._id, "Rejected")}>
                          Reject
                        </Button>
                      </>
                    )}

                    {canSchedule && (
                      <>
                        <Button variant="secondary" size="sm" onClick={() => openInterviewModal(app)}>
                          Schedule Interview
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => openTaskModal(app)}>
                          Assign Task
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {showInterviewModal && selectedApplication && (
        <ScheduleInterviewModal
          application={selectedApplication}
          onClose={() => {
            setShowInterviewModal(false);
            setSelectedApplication(null);
          }}
          onSchedule={handleScheduleInterview}
        />
      )}

      {showTaskModal && selectedApplication && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl shadow-2xl">
            <CardContent className="p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Assign Task</h2>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {selectedApplication.studentId?.name} • {selectedApplication.internshipId?.title}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                  onClick={() => {
                    setShowTaskModal(false);
                    setSelectedApplication(null);
                    setTaskForm(defaultTaskForm);
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAssignTask} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Task Title"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm((current) => ({ ...current, title: e.target.value }))}
                    required
                  />
                  <Input
                    label="Deadline"
                    type="date"
                    value={taskForm.deadline}
                    onChange={(e) => setTaskForm((current) => ({ ...current, deadline: e.target.value }))}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="ml-0.5 text-sm font-medium text-[var(--text-secondary)]">Description</label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm((current) => ({ ...current, description: e.target.value }))}
                    className="min-h-[120px] w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="ml-0.5 text-sm font-medium text-[var(--text-secondary)]">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm((current) => ({ ...current, priority: e.target.value }))}
                    className="flex h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setShowTaskModal(false);
                      setSelectedApplication(null);
                      setTaskForm(defaultTaskForm);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" isLoading={savingTask}>
                    Assign Task
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CompanyApplicants;
