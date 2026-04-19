import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  Banknote,
  Send,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import Input from "../components/ui/Input";

const PostInternship = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    stipend: "",
    location: "",
    eligibility: "",
    registrationFee: "",
    type: "Full-time"
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/internship/create", formData);
      toast.success("Internship posted successfully!");
      navigate("/company/internships");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post internship");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-[var(--text-primary)]">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/company/internships")}>
          <ChevronLeft size={16} /> Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Post New Opportunity</h1>
      </div>

      <div className="flex items-center justify-between relative px-2">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-[var(--bg-tertiary)] z-0" />
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-all duration-500 border-4 border-[var(--bg-primary)] ${
              step >= s ? 'bg-[var(--brand-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      <Card className="border-none shadow-xl shadow-indigo-500/5 bg-[var(--bg-secondary)]">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-4 text-[var(--brand-primary)]">
                    <Briefcase size={20} />
                    <h3 className="text-xl font-bold">Role Details</h3>
                  </div>
                  <Input 
                    label="Internship Title"
                    name="title"
                    placeholder="e.g. Full Stack Developer Intern"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="Location"
                      name="location"
                      placeholder="e.g. Remote or Bangalore, India"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold ml-0.5">Internship Type</label>
                      <select 
                        name="type"
                        className="w-full h-10 px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all appearance-none"
                        value={formData.type}
                        onChange={handleInputChange}
                      >
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Alternative</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-4 text-[var(--brand-primary)]">
                    <FileText size={20} />
                    <h3 className="text-xl font-bold">Duration & Requirements</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="Duration"
                      name="duration"
                      placeholder="e.g. 6 Months"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                    />
                    <Input 
                      label="Eligibility"
                      name="eligibility"
                      placeholder="e.g. B.Tech 3rd/4th Year"
                      value={formData.eligibility}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold ml-0.5">Job Description</label>
                    <textarea 
                      name="description"
                      rows="4"
                      placeholder="Detail the responsibilities and requirements..."
                      className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all resize-none"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-4 text-[var(--brand-primary)]">
                    <Banknote size={20} />
                    <h3 className="text-xl font-bold">Financials</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="Monthly Stipend (₹)"
                      name="stipend"
                      placeholder="e.g. 15,000"
                      value={formData.stipend}
                      onChange={handleInputChange}
                      required
                    />
                    <Input 
                      label="Registration Fee (₹)"
                      name="registrationFee"
                      placeholder="e.g. 500"
                      value={formData.registrationFee}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)]">
                     <p className="text-xs text-[var(--text-muted)] leading-relaxed italic">
                       Professional Tip: Providing a competitive stipend and clear registration fee transparency increases applicant quality by up to 40%.
                     </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-8 border-t border-[var(--border-color)] flex justify-between">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ChevronLeft size={18} className="mr-1" /> Previous
                </Button>
              ) : (
                <div />
              )}
              
              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next Step <ChevronRight size={18} className="ml-1" />
                </Button>
              ) : (
                <Button type="submit" isLoading={loading} className="px-8 shadow-lg shadow-indigo-500/20">
                  <Send size={18} className="mr-2" /> Publish Opportunity
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostInternship;
