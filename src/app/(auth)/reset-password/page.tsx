"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import AuthShell from "@/components/auth/AuthShell";
import PasswordStrength from "@/components/auth/PasswordStrength";
import { Button } from "@/components/ui";
import { resetPassword } from "@/lib/api";

function PasswordField({ label, value, onChange, show, onToggle, error }: { label: string; value: string; onChange: (value: string) => void; show: boolean; onToggle: () => void; error?: boolean }) {
  return <label className="block text-sm font-semibold text-[var(--muted)]">{label}<div className={`relative mt-2 flex h-12 items-center gap-2 rounded-xl border bg-[var(--surface)] px-3 transition-colors focus-within:bg-[var(--background)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20 ${error ? "border-[var(--danger)] focus-within:border-[var(--danger)]" : "border-[var(--border)] focus-within:border-[var(--primary)]"}`}><KeyRound size={18} className="pointer-events-none shrink-0 text-[var(--muted)]" />  <input className="field-input h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-base font-medium text-[var(--foreground)] outline-none ring-0 shadow-none placeholder:font-normal placeholder:text-[var(--muted)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 lg:text-sm" type={show ? "text" : "password"} autoComplete="new-password" value={value} onChange={(event) => onChange(event.target.value)} placeholder={label === "New password" ? "Create a strong password" : "Confirm your password"} required /><button type="button" onClick={onToggle} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>;
}

function ResetPasswordContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const valid = Boolean(token === "demo");
  useEffect(() => { headingRef.current?.focus(); }, [valid, success]);

  if (!valid) return <AuthShell><section aria-live="polite" className="text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--danger)]/10 text-[var(--danger)]"><KeyRound size={26} /></div><h1 ref={headingRef} tabIndex={-1} className="mt-5 text-2xl font-bold tracking-tight text-[var(--foreground)]">This reset link is invalid or has expired.</h1><Link href="/forgot-password" className="mt-6 block"><Button className="w-full">Request a new link <ArrowRight size={17} /></Button></Link></section></AuthShell>;
  if (success) return <AuthShell><section aria-live="polite" className="text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--orange-tint)] text-[var(--orange-text)]"><CheckCircle2 size={28} /></div><h1 ref={headingRef} tabIndex={-1} className="mt-5 text-2xl font-bold tracking-tight text-[var(--foreground)]">Password updated</h1><p className="mt-2 text-sm text-[var(--muted)]">Your password has been changed successfully.</p><Link href="/login" className="mt-6 block"><Button className="w-full">Go to login <ArrowRight size={17} /></Button></Link></section></AuthShell>;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setError(""); setLoading(true);
    try { await resetPassword(token ?? "", password); toast.success("Password updated"); setSuccess(true); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to reset password."); } finally { setLoading(false); }
  };

  return <AuthShell><div className="mb-[clamp(1rem,3vh,2.25rem)]"><h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Set a new password</h1><p className="mt-2 text-base text-[var(--muted)]">Choose a strong password you haven&apos;t used before.</p></div><form onSubmit={submit} className="space-y-4 lg:flex lg:flex-col lg:gap-4 lg:space-y-0" aria-describedby={error ? "reset-error" : undefined}><PasswordField label="New password" value={password} onChange={(value) => { setPassword(value); setError(""); }} show={show} onToggle={() => setShow(!show)} error={Boolean(error)} /><PasswordStrength password={password} /><PasswordField label="Confirm password" value={confirm} onChange={(value) => { setConfirm(value); setError(""); }} show={show} onToggle={() => setShow(!show)} error={Boolean(error)} />{error && <p id="reset-error" className="text-xs text-[var(--danger)]" aria-live="polite">{error}</p>}<Button loading={loading} className="h-12 w-full text-base">Reset password</Button></form>  <Link href="/login" className="mt-auto flex min-h-11 items-center justify-center gap-2 whitespace-nowrap pt-6 text-sm font-semibold text-[var(--primary-dark)]"><ArrowLeft size={16} />Back to login</Link></AuthShell>;
}

export default function ResetPassword() {
  return <Suspense fallback={<AuthShell><div className="h-32" /></AuthShell>}><ResetPasswordContent /></Suspense>;
}
