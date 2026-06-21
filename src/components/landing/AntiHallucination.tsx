export default function AntiHallucination() {
  return (
    <section className="border-b-4 border-white/10 py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
        <div className="md:col-span-7">
          <h2
            data-split
            className="font-heading text-5xl md:text-7xl font-bold uppercase mb-12 leading-tight tracking-tighter"
          >
            Trazabilidad en tiempo real
          </h2>
          <div className="reveal-group space-y-8 font-body text-xl md:text-2xl leading-relaxed text-white/70">
            <p className="reveal-item">
              Las alucinaciones son el veneno de la IA. TalKent AI elimina este riesgo mediante una
              arquitectura de{' '}
              <span className="bg-[#2563EB] text-white px-2">RAG (Retrieval Augmented Generation)</span>{' '}
              estricta.
            </p>
            <p className="reveal-item">
              Cada respuesta generada por nuestro motor está vinculada a una coordenada exacta en tu
              documento fuente. Página, párrafo, línea o segundo de video.
            </p>
            <div className="reveal-item border-l-8 border-[#2563EB] pl-8 py-4 italic font-medium text-white">
              "En un análisis legal de 4,000 páginas, la diferencia entre una 'suposición
              inteligente' y un 'dato verificado' es la diferencia entre el éxito y el litigio."
            </div>
          </div>

          <div className="reveal-group mt-20 grid grid-cols-1 sm:grid-cols-2 gap-12">
            <div className="reveal-item border-t-4 border-white/20 pt-6">
              <span
                data-count="100"
                data-suffix="%"
                className="block font-heading text-6xl font-bold"
              >
                0
              </span>
              <span className="uppercase tracking-widest text-sm font-bold opacity-60">
                Fuente Verificada
              </span>
            </div>
            <div className="reveal-item border-t-4 border-white/20 pt-6">
              <span
                data-count="0.8"
                data-decimals="1"
                data-suffix="s"
                className="block font-heading text-6xl font-bold"
              >
                0
              </span>
              <span className="uppercase tracking-widest text-sm font-bold opacity-60">
                Latencia de Búsqueda
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 md:sticky md:top-32">
          <div className="border-4 border-black p-6 bg-white text-black shadow-[12px_12px_0px_#2563EB] rotate-1">
            <div className="flex items-center gap-2 mb-6 border-b-2 border-black pb-4">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="ml-auto font-heading font-bold text-[10px] uppercase tracking-widest">
                Protocolo de Verificación
              </span>
            </div>

            <div className="space-y-6">
              <div className="bg-black text-white p-4 font-heading text-xs uppercase tracking-tighter">
                Pregunta: ¿Quién autorizó el presupuesto de Q4?
              </div>
              <div className="border-2 border-black p-4 bg-[#2563EB]/5 font-body text-sm leading-relaxed">
                Respuesta: Según el acta de comité, la autorización fue firmada por{' '}
                <span className="bg-[#2563EB] text-white px-1 font-bold">M. Roberts</span> el 12 de
                noviembre.
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-black/10">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#2563EB] flex items-center justify-center">
                    <div className="w-2 h-2 bg-white" />
                  </div>
                  <span className="font-heading font-bold text-[10px] uppercase">
                    ACTA_FINAL_2023.PDF
                  </span>
                </div>
                <span className="bg-black text-[#2563EB] px-2 py-1 font-heading font-bold text-[10px]">
                  PAG 114
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 group overflow-hidden brutal-border grayscale hover:grayscale-0 transition-all duration-700">
            <video
              src="https://videos.pexels.com/video-files/7841607/7841607-hd_1280_720_30fps.mp4"
              poster="https://images.pexels.com/videos/7841607/pexels-photo-7841607.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full scale-110 group-hover:scale-100 transition-transform duration-1000"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
