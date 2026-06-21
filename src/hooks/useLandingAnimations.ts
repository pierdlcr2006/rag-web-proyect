import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { setLenis } from '../lib/lenis'

gsap.registerPlugin(ScrollTrigger)

const SCRAMBLE_CHARS = '*&@#%$-_:/;!?+=<>'

/**
 * Sistema de animaciones inspirado en la landing de k3studios.ae (GSAP + ScrollTrigger + Lenis):
 *  - Reveal de titulares por caracteres (split + stagger, ease expo.out)
 *  - Reveal con desenfoque/desplazamiento para párrafos y tarjetas (.reveal-item / .reveal-group)
 *  - Contadores numéricos ([data-count])
 *  - Texto "scramble" al pasar el cursor ([data-scramble])
 *  - Parallax por scroll ([data-speed])
 *  - Pulso de las celdas activas de la matriz
 */
export function useLandingAnimations(resetKey: number = 0) {
  useEffect(() => {
    // Respeta a quien prefiere menos movimiento.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ── Lenis (smooth scroll) enganchado al ticker de GSAP ──
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(lenis)

    // ── Split de texto en caracteres (preserva <br> y spans internos) ──
    const splitMap = new Map<HTMLElement, { html: string; chars: HTMLElement[] }>()
    function splitChars(el: HTMLElement): HTMLElement[] {
      const cached = splitMap.get(el)
      if (cached) return cached.chars
      const chars: HTMLElement[] = []
      const build = (node: Node): DocumentFragment => {
        const frag = document.createDocumentFragment()
        node.childNodes.forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            // Agrupa los caracteres por palabra para que la línea solo pueda
            // cortar en espacios (evita partir una palabra a la mitad).
            const tokens = (child.textContent ?? '').split(/(\s+)/)
            tokens.forEach((tok) => {
              if (tok === '') return
              if (/^\s+$/.test(tok)) {
                frag.appendChild(document.createTextNode(' '))
                return
              }
              const word = document.createElement('span')
              word.className = 'gsap-word'
              for (const ch of tok) {
                const s = document.createElement('span')
                s.className = 'gsap-char'
                s.textContent = ch
                chars.push(s)
                word.appendChild(s)
              }
              frag.appendChild(word)
            })
          } else if (child.nodeName === 'BR') {
            frag.appendChild(child.cloneNode())
          } else {
            const clone = (child as HTMLElement).cloneNode(false) as HTMLElement
            clone.appendChild(build(child))
            frag.appendChild(clone)
          }
        })
        return frag
      }
      const original = el.innerHTML
      const frag = build(el)
      el.innerHTML = ''
      el.appendChild(frag)
      splitMap.set(el, { html: original, chars })
      return chars
    }

    // ── Scramble al hover (cancelable con AbortController) ──
    const ac = new AbortController()
    document.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => {
      const orig = el.textContent ?? ''
      let iv: ReturnType<typeof setInterval> | null = null
      el.addEventListener(
        'mouseenter',
        () => {
          let iter = 0
          if (iv) clearInterval(iv)
          iv = setInterval(() => {
            el.textContent = orig
              .split('')
              .map((c, i) =>
                c === ' '
                  ? ' '
                  : i < iter
                    ? orig[i]
                    : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
              )
              .join('')
            iter += 0.5
            if (iter >= orig.length) {
              if (iv) clearInterval(iv)
              el.textContent = orig
            }
          }, 35)
        },
        { signal: ac.signal },
      )
      el.addEventListener(
        'mouseleave',
        () => {
          if (iv) clearInterval(iv)
          el.textContent = orig
        },
        { signal: ac.signal },
      )
    })

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set('.reveal-item, [data-split], .hero-line, .hero-sub, .hero-cta', {
          clearProps: 'all',
          opacity: 1,
        })
        return
      }

      // ── Intro del hero ──
      const tl = gsap.timeline()
      tl.fromTo('.nav-root', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0)

      document.querySelectorAll<HTMLElement>('.hero-line').forEach((el, i) => {
        const chars = splitChars(el)
        tl.fromTo(
          chars,
          { yPercent: 120, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.02, duration: 1, ease: 'expo.out' },
          0.15 + i * 0.12,
        )
      })

      tl.fromTo(
        '.highlighter-reveal',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.1, ease: 'circ.out' },
        '>-0.4',
      )
      tl.fromTo(
        '.hero-sub',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        0.7,
      )
      tl.fromTo(
        '.hero-cta',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        0.8,
      )

      // ── Reveal de titulares por caracteres al hacer scroll ──
      gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
        const chars = splitChars(el)
        gsap.set(chars, { yPercent: 40, opacity: 0.25 })
        gsap.to(chars, {
          yPercent: 0,
          opacity: 1,
          stagger: 0.015,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      })

      // ── Reveal con desenfoque (grupos con stagger + ítems sueltos) ──
      const grouped = new Set<HTMLElement>()
      gsap.utils.toArray<HTMLElement>('.reveal-group').forEach((group) => {
        const items = gsap.utils.toArray<HTMLElement>('.reveal-item', group)
        items.forEach((i) => grouped.add(i))
        gsap.fromTo(
          items,
          { opacity: 0, y: 26, filter: 'blur(12px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            stagger: 0.09,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: group, start: 'top 82%', once: true },
          },
        )
      })
      gsap.utils.toArray<HTMLElement>('.reveal-item').forEach((el) => {
        if (grouped.has(el)) return
        gsap.fromTo(
          el,
          { opacity: 0, y: 26, filter: 'blur(12px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        )
      })

      // ── Contadores numéricos ──
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = parseFloat(el.dataset.count ?? '0')
        const decimals = parseInt(el.dataset.decimals ?? '0', 10)
        const suffix = el.dataset.suffix ?? ''
        const obj = { v: 0 }
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              v: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = obj.v.toFixed(decimals) + suffix
              },
            })
          },
        })
      })

      // ── Parallax por scroll ──
      gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
        const speed = parseFloat(el.dataset.speed ?? '1') || 1
        gsap.to(el, {
          yPercent: -14 * speed,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
        })
      })

      // ── Pulso de celdas activas de la matriz ──
      gsap.utils.toArray<HTMLElement>('.matrix-cell.active').forEach((el) => {
        gsap.to(el, {
          scale: 1.08,
          repeat: -1,
          yoyo: true,
          duration: 1.6,
          ease: 'sine.inOut',
          scrollTrigger: { trigger: el, start: 'top 92%' },
        })
      })

      ScrollTrigger.refresh()
    })

    return () => {
      ctx.revert()
      ac.abort()
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
      splitMap.forEach((v, el) => {
        el.innerHTML = v.html
      })
      splitMap.clear()
    }
    // Al cambiar resetKey, se limpia y se vuelve a montar todo el sistema de
    // animaciones (reveals re-armados, intro del hero replay) como en una recarga.
  }, [resetKey])
}
