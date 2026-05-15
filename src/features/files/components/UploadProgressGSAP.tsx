import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { CheckCircle2, FileText, Loader2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UploadStage =
  | 'pending'
  | 'uploading'
  | 'processing'
  | 'embedding'
  | 'completed'
  | 'error';

export interface UploadFileEntry {
  id: string;
  name: string;
  size: number;
  stage: UploadStage;
  progress: number; // 0-100
  error?: string;
}

interface Props {
  files: UploadFileEntry[];
}

// ─── Stage config ─────────────────────────────────────────────────────────────

const STAGES: Record<UploadStage, { label: string; color: string; bgColor: string; barColor: string }> = {
  pending:    { label: 'En espera...',             color: '#ffffff40', bgColor: '#ffffff08', barColor: '#ffffff20' },
  uploading:  { label: 'Subiendo archivo...',      color: '#60a5fa',  bgColor: '#1e3a5f',   barColor: '#3b82f6'   },
  processing: { label: 'Procesando documento...',  color: '#a78bfa',  bgColor: '#2d1b5c',   barColor: '#8b5cf6'   },
  embedding:  { label: 'Inicializando embeddings...', color: '#f59e0b', bgColor: '#3d2b0a', barColor: '#f59e0b'  },
  completed:  { label: '¡Listo!',                 color: '#34d399',  bgColor: '#0d3d2a',   barColor: '#10b981'   },
  error:      { label: 'Error al procesar',        color: '#f87171',  bgColor: '#3d0d0d',   barColor: '#ef4444'   },
};

// ─── Stage progress map ───────────────────────────────────────────────────────

const STAGE_PROGRESS: Record<UploadStage, number> = {
  pending:    0,
  uploading:  35,
  processing: 65,
  embedding:  85,
  completed:  100,
  error:      100,
};

// ─── Single File Row ──────────────────────────────────────────────────────────

const FileRow: React.FC<{ entry: UploadFileEntry }> = ({ entry }) => {
  const barRef      = useRef<HTMLDivElement>(null);
  const labelRef    = useRef<HTMLSpanElement>(null);
  const rowRef      = useRef<HTMLDivElement>(null);
  const dotsRef     = useRef<HTMLSpanElement>(null);
  const glowRef     = useRef<HTMLDivElement>(null);
  const prevStage   = useRef<UploadStage>('pending');

  const cfg = STAGES[entry.stage];
  const targetProgress = entry.stage === 'uploading' ? entry.progress : STAGE_PROGRESS[entry.stage];

  // ── Mount: slide-in animation ──────────────────────────────────────────────
  useEffect(() => {
    if (!rowRef.current) return;
    gsap.fromTo(rowRef.current,
      { opacity: 0, y: 16, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' }
    );
  }, []);

  // ── Stage change animation ─────────────────────────────────────────────────
  useEffect(() => {
    if (prevStage.current === entry.stage) return;
    prevStage.current = entry.stage;

    const bar   = barRef.current;
    const label = labelRef.current;
    const glow  = glowRef.current;

    if (!bar || !label) return;

    const tl = gsap.timeline();

    // 1. Flash the row border
    tl.to(rowRef.current, {
      boxShadow: `0 0 0 1.5px ${cfg.color}60`,
      duration: 0.2,
      ease: 'power1.out',
    })
    // 2. Animate bar to new width
    .to(bar, {
      width: `${targetProgress}%`,
      backgroundColor: cfg.barColor,
      duration: entry.stage === 'completed' ? 0.6 : 0.9,
      ease: entry.stage === 'completed' ? 'power4.out' : 'power2.inOut',
    }, '<')
    // 3. Glow pulse on bar end
    .fromTo(glow,
      { opacity: 0.8, scaleX: 1 },
      { opacity: 0, scaleX: 2.5, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
    // 4. Label flip
    .fromTo(label,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(2)' },
      '-=0.4'
    )
    // 5. Remove flash
    .to(rowRef.current, {
      boxShadow: '0 0 0 1px #ffffff08',
      duration: 0.5,
    });

    // Completed burst
    if (entry.stage === 'completed' && rowRef.current) {
      gsap.to(rowRef.current, {
        backgroundColor: '#0d3d2a',
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
        delay: 0.3,
      });
    }
  }, [entry.stage, cfg, targetProgress]);

  // ── Upload progress bar (uploading only) ─────────────────────────────────
  useEffect(() => {
    if (entry.stage !== 'uploading' || !barRef.current) return;
    gsap.to(barRef.current, {
      width: `${entry.progress}%`,
      duration: 0.3,
      ease: 'none',
    });
  }, [entry.progress, entry.stage]);

  // ── Animated dots for active stages ──────────────────────────────────────
  useEffect(() => {
    const dots = dotsRef.current;
    if (!dots) return;

    const active = ['uploading', 'processing', 'embedding'].includes(entry.stage);
    if (!active) { dots.textContent = ''; return; }

    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 4;
      dots.textContent = '.'.repeat(count);
    }, 380);
    return () => clearInterval(interval);
  }, [entry.stage]);

  const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div
      ref={rowRef}
      className="relative rounded-2xl border border-white/[0.08] overflow-hidden"
      style={{ backgroundColor: cfg.bgColor, boxShadow: '0 0 0 1px #ffffff08' }}
    >
      {/* Content */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
        >
          {entry.stage === 'completed'
            ? <CheckCircle2 size={18} />
            : entry.stage === 'error'
              ? <span className="text-sm font-black">!</span>
              : <FileText size={18} />
          }
        </div>

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white/80 truncate">{entry.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span
              ref={labelRef}
              className="text-[11px] font-semibold"
              style={{ color: cfg.color }}
            >
              {cfg.label}
            </span>
            <span
              ref={dotsRef}
              className="text-[11px] font-mono w-4"
              style={{ color: cfg.color }}
            />
          </div>
        </div>

        {/* Size + spinner */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="text-[10px] text-white/30 font-medium">{formatSize(entry.size)}</span>
          {['uploading', 'processing', 'embedding'].includes(entry.stage) && (
            <Loader2 size={14} className="animate-spin" style={{ color: cfg.color }} />
          )}
        </div>
      </div>

      {/* Progress bar track */}
      <div className="mx-4 mb-4 h-1.5 rounded-full bg-white/[0.06] overflow-hidden relative">
        <div
          ref={barRef}
          className="h-full rounded-full absolute left-0 top-0"
          style={{
            width: '0%',
            backgroundColor: cfg.barColor,
          }}
        />
        {/* Glow dot at bar tip */}
        <div
          ref={glowRef}
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0"
          style={{
            right: `${100 - targetProgress}%`,
            backgroundColor: cfg.barColor,
            filter: 'blur(4px)',
          }}
        />
      </div>

      {/* Stage label at bottom-right */}
      <div className="absolute bottom-2 right-4">
        <span
          className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40"
          style={{ color: cfg.color }}
        >
          {Math.round(targetProgress)}%
        </span>
      </div>
    </div>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────

// Maps upload stage → AILoader sphere stage label & colors
const UPLOAD_TO_SPHERE: Record<string, { label: string; shadows: [string,string,string]; glow: string; bg: string }> = {
  uploading:  { label: 'Subiendo archivo...',       shadows: ['#38bdf8','#005dff','#1e40af'], glow: 'rgba(56,189,248,0.35)',  bg: 'from-[#0c1a3a] via-[#0f172a] to-black' },
  processing: { label: 'Procesando documento...',   shadows: ['#a78bfa','#7c3aed','#4c1d95'], glow: 'rgba(167,139,250,0.35)', bg: 'from-[#1a0c3a] via-[#130f2a] to-black' },
  embedding:  { label: 'Inicializando embeddings...', shadows: ['#fbbf24','#f59e0b','#b45309'], glow: 'rgba(251,191,36,0.35)', bg: 'from-[#2a1a0c] via-[#1a110a] to-black'  },
};

const buildShadow = (s: [string,string,string], glow: string) =>
  `0 6px 12px 0 ${s[0]} inset, 0 12px 18px 0 ${s[1]} inset, 0 36px 36px 0 ${s[2]} inset, 0 0 3px 1.5px ${glow}, 0 0 20px 8px ${glow}, 0 0 60px 20px ${glow.replace('0.35','0.12')}`;

// Full-screen sphere shown during active upload
const UploadSphere: React.FC<{ activeStage: string }> = ({ activeStage }) => {
  const sphereRef = useRef<HTMLDivElement>(null);
  const labelRef  = useRef<HTMLSpanElement>(null);
  const spinRef   = useRef<gsap.core.Tween | null>(null);
  const prevStage = useRef('');

  const cfg = UPLOAD_TO_SPHERE[activeStage];

  useEffect(() => {
    const sphere = sphereRef.current;
    if (!sphere || !cfg) return;
    gsap.set(sphere, { boxShadow: buildShadow(cfg.shadows, cfg.glow) });
    if (!spinRef.current) {
      spinRef.current = gsap.to(sphere, { rotation: '+=360', duration: 5, repeat: -1, ease: 'none' });
    }
    return () => { spinRef.current?.kill(); spinRef.current = null; };
  }, []);

  useEffect(() => {
    if (!cfg || prevStage.current === activeStage) return;
    prevStage.current = activeStage;
    const sphere = sphereRef.current;
    const label  = labelRef.current;
    if (!sphere || !label) return;
    const tl = gsap.timeline();
    tl.to(label,  { opacity: 0, y: -6, duration: 0.2, ease: 'power2.in' })
      .to(sphere,  { boxShadow: buildShadow(cfg.shadows, cfg.glow), scale: 1.08, duration: 0.5, ease: 'power2.out' }, '-=0.1')
      .to(sphere,  { scale: 1, duration: 0.4, ease: 'elastic.out(1,0.5)' })
      .set(label,  { textContent: cfg.label })
      .fromTo(label, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(2)' }, '-=0.2');
  }, [activeStage, cfg]);

  if (!cfg) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b ${cfg.bg}`}>
      <div className="relative flex items-center justify-center select-none" style={{ width: 180, height: 180 }}>
        <div ref={sphereRef} className="absolute inset-0 rounded-full" style={{ willChange: 'transform, box-shadow' }} />
        <span
          ref={labelRef}
          className="relative z-10 text-white/70 text-sm font-medium tracking-wide text-center px-4"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
        >
          {cfg.label}
        </span>
      </div>
    </div>
  );
};

export const UploadProgressGSAP: React.FC<Props> = ({ files }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || files.length === 0) return;
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
  }, [files.length]);

  // Find the active stage to show on the sphere
  const activeFile = files.find(f => ['uploading','processing','embedding'].includes(f.stage));

  if (files.length === 0) return null;

  return (
    <>
      {/* Full-screen sphere while any file is actively processing */}
      {activeFile && <UploadSphere activeStage={activeFile.stage} />}

      {/* Progress rows (always visible below the sphere when done) */}
      <div ref={containerRef} className="space-y-3 mt-4">
        <p className="text-[10px] font-black text-white/25 uppercase tracking-[0.3em]">
          Progreso de carga
        </p>
        {files.map((f) => (
          <FileRow key={f.id} entry={f} />
        ))}
      </div>
    </>
  );
};
