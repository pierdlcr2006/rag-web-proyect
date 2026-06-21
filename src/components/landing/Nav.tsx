import { useNavigate } from 'react-router-dom'

// Cada opción mapea a su sección real de la landing.
const LINKS: { label: string; target: string }[] = [
  { label: 'Home', target: 'top' },
  { label: 'About', target: '#about' },
  { label: 'Archivos', target: '#capabilities' },
  { label: 'Casos', target: '#demo' },
  { label: 'FAQ', target: '#faq' },
  { label: 'Pricing', target: '#pricing' },
]

export default function Nav({
  onNavigate,
  onHome,
}: {
  onNavigate: (target: string) => void
  onHome: () => void
}) {
  const navigate = useNavigate()
  return (
    <nav className="nav-root fixed top-0 left-0 w-full z-[250] bg-[#0A0A0A]/80 text-[#F4F2ED] backdrop-blur-lg border-b border-white/10 flex items-center justify-between px-6 py-4 md:px-12">
      <button
        onClick={onHome}
        className="flex items-center cursor-pointer"
        aria-label="TalKent AI — Inicio (reiniciar)"
      >
        <img
          src="/logo-3.png"
          alt="TalKent AI"
          className="h-12 md:h-16 w-auto select-none"
          decoding="async"
        />
      </button>
      <div className="hidden lg:flex gap-8 font-heading font-medium uppercase text-sm tracking-widest">
        {LINKS.map((link) => (
          <a
            key={link.target}
            href={link.target === 'top' ? '#' : link.target}
            onClick={(e) => {
              e.preventDefault()
              onNavigate(link.target)
            }}
            className="relative group hover:text-[#2563EB] transition-colors"
          >
            <span data-scramble>{link.label}</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2563EB] transition-all group-hover:w-full" />
          </a>
        ))}
      </div>
      <button
        onClick={() => navigate('/login')}
        className="bg-[#2563EB] text-white px-8 py-2 font-heading font-bold uppercase hover:bg-white hover:text-black hover:ring-4 hover:ring-[#2563EB]/20 transition-all cursor-pointer active:scale-95"
      >
        Acceso
      </button>
    </nav>
  )
}
