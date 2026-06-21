const ITEMS = [
  {
    id: 'resumir-contratos',
    title: 'Resumir contratos',
    desc: 'Extrae cláusulas, plazos y montos clave de documentos legales extensos.',
  },
  {
    id: 'extraer-bibliografia',
    title: 'Extraer bibliografía',
    desc: 'Identifica y ordena las referencias citadas en tesis y papers académicos.',
  },
  {
    id: 'puntos-clave-video',
    title: 'Puntos clave de video',
    desc: 'Obtén las ideas principales de charlas y reuniones con su marca de tiempo.',
  },
  {
    id: 'analisis-datos',
    title: 'Análisis de datos',
    desc: 'Síntesis estadística y detección de anomalías en hojas de cálculo.',
  },
  {
    id: 'busqueda-semantica',
    title: 'Búsqueda semántica',
    desc: 'Encuentra la respuesta exacta entre gigabytes de información dispersa.',
  },
  {
    id: 'transcripcion-audio',
    title: 'Transcripción de audio',
    desc: 'Convierte voz y audio en texto con citas verificables a la fuente.',
  },
]

export default function Demo({ onLaunch }: { onLaunch: (caseId: string) => void }) {
  return (
    <section id="demo" className="py-24 px-6 md:px-12 border-b-4 border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end mb-16">
          <h2
            data-split
            className="md:col-span-7 font-heading text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-none"
          >
            Casos de
            <br />
            uso
          </h2>
          <div className="md:col-span-5 border-l-2 border-[#2563EB] pl-6">
            <span className="block font-heading text-[11px] uppercase tracking-[0.3em] text-[#2563EB] mb-3">
              Elige un caso
            </span>
            <p className="font-body text-base md:text-lg text-white/65 leading-relaxed">
              Sube gigabytes de información y obtén respuestas en lenguaje natural. No es un chatbot,
              es tu memoria extendida: explora una demo en vivo de cada función.
            </p>
          </div>
        </div>

        <div className="reveal-group border-t border-white/10">
          {ITEMS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onLaunch(item.id)}
              className="reveal-item group w-full text-left grid grid-cols-12 items-center gap-4 py-7 md:py-9 md:pr-6 border-b border-white/10 cursor-pointer transition-colors hover:bg-white/[0.03]"
            >
              <div className="col-span-2 md:col-span-1 font-heading text-sm md:text-base text-white/30 group-hover:text-[#2563EB] transition-colors">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="col-span-10 md:col-span-4 font-heading text-2xl md:text-4xl font-bold uppercase tracking-tight group-hover:translate-x-2 transition-transform">
                {item.title}
              </div>
              <div className="col-span-12 md:col-span-6 font-body text-sm md:text-base text-white/45 group-hover:text-white/80 transition-colors">
                {item.desc}
              </div>
              <div className="hidden md:flex md:col-span-1 justify-end text-2xl text-[#2563EB] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                →
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
