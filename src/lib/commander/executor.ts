import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const execFileAsync = promisify(execFile);

/** The project root that filesystem tools are confined to. */
export const PROJECT_ROOT = "/home/z/my-project";

/** Resolve and verify a path stays inside the project root. */
function safeResolve(input: string): string {
  const base = path.resolve(PROJECT_ROOT);
  const target = path.resolve(base, input.replace(/^\.?\/?/, ""));
  if (!target.startsWith(base + path.sep) && target !== base) {
    throw new Error(`Path escapes project root: ${input}`);
  }
  return target;
}

const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  ".turbo",
  ".cache",
]);

export type ToolResult = {
  ok: boolean;
  tool: string;
  output: string;
  meta?: Record<string, unknown>;
  durationMs?: number;
};

/** Allowlist of safe, read-only shell commands the terminal commander may run. */
const SAFE_COMMANDS: Record<string, { bin: string; args: string[] }> = {
  "node --version": { bin: "node", args: ["--version"] },
  "npm --version": { bin: "npm", args: ["--version"] },
  "bun --version": { bin: "bun", args: ["--version"] },
  "pnpm --version": { bin: "pnpm", args: ["--version"] },
  "git --version": { bin: "git", args: ["--version"] },
  "python --version": { bin: "python3", args: ["--version"] },
  "uname": { bin: "uname", args: ["-a"] },
  "whoami": { bin: "whoami", args: [] },
  "date": { bin: "date", args: [] },
  "uptime": { bin: "uptime", args: [] },
  "df -h": { bin: "df", args: ["-h", PROJECT_ROOT] },
  "ls -la": { bin: "ls", args: ["-la", PROJECT_ROOT] },
};

async function runGit(args: string[]): Promise<string> {
  try {
    const { stdout } = await execFileAsync("git", args, {
      cwd: PROJECT_ROOT,
      maxBuffer: 1024 * 1024,
      timeout: 8000,
    });
    return stdout.trim();
  } catch (err: unknown) {
    const e = err as { stderr?: string; message?: string };
    return `git ${args.join(" ")} failed: ${(e.stderr || e.message || "").trim()}`;
  }
}

type DirEntry = Awaited<ReturnType<typeof readdir>> extends (infer T)[] ? T : never;

