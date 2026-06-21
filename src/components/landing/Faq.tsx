import { useState } from 'react'

const ITEMS = [
  {
    q: '¿Mis archivos están seguros?',
    a: 'Sí. Utilizamos cifrado AES-256 de grado bancario. Tus datos nunca se utilizan para entrenar modelos públicos de terceros. En el momento en que borras un archivo, desaparece de nuestros servidores vectoriales de forma irreversible.',
  },
  {
    q: '¿Cómo evitan las alucinaciones?',
    a: 'A diferencia de otros modelos que "adivinan" la siguiente palabra, TalKent AI solo genera respuestas si puede anclarlas a una cita textual en tus archivos. Si el dato no existe, el sistema te lo dirá honestamente.',
  },
  {
    q: '¿Qué formatos soportan?',
    a: 'Soportamos PDF, Word, PowerPoint, Excel, CSV, TXT y los formatos de video más comunes como MP4, MOV y AVI. También procesamos audios MP3 y WAV con transcripción automática.',
  },
  {
    q: '¿Hay un límite de archivos?',
    a: 'El plan gratuito permite hasta 10 archivos de 20MB cada uno. El plan profesional elimina estos límites permitiendo procesamiento masivo de hasta 2GB por archivo.',
  },
]

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="py-24 px-6 md:px-12 border-b-4 border-white/10">
      <div className="max-w-4xl mx-auto">
        <h2
          data-split
          className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none mb-16"
        >
          Preguntas Frecuentes
        </h2>

        <div className="reveal-group border-t border-white/10">
          {ITEMS.map((item, i) => {
            const open = openIndex === i
            return (
              <div
                key={item.q}
                onClick={() => setOpenIndex(open ? -1 : i)}
                className={[
                  'reveal-item border-b border-white/10 px-4 md:px-6 py-7 cursor-pointer transition-colors',
                  open ? 'bg-[#2563EB]/[0.06]' : 'hover:bg-white/[0.02]',
                ].join(' ')}
              >
                <div className="flex justify-between items-center gap-6">
                  <h3
                    className={`font-heading text-xl md:text-2xl font-bold uppercase transition-colors ${
                      open ? 'text-[#2563EB]' : ''
                    }`}
                  >
                    {item.q}
                  </h3>
                  <span
                    className={`relative w-7 h-7 shrink-0 transition-colors ${open ? 'text-[#2563EB]' : ''}`}
                    aria-hidden="true"
                  >
                    <span className="absolute top-1/2 left-0 w-7 h-[3px] -translate-y-1/2 bg-current rounded-full" />
                    <span
                      className={`absolute top-1/2 left-0 w-7 h-[3px] -translate-y-1/2 bg-current rounded-full transition-transform duration-300 ${
                        open ? 'scale-x-0' : 'rotate-90'
                      }`}
                    />
                  </span>
                </div>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pt-6 font-body text-lg leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
