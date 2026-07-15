"use client";

import { motion } from "framer-motion";
import { MODULES, ACCENT_CLASSES } from "./data";
import { SectionHeading } from "./section-heading";
import { TiltCard } from "./tilt-card";

export function ModulesGrid() {
  return (
    <section id="modules" className="relative scroll-mt-20 py-20 sm:py-24">
      {/* faint ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(50% 40% at 80% 10%, oklch(0.78 0.17 155 / 0.06), transparent 70%), radial-gradient(40% 40% at 10% 90%, oklch(0.8 0.16 75 / 0.05), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="// 15 modules"
          title="Everything an AI agent needs to drive your machine"
          description="Each module exposes a set of MCP tools. Your AI client calls them the same way it calls any other tool — except these ones reach into your real filesystem, terminal, git history, and processes."
        />

        <div
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          style={{ perspective: "1200px" }}
        >
          {MODULES.map((m, i) => {
            const a = ACCENT_CLASSES[m.accent];
            const Icon = m.icon;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: "easeOut" }}
              >
                <TiltCard
                  intensity={9}
                  className={`group relative flex h-full flex-col rounded-xl border border-border/70 bg-card/50 p-5 ring-1 ring-transparent transition-colors duration-300 hover:bg-card/80 ${a.ring}`}
                >
                  {/* glow border on hover */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(120% 60% at 50% 0%, ${glowColor(m.accent)}, transparent 70%)`,
                    }}
                    aria-hidden
                  />

                  {/* header — lifted toward viewer */}
                  <div
                    className="flex items-start justify-between gap-3"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-lg border ${a.border} ${a.bg} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className={`h-5 w-5 ${a.text}`} />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(m.id).padStart(2, "0")}
                    </span>
                  </div>

                  <h3
                    className="mt-4 font-semibold tracking-tight"
                    style={{ transform: "translateZ(28px)" }}
                  >
                    {m.name}
                  </h3>
                  <p
                    className="mt-1 text-sm text-muted-foreground"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {m.tagline}
                  </p>

                  {/* functions */}
                  <ul className="mt-4 grid gap-1.5" style={{ transform: "translateZ(14px)" }}>
                    {m.functions.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 font-mono text-[12px] text-foreground/70"
                      >
                        <span className={`h-1 w-1 rounded-full ${a.dot}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 border-t border-border/50 pt-3" style={{ transform: "translateZ(8px)" }}>
                    <code className={`font-mono text-[11px] ${a.text}`}>
                      mcp.commander.{m.slug}
                    </code>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function glowColor(accent: string): string {
  switch (accent) {
    case "emerald":
      return "oklch(0.78 0.17 155 / 0.16)";
    case "amber":
      return "oklch(0.8 0.16 75 / 0.16)";
    case "cyan":
      return "oklch(0.7 0.15 200 / 0.16)";
    case "violet":
      return "oklch(0.75 0.18 320 / 0.16)";
    case "rose":
      return "oklch(0.72 0.19 20 / 0.16)";
    default:
      return "oklch(0.78 0.17 155 / 0.16)";
  }
}
