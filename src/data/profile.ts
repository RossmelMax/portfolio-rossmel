/**
 * FUENTE ÚNICA DE CONTENIDO
 * ------------------------------------------------------------------
 * Todo el texto del portafolio y del CV sale de este archivo.
 * Si actualizas algo aquí, se actualiza en la web (ES/EN) y en el CV.
 *
 * Convenciones:
 *  - Cada texto traducible es { es, en }.
 *  - `featured: true` → aparece en la galería principal del portafolio.
 *  - `cv: true` → aparece en el CV (el CV debe ser corto: 1–2 páginas).
 *  - `draft: true` → NO se muestra en ningún lado (dato pendiente de confirmar).
 *  - `// TODO(confirmar)` → dato que Rossmel todavía debe confirmar.
 *
 * Fuentes (sept. 2026): relato de Rossmel + informe de Claude Code local sobre sus repos
 * (commits reales en GitLab de WANT, repos de GitHub, evaluación de AdvAI).
 */

export type Lang = 'es' | 'en';
export type L = Record<Lang, string>;

export const profile = {
  name: 'Rossmel Abasto',
  role: { es: 'Desarrollador Frontend → Fullstack', en: 'Frontend → Fullstack Developer' } as L,
  location: { es: 'Cochabamba, Bolivia · Remoto', en: 'Cochabamba, Bolivia · Remote' } as L,
  email: 'abastorossmel@gmail.com',
  links: {
    github: 'https://github.com/rossmelabasto',
    linkedin: 'https://www.linkedin.com/in/rossmel/',
    gitlab: 'https://gitlab.com/RossmelAbasto',
  },
  portfolioUrl: 'https://portfolio.rossmel.top',
  cvUrl: 'https://cv.rossmel.top',

  photoAlt: { es: 'Foto de Rossmel Abasto', en: 'Photo of Rossmel Abasto' } as L,

  headline: {
    es: 'Programador de base: construyo interfaces rápidas, cuidadas y listas para producción — y la IA multiplica lo que ya sé hacer.',
    en: 'A programmer first: I build fast, polished, production-ready interfaces — and AI multiplies what I already know how to do.',
  } as L,

  /** Resumen profesional (CV). 3–4 líneas, con palabras clave para ATS. */
  summary: {
    es: 'Desarrollador Frontend con más de 3 años de experiencia en agencia construyendo SaaS multi-tenant, apps móviles y sitios web con React, Next.js, React Native y TypeScript (~1.800 commits en productos para clientes de Bolivia y EE. UU.). Base sólida de programación: autodidacta desde 2019 y años escribiendo código de producción sin asistentes de IA. Evolucionando a Fullstack con FastAPI, Node.js, SQLite/PostgreSQL, Firebase y Supabase. Desde 2025 integro IA en productos (RAG híbrido, LLMs locales y en la nube) y en mi flujo diario, para entregar más rápido sin sacrificar calidad.',
    en: 'Frontend Developer with 3+ years of agency experience building multi-tenant SaaS, mobile apps and websites with React, Next.js, React Native and TypeScript (~1,800 commits across client products in Bolivia and the US). Solid programming foundation: self-taught since 2019, with years of writing production code without AI assistants. Growing into Fullstack with FastAPI, Node.js, SQLite/PostgreSQL, Firebase and Supabase. Since 2025 I integrate AI into products (hybrid RAG, local and cloud LLMs) and into my daily workflow, to ship faster without sacrificing quality.',
  } as L,

  /** "Sobre mí" del portafolio: más humano que el resumen del CV. */
  about: {
    es: [
      'Empecé a programar solo, en 2019, con mi primera computadora propia. Desde entonces no paré: cursos, documentación, prueba y error, y muchas noches de “¿por qué no funciona esto?”.',
      'Pasé más de tres años en WANT Digital Agency, donde éramos dos en desarrollo: mi jefe en el backend y yo en el frontend. Ahí aprendí a hacer de todo — investigar, resolver, trabajar bajo presión y entregar.',
      'Aprendí a la vieja escuela: en la agencia, casi todo ese tiempo programamos a mano — documentación, foros, depurar línea por línea. Recién en el último año incorporamos IA al trabajo.',
      'Con el boom de la IA fui probando de todo: GitHub Copilot, ChatGPT, Gemini, DeepSeek, Groq, modelos locales y, últimamente, Claude. Me potenció muchísimo, y como vengo de escribir todo a mano, entiendo lo que genera: sé leerlo, corregirlo y mantenerlo. Y me dio más ganas de seguir aprendiendo y entender toda tecnología que llegue a mis manos.',
      'Fuera del trabajo, vivo en Linux: uso a diario rOS, mi propio flavor de Arch que quiero convertir en una distro real, y mantengo un homelab con una docena de servicios y un agente de IA que lo cuida 24/7.',
    ],
    en: [
      'I started coding on my own in 2019, with my first personal computer. I haven\'t stopped since: courses, docs, trial and error, and many “why isn\'t this working?” nights.',
      'I spent 3+ years at WANT Digital Agency, where the dev team was two people: my boss on the backend and me on the frontend. That\'s where I learned to do a bit of everything — research, solve, work under pressure and ship.',
      'I learned the old-school way: at the agency, for almost all of that time we coded by hand — docs, forums, debugging line by line. We only brought AI into our work in the last year.',
      'When the AI boom hit I tried everything: GitHub Copilot, ChatGPT, Gemini, DeepSeek, Groq, local models and, lately, Claude. It has boosted me a lot, and since I come from writing everything by hand, I understand what it generates: I can read it, fix it and maintain it. And it made me even more eager to keep learning and understand every technology that comes my way.',
      'Outside work I live in Linux: I daily-drive rOS, my own flavor of Arch that I\'m growing into a real distro, and run a homelab with a dozen services and an AI agent that looks after it 24/7.',
    ],
  } as Record<Lang, string[]>,

  /** Cifras del "Sobre mí". `count` anima el número; `text` se muestra tal cual. */
  stats: [
    { count: 3, suffix: '+', label: { es: 'años en producción', en: 'years shipping' } as L },
    { count: 1800, suffix: '+', label: { es: 'commits en proyectos de clientes', en: 'commits on client projects' } as L },
    { count: 8, suffix: '', label: { es: 'productos para clientes', en: 'client products' } as L },
    { count: 12, suffix: '', label: { es: 'servicios en mi homelab', en: 'self-hosted services' } as L },
  ],

  softSkills: {
    es: ['Resolución de problemas', 'Autonomía', 'Trabajo bajo presión', 'Aprendizaje rápido', 'Comunicación con clientes', 'Documentación técnica'],
    en: ['Problem solving', 'Autonomy', 'Working under pressure', 'Fast learner', 'Client communication', 'Technical writing'],
  } as Record<Lang, string[]>,

  languages: [
    { name: { es: 'Español', en: 'Spanish' } as L, level: { es: 'Nativo', en: 'Native' } as L },
    { name: { es: 'Inglés', en: 'English' } as L, level: { es: 'Avanzado (C1)', en: 'Advanced (C1)' } as L },
  ],
};

/* ------------------------------------------------------------------ */
/* EXPERIENCIA                                                         */
/* ------------------------------------------------------------------ */

