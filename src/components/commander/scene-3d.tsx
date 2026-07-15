"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Reduced-motion guard                                              */
/* ------------------------------------------------------------------ */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ */
/*  Mouse parallax hook (shared via ref)                              */
/* ------------------------------------------------------------------ */
function useMouseRef() {
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return mouse;
}

/* ------------------------------------------------------------------ */
/*  The central commander core                                        */
/*  - inner solid translucent icosahedron (glow body)                 */
/*  - wireframe icosahedron shell (emerald)                           */
/*  - second larger wireframe (amber, counter-rotating)              */
/* ------------------------------------------------------------------ */
function CommanderCore({ reduced }: { reduced: boolean }) {
  const inner = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const shell2 = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    const k = reduced ? 0.1 : 1;
    const d = Math.min(dt, 0.05) * k;
    if (inner.current) {
      inner.current.rotation.y += d * 0.18;
      inner.current.rotation.x += d * 0.06;
    }
    if (shell.current) {
      shell.current.rotation.y -= d * 0.12;
      shell.current.rotation.z += d * 0.05;
    }
    if (shell2.current) {
      shell2.current.rotation.x += d * 0.08;
      shell2.current.rotation.y -= d * 0.04;
    }
  });

  return (
    <group ref={inner}>
      {/* glow body */}
      <mesh>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* inner wireframe */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshBasicMaterial
          color="#34d399"
          wireframe
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* outer amber shell */}
      <mesh ref={shell2}>
        <icosahedronGeometry args={[1.7, 0]} />
        <meshBasicMaterial
          color="#fbbf24"
          wireframe
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* bright core point */}
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color="#6ee7b7" />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Orbiting module nodes                                             */
/* ------------------------------------------------------------------ */
type NodeDef = {
  radius: number;
  speed: number;
  phase: number;
  tilt: number;
  size: number;
  color: string;
  shape: "octa" | "cube" | "tetra";
};

const SHAPES: NodeDef["shape"][] = ["octa", "cube", "tetra"];
const COLORS = ["#34d399", "#fbbf24", "#22d3ee", "#a78bfa"];

function makeNodes(n: number): NodeDef[] {
  return Array.from({ length: n }, (_, i) => ({
    radius: 2.4 + (i % 5) * 0.55,
    speed: 0.12 + ((i * 7) % 10) / 60,
    phase: (i / n) * Math.PI * 2,
    tilt: ((i * 37) % 90) * (Math.PI / 180),
    size: 0.07 + ((i * 13) % 7) / 100,
    color: COLORS[i % COLORS.length],
    shape: SHAPES[i % SHAPES.length],
  }));
}

function OrbitingNodes({ reduced }: { reduced: boolean }) {
  const nodes = useMemo(() => makeNodes(22), []);
  const group = useRef<THREE.Group>(null);
  const tRef = useRef(0);

  useFrame((_, dt) => {
    tRef.current += Math.min(dt, 0.05) * (reduced ? 0.15 : 1);
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const n = nodes[i];
      const t = tRef.current * n.speed + n.phase;
      const r = n.radius;
      child.position.set(
        Math.cos(t) * r,
        Math.sin(t) * r * Math.cos(n.tilt),
        Math.sin(t) * r * Math.sin(n.tilt)
      );
      child.rotation.x += 0.01;
      child.rotation.y += 0.013;
    });
  });

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <mesh key={i}>
          {n.shape === "octa" && <octahedronGeometry args={[n.size, 0]} />}
          {n.shape === "cube" && <boxGeometry args={[n.size, n.size, n.size]} />}
          {n.shape === "tetra" && <tetrahedronGeometry args={[n.size, 0]} />}
          <meshBasicMaterial
            color={n.color}
            wireframe
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Particle dust field                                               */
/* ------------------------------------------------------------------ */
function ParticleField({ reduced }: { reduced: boolean }) {
  const points = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const count = 900;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color("#34d399");
    const c2 = new THREE.Color("#fbbf24");
    const c3 = new THREE.Color("#22d3ee");
    for (let i = 0; i < count; i++) {
      // distribute in a spherical shell
      const r = 3 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const pick = Math.random();
      const c = pick < 0.5 ? c1 : pick < 0.8 ? c2 : c3;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame((_, dt) => {
    if (!points.current) return;
    points.current.rotation.y += Math.min(dt, 0.05) * (reduced ? 0.01 : 0.025);
    points.current.rotation.x += Math.min(dt, 0.05) * (reduced ? 0.004 : 0.01);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/*  Rig that applies mouse parallax to the whole scene                */
/* ------------------------------------------------------------------ */
function ParallaxRig({
  mouse,
  reduced,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  reduced: boolean;
}) {
  const target = useRef(new THREE.Vector2(0, 0));

  useFrame((state, dt) => {
    const lerp = reduced ? 0.02 : 0.05;
    target.current.x += (mouse.current.x - target.current.x) * lerp;
    target.current.y += (mouse.current.y - target.current.y) * lerp;
    const k = reduced ? 0.25 : 0.9;
    const cam = state.camera;
    const nx = target.current.x * k;
    const ny = -target.current.y * k * 0.6;
    const nz = cam.position.z;
    cam.position.set(nx, ny, nz);
    cam.lookAt(0, 0, 0);
    void dt;
  });
  return null;
}

/* ------------------------------------------------------------------ */
/*  Public component                                                  */
/* ------------------------------------------------------------------ */
export function CommanderScene3D({
  className,
}: {
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const mouse = useMouseRef();

  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#0a0f0d", 6, 14]} />
        <ambientLight intensity={0.6} />
        <ParallaxRig mouse={mouse} reduced={reduced} />
        <CommanderCore reduced={reduced} />
        <OrbitingNodes reduced={reduced} />
        <ParticleField reduced={reduced} />
      </Canvas>
    </div>
  );
}
