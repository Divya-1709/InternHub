import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowRight, ShieldCheck } from "lucide-react";
import API from "../api/axios";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await API.post("/auth/reset-password", {
        token,
        password
      });

      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Secure Reset"
      title="Choose a new password."
      description="Keep it at least 8 characters and make it something you won’t reuse elsewhere."
      sideLabel="Protection Layer"
      sideTitle="Short-lived reset tokens. Clean re-entry."
      sideCopy="This flow is designed to get people back into their account quickly while keeping the reset surface narrow and time-bound."
      footer={
        <p className="text-sm text-white/55">
          Need a fresh email?{" "}
          <Link to="/forgot-password" className="font-medium text-white transition hover:text-white/80">
            Request another reset link
          </Link>
        </p>
      }
    >
      {!token ? (
        <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-100/85">
          This reset link is missing its token. Open the link from your email again or request a new one.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="New password"
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="h-12 rounded-2xl border-white/20 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-white/40"
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="Repeat your new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            className="h-12 rounded-2xl border-white/20 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-white/40"
          />

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/62">
            <div className="mb-2 flex items-center gap-2 font-medium text-white">
              <ShieldCheck size={15} />
              Password guidance
            </div>
            Use a unique password with at least 8 characters for the best protection.
          </div>

          <Button type="submit" className="h-12 w-full rounded-2xl" isLoading={isLoading}>
            Update password
            {!isLoading ? <ArrowRight size={16} className="ml-2" /> : null}
          </Button>
        </form>
      )}
    </AuthShell>
  );
};

export default ResetPassword;