function sortEntries(entries: DirEntry[]): DirEntry[] {
  return entries.sort((a, b) => {
    if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

async function listFiles(relPath: string, depth = 2): Promise<ToolResult> {
  const target = safeResolve(relPath);
  if (!existsSync(target)) {
    return { ok: false, tool: "list_files", output: `Not found: ${relPath}` };
  }
  const lines: string[] = [];

  const walk = async (dir: string, prefix: string, level: number) => {
    if (level > depth) return;
    let entries: DirEntry[];
    try {
      entries = (await readdir(dir, { withFileTypes: true })) as DirEntry[];
    } catch {
      return;
    }
    const visible = sortEntries(entries).filter((e) => !IGNORED_DIRS.has(e.name));
    for (let i = 0; i < visible.length; i++) {
      const it = visible[i];
      const last = i === visible.length - 1;
      const branch = last ? "└── " : "├── ";
      const tag = it.isDirectory() ? "/" : "";
      lines.push(`${prefix}${branch}${it.name}${tag}`);
      if (it.isDirectory() && level < depth) {
        await walk(path.join(dir, it.name), prefix + (last ? "    " : "│   "), level + 1);
      }
    }
  };

  await walk(target, "", 1);

  return {
    ok: true,
    tool: "list_files",
    output: lines.slice(0, 240).join("\n") || "(empty)",
    meta: { path: relPath, count: lines.length },
  };
}

async function readFileTool(relPath: string): Promise<ToolResult> {
  const target = safeResolve(relPath);
  if (!existsSync(target)) {
    return { ok: false, tool: "read_file", output: `Not found: ${relPath}` };
  }
  const s = await stat(target);
  if (s.isDirectory()) {
    return { ok: false, tool: "read_file", output: `${relPath} is a directory` };
  }
  if (s.size > 64 * 1024) {
    return {
      ok: false,
      tool: "read_file",
      output: `File too large to display (${s.size} bytes). Use list_files to navigate.`,
    };
  }
  const content = await readFile(target, "utf8");
  return {
    ok: true,
    tool: "read_file",
    output: content.slice(0, 8000),
    meta: { path: relPath, bytes: s.size },
  };
}

async function gitStatus(): Promise<ToolResult> {
  const out = await runGit(["status", "--porcelain=v1", "-b"]);
  return { ok: true, tool: "git_status", output: out || "(clean working tree)" };
}

async function gitLog(limit: number): Promise<ToolResult> {
  const out = await runGit([
    "log",
    `-${Math.min(Math.max(limit || 8, 1), 20)}`,
    "--pretty=format:%h • %an • %ar%n  %s",
  ]);
  return { ok: true, tool: "git_log", output: out || "(no commits yet)" };
}

async function gitBranch(): Promise<ToolResult> {
  const out = await runGit(["branch", "--show-current"]);
  const list = await runGit(["branch", "-a"]);
  return {
    ok: true,
    tool: "git_branch",
    output: `current: ${out || "(detached)"}\n${list}`,
  };
}

async function runCommand(command: string): Promise<ToolResult> {
  const key = command.trim();
  const allowed = SAFE_COMMANDS[key];
  if (!allowed) {
    return {
      ok: false,
      tool: "run_command",
      output: `Blocked: "${key}" is not in the safe allowlist.\nTry one of: ${Object.keys(
        SAFE_COMMANDS
      ).join(", ")}`,
    };
  }
  const start = Date.now();
  try {
    const { stdout } = await execFileAsync(allowed.bin, allowed.args, {
      cwd: PROJECT_ROOT,
      maxBuffer: 1024 * 1024,
      timeout: 10000,
    });
    return {
      ok: true,
      tool: "run_command",
      output: stdout.trim() || "(no output)",
      durationMs: Date.now() - start,
    };
  } catch (err: unknown) {
    const e = err as { stderr?: string; message?: string; stdout?: string };
    return {
      ok: false,
      tool: "run_command",
      output: (e.stdout || "") + (e.stderr || e.message || "").trim(),
      durationMs: Date.now() - start,
    };
  }
}

async function listProcesses(): Promise<ToolResult> {
  try {
    const { stdout } = await execFileAsync("ps", ["-eo", "pid,rss,%cpu,comm", "--sort=-rss"], {
      maxBuffer: 1024 * 1024,
      timeout: 8000,
    });
    const lines = stdout.trim().split("\n").slice(0, 16);
    return {
      ok: true,
      tool: "list_processes",
      output: lines.join("\n"),
      meta: { count: lines.length - 1 },
    };
  } catch {
    return { ok: false, tool: "list_processes", output: "ps unavailable in this environment" };
  }
}

async function projectInfo(): Promise<ToolResult> {
  const pkgPath = path.join(PROJECT_ROOT, "package.json");
  if (!existsSync(pkgPath)) {
    return { ok: false, tool: "project_info", output: "No package.json found" };
  }
  const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
  const deps = Object.keys(pkg.dependencies || {});
  const devDeps = Object.keys(pkg.devDependencies || {});

  const signals: string[] = [];
  if (deps.includes("next")) signals.push("Next.js");
  if (deps.includes("react")) signals.push("React");
  if (deps.includes("prisma")) signals.push("Prisma");
  if (deps.includes("tailwindcss")) signals.push("Tailwind CSS");
  if (devDeps.includes("typescript")) signals.push("TypeScript");

  const pkgManager = existsSync(path.join(PROJECT_ROOT, "bun.lock"))
    ? "bun"
    : existsSync(path.join(PROJECT_ROOT, "pnpm-lock.yaml"))
    ? "pnpm"
    : existsSync(path.join(PROJECT_ROOT, "package-lock.json"))
    ? "npm"
    : "unknown";

  const out = [
    `name:        ${pkg.name}`,
    `version:     ${pkg.version}`,
    `framework:   ${signals.join(", ") || "(unknown)"}`,
    `pkg manager: ${pkgManager}`,
    `deps:        ${deps.length}`,
    `devDeps:     ${devDeps.length}`,
    `scripts:     ${Object.keys(pkg.scripts || {}).join(", ")}`,
  ].join("\n");

  return {
    ok: true,
    tool: "project_info",
    output: out,
    meta: { framework: signals, pkgManager },
  };
}

export async function dispatchTool(
  tool: string,
  args: Record<string, unknown> = {}
): Promise<ToolResult> {
  switch (tool) {
    case "list_files":
      return listFiles(String(args.path ?? "."), Number(args.depth ?? 2));
    case "read_file":
      return readFileTool(String(args.path ?? "package.json"));
    case "git_status":
      return gitStatus();
    case "git_log":
      return gitLog(Number(args.limit ?? 8));
    case "git_branch":
      return gitBranch();
    case "run_command":
      return runCommand(String(args.command ?? ""));
    case "list_processes":
      return listProcesses();
    case "project_info":
      return projectInfo();
    default:
      return {
        ok: false,
        tool,
        output: `Unknown tool: ${tool}. Available: list_files, read_file, git_status, git_log, git_branch, run_command, list_processes, project_info`,
      };
  }
}

export const AVAILABLE_TOOLS = [
  "list_files",
  "read_file",
  "git_status",
  "git_log",
  "git_branch",
  "run_command",
  "list_processes",
  "project_info",
];
