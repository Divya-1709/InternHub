import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Building2, 
  Users2, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck,
  MoreVertical,
  ArrowUpRight
} from 'lucide-react';
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
      await Promise.all([
        fetchStats(),
        fetchCompanies(),
        fetchStudents(),
        fetchApplications()
      ]);
    } catch (err) {
      console.error("Error loading admin data:", err);
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

  const fetchStats = async () => {
    const res = await API.get("/admin/dashboard");
    setStats(res.data);
  };

  const fetchCompanies = async () => {
    const res = await API.get("/company/all");
    setCompanies(Array.isArray(res.data) ? res.data : []);
  };

  const fetchStudents = async () => {
    const res = await API.get("/admin/students");
    setStudents(Array.isArray(res.data) ? res.data : []);
  };

  const fetchApplications = async () => {
    const res = await API.get("/admin/applications");
    setApplications(Array.isArray(res.data) ? res.data : []);
  };

  const verifyCompany = async (id, status) => {
    try {
      await API.put(`/company/verify/${id}`, { status });
      toast.success(`Company ${status.toLowerCase()} successfully`);
      loadAllData();
    } catch (err) {
      toast.error("Failed to update company status");
    }
  };

  const renderStatusBadge = (status) => {
    const styles = {
      Verified: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Pending: "bg-amber-50 text-amber-700 border-amber-100",
      Rejected: "bg-red-50 text-red-700 border-red-100",
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || "bg-slate-50 text-slate-600 border-slate-100"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              Platform Admin Hub
            </h1>
            <p className="text-[var(--text-muted)] mt-1">Global oversight of transactions, users, and verifications.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={loadAllData}>
              Sync Data
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-indigo-600 border-none shadow-indigo-200/50 shadow-lg group relative overflow-hidden">
            <CardContent className="p-6 text-white relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <DollarSign size={20} />
                </div>
                <ArrowUpRight size={20} className="text-white/50 group-hover:text-white transition-colors" />
              </div>
              <div className="text-2xl font-bold">₹{(stats.totalRevenue || 0).toLocaleString()}</div>
              <div className="text-xs font-medium text-white/70 uppercase tracking-wider mt-1">Platform Revenue</div>
            </CardContent>
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          </Card>

          {[
            { label: 'Verified Partners', value: stats.verifiedCompanies || 0, icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Active Jobs', value: stats.totalInternships || 0, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Students', value: stats.totalStudents || 0, icon: Users2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-slate-200/60 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                  <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar gap-8">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "companies", label: "Companies", icon: Building2 },
            { id: "students", label: "Students", icon: Users2 },
            { id: "applications", label: "Applications", icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="min-h-[400px]">
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
               {[1,2,3].map(i => <div key={i} className="h-48 bg-[var(--bg-secondary)] rounded-xl" />)}
             </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-8">
                   <Card className="border-[var(--border-color)] shadow-sm bg-[var(--bg-secondary)]">
                      <CardHeader>
                        <CardTitle className="text-lg">Recent Transactions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-10">
                          <DollarSign className="mx-auto text-[var(--text-muted)] opacity-20 mb-2" size={32} />
                          <p className="text-[var(--text-muted)] text-sm font-medium italic">Log integration with Razorpay coming soon...</p>
                        </div>
                      </CardContent>
                   </Card>
                   <Card className="border-[var(--border-color)] shadow-sm bg-[var(--bg-secondary)]">
                      <CardHeader>
                        <CardTitle className="text-lg">Platform Growth</CardTitle>
                      </CardHeader>
                      <CardContent>
                         <div className="h-48 flex items-end gap-2 px-4">
                            {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                              <div key={i} className="flex-1 bg-[var(--brand-primary)] opacity-20 rounded-t-md hover:opacity-100 transition-all" style={{ height: `${h}%` }} />
                            ))}
                         </div>
                         <div className="flex justify-between mt-4 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest px-2">
                           <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                         </div>
                      </CardContent>
                   </Card>
                </motion.div>
              )}

              {activeTab === "companies" && (
                <motion.div key="companies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {companies.map((company) => (
                    <Card key={company._id} className="hover:border-indigo-200 transition-all border-slate-200 shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{company.companyName}</CardTitle>
                            <p className="text-xs text-slate-500 mt-0.5">{company.email}</p>
                          </div>
                          {renderStatusBadge(company.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-slate-500 font-medium mb-1">Registration No.</p>
                            <p className="text-slate-900 font-bold">{company.registrationNumber}</p>
                          </div>
                          <div className="text-right">
                             <a href={company.documents} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline flex items-center justify-end gap-1">
                               Verify Docs <ArrowUpRight size={12} />
                             </a>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-slate-50">
                          {company.status !== "Verified" && (
                            <Button className="flex-1" size="sm" onClick={() => verifyCompany(company._id, "Verified")}>
                              Verify Partner
                            </Button>
                          )}
                          {company.status !== "Rejected" && (
                            <Button className="flex-1" variant="outline" size="sm" color="danger" onClick={() => verifyCompany(company._id, "Rejected")}>
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
                 <motion.div key="students" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Student</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Institution / College</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">GPA</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {students.map((student) => (
                            <tr key={student._id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                                    {student.name?.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-slate-900">{student.name}</div>
                                    <div className="text-[10px] text-slate-500">{student.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                                {student.profile?.college || 'Not set'}
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-xs font-bold text-slate-900">{student.profile?.gpa || 'N/A'}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                                  <MoreVertical size={16} />
                                </button>
                              </td>
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
                      <Card key={app._id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                               <span className="text-sm font-bold text-slate-900">{app.studentId?.name}</span>
                               <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest px-1.5 py-0.5 bg-slate-100 rounded">applied for</span>
                               <span className="text-sm font-bold text-indigo-600">{app.internshipId?.title}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 flex items-center gap-2">
                              <Building2 size={12} />
                              {app.internshipId?.companyId?.companyName || "N/A"}
                              <span className="h-0.5 w-0.5 bg-slate-300 rounded-full" />
                              <TrendingUp size={12} />
                              {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                             {renderStatusBadge(app.status)}
                             <Button variant="ghost" size="sm" className="p-2">
                               <ArrowUpRight size={18} />
                             </Button>
                          </div>
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
