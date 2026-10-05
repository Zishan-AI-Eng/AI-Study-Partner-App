"use client";

import { BarChart3, FileText, Moon, Sparkles, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import AuthMobileShell from "./AuthMobileShell";
import Logo from "@/components/brand/Logo";

const features: Array<[LucideIcon, string, string]> = [
  [Sparkles, "AI summaries", "Get a clear summary and key points from your notes."],
  [FileText, "Quiz practice", "Practice with questions made from your own material."],
  [BarChart3, "Progress tracking", "Track scores and your study streak over time."],
];

export default function AuthShell({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const frame = window.requestAnimationFrame(() => setMounted(true)); return () => window.cancelAnimationFrame(frame); }, []);
  return <div className="auth-page-shell min-h-[100dvh] bg-[var(--background)] p-0 sm:p-4 lg:h-dvh lg:overflow-hidden lg:p-0">
    <div className="auth-frame relative mx-auto grid min-h-[100dvh] max-w-[1440px] overflow-hidden rounded-none bg-[var(--surface)] shadow-[0_24px_80px_rgba(12,59,46,0.12)] sm:rounded-2xl lg:h-full lg:min-h-0 lg:max-w-none lg:rounded-none lg:grid-cols-[1.02fr_0.98fr]">
      <button type="button" title="Switch theme" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-lg border border-transparent text-[var(--muted)] hover:border-[var(--border)] hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] lg:right-6 lg:top-6" aria-label="Switch theme">
        {mounted && resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <section className="relative hidden overflow-hidden border-r border-[var(--border)] bg-[var(--active-nav)] p-10 text-[var(--foreground)] lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:justify-between lg:p-[clamp(1.75rem,5vh,4rem)]">
        <div className="flex h-full w-full max-w-[520px] flex-col">
          <Logo />
          <div className="mt-[clamp(1rem,7vh,5rem)] max-w-[520px]">
            <h1 className="text-[clamp(2.5rem,5vh,3.25rem)] font-bold leading-[1.04] tracking-[-.045em]">Turn your notes into knowledge.</h1>
            <p className="mt-4 max-w-[520px] text-[clamp(.95rem,2vh,1.125rem)] leading-7 text-[var(--muted)] [text-wrap:balance]">A calmer, smarter way to understand difficult course material and build momentum.</p>
          </div>
          <div className="mt-[clamp(1rem,3vh,2rem)] max-w-[520px] space-y-[clamp(.5rem,1.8vh,1rem)]">
            {features.map(([Icon, title, description]) => <div className="flex items-center gap-4" key={title}>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--surface)] text-[var(--active-nav-text)]"><Icon size={20} /></div>
              <div><p className="font-semibold">{title}</p><p className="auth-feature-description mt-1 text-sm leading-5 text-[var(--muted)]">{description}</p></div>
            </div>)}
          </div>
          <div className="auth-preview mt-4 min-h-[98px] max-w-[520px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-[var(--active-nav-text)]">AI study guide</p><p className="mt-1 text-sm font-semibold">Process scheduling</p><p className="mt-2 max-w-[260px] text-xs leading-5 text-[var(--muted)]">Scheduling shares CPU time between ready processes.</p></div><div className="grid h-14 w-14 place-items-center rounded-full border-4 border-[var(--primary)] text-xs font-bold text-[var(--foreground)]">4/5</div></div>
          </div>
          <p className="mt-auto pt-4 text-sm text-[var(--muted)]">AI study companion for students.</p>
        </div>
      </section>
      <section className="relative flex min-h-[100dvh] items-start justify-center overflow-y-auto bg-[var(--surface)] px-6 py-8 sm:items-center sm:px-12 sm:py-12 lg:h-full lg:min-h-0 lg:items-center lg:overflow-hidden lg:px-[clamp(2rem,6vw,6rem)] lg:py-0">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden">
            <AuthMobileShell>{children}</AuthMobileShell>
          </div>
          <div className="hidden w-full flex-col gap-[clamp(.75rem,2vh,1.25rem)] lg:flex lg:[&>*]:m-0 lg:[&>*]:w-full">
            {children}
          </div>
        </div>
      </section>
    </div>
  </div>;
}
