"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  TerminalSquare,
  FolderTree,
  GitBranch,
  GitCommitHorizontal,
  Cpu,
  Boxes,
  Play,
  Loader2,
  RotateCcw,
  ChevronRight,
  Clock,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type LogEntry = {
  id: number;
  time: string;
  tool: string;
  ok: boolean;
  ms: number;
  preview: string;
};

type ScreenLine = {
  id: number;
  kind: "cmd" | "out" | "err" | "sys" | "tool";
  text: string;
};

type QuickTool = {
  tool: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  args?: Record<string, unknown>;
  hint: string;
};

const QUICK_TOOLS: QuickTool[] = [
  { tool: "project_info", label: "Inspect project", icon: Boxes, hint: "project_info()" },
  { tool: "list_files", label: "List files", icon: FolderTree, args: { path: ".", depth: 2 }, hint: "list_files('.')" },
  { tool: "git_status", label: "git status", icon: GitBranch, hint: "git_status()" },
  { tool: "git_log", label: "git log", icon: GitCommitHorizontal, args: { limit: 8 }, hint: "git_log(8)" },
  { tool: "list_processes", label: "Processes", icon: Cpu, hint: "list_processes()" },
  { tool: "run_command", label: "bun --version", icon: Play, args: { command: "bun --version" }, hint: 'run_command("bun --version")' },
  { tool: "run_command", label: "node --version", icon: Play, args: { command: "node --version" }, hint: 'run_command("node --version")' },
  { tool: "read_file", label: "Read package.json", icon: FolderTree, args: { path: "package.json" }, hint: 'read_file("package.json")' },
];

// Natural-language → tool mapping for the free-text input.
function parseInput(raw: string): { tool: string; args: Record<string, unknown> } | null {
  const s = raw.trim().toLowerCase();
  if (!s) return null;
  if (/(project|what is this|framework|stack)/.test(s)) return { tool: "project_info", args: {} };
  if (/(git status|status|what.*changed|modified)/.test(s)) return { tool: "git_status", args: {} };
  if (/(git log|history|commits|recent changes)/.test(s)) return { tool: "git_log", args: { limit: 8 } };
  if (/(branch)/.test(s)) return { tool: "git_branch", args: {} };
  if (/(process|running|cpu|memory|ram)/.test(s)) return { tool: "list_processes", args: {} };
  if (/(list files|list dir|tree|show files|folder|directory)/.test(s)) return { tool: "list_files", args: { path: ".", depth: 2 } };
  if (/(read|show|cat|open).*package\.json/.test(s)) return { tool: "read_file", args: { path: "package.json" } };
  if (/(read|show|cat|open).*layout/.test(s)) return { tool: "read_file", args: { path: "src/app/layout.tsx" } };
  // run <cmd>
  const runMatch = s.match(/^(run|exec|execute)\s+(.+)$/);
  if (runMatch) return { tool: "run_command", args: { command: raw.replace(/^(run|exec|execute)\s+/i, "") } };
  // bare shell command — route to run_command; the server allowlist blocks
  // anything dangerous (rm -rf, mkfs, force push…) with a clear message.
  if (/^(node|npm|bun|pnpm|git|python|whoami|uname|date|uptime|df|ls|rm|mkdir|touch|cat|echo|curl|wget|sudo|mv|cp|chmod|chown|kill|docker|make|gcc|go|cargo|pip)\b/.test(s)) {
    return { tool: "run_command", args: { command: raw.trim() } };
  }
  return null;
}

