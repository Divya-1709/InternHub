import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import AuthShell from "../components/auth/AuthShell";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import { getDashboardRoute, persistAuth } from "../utils/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await API.post("/auth/login", { email, password, role });
      persistAuth(response.data);
      toast.success(`Welcome back, ${response.data.name || response.data.role}!`);
      navigate(getDashboardRoute(response.data.role));
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (credential) => {
    setIsLoading(true);

    try {
      const response = await API.post("/auth/google", { credential, role });
      persistAuth(response.data);
      toast.success(`Signed in with Google as ${response.data.role}`);
      navigate(getDashboardRoute(response.data.role));
    } catch (error) {
      toast.error(error.response?.data?.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Workspace Access"
      title="Log in to the internship operating system."
      description="A cleaner control surface for students, companies, and admins. Pick your role, continue with Google, or use your password."
      sideLabel="Public Experience"
      sideTitle="A sharper front door for the whole platform."
      sideCopy="The public auth experience now mirrors a more premium product launch surface: darker contrast, tighter typography, clearer hierarchy, and less friction from entry to dashboard."
      footer={
        <div className="flex flex-col gap-3 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-white transition hover:text-white/80">
              Create one
            </Link>
          </span>
          <Link to="/forgot-password" className="font-medium text-white transition hover:text-white/80">
            Forgot password?
          </Link>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
          {["student", "company", "admin"].map((currentRole) => (
            <button
              key={currentRole}
              type="button"
              onClick={() => setRole(currentRole)}
              className={`rounded-xl px-3 py-2.5 text-sm font-medium capitalize transition ${
                role === currentRole ? "bg-white text-black" : "text-white/60 hover:text-white"
              }`}
            >
              {currentRole}
            </button>
          ))}
        </div>

        <GoogleSignInButton onCredential={handleGoogleSignIn} disabled={isLoading} />

        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/28">
          <div className="h-px flex-1 bg-white/10" />
          Or continue with email
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="h-12 rounded-2xl border-white/20 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-white/40"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="h-12 rounded-2xl border-white/20 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-white/40"
          />

          <Button type="submit" className="h-12 w-full rounded-2xl" isLoading={isLoading}>
            Sign in
            {!isLoading ? <ArrowRight size={16} className="ml-2" /> : null}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
};

export default Login;
