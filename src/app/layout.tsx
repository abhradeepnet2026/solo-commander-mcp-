import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solo Desktop Commander MCP — Your AI, Your Machine",
  description:
    "A completely free, open-source Desktop Commander MCP for solo developers. Give any MCP-compatible AI agent real filesystem, terminal, git, and process control over your own machine. No accounts. No cloud. No telemetry.",
  keywords: [
    "Desktop Commander",
    "MCP",
    "Model Context Protocol",
    "Claude Code",
    "AI agent",
    "open source",
    "solo developer",
    "vibe coding",
  ],
  authors: [{ name: "Solo Desktop Commander" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Solo Desktop Commander MCP",
    description:
      "Free, open-source Desktop Commander MCP for solo developers. Your AI, your machine, fully offline.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