export function TerminalDemo() {
  const [lines, setLines] = useState<ScreenLine[]>([
    { id: 0, kind: "sys", text: "Solo Desktop Commander MCP · connected to /home/z/my-project" },
    { id: 1, kind: "sys", text: "Click a tool above, or type a command. Try: “list files”, “git status”, “bun --version”." },
  ]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [callCount, setCallCount] = useState(0);
  const screenRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(2);

  const pushLine = useCallback((kind: ScreenLine["kind"], text: string) => {
    setLines((prev) => [...prev, { id: idRef.current++, kind, text }]);
  }, []);

  const scrollDown = useCallback(() => {
    requestAnimationFrame(() => {
      if (screenRef.current) screenRef.current.scrollTop = screenRef.current.scrollHeight;
    });
  }, []);

  const runTool = useCallback(
    async (tool: string, args: Record<string, unknown>, label?: string) => {
      setLoading(true);
      setCallCount((c) => c + 1);
      pushLine("tool", `$ mcp.call(${tool}${args && Object.keys(args).length ? ", " + JSON.stringify(args) : ""})`);
      scrollDown();
      try {
        const res = await fetch("/api/commander", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tool, args }),
        });
        const data = await res.json();
        const out: string = data.output ?? "(no output)";
        const ok: boolean = data.ok ?? false;
        const ms: number = data.durationMs ?? 0;

        if (ok) {
          pushLine("out", out);
        } else {
          pushLine("err", out);
        }
        setLog((prev) => [
          {
            id: idRef.current++,
            time: new Date().toLocaleTimeString("en-US", { hour12: false }),
            tool: label ?? tool,
            ok,
            ms,
            preview: out.split("\n")[0].slice(0, 60),
          },
          ...prev,
        ].slice(0, 8));
      } catch (e) {
        pushLine("err", `request failed: ${(e as Error).message}`);
      } finally {
        setLoading(false);
        scrollDown();
      }
    },
    [pushLine, scrollDown]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    pushLine("cmd", `you › ${input}`);
    const parsed = parseInput(input);
    if (!parsed) {
      pushLine("err", `Unrecognized command. Try: list files · git status · git log · processes · bun --version · read package.json`);
      setInput("");
      scrollDown();
      return;
    }
    const cmd = input;
    setInput("");
    void runTool(parsed.tool, parsed.args, cmd);
  };

  // Auto-run project_info once on mount so the screen isn't empty.
  useEffect(() => {
    const t = setTimeout(() => void runTool("project_info", {}, "auto: project_info"), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="demo" className="relative scroll-mt-20 border-y border-border/60 bg-card/20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="// live demo"
          title="Drive the real MCP server. Right now."
          description="This terminal is wired to a working MCP-style endpoint that inspects the actual project running this page. Every click is a real tool call — filesystem, git, processes, the lot. No mock data."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_300px]">
          {/* terminal */}
          <div className="overflow-hidden rounded-xl border border-border/80 bg-[oklch(0.14_0.008_160)] shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border/60 bg-card/40 px-4 py-2.5">
              <TerminalSquare className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-xs text-muted-foreground">commander@localhost</span>
              <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                <span className={`h-1.5 w-1.5 rounded-full ${loading ? "bg-amber-400 cmd-pulse" : "bg-emerald-400"}`} />
                {loading ? "running" : "ready"}
              </span>
            </div>

            {/* quick tools */}
            <div className="flex flex-wrap gap-1.5 border-b border-border/60 bg-background/40 px-3 py-2.5">
              {QUICK_TOOLS.map((q, i) => {
                const Icon = q.icon;
                return (
                  <button
                    key={`${q.tool}-${i}`}
                    onClick={() => void runTool(q.tool, q.args ?? {}, q.label)}
                    disabled={loading}
                    className="group inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card/50 px-2.5 py-1.5 font-mono text-[11px] text-foreground/80 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300 disabled:opacity-50"
                    title={q.hint}
                  >
                    <Icon className="h-3 w-3" />
                    {q.label}
                  </button>
                );
              })}
            </div>

            {/* screen */}
            <div
              ref={screenRef}
              className="cmd-scroll h-[360px] overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed sm:h-[420px]"
            >
              {lines.map((l) => {
                if (l.kind === "sys")
                  return (
                    <div key={l.id} className="text-muted-foreground/70">
                      <span className="text-emerald-400/60">#</span> {l.text}
                    </div>
                  );
                if (l.kind === "cmd")
                  return (
                    <div key={l.id} className="mt-2 text-foreground">
                      {l.text}
                    </div>
                  );
                if (l.kind === "tool")
                  return (
                    <div key={l.id} className="mt-1.5 text-emerald-400">
                      {l.text}
                    </div>
                  );
                if (l.kind === "err")
                  return (
                    <div key={l.id} className="mt-1 whitespace-pre-wrap text-rose-400">
                      {l.text}
                    </div>
                  );
                return (
                  <div key={l.id} className="mt-1 whitespace-pre-wrap text-foreground/85">
                    {l.text}
                  </div>
                );
              })}
              {loading && (
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                  <span className="text-[12px]">executing tool…</span>
                </div>
              )}
            </div>

            {/* input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-border/60 bg-background/40 px-3 py-2.5"
            >
              <ChevronRight className="h-4 w-4 shrink-0 text-emerald-400" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ask the commander…  (e.g. “git log”, “read package.json”, “bun --version”)"
                className="flex-1 bg-transparent font-mono text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-md bg-emerald-500/90 px-3 py-1 font-mono text-[11px] text-emerald-950 transition-colors hover:bg-emerald-400 disabled:opacity-40"
              >
                run
              </button>
            </form>
          </div>

          {/* sidebar — activity log */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-border/70 bg-card/40 p-4">
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-emerald-400" /> activity log
                </h4>
                <button
                  onClick={() => {
                    setLog([]);
                    setLines([
                      { id: idRef.current++, kind: "sys", text: "log cleared · terminal reset" },
                    ]);
                    setCallCount(0);
                  }}
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" /> clear
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {log.length === 0 && (
                  <p className="font-mono text-[11px] text-muted-foreground/60">
                    no activity yet — run a tool.
                  </p>
                )}
                {log.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-md border border-border/50 bg-background/40 px-2.5 py-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-foreground/80">{e.tool}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{e.time}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`font-mono text-[10px] ${
                          e.ok ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {e.ok ? "✓ ok" : "✗ err"}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">{e.ms}ms</span>
                    </div>
                    <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground/80">
                      {e.preview}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/40 p-4">
              <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                session
              </h4>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Stat label="tool calls" value={callCount} />
                <Stat label="cloud calls" value={0} accent="emerald" />
                <Stat label="modules" value={15} />
                <Stat label="tools" value="120+" />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-mono text-[10px]">
                  safe mode
                </Badge>
                <Badge variant="outline" className="border-border/60 font-mono text-[10px]">
                  path-confined
                </Badge>
                <Badge variant="outline" className="border-border/60 font-mono text-[10px]">
                  allowlist
                </Badge>
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/40 p-4">
              <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                try typing
              </h4>
              <ul className="mt-3 space-y-1.5 font-mono text-[11px] text-muted-foreground">
                {["list files", "git status", "git log", "processes", "read package.json", "bun --version"].map((s) => (
                  <li key={s}>
                    <button
                      onClick={() => {
                        setInput(s);
                      }}
                      className="text-emerald-300/80 hover:text-emerald-300 hover:underline"
                    >
                      › {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[11px] text-muted-foreground">
          Every call is logged &amp; timestamped · file writes are snapshot-backed · dangerous actions are gated by the security layer
        </p>
      </div>
    </section>
  );
}

function Stat({ label, value, accent }: { label: string; value: number | string; accent?: "emerald" }) {
  return (
    <div className="rounded-md border border-border/50 bg-background/40 px-2.5 py-2">
      <div className={`font-mono text-lg font-semibold ${accent === "emerald" ? "text-emerald-400" : "text-foreground"}`}>
        {value}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
