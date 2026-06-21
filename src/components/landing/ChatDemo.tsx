import { useEffect, useRef, useState } from 'react'
import { DEMO_CASES, type ChatMsg } from '../../data/demoCases'

function Source({ name }: { name: string }) {
  return (
    <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
      <span className="bg-[#2563EB] text-white text-[10px] px-2 font-bold uppercase py-0.5">
        Fuente Verificada
      </span>
      <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{name}</span>
    </div>
  )
}

function ChatBubble({ msg, delay }: { msg: ChatMsg; delay: number }) {
  const isUser = msg.role === 'user'
  return (
    <div
      className={`chat-msg flex ${isUser ? 'justify-end' : 'justify-start'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {isUser ? (
        <div className="max-w-[85%] bg-[#2563EB] text-white p-4 md:p-5 font-body text-sm md:text-base">
          {msg.text}
        </div>
      ) : (
        <div className="max-w-[90%] border-2 border-white/15 bg-white/[0.03] p-4 md:p-5 font-body text-sm md:text-base leading-relaxed">
          {msg.text}
          {msg.bullets && (
            <ul className="list-disc ml-5 mt-3 space-y-2">
              {msg.bullets.map((b, i) => (
                <li key={i} className={i === 0 ? 'font-bold' : undefined}>
                  {b}
                </li>
              ))}
            </ul>
          )}
          {msg.source && <Source name={msg.source} />}
        </div>
      )}
    </div>
  )
}

function Typing() {
  return (
    <div className="chat-msg flex justify-start">
      <div className="border-2 border-white/15 bg-white/[0.03] p-5 flex gap-1.5">
        <span className="w-2 h-2 rounded-full bg-white/60 typing-dot" />
        <span className="w-2 h-2 rounded-full bg-white/60 typing-dot" style={{ animationDelay: '0.15s' }} />
        <span className="w-2 h-2 rounded-full bg-white/60 typing-dot" style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  )
}

export default function ChatDemo({ caseId }: { caseId: string }) {
  const demo = DEMO_CASES.find((c) => c.id === caseId) ?? DEMO_CASES[0]
  const initialCount = demo.messages.length

  const [msgs, setMsgs] = useState<ChatMsg[]>(demo.messages)
  const [typing, setTyping] = useState(false)
  const [used, setUsed] = useState<number[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  const ask = (i: number) => {
    if (typing || used.includes(i)) return
    const s = demo.suggestions[i]
    setUsed((u) => [...u, i])
    setMsgs((m) => [...m, { role: 'user', text: s.q }])
    setTyping(true)
    timer.current = setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { role: 'assistant', ...s.answer }])
    }, 1100)
  }

  const remaining = demo.suggestions.filter((_, i) => !used.includes(i))

  return (
    <div className="fixed inset-0 z-[200] bg-[#0A0A0A] text-[#F4F2ED] flex flex-col">
      {/* Mensajes (deja espacio arriba para el nav fijo global) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 md:px-0 pt-28 md:pt-32">
        <div className="max-w-3xl mx-auto pb-10 space-y-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="font-heading text-[11px] uppercase tracking-[0.3em] text-white/40">
              Demo · {demo.title}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          {msgs.map((m, i) => (
            <ChatBubble key={i} msg={m} delay={i < initialCount ? i * 140 : 0} />
          ))}
          {typing && <Typing />}
        </div>
      </div>

      {/* Sugerencias + input */}
      <div className="border-t border-white/10 px-5 md:px-0">
        <div className="max-w-3xl mx-auto py-5">
          {remaining.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {demo.suggestions.map((s, i) =>
                used.includes(i) ? null : (
                  <button
                    key={i}
                    onClick={() => ask(i)}
                    disabled={typing}
                    className="border border-white/20 hover:border-[#2563EB] hover:bg-[#2563EB]/10 disabled:opacity-40 px-4 py-2 text-xs md:text-sm font-heading uppercase tracking-wide transition-colors cursor-pointer"
                  >
                    {s.q}
                  </button>
                ),
              )}
            </div>
          )}
          <div className="flex gap-3">
            <div className="flex-1 border-2 border-white/20 px-5 py-3 text-sm font-body font-bold text-white/30 uppercase tracking-widest">
              {remaining.length > 0 ? 'Elige una pregunta sugerida...' : 'Escribe tu pregunta...'}
            </div>
            <button className="bg-[#2563EB] text-white px-6 md:px-8 py-3 font-heading font-bold uppercase text-xs hover:bg-white hover:text-black transition-colors cursor-pointer">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
