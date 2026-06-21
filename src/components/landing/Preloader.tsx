import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Preloader({ onComplete, duration = 1.5 }: { onComplete: () => void; duration?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)
  const topRightRef = useRef<HTMLDivElement>(null)
  const floatContainerRef = useRef<HTMLDivElement>(null)
  const [gridCells, setGridCells] = useState<number[]>([])
  const [gridCols, setGridCols] = useState(0)
  const [gridRows, setGridRows] = useState(0)

  // Floating background words
  const WORDS = [
    'COGNITIVE AI PLATFORM',
    'NEURAL RETRIEVAL ENGINE',
    'VECTOR KNOWLEDGE BASE',
    'AGENTIC MULTI-WORKFLOW',
    'SEMANTIC EMBEDDINGS',
    'TALKENT AI CORE',
    'BRUTALIST SYNTAX',
    'PROMPT CONTEXT INDEX'
  ]

  useEffect(() => {
    // 1. Calculate Grid Cells based on window dimensions
    const calculateGrid = () => {
      const cellSize = 100 // 100px cells
      const width = window.innerWidth
      const height = window.innerHeight
      const cols = Math.ceil(width / cellSize)
      const rows = Math.ceil(height / cellSize)
      setGridCols(cols)
      setGridRows(rows)
      setGridCells(new Array(cols * rows).fill(0))
    }

    calculateGrid()
    window.addEventListener('resize', calculateGrid)

    return () => {
      window.removeEventListener('resize', calculateGrid)
    }
  }, [])

  useEffect(() => {
    if (gridCells.length === 0) return

    // 2. Flickering center 4x4 grid animation
    const flickerInterval = setInterval(() => {
      const squares = containerRef.current?.querySelectorAll('.flicker-cell')
      if (squares && squares.length > 0) {
        squares.forEach((sq) => {
          // 30% chance to be visible
          const isVisible = Math.random() < 0.3
          gsap.set(sq, { opacity: isVisible ? 1 : 0 })
        })
      }
    }, 60)

    // 3. Floating background words sequence
    const floatElements = floatContainerRef.current?.children
    let floatTimeline: gsap.core.Timeline | null = null
    
    if (floatElements && floatElements.length > 0) {
      floatTimeline = gsap.timeline({ repeat: -1 })
      
      const animateFloating = () => {
        // Distribute positions in 4 vertical slots to prevent overlaps
        const slots = [15, 35, 55, 75] // vertical percentages
        const shuffledSlots = [...slots].sort(() => Math.random() - 0.5)

        Array.from(floatElements).forEach((el, index) => {
          const word = WORDS[Math.floor(Math.random() * WORDS.length)]
          const span = el.querySelector('.float-text')
          if (span) span.textContent = word

          const topPos = shuffledSlots[index % shuffledSlots.length]
          const leftPos = Math.random() * 45 + 5 // 5% to 50% horizontal position

          gsap.set(el, {
            top: `${topPos}%`,
            left: `${leftPos}%`,
            opacity: 0,
            scale: 0.95
          })

          floatTimeline?.to(el, {
            opacity: 0.45,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            delay: index * 0.3
          }, index * 0.4)
          .to(el, {
            opacity: 0,
            scale: 0.95,
            duration: 0.6,
            ease: 'power2.in',
            delay: 1.5
          }, `+=1.2`)
        })
      }

      animateFloating()
      // Re-trigger positions on loop
      floatTimeline.eventCallback('onRepeat', animateFloating)
    }

    // 4. Loader Lifecycle / Exit animation
    const mainTimeline = gsap.timeline()

    // Hold loader for specified duration before starting exit sequence
    mainTimeline.to({}, { duration })

    // Exit phase: Fade out content & text
    mainTimeline.to([centerRef.current, topRightRef.current, floatContainerRef.current], {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    })

    // Pixelated dissolve transition: fade out grid cells in a random order
    mainTimeline.add(() => {
      const cells = gridRef.current?.children
      if (cells && cells.length > 0) {
        const shuffledCells = Array.from(cells).sort(() => Math.random() - 0.5)
        gsap.to(shuffledCells, {
          opacity: 0,
          duration: 0.35,
          stagger: 0.002, // Staggered fade out
          ease: 'power1.out',
          onComplete: () => {
            // Once all cells are invisible, notify parent to unmount
            onComplete()
          }
        })
      } else {
        onComplete()
      }
    })

    return () => {
      clearInterval(flickerInterval)
      floatTimeline?.kill()
      mainTimeline.kill()
    }
  }, [gridCells])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] select-none overflow-hidden bg-[#0A0A0A]"
    >
      {/* 1. Base Grid Layer */}
      <div
        ref={gridRef}
        className="absolute inset-0 grid w-full h-full pointer-events-none"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
        }}
      >
        {gridCells.map((_, i) => (
          <div
            key={i}
            className="w-full h-full bg-[#2563EB] border-[0.5px] border-[#0A0A0A]/20"
            style={{ opacity: 1 }}
          />
        ))}
      </div>

      {/* 2. Floating Texts Layer */}
      <div ref={floatContainerRef} className="absolute inset-0 pointer-events-none">
        {/* Render 3 floating text nodes */}
        {new Array(3).fill(0).map((_, i) => (
          <div key={i} className="absolute transition-all duration-300">
            <span className="float-text font-mono text-[10px] tracking-[0.25em] text-[#0A0A0A]/50 lg:text-xs">
              COGNITIVE AI PLATFORM
            </span>
          </div>
        ))}
      </div>

      {/* 3. Top Right Indicator */}
      <div
        ref={topRightRef}
        className="absolute top-6 right-6 font-mono text-[10px] leading-tight text-[#0A0A0A] text-right pointer-events-none"
      >
        -<br />
        &gt;<br />
        -<br />
        ----
      </div>

      {/* 4. Center Branding Content */}
      <div
        ref={centerRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
      >
        {/* 4x4 Shimmer Grid */}
        <div className="w-16 h-16 mx-auto mb-6 grid grid-cols-4 grid-rows-4 gap-1.5 bg-[#0A0A0A]/10 p-1 border border-[#0A0A0A]/10">
          {new Array(16).fill(0).map((_, i) => (
            <div
              key={i}
              className="flicker-cell bg-[#0A0A0A] w-full h-full transition-opacity duration-75"
              style={{ opacity: 0 }}
            />
          ))}
        </div>

        {/* Brand Logo (in pure black using filter) */}
        <img
          src="/logo-3.png"
          alt="TalKent AI"
          className="w-48 h-auto mx-auto mb-4 select-none filter brightness-0"
          decoding="async"
        />

        {/* Tagline */}
        <div className="font-mono text-[10px] font-bold tracking-[0.35em] text-[#0A0A0A]/85 uppercase">
          {'{ cognitive intelligence engine }'}
        </div>
      </div>
    </div>
  )
}
