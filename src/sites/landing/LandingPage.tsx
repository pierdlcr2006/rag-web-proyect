import { useRef, useState } from 'react'
import 'lenis/dist/lenis.css'
import { useLandingAnimations } from '../../hooks/useLandingAnimations'
import { scrollToSection, scrollToTop } from '../../lib/lenis'
import ProgressBar from '../../components/landing/ProgressBar'
import Nav from '../../components/landing/Nav'
import Hero from '../../components/landing/Hero'
import AntiHallucination from '../../components/landing/AntiHallucination'
import Capabilities from '../../components/landing/Capabilities'
import About from '../../components/landing/About'
import Demo from './Demo'
import Cases from '../../components/landing/Cases'
import Faq from '../../components/landing/Faq'
import Pricing from '../../components/landing/Pricing'
import Contact from '../../components/landing/Contact'
import ChatDemo from '../../components/landing/ChatDemo'
import PageTransition, { type TransitionPhase } from '../../components/landing/PageTransition'
import Preloader from '../../components/landing/Preloader'

// Tiempos de la transición (copiados de k3studios: cubrir 0.5s + stagger, revelar 0.6s)
const COVER_MS = 560
const REVEAL_MS = 760

export default function LandingPage() {
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'landing' | 'chat' | 'about'>('landing')
  const [activeCase, setActiveCase] = useState<string | null>(null)
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const [resetKey, setResetKey] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // resetKey re-monta el sistema de animaciones (como recargar la página).
  useLandingAnimations(resetKey)

  const handlePreloaderComplete = () => {
    setLoading(false)
    // Incrementar resetKey al terminar el preloader para que el hook de animación
    // se ejecute sobre los elementos recién montados en el DOM.
    setResetKey((k) => k + 1)
  }

  const swap = (atCover: () => void) => {
    if (phase !== 'idle') return
    setPhase('covering')
    timers.current.push(
      setTimeout(() => {
        atCover()
        setPhase('revealing')
        timers.current.push(setTimeout(() => setPhase('idle'), REVEAL_MS))
      }, COVER_MS),
    )
  }

  const launch = (caseId: string) =>
    swap(() => {
      setActiveCase(caseId)
      setView('chat')
    })

  // Navegación del nav: en la landing hace scroll suave; desde el chat
  // regresa a la landing (con la transición) y posiciona en la sección.
  const navigate = (target: string) => {
    // "About" abre una vista a pantalla completa con la transición (como la referencia).
    if (target === '#about') {
      if (view === 'about' || phase !== 'idle') return
      swap(() => {
        setView('about')
        window.scrollTo({ top: 0, behavior: 'auto' })
      })
      return
    }
    // Secciones de la landing: si ya estamos en ella, scroll directo.
    if (view === 'landing') {
      if (phase !== 'idle') return
      if (target === 'top') scrollToTop()
      else scrollToSection(target)
      return
    }
    // Desde chat/about: cubrir, volver a la landing y posicionar.
    swap(() => {
      setView('landing')
      requestAnimationFrame(() => {
        if (target === 'top') scrollToTop(true)
        else scrollToSection(target, true)
      })
    })
  }

  // Click en el logo: vuelve al inicio y REINICIA las animaciones de la landing
  // (se vuelven a reproducir al hacer scroll, como al entrar a la página).
  const goHome = () => {
    if (phase !== 'idle') return
    // Salto instantáneo al top (como al cargar la página) + reinicio de animaciones.
    // Es instantáneo porque reiniciar destruye y recrea Lenis, lo que cortaría un scroll suave.
    if (view !== 'landing') {
      swap(() => {
        setView('landing')
        window.scrollTo({ top: 0, behavior: 'auto' })
        setResetKey((k) => k + 1)
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
      setResetKey((k) => k + 1)
    }
  }

  return (
    <>
      {loading ? (
        <Preloader onComplete={handlePreloaderComplete} />
      ) : (
        <>
          <Nav onNavigate={navigate} onHome={goHome} />

          {/* Landing (se mantiene montada detrás del chat para conservar scroll y animaciones) */}
          <div
            className="bg-[#0A0A0A] text-[#F4F2ED] font-['Fira_Sans'] selection:bg-[#2563EB] selection:text-white overflow-x-clip"
            aria-hidden={view === 'chat'}
          >
            <ProgressBar />
            <Hero />
            <AntiHallucination />
            <Capabilities />
            <Demo onLaunch={launch} />
            <Cases />
            <Faq />
            <Pricing />
            <Contact />
          </div>

          {view === 'chat' && activeCase && <ChatDemo caseId={activeCase} />}
          {view === 'about' && <About />}

          <PageTransition phase={phase} />
        </>
      )}
    </>
  )
}
