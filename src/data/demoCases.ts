export type ChatMsg = {
  role: 'user' | 'assistant'
  text: string
  bullets?: string[]
  source?: string
}

export type Suggestion = {
  q: string
  answer: Omit<ChatMsg, 'role'>
}

export type DemoCase = {
  id: string
  title: string
  tag: string
  source: string
  messages: ChatMsg[]
  suggestions: Suggestion[]
}

export const DEMO_CASES: DemoCase[] = [
  {
    id: 'resumir-contratos',
    title: 'Resumir contratos',
    tag: 'Documento legal',
    source: 'Contrato_Arrendamiento_2024.pdf',
    messages: [
      {
        role: 'user',
        text: 'Resume los puntos clave del contrato de arrendamiento de la oficina central.',
      },
      {
        role: 'assistant',
        text: 'El contrato establece las siguientes condiciones principales:',
        bullets: [
          'Renta mensual de $4,200 con incremento anual del 5% (Cláusula 3).',
          'Plazo forzoso de 24 meses con renovación automática.',
          'Depósito de garantía equivalente a 2 meses de renta.',
        ],
        source: 'Contrato_Arrendamiento_2024.pdf',
      },
    ],
    suggestions: [
      {
        q: '¿Quién cubre el mantenimiento mayor?',
        answer: {
          text: 'Según la cláusula 9, el mantenimiento estructural y mayor corre por cuenta del arrendador; el inquilino solo asume reparaciones menores y servicios.',
          source: 'Contrato_Arrendamiento_2024.pdf',
        },
      },
      {
        q: '¿Hay penalización por salida anticipada?',
        answer: {
          text: 'Sí. La cláusula 12 fija una penalización equivalente a 3 meses de renta si se rescinde antes de cumplir el plazo forzoso.',
          source: 'Contrato_Arrendamiento_2024.pdf',
        },
      },
    ],
  },
  {
    id: 'extraer-bibliografia',
    title: 'Extraer bibliografía',
    tag: 'Tesis académica',
    source: 'Tesis_Doctoral_NLP.pdf',
    messages: [
      { role: 'user', text: 'Extrae las referencias bibliográficas citadas en el capítulo 2.' },
      {
        role: 'assistant',
        text: 'Identifiqué 18 referencias en el capítulo. Las tres más citadas son:',
        bullets: [
          'García, M. (2021). Modelos de recuperación semántica.',
          'Lee & Pérez (2019). Embeddings contextuales en NLP.',
          'Smith, J. (2020). Arquitecturas RAG aplicadas.',
        ],
        source: 'Tesis_Doctoral_NLP.pdf',
      },
    ],
    suggestions: [
      {
        q: '¿Cuántas son de los últimos 5 años?',
        answer: {
          text: '12 de las 18 referencias se publicaron entre 2019 y 2024, lo que indica una base teórica actualizada.',
          source: 'Tesis_Doctoral_NLP.pdf',
        },
      },
      {
        q: 'Exporta la lista en formato APA',
        answer: {
          text: 'Generé la lista completa de las 18 referencias en formato APA 7ª edición, ordenadas alfabéticamente y listas para copiar.',
          source: 'Tesis_Doctoral_NLP.pdf',
        },
      },
    ],
  },
  {
    id: 'puntos-clave-video',
    title: 'Puntos clave de video',
    tag: 'Video',
    source: 'TED_Productividad.mp4',
    messages: [
      { role: 'user', text: 'Dame los puntos clave de la charla TED sobre productividad.' },
      {
        role: 'assistant',
        text: 'La ponente desarrolla tres ideas centrales:',
        bullets: [
          'El descanso estratégico aumenta el rendimiento (min 04:12).',
          'La multitarea reduce la calidad del trabajo profundo (min 07:35).',
          'Bloques de enfoque de 90 minutos como método óptimo (min 11:48).',
        ],
        source: 'TED_Productividad.mp4',
      },
    ],
    suggestions: [
      {
        q: '¿En qué minuto menciona la técnica de 90 minutos?',
        answer: {
          text: 'En el minuto 11:48, con un ejemplo práctico justo después. Puedo llevarte directo a ese punto del video.',
          source: 'TED_Productividad.mp4',
        },
      },
      {
        q: 'Genera un resumen para LinkedIn',
        answer: {
          text: 'Listo: un resumen de 120 palabras con los 3 aprendizajes clave y un gancho inicial, optimizado para un post de LinkedIn.',
          source: 'TED_Productividad.mp4',
        },
      },
    ],
  },
  {
    id: 'analisis-datos',
    title: 'Análisis de datos',
    tag: 'Hoja de cálculo',
    source: 'Ventas_Q4_2024.xlsx',
    messages: [
      { role: 'user', text: 'Analiza las ventas del Q4 y detecta anomalías.' },
      {
        role: 'assistant',
        text: 'Procesé 2.4M de celdas. Estos son los hallazgos principales:',
        bullets: [
          'Caída del 18% en la región Norte durante diciembre.',
          'Pico atípico de devoluciones en la semana 49.',
          "El producto 'A-220' concentra el 32% de los ingresos.",
        ],
        source: 'Ventas_Q4_2024.xlsx',
      },
    ],
    suggestions: [
      {
        q: '¿A qué se debe la caída del Norte?',
        answer: {
          text: "Los datos la correlacionan con 3 días de cierre logístico (columna 'Incidencias'). Sin esos días, la caída sería de solo 4%.",
          source: 'Ventas_Q4_2024.xlsx',
        },
      },
      {
        q: 'Proyecta las ventas de enero',
        answer: {
          text: 'Con base en la estacionalidad de los últimos 3 años, proyecto ventas de enero en $1.28M con un margen de ±6%.',
          source: 'Ventas_Q4_2024.xlsx',
        },
      },
    ],
  },
  {
    id: 'busqueda-semantica',
    title: 'Búsqueda semántica',
    tag: 'Base de conocimiento',
    source: 'Base_Conocimiento.pdf',
    messages: [
      { role: 'user', text: '¿Qué política aplica para reembolsos internacionales?' },
      {
        role: 'assistant',
        text: 'Encontré la respuesta exacta en tu base de conocimiento:',
        bullets: [
          'Reembolsos disponibles hasta 30 días tras la compra (Sección 4.2).',
          'Los productos internacionales requieren número de aduana.',
          'El reembolso se procesa en 5 a 7 días hábiles.',
        ],
        source: 'Base_Conocimiento.pdf',
      },
    ],
    suggestions: [
      {
        q: '¿Aplica a productos en oferta?',
        answer: {
          text: "Sí, salvo los marcados como 'venta final', según la nota al pie de la Sección 4.2.",
          source: 'Base_Conocimiento.pdf',
        },
      },
      {
        q: 'Muéstrame la cita textual',
        answer: {
          text: '"Todo reembolso solicitado dentro de los 30 días posteriores a la compra será procesado..." — Sección 4.2, página 17.',
          source: 'Base_Conocimiento.pdf',
        },
      },
    ],
  },
  {
    id: 'transcripcion-audio',
    title: 'Transcripción de audio',
    tag: 'Audio',
    source: 'Reunion_Directorio.mp3',
    messages: [
      { role: 'user', text: 'Transcribe y resume la reunión del directorio.' },
      {
        role: 'assistant',
        text: 'Transcribí 48 minutos de audio (2 hablantes). Resumen ejecutivo:',
        bullets: [
          'Se aprobó el presupuesto de marketing 2025 (min 12:30).',
          'Pendiente: contratar 2 ingenieros durante el Q1.',
          'Próxima reunión agendada para el 15 de febrero.',
        ],
        source: 'Reunion_Directorio.mp3',
      },
    ],
    suggestions: [
      {
        q: '¿Quién propuso el aumento de presupuesto?',
        answer: {
          text: 'Lo propuso M. Roberts en el minuto 14:05, con el respaldo explícito del área comercial.',
          source: 'Reunion_Directorio.mp3',
        },
      },
      {
        q: 'Lista los compromisos asignados',
        answer: {
          text: 'Identifiqué 4 compromisos con responsable y fecha. Te los presento como un checklist accionable.',
          source: 'Reunion_Directorio.mp3',
        },
      },
    ],
  },
]
