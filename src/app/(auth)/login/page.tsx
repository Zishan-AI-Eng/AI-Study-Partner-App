"use client";

import Link from "next/link";
import { Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui";
import { login } from "@/lib/api";

function Field({ icon: Icon, label, children, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon: typeof Mail; label: string; children?: React.ReactNode }) {
  return <label className="block text-left text-sm font-semibold text-[var(--muted)]">{label}<div className="relative mt-2 flex h-12 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 transition-colors focus-within:border-[var(--primary)] focus-within:bg-[var(--background)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20"><Icon size={18} className="pointer-events-none shrink-0 text-[var(--muted)]"/>  <input {...props} className="field-input h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-base font-medium text-[var(--foreground)] outline-none ring-0 shadow-none placeholder:font-normal placeholder:text-[var(--muted)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 lg:text-sm"/>{children}</div></label>;
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [show, setShow] = useState(false); const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); if (!email || !password) { toast.error("Please enter your email and password."); return; } setLoading(true); await login(email, password); toast.success("Welcome back!"); router.push("/dashboard"); };
  return <AuthShell><div className="mb-[clamp(1rem,3vh,2rem)] text-center lg:text-left"><h2 className="text-[28px] font-bold tracking-tight text-[var(--foreground)]">Welcome back</h2><p className="mt-2 text-[15px] text-[var(--muted)]">Login to continue your learning</p></div><form onSubmit={submit} className="space-y-[clamp(.75rem,2vh,1.25rem)] lg:flex lg:flex-col lg:gap-4 lg:space-y-0"><Field icon={Mail} label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" required/><Field icon={KeyRound} label="Password" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required><button type="button" onClick={() => setShow(!show)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff size={18}/> : <Eye size={18}/>}</button></Field><div className="flex min-h-11 items-center justify-between gap-3 text-sm"><label className="flex min-h-11 items-center gap-2 text-[var(--muted)]"><input type="checkbox" className="h-[18px] w-[18px] rounded-[5px] accent-[var(--primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"/>Remember me</label><Link href="/forgot-password" className="flex min-h-11 items-center font-semibold text-[var(--primary-dark)]">Forgot password?</Link></div><Button loading={loading} className="h-12 w-full rounded-xl text-base">Log in</Button></form><p className="mt-6 whitespace-nowrap text-center text-sm text-[var(--muted)]">No account yet? <Link href="/register" className="font-bold text-[var(--primary-dark)]">Register</Link></p></AuthShell>;
}
