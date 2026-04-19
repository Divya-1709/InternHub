import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowRight, Mail } from "lucide-react";
import API from "../api/axios";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setPreviewUrl("");

    try {
      const response = await API.post("/auth/forgot-password", { email });
      toast.success(response.data.message);
      if (response.data.previewUrl) {
        setPreviewUrl(response.data.previewUrl);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Password Recovery"
      title="Reset access without waiting on support."
      description="We’ll send a secure reset link so you can get back into your workspace quickly."
      sideLabel="Account Security"
      sideTitle="Fast recovery, still locked down."
      sideCopy="InternHub keeps the recovery flow short and clear, with signed reset links and a focused handoff back into the product."
      footer={
        <p className="text-sm text-white/55">
          Remembered your password?{" "}
          <Link to="/login" className="font-medium text-white transition hover:text-white/80">
            Return to login
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Work email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="h-12 rounded-2xl border-white/20 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-white/40"
        />

        <Button type="submit" className="h-12 w-full rounded-2xl" isLoading={isLoading}>
          Send reset link
          {!isLoading ? <ArrowRight size={16} className="ml-2" /> : null}
        </Button>
      </form>

      {previewUrl ? (
        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100/80">
          <div className="mb-2 flex items-center gap-2 font-medium text-emerald-100">
            <Mail size={14} />
            Development preview link
          </div>
          <a className="break-all underline underline-offset-4" href={previewUrl}>
            {previewUrl}
          </a>
        </div>
      ) : null}
    </AuthShell>
  );
};

export default ForgotPassword;
