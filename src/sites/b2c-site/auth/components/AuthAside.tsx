import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SLIDE_MS = 6000;

type SlideType = 'pdf' | 'video' | 'audio' | 'data' | 'image';

const SLIDES: { type: SlideType; tag: string; title: [string, string, string]; desc: string }[] = [
  {
    type: 'pdf',
    tag: 'PDF · OCR',
    title: ['Documentos', 'sin límite', 'de páginas'],
    desc: 'Lee PDFs de cientos de páginas con OCR y detección de tablas y gráficos.',
  },
  {
    type: 'video',
    tag: 'MP4 · MOV',
    title: ['Video con', 'marca de', 'tiempo exacta'],
    desc: 'Transcripción fonética y búsqueda semántica sobre horas de video.',
  },
  {
    type: 'audio',
    tag: 'MP3 · WAV',
    title: ['Tu audio', 'convertido', 'en datos'],
    desc: 'Transcribe reuniones y notas de voz con citas verificables a la fuente.',
  },
  {
    type: 'data',
    tag: 'XLSX · CSV',
    title: ['Datos sin', 'ruido', 'solo señal'],
    desc: 'Síntesis estadística y detección de anomalías en hojas de millones de celdas.',
  },
  {
    type: 'image',
    tag: 'IMG · SCAN',
    title: ['Imágenes', 'leídas', 'al detalle'],
    desc: 'Extrae texto y contexto de capturas, diagramas y documentos escaneados.',
  },
];

// Arte tipo "blueprint": líneas finas en currentColor (cobalt) con glow del
// contenedor .slide-art, para que se funda con el grid y la aurora del fondo.
function SlideArt({ type }: { type: SlideType }) {
  if (type === 'audio') {
    return (
      <div className="flex items-center gap-2.5 h-44">
        {Array.from({ length: 11 }).map((_, i) => (
          <span
            key={i}
            className="w-[3px] h-full rounded-full bg-current"
            style={{ transformOrigin: 'center', animation: `eqBar ${0.7 + (i % 4) * 0.18}s ease-in-out infinite`, animationDelay: `${i * 0.06}s` }}
          />
        ))}
      </div>
    );
  }
  if (type === 'data') {
    const bars = [40, 70, 55, 95, 62, 80];
    return (
      <svg viewBox="0 0 200 150" className="w-80 h-60 overflow-visible" fill="none" stroke="currentColor">
        <line x1="8" y1="132" x2="192" y2="132" strokeOpacity="0.4" strokeWidth="1.5" />
        {bars.map((h, i) => (
          <rect
            key={i}
            x={18 + i * 30}
            y={132 - h}
            width="18"
            height={h}
            rx="1.5"
            fill="currentColor"
            fillOpacity="0.1"
            strokeOpacity="0.5"
            strokeWidth="1"
            style={{ transformBox: 'fill-box', transformOrigin: 'bottom', animation: `artGrow 0.9s cubic-bezier(.22,1,.36,1) forwards`, animationDelay: `${i * 0.1}s` }}
          />
        ))}
        <polyline className="art-trend" points="27,92 57,62 87,77 117,37 147,75 177,52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {[92, 62, 77, 37, 75, 52].map((y, i) => (
          <circle key={i} cx={27 + i * 30} cy={y} r="3" fill="currentColor" stroke="none" />
        ))}
      </svg>
    );
  }
  if (type === 'video') {
    return (
      <div className="relative w-60 h-60 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute w-44 h-44 rounded-full border border-current"
            style={{ animation: `artRipple 2.4s ease-out infinite`, animationDelay: `${i * 0.8}s` }}
          />
        ))}
        <div className="w-28 h-28 rounded-full border-2 border-current flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-9 h-9 ml-1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div className="absolute -bottom-12 left-4 right-4 h-px bg-[#2563EB]/25 overflow-hidden">
          <span className="block h-full bg-current" style={{ animation: 'loginProgress 3s linear infinite' }} />
        </div>
      </div>
    );
  }
  if (type === 'image') {
    return (
      <div className="relative w-72 h-52 border border-current overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-20 h-20" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.6" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <span
          className="absolute top-0 bottom-0 w-1/2"
          style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(37,99,235,.45) 50%, transparent 60%)', animation: 'artShine 2.8s ease-in-out infinite' }}
        />
      </div>
    );
  }
  // pdf / doc
  return (
    <div className="relative w-44 h-56 border border-current overflow-hidden">
      <div className="p-5 space-y-3">
        {[100, 85, 92, 60, 95, 78, 88].map((w, i) => (
          <div key={i} className="h-1.5 rounded-full bg-[#2563EB]/30" style={{ width: `${w}%` }} />
        ))}
      </div>
      <span
        className="absolute left-0 right-0 h-12 bg-gradient-to-b from-transparent via-[#2563EB]/40 to-transparent"
        style={{ animation: 'artScan 3s ease-in-out infinite' }}
      />
    </div>
  );
}

/** Panel visual izquierdo compartido por Login y Registro (aurora + carrusel de capacidades). */
export default function AuthAside() {
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [slide]);

  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r-4 border-white/10">
      {/* Fondo: aurora cobalt en movimiento + grid sutil + viñeta */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0b1226] to-[#0A0A0A]" />
        <div className="absolute -top-1/4 -left-1/4 w-[65%] h-[65%] rounded-full bg-[#2563EB]/30 blur-[130px] login-blob-1" />
        <div className="absolute top-1/3 -right-1/4 w-[60%] h-[60%] rounded-full bg-[#2563EB]/20 blur-[150px] login-blob-2" />
        <div className="absolute inset-0 opacity-[0.05] login-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(10,10,10,0.6))]" />
      </div>

      <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
        <button
          onClick={() => navigate('/')}
          className="flex items-center cursor-pointer self-start"
          aria-label="TalKent AI — Inicio"
        >
          <img src="/logo-3.png" alt="TalKent AI" className="h-16 xl:h-20 w-auto" />
        </button>

        {/* Carrusel: visual enmarcado + tipografía, en un mismo eje */}
        <div key={slide} className="up-in max-w-md">
          <div className="relative h-52 mb-9 border border-white/10 bg-white/[0.02] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-[0.06] login-grid" />
            <div className="absolute -inset-8 bg-[radial-gradient(circle,rgba(37,99,235,0.18),transparent_65%)]" />
            <div className="slide-art relative scale-[0.6] xl:scale-[0.7]">
              <SlideArt type={SLIDES[slide].type} />
            </div>
            <span className="absolute top-3 left-3 flex items-center gap-2 font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-[#2563EB]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
              {SLIDES[slide].tag}
            </span>
          </div>

          <h2 className="font-heading text-5xl xl:text-6xl font-bold uppercase tracking-tighter leading-[0.9]">
            {SLIDES[slide].title[0]} {SLIDES[slide].title[1]}{' '}
            <span className="text-[#2563EB]">{SLIDES[slide].title[2]}</span>
          </h2>
          <p className="mt-6 font-body text-white/55 text-base xl:text-lg leading-relaxed">
            {SLIDES[slide].desc}
          </p>
        </div>

        {/* Indicadores funcionales */}
        <div className="flex gap-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Ir al slide ${i + 1}`}
              className={`relative h-1.5 rounded-full bg-white/15 overflow-hidden transition-[width] duration-500 ease-out cursor-pointer ${
                i === slide ? 'w-16' : 'w-8 hover:bg-white/30'
              }`}
            >
              {i === slide && <span key={slide} className="absolute inset-y-0 left-0 bg-[#2563EB] login-progress" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
