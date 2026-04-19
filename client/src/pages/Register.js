import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import AuthShell from "../components/auth/AuthShell";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import { getDashboardRoute, persistAuth } from "../utils/auth";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await API.post("/auth/register", formData);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async (credential) => {
    setIsLoading(true);

    try {
      const response = await API.post("/auth/google", {
        credential,
        role: formData.role
      });
      persistAuth(response.data);
      toast.success("Account created with Google");
      navigate(getDashboardRoute(response.data.role));
    } catch (error) {
      toast.error(error.response?.data?.message || "Google sign-up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Create Account"
      title="Launch your hiring or internship journey."
      description="Set your account up once, then move through applications, interviews, and verification with a cleaner workflow."
      sideLabel="Onboarding"
      sideTitle="Built to feel more premium from the first click."
      sideCopy="The redesigned signup flow keeps the product feeling modern while still supporting your role-based routing and backend requirements."
      footer={
        <p className="text-sm text-white/55">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-white transition hover:text-white/80">
            Sign in
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
          {["student", "company"].map((roleOption) => (
            <button
              key={roleOption}
              type="button"
              onClick={() => setFormData({ ...formData, role: roleOption })}
              className={`rounded-xl px-3 py-2.5 text-sm font-medium capitalize transition ${
                formData.role === roleOption ? "bg-white text-black" : "text-white/60 hover:text-white"
              }`}
            >
              {roleOption}
            </button>
          ))}
        </div>

        <GoogleSignInButton onCredential={handleGoogleSignUp} text="signup_with" disabled={isLoading} />

        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/28">
          <div className="h-px flex-1 bg-white/10" />
          Or continue with email
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Full name"
            name="name"
            placeholder="John Doe"
            onChange={handleChange}
            required
            className="h-12 rounded-2xl border-white/20 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-white/40"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="name@example.com"
            onChange={handleChange}
            required
            className="h-12 rounded-2xl border-white/20 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-white/40"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            onChange={handleChange}
            required
            className="h-12 rounded-2xl border-white/20 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-white/40"
          />

          <Button type="submit" className="mt-2 h-12 w-full rounded-2xl" isLoading={isLoading}>
            Create account
            {!isLoading ? <ArrowRight size={16} className="ml-2" /> : null}
          </Button>
        </form>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-[13px] leading-6 text-white/55">
          <div className="mb-2 flex items-center gap-2 font-medium text-white">
            <ShieldCheck size={15} />
            Security and trust
          </div>
          Company accounts can still go through verification after signup, and Google accounts can also set a password later with the reset flow.
        </div>
      </div>
    </AuthShell>
  );
};

export default Register;
