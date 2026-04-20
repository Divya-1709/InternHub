import React, { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Plus,
  Star,
  Users2
} from "lucide-react";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

const normalizeStatus = (status) => (status === "Applied" ? "Pending" : status || "Pending");

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

  const shortlistCount = applicants.filter((app) => normalizeStatus(app.status) === "Shortlisted").length;
  const approvedCount = applicants.filter((app) => normalizeStatus(app.status) === "Approved").length;
  const conversionRate = applicants.length ? `${Math.round((approvedCount / applicants.length) * 100)}%` : "0%";

  const weeklyApplicantBars = useMemo(() => {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const counts = labels.map(() => 0);

    applicants.forEach((app) => {
      const date = new Date(app.createdAt);
      const dayIndex = (date.getDay() + 6) % 7;
      counts[dayIndex] += 1;
    });

    const max = Math.max(...counts, 1);
    return labels.map((label, index) => ({
      label,
      count: counts[index],
      height: `${Math.max((counts[index] / max) * 100, counts[index] ? 18 : 8)}%`
    }));
  }, [applicants]);

  return (
    <div className="space-y-8 text-[var(--text-primary)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            {companyProfile ? `Welcome, ${companyProfile.companyName || "Partner"}` : "Company Dashboard"}
          </h1>
          <p className="mt-1 text-[var(--text-muted)]">Manage your internships, applicants, interviews, and hiring pipeline.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate("/company/interviews")}>
            <Calendar size={16} className="mr-2" />
            Interviews
          </Button>
          <Button size="sm" onClick={() => navigate("/company/post")}>
            <Plus size={16} className="mr-2" />
            Post Internship
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-[var(--bg-secondary)]" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Total Applicants",
                value: applicants.length,
                icon: Users2,
                color: "text-blue-600",
                bg: "bg-blue-50",
                link: "/company/applicants"
              },
              {
                label: "Active Jobs",
                value: myInternships.length,
                icon: Building2,
                color: "text-indigo-600",
                bg: "bg-indigo-50",
                link: "/company/internships"
              },
              {
                label: "Shortlisted",
                value: shortlistCount,
                icon: Star,
                color: "text-amber-600",
                bg: "bg-amber-50",
                link: "/company/applicants"
              },
              {
                label: "Approval Rate",
                value: conversionRate,
                icon: CheckCircle2,
                color: "text-emerald-600",
                bg: "bg-emerald-50"
              }
            ].map((stat) => (
              <Card
                key={stat.label}
                className="cursor-pointer border-none bg-[var(--bg-secondary)] shadow-sm transition-all hover:shadow-md"
                onClick={() => stat.link && navigate(stat.link)}
              >
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="bg-[var(--bg-secondary)]">
              <CardHeader>
                <CardTitle className="text-lg">Recent Applicants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {applicants.slice(0, 4).map((app) => (
                  <div key={app._id} className="flex items-center justify-between rounded-lg bg-[var(--bg-tertiary)]/70 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-primary)] text-xs font-bold text-white">
                        {app.studentId?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--text-primary)]">{app.studentId?.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Applied for {app.internshipId?.title}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                      {normalizeStatus(app.status)}
                    </span>
                  </div>
                ))}
                {applicants.length === 0 && (
                  <div className="py-10 text-center text-sm italic text-[var(--text-muted)]">No applicants yet.</div>
                )}
                <Button variant="ghost" className="w-full text-xs" onClick={() => navigate("/company/applicants")}>
                  View All Applicants <ChevronRight size={14} className="ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[var(--bg-secondary)]">
              <CardHeader>
                <CardTitle className="text-lg">Applications This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-48 items-end gap-3 px-4">
                  {weeklyApplicantBars.map((bar) => (
                    <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-md bg-[var(--brand-primary)]/25 transition-all hover:bg-[var(--brand-primary)]"
                        style={{ height: bar.height }}
                        title={`${bar.label}: ${bar.count} applications`}
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{bar.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-[var(--text-muted)]">
                  {applicants.length} total applications across {myInternships.length} internship postings.
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