export type Experience = {
  company: L;
  role: L;
  type: L;
  start: string; // YYYY-MM
  end: string | null; // null = actual
  location: L;
  summary: L;
  bullets: Record<Lang, string[]>;
  stack: string[];
  cv: boolean;
  draft?: boolean;
};

export const experience: Experience[] = [
  {
    company: { es: 'Independiente', en: 'Independent' },
    role: { es: 'Desarrollador Fullstack', en: 'Fullstack Developer' },
    type: { es: 'Freelance', en: 'Freelance' },
    start: '2026-01',
    end: null,
    location: { es: 'Cochabamba, Bolivia', en: 'Cochabamba, Bolivia' },
    summary: {
      es: 'Último año de la carrera, combinado con proyectos pagados y para la universidad, de punta a punta: análisis, diseño, desarrollo, pruebas y entrega.',
      en: 'Final year of university, combined with paid and university projects, end to end: analysis, design, development, testing and delivery.',
    },
    bullets: {
      es: [
        "Link'u (proyecto pagado): app de escritorio offline-first para el cobro de agua potable de una comunidad rural en expansión (Electron, React, SQLite), con respaldos cifrados AES-256-GCM, actualizaciones automáticas, 47 tests y CI multiplataforma.",
        'SGPG: sistema de gestión de proyectos de grado para la UDABOL, en uso por la jefatura de carrera (Next.js 16, Firebase), con extracción de resumen y etiquetas desde PDF mediante IA (Groq), versionado de documentos y auditoría.',
      ],
      en: [
        "Link'u (paid project): offline-first desktop app for a growing rural community's water billing (Electron, React, SQLite), with AES-256-GCM encrypted backups, auto-updates, 47 tests and cross-platform CI.",
        'SGPG: thesis project management system for UDABOL, used by the head of the Systems Engineering program (Next.js 16, Firebase), with AI-powered PDF summary and tag extraction (Groq), document versioning and audit trail.',
      ],
    },
    stack: ['Electron', 'React', 'Next.js', 'SQLite', 'Firebase', 'Groq', 'GitHub Actions'],
    cv: true,
  },
  {
    company: { es: 'WANT Digital Agency / GeekLabs', en: 'WANT Digital Agency / GeekLabs' },
    role: { es: 'Desarrollador Frontend (Web y Móvil)', en: 'Frontend Developer (Web & Mobile)' },
    type: {
      es: 'Pasantía → Freelance → Contrato (2025–2026)',
      en: 'Internship → Contractor → Employee (2025–2026)',
    },
    start: '2022-08', // según primer commit
    end: '2026-01',
    location: { es: 'Cochabamba, Bolivia', en: 'Cochabamba, Bolivia' },
    summary: {
      es: 'Único desarrollador frontend en un equipo de desarrollo de dos personas. Responsable de las interfaces web y móviles de 8 productos para clientes de Bolivia y EE. UU.',
      en: 'Sole frontend developer on a two-person dev team. Owned the web and mobile interfaces of 8 client products in Bolivia and the US.',
    },
    bullets: {
      es: [
        'Principal desarrollador frontend de Vulcano (hoy CarX), SaaS multi-tenant para talleres mecánicos de GeekLabs, piloteado en un taller real (944 de 1.131 commits): órdenes, cotizaciones, vehículos, reportes de ingresos, calendario, importación CSV, dashboards por rol e i18n ES/EN con Next.js, TypeScript, MUI, Redux Toolkit y NextAuth.',
        'Conecté el frontend con el módulo de IA de Vulcano (desarrollado por el líder técnico), que genera automáticamente los servicios de una orden de trabajo.',
        'Desarrollé apps móviles en React Native/Expo: Adsie, red de anuncios para Florida que conecta negocios locales, clientes e influencers (434 de 497 commits); la app de mecánicos de Vulcano (notificaciones push, temporizador de servicio); One Life Fitness (gimnasio de Cochabamba y La Paz) y OneHand (citas de fisioterapia).',
        'Construí el frontend de Bite, SaaS multi-tenant de menú digital y pedidos para restaurantes (Next.js App Router): pedidos a mesa por QR, checkout, cupones, sucursales, planes y Google Maps.',
        'Desarrollé el sitio web en WordPress de LYNX Bolivia, tienda de electrónica y electrodomésticos.',
        'Trabajé junto al líder técnico (backend) integrando APIs REST, con revisiones de código y entregas en ciclos cortos bajo presión de fechas.',
        'Comencé como pasante (3 meses), continué como desarrollador freelance con pago mensual y fui contratado formalmente de 2025 a 2026.',
      ],
      en: [
        'Lead frontend developer of Vulcano (now CarX), GeekLabs\' multi-tenant SaaS for auto repair shops, piloted at a real shop (944 of 1,131 commits): work orders, quotes, vehicles, revenue reports, calendar, CSV import, role-based dashboards and ES/EN i18n with Next.js, TypeScript, MUI, Redux Toolkit and NextAuth.',
        'Wired the frontend to Vulcano\'s AI module (built by the tech lead) that auto-generates the services of a work order.',
        'Built React Native/Expo mobile apps: Adsie, an ads network for Florida connecting local businesses, customers and influencers (434 of 497 commits); Vulcano\'s mechanic app (push notifications, service timer); One Life Fitness (a gym in Cochabamba and La Paz) and OneHand (physiotherapy appointments).',
        'Built the frontend of Bite, a multi-tenant digital menu and ordering SaaS for restaurants (Next.js App Router): QR table ordering, checkout, coupons, branches, plans and Google Maps.',
        'Built the WordPress website for LYNX Bolivia, an electronics and home appliance retailer.',
        'Worked alongside the tech lead (backend) integrating REST APIs, with code reviews and short delivery cycles under tight deadlines.',
        'Started as an intern (3 months), continued as a monthly-paid contractor and was formally employed from 2025 to 2026.',
      ],
    },
    stack: ['Next.js', 'React', 'React Native', 'Expo', 'TypeScript', 'MUI', 'Redux Toolkit', 'NextAuth', 'WordPress', 'GitLab'],
    cv: true,
  },
  {
    company: { es: 'Freelance', en: 'Freelance' },
    role: { es: 'Diseñador Gráfico — Identidad de marca', en: 'Graphic Designer — Brand Identity' },
    type: { es: 'Freelance esporádico', en: 'Part-time freelance' },
    start: '2025-03',
    end: '2025-11',
    location: { es: 'Remoto', en: 'Remote' },
    summary: {
      es: 'Identidad visual para la marca personal de una profesional de la salud: logo, paleta, portafolio digital y contenido para redes.',
      en: 'Visual identity for a healthcare professional\'s personal brand: logo, color palette, digital portfolio and social media content.',
    },
    bullets: {
      es: [
        'Diseñé la identidad de marca (logo, paleta de colores y tipografía) y un portafolio digital.',
        'Produje piezas gráficas para redes sociales de forma esporádica durante 2025.',
      ],
      en: [
        'Designed the brand identity (logo, color palette and typography) and a digital portfolio.',
        'Produced social media graphics on an as-needed basis during 2025.',
      ],
    },
    stack: ['Figma', 'Branding', 'UI'],
    cv: false, // esporádico y poco relevante para el perfil: solo en el portafolio
  },
];

