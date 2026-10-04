"use client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="studyai-theme"><Toaster richColors position="top-right" /><div className="relative">{children}</div></ThemeProvider>;
}
