import React, { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Building2,
  FileText,
  ShieldCheck,
  Users2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadAllData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, companiesRes, studentsRes, applicationsRes] = await Promise.all([
        API.get("/admin/dashboard"),
        API.get("/company/all"),
        API.get("/admin/students"),
        API.get("/admin/applications")
      ]);

      setStats(statsRes.data || {});
      setCompanies(Array.isArray(companiesRes.data) ? companiesRes.data : []);
      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
      setApplications(Array.isArray(applicationsRes.data) ? applicationsRes.data : []);
    } catch (err) {
      console.error("Error loading admin data:", err);
      toast.error("Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/");
      return;
    }
    loadAllData();
  }, [navigate, loadAllData]);

  const verifyCompany = async (id, status) => {
    try {
      await API.put(`/company/verify/${id}`, { status });
      toast.success(`Company ${status.toLowerCase()} successfully`);
      loadAllData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update company status");
    }
  };

  const renderStatusBadge = (status) => {
    const styles = {
      Verified: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Pending: "bg-amber-50 text-amber-700 border-amber-100",
      Rejected: "bg-red-50 text-red-700 border-red-100"
    };

    return (
      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${styles[status] || "bg-slate-50 text-slate-600 border-slate-100"}`}>
        {status}
      </span>
    );
  };

  const overviewBars = useMemo(() => {
    const values = [
      { label: "Companies", value: companies.length, color: "bg-indigo-500" },
      { label: "Students", value: students.length, color: "bg-sky-500" },
      { label: "Applications", value: applications.length, color: "bg-emerald-500" },
      { label: "Verified", value: stats.verifiedCompanies || 0, color: "bg-amber-500" }
    ];
    const max = Math.max(...values.map((entry) => entry.value), 1);

    return values.map((entry) => ({
      ...entry,
      height: `${Math.max((entry.value / max) * 100, entry.value ? 18 : 8)}%`
    }));
  }, [applications.length, companies.length, stats.verifiedCompanies, students.length]);

  const recentApplications = useMemo(
    () => applications.slice(0, 5),
    [applications]
  );

  return (
    <div className="space-y-8 text-[var(--text-primary)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Platform Admin Hub</h1>
          <p className="mt-1 text-[var(--text-muted)]">Oversee company approvals, student activity, and application flow.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadAllData}>
          Sync Data
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none bg-[var(--brand-primary)] text-white shadow-lg">
          <CardContent className="p-6">
            <div className="mb-4 rounded-lg bg-white/10 p-2 w-fit">
              <BarChart3 size={20} />
            </div>
            <div className="text-2xl font-bold">Rs {(stats.totalRevenue || 0).toLocaleString()}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-white/70">Platform Revenue</div>
          </CardContent>
        </Card>

        {[
          { label: "Verified Partners", value: stats.verifiedCompanies || 0, icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Active Jobs", value: stats.totalInternships || 0, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Students", value: stats.totalStudents || 0, icon: Users2, color: "text-emerald-600", bg: "bg-emerald-50" }
        ].map((stat) => (
          <Card key={stat.label} className="shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                <div className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-6 overflow-x-auto border-b border-[var(--border-color)]">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "companies", label: "Companies", icon: Building2 },
          { id: "students", label: "Students", icon: Users2 },
          { id: "applications", label: "Applications", icon: FileText }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 whitespace-nowrap pb-4 text-sm font-semibold transition-all ${
              activeTab === tab.id ? "text-[var(--brand-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {activeTab === tab.id && <motion.div layoutId="admin-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-primary)]" />}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-[var(--bg-secondary)]" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8 md:grid-cols-2">
                <Card className="bg-[var(--bg-secondary)]">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Applications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentApplications.length === 0 ? (
                      <div className="py-10 text-center text-sm italic text-[var(--text-muted)]">No applications yet.</div>
                    ) : (
                      recentApplications.map((app) => (
                        <div key={app._id} className="rounded-lg bg-[var(--bg-tertiary)]/70 p-4">
                          <div className="font-bold text-[var(--text-primary)]">{app.studentId?.name}</div>
                          <div className="mt-1 text-sm text-[var(--text-muted)]">
                            {app.internshipId?.title} • {app.internshipId?.companyId?.companyName || "Unknown company"}
                          </div>
                          <div className="mt-2 text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)]">{app.status}</div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-[var(--bg-secondary)]">
                  <CardHeader>
                    <CardTitle className="text-lg">Platform Snapshot</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-56 items-end gap-4 px-4">
                      {overviewBars.map((bar) => (
                        <div key={bar.label} className="flex flex-1 flex-col items-center gap-3">
                          <div className={`w-full rounded-t-md ${bar.color}`} style={{ height: bar.height }} title={`${bar.label}: ${bar.value}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{bar.label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "companies" && (
              <motion.div key="companies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {companies.map((company) => (
                  <Card key={company._id} className="shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg">{company.companyName}</CardTitle>
                          <p className="mt-1 text-xs text-[var(--text-muted)]">{company.email}</p>
                        </div>
                        {renderStatusBadge(company.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="mb-1 font-medium text-[var(--text-muted)]">Registration No.</p>
                          <p className="font-bold text-[var(--text-primary)]">{company.registrationNumber}</p>
                        </div>
                        <div className="text-right">
                          {company.documents ? (
                            <a href={company.documents} target="_blank" rel="noreferrer" className="font-bold text-[var(--brand-primary)] hover:underline">
                              View Documents
                            </a>
                          ) : (
                            <span className="text-[var(--text-muted)]">No documents</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 border-t border-[var(--border-color)] pt-2">
                        {company.status !== "Verified" && (
                          <Button className="flex-1" size="sm" onClick={() => verifyCompany(company._id, "Verified")}>
                            Verify
                          </Button>
                        )}
                        {company.status !== "Rejected" && (
                          <Button className="flex-1" variant="outline" color="danger" size="sm" onClick={() => verifyCompany(company._id, "Rejected")}>
                            Reject
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {activeTab === "students" && (
              <motion.div key="students" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]/50">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Student</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">College</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Degree</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">GPA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {students.map((student) => (
                        <tr key={student._id} className="transition-colors hover:bg-[var(--bg-tertiary)]/30">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-tertiary)] text-xs font-bold text-[var(--text-primary)]">
                                {student.name?.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-[var(--text-primary)]">{student.name}</div>
                                <div className="text-[10px] text-[var(--text-muted)]">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-[var(--text-muted)]">{student.profile?.college || "Not set"}</td>
                          <td className="px-6 py-4 text-xs font-medium text-[var(--text-muted)]">{student.profile?.degree || "Not set"}</td>
                          <td className="px-6 py-4 text-xs font-bold text-[var(--text-primary)]">{student.profile?.gpa ?? "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "applications" && (
              <motion.div key="applications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {applications.map((app) => (
                  <Card key={app._id} className="shadow-sm transition-shadow hover:shadow-md">
                    <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-[var(--text-primary)]">{app.studentId?.name}</span>
                          <span className="rounded bg-[var(--bg-tertiary)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-[var(--text-muted)]">applied for</span>
                          <span className="text-sm font-bold text-[var(--brand-primary)]">{app.internshipId?.title}</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          {app.internshipId?.companyId?.companyName || "Unknown company"} • {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>{renderStatusBadge(app.status)}</div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
