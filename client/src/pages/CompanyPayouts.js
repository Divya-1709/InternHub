import React, { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import {
  Banknote,
  BarChart3,
  CheckCircle2,
  Clock,
  Search,
  TrendingUp
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "../components/ui/Card";

const CompanyPayouts = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await API.get("/payment/company-payments");
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load payout records");
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = useMemo(
    () =>
      payments.filter((payment) => {
        const studentName = payment.studentId?.name || "";
        const internshipTitle = payment.internshipId?.title || "";
        return (
          studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internshipTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }),
    [payments, searchTerm]
  );

  const stats = useMemo(() => {
    const stipendPayments = payments.filter((payment) => payment.paymentType === "Stipend");
    const completedStipends = stipendPayments.filter((payment) => payment.status === "Completed");
    const pendingPayments = payments.filter((payment) => payment.status === "Pending");
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTotal = completedStipends
      .filter((payment) => payment.paidAt && new Date(payment.paidAt).toISOString().slice(0, 7) === currentMonth)
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    return {
      totalPaid: completedStipends.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
      upcoming: pendingPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
      activePayrolls: new Set(completedStipends.map((payment) => payment.studentId?._id).filter(Boolean)).size,
      monthlyTotal
    };
  }, [payments]);

  return (
    <div className="space-y-8 text-[var(--text-primary)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stipend Management</h1>
          <p className="mt-1 text-[var(--text-muted)]">Track registration fees, stipend payouts, and payment status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-none bg-[var(--brand-primary)] text-white shadow-lg">
          <CardContent className="relative z-10 p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-lg bg-white/10 p-2">
                <Banknote size={20} />
              </div>
            </div>
            <div className="text-2xl font-black">Rs {stats.totalPaid.toLocaleString()}</div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/70">Total Stipends Paid</div>
          </CardContent>
          <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        </Card>

        {[
          { label: "Pending Payments", value: `Rs ${stats.upcoming.toLocaleString()}`, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Active Payrolls", value: stats.activePayrolls, icon: BarChart3, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Paid This Month", value: `Rs ${stats.monthlyTotal.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" }
        ].map((stat) => (
          <Card key={stat.label} className="bg-[var(--bg-secondary)] shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-color)] p-6 md:flex-row">
          <h3 className="text-lg font-bold">Transaction History</h3>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
            <input
              type="text"
              placeholder="Filter by student or role..."
              className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] py-2 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--bg-tertiary)]/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Intern</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Internship</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Type</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-8">
                      <div className="h-4 w-full rounded bg-[var(--bg-tertiary)]" />
                    </td>
                  </tr>
                ))
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-[var(--text-muted)]">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="transition-colors hover:bg-[var(--bg-tertiary)]/30">
                    <td className="px-6 py-4 text-sm font-bold">{payment.studentId?.name || "Unknown student"}</td>
                    <td className="px-6 py-4 text-xs font-medium text-[var(--text-muted)]">{payment.internshipId?.title || "Unknown internship"}</td>
                    <td className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">{payment.paymentType}</td>
                    <td className="px-6 py-4 text-sm font-black">Rs {Number(payment.amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                          payment.status === "Completed"
                            ? "bg-[var(--success-bg)] text-[var(--success-text)]"
                            : "bg-[var(--warning-bg)] text-[var(--warning-text)]"
                        }`}
                      >
                        {payment.status === "Completed" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs font-bold text-[var(--text-muted)]">
                      {payment.paidAt || payment.createdAt ? new Date(payment.paidAt || payment.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyPayouts;
