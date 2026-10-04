"use client";

import { ChevronRight, LogOut, Moon, Sun, UserRound } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAllData, getCurrentUser, logout, resetDemoData } from "@/lib/api";
import { Button, Card } from "@/components/ui";

export default function Profile() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  useEffect(() => { getCurrentUser().then(setUser); }, []);
  const signOut = async () => { await logout(); router.replace("/login"); };
  const resetDemo = () => { if (user) { resetDemoData(user.email); window.location.reload(); } };
  const clearData = () => { clearAllData(); window.location.reload(); };
  const initials = user?.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() ?? "?";
  return <div className="mx-auto max-w-2xl space-y-6"><div><h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Profile</h1><p className="mt-2 text-sm text-[var(--muted)]">Manage your account and preferences.</p></div><Card className="p-5"><div className="flex items-center gap-4"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[var(--primary-action)] font-bold text-[var(--orange-button-text)]">{initials}</div><div className="min-w-0"><p className="truncate font-semibold text-[var(--foreground)]">{user?.name ?? "Student"}</p><p className="truncate text-sm text-[var(--muted)]">{user?.email ?? ""}</p></div></div></Card><Card className="divide-y hairline overflow-hidden"><button type="button" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="flex min-h-14 w-full items-center gap-3 px-4 text-left active:bg-[var(--surface-muted)]"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--active-nav)] text-[var(--active-nav-text)]">{resolvedTheme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}</span><span className="flex-1 text-sm font-semibold text-[var(--foreground)]">Appearance</span><span className="text-sm text-[var(--muted)]">{resolvedTheme === "dark" ? "Dark" : "Light"}</span><ChevronRight size={17} className="text-[var(--muted)]"/></button><div className="flex min-h-14 items-center gap-3 px-4"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--surface-muted)] text-[var(--muted)]"><UserRound size={18}/></span><span className="flex-1 text-sm font-semibold text-[var(--foreground)]">Notifications</span><span className="text-sm text-[var(--muted)]">Off</span></div><div className="flex min-h-14 items-center gap-3 px-4"><span className="flex-1 text-sm font-semibold text-[var(--foreground)]">Help</span><span className="text-sm text-[var(--muted)]">Coming soon</span><ChevronRight size={17} className="text-[var(--muted)]"/>  </div></Card><Card className="space-y-3 p-4"><p className="text-sm font-semibold text-[var(--foreground)]">Demo data</p><p className="text-xs text-[var(--muted)]">Restore the prepared study library or clear it for an empty-state review.</p><div className="flex flex-col gap-2 sm:flex-row"><Button variant="secondary" onClick={resetDemo} className="flex-1">Reset demo data</Button><Button variant="ghost" onClick={clearData} className="flex-1 text-[var(--danger)]">Clear all data</Button></div></Card><Button variant="danger" onClick={signOut} className="w-full"><LogOut size={17}/>Log out</Button></div>;
}
