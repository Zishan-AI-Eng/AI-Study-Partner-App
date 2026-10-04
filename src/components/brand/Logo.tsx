import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Logo({ href = "/", className = "" }: { href?: string; className?: string }) {
  return <Link href={href} aria-label="StudyAI home" className={`flex min-h-11 items-center gap-3 text-2xl font-bold tracking-tight text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${className}`}>
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--primary-action)] text-[var(--orange-button-text)]"><BookOpen size={21} aria-hidden="true" /></span>
    <span>Study<span className="text-[var(--primary-action)]">AI</span></span>
  </Link>;
}
