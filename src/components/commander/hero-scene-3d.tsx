"use client";

import dynamic from "next/dynamic";

// Load the WebGL scene client-only to avoid any SSR/hydration concerns.
const CommanderScene3D = dynamic(
  () => import("./scene-3d").then((m) => m.CommanderScene3D),
  {
    ssr: false,
    loading: () => null,
  }
);

export function HeroScene3D({ className }: { className?: string }) {
  return <CommanderScene3D className={className} />;
}
