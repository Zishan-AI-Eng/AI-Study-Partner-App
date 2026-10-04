"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, FileText, Flame, Lightbulb, Plus, Sparkles, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getCurrentUser, getDocuments, getResults, getStats } from "@/lib/api";
import { Document, Result, Stats } from "@/lib/types";
import { Badge, Button, Card, CountUp, EmptyState, IconTile, ProgressRing } from "@/components/ui";

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const daysBetween = (a: string, b: string) => Math.round((new Date(a).setHours(0, 0, 0, 0) - new Date(b).setHours(0, 0, 0, 0)) / 86400000);

export default function Dashboard() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [firstName, setFirstName] = useState("Student");
  useEffect(() => { Promise.all([getDocuments(), getResults(), getStats(), getCurrentUser()]).then(([d, r, s, currentUser]) => { setDocs(d); setResults(r); setStats(s); if (currentUser) setFirstName(currentUser.name.split(" ")[0]); }); }, []);
  const streak = useMemo(() => { const dates = Array.from(new Set(results.map((result) => new Date(result.takenAt).toISOString().slice(0, 10)))).sort().reverse(); if (!dates.length) return 0; let count = 1; for (let index = 1; index < dates.length && daysBetween(dates[index - 1], dates[index]) === 1; index += 1) count += 1; return count; }, [results]);
  const statCards = [
    { label: "Documents", value: stats?.totalDocuments ?? 0, icon: FileText, spark: docs.map((_, index) => index + 1) },
    { label: "Quizzes taken", value: stats?.quizzesTaken ?? 0, icon: CheckCircle2, spark: results.map((_, index) => index + 1) },
    { label: "Average score", value: stats?.quizzesTaken ? stats.averageScore : null, icon: Sparkles, spark: results.map((result) => Math.round(result.score / result.total * 100)) },
    { label: "Best score", value: stats?.quizzesTaken ? stats.bestScore : null, icon: Trophy, spark: results.map((result) => Math.round(result.score / result.total * 100)).sort((a, b) => a - b) },
  ] as const;
  return <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: .06 } } }} className="space-y-6 sm:space-y-8">
    <motion.section variants={fade} className="relative overflow-hidden rounded-3xl bg-[var(--primary-dark)] p-5 text-white shadow-2xl shadow-[var(--sky)]/20 sm:p-7 lg:p-9">
      <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
        <div><h1 className="text-[clamp(1.75rem,5vw,2.25rem)] font-bold tracking-tight lg:text-4xl">Welcome back, {firstName}</h1><p className="mt-3 max-w-lg text-white/90">Turn your notes into momentum with focused practice and clear progress.</p></div>
        <Link href="/upload" className="w-full md:w-auto"><Button className="w-full bg-white text-[var(--primary-dark)] shadow-xl hover:bg-white/90 md:w-auto"><Plus size={18}/>Upload notes</Button></Link>
      </div>
    </motion.section>
    <motion.div variants={fade} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map(({ label, value, icon, spark: points }) => <Card key={label} className="interactive p-5"><div className="flex items-start justify-between"><IconTile icon={icon} variant="soft" />{points.length >= 2 && <div className="flex items-end gap-0.5">{points.slice(-6).map((point, index) => <span key={`${point}-${index}`} className="w-1 rounded-full bg-[var(--primary)]" style={{ height: Math.max(5, Math.min(18, point / 6)) }} />)}</div>}</div><p className="mt-5 text-sm text-[var(--muted)]">{label}</p><p className="mt-1 tabular-nums text-2xl font-bold tracking-tight text-[var(--foreground)]">{value === null ? "—" : <CountUp value={value} suffix={label.includes("score") ? "%" : ""} />}</p></Card>)}
    </motion.div>
    <div className="grid items-stretch gap-6 xl:grid-cols-[1.35fr_.65fr]">
      <motion.section variants={fade}><div className="mb-4 flex items-end justify-between"><div><h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">Recent documents</h2><p className="mt-1 text-sm text-[var(--muted)]">Your latest study material.</p></div><Link href="/upload" className="text-sm font-semibold text-[var(--primary-dark)]">Upload notes <ArrowRight size={14} className="inline"/></Link></div>{docs.length === 0 ? <EmptyState title="Your library is ready" description={"Upload your first notes and we'll create a focused study guide."} action={<Link href="/upload"><Button>Upload notes</Button></Link>} /> : <div className="grid gap-4 md:grid-cols-2">{docs.slice(0, 4).map((doc, index) => <Card key={doc.id} className="interactive group p-5"><div className="flex items-start justify-between"><IconTile icon={BookOpen} /><ProgressRing value={Math.min(100, 42 + index * 12)} size={42} stroke={4}><span className="text-[9px] font-bold text-[var(--foreground)]">{42 + index * 12}%</span></ProgressRing></div><h3 className="mt-5 line-clamp-1 font-semibold text-[var(--foreground)]">{doc.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{doc.summary}</p><div className="mt-5 flex items-center justify-between border-t hairline pt-4"><Badge>{doc.questionCount} questions</Badge><Link href={`/documents/${doc.id}`} className="flex items-center gap-1 text-sm font-semibold text-[var(--primary-dark)]">Open <ArrowRight size={14}/></Link></div></Card>)}</div>}</motion.section>
      <div className="flex flex-col gap-6"><motion.section variants={fade}><div className="mb-4"><h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">Study streak</h2><p className="mt-1 text-sm text-[var(--muted)]">Consistency compounds.</p></div><Card className="relative flex-1 overflow-hidden bg-[var(--primary-dark)] p-6 text-white"><Flame className="absolute right-5 top-5 text-orange-300" size={27}/><p className="text-sm text-white/75">Current streak</p><p className="mt-2 text-[clamp(2rem,6vw,2.5rem)] font-bold"><CountUp value={streak} /> <span className="text-base font-medium text-white/75">days</span></p><p className="mt-4 text-xs text-white/75">{streak ? "Keep your study rhythm going." : "Complete a quiz to start your streak."}</p></Card></motion.section><motion.section variants={fade}><div className="mb-4"><h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">Recent results</h2></div>{results.length ? <Card className="divide-y hairline">{results.slice(0, 4).map((result) => <div key={result.id} className="flex items-center justify-between p-4"><div className="min-w-0"><p className="truncate text-sm font-semibold text-[var(--foreground)]">{result.documentTitle.split(" - ")[0]}</p><p className="mt-1 text-xs text-[var(--muted)]">{new Date(result.takenAt).toLocaleDateString()}</p></div><Badge tone={result.score / result.total >= .7 ? "green" : result.score / result.total >= .4 ? "amber" : "rose"}>{Math.round(result.score / result.total * 100)}%</Badge></div>)}</Card> : <Card className="p-5 text-sm text-[var(--muted)]">Complete your first quiz to see your results.</Card>}</motion.section></div>
    </div>
    <motion.div variants={fade}><Card className="flex flex-col gap-4 border-[var(--sky)] bg-[var(--sky-soft)]/60 p-5 sm:flex-row sm:items-center dark:border-[var(--sky-deep)] dark:bg-[var(--sky-deep)]/20"><IconTile icon={Lightbulb} /><div><p className="text-sm font-bold text-[var(--primary-dark)]">A small tip for today</p><p className="mt-1 text-sm text-[var(--primary-dark)]/80 dark:text-[var(--sky)]/70">Short, active recall sessions are more effective than rereading. Try one question before you close your notes.</p></div></Card></motion.div>
  </motion.div>;
}
