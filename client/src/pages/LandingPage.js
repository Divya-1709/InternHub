import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Target,
  Calendar,
  ShieldCheck,
  BarChart3,
  MessageSquare,
  Star,
  Zap
} from "lucide-react";
import Navbar from "../components/Navbar";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: Target,
      title: "Smart Matching",
      desc: "Match students with stronger-fit opportunities using skills, interests, and profile depth."
    },
    {
      icon: Calendar,
      title: "Auto Scheduling",
      desc: "Move from shortlist to interview faster with scheduling that feels automatic instead of manual."
    },
    {
      icon: ShieldCheck,
      title: "Verification Layer",
      desc: "Keep company validation and trust workflows intact while polishing the entire front door."
    },
    {
      icon: BarChart3,
      title: "Live Analytics",
      desc: "Track applications, conversion rate, and operational throughput from the same system."
    },
    {
      icon: MessageSquare,
      title: "Shared Communication",
      desc: "Give students and companies one place to stay aligned from application to interview."
    },
    {
      icon: Star,
      title: "Stronger First Impression",
      desc: "The redesigned public pages create a more premium brand feel before users even log in."
    }
  ];

  return (
    <div className="public-palette min-h-screen bg-[var(--bg-primary)] text-white selection:bg-white selection:text-black">
      <Navbar />

      <section className="relative overflow-hidden pb-20 pt-32 lg:pb-32 lg:pt-44">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_28%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 text-center">
          <motion.div {...fadeIn}>
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/74">
              <Zap size={14} />
              Vercel-inspired internship operations
            </span>
            <h1 className="mb-8 font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-white lg:text-7xl">
              Ship a cleaner hiring journey
              <br />
              <span className="text-white/54">for students and companies.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-lg leading-8 text-white/62 lg:text-xl">
              InternHub now opens with a sharper, darker launch surface inspired by modern product sites, while keeping your existing dashboards, matching, scheduling, and verification workflow intact.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="h-14 rounded-full px-10 text-base" onClick={() => navigate("/register")}>
                Start free
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="h-14 rounded-full px-10 text-base" onClick={() => navigate("/login")}>
                Open workspace
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative mx-auto mt-20 max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-[#050505] shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
          >
            <div className="grid gap-0 border-b border-white/10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r">
                <div className="mb-6 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/70" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/70" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/70" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Applications synced", value: "1,284" },
                    { label: "Shortlist conversion", value: "38%" },
                    { label: "Average review time", value: "12m" }
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left">
                      <div className="text-sm text-white/42">{item.label}</div>
                      <div className="mt-3 font-heading text-3xl text-white">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 text-left">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-white/55">Pipeline health</p>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                      Stable
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[72, 56, 84, 68, 91, 77].map((width, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-16 text-xs text-white/30">Week {index + 1}</div>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
                          <div className="h-full rounded-full bg-white" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8 text-left">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/32">Live activity</p>
                  <div className="mt-6 space-y-4">
                    {[
                      "Google sign-in enabled for new applicants",
                      "Campus Ops scheduled 12 interviews automatically",
                      "Verification queue reduced by 41%"
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-white" />
                        <p className="text-sm leading-6 text-white/68">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: "Student Workspaces", value: "Live" },
              { label: "Company Reviews", value: "Managed" },
              { label: "Interview Flow", value: "Connected" },
              { label: "Admin Oversight", value: "Active" }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-1 font-heading text-3xl font-semibold text-white">{stat.value}</div>
                <div className="text-sm uppercase tracking-[0.2em] text-white/36">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <h2 className="font-heading mb-6 text-3xl font-semibold tracking-[-0.04em] text-white lg:text-5xl">
              Everything you need, minus the clutter.
            </h2>
            <p className="text-lg text-white/58">A more refined launch experience on top of the platform you already built.</p>
          </div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeIn}>
                <Card className="h-full border-white/10 bg-white/[0.03] transition-transform hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                  <CardContent className="p-8">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white">
                      <feature.icon size={24} />
                    </div>
                    <h3 className="mb-4 font-heading text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-white/56 lg:text-base">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] px-8 py-16 text-center lg:px-16 lg:py-24">
            <div className="absolute inset-0 opacity-70">
              <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-white/10 blur-[110px]" />
              <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/5 blur-[110px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl">
              <h2 className="font-heading mb-8 text-3xl font-semibold tracking-[-0.04em] text-white lg:text-5xl">
                A better front door, with the rest of the system still connected.
              </h2>
              <p className="mb-10 text-lg leading-relaxed text-white/58">
                Students can sign in with Google, recover access faster, and land in the same dashboards your existing backend already supports.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="h-14 w-full rounded-full px-10 text-base sm:w-auto" onClick={() => navigate("/register")}>
                  Create Free Account
                </Button>
                <Button variant="outline" size="lg" className="h-14 w-full rounded-full px-10 text-base sm:w-auto" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-3">
          {[
            {
              title: "Public pages that feel premium",
              copy: "The landing and auth screens now use a darker high-contrast visual language with grid texture, glow, and tighter typography."
            },
            {
              title: "OAuth plus password recovery",
              copy: "Google sign-in is wired front to back, and users can request reset links without needing manual admin support."
            },
            {
              title: "Role-aware routing preserved",
              copy: "Students, companies, and admins still land in the correct workspace after login, whether they use email or Google."
            }
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <h3 className="font-heading text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/56">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 flex flex-col items-start justify-between gap-12 md:flex-row">
            <div className="max-w-xs">
              <Link to="/" className="font-heading mb-6 block text-2xl font-semibold tracking-tight text-white">
                InternHub
              </Link>
              <p className="text-sm leading-relaxed text-white/45">
                The internship management platform with a cleaner launch surface, role-aware auth, and less friction across onboarding.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 lg:gap-24">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-white/32">Platform</h4>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-sm text-white/48 transition-colors hover:text-white">Features</a></li>
                  <li><a href="#how-it-works" className="text-sm text-white/48 transition-colors hover:text-white">How it Works</a></li>
                  <li><a href="#benefits" className="text-sm text-white/48 transition-colors hover:text-white">Benefits</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-white/32">Access</h4>
                <ul className="space-y-2">
                  <li><Link to="/login" className="text-sm text-white/48 transition-colors hover:text-white">Login</Link></li>
                  <li><Link to="/register" className="text-sm text-white/48 transition-colors hover:text-white">Register</Link></li>
                  <li><Link to="/forgot-password" className="text-sm text-white/48 transition-colors hover:text-white">Reset Password</Link></li>
                </ul>
              </div>
              <div className="hidden space-y-4 sm:block">
                <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-white/32">Status</h4>
                <ul className="space-y-2">
                  <li><span className="text-sm text-white/48">OAuth ready</span></li>
                  <li><span className="text-sm text-white/48">Password recovery ready</span></li>
                  <li><span className="text-sm text-white/48">Role-based dashboards intact</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
            <p className="text-sm text-white/32">© 2026 InternHub. All rights reserved.</p>
            <div className="flex gap-6">
              <div className="h-5 w-5 rounded-full bg-white/18" />
              <div className="h-5 w-5 rounded-full bg-white/18" />
              <div className="h-5 w-5 rounded-full bg-white/18" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
