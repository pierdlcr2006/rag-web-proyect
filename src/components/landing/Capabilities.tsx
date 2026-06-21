const ROWS = [
  {
    format: 'PDF / OCR',
    fn: 'PDFs de 100+ páginas: lectura masiva, detección de tablas y gráficos.',
    metric: '1,000+ págs',
  },
  {
    format: 'MP4 / MOV',
    fn: 'Videos de varias horas: transcripción fonética y búsqueda semántica visual.',
    metric: '8 h / archivo',
  },
  {
    format: 'XLSX / CSV',
    fn: 'Hojas de millones de celdas: síntesis estadística y detección de outliers.',
    metric: '2.4M celdas',
  },
]

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      className="bg-black text-white py-24 px-6 md:px-12 border-b-4 border-[#2563EB]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end mb-16">
          <h2
            data-split
            className="md:col-span-7 font-heading text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-none"
          >
            Archivos
            <br />
            aceptados
          </h2>
          <div className="md:col-span-5 border-l-2 border-[#2563EB] pl-6">
            <span className="block font-heading text-[11px] uppercase tracking-[0.3em] text-[#2563EB] mb-3">
              Sin límite de tamaño
            </span>
            <p className="font-body text-base md:text-lg text-white/65 leading-relaxed">
              Procesamos archivos pesados sin problema: desde un{' '}
              <span className="font-bold text-white">PDF de 100+ páginas</span> hasta videos de
              varias horas, con lectura masiva y trazabilidad a la fuente.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="md:table-header-group">
              <tr className="text-left font-heading uppercase text-[10px] md:text-xs tracking-[0.3em] text-white/40">
                <th className="pb-6 border-b border-white/10 pr-4">Formato / Input</th>
                <th className="pb-6 border-b border-white/10 hidden sm:table-cell">
                  Función Primaria
                </th>
                <th className="pb-6 border-b border-white/10 text-right">Métrica</th>
              </tr>
            </thead>
            <tbody className="reveal-group font-heading">
              {ROWS.map((row) => (
                <tr
                  key={row.format}
                  className="reveal-item group hover:bg-[#2563EB] hover:text-white transition-all duration-300"
                >
                  <td className="py-8 md:py-10 border-b border-white/10 text-xl md:text-3xl font-bold">
                    {row.format}
                  </td>
                  <td className="py-8 md:py-10 border-b border-white/10 font-body text-base md:text-xl opacity-70 group-hover:opacity-100 hidden sm:table-cell">
                    {row.fn}
                  </td>
                  <td className="py-8 md:py-10 border-b border-white/10 text-right text-xl md:text-3xl font-bold">
                    {row.metric}
                  </td>
                </tr>
              ))}
              <tr className="reveal-item group hover:bg-[#2563EB] hover:text-white transition-all duration-300">
                <td className="py-10 text-3xl font-bold">VOZ / AUDIO</td>
                <td className="py-10 font-body text-xl opacity-70 group-hover:opacity-100">
                  Interacción bimodal (Texto/Voz) en 52 idiomas.
                </td>
                <td className="py-10 text-right text-3xl font-bold">&lt; 400ms Lat.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
