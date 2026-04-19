import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronLeft, 
  Building2, 
  Clock, 
  BadgeCheck,
  Smartphone,
  Globe,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

const PaymentPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const loadData = React.useCallback(async () => {
    try {
      const appRes = await API.get("/application/my");
      const app = appRes.data.find((a) => a._id === applicationId);
      if (!app) {
        setLoading(false);
        return;
      }
      setApplication(app);

      const payRes = await API.get(`/payment/status/${applicationId}`);
      if (payRes.data.registrationFeePaid) {
        setPaymentSuccess(true);
        setTransactionId(payRes.data.registrationFeePayment?.razorpayPaymentId || "");
      }
    } catch (err) {
      toast.error("Failed to load payment details");
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "student") {
      navigate("/");
      return;
    }
    loadData();
    loadRazorpayScript();
  }, [navigate, loadData]);

  const handlePayNow = async () => {
    setProcessing(true);

    try {
      const orderRes = await API.post("/payment/create-order", { applicationId });
      const { orderId, amount, currency, keyId, internshipTitle, companyName, paymentId } = orderRes.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: companyName,
        description: `Registration Fee - ${internshipTitle}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: paymentId
            });
            setPaymentSuccess(true);
            setTransactionId(verifyRes.data.transactionId);
            toast.success("Payment successful!");
          } catch (verifyErr) {
            toast.error("Payment verification failed");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || ""
        },
        theme: { color: "#4f46e5" },
        modal: { ondismiss: () => setProcessing(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      toast.error("Failed to initiate payment");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--bg-tertiary)] border-t-[var(--brand-primary)] rounded-full animate-spin" />
        <p className="text-[var(--text-muted)] font-bold text-xs uppercase tracking-widest">Initialising Secure Checkout...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 text-[var(--text-primary)]">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/my-application')}>
            <ChevronLeft size={16} /> Back
          </Button>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Checkout</h1>
        </div>

        <AnimatePresence mode="wait">
          {paymentSuccess ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto">
               <Card className="text-center overflow-hidden border-none shadow-2xl shadow-emerald-100">
                  <div className="h-2 bg-emerald-500" />
                  <CardContent className="p-10 space-y-6">
                     <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                        <CheckCircle2 size={48} />
                     </div>
                     <div className="space-y-2">
                        <h2 className="text-3xl font-black text-slate-900">Payment Successful!</h2>
                        <p className="text-slate-500 font-medium">Your registration is verified and your placement is confirmed.</p>
                     </div>
                     
                     <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-4 border border-slate-100">
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-slate-500">Transaction ID</span>
                           <span className="font-mono font-bold text-slate-900">{transactionId}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-slate-500">Amount Paid</span>
                           <span className="font-black text-emerald-600 text-lg">₹{application?.internshipId?.registrationFee?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-slate-500">Status</span>
                           <span className="flex items-center gap-1 text-emerald-600 font-bold uppercase tracking-widest text-[10px]">
                              <BadgeCheck size={14} /> Confirmed
                           </span>
                        </div>
                     </div>

                     <div className="flex gap-3 pt-4">
                        <Button className="flex-1" onClick={() => navigate('/my-application')}>View Applications</Button>
                        <Button variant="outline" onClick={() => navigate('/student')}>Go to Dashboard</Button>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
               {/* Order Summary */}
               <div className="lg:col-span-12">
                  <Card className="border-slate-200 overflow-hidden shadow-xl shadow-slate-100">
                     <CardContent className="p-0 flex flex-col md:flex-row">
                        <div className="p-8 md:w-1/2 space-y-6">
                           <div className="space-y-1">
                              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Secure Order</h2>
                              <h3 className="text-2xl font-bold text-slate-900">{application?.internshipId?.title}</h3>
                           </div>

                           <div className="space-y-4">
                              <div className="flex items-center gap-3 text-slate-600">
                                 <Building2 size={18} className="text-slate-400" />
                                 <span className="text-sm font-medium">{application?.internshipId?.companyId?.companyName}</span>
                              </div>
                              <div className="flex items-center gap-3 text-slate-600">
                                 <Clock size={18} className="text-slate-400" />
                                 <span className="text-sm font-medium">{application?.internshipId?.duration} Intensive Internship</span>
                              </div>
                              <div className="flex items-center gap-3 text-emerald-600">
                                 <BadgeCheck size={18} />
                                 <span className="text-sm font-bold uppercase tracking-wider">Placement Approved</span>
                              </div>
                           </div>

                           <div className="pt-6 border-t border-slate-100 flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                              <div className="flex items-center gap-1.5"><Globe size={14} /> Online</div>
                              <div className="flex items-center gap-1.5"><Smartphone size={14} /> SMS Receipt</div>
                              <div className="flex items-center gap-1.5"><ShieldCheck size={14} /> 256-bit SSL</div>
                           </div>
                        </div>

                        <div className="p-10 md:w-1/2 bg-slate-900 text-white flex flex-col justify-center items-center text-center space-y-6">
                           <div className="space-y-2">
                              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Registration Fee</p>
                              <p className="text-5xl font-black italic">₹{application?.internshipId?.registrationFee?.toLocaleString()}</p>
                           </div>
                           
                           <div className="p-4 bg-white/5 rounded-2xl border border-white/10 w-full max-w-xs text-xs space-y-3">
                              <div className="flex items-center gap-3">
                                 <Wallet size={16} className="text-indigo-400" />
                                 <span>UPI, Credit/Debit Cards, NetBanking</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <CreditCard size={16} className="text-indigo-400" />
                                 <span>Secure Checkout via Razorpay</span>
                              </div>
                           </div>

                           <Button 
                             className="w-full h-14 text-lg font-black shadow-2xl shadow-indigo-500/20" 
                             onClick={handlePayNow}
                             isLoading={processing}
                           >
                              {processing ? 'Processing...' : 'Complete Payment'}
                           </Button>
                           
                           <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Subject to terms of service</p>
                        </div>
                     </CardContent>
                  </Card>
               </div>

               <div className="lg:col-span-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {[
                        { icon: ShieldCheck, title: "Verified Partners", desc: "All companies on our platform are verified for authenticity and workspace quality." },
                        { icon: BadgeCheck, title: "Official Certification", desc: "Get an industry-recognised certificate upon successful completion of your internship." },
                        { icon: Smartphone, title: "Real-time Alerts", desc: "Receive immediate updates on your application status and interview schedules via SMS." }
                     ].map((feat, i) => (
                        <div key={i} className="flex gap-4 p-4 border border-slate-100 rounded-2xl bg-white">
                           <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                              <feat.icon size={20} />
                           </div>
                           <div className="space-y-1">
                              <h4 className="text-xs font-black uppercase tracking-tight text-slate-900">{feat.title}</h4>
                              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

export default PaymentPage;
