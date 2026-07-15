import {
  FolderTree,
  TerminalSquare,
  Boxes,
  GitBranch,
  Code2,
  LifeBuoy,
  AppWindow,
  Clipboard,
  Globe,
  Cpu,
  Network,
  BrainCircuit,
  ScanSearch,
  Workflow,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type Module = {
  id: number;
  slug: string;
  name: string;
  icon: LucideIcon;
  tagline: string;
  functions: string[];
  accent: "emerald" | "amber" | "cyan" | "violet" | "rose";
};

export const MODULES: Module[] = [
  {
    id: 1,
    slug: "filesystem",
    name: "Filesystem Manager",
    icon: FolderTree,
    tagline: "Let the AI touch files exactly like a human would.",
    functions: [
      "Read / Write / Append",
      "Replace & batch rename",
      "Copy, move, delete",
      "Folder size & duplicates",
      "Watch file changes",
      "Permissions & file info",
    ],
    accent: "emerald",
  },
  {
    id: 2,
    slug: "terminal",
    name: "Terminal Commander",
    icon: TerminalSquare,
    tagline: "Hand the AI a real shell — safely, with full control.",
    functions: [
      "Run, stop, kill processes",
      "npm / pnpm / bun / pip / cargo",
      "Capture logs & exit codes",
      "Streamed output",
      "Timeout detection",
      "Background execution",
    ],
    accent: "amber",
  },
  {
    id: 3,
    slug: "project",
    name: "Project Manager",
    icon: Boxes,
    tagline: "Understand any project on sight.",
    functions: [
      "Detect framework & language",
      "Locate config & lockfiles",
      "Read package manifests",
      "Find build errors",
      "Repair dependencies",
      "Start / stop / restart",
    ],
    accent: "cyan",
  },
  {
    id: 4,
    slug: "git",
    name: "Git Manager",
    icon: GitBranch,
    tagline: "Version control without leaving the conversation.",
    functions: [
      "status / add / commit",
      "pull / push / branch / merge",
      "stash / restore / checkout",
      "Generate commit messages",
      "Summarize changes",
      "Resolve merge conflicts",
    ],
    accent: "emerald",
  },
  {
    id: 5,
    slug: "code",
    name: "Code Intelligence",
    icon: Code2,
    tagline: "Search, reason about, and refactor codebases.",
    functions: [
      "Find symbols & imports",
      "Detect dead & duplicate code",
      "Locate errors",
      "Generate documentation",
      "Refactor & rename safely",
      "Explain architecture",
    ],
    accent: "violet",
  },
  {
    id: 6,
    slug: "error",
    name: "Error Recovery Engine",
    icon: LifeBuoy,
    tagline: "From broken logs to a verified fix — autonomously.",
    functions: [
      "Read logs & identify error",
      "Search project for cause",
      "Generate & apply patch",
      "Restart the service",
      "Verify it responds",
      "Explain what happened",
    ],
    accent: "rose",
  },
  {
    id: 7,
    slug: "apps",
    name: "Application Controller",
    icon: AppWindow,
    tagline: "Launch and drive local apps.",
    functions: [
      "Launch / close / focus",
      "Minimize / maximize",
      "Detect running apps",
      "Open VS Code / Cursor",
      "Open Chrome / Explorer",
      "Window management",
    ],
    accent: "cyan",
  },
  {
    id: 8,
    slug: "clipboard",
    name: "Clipboard Manager",
    icon: Clipboard,
    tagline: "Copy, paste, and remember.",
    functions: [
      "Read & write clipboard",
      "Copy file paths",
      "Paste text anywhere",
      "Full history",
      "Image support",
      "Pinned snippets",
    ],
    accent: "amber",
  },
  {
    id: 9,
    slug: "browser",
    name: "Browser Helper",
    icon: Globe,
    tagline: "Drive the browser from chat.",
    functions: [
      "Open URL / localhost",
      "Download files",
      "Save HTML",
      "Inspect pages",
      "Open DevTools",
      "Refresh & navigate",
    ],
    accent: "violet",
  },
  {
    id: 10,
    slug: "process",
    name: "Process Manager",
    icon: Cpu,
    tagline: "See and control everything that runs.",
    functions: [
      "List running processes",
      "Kill / restart",
      "Monitor CPU & RAM",
      "Find ports",
      "Release ports",
      "Resource alerts",
    ],
    accent: "emerald",
  },
  {
    id: 11,
    slug: "port",
    name: "Port Manager",
    icon: Network,
    tagline: "Never fight 'port in use' again.",
    functions: [
      "Find process on port",
      "Kill occupant",
      "Restart server",
      "Monitor occupied ports",
      "Free a range",
      "Port forwarding",
    ],
    accent: "cyan",
  },
  {
    id: 12,
    slug: "memory",
    name: "Knowledge Memory",
    icon: BrainCircuit,
    tagline: "Let the AI remember your projects.",
    functions: [
      "Project notes",
      "Architecture & conventions",
      "Coding style",
      "Folder structure",
      "Recent fixes",
      "User preferences",
    ],
    accent: "violet",
  },
  {
    id: 13,
    slug: "scanner",
    name: "Workspace Scanner",
    icon: ScanSearch,
    tagline: "Auto-discover every project on disk.",
    functions: [
      "Git repositories",
      "Node / Python / Rust",
      "Java & Docker projects",
      "Monorepos",
      "Stale workspaces",
      "Dependency inventory",
    ],
    accent: "amber",
  },
  {
    id: 14,
    slug: "automation",
    name: "Automation Engine",
    icon: Workflow,
    tagline: "Chain tasks into one-command workflows.",
    functions: [
      "Build → test → commit",
      "Push → deploy",
      "Scheduled jobs",
      "Conditional steps",
      "Retry & rollback",
      "Shareable recipes",
    ],
    accent: "rose",
  },
  {
    id: 15,
    slug: "security",
    name: "Security Layer",
    icon: ShieldCheck,
    tagline: "Every dangerous action, gated by default.",
    functions: [
      "Safe mode prompts",
      "Confirm before delete",
      "Confirm before overwrite",
      "Confirm before git push",
      "Block rm -rf",
      "Trusted folders",
    ],
    accent: "emerald",
  },
];

export const ACCENT_CLASSES: Record<
  Module["accent"],
  { text: string; bg: string; border: string; ring: string; dot: string }
> = {
  emerald: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    ring: "group-hover:ring-emerald-500/40",
    dot: "bg-emerald-400",
  },
  amber: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    ring: "group-hover:ring-amber-500/40",
    dot: "bg-amber-400",
  },
  cyan: {
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    ring: "group-hover:ring-cyan-500/40",
    dot: "bg-cyan-400",
  },
  violet: {
    text: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    ring: "group-hover:ring-violet-500/40",
    dot: "bg-violet-400",
  },
  rose: {
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    ring: "group-hover:ring-rose-500/40",
    dot: "bg-rose-400",
  },
};

