"use client";

import { SectionHeading } from "./section-heading";
import { WORKFLOW_STEPS } from "./data";
import { Wrench, ArrowDown } from "lucide-react";
import { Reveal } from "./reveal";

export function Workflow() {
  return (
    <section id="workflow" className="relative scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="// autonomous recovery"
          title='"My backend stopped working." → fixed.'
          description="The Error Recovery Engine turns a vague complaint into a verified fix. Here is the exact loop the AI runs — every step is an MCP tool call against your real machine."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          {/* left: the user complaint bubble */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-6">
              <div className="font-mono text-[11px] uppercase tracking-wider text-amber-300">
                you ›
              </div>
              <p className="mt-2 text-lg font-medium">
                My backend stopped working.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                That&apos;s the entire prompt. No stack trace. No file path. The AI takes it from here.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/50 p-6">
              <div className="font-mono text-[11px] uppercase tracking-wider text-emerald-400">
                ai › final answer
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                Your dev server crashed because <code className="rounded bg-muted/60 px-1 font-mono text-emerald-300">zod</code> was
                imported but never installed. I installed it, restarted the server on port 3000, and
                verified <code className="rounded bg-muted/60 px-1 font-mono text-emerald-300">localhost:3000/api/health</code> returns{" "}
                <code className="rounded bg-muted/60 px-1 font-mono text-emerald-300">200 OK</code>. No further action needed.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px]">
                <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-300">
                  ✓ installed
                </span>
                <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-300">
                  ✓ restarted
                </span>
                <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-300">
                  ✓ verified 200
                </span>
                <span className="rounded border border-border/60 bg-muted/40 px-2 py-1 text-muted-foreground">
                  snapshot saved
                </span>
              </div>
            </div>
          </div>

          {/* right: the 8 step timeline */}
          <div className="relative rounded-2xl border border-border/70 bg-card/30 p-6">
            <div className="absolute left-[34px] top-6 bottom-6 w-px bg-gradient-to-b from-emerald-500/50 via-border to-transparent" />
            <ol className="space-y-4">
              {WORKFLOW_STEPS.map((step, i) => (
                <Reveal as="li" key={step.n} delay={i * 0.06} y={18} className="relative flex gap-4 list-none">
                  <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/40 bg-background font-mono text-xs text-emerald-400">
                    {step.n}
                  </span>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold">{step.title}</h4>
                      <code className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {step.tool}
                      </code>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{step.detail}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
            <div className="mt-5 flex items-center gap-2 border-t border-border/60 pt-4 font-mono text-[11px] text-muted-foreground">
              <Wrench className="h-3.5 w-3.5 text-emerald-400" />
              8 tool calls · 0 manual steps · snapshot before every write
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ArrowDown className="h-4 w-4 text-emerald-400" />
          This is exactly what the live demo below runs against the real project on this server.
        </div>
      </div>
    </section>
  );
}
