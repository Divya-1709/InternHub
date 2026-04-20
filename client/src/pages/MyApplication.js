import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Clock, 
  CreditCard, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Receipt,
  Calendar
} from 'lucide-react';
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/Card";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "student") {
      navigate("/");
      return;
    }
    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await API.get("/application/my");
      setApplications(res.data);
      
      // Fetch payment status for each application
      const paymentPromises = res.data.map(async (app) => {
        try {
          const payRes = await API.get(`/payment/status/${app._id}`);
          return { id: app._id, status: payRes.data };
        } catch (err) {
          return { id: app._id, status: null };
        }
      });

      const results = await Promise.all(paymentPromises);
      const statuses = {};
      results.forEach(r => statuses[r.id] = r.status);
      setPaymentStatuses(statuses);
    } catch (err) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Approved': return { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'Rejected': return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' };
      case 'Shortlisted': return { icon: HelpCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' };
      default: return { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
    }
  };

  return (
    <div className="w-full space-y-8 text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">My Applications</h1>
            <p className="text-[var(--text-muted)] mt-1">Track the status of your internship applications and payments.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/student')}>
            Browse More Jobs
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />)}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No applications found</h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto">You haven't applied for any internships yet. Start your journey today!</p>
            <Button className="mt-6" onClick={() => navigate('/student')}>Explore Opportunities</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((app) => {
              const statusInfo = getStatusInfo(app.status);
              const internship = app.internshipId;
              const payStatus = paymentStatuses[app._id];
              
              return (
                <Card key={app._id} className="hover:shadow-md transition-shadow border-slate-200">
                  <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/30">
                    <div className="flex justify-between items-start mb-2">
                       <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                         <statusInfo.icon size={12} />
                         {app.status}
                       </span>
                       {internship?.internshipType === "FeeRequired" && (
                         <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded uppercase tracking-widest border border-amber-100 flex items-center gap-1">
                           <DollarSign size={10} /> Paid Role
                         </span>
                       )}
                       {internship?.internshipType === "StipendBased" && (
                         <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase tracking-widest border border-emerald-100 flex items-center gap-1">
                           <CreditCard size={10} /> Stipend Provided
                         </span>
                       )}
                    </div>
                    <CardTitle className="text-xl line-clamp-1">{internship?.title}</CardTitle>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                      <Building2 size={14} />
                      {internship?.companyId?.companyName || 'Verified Partner'}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pb-6 space-y-4">
                    <div className="flex justify-between text-xs font-medium">
                      <div className="text-slate-500 flex items-center gap-1.5">
                        <Calendar size={14} />
                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-slate-700">
                        {internship?.duration} Duration
                      </div>
                    </div>

                    {/* Payment Status Bar */}
                    {internship?.internshipType === "FeeRequired" && (
                      <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                        payStatus?.registrationFeePaid ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-slate-50 border-slate-100 text-slate-900'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={payStatus?.registrationFeePaid ? 'text-emerald-600' : 'text-slate-400'}>
                            {payStatus?.registrationFeePaid ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                          </div>
                          <div>
                            <p className="text-xs font-bold leading-none">Registration Fee</p>
                            <p className="text-[10px] mt-1 opacity-70">
                              {payStatus?.registrationFeePaid ? 'Successfully processed' : `₹${internship.registrationFee?.toLocaleString()} pending`}
                            </p>
                          </div>
                        </div>
                        {app.status === "Approved" && !payStatus?.registrationFeePaid ? (
                          <Button size="sm" className="h-8 px-4 text-xs" onClick={() => navigate(`/payment/${app._id}`)}>
                            Pay Now
                          </Button>
                        ) : payStatus?.registrationFeePaid && (
                          <Button variant="ghost" size="sm" className="h-8 text-xs text-emerald-700 hover:bg-emerald-100" onClick={() => navigate(`/payment/${app._id}`)}>
                            <Receipt size={14} className="mr-1" />
                            Receipt
                          </Button>
                        )}
                      </div>
                    )}

                    {internship?.internshipType === "StipendBased" && (
                      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-indigo-900">
                        <div className="flex items-center gap-3">
                          <div className="text-indigo-600">
                            <CreditCard size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold leading-none">Monthly Stipend</p>
                            <p className="text-[10px] mt-1 opacity-70">
                              ₹{internship.stipendAmount?.toLocaleString()} / month promised
                            </p>
                          </div>
                        </div>
                        {payStatus?.totalStipendPaid > 0 && (
                          <span className="text-[10px] font-bold bg-white px-2 py-1 rounded shadow-sm">
                            ₹{payStatus.totalStipendPaid.toLocaleString()} Paid
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 border-none bg-transparent">
                    <Button variant="ghost" className="w-full text-slate-500 hover:text-indigo-600 text-sm h-11" onClick={() => navigate("/student/interviews")}>
                      View Application History
                      <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
  );
};

export default MyApplications;
