"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChartNoAxesCombined,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  ArrowLeft,
  Moon,
  Search,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { clearAllData, getCurrentUser, logout, resetDemoData } from "@/lib/api";
import Logo from "@/components/brand/Logo";

const nav = [
  ["/dashboard", "Home", LayoutDashboard],
  ["/upload", "Upload", FilePlus2],
  ["/history", "History", ChartNoAxesCombined],
] as const;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl K");
  const [themeMounted, setThemeMounted] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.removeItem("studyai-sidebar-collapsed");
    localStorage.removeItem("studyai-sidebar-expanded");
  }, []);
  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      if (!currentUser) router.replace("/login");
      else setUser(currentUser);
    });
  }, [router]);
  useEffect(() => {
    const themeFrame = requestAnimationFrame(() => setThemeMounted(true));
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    const frame = requestAnimationFrame(() => {
      setShortcutLabel(navigator.userAgent.includes("Mac") ? "⌘K" : "Ctrl K");
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(themeFrame);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
  useEffect(() => {
    const onOverlayPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!notificationRef.current?.contains(target)) setNotificationsOpen(false);
      if (!accountRef.current?.contains(target)) setAccountOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setAccountOpen(false);
      }
    };
    document.addEventListener("pointerdown", onOverlayPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onOverlayPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (!user) {
    return (
      <div className="grid min-h-[100dvh] place-items-center app-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--sky)] border-t-[var(--primary-dark)]" />
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const title = path.includes("history") ? "History" : path.includes("upload") ? "Upload" : path.includes("quiz") ? "Quiz" : path.includes("documents") ? "Document" : path.includes("profile") ? "Profile" : "Home";
  const isQuiz = path.includes("/quiz");
  const isNested = path.includes("/documents/") || isQuiz;
  const signOut = async () => {
    await logout();
    router.replace("/login");
  };
  const resetDemo = () => {
    resetDemoData(user.email);
    setAccountOpen(false);
    window.location.reload();
  };
  const clearData = () => {
    clearAllData();
    setAccountOpen(false);
    window.location.reload();
  };

  const navLinks = (mobile = false) =>
    nav.map(([href, label, Icon]) => (
      <Link
        key={href}
        href={href}
        onClick={(event) => {
          if (href === "/dashboard" && path === "/dashboard") {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        title={!mobile ? label : undefined}
        aria-label={label}
        aria-current={(href === "/dashboard" ? path === "/dashboard" || path.includes("/documents/") : path.startsWith(href)) ? "page" : undefined}
        className={`relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
          mobile ? "flex-col gap-0.5 px-2 py-1 text-[11px]" : ""
        } ${
          !mobile ? "justify-center" : ""
        } ${
          (href === "/dashboard" ? path === "/dashboard" || path.includes("/documents/") : path.startsWith(href))
            ? mobile
              ? "bg-[var(--orange-tint)] text-[var(--orange-text)]"
              : "bg-[var(--active-nav)] text-[var(--active-nav-text)]"
            : mobile
              ? "text-[var(--muted)] hover:bg-[var(--surface-muted)]"
              : "text-[var(--sidebar-text)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
        }`}
      >
        <Icon size={18} aria-hidden="true" />
        {mobile && <span>{label}</span>}
      </Link>
    ));

  return (
    <div className={`app-bg min-h-[100dvh] overflow-x-hidden ${isQuiz ? "pb-0" : "pb-20 lg:pb-0"}`}>
      <aside
        id="desktop-sidebar"
        aria-label="Sidebar navigation"
        className="fixed inset-y-0 left-0 z-40 hidden w-[72px] overflow-visible border-r border-[var(--border)] bg-[var(--sidebar)] p-4 lg:flex lg:flex-col"
      >
        <div className="flex justify-center px-0">
          <Logo href="/dashboard" className="h-10 w-10 justify-center gap-0 overflow-hidden text-transparent" />
        </div>
        <div className="mt-10 flex-1">
          <nav className="space-y-2">{navLinks()}</nav>
        </div>
        <div ref={accountRef} className="relative flex flex-col items-center border-t border-white/15 pt-4">
          <button
            type="button"
            onClick={() => setAccountOpen((value) => !value)}
            aria-expanded={accountOpen}
            aria-haspopup="menu"
            aria-label={`Open account menu for ${user.name}`}
            title={`${user.name} account menu`}
            className="mb-2 flex min-h-11 items-center justify-center rounded-lg px-2 text-left transition hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--primary-action)] text-xs font-bold text-[var(--orange-button-text)]">
              {initials}
            </span>
          </button>
          {accountOpen && (
            <div role="menu" className="absolute bottom-14 left-14 z-50 w-72 rounded-2xl border hairline bg-[var(--surface)] p-2 shadow-2xl">
              <div className="border-b hairline px-3 py-2">
                <p className="truncate text-sm font-semibold text-[var(--foreground)]">{user.name}</p>
                <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
              </div>
              <button type="button" role="menuitem" onClick={resetDemo} className="mt-1 flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">Reset demo data</button>
              <button type="button" role="menuitem" onClick={clearData} className="flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">Clear all data</button>
              <button type="button" role="menuitem" onClick={signOut} className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm text-[var(--danger)] hover:bg-[var(--danger)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"><LogOut size={16} aria-hidden="true" />Log out</button>
            </div>
          )}
        </div>
      </aside>

      <div className="transition-none lg:pl-[72px]">
        <header className={`sticky top-0 z-30 min-h-[56px] select-none border-b hairline bg-[var(--surface)] px-4 pt-[env(safe-area-inset-top)] sm:px-6 md:px-0 lg:min-h-16 lg:px-0 lg:pt-0`}>
          <div className="mx-auto flex min-h-[56px] w-full max-w-[1280px] items-center gap-2 md:grid md:min-h-16 md:grid-cols-[1fr_minmax(160px,560px)_1fr] md:gap-4 md:px-6 lg:grid-cols-[1fr_minmax(0,560px)_1fr] lg:px-10">
          {isNested ? <button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[var(--foreground)] active:scale-95 lg:hidden" onClick={() => router.back()} aria-label={isQuiz ? "Close quiz" : "Go back"}>{isQuiz ? <X size={19} /> : <ArrowLeft size={19} />}</button> : null}
          <div className="min-w-0 md:justify-self-start">
            <h1 className={`${isNested ? "text-sm" : "text-xl"} truncate font-semibold text-[var(--foreground)] lg:text-lg`}>{isNested ? (isQuiz ? "Knowledge check" : "Study guide") : title}</h1>
          </div>
          <div className="ml-auto hidden h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border hairline bg-[var(--surface-muted)] px-3 transition-colors duration-150 focus-within:border-[var(--primary)] focus-within:bg-[var(--background)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20 md:ml-0 md:flex md:w-full">
            <Search size={16} className="shrink-0 text-[var(--muted)]" aria-hidden="true" />
            <input
              ref={searchInputRef}
              id="global-search"
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  if (searchValue) setSearchValue("");
                  else event.currentTarget.blur();
                }
              }}
              className="search-input field-input h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-[var(--foreground)] outline-none ring-0 shadow-none placeholder:text-[var(--muted)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              placeholder="Search anything…"
              aria-label="Search anything"
            />
            {searchValue ? (
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setSearchValue("");
                  requestAnimationFrame(() => searchInputRef.current?.focus());
                }}
                className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            ) : !searchFocused ? (
              <kbd className="shrink-0 rounded-md border hairline bg-[var(--surface)] px-1.5 py-0.5 text-[10px] text-[var(--muted)]">{shortcutLabel}</kbd>
            ) : null}
          </div>
          <div className="ml-auto flex items-center gap-2 md:ml-0 md:justify-self-end">
            <button title="Switch theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="grid h-10 w-10 place-items-center rounded-lg text-[var(--muted)] active:scale-95 hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" aria-label="Switch theme">
              {themeMounted && theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <div ref={notificationRef} className="relative hidden md:block">
            <button title="Notifications" onClick={() => setNotificationsOpen((value) => !value)} className="relative grid h-10 w-10 place-items-center rounded-lg text-[var(--muted)] active:scale-95 hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" aria-label="Notifications" aria-expanded={notificationsOpen}>
              <Bell size={20} />
            </button>
            {notificationsOpen && <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border hairline bg-[var(--surface)] p-4 shadow-2xl"><p className="font-semibold text-[var(--foreground)]">Notifications</p><p className="mt-3 text-sm text-[var(--muted)]">You&apos;re all caught up</p></div>}
            </div>
          </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1280px] p-4 sm:p-6 lg:p-10 fade-in">{children}</main>
      </div>

      {!isQuiz && (
        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t hairline bg-[var(--surface)] px-2 pt-1 [padding-bottom:env(safe-area-inset-bottom)] lg:hidden" aria-label="Primary navigation">
          {([
            ["/dashboard", "Home", LayoutDashboard],
            ["/upload", "Upload", FilePlus2],
            ["/history", "History", ChartNoAxesCombined],
            ["/profile", "Profile", UserRound],
          ] as const).map(([href, label, Icon]) => {
            const active = href === "/dashboard" ? path === "/dashboard" || path.includes("/documents/") : path.startsWith(href as string);
            return <Link key={href as string} href={href as string} aria-current={active ? "page" : undefined} className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-[11px] font-semibold transition active:scale-95 ${active ? "text-[var(--primary-dark)]" : "text-[var(--muted)]"}`}><span className={`grid h-7 w-8 place-items-center rounded-lg ${active ? "bg-[var(--active-nav)]" : ""}`}><Icon size={18} aria-hidden="true" /></span><span>{label}</span></Link>;
          })}
        </nav>
      )}
    </div>
  );
}
