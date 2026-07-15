"use client";

import { ArrowRight, Github, Heart, TerminalSquare, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/20">
      {/* CTA band */}
      <div className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 cmd-radial opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Stop explaining. Start{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-amber-300 bg-clip-text text-transparent">
              commanding
            </span>
            .
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Install once. Give your AI the keys to your own machine. Ship faster — without a single
            cloud call, account, or subscription.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-emerald-500/90 text-emerald-950 hover:bg-emerald-400 font-mono"
              asChild
            >
              <a href="/solo-commander-mcp.zip" download>
                <Download className="mr-1.5 h-4 w-4" />
                download source (.zip)
              </a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 font-mono" asChild>
              <a href="#install">
                npm install
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>
          <p className="mt-4 font-mono text-[11px] text-muted-foreground">
            ~206 KB · 89 files · no node_modules · ready to <code className="text-emerald-300">bun install &amp;&amp; bun run dev</code>
          </p>
        </div>
      </div>

      {/* footer body */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/40">
                <TerminalSquare className="h-4 w-4 text-emerald-400" />
              </span>
              <span className="font-mono text-sm font-semibold">
                solo<span className="text-emerald-400">.</span>commander
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The definitive open-source Desktop Commander MCP for solo developers. Your AI, your
              machine, fully offline.
            </p>
            <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
              <Heart className="h-3 w-3 text-rose-400" /> MIT licensed · built for vibe coders
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              ["Modules", "#modules"],
              ["Architecture", "#architecture"],
              ["Live demo", "#demo"],
              ["Install", "#install"],
            ]}
          />
          <FooterCol
            title="Security"
            links={[
              ["Safe mode", "#config"],
              ["Snapshots", "#config"],
              ["Trusted folders", "#config"],
              ["Activity log", "#config"],
            ]}
          />
          <FooterCol
            title="Get the code"
            links={[
              ["Download .zip", "/solo-commander-mcp.zip"],
              ["Run locally", "#install"],
              ["Live demo", "#demo"],
              ["Architecture", "#architecture"],
            ]}
          />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-6 sm:flex-row">
          <p className="font-mono text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} Solo Desktop Commander · no telemetry · no cloud
          </p>
          <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 cmd-pulse" />
              v1.0.0
            </span>
            <span>·</span>
            <span>15 modules</span>
            <span>·</span>
            <span>120+ tools</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div>
      <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="text-sm text-foreground/70 transition-colors hover:text-emerald-300">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
