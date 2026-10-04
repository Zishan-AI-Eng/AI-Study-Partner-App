import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const metadata: Metadata = { title: "StudyAI - Turn your notes into knowledge", description: "An AI study companion for focused learning.", appleWebApp: { capable: true, title: "StudyAI", statusBarStyle: "default" }, icons: { apple: "/icon.svg" } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: [{ media: "(prefers-color-scheme: light)", color: "#FFFFFF" }, { media: "(prefers-color-scheme: dark)", color: "#18181B" }] };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className={inter.variable} suppressHydrationWarning><body><Providers><main>{children}</main></Providers></body></html>; }
