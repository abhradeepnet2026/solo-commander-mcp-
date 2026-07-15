"use client";

import { Check, X } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { COMPARISON } from "./data";

export function Comparison() {
  return (
    <section id="compare" className="relative scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="// the difference"
          title="Built for solo developers. Not enterprise sales."
          description="Enterprise Desktop Commanders need company emails, waitlists, and cloud dashboards. This one needs one command and your laptop."
        />

        <div className="mt-12 overflow-hidden rounded-2xl border border-border/70 bg-card/30">
          {/* header */}
          <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-border/70 bg-card/50">
            <div className="px-5 py-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              capability
            </div>
            <div className="border-l border-border/70 px-5 py-4">
              <div className="font-semibold text-emerald-400">Solo Commander</div>
              <div className="font-mono text-[11px] text-muted-foreground">this project</div>
            </div>
            <div className="border-l border-border/70 px-5 py-4">
              <div className="font-semibold text-muted-foreground">Enterprise tools</div>
              <div className="font-mono text-[11px] text-muted-foreground">the others</div>
            </div>
          </div>

          {/* rows */}
          <div className="divide-y divide-border/50">
            {COMPARISON.rows.map((r, i) => (
              <div
                key={r.feature}
                className={`grid grid-cols-[1.4fr_1fr_1fr] ${i % 2 ? "bg-background/20" : ""}`}
              >
                <div className="px-5 py-3.5 text-sm font-medium text-foreground/90">{r.feature}</div>
                <div className="flex items-center gap-2 border-l border-border/70 px-5 py-3.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                    <Check className="h-3 w-3 text-emerald-400" />
                  </span>
                  <span className="text-sm text-foreground/85">{r.us}</span>
                </div>
                <div className="flex items-center gap-2 border-l border-border/70 px-5 py-3.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500/15">
                    <X className="h-3 w-3 text-rose-400" />
                  </span>
                  <span className="text-sm text-muted-foreground">{r.them}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
