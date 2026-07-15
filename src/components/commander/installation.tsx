"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

const INSTALLS = {
  npm: {
    cmd: "npx @solo-commander/install",
    note: "Auto-configures your Claude Code / Cursor MCP client.",
  },
  bun: {
    cmd: "bunx @solo-commander/install",
    note: "Fastest path. Bun recommended for solo setups.",
  },
  pnpm: {
    cmd: "pnpm dlx @solo-commander/install",
    note: "Works with pnpm-managed workspaces too.",
  },
  cargo: {
    cmd: "cargo install solo-commander-mcp",
    note: "Native binary. Great for Rust-first machines.",
  },
} as const;

const CLIENT_SNIPPET = `{
  "mcpServers": {
    "solo-commander": {
      "command": "solo-commander",
      "args": [],
      "env": {
        "COMMANDER_TRUSTED": "~/projects",
        "COMMANDER_SAFE_MODE": "true"
      }
    }
  }
}`;

export function Installation() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(null), 1800);
    });
  };

  return (
    <section id="install" className="relative scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="// install"
          title="One command. No account. No login. No verification."
          description="Pick your package manager, run the installer, and your MCP client is configured. That's the entire onboarding."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* install commands */}
          <div className="rounded-2xl border border-border/70 bg-card/40 p-6">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" /> install
            </div>

            <Tabs defaultValue="npm" className="mt-4">
              <TabsList className="grid w-full grid-cols-4 bg-muted/40">
                {(Object.keys(INSTALLS) as Array<keyof typeof INSTALLS>).map((k) => (
                  <TabsTrigger key={k} value={k} className="font-mono text-xs">
                    {k}
                  </TabsTrigger>
                ))}
              </TabsList>

              {(Object.entries(INSTALLS) as Array<[keyof typeof INSTALLS, { cmd: string; note: string }]>).map(
                ([k, v]) => (
                  <TabsContent key={k} value={k} className="mt-4">
                    <div className="group relative overflow-hidden rounded-lg border border-border/70 bg-[oklch(0.14_0.008_160)]">
                      <div className="flex items-center justify-between border-b border-border/50 px-3 py-1.5">
                        <span className="font-mono text-[11px] text-muted-foreground">bash</span>
                        <button
                          onClick={() => copy(v.cmd, k)}
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-emerald-300"
                        >
                          {copied === k ? (
                            <>
                              <Check className="h-3 w-3" /> copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" /> copy
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] text-emerald-300">
                        <span className="text-muted-foreground">$ </span>
                        {v.cmd}
                      </pre>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{v.note}</p>
                  </TabsContent>
                )
              )}
            </Tabs>

            <ul className="mt-6 space-y-2">
              {[
                "No email verification",
                "No company domain required",
                "No cloud dashboard",
                "No API key subscription",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                  <Check className="h-4 w-4 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* client config */}
          <div className="rounded-2xl border border-border/70 bg-card/40 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" /> client config
              </div>
              <button
                onClick={() => copy(CLIENT_SNIPPET, "client")}
                className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-emerald-300"
              >
                {copied === "client" ? (
                  <>
                    <Check className="h-3 w-3" /> copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> copy
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              The installer writes this into your client&apos;s MCP config. Edit{" "}
              <code className="rounded bg-muted/60 px-1 font-mono text-emerald-300">~/.config/solo-commander/config.json</code>{" "}
              to manage trusted folders and safe mode.
            </p>
            <div className="mt-4 overflow-hidden rounded-lg border border-border/70 bg-[oklch(0.14_0.008_160)]">
              <pre className="cmd-scroll overflow-x-auto px-4 py-3 font-mono text-[12px] leading-relaxed text-foreground/85">
{CLIENT_SNIPPET}
              </pre>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[11px]">
              <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-300">
                COMMANDER_TRUSTED
              </span>
              <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-amber-300">
                COMMANDER_SAFE_MODE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
