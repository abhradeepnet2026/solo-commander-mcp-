import { NextRequest, NextResponse } from "next/server";
import { dispatchTool, AVAILABLE_TOOLS, type ToolResult } from "@/lib/commander/executor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  tool: string;
  args?: Record<string, unknown>;
};

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const tool = String(body.tool ?? "").trim();
  if (!tool) {
    return NextResponse.json(
      { ok: false, error: "Missing 'tool'.", available: AVAILABLE_TOOLS },
      { status: 400 }
    );
  }

  const start = Date.now();
  let result: ToolResult;
  try {
    result = await dispatchTool(tool, body.args ?? {});
  } catch (err: unknown) {
    result = {
      ok: false,
      tool,
      output: `Tool execution failed: ${(err as Error).message}`,
    };
  }
  const durationMs = Date.now() - start;

  return NextResponse.json({
    ...result,
    durationMs: result.durationMs ?? durationMs,
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return NextResponse.json({
    service: "Solo Desktop Commander MCP",
    version: "1.0.0",
    tools: AVAILABLE_TOOLS,
    note: "POST { tool, args } to invoke a tool. Filesystem tools are confined to the project root. run_command uses a safe allowlist.",
  });
}
