import React from "react";
import { Link } from "react-router-dom";

const AuthShell = ({ badge, title, description, sideLabel, sideTitle, sideCopy, children, footer }) => {
  return (
    <div className="public-palette relative min-h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_35%),linear-gradient(180deg,_rgba(255,255,255,0.05),_transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-heading text-xl font-semibold tracking-tight text-white">
            InternHub
          </Link>
          <Link
            to="/landing"
            className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Back to overview
          </Link>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="hidden lg:block">
            <div className="max-w-xl">
              <div className="mb-6 inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-white/70">
                {sideLabel}
              </div>
              <h1 className="font-heading text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white">
                {sideTitle}
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-white/62">{sideCopy}</p>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Applications", value: "24k+" },
                  { label: "Partner teams", value: "640" },
                  { label: "Time saved", value: "73%" }
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <p className="font-heading text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-2 text-sm text-white/55">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl">
            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-3 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="rounded-[28px] border border-white/10 bg-[#0b0b0d]/92 p-6 sm:p-8">
                <div className="mb-8">
                  <div className="inline-flex rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-white/65">
                    {badge}
                  </div>
                  <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-white">
                    {title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/58">{description}</p>
                </div>
                {children}
                {footer ? <div className="mt-8 border-t border-white/10 pt-6">{footer}</div> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
