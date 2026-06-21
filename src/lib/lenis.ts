import type Lenis from 'lenis'

let instance: Lenis | null = null

export function setLenis(l: Lenis | null) {
  instance = l
}

/**
 * Desplaza suavemente hasta una sección (selector de hash, p. ej. "#demo").
 * Usa Lenis si está disponible; si no, cae al scroll nativo.
 * El offset compensa la altura del nav fijo.
 */
export function scrollToSection(target: string, immediate = false) {
  const el = document.querySelector(target) as HTMLElement | null
  if (!el) return
  // Pasar el elemento + force:true evita que Lenis ignore el scroll
  // (lo que provocaba tener que pulsar 2-3 veces para que funcionara).
  if (instance) {
    instance.scrollTo(el, { offset: -90, duration: 1.2, force: true, immediate })
  } else {
    el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
  }
}

/** Desplaza hasta el inicio de la página (hero). */
export function scrollToTop(immediate = false) {
  if (instance) {
    instance.scrollTo(0, { duration: 1.2, force: true, immediate })
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
  }
}
