import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { 
  Users2, 
  Mail, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  Search,
  Star
} from 'lucide-react';
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

const CompanyApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchApplicants();
  }, []);

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
      fetchApplicants();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filteredApplicants = applicants.filter(app => {
    const matchesFilter = filter === "All" || app.status === filter;
    const matchesSearch = app.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.internshipId?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 text-[var(--text-primary)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Applicant Tracking</h1>
          <p className="text-[var(--text-muted)] mt-1">Review and manage candidates for your active positions.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input 
            type="text"
            placeholder="Search candidates..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {["All", "Pending", "Shortlisted", "Approved", "Rejected"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
              filter === item 
                ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-[var(--text-inverse)]' 
                : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-[var(--bg-tertiary)] animate-pulse rounded-xl" />)}
        </div>
      ) : filteredApplicants.length === 0 ? (
        <div className="text-center py-20 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
          <Users2 size={48} className="text-[var(--text-muted)] opacity-20 mx-auto mb-4" />
          <h3 className="font-bold text-[var(--text-primary)]">No matches found</h3>
          <p className="text-[var(--text-muted)] text-sm mt-1">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredApplicants.map((app) => (
            <Card key={app._id} className="hover:border-[var(--brand-primary)] transition-all group">
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] text-[var(--brand-primary)] font-black flex items-center justify-center text-lg uppercase group-hover:scale-110 transition-transform">
                    {app.studentId?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                      {app.studentId?.name}
                      {app.status === "Shortlisted" && <Star size={14} className="fill-amber-400 text-amber-400" />}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="text-[var(--text-muted)] text-xs flex items-center gap-1 font-medium">
                        <Mail size={12} />
                        {app.studentId?.email}
                      </span>
                      <span className="h-1 w-1 bg-[var(--border-color)] rounded-full" />
                      <span className="text-[var(--brand-primary)] text-xs font-bold uppercase tracking-wider">{app.internshipId?.title}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                  <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mr-2 ${
                    app.status === 'Approved' ? 'bg-[var(--success-bg)] text-[var(--success-text)] border-[var(--success-bg)]' :
                    app.status === 'Shortlisted' ? 'bg-[var(--warning-bg)] text-[var(--warning-text)] border-[var(--warning-bg)]' :
                    app.status === 'Rejected' ? 'bg-[var(--error-bg)] text-[var(--error-text)] border-[var(--error-bg)]' :
                    'bg-[var(--bg-tertiary)] text-[var(--text-muted)] border-[var(--border-color)]'
                  }`}>
                    {app.status === 'Approved' && <CheckCircle2 size={12} />}
                    {app.status === 'Pending' && <Clock size={12} />}
                    {app.status}
                  </div>
                  
                  {app.status === "Pending" && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => updateStatus(app._id, "Shortlisted")}>
                        Shortlist
                      </Button>
                      <Button size="sm" onClick={() => updateStatus(app._id, "Approved")}>
                        Approve
                      </Button>
                    </>
                  )}
                  {app.status === "Shortlisted" && (
                     <Button size="sm" onClick={() => updateStatus(app._id, "Approved")}>
                        Approve
                     </Button>
                  )}
                  <button className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyApplicants;
