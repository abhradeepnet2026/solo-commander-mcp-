"use client";

import {
  User,
  Bot,
  Server,
  HardDrive,
  TerminalSquare,
  GitBranch,
  Cpu,
  Globe,
  Clipboard,
  ChevronRight,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { AI_CLIENTS } from "./data";
import { motion } from "framer-motion";

const OS_NODES = [
  { label: "Filesystem", icon: HardDrive, color: "text-emerald-400" },
  { label: "Terminal", icon: TerminalSquare, color: "text-amber-400" },
  { label: "Git", icon: GitBranch, color: "text-emerald-400" },
  { label: "Processes", icon: Cpu, color: "text-cyan-400" },
  { label: "Browser", icon: Globe, color: "text-violet-400" },
  { label: "Clipboard", icon: Clipboard, color: "text-amber-400" },
];

export function Architecture() {
  return (
    <section id="architecture" className="relative scroll-mt-20 border-y border-border/60 bg-card/20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="// system architecture"
          title="One local server. Full machine access. Zero cloud."
          description="The MCP server runs as a single process on your machine. Your AI client talks to it over a local stdio/HTTP transport. No traffic ever leaves your computer."
        />

        <div className="mt-14 grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {/* Column 1 — User + Clients */}
          <div className="flex flex-col items-center gap-5">
            <Node icon={User} label="You" sub="natural language" color="text-foreground" />
            <div className="flex flex-col gap-2 w-full">
              <div className="text-center text-[11px] uppercase tracking-wider text-muted-foreground">
                any MCP client
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {AI_CLIENTS.slice(0, 6).map((c) => (
                  <span
                    key={c}
                    className="rounded-md border border-border/60 bg-background/60 px-2 py-1.5 text-center font-mono text-[11px] text-muted-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Connector />

          {/* Column 2 — MCP server */}
          <div className="flex justify-center" style={{ perspective: "1000px" }}>
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: -12 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d" }}
              className="w-full max-w-xs"
            >
            <motion.div
              className="relative w-full rounded-xl border border-emerald-500/40 bg-emerald-500/[0.06] p-5 cmd-glow-ring"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/40">
                  <Server className="h-5 w-5 text-emerald-400" />
                </span>
                <div>
                  <div className="font-semibold">Solo Desktop Commander</div>
                  <div className="font-mono text-[11px] text-emerald-300">MCP server · local stdio</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-1.5 font-mono text-[11px] text-muted-foreground">
                <span className="rounded border border-border/50 px-1.5 py-1">15 modules</span>
                <span className="rounded border border-border/50 px-1.5 py-1">120+ tools</span>
                <span className="rounded border border-border/50 px-1.5 py-1">safe mode</span>
                <span className="rounded border border-border/50 px-1.5 py-1">snapshots</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-emerald-300/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 cmd-pulse" />
                local only · 0 cloud calls
              </div>
            </motion.div>
            </motion.div>
          </div>

          <Connector />

          {/* Column 3 — OS */}
          <div className="flex flex-col items-center gap-3">
            <Node icon={Bot} label="Operating System" sub="your machine" color="text-amber-400" />
            <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {OS_NODES.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.label}
                    className="flex flex-col items-center gap-1.5 rounded-lg border border-border/60 bg-background/50 px-2 py-3 text-center"
                  >
                    <Icon className={`h-4 w-4 ${n.color}`} />
                    <span className="font-mono text-[11px] text-muted-foreground">{n.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* legend */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> local stdio transport
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> permission-gated actions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> nothing leaves the machine
          </span>
        </div>
      </div>
    </section>
  );
}

function Node({
  icon: Icon,
  label,
  sub,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-2 rounded-xl border border-border/70 bg-background/50 p-4">
      <span className={`flex h-10 w-10 items-center justify-center rounded-lg bg-card ${color}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="text-center">
        <div className="text-sm font-semibold">{label}</div>
        <div className="font-mono text-[11px] text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex items-center justify-center py-2 lg:py-0">
      <ChevronRight className="hidden h-6 w-6 text-emerald-400/50 lg:block" />
      <ChevronRight className="h-5 w-5 rotate-90 text-emerald-400/50 lg:hidden" />
    </div>
  );
}