export const AI_CLIENTS = [
  "Claude Code",
  "OpenCode",
  "Hermes",
  "Gemini CLI",
  "Codex CLI",
  "Cursor",
  "Continue.dev",
  "Cline",
  "Roo Code",
];

export const PLATFORMS = [
  { name: "Windows", icon: "🪟" },
  { name: "macOS", icon: "" },
  { name: "Linux", icon: "🐧" },
  { name: "WSL", icon: "🔀" },
];

export const WORKFLOW_STEPS = [
  {
    n: "01",
    title: "Read logs",
    detail: "The AI tails the terminal output and spots the real exception.",
    tool: "terminal.tail_logs",
  },
  {
    n: "02",
    title: "Inspect files",
    detail: "It opens the failing module and traces the stack to source.",
    tool: "filesystem.read_file",
  },
  {
    n: "03",
    title: "Find error",
    detail: "Code Intelligence pinpoints the broken import & missing dep.",
    tool: "code.locate_error",
  },
  {
    n: "04",
    title: "Generate fix",
    detail: "A patch is drafted and diffed against the working tree.",
    tool: "code.generate_fix",
  },
  {
    n: "05",
    title: "Apply patch",
    detail: "The fix is written with a backup snapshot taken first.",
    tool: "filesystem.write_file",
  },
  {
    n: "06",
    title: "Restart backend",
    detail: "The dev server is restarted and the port is verified free.",
    tool: "process.restart",
  },
  {
    n: "07",
    title: "Verify localhost",
    detail: "A health check confirms the app responds 200 OK.",
    tool: "browser.open_localhost",
  },
  {
    n: "08",
    title: "Explain fix",
    detail: "A concise root-cause summary is returned to the user.",
    tool: "memory.remember",
  },
];

export const COMPARISON = {
  rows: [
    { feature: "Price", us: "Free forever", them: "Subscription / waitlist" },
    { feature: "Account required", us: "Never", them: "Company email + login" },
    { feature: "Cloud dependency", us: "None — runs on your machine", them: "Required dashboard" },
    { feature: "Telemetry", us: "Zero", them: "Analytics by default" },
    { feature: "Works offline", us: "Yes", them: "No" },
    { feature: "Source code", us: "Open source (MIT)", them: "Closed / proprietary" },
    { feature: "Onboarding", us: "One command", them: "Sales call / waitlist" },
    { feature: "Target user", us: "Solo developers", them: "Enterprise teams" },
  ],
};

export const STATS = [
  { value: "15", label: "MCP modules" },
  { value: "120+", label: "Tools exposed" },
  { value: "$0", label: "Forever, no upsell" },
  { value: "0", label: "Cloud calls" },
];

export const PRINCIPLES = [
  "Free",
  "Open Source",
  "Offline First",
  "Cross Platform",
  "No Account",
  "No Cloud",
  "No Telemetry",
  "No Lock-in",
];
