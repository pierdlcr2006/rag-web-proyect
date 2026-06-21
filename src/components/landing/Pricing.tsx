type Plan = {
  name: string
  price: string
  unit?: string
  desc: string
  features: string[]
  cta: string
  popular?: boolean
}

const PLANS: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    unit: '/mes',
    desc: 'Para explorar la plataforma y proyectos personales.',
    features: [
      '10 archivos por mes',
      'Hasta 20 MB por archivo',
      'Chat con trazabilidad',
      'Soporte de la comunidad',
    ],
    cta: 'Empieza gratis',
  },
  {
    name: 'Pro',
    price: '$19',
    unit: '/mes',
    desc: 'Para profesionales que no pueden permitirse errores.',
    features: [
      'Archivos ilimitados',
      'Hasta 2 GB por archivo',
      'Soporte de video 4K',
      'API de integración',
      'Soporte 24/7',
    ],
    cta: 'Suscríbete',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Hablemos',
    desc: 'Para equipos y necesidades a medida.',
    features: [
      'SSO y control de roles',
      'Despliegue on-premise',
      'Modelos dedicados',
      'Gestor de cuenta',
    ],
    cta: 'Contáctanos',
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 px-6 md:px-12 border-b-4 border-white/10">
      <div className="max-w-7xl mx-auto">
        <h2
          data-split
          className="text-center font-heading text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-none mb-16"
        >
          Planes
        </h2>

        <div className="reveal-group grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`reveal-item relative flex flex-col p-8 ${
                plan.popular
                  ? 'border-2 border-[#2563EB] bg-[#2563EB]/[0.06]'
                  : 'border border-white/15'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-0 bg-[#2563EB] text-white text-[10px] font-heading font-bold uppercase tracking-widest px-3 py-1">
                  Popular
                </span>
              )}
              <h3 className="font-heading text-lg font-bold uppercase tracking-widest mb-6">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="block font-heading text-xs uppercase tracking-widest text-white/40 mb-1">
                  Desde
                </span>
                <div className="font-heading text-6xl font-bold leading-none">
                  {plan.price}
                  {plan.unit && <span className="text-xl text-white/50">{plan.unit}</span>}
                </div>
              </div>
              <p className="font-body text-sm text-white/55 leading-relaxed mb-8">{plan.desc}</p>
              <ul className="space-y-3 mb-10 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 font-body text-sm text-white/80">
                    <span className="text-[#2563EB] font-bold leading-none mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-4 font-heading font-bold uppercase text-sm transition-all cursor-pointer ${
                  plan.popular
                    ? 'bg-[#2563EB] text-white hover:bg-white hover:text-black'
                    : 'border-2 border-white/20 hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
