"use client";

import { STATS, AI_CLIENTS } from "./data";

export function StatsBar() {
  return (
    <section className="relative border-y border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div className="font-mono text-3xl font-semibold text-emerald-400 sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* AI clients marquee */}
        <div className="relative mt-8 overflow-hidden">
          <div className="mb-3 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Works with any MCP-compatible client
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />
            <div className="flex w-max cmd-marquee gap-3">
              {[...AI_CLIENTS, ...AI_CLIENTS].map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-4 py-2 font-mono text-sm text-foreground/80"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
