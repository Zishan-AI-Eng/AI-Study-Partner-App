"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui";
import { requestPasswordReset } from "@/lib/api";

function EmailField({ value, onChange, error }: { value: string; onChange: (value: string) => void; error?: string }) {
  return <label className="block text-sm font-semibold text-[var(--muted)]">Email<div className={`relative mt-2 flex h-12 items-center gap-2 rounded-xl border bg-[var(--surface)] px-3 transition-colors focus-within:bg-[var(--background)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20 ${error ? "border-[var(--danger)] focus-within:border-[var(--danger)]" : "border-[var(--border)] focus-within:border-[var(--primary)]"}`}><Mail size={18} className="pointer-events-none shrink-0 text-[var(--muted)]" />  <input type="email" autoComplete="email" value={value} onChange={(event) => onChange(event.target.value)} className="field-input h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-base font-medium text-[var(--foreground)] outline-none ring-0 shadow-none placeholder:font-normal placeholder:text-[var(--muted)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 lg:text-sm" placeholder="Enter your email" aria-invalid={Boolean(error)} aria-describedby={error ? "email-error" : undefined} required /></div>{error && <span id="email-error" className="mt-1 block text-xs text-[var(--danger)]">{error}</span>}</label>;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => { if (sent) headingRef.current?.focus(); }, [sent]);
  useEffect(() => { if (!cooldown) return; const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000); return () => window.clearInterval(timer); }, [cooldown]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) { setError("Email is required."); return; }
    if (!validEmail.test(email)) { setError("Enter a valid email address."); return; }
    setError(""); setLoading(true); await requestPasswordReset(email); setSubmittedEmail(email); setSent(true); setCooldown(30); setLoading(false);
  };
  const resend = async () => { if (cooldown) return; setLoading(true); await requestPasswordReset(submittedEmail); setCooldown(30); setLoading(false); };

  return <AuthShell>{sent ? <section aria-live="polite" className="text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--orange-tint)] text-[var(--orange-text)]"><Mail size={26} /></div><h1 ref={headingRef} tabIndex={-1} className="mt-5 text-2xl font-bold tracking-tight text-[var(--foreground)]">Check your email</h1><p className="mt-2 text-sm leading-6 text-[var(--muted)]">We sent a reset link to {submittedEmail}. It may take a minute to arrive.</p><Link href="/login" className="mt-6 block"><Button className="w-full"><ArrowLeft size={17} />Back to login</Button></Link><button type="button" onClick={resend} disabled={Boolean(cooldown) || loading} className="mt-4 min-h-11 text-sm font-semibold text-[var(--primary-dark)] disabled:cursor-not-allowed disabled:text-[var(--muted)]">{cooldown ? `Resend in ${cooldown}s` : "Resend link"}</button><p className="mt-4 text-xs text-[var(--muted)]"><CheckCircle2 size={14} className="mr-1 inline text-[var(--success)]" />Didn&apos;t get it? Check your spam folder.</p></section> : <><div className="mb-[clamp(1rem,3vh,2.25rem)]"><h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Forgot your password?</h1><p className="mt-2 text-base text-[var(--muted)]">Enter your email and we&apos;ll send you a link to reset it.</p></div><form onSubmit={submit} className="space-y-5 lg:flex lg:flex-col lg:gap-4 lg:space-y-0"><EmailField value={email} onChange={(value) => { setEmail(value); setError(""); }} error={error} /><Button loading={loading} className="h-12 w-full text-base"><Send size={18}/>Send reset link</Button></form><Link href="/login" className="mt-auto flex min-h-11 items-center justify-center gap-2 whitespace-nowrap pt-6 text-sm font-semibold text-[var(--primary-dark)]"><ArrowLeft size={16}/>Back to login</Link></>}</AuthShell>;
}
