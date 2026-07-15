"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ShieldCheck, WifiOff, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PRINCIPLES, PLATFORMS } from "./data";
import { HeroScene3D } from "./hero-scene-3d";

type Line =
  | { kind: "prompt"; text: string }
  | { kind: "out"; text: string; cls?: string }
  | { kind: "ai"; text: string }
  | { kind: "gap" };

const SCRIPT: Line[] = [
  { kind: "prompt", text: "you › my backend stopped working. fix it." },
  { kind: "ai", text: "On it. Reading logs first…" },
  { kind: "out", text: "$ terminal.tail_logs('/api/health')", cls: "text-emerald-400" },
  { kind: "out", text: "✗ Error: Cannot find module 'zod'" },
  { kind: "ai", text: "Missing dependency detected. Locating source…" },
  { kind: "out", text: "$ code.locate_error()", cls: "text-emerald-400" },
  { kind: "out", text: "→ src/app/api/health/route.ts:3 imports 'zod'" },
  { kind: "ai", text: "Installing zod, then restarting the server." },
  { kind: "out", text: "$ terminal.run('bun add zod')", cls: "text-emerald-400" },
  { kind: "out", text: "+ zod@4.0.2  (47 packages added)" },
  { kind: "out", text: "$ process.restart('dev:3000')", cls: "text-emerald-400" },
  { kind: "out", text: "✓ dev server up · port 3000 free" },
  { kind: "out", text: "$ browser.open_localhost(3000)", cls: "text-emerald-400" },
  { kind: "out", text: "200 OK · { status: 'healthy' }", cls: "text-emerald-300" },
  { kind: "ai", text: "Done. Root cause was a missing 'zod' import. I installed it, restarted the dev server, and verified localhost:3000 responds 200 OK." },
  { kind: "gap" },
];

