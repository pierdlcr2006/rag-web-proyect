import type { ReactNode } from 'react'

const ICONS: Record<string, ReactNode> = {
  // Documento / PDF
  pdf: (
    <>
      <path d="M6 2h7l5 5v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
      <path d="M13 2v5h5" />
    </>
  ),
  // Video
  video: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M10 9l5 3-5 3z" />
    </>
  ),
  // Audio
  audio: (
    <>
      <path d="M9 18V5l10-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
    </>
  ),
  // Datos / hoja de cálculo
  data: (
    <>
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M2 20h20" />
    </>
  ),
  // Imagen
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </>
  ),
  // Texto / doc
  doc: (
    <>
      <path d="M6 2h9l4 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
      <path d="M9 12h6M9 16h6M9 8h2" />
    </>
  ),
}

const FILES = [
  { label: 'PDF', icon: 'pdf' },
  { label: 'MP4', icon: 'video' },
  { label: 'MP3', icon: 'audio' },
  { label: 'XLSX', icon: 'data' },
  { label: 'IMG', icon: 'image' },
  { label: 'DOC', icon: 'doc' },
]

const RADIUS = 168

export default function HeroOrbit() {
  return (
    <div className="relative w-[440px] h-[440px] select-none">
      {/* Anillo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[336px] h-[336px] rounded-full border border-dashed border-white/15" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-white/5" />

      {/* Núcleo "AI" */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[#2563EB] flex items-center justify-center shadow-[0_0_60px_rgba(37,99,235,0.45)]">
        <span className="font-heading font-bold text-white text-5xl tracking-tighter">AI</span>
      </div>

      {/* Orbita de tipos de archivo */}
      <div className="orbit-spin absolute inset-0">
        {FILES.map((f, i) => {
          const angle = (360 / FILES.length) * i
          return (
            <div
              key={f.label}
              className="absolute left-1/2 top-1/2"
              style={{ transform: `rotate(${angle}deg) translateY(-${RADIUS}px) rotate(${-angle}deg)` }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <div className="orbit-counter">
                  <div className="w-[72px] h-[72px] rounded-xl border border-white/15 bg-white/[0.04] backdrop-blur-sm flex flex-col items-center justify-center gap-1 text-white/55">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {ICONS[f.icon]}
                    </svg>
                    <span className="font-heading text-[9px] font-bold uppercase tracking-widest text-white/40">
                      {f.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
