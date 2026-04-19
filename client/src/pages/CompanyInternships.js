import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Clock, 
  GraduationCap, 
  Users2,
  Trash2
} from 'lucide-react';
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

const CompanyInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const res = await API.get("/internship/company");
      setInternships(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load your internships");
    } finally {
      setLoading(false);
    }
  };

  const deleteInternship = async (id) => {
    if (!window.confirm("Are you sure you want to delete this internship?")) return;
    try {
      await API.delete(`/internship/delete/${id}`);
      toast.success("Internship deleted successfully");
      fetchInternships();
    } catch (err) {
      toast.error("Failed to delete internship");
    }
  };

  const filteredInternships = internships.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-[var(--text-primary)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Manage Postings</h1>
          <p className="text-[var(--text-muted)] mt-1">Review, edit, and track your active internship opportunities.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input 
              type="text"
              placeholder="Filter by role..."
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => navigate("/company/post")}>
            <Plus size={18} className="mr-1.5" /> Post Job
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-[var(--bg-tertiary)] animate-pulse rounded-2xl" />)}
        </div>
      ) : filteredInternships.length === 0 ? (
        <div className="text-center py-20 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
          <Building2 size={48} className="text-[var(--text-muted)] opacity-20 mx-auto mb-4" />
          <h3 className="font-bold text-[var(--text-primary)]">No postings yet</h3>
          <p className="text-[var(--text-muted)] text-sm mt-1">Start by creating your first internship opportunity.</p>
          <Button className="mt-6" onClick={() => navigate("/company/post")}>Create New Posting</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map((internship) => (
            <Card key={internship._id} className="group hover:border-[var(--brand-primary)] transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--brand-primary)] group-hover:scale-110 transition-transform">
                    <Building2 size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => deleteInternship(internship._id)} className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-danger)] transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] line-clamp-1">{internship.title}</h3>
                  <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                    <MapPin size={14} />
                    <span>{internship.location || 'Remote'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <Clock size={16} />
                    <span className="text-xs font-semibold">{internship.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <GraduationCap size={16} />
                    <span className="text-xs font-semibold">{internship.eligibility?.split(' ')[0] || 'All'} Years</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[var(--brand-primary)] font-bold text-sm">
                    <Users2 size={16} />
                    {internship.applicationsCount || 0} Applicants
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/company/applicants?job=${internship._id}`)}>
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyInternships;
