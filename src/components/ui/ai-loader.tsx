import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { RagStage } from "@/features/chat/hooks/useStreamingMessage";

// ─── Stage Config ─────────────────────────────────────────────────────────────

const STAGE_CONFIG: Record<
  RagStage,
  { label: string; shadows: [string, string, string]; glow: string; bg: string }
> = {
  idle: {
    label: "",
    shadows: ["#38bdf8", "#005dff", "#1e40af"],
    glow: "rgba(56,189,248,0.35)",
    bg: "from-[#0c1a3a] via-[#0f172a] to-black",
  },
  validating: {
    label: "Validando cuaderno",
    shadows: ["#38bdf8", "#005dff", "#1e40af"],
    glow: "rgba(56,189,248,0.35)",
    bg: "from-[#0c1a3a] via-[#0f172a] to-black",
  },
  analyzing: {
    label: "Analizando pregunta",
    shadows: ["#a78bfa", "#7c3aed", "#4c1d95"],
    glow: "rgba(167,139,250,0.35)",
    bg: "from-[#1a0c3a] via-[#130f2a] to-black",
  },
  searching: {
    label: "Buscando documentos",
    shadows: ["#fbbf24", "#f59e0b", "#b45309"],
    glow: "rgba(251,191,36,0.35)",
    bg: "from-[#2a1a0c] via-[#1a110a] to-black",
  },
  generating: {
    label: "Generando respuesta",
    shadows: ["#34d399", "#059669", "#065f46"],
    glow: "rgba(52,211,153,0.35)",
    bg: "from-[#0c2a1a] via-[#0a1a12] to-black",
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface AILoaderProps {
  stage: RagStage;
  size?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AILoader: React.FC<AILoaderProps> = ({ stage, size = 180 }) => {
  const sphereRef    = useRef<HTMLDivElement>(null);
  const labelRef     = useRef<HTMLSpanElement>(null);
  const bgRef        = useRef<HTMLDivElement>(null);
  const prevStage    = useRef<RagStage>("idle");
  const spinTween    = useRef<gsap.core.Tween | null>(null);

  const cfg = STAGE_CONFIG[stage] ?? STAGE_CONFIG.validating;

  // Build the inset box-shadow string that creates the 3D sphere effect
  const buildShadow = (s: [string, string, string], glowColor: string) =>
    `0 6px 12px 0 ${s[0]} inset,
     0 12px 18px 0 ${s[1]} inset,
     0 36px 36px 0 ${s[2]} inset,
     0 0 3px 1.5px ${glowColor},
     0 0 20px 8px ${glowColor},
     0 0 60px 20px ${glowColor.replace("0.35", "0.15")}`;

  // ── Spin animation (continuous on mount) ────────────────────────────────────
  useEffect(() => {
    const sphere = sphereRef.current;
    if (!sphere) return;

    const initCfg = STAGE_CONFIG.validating;
    gsap.set(sphere, {
      boxShadow: buildShadow(initCfg.shadows, initCfg.glow),
    });

    spinTween.current = gsap.to(sphere, {
      rotation: "+=360",
      duration: 5,
      repeat: -1,
      ease: "none",
    });

    return () => { spinTween.current?.kill(); };
  }, []);

  // ── Stage transition ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (prevStage.current === stage) return;
    prevStage.current = stage;

    const sphere = sphereRef.current;
    const label  = labelRef.current;
    const bg     = bgRef.current;
    if (!sphere || !label || !bg) return;

    const tl = gsap.timeline();

    // 1. Label exits
    tl.to(label, { opacity: 0, y: -6, duration: 0.2, ease: "power2.in" })

    // 2. Sphere morphs — box-shadow color changes, pulse
    .to(sphere, {
      boxShadow: buildShadow(cfg.shadows, cfg.glow),
      scale: 1.08,
      duration: 0.5,
      ease: "power2.out",
    }, "-=0.1")
    .to(sphere, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" })

    // 3. New label enters
    .set(label, { textContent: cfg.label })
    .fromTo(label,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)" },
      "-=0.2"
    );
  }, [stage, cfg]);

  if (stage === "idle") return null;

  return (
    <div
      ref={bgRef}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b ${cfg.bg}`}
    >
      {/* Sphere container */}
      <div
        className="relative flex items-center justify-center select-none"
        style={{ width: size, height: size }}
      >
        {/* Glowing rotating sphere */}
        <div
          ref={sphereRef}
          className="absolute inset-0 rounded-full"
          style={{
            willChange: "transform, box-shadow",
            boxShadow: buildShadow(cfg.shadows, cfg.glow),
          }}
        />

        {/* Text inside the sphere */}
        <span
          ref={labelRef}
          className="relative z-10 text-white/70 text-sm font-medium tracking-wide text-center px-3"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
        >
          {cfg.label}
        </span>
      </div>
    </div>
  );
};

export default AILoader;
