import React, { useState, useEffect } from "react";
import { 
  Banknote, 
  Search, 
  ArrowUpRight, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";

const CompanyPayouts = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulated fetch - replace with real API call if backend implemented
    setTimeout(() => {
      setPayments([
        { id: 1, student: "Alice Smith", internship: "Frontend Dev", amount: 15000, date: "2024-03-15", status: "Processed" },
        { id: 2, student: "Bob Johnson", internship: "UI Design", amount: 12000, date: "2024-03-20", status: "Pending" },
        { id: 3, student: "Charlie Brown", internship: "Backend Eng", amount: 18000, date: "2024-03-25", status: "Processed" },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const stats = {
    totalPaid: 33000,
    upcoming: 12000,
    partners: 3,
    growth: "+14%"
  };

  return (
    <div className="space-y-8 text-[var(--text-primary)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stipend Management</h1>
          <p className="text-[var(--text-muted)] mt-1">Track financial transactions and upcoming intern payouts.</p>
        </div>
        <Button variant="outline">
          <Calendar size={18} className="mr-2" /> Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[var(--brand-primary)] border-none shadow-lg text-white group overflow-hidden relative">
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Banknote size={20} />
              </div>
              <ArrowUpRight size={20} className="text-white/50 group-hover:text-white transition-colors" />
            </div>
            <div className="text-2xl font-black">₹{stats.totalPaid.toLocaleString()}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/70 mt-1">Total Disbursed</div>
          </CardContent>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        </Card>

        {[
          { label: 'Upcoming Payouts', value: `₹${stats.upcoming.toLocaleString()}`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Active Payrolls', value: stats.partners, icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Platform Growth', value: stats.growth, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-[var(--bg-secondary)]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border-color)] flex flex-col md:flex-row justify-between gap-4">
          <h3 className="font-bold text-lg">Transaction History</h3>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
            <input 
              type="text"
              placeholder="Filter by student..."
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--bg-tertiary)]/50">
                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Intern Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Internship Role</th>
                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-8"><div className="h-4 bg-[var(--bg-tertiary)] rounded w-full" /></td>
                  </tr>
                ))
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-[var(--text-muted)]">No transactions found.</td>
                </tr>
              ) : (
                payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-sm">{pay.student}</td>
                    <td className="px-6 py-4 text-xs font-medium text-[var(--text-muted)]">{pay.internship}</td>
                    <td className="px-6 py-4 font-black text-sm">₹{pay.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${
                        pay.status === 'Processed' ? 'bg-[var(--success-bg)] text-[var(--success-text)]' : 'bg-[var(--warning-bg)] text-[var(--warning-text)]'
                      }`}>
                        {pay.status === 'Processed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs font-bold text-[var(--text-muted)]">{pay.date}</td>
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