export function Hero() {
  const [lines, setLines] = useState<{ line: Line; chars: number }[]>([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [typing, setTyping] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drive the typewriter through the script.
  useEffect(() => {
    if (lineIdx >= SCRIPT.length) {
      const reset = setTimeout(() => {
        setLines([]);
        setLineIdx(0);
        setTyping(true);
      }, 4200);
      return () => clearTimeout(reset);
    }

    const current = SCRIPT[lineIdx];

    if (current.kind === "gap") {
      const t = setTimeout(() => setLineIdx((i) => i + 1), 350);
      return () => clearTimeout(t);
    }

    if (!typing) {
      const t = setTimeout(() => setLineIdx((i) => i + 1), 480);
      return () => clearTimeout(t);
    }

    // type the current line char by char
    let char = 0;
    const full = current.text;
    const interval = setInterval(() => {
      char += Math.max(1, Math.round(full.length / 60));
      setLines((prev) => {
        const copy = [...prev];
        copy[lineIdx] = { line: current, chars: Math.min(char, full.length) };
        return copy;
      });
      if (char >= full.length) {
        clearInterval(interval);
        setTyping(false);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [lineIdx, typing]);

  // when a line completes, advance after a pause
  useEffect(() => {
    if (lineIdx >= SCRIPT.length) return;
    const current = lines[lineIdx];
    if (!current) return;
    const full = current.line.text;
    if (current.chars >= full.length && !typing) {
      const t = setTimeout(() => {
        setTyping(true);
        setLineIdx((i) => i + 1);
      }, 520);
      return () => clearTimeout(t);
    }
  }, [lines, lineIdx, typing]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <section id="top" className="relative overflow-hidden">
      {/* 3D motion-graphics layer */}
      <HeroScene3D className="pointer-events-none absolute inset-0 z-0 opacity-80" />
      {/* fade the 3D scene toward edges so content stays readable */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 45%, transparent 30%, oklch(0.155 0.008 160) 85%)",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 cmd-grid-bg opacity-40" aria-hidden />
      <div className="absolute inset-0 cmd-radial" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — copy */}
          <motion.div
            className="flex flex-col items-start"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 backdrop-blur-sm"
            >
              <WifiOff className="h-3.5 w-3.5" />
              Offline-first · No account · No cloud
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
              }}
              className="mt-5 font-sans text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Your AI,{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-amber-300 bg-clip-text text-transparent cmd-text-glow">
                your machine
              </span>
              .
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
              }}
              className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              A completely free, open-source <strong className="text-foreground font-semibold">Desktop Commander MCP</strong> for solo
              developers. Hand any MCP-compatible AI agent real filesystem, terminal, git, and process
              control over your own computer — and let it inspect, diagnose, repair, and verify on its own.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
              }}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                size="lg"
                className="bg-emerald-500/90 text-emerald-950 hover:bg-emerald-400 font-mono"
                asChild
              >
                <a href="#install">
                  Get started
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 font-mono" asChild>
                <a href="#demo">
                  <span className="text-emerald-400">▶</span> Try the live demo
                </a>
              </Button>
            </motion.div>

            {/* principles */}
            <div className="mt-8 flex flex-wrap gap-1.5">
              {PRINCIPLES.map((p) => (
                <span
                  key={p}
                  className="rounded-md border border-border/70 bg-card/50 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                >
                  {p}
                </span>
              ))}
            </div>

            {/* platforms */}
            <div className="mt-7 flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Runs on
              </span>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {PLATFORMS.map((p) => (
                  <span key={p.name} className="flex items-center gap-1.5 text-sm text-foreground/80">
                    <span aria-hidden>{p.icon}</span>
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — animated terminal */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
          >
            <div className="absolute -inset-4 rounded-3xl bg-emerald-500/10 blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-xl border border-border/80 bg-[oklch(0.14_0.008_160)] shadow-2xl">
              {/* title bar */}
              <div className="flex items-center gap-2 border-b border-border/60 bg-card/40 px-4 py-2.5">
                <span className="flex gap-1.5">
                  <Circle className="h-3 w-3 fill-rose-500/80 text-rose-500/80" />
                  <Circle className="h-3 w-3 fill-amber-500/80 text-amber-500/80" />
                  <Circle className="h-3 w-3 fill-emerald-500/80 text-emerald-500/80" />
                </span>
                <span className="mx-auto font-mono text-xs text-muted-foreground">
                  commander — claude code — autonomous fix
                </span>
                <ShieldCheck className="h-4 w-4 text-emerald-400/70" />
              </div>

              {/* terminal body */}
              <div
                ref={scrollRef}
                className="cmd-scroll h-[380px] overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed sm:h-[440px]"
              >
                {lines.map((entry, i) => {
                  if (!entry) return null;
                  const { line, chars } = entry;
                  const text = line.text.slice(0, chars);
                  const isLast = i === lineIdx && typing;
                  const cursor = isLast ? "▍" : "";

                  if (line.kind === "prompt") {
                    return (
                      <div key={i} className="cmd-fade-up mt-2 text-foreground">
                        <span className="text-amber-400">{text.split(" ›")[0]} ›</span>
                        <span className="text-foreground">{text.split(" ›")[1] ?? ""}{cursor}</span>
                      </div>
                    );
                  }
                  if (line.kind === "ai") {
                    return (
                      <div key={i} className="cmd-fade-up mt-2 flex gap-2">
                        <span className="shrink-0 rounded bg-emerald-500/15 px-1.5 text-[10px] uppercase tracking-wider text-emerald-300">
                          ai
                        </span>
                        <span className="text-foreground/90">
                          {text}{cursor}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className={`cmd-fade-up mt-1 whitespace-pre-wrap ${line.cls ?? "text-muted-foreground"}`}>
                      {text}{cursor}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* status strip */}
            <div className="mt-3 flex items-center justify-between rounded-lg border border-border/60 bg-card/40 px-4 py-2 font-mono text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 cmd-pulse" />
                mcp server: connected
              </span>
              <span>15 modules · 120+ tools</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