/* ------------------------------------------------------------------ */
/* EDUCACIÓN                                                           */
/* ------------------------------------------------------------------ */

export const education: { title: L; school: string; period: L; note: L; draft?: boolean }[] = [
  {
    title: { es: 'Ingeniería de Sistemas', en: 'B.S. Systems Engineering' },
    school: 'Universidad de Aquino Bolivia (UDABOL)',
    period: { es: '2021 – 2027 (previsto) · Último semestre; defensa interna dic. 2026, externa mar. 2027', en: '2021 – 2027 (expected) · Final semester; internal defense Dec 2026, external Mar 2027' },
    note: {
      es: 'Proyecto de grado: AdvAI — auditoría legal de contratos con IA (RAG híbrido + LLMs).',
      en: 'Capstone: AdvAI — AI-powered legal contract auditing (hybrid RAG + LLMs).',
    },
  },
  {
    title: { es: 'Diplomado en Desarrollo de Software (posgrado)', en: 'Postgraduate Diploma in Software Development' },
    school: 'Universidad de Aquino Bolivia (UDABOL)',
    period: { es: '2026 – en curso · 4 módulos', en: '2026 – in progress · 4 modules' },
    note: { es: '', en: '' },
  },
  {
    title: { es: 'Desarrollo de Aplicaciones Web', en: 'Web Application Development' },
    school: 'Solaning',
    period: { es: '2022 · Completado', en: '2022 · Completed' },
    note: { es: '', en: '' },
  },
];

export const learning = ['Platzi', 'Coursera', 'Udemy', 'freeCodeCamp', 'Google for Education', 'W3Schools'];

/* ------------------------------------------------------------------ */
/* HABILIDADES (agrupadas para ATS)                                    */
/* ------------------------------------------------------------------ */

