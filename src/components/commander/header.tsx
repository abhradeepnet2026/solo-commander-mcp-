"use client";

import { useEffect, useState } from "react";
import { TerminalSquare, Github, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { label: "Modules", href: "#modules" },
  { label: "Architecture", href: "#architecture" },
  { label: "Workflow", href: "#workflow" },
  { label: "Live Demo", href: "#demo" },
  { label: "Install", href: "#install" },
  { label: "Compare", href: "#compare" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/40">
            <TerminalSquare className="h-5 w-5 text-emerald-400" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 cmd-pulse" />
          </span>
          <div className="leading-none">
            <span className="block font-mono text-sm font-semibold tracking-tight">
              solo<span className="text-emerald-400">.</span>commander
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              MCP
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
            asChild
          >
            <a href="#install">
              <Github className="h-4 w-4" />
              <span className="font-mono text-xs">star</span>
            </a>
          </Button>
          <Button
            size="sm"
            className="bg-emerald-500/90 text-emerald-950 hover:bg-emerald-400 font-mono"
            asChild
          >
            <a href="#install">npm install</a>
          </Button>
        </div>

        <button
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/80 bg-background/95 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#install"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-emerald-500/90 px-3 py-2.5 text-center font-mono text-sm text-emerald-950 hover:bg-emerald-400"
            >
              npm install
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
