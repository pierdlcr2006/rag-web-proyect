type Row = {
  title: string
  desc: string
  // [Estudiantes, Abogados, Empresas]
  cells: [boolean, boolean, boolean]
}

const ROWS: Row[] = [
  {
    title: 'Resumen de 100+ páginas',
    desc: 'Reducción de ruido informativo en minutos.',
    cells: [true, true, true],
  },
  {
    title: 'Cita de fuente legal',
    desc: 'Referencia exacta para soporte jurídico.',
    cells: [false, true, true],
  },
  {
    title: 'Análisis de Video Largo',
    desc: 'Salto directo a la mención clave.',
    cells: [true, false, true],
  },
  {
    title: 'Detección de Anomalías',
    desc: 'Hallazgo de inconsistencias en data.',
    cells: [false, false, true],
  },
]

export default function Cases() {
  return (
    <section id="jobs" className="bg-black text-white py-24 px-6 md:px-12 border-b-4 border-white/10">
      <div className="max-w-7xl mx-auto">
        <h2
          data-split
          className="font-heading text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-none mb-20 text-center"
        >
          Matriz de Aplicación
        </h2>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-5 border-b-4 border-[#2563EB] pb-8 font-heading uppercase text-xs tracking-widest text-white/60">
              <div className="col-span-2">Tareas Críticas</div>
              <div className="text-center border-l border-white/10">Estudiantes</div>
              <div className="text-center border-l border-white/10">Abogados</div>
              <div className="text-center border-l border-white/10">Empresas</div>
            </div>

            <div className="reveal-group divide-y divide-white/10 font-heading">
              {ROWS.map((row) => (
                <div key={row.title} className="reveal-item grid grid-cols-5 py-10 items-center">
                  <div className="col-span-2">
                    <span className="text-2xl font-bold">{row.title}</span>
                    <p className="font-body text-sm text-[#888888] mt-1">{row.desc}</p>
                  </div>
                  {row.cells.map((active, i) => (
                    <div key={i} className="flex justify-center border-l border-white/5">
                      {active ? (
                        <div className="matrix-cell active w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center shadow-[0_0_22px_rgba(37,99,235,0.45)]">
                          <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-[3px] rounded-full bg-white/20" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