export const skills: { group: L; items: string[] }[] = [
  {
    group: { es: 'Frontend y móvil', en: 'Frontend & Mobile' },
    items: ['React', 'Next.js (Pages y App Router)', 'React Native', 'Expo', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3 / Sass', 'Tailwind CSS', 'MUI', 'shadcn/ui', 'Redux Toolkit', 'i18n', 'PWA', 'Astro', 'GSAP', 'Motion'],
  },
  {
    group: { es: 'Backend y datos', en: 'Backend & Data' },
    items: ['Node.js', 'Express', 'Python', 'FastAPI', 'REST APIs', 'SSE', 'NextAuth', 'SQLite (FTS5, WAL)', 'PostgreSQL', 'Prisma', 'Drizzle', 'Supabase', 'Firebase', 'Electron'],
  },
  {
    group: { es: 'IA aplicada', en: 'Applied AI' },
    items: ['RAG', 'Búsqueda híbrida (BM25 + embeddings)', 'Evaluación de LLMs', 'Ollama', 'Groq', 'Gemini', 'OpenAI API', 'DeepSeek', 'sqlite-vec', 'GitHub Copilot', 'Claude Code', 'Agentes'],
  },
  {
    group: { es: 'DevOps, calidad y herramientas', en: 'DevOps, Quality & Tools' },
    items: ['Git', 'GitHub Actions', 'GitLab', 'Docker', 'Linux (Arch)', 'systemd', 'Cloudflare Tunnel', 'Tailscale', 'KVM / libvirt', 'pytest', 'Vitest', 'Vercel', 'Bruno', 'Figma'],
  },
];

/** Marquee del portafolio (solo nombres). */
export const marquee = ['React', 'Next.js', 'TypeScript', 'React Native', 'Expo', 'Tailwind', 'Node.js', 'Python', 'FastAPI', 'SQLite', 'Supabase', 'Firebase', 'Electron', 'Ollama', 'Docker', 'Linux', 'Claude Code'];

/* ------------------------------------------------------------------ */
/* PROYECTOS                                                           */
/* ------------------------------------------------------------------ */

export type Project = {
  slug: string;
  name: string;
  year: string;
  kind: L; // "Cliente · WANT", "Proyecto de grado", etc.
  tagline: L;
  problem: L;
  role: L;
  highlights: Record<Lang, string[]>;
  learned: Record<Lang, string[]>; // "Lo que aprendí"
  stack: string[];
  links?: { label: string; href: string }[];
  accent: string; // color del caso de estudio
  featured: boolean;
  cv: boolean;
  confidential?: boolean; // código privado / sin demo pública
  draft?: boolean;
};

const WANT: L = { es: 'Cliente · WANT Digital Agency', en: 'Client · WANT Digital Agency' };

export const projects: Project[] = [
  {
    slug: 'advai',
    name: 'AdvAI',
    year: '2026',
    kind: { es: 'Proyecto de grado · UDABOL', en: 'Capstone · UDABOL' },
    tagline: {
      es: 'Auditoría legal de contratos con IA y citas verificables.',
      en: 'AI legal contract auditing with verifiable citations.',
    },
    problem: {
      es: 'Revisar un contrato frente al Código Civil, el Código de Comercio y la jurisprudencia boliviana toma horas, y los LLMs "inventan" artículos. AdvAI separa el contrato en cláusulas y, para cada una, devuelve riesgo, análisis y citas literales verificables.',
      en: 'Reviewing a contract against Bolivian civil and commercial codes and case law takes hours, and LLMs tend to hallucinate articles. AdvAI splits a contract into clauses and returns, for each one, a risk level, an analysis and verbatim, verifiable citations.',
    },
    role: { es: 'Diseño, arquitectura y desarrollo fullstack (individual).', en: 'Design, architecture and fullstack development (solo).' },
    highlights: {
      es: [
        'Búsqueda híbrida BM25 (SQLite FTS5) + embeddings bge-m3 fusionados por RRF sobre 3.267 artículos y 971 autos supremos: el acierto de recuperación (acierto@8) subió de 42,9 % a 80 %.',
        'El modelo solo elige claves de las fuentes mostradas y el texto citado lo inserta el sistema: 82,9 % de citas correctas y 94,6 % de cláusulas sin error grave en la evaluación interna.',
        'Anonimización de datos personales antes de enviar texto a la nube; LLM local (Ollama, qwen3.5 9B) y proveedores gratuitos con respaldo automático.',
        'Trabajador en segundo plano reanudable, progreso en vivo por SSE, comparación entre versiones e informe DOCX/PDF.',
        'Backend con 69 tests y cobertura ≥ 90 % exigida en CI; frontend en Next.js 16 + React 19 con visor PDF y cláusulas resaltadas por riesgo.',
      ],
      en: [
        'Hybrid search: BM25 (SQLite FTS5) + bge-m3 embeddings fused with RRF over 3,267 articles and 971 supreme court rulings — retrieval hit@8 went from 42.9% to 80%.',
        'The model only picks keys from the sources shown and the quoted text is inserted by the system: 82.9% correct citations and 94.6% of clauses with no severe error in internal evaluation.',
        'Personal data is anonymized before any text reaches the cloud; local LLM (Ollama, qwen3.5 9B) plus free providers with automatic failover.',
        'Resumable background worker, live progress via SSE, version diffing and DOCX/PDF reports.',
        'Backend with 69 tests and ≥90% coverage enforced in CI; Next.js 16 + React 19 frontend with a PDF viewer and risk-highlighted clauses.',
      ],
    },
    learned: {
      es: ["Medir antes de optimizar: sin un set de evaluación habría seguido \"ajustando prompts\" a ciegas. Con métricas, cada cambio se volvió una decisión.", "Un LLM no es una base de datos: la solución a las citas inventadas no fue un mejor prompt, fue una arquitectura donde el modelo no puede escribir la cita.", "Privacidad por diseño: anonimizar antes de enviar texto a la nube cambió desde el esquema de datos hasta los prompts.", "Diseñar para que falle bien: proveedores con respaldo y un trabajador que se reanuda tras un reinicio."],
      en: ["Measure before optimizing: without an eval set I would have kept tweaking prompts blindly. With metrics, every change became a decision.", "An LLM is not a database: the fix for hallucinated citations wasn’t a better prompt, it was an architecture where the model can’t write the citation.", "Privacy by design: anonymizing before sending text to the cloud shaped everything from the data schema to the prompts.", "Design for graceful failure: providers with failover and a worker that resumes after a restart."],
    },
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Python', 'FastAPI', 'SQLite FTS5', 'Ollama', 'RAG', 'SSE', 'pytest'],
    accent: '#c8ff2e',
    featured: true,
    cv: true,
    confidential: true,
  },
  {
    slug: 'carx',
    name: 'CarX',
    year: '2023 – 2025',
    kind: { es: 'GeekLabs · vía WANT Digital Agency', en: 'GeekLabs · via WANT Digital Agency' },
    tagline: {
      es: 'SaaS multi-tenant para talleres mecánicos (antes Vulcano).',
      en: 'Multi-tenant SaaS for auto repair shops (formerly Vulcano).',
    },
    problem: {
      es: 'Los talleres llevan órdenes, cotizaciones y vehículos en cuadernos y chats. CarX centraliza la operación: recepción, órdenes de servicio, cotizaciones, calendario, reportes y una app para los mecánicos. Se piloteó con un taller real.',
      en: 'Repair shops track orders, quotes and vehicles in notebooks and chats. CarX centralizes operations: intake, service orders, quotes, calendar, reports and an app for mechanics. It was piloted at a real shop.',
    },
    role: {
      es: 'Principal desarrollador frontend: 944 de 1.131 commits en la web, más la app móvil de mecánicos.',
      en: 'Lead frontend developer: 944 of 1,131 commits on the web app, plus the mechanics\' mobile app.',
    },
    highlights: {
      es: [
        'Multi-tenant por dominio, dashboards por rol (administrador, jefe de taller) y landing con i18n ES/EN.',
        'Órdenes, cotizaciones, servicios por cliente, vehículos, calendario, reportes de ingresos (ApexCharts) e importador CSV.',
        'Integración del frontend con el módulo de IA (LangChain, hecho por el líder técnico) que autogenera los servicios de una orden y un chat asistente.',
        'App de mecánicos en React Native/Expo con notificaciones push, SecureStore y temporizador de servicio.',
      ],
      en: [
        'Domain-based multi-tenancy, role dashboards (admin, shop manager) and an ES/EN landing page.',
        'Orders, quotes, per-client services, vehicles, calendar, revenue reports (ApexCharts) and CSV import.',
        'Frontend integration with the AI module (LangChain, built by the tech lead) that auto-generates a work order\'s services, plus an assistant chat.',
        'Mechanics app in React Native/Expo with push notifications, SecureStore and a service timer.',
      ],
    },
    learned: {
      es: ["Sostener un producto grande por años: la mayor parte del trabajo no es crear pantallas nuevas sino mantener, refactorizar y no romper lo que ya usa el cliente.", "Multi-tenant desde el frontend: cada decisión (rutas, sesiones, tema, datos) tiene que contemplar varios talleres a la vez.", "Hablar el idioma del negocio: entender cómo trabaja un taller real hizo que las pantallas se usen, no solo que funcionen."],
      en: ["Sustaining a large product for years: most of the work isn’t new screens but maintaining, refactoring and not breaking what the client already uses.", "Multi-tenancy from the frontend: every decision (routes, sessions, theme, data) has to account for many shops at once.", "Speaking the business’s language: understanding how a real shop works made the screens get used, not just work."],
    },
    stack: ['Next.js', 'TypeScript', 'MUI', 'Redux Toolkit', 'NextAuth', 'React Native', 'Expo'],
    accent: '#ff6a3d',
    featured: true,
    cv: false, // ya está en la experiencia de WANT
    confidential: true,
  },
  {
    slug: 'sgpg',
    name: 'SGPG',
    year: '2026',
    kind: { es: 'Universidad · UDABOL', en: 'University · UDABOL' },
    tagline: {
      es: 'Sistema de gestión de proyectos de grado para mi universidad.',
      en: 'Thesis project management system for my university.',
    },
    problem: {
      es: 'La carrera gestionaba los proyectos de grado con archivos sueltos. SGPG centraliza los documentos, sus versiones y su revisión, y usa IA para resumir y etiquetar cada proyecto. Hoy lo usa la jefatura de carrera y está en evaluación para integrarse a la plataforma de la universidad.',
      en: 'The department managed thesis projects with scattered files. SGPG centralizes documents, versions and reviews, and uses AI to summarize and tag each project. It is already used by the head of the program and is being evaluated for integration into the university platform.',
    },
    role: { es: 'Desarrollo fullstack (prototipo inicial con v0, extendido por mí).', en: 'Fullstack development (initial v0 prototype, extended by me).' },
    highlights: {
      es: [
        'Extracción automática de resumen y etiquetas desde el PDF con IA (Groq).',
        'Visor PDF propio con memoria acotada (resolví un consumo descontrolado de RAM).',
        'Versionado de PDFs, historial de auditoría, carga masiva y gestión de administradores.',
        'Despliegue continuo en Vercel.',
      ],
      en: [
        'Automatic summary and tag extraction from PDFs using AI (Groq).',
        'Custom PDF viewer with bounded memory (fixed a runaway RAM issue).',
        'PDF versioning, audit trail, bulk upload and admin management.',
        'Continuous deployment on Vercel.',
      ],
    },
    learned: {
      es: ["Un prototipo generado con IA es un punto de partida, no un producto: lo difícil vino después (rendimiento, permisos, versionado).", "Los PDFs grandes castigan la memoria: aprendí a renderizar solo lo visible y a liberar recursos a tiempo.", "Construir para un usuario real (la jefatura de carrera) te obliga a priorizar lo que de verdad se usa."],
      en: ["An AI-generated prototype is a starting point, not a product: the hard part came afterwards (performance, permissions, versioning).", "Large PDFs punish memory: I learned to render only what’s visible and release resources on time.", "Building for a real user (the head of the program) forces you to prioritize what actually gets used."],
    },
    stack: ['Next.js 16', 'Firebase', 'Groq', 'pdf.js', 'shadcn/ui', 'Tailwind', 'Vercel'],
    links: [{ label: 'GitHub', href: 'https://github.com/rossmelabasto/v0-university-project-manager' }],
    accent: '#ffb23d',
    featured: true,
    cv: false, // ya está en la experiencia "Independiente" del CV
  },
  {
    slug: 'agua-potable',
    name: "Link'u",
    year: '2026',
    kind: { es: 'Cliente · Proyecto pagado', en: 'Client · Paid project' },
    tagline: {
      es: 'App de escritorio offline-first para el cobro de agua potable de una comunidad.',
      en: 'Offline-first desktop app for a rural community\'s water billing.',
    },
    problem: {
      es: "La comunidad Link'u (Sipe Sipe, Cochabamba) registraba lecturas de medidores a mano y sin respaldo. Como es una comunidad en expansión, necesitaban algo que crezca con ellos: la app funciona 100 % sin internet, emite boletas y respalda los datos cifrados.",
      en: "The Link'u community (Sipe Sipe, Cochabamba) logged water meter readings by hand with no backups. As a growing community, they needed something that scales with them: the app works 100% offline, prints bills and keeps encrypted backups.",
    },
    role: { es: 'Análisis con el cliente, diseño y desarrollo completo.', en: 'Client analysis, design and full development.' },
    highlights: {
      es: [
        'SQLite como fuente de verdad; permisos y cálculos solo en el proceso principal de Electron; montos en centavos enteros.',
        'Respaldos cifrados AES-256-GCM en la nube, migraciones versionadas con respaldo previo automático.',
        'Actualizaciones automáticas, multas por mora, boletas PDF y login con foto para operarios (pedido del cliente).',
        '47 tests (Vitest) y CI en GitHub Actions que genera instalador de Windows, portable y AppImage.',
      ],
      en: [
        'SQLite as source of truth; permissions and calculations only in Electron\'s main process; money stored as integer cents.',
        'AES-256-GCM encrypted cloud backups, versioned migrations with automatic pre-migration backup.',
        'Auto-updates, late fees, PDF bills and photo login for operators (client request).',
        '47 tests (Vitest) and GitHub Actions CI producing a Windows installer, portable build and AppImage.',
      ],
    },
    learned: {
      es: ["Offline-first de verdad: si no hay internet la app tiene que funcionar igual, y la nube es solo respaldo.", "El dinero nunca en decimales flotantes: guardar centavos enteros evita errores de redondeo en las boletas.", "Escuchar al cliente aunque la idea no sea la que uno elegiría (como el login con foto): el software es para ellos.", "Migraciones con respaldo previo: en una app que corre en la compu de otra persona no hay segunda oportunidad."],
      en: ["True offline-first: with no internet the app must work the same, and the cloud is only a backup.", "Never store money as floats: integer cents avoid rounding errors on bills.", "Listen to the client even when the idea isn’t the one you’d pick (like photo login): the software is for them.", "Migrations with a prior backup: in an app running on someone else’s computer there’s no second chance."],
    },
    stack: ['Electron', 'React', 'Vite', 'SQLite', 'Firebase Storage', 'Vitest', 'GitHub Actions'],
    accent: '#3db8ff',
    featured: true,
    cv: false, // ya está en la experiencia "Independiente" del CV
    confidential: true,
  },
  {
    slug: 'homelab',
    name: 'Homelab',
    year: '2026',
    kind: { es: 'Proyecto personal · Infraestructura', en: 'Personal project · Infrastructure' },
    tagline: {
      es: 'Servidor casero 24/7 con una docena de servicios y un agente de IA (OpenClaw) que lo opera.',
      en: 'A 24/7 home server running a dozen services, operated by an AI agent (OpenClaw).',
    },
    problem: {
      es: 'Un Pentium de 4 hilos y 3,7 GB de RAM, detrás de CGNAT y sin poder abrir puertos. Aun así sirve 12 servicios públicos bajo mi dominio, con HTTPS, backups y monitoreo, a costo cero.',
      en: 'A 4-thread Pentium with 3.7 GB of RAM, behind CGNAT with no way to open ports. It still serves 12 public services under my domain, with HTTPS, backups and monitoring, at zero cost.',
    },
    role: { es: 'Todo: infraestructura, automatización y el agente.', en: 'Everything: infrastructure, automation and the agent.' },
    highlights: {
      es: [
        'Exposición segura con Cloudflare Tunnel (sin puertos abiertos), acceso privado por Tailscale, UFW y fail2ban.',
        'Servicios en Docker y systemd: media server, gestión del hogar, un notebook RAG propio y más; backups con timers.',
        'Agente OpenClaw 24/7 (webchat y Telegram) con 41 skills de procedimientos: despliegues, mantenimiento, reportes y memoria consolidada.',
        'Gateway SMS con un módem USB: comandos por SMS con lista blanca y alertas de salud del servidor cada 5 minutos.',
        'Virtualización KVM: Rocky Linux con LVM y Windows Server 2022 instalado de forma desatendida.',
      ],
      en: [
        'Secure exposure via Cloudflare Tunnel (no open ports), private access over Tailscale, UFW and fail2ban.',
        'Services on Docker and systemd: media server, home management, a custom RAG notebook and more; timer-based backups.',
        '24/7 OpenClaw agent (webchat and Telegram) with 41 procedure skills: deployments, maintenance, reports and memory consolidation.',
        'SMS gateway on a USB modem: whitelisted SMS commands and server health alerts every 5 minutes.',
        'KVM virtualization: Rocky Linux with LVM and an unattended Windows Server 2022 install.',
      ],
    },
    learned: {
      es: ["Las restricciones enseñan: sin IP pública ni puertos abiertos aprendí túneles, DNS y cómo exponer servicios de forma segura.", "Automatizar lo que se repite: backups, alertas y reportes con timers de systemd en lugar de acordarme.", "Un agente de IA con memoria y procedimientos escritos es mucho más útil que un chat: documentar es lo que lo hace confiable."],
      en: ["Constraints teach: with no public IP or open ports I learned tunnels, DNS and how to expose services securely.", "Automate what repeats: backups, alerts and reports with systemd timers instead of relying on memory.", "An AI agent with memory and written procedures is far more useful than a chat: documentation is what makes it reliable."],
    },
    stack: ['Arch Linux', 'Docker', 'systemd', 'Cloudflare Tunnel', 'Tailscale', 'OpenClaw', 'KVM'],
    accent: '#5dffb0',
    featured: true,
    cv: false,
  },
  {
    slug: 'ros',
    name: 'rOS',
    year: '2026',
    kind: { es: 'Proyecto personal · Linux', en: 'Personal project · Linux' },
    tagline: { es: 'Mi propio flavor de Arch, en uso diario y en camino a ser una distro.', en: 'My own flavor of Arch, daily-driven and on its way to becoming a distro.' },
    problem: {
      es: 'No es una ISO: es una capa de escritorio propia, versionada y reversible sobre Archcraft/Arch que convierte una instalación en rOS — con identidad, arranque, escritorio y herramientas propias. La meta: que sea una distro real, instalable.',
      en: 'Not an ISO: a custom, versioned and reversible desktop layer on top of Archcraft/Arch that turns an install into rOS — with its own identity, boot, desktop and tools. The goal: a real, installable distro.',
    },
    role: { es: 'Todo.', en: 'Everything.' },
    highlights: {
      es: [
        'Escritorio Wayland con niri y DankMaterialShell (Quickshell/QML); greeter sobre greetd; arranque con Limine y branding propio.',
        'ros-update: snapshot de Timeshift antes de actualizar pacman, AUR y flatpak; gestión de modos de GPU (PRIME) y perfiles de energía automáticos.',
        'Hardening: SSH solo con llave, ufw, zram + systemd-oomd; scripts idempotentes de instalación y rollback.',
        'Utilidades con GPU: reescalado de imágenes (waifu2x) y subtítulos automáticos (faster-whisper).',
      ],
      en: [
        'Wayland desktop with niri and DankMaterialShell (Quickshell/QML); greetd greeter; Limine boot with custom branding.',
        'ros-update: Timeshift snapshot before updating pacman, AUR and flatpak; GPU mode switching (PRIME) and automatic power profiles.',
        'Hardening: key-only SSH, ufw, zram + systemd-oomd; idempotent install and rollback scripts.',
        'GPU utilities: image upscaling (waifu2x) and automatic subtitles (faster-whisper).',
      ],
    },
    learned: {
      es: ["Todo cambio al sistema tiene que ser reversible: snapshots antes de actualizar y scripts idempotentes.", "Entender el arranque de punta a punta (UEFI, bootloader, initramfs, greeter) quita el miedo a romper el sistema.", "Diseño también es sistema: la identidad visual de rOS salió del mismo cuidado que pongo en una interfaz web."],
      en: ["Every system change must be reversible: snapshots before updating and idempotent scripts.", "Understanding boot end to end (UEFI, bootloader, initramfs, greeter) removes the fear of breaking the system.", "Design is also a system: rOS’s visual identity came from the same care I put into a web interface."],
    },
    stack: ['Arch Linux', 'niri', 'DankMaterialShell', 'Limine', 'Shell', 'systemd'],
    accent: '#8ab4ff',
    featured: true,
    cv: false,
  },
  {
    slug: 'adsie',
    name: 'Adsie',
    year: '2023 – 2025',
    kind: WANT,
    tagline: { es: 'Red de anuncios que conecta negocios locales, clientes e influencers en Florida.', en: 'Ads network connecting local businesses, customers and influencers in Florida.' },
    problem: {
      es: 'Empezó como una app donde los dueños de negocios publican anuncios, eventos y cupones para sus clientes. A mitad de camino sumó un marketplace para que los negocios contraten influencers.',
      en: 'It started as an app where business owners publish ads, events and coupons for their customers. Midway it added a marketplace for businesses to hire influencers.',
    },
    role: { es: 'Desarrollo de la app móvil (434 de 497 commits).', en: 'Mobile app development (434 of 497 commits).' },
    highlights: {
      es: ['Perfiles de empresa, posts y highlights, eventos', 'Cupones con estadísticas de uso', 'Contratación de influencers para campañas', 'Cámara y video, listas de alto rendimiento (FlashList), i18n'],
      en: ['Business profiles, posts and highlights, events', 'Coupons with usage stats', 'Hiring influencers for campaigns', 'Camera and video, high-performance lists (FlashList), i18n'],
    },
    learned: {
      es: ["Los requisitos cambian a mitad de camino: una app de anuncios pasó a ser también un marketplace de influencers, y la arquitectura tenía que aguantarlo.", "Rendimiento en móvil: listas largas con imágenes y video exigen virtualización y cuidado con cada render.", "Trabajar para un mercado en otro país e idioma: i18n desde el inicio, no como parche."],
      en: ["Requirements change midway: an ads app also became an influencer marketplace, and the architecture had to hold up.", "Mobile performance: long lists with images and video demand virtualization and care with every render.", "Building for a market in another country and language: i18n from day one, not as a patch."],
    },
    stack: ['React Native', 'Expo', 'TypeScript'],
    accent: '#ff3d8b',
    featured: false,
    cv: false,
    confidential: true,
  },
  {
    slug: 'bite',
    name: 'Bite',
    year: '2025',
    kind: WANT,
    tagline: { es: 'SaaS de menú digital y pedidos para restaurantes.', en: 'Digital menu and ordering SaaS for restaurants.' },
    problem: {
      es: 'Menú móvil multi-tenant para restaurantes de Cochabamba: el cliente pide desde la mesa escaneando un QR.',
      en: 'Multi-tenant mobile menu for restaurants in Cochabamba: customers order from their table by scanning a QR code.',
    },
    role: { es: 'Desarrollo frontend (260 de 277 commits).', en: 'Frontend development (260 of 277 commits).' },
    highlights: {
      es: ["Menú digital por sucursal, pensado para el celular del comensal", "Pedido a mesa escaneando un QR y checkout", "Cupones, banners promocionales, planes y gestión de sucursales", "Integración con Google Maps y modo de alto contraste para accesibilidad"],
      en: ["Per-branch digital menu, designed for the diner’s phone", "Table ordering by scanning a QR code, plus checkout", "Coupons, promo banners, plans and branch management", "Google Maps integration and a high-contrast mode for accessibility"],
    },
    learned: {
      es: ["Next.js App Router en un producto real: separar bien lo que corre en el servidor y en el cliente.", "El usuario final está con hambre y apurado: cada paso extra en el pedido es un pedido perdido.", "La accesibilidad (alto contraste) no es un extra: un menú se lee en lugares con poca luz."],
      en: ["Next.js App Router on a real product: cleanly separating what runs on the server and on the client.", "The end user is hungry and in a hurry: every extra step in the order is a lost order.", "Accessibility (high contrast) isn’t an extra: menus get read in dim places."],
    },
    stack: ['Next.js (App Router)', 'TypeScript'],
    accent: '#ffd23d',
    featured: false,
    cv: false,
    confidential: true,
  },
  {
    slug: 'onelife',
    name: 'One Life Fitness',
    year: '2023 – 2025', // empezó en 2023, se pausó y se retomó en 2025
    kind: WANT,
    tagline: { es: 'App móvil para los socios de un gimnasio.', en: 'Mobile app for gym members.' },
    role: { es: 'Todo el frontend de la app en React Native.', en: 'The entire React Native app frontend.' },
    problem: {
      es: "Un gimnasio con sedes en Cochabamba y La Paz necesitaba una app propia para que sus socios tuvieran la información del gimnasio y de su membresía en el celular. El proyecto empezó en 2023, se pausó y lo retomamos en 2025.",
      en: "A gym with locations in Cochabamba and La Paz needed its own app so members could have gym and membership information on their phones. The project started in 2023, was paused and resumed in 2025.",
    },
    highlights: {
      es: ["Todo el frontend de la app en React Native, de las primeras pantallas a la versión retomada", "Flujos típicos de una app de gimnasio para socios", "Retomar un código dos años después: actualizar dependencias y ponerlo al día sin romperlo"],
      en: ["The entire React Native frontend, from the first screens to the resumed version", "Typical member-facing gym app flows", "Picking up a codebase two years later: updating dependencies and modernizing it without breaking it"],
    },
    learned: {
      es: ["Escribir código pensando en quien lo retome (aunque sea uno mismo en dos años).", "Actualizar React Native y sus librerías es un proyecto en sí: hay que planificarlo, no improvisarlo."],
      en: ["Write code for whoever picks it up next, even if it’s yourself two years later.", "Upgrading React Native and its libraries is a project in itself: plan it, don’t improvise it."],
    },
    stack: ['React Native'],
    accent: '#ff8a3d',
    featured: false,
    cv: false,
    confidential: true,
  },
  {
    slug: 'onehand',
    name: 'OneHand',
    year: '2023',
    kind: WANT,
    tagline: { es: 'Gestión de citas para un centro de fisioterapia.', en: 'Appointment management for a physiotherapy center.' },
    role: { es: 'Todo el frontend de la app en React Native.', en: 'The entire React Native app frontend.' },
    problem: {
      es: "Un centro de fisioterapia llevaba sus citas a mano. La app permite organizar la agenda y a los pacientes desde el celular, en un proyecto que se hizo y terminó en 2023.",
      en: "A physiotherapy center managed appointments by hand. The app lets them organize the schedule and patients from a phone, in a project built and finished in 2023.",
    },
    highlights: {
      es: ["Todo el frontend de la app en React Native", "Agenda de citas y gestión de pacientes", "Proyecto completo de principio a fin dentro del mismo año"],
      en: ["The entire React Native app frontend", "Appointment scheduling and patient management", "A complete project from start to finish within the same year"],
    },
    learned: {
      es: ["Una agenda parece simple hasta que aparecen los casos reales: cancelaciones, reprogramaciones y horarios que se cruzan.", "Terminar y entregar: cerrar un proyecto completo enseña tanto como construirlo."],
      en: ["A scheduler looks simple until real cases show up: cancellations, rescheduling and overlapping slots.", "Finish and ship: closing out a complete project teaches as much as building it."],
    },
    stack: ['React Native'],
    accent: '#b58cff',
    featured: false,
    cv: false,
    confidential: true,
  },
  {
    slug: 'lynx',
    name: 'LYNX Bolivia',
    year: '2022', // de los primeros proyectos completados
    kind: WANT,
    tagline: { es: 'Sitio web de una tienda de electrónica y electrodomésticos.', en: 'Website for an electronics and home appliance retailer.' },
    role: { es: 'Desarrollo del sitio en WordPress.', en: 'WordPress site development.' },
    problem: {
      es: "LYNX Bolivia vende electrónica y electrodomésticos de marcas líderes, con tienda en Cochabamba y envíos a todo el país. Necesitaba un sitio corporativo y tienda en línea que pudieran administrar ellos mismos. Fue de los primeros proyectos que completé en la agencia.",
      en: "LYNX Bolivia sells electronics and home appliances from leading brands, with a store in Cochabamba and nationwide shipping. They needed a corporate site and online store they could manage themselves. It was one of the first projects I completed at the agency.",
    },
    highlights: {
      es: ["Sitio corporativo y tienda en línea en WordPress", "Contenido administrable por el propio cliente", "Uno de los primeros proyectos completados y entregados en la agencia"],
      en: ["Corporate site and online store on WordPress", "Content the client can manage on their own", "One of the first projects completed and delivered at the agency"],
    },
    learned: {
      es: ["No todo requiere código a medida: elegir la herramienta que el cliente puede mantener es parte del trabajo.", "Mi primera experiencia entregando a un cliente real: plazos, cambios y revisiones."],
      en: ["Not everything needs custom code: picking a tool the client can maintain is part of the job.", "My first experience delivering to a real client: deadlines, changes and reviews."],
    },
    stack: ['WordPress'],
    links: [{ label: 'lynx.com.bo', href: 'https://lynx.com.bo/' }],
    accent: '#e8e8e8',
    featured: false,
    cv: false,
  },
  {
    slug: 'blessd',
    name: 'Blessd',
    year: '2022',
    kind: WANT,
    tagline: { es: 'Red social para iglesias.', en: 'Social network for churches.' },
    role: { es: 'Desarrollo frontend.', en: 'Frontend development.' },
    problem: {
      es: "Una red social pensada para comunidades de iglesias: publicaciones, comunidad y contenido compartido entre miembros. Fue mi primer proyecto en la agencia y, aunque el producto no llegó a lanzarse, ahí aprendí a trabajar en equipo sobre un código real.",
      en: "A social network designed for church communities: posts, community and shared content among members. It was my first project at the agency and, although the product never launched, it’s where I learned to work as a team on a real codebase.",
    },
    highlights: {
      es: ["Mi primer proyecto profesional, como pasante", "Interfaces móviles en React Native", "Primer contacto con revisiones de código y trabajo con un backend real"],
      en: ["My first professional project, as an intern", "Mobile interfaces in React Native", "First exposure to code reviews and working against a real backend"],
    },
    learned: {
      es: ["Que un producto no se lance no significa que el trabajo no valga: fue mi escuela.", "Leer y entender código ajeno antes de escribir el propio."],
      en: ["A product not launching doesn’t mean the work wasn’t worth it: it was my school.", "Read and understand someone else’s code before writing your own."],
    },
    stack: ['React Native'],
    accent: '#ffffff',
    featured: false,
    cv: false,
    confidential: true,
  },
  {
    slug: 'canasta',
    name: 'Canasta',
    year: '2023',
    kind: { es: 'Hackatón Hackacom 2023 · Participante', en: 'Hackacom 2023 hackathon · Participant' },
    tagline: {
      es: 'Reportes ciudadanos y voluntarios para arreglar la ciudad.',
      en: 'Citizen reports and volunteers to fix the city.',
    },
    problem: {
      es: 'En Cochabamba hay muchos problemas pequeños que los propios vecinos pueden resolver: basura acumulada, árboles caídos, espacios descuidados. Canasta permite reportarlos en un mapa y que otras personas se apunten como voluntarias para ir a solucionarlos. No ganamos, pero fue una gran experiencia de trabajo contra reloj.',
      en: 'Cochabamba has lots of small problems neighbors can fix themselves: piled-up trash, fallen trees, neglected spaces. Canasta lets people report them on a map and others sign up as volunteers to go fix them. We didn\'t win, but it was great practice working against the clock.',
    },
    role: { es: 'Desarrollo frontend.', en: 'Frontend development.' },
    highlights: {
      es: ['Dos tipos de usuario: quien reporta y quien se apunta como voluntario', 'Mapa interactivo de reportes con Leaflet', 'Registro e inicio de sesión'],
      en: ['Two user types: reporters and volunteers', 'Interactive report map with Leaflet', 'Sign-up and login'],
    },
    learned: {
      es: ["En una hackatón gana quien recorta: definir el mínimo que demuestra la idea es la habilidad clave.", "Trabajar con alguien que acabas de conocer, contra reloj, dividiendo tareas desde el minuto uno."],
      en: ["At a hackathon, whoever cuts scope wins: defining the minimum that proves the idea is the key skill.", "Working with someone you just met, against the clock, splitting tasks from minute one."],
    },
    stack: ['React', 'Leaflet', 'Tailwind'],
    links: [{ label: 'GitHub', href: 'https://github.com/rossmelabasto/hackacom2023' }],
    accent: '#3dffe0',
    featured: false,
    cv: false,
  },
  {
    slug: 'eko',
    name: 'EKO',
    year: '2025',
    kind: { es: 'Freelance · Emprendimiento', en: 'Freelance · Small business' },
    tagline: { es: 'Tienda en línea y catálogo de productos para un emprendimiento.', en: 'Online store and product catalog for a small business.' },
    problem: {
      es: 'Tienda en línea completa: catálogo, búsqueda difusa, carrito, cupones, órdenes y panel de administración.',
      en: 'Full online store: catalog, fuzzy search, cart, coupons, orders and admin panel.',
    },
    role: { es: 'Desarrollo fullstack.', en: 'Fullstack development.' },
    highlights: {
      es: ["Catálogo de productos con búsqueda difusa (encuentra aunque escribas con errores)", "Carrito, cupones y órdenes", "Panel de administración para cargar y editar productos", "Arquitectura por features y estado global con Redux Toolkit, Supabase como backend"],
      en: ["Product catalog with fuzzy search (finds results even with typos)", "Cart, coupons and orders", "Admin panel to add and edit products", "Feature-based architecture and global state with Redux Toolkit, Supabase backend"],
    },
    learned: {
      es: ["Organizar el código por funcionalidad (features) escala mejor que por tipo de archivo.", "Un panel de administración simple vale más para un emprendimiento que diez funciones que nadie usa."],
      en: ["Organizing code by feature scales better than by file type.", "A simple admin panel is worth more to a small business than ten features nobody uses."],
    },
    stack: ['React', 'TypeScript', 'Redux Toolkit', 'Supabase', 'MUI'],
    links: [{ label: 'eko-store.vercel.app', href: 'https://eko-store.vercel.app/' }],
    accent: '#7dffc4',
    featured: false,
    cv: false,
  },
];

/** Proyectos visibles (sin borradores). Usar siempre esto en componentes. */
export const visibleProjects = projects.filter((p) => !p.draft);

/* ------------------------------------------------------------------ */
/* CÓMO TRABAJO (sección IA / flujo)                                   */
/* ------------------------------------------------------------------ */

export const workflow: { title: L; body: L }[] = [
  {
    title: { es: 'Entender', en: 'Understand' },
    body: {
      es: 'Antes de escribir código, entiendo el problema y a quien lo usa. Investigo con IA para llegar rápido al contexto.',
      en: 'Before writing code I understand the problem and who has it. I research with AI to get context fast.',
    },
  },
  {
    title: { es: 'Prototipar', en: 'Prototype' },
    body: {
      es: 'Prototipos funcionales en horas, no semanas (v0, Claude Code), para validar la idea con algo real.',
      en: 'Working prototypes in hours, not weeks (v0, Claude Code), to validate ideas with something real.',
    },
  },
  {
    title: { es: 'Construir y medir', en: 'Build & measure' },
    body: {
      es: 'Entiendo lo que llega a producción, lo haya escrito yo o la IA. Código tipado, tests y métricas: en AdvAI, evaluar la búsqueda me llevó del 43 % al 80 % de acierto.',
      en: 'I understand what ships to production, whether I or AI wrote it. Typed code, tests and metrics: in AdvAI, evaluating retrieval took me from 43% to 80% hit rate.',
    },
  },
  {
    title: { es: 'Automatizar', en: 'Automate' },
    body: {
      es: 'Agentes, scripts y LLMs locales para lo repetitivo. Mi tiempo va a lo que no se puede automatizar.',
      en: 'Agents, scripts and local LLMs for the repetitive stuff. My time goes where automation can\'t.',
    },
  },
];

/* ------------------------------------------------------------------ */
/* PROGRAMADOR PRIMERO: antes y después de la IA (sección "Cómo trabajo") */
/* ------------------------------------------------------------------ */

export const aiJourney: { period: L; title: L; body: L; tools?: string[] }[] = [
  {
    period: { es: '2019', en: '2019' },
    title: { es: 'Aprender sin atajos', en: 'Learning with no shortcuts' },
    body: {
      es: 'Autodidacta con mi primera computadora: cursos, documentación y mucho prueba y error.',
      en: 'Self-taught on my first computer: courses, docs and lots of trial and error.',
    },
  },
  {
    period: { es: '2022 – 2024', en: '2022 – 2024' },
    title: { es: 'A mano, a la vieja escuela', en: 'By hand, old-school' },
    body: {
      es: 'Productos reales para clientes en React, Next.js y React Native, escritos y depurados sin asistentes de IA.',
      en: 'Real client products in React, Next.js and React Native, written and debugged without AI assistants.',
    },
  },
  {
    period: { es: '2025', en: '2025' },
    title: { es: 'La IA llega al trabajo', en: 'AI arrives at work' },
    body: {
      es: 'En el último año en la agencia incorporamos IA al flujo de desarrollo y a los productos.',
      en: 'In my last year at the agency we brought AI into our development workflow and our products.',
    },
  },
  {
    period: { es: 'Hoy', en: 'Today' },
    title: { es: 'IA como multiplicador', en: 'AI as a multiplier' },
    body: {
      es: 'Uso cada herramienta para lo que hace mejor, pero el criterio y la responsabilidad del código siguen siendo míos.',
      en: 'I use each tool for what it does best, but the judgment and ownership of the code are still mine.',
    },
    tools: ['GitHub Copilot', 'ChatGPT', 'Gemini', 'DeepSeek', 'Groq', 'Ollama', 'Claude'],
  },
];

/* ------------------------------------------------------------------ */
/* EN VIVO: subdominios públicos de rossmel.top                        */
/* ------------------------------------------------------------------ */

/**
 * Sitios que corren en mi dominio. Solo se muestran los que NO son `draft`.
 * Nunca listar paneles de administración, SSH, chats privados ni servicios personales.
 * `project` = slug del caso de estudio donde también aparece (p. ej. 'homelab').
 */
export const liveSites: { host: string; name: L; body: L; project?: string; draft?: boolean }[] = [
  {
    host: 'notebook.rossmel.top',
    name: { es: 'Notebook RAG', en: 'RAG Notebook' },
    body: {
      es: 'Mis apuntes con búsqueda inteligente (RAG): les puedo hacer preguntas en lenguaje natural.',
      en: 'My notes with smart search (RAG): I can ask them questions in natural language.',
    },
    project: 'homelab',
  },
  {
    host: 'rubik.rossmel.top',
    name: { es: 'Rubik', en: 'Rubik' },
    body: {
      es: 'Para practicar cubo de Rubik y otros puzzles: mezclas oficiales WCA y visor 3D (cubing.js), sin depender de CDNs.',
      en: 'Practice the Rubik\'s cube and other puzzles: official WCA scrambles and a 3D viewer (cubing.js), with no CDN dependency.',
    },
    project: 'homelab',
  },
  {
    host: 'selflix.rossmel.top',
    name: { es: 'Selflix', en: 'Selflix' },
    body: {
      es: 'Mi servidor multimedia propio (Jellyfin), con apps en el celular y la tele. Acceso solo con cuenta.',
      en: 'My own media server (Jellyfin), with phone and TV apps. Account-only access.',
    },
    project: 'homelab',
  },
];

export const visibleLiveSites = liveSites.filter((x) => !x.draft);
