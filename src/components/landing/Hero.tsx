import { useNavigate } from 'react-router-dom'
import HeroOrbit from './HeroOrbit'
import { scrollToSection } from '../../lib/lenis'

export default function Hero() {
  const navigate = useNavigate()
  return (
    <section className="min-h-screen pt-28 pb-16 px-6 md:px-12 flex items-center border-b-4 border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Columna de texto */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="hero-cta self-start inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 mb-8 font-heading text-[11px] md:text-xs font-bold uppercase tracking-widest text-white/60">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            Arquitectura RAG · Cero alucinaciones
          </div>

          <h1 className="hero-title font-heading text-4xl sm:text-6xl lg:text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.9] font-bold tracking-tighter uppercase">
            <div className="line-reveal">
              <span className="block hero-line">Analiza tu</span>
            </div>
            <div className="line-reveal">
              <span className="block hero-line">información</span>
            </div>
            <div className="line-reveal">
              <span className="block hero-line">digital</span>
            </div>
            <div className="line-reveal">
              <span className="hero-line relative inline-block">
                Sin inventar nada
                <span className="absolute bottom-0 left-0 w-full h-[0.3em] bg-[#2563EB] -z-10 -rotate-1 origin-left highlighter-reveal scale-x-0" />
              </span>
            </div>
          </h1>

          <p className="hero-sub font-body text-lg md:text-xl leading-relaxed font-light text-white/70 max-w-xl mt-8">
            Plataforma de IA diseñada para el análisis crítico. PDF, Video y Datos con{' '}
            <span className="font-bold text-white underline decoration-[#2563EB] decoration-2">
              trazabilidad verificable
            </span>
            . Para quienes no pueden permitirse errores.
          </p>

          <div className="hero-cta mt-10 flex flex-wrap items-center gap-5">
            <button
              onClick={() => navigate('/login')}
              className="group relative bg-[#F4F2ED] text-black px-10 py-5 text-xl font-heading font-bold uppercase overflow-hidden cursor-pointer"
            >
              <span className="relative z-10">Inicia tu análisis</span>
              <div className="absolute inset-0 bg-[#2563EB] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="absolute inset-0 bg-[#2563EB] translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center text-white z-20">
                Inicia tu análisis
              </span>
            </button>
            <button
              onClick={() => scrollToSection('#demo')}
              className="group flex items-center gap-2 font-heading font-bold uppercase tracking-widest text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Ver demo
              <span className="text-[#2563EB] group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* Columna del gráfico orbital */}
        <div className="hidden lg:flex lg:col-span-5 justify-center xl:justify-end pointer-events-none">
          <div className="scale-90 xl:scale-100">
            <HeroOrbit />
          </div>
        </div>
      </div>
    </section>
  )
}
