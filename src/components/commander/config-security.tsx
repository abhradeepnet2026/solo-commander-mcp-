"use client";

import { SectionHeading } from "./section-heading";
import { ShieldCheck, AlertTriangle, FileClock, History, Lock } from "lucide-react";

const CONFIG = `{
  "version": 1,
  "allowedFolders": [
    "~/projects",
    "~/dev"
  ],
  "trustedFolders": [
    "~/projects/my-app"
  ],
  "safeMode": true,
  "dangerousCommands": [
    "rm -rf", "mkfs", "dd", ":(){ :|:& };:",
    "git push --force", "chmod -R"
  ],
  "autoApprove": {
    "readFile": true,
    "listFiles": true,
    "gitStatus": true,
    "runCommand": "allowlist"
  },
  "snapshots": {
    "beforeWrite": true,
    "retentionDays": 14,
    "location": "~/.solo-commander/snapshots"
  },
  "logging": {
    "level": "info",
    "file": "~/.solo-commander/activity.log",
    "redactSecrets": true
  },
  "timeoutMs": 30000,
  "theme": "terminal-dark"
}`;

const SECURITY = [
  {
    icon: ShieldCheck,
    title: "Safe mode by default",
    detail: "Every destructive action prompts for confirmation before it touches anything.",
    color: "text-emerald-400",
  },
  {
    icon: AlertTriangle,
    title: "Dangerous command blocklist",
    detail: "rm -rf, force pushes, mkfs and friends are refused unless explicitly trusted.",
    color: "text-rose-400",
  },
  {
    icon: History,
    title: "Snapshot before every write",
    detail: "Automatic backups let you undo any change the AI makes, instantly.",
    color: "text-amber-400",
  },
  {
    icon: Lock,
    title: "Trusted folders only",
    detail: "The AI can only act inside folders you explicitly trust. Nothing escapes.",
    color: "text-cyan-400",
  },
];

export function ConfigSecurity() {
  return (
    <section id="config" className="relative scroll-mt-20 border-y border-border/60 bg-card/20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="// config & security"
          title="You stay in control. The AI asks first."
          description="A single config.json defines exactly what the AI may touch. Every action is logged, every write is snapshotted, every dangerous command is blocked unless you trust the folder."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* config file */}
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-[oklch(0.14_0.008_160)]">
            <div className="flex items-center justify-between border-b border-border/50 bg-card/40 px-4 py-2.5">
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <FileClock className="h-3.5 w-3.5 text-emerald-400" />
                ~/.config/solo-commander/config.json
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">read-only preview</span>
            </div>
            <pre className="cmd-scroll max-h-[460px] overflow-auto px-4 py-4 font-mono text-[12px] leading-relaxed text-foreground/85">
{CONFIG}
            </pre>
          </div>

          {/* security cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {SECURITY.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="flex flex-col rounded-xl border border-border/70 bg-card/40 p-5"
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg bg-background/60 ${s.color}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
                </div>
              );
            })}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-5 sm:col-span-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-300">
                <ShieldCheck className="h-4 w-4" /> activity log · sample
              </div>
              <div className="mt-3 space-y-1.5 font-mono text-[11.5px] text-foreground/80">
                {[
                  ["14:02:11", "opened", "src/app/api/health/route.ts"],
                  ["14:02:11", "executed", "bun add zod"],
                  ["14:02:12", "snapshot", "before write → src/app/api/health/route.ts"],
                  ["14:02:12", "wrote", "src/app/api/health/route.ts (1 file)"],
                  ["14:02:13", "restarted", "dev server · port 3000"],
                  ["14:02:14", "verified", "GET /api/health → 200 OK"],
                ].map((row, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-muted-foreground">{row[0]}</span>
                    <span className="w-20 text-amber-400">{row[1]}</span>
                    <span className="text-foreground/70">{row[2]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
