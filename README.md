# Solo Desktop Commander MCP

A completely free, open-source **Desktop Commander MCP** for solo developers and vibe coders.
Give any MCP-compatible AI agent real filesystem, terminal, git, and process control over your
own machine — inspect, diagnose, repair, and verify, all from chat. No accounts. No cloud.
No telemetry. No login.

This package contains the **web application** that showcases the project: a polished, interactive
landing page with **real WebGL 3D motion graphics** plus a **working MCP-style server** that
genuinely inspects a live project.

---

## Highlights

- **Interactive 3D hero** — a WebGL scene (Three.js / React Three Fiber) with a rotating wireframe
  "commander core", 22 orbiting module nodes, a 900-point particle field, and mouse-driven camera
  parallax. Respects `prefers-reduced-motion`.
- **3D tilt module cards** — every module card tilts toward the pointer with layered `translateZ`
  depth and a glow border on hover.
- **Cohesive motion** — staggered hero entrance, scroll-triggered reveals, and a floating 3D
  architecture centerpiece (Framer Motion).
- **Working MCP server** — `POST /api/commander` exposes real tools that inspect the project.
- **Security layer** — path confinement + command allowlist (e.g. `rm -rf /` is refused).

## What's inside

```
solo-commander-mcp/
├── src/
│   ├── app/
│   │   ├── api/commander/route.ts     # MCP-style tool endpoint
│   │   ├── page.tsx                   # Single-page showcase (the only user route)
│   │   ├── layout.tsx
│   │   └── globals.css                # Terminal-dark theme (emerald + amber)
│   ├── components/
│   │   ├── commander/                 # All landing-page sections
│   │   │   ├── scene-3d.tsx           # WebGL 3D hero scene (R3F + Three.js)
│   │   │   ├── hero-scene-3d.tsx      # Dynamic (ssr:false) wrapper for the canvas
│   │   │   ├── tilt-card.tsx          # Mouse-driven 3D perspective tilt
│   │   │   ├── reveal.tsx             # Scroll-triggered fade/rise
│   │   │   ├── hero.tsx  modules-grid.tsx  architecture.tsx  workflow.tsx
│   │   │   ├── terminal-demo.tsx  installation.tsx  config-security.tsx
│   │   │   ├── comparison.tsx  footer.tsx  stats-bar.tsx  section-heading.tsx  data.ts
│   │   └── ui/                        # shadcn/ui component set
│   ├── lib/commander/executor.ts      # Safe tool dispatcher (path-confined, allowlisted)
│   ├── hooks/
├── prisma/schema.prisma
├── public/
├── package.json  bun.lock  tsconfig.json  next.config.ts
├── tailwind.config.ts  postcss.config.mjs  components.json  eslint.config.mjs
├── Caddyfile
└── README.md  (this file)
```

## The interactive MCP server

`POST /api/commander` is a **real, working** MCP-style tool server:

| Tool             | What it does                                              |
|------------------|-----------------------------------------------------------|
| `project_info`   | Detects framework, language, package manager, scripts     |
| `list_files`     | Prints a tree of a directory (path-confined)              |
| `read_file`      | Reads a file (confined to project root, size-capped)      |
| `git_status`     | `git status --porcelain`                                  |
| `git_log`        | Recent commit history                                     |
| `git_branch`     | Current branch + all branches                             |
| `run_command`    | Runs a **safe allowlisted** shell command                 |
| `list_processes` | Top processes by memory                                   |

### Security model (built-in, on by default)

- **Path confinement** — filesystem tools cannot escape the project root.
- **Command allowlist** — `run_command` only executes known-safe commands; everything else
  (e.g. `rm -rf /`) is refused with a clear message.
- **Structured errors** — every failure returns `{ ok: false, output }`, never a 500.
- Every call is **logged & timestamped** in the on-screen activity log.

---

## Run it locally

Requires **Node 18+** and **Bun** (recommended) or npm/pnpm.

```bash
# 1. install dependencies (includes three, @react-three/fiber, @react-three/drei)
bun install        # or: npm install / pnpm install

# 2. configure the database url
cp .env.example .env

# 3. (optional) push the prisma schema
bun run db:push

# 4. start the dev server
bun run dev        # or: npm run dev
```

Then open **http://localhost:3000**.

> The homepage is the only user-facing route (`src/app/page.tsx`).
> The MCP tool endpoint lives at `/api/commander`.

---

## Tech stack

- **Next.js 16** (App Router) + **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui** (New York)
- **Three.js** + **@react-three/fiber** + **@react-three/drei** — WebGL 3D hero scene
- **Framer Motion** — entrance, tilt, scroll-reveal, floating animations
- **Prisma ORM** (SQLite)
- **lucide-react** icons, **sonner** toasts
- Forced dark "terminal" theme with emerald/amber accents

## Design principles

Free · Open Source · Offline First · Cross Platform · No Account · No Cloud ·
No Telemetry · No Vendor Lock-in.

## License

MIT — built for solo developers and vibe coders.
