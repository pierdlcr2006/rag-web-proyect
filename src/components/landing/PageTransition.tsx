export type TransitionPhase = 'idle' | 'covering' | 'revealing'

/** Overlay de transición a pantalla completa (paneles + logo), copiado de k3studios.ae. */
export default function PageTransition({ phase }: { phase: TransitionPhase }) {
  return (
    <div
      className={`ptr ${phase === 'covering' ? 'is-covering' : ''} ${
        phase === 'revealing' ? 'is-revealing' : ''
      }`}
      aria-hidden="true"
    >
      <div className="ptr__panel ptr__panel--1" />
      <div className="ptr__panel ptr__panel--2" />
      <div className="ptr__panel ptr__panel--3" />
      <div className="ptr__logo">
        <img src="/logo-3.png" alt="" className="ptr__logo-img" />
      </div>
    </div>
  )
}
