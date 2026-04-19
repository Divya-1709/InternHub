import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  Users2, 
  Building2, 
  Calendar,
  CheckCircle2,
  ChevronRight,
  Plus,
  Star
} from 'lucide-react';
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

const CompanyDashboard = () => {
  const [applicants, setApplicants] = useState([]);
  const [myInternships, setMyInternships] = useState([]);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const profileRes = await API.get("/company/profile");
      setCompanyProfile(profileRes.data);
      
      const [appRes, intRes] = await Promise.all([
        API.get("/application/company"),
        API.get("/internship/company")
      ]);
      
      setApplicants(Array.isArray(appRes.data) ? appRes.data : []);
      setMyInternships(Array.isArray(intRes.data) ? intRes.data : []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-[var(--text-primary)]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            {companyProfile ? `Welcome, ${companyProfile.name || 'Partner'}` : 'Company Dashboard'}
          </h1>
          <p className="text-[var(--text-muted)] mt-1">Manage your internships, applicants, and talent pool.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate('/company/interviews')}>
            <Calendar size={16} className="mr-2" />
            Interviews
          </Button>
          <Button size="sm" onClick={() => navigate('/company/post')}>
            <Plus size={16} className="mr-2" />
            Post Internship
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-[var(--bg-secondary)] rounded-2xl" />)}
        </div>
      ) : (
        <>
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Applicants', value: applicants.length, icon: Users2, color: 'text-blue-600', bg: 'bg-blue-50', link: '/company/applicants' },
              { label: 'Active Jobs', value: myInternships.length, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/company/internships' },
              { label: 'Shortlisted', value: applicants.filter(a => a.status === 'Shortlisted').length, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', link: '/company/applicants' },
              { label: 'Success Rate', value: '92%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((stat, i) => (
              <Card key={i} className="border-none shadow-sm bg-[var(--bg-secondary)] hover:shadow-md transition-all cursor-pointer" onClick={() => stat.link && navigate(stat.link)}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                    <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)]">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {applicants.slice(0, 3).map((app, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-[var(--bg-tertiary)]/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center text-xs font-bold">
                        {app.studentId?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{app.studentId?.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Applied for {app.internshipId?.title}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[var(--brand-primary)]">{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
                {applicants.length === 0 && (
                  <div className="text-center py-10 text-[var(--text-muted)] italic text-sm">No recent activity</div>
                )}
                <Button variant="ghost" className="w-full text-xs" onClick={() => navigate('/company/applicants')}>
                  View All Applicants <ChevronRight size={14} className="ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)]">
              <CardHeader>
                <CardTitle className="text-lg">Internship Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end gap-3 px-4">
                   {[60, 40, 80, 50, 90, 70, 100].map((h, i) => (
                     <div key={i} className="flex-1 bg-[var(--brand-primary)] opacity-20 rounded-t-md hover:opacity-100 transition-all cursor-help" style={{ height: `${h}%` }} title={`Day ${i+1}: ${h} views`} />
                   ))}
                </div>
                <div className="flex justify-between mt-4 text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest px-2">
                   <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyDashboard;
