const MARQUEE = [
  'Análisis de PDF',
  'Video',
  'Audio',
  'Datos',
  'RAG',
  'Trazabilidad',
  'Cero alucinaciones',
  'Búsqueda semántica',
]

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden">
      {/* Fondo: glow cobalt + líneas verticales con pulsos que suben */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_85%,rgba(37,99,235,0.18),transparent_70%)]" />
        <div className="contact-grid">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="contact-line">
              <div className="contact-pulse" style={{ animationDelay: `${i * 0.6}s` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Marquee infinito */}
      <div className="relative z-10 bg-[#2563EB] text-black py-3 overflow-hidden">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {MARQUEE.map((m, i) => (
                <span key={i} className="flex items-center">
                  <span className="px-8 font-heading font-bold uppercase text-sm tracking-widest whitespace-nowrap">
                    {m}
                  </span>
                  <span className="text-black/40">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 py-24 md:py-32 px-6 md:px-12 text-center">
        <h2
          data-split
          className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter leading-[0.9] mb-10"
        >
          Construyamos
          <br />
          juntos
        </h2>

        <a
          href="mailto:hola@talkent.ai"
          className="inline-block font-heading text-2xl md:text-4xl font-bold text-[#2563EB] hover:underline mb-16 break-all"
        >
          hola@talkent.ai
        </a>

        <div className="flex justify-center gap-16 md:gap-24 mb-20">
          <div>
            <span className="block font-heading text-[11px] uppercase tracking-[0.3em] text-white/40 mb-3">
              Ubicación
            </span>
            <span className="font-heading font-bold uppercase">LATAM · Remoto</span>
          </div>
          <div>
            <span className="block font-heading text-[11px] uppercase tracking-[0.3em] text-white/40 mb-3">
              Social
            </span>
            <div className="flex flex-col gap-1 font-heading font-bold uppercase">
              <a href="#" className="hover:text-[#2563EB] transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-[#2563EB] transition-colors">
                LinkedIn
              </a>
              <a href="#" className="hover:text-[#2563EB] transition-colors">
                X
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 max-w-md mx-auto">
          <p className="font-body text-sm text-white/45 mb-3">
            Plataforma de IA para análisis de documentos con trazabilidad verificable. Sin inventar
            nada.
          </p>
          <p className="font-heading text-[10px] uppercase tracking-widest text-white/30">
            © 2026 TalKent AI. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </section>
  )
}
