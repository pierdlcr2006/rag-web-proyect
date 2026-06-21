const VALUES = [
  {
    title: 'Cero alucinaciones',
    desc: 'Solo respondemos con base en tus fuentes. Si el dato no existe, te lo decimos honestamente en lugar de inventarlo.',
  },
  {
    title: 'Trazabilidad total',
    desc: 'Cada respuesta enlaza a la página, párrafo, línea o segundo exacto del documento original.',
  },
  {
    title: 'Privacidad primero',
    desc: 'Cifrado AES-256 de grado bancario. Tus archivos nunca se usan para entrenar modelos públicos de terceros.',
  },
  {
    title: 'Velocidad real',
    desc: 'Búsqueda semántica en menos de 0.8 segundos sobre miles de páginas de información.',
  },
]

/** Vista About a pantalla completa (se abre con la transición desde el nav). */
export default function About() {
  return (
    <div
      className="fixed inset-0 z-[200] bg-[#0A0A0A] text-[#F4F2ED] overflow-y-auto"
      data-lenis-prevent
    >
      <div className="pt-28 md:pt-36 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 lg:items-end mb-20">
            <h2 className="up-in lg:col-span-8 font-heading text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.9]">
              IA en la que
              <br />
              <span className="text-[#2563EB]">puedes confiar</span>
            </h2>
            <p
              className="up-in lg:col-span-4 font-body text-base md:text-lg text-white/65 leading-relaxed border-l-2 border-[#2563EB] pl-6"
              style={{ animationDelay: '0.1s' }}
            >
              TalKent AI nació de una idea simple: las máquinas deben citar sus fuentes. Construimos
              una plataforma de análisis donde cada respuesta es verificable, sin adivinanzas ni
              alucinaciones.
            </p>
          </div>

          <span
            className="up-in block font-heading text-[11px] uppercase tracking-[0.3em] text-white/40 mb-6"
            style={{ animationDelay: '0.15s' }}
          >
            Qué nos mueve
          </span>
          <div className="border-t border-white/10">
            {VALUES.map((v, i) => (
              <div
                key={v.title}
                className="up-in grid grid-cols-12 gap-4 py-7 md:py-9 md:pr-6 border-b border-white/10 items-start"
                style={{ animationDelay: `${0.2 + i * 0.08}s` }}
              >
                <div className="col-span-2 md:col-span-1 font-heading text-sm md:text-base text-[#2563EB]">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="col-span-10 md:col-span-4 font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight">
                  {v.title}
                </div>
                <div className="col-span-12 md:col-span-7 font-body text-sm md:text-base text-white/55 leading-relaxed">
                  {v.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
