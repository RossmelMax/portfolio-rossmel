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
 *  - `// TODO(confirmar)` → dato que Rossmel todavía debe confirmar.
 */

export type Lang = 'es' | 'en';
export type L = Record<Lang, string>;

export const profile = {
  name: 'Rossmel Abasto',
  role: { es: 'Desarrollador Frontend → Fullstack', en: 'Frontend → Fullstack Developer' } as L,
  location: { es: 'Cochabamba, Bolivia · Remoto', en: 'Cochabamba, Bolivia · Remote' } as L,
  email: 'abastorossmel@gmail.com',
  links: {
    github: 'https://github.com/RossmelMax',
    linkedin: '', // TODO(confirmar): URL de LinkedIn
    gitlab: 'https://gitlab.com/RossmelAbasto',
  },
  portfolioUrl: 'https://portfolio.rossmel.top',
  cvUrl: 'https://cv.rossmel.top',

  headline: {
    es: 'Construyo interfaces rápidas, cuidadas y listas para producción — y uso IA para llegar más lejos, más rápido.',
    en: 'I build fast, polished, production-ready interfaces — and use AI to go further, faster.',
  } as L,

  /** Resumen profesional (CV). 3–4 líneas, con palabras clave para ATS. */
  summary: {
    es: 'Desarrollador Frontend con más de 3 años de experiencia construyendo aplicaciones web y móviles con React, React Native, Next.js y TypeScript en una agencia digital, de la maqueta a producción. Experiencia en integración con APIs REST, Firebase y Supabase, y creciendo hacia el desarrollo Fullstack (Node.js, Python/FastAPI, SQL). Uso herramientas de IA (Claude Code, LLMs locales, RAG) como parte diaria de mi flujo para investigar, prototipar y entregar más rápido sin sacrificar calidad.',
    en: 'Frontend Developer with 3+ years of experience building web and mobile applications with React, React Native, Next.js and TypeScript at a digital agency, from mockup to production. Experienced integrating REST APIs, Firebase and Supabase, and growing into Fullstack development (Node.js, Python/FastAPI, SQL). I use AI tooling (Claude Code, local LLMs, RAG) daily to research, prototype and ship faster without sacrificing quality.',
  } as L,

  /** "Sobre mí" del portafolio: más humano que el resumen del CV. */
  about: {
    es: [
      'Empecé a programar solo, en 2019, con mi primera computadora propia. Desde entonces no paré: cursos, documentación, prueba y error, y muchas noches de “¿por qué no funciona esto?”.',
      'Pasé más de tres años en WANT Digital Agency, donde éramos dos en desarrollo: mi jefe en el backend y yo en el frontend. Ahí aprendí a hacer de todo — investigar, resolver, trabajar bajo presión y entregar.',
      'Hoy la IA es parte de cómo trabajo: agentes, LLMs locales y automatizaciones me permiten dedicar el tiempo a lo que importa — el diseño, la arquitectura y el detalle.',
      'Fuera del trabajo, vivo en Linux: estoy armando mi propia distro, rOS, y un pequeño homelab en casa.',
    ],
    en: [
      'I started coding on my own in 2019, with my first personal computer. I haven\'t stopped since: courses, docs, trial and error, and many “why isn\'t this working?” nights.',
      'I spent 3+ years at WANT Digital Agency, where the dev team was two people: my boss on the backend and me on the frontend. That\'s where I learned to do a bit of everything — research, solve, work under pressure and ship.',
      'Today AI is part of how I work: agents, local LLMs and automations let me spend my time on what matters — design, architecture and detail.',
      'Outside work I live in Linux: I\'m building my own distro, rOS, and a small homelab at home.',
    ],
  } as Record<Lang, string[]>,

  stats: [
    { value: '3+', label: { es: 'años en producción', en: 'years shipping' } as L },
    { value: '7+', label: { es: 'productos para clientes', en: 'client products' } as L },
    { value: '2019', label: { es: 'escribiendo código', en: 'writing code' } as L },
    { value: '∞', label: { es: 'ganas de aprender', en: 'curiosity' } as L },
  ],

  softSkills: {
    es: ['Resolución de problemas', 'Autonomía', 'Trabajo bajo presión', 'Aprendizaje rápido', 'Comunicación con clientes'],
    en: ['Problem solving', 'Autonomy', 'Working under pressure', 'Fast learner', 'Client communication'],
  } as Record<Lang, string[]>,

  languages: [
    { name: { es: 'Español', en: 'Spanish' } as L, level: { es: 'Nativo', en: 'Native' } as L },
    { name: { es: 'Inglés', en: 'English' } as L, level: { es: 'Avanzado', en: 'Advanced' } as L }, // TODO(confirmar) nivel
  ],
};

/* ------------------------------------------------------------------ */
/* EXPERIENCIA                                                         */
/* ------------------------------------------------------------------ */

export type Experience = {
  company: string;
  role: L;
  type: L;
  start: string; // YYYY-MM
  end: string | null; // null = actual
  location: L;
  summary: L;
  bullets: Record<Lang, string[]>;
  stack: string[];
  cv: boolean;
};

export const experience: Experience[] = [
  {
    company: 'WANT Digital Agency',
    role: { es: 'Desarrollador Frontend (Web y Móvil)', en: 'Frontend Developer (Web & Mobile)' },
    type: {
      es: 'Pasantía → Freelance → Tiempo completo',
      en: 'Internship → Contractor → Full-time',
    },
    start: '2022-06', // TODO(confirmar) mes exacto
    end: '2026-01',
    location: { es: 'Cochabamba, Bolivia', en: 'Cochabamba, Bolivia' },
    summary: {
      es: 'Único desarrollador frontend en un equipo de desarrollo de dos personas. Responsable de las interfaces web y móviles de los productos de la agencia y de sus clientes.',
      en: 'Sole frontend developer on a two-person dev team. Owned the web and mobile interfaces of the agency\'s products and client projects.',
    },
    bullets: {
      es: [
        'Desarrollé el frontend de 7+ productos para clientes (SaaS, apps móviles, marketplaces y sitios web) con React, React Native y TypeScript, desde la maqueta hasta producción.',
        'Construí el panel web de CarX (antes Vulcano), un SaaS de gestión para talleres mecánicos: órdenes de trabajo, agenda de citas, inventario de vehículos y dashboards por rol.',
        'Desarrollé apps móviles en React Native para One Life Fitness (gimnasio con sedes en Cochabamba y La Paz) y OneHand (gestión de citas para un centro de fisioterapia).',
        'Integré APIs REST del backend (probadas y documentadas con Bruno), manejando autenticación, estados de carga/errores y flujos por rol.',
        'Trabajé directamente con el líder técnico en tareas y revisiones de código, entregando funcionalidades en ciclos cortos y bajo presión de fechas.',
        'Comencé como pasante (3 meses), continué como desarrollador freelance con pago mensual y fui contratado a tiempo completo en 2025.',
      ],
      en: [
        'Built the frontend of 7+ client products (SaaS, mobile apps, marketplaces and websites) with React, React Native and TypeScript, from mockup to production.',
        'Built the web dashboard for CarX (formerly Vulcano), a management SaaS for auto repair shops: work orders, appointment scheduling, vehicle records and role-based dashboards.',
        'Developed React Native mobile apps for One Life Fitness (a gym chain in Cochabamba and La Paz) and OneHand (appointment management for a physiotherapy center).',
        'Integrated backend REST APIs (tested and documented with Bruno), handling authentication, loading/error states and role-based flows.',
        'Worked directly with the tech lead on tasks and code reviews, shipping features in short cycles under tight deadlines.',
        'Started as an intern (3 months), continued as a monthly-paid contractor and was hired full-time in 2025.',
      ],
    },
    stack: ['React', 'React Native', 'TypeScript', 'JavaScript', 'Next.js', 'REST APIs', 'WordPress', 'Git'],
    cv: true,
  },
  {
    company: 'Freelance',
    role: { es: 'Diseñador Gráfico — Identidad de marca', en: 'Graphic Designer — Brand Identity' },
    type: { es: 'Proyecto freelance (~5 meses)', en: 'Freelance project (~5 months)' },
    start: '2023-01', // TODO(confirmar) fechas
    end: '2023-05',
    location: { es: 'Remoto', en: 'Remote' },
    summary: {
      es: 'Identidad visual completa para un emprendimiento: logo, paleta, portafolio digital y contenido para redes.',
      en: 'Full visual identity for a small business: logo, color palette, digital portfolio and social media content.',
    },
    bullets: {
      es: [
        'Diseñé la identidad de marca (logo, paleta de colores y tipografía) y un portafolio digital.',
        'Produje piezas gráficas para redes sociales de forma recurrente durante ~5 meses.',
      ],
      en: [
        'Designed the brand identity (logo, color palette and typography) and a digital portfolio.',
        'Produced recurring social media graphics over ~5 months.',
      ],
    },
    stack: ['Figma', 'Branding', 'UI'],
    cv: true,
  },
];

/* ------------------------------------------------------------------ */
/* EDUCACIÓN                                                           */
/* ------------------------------------------------------------------ */

export const education = [
  {
    title: { es: 'Ingeniería de Sistemas', en: 'B.S. Systems Engineering' } as L,
    school: 'Universidad de Aquino Bolivia (UDABOL)',
    period: { es: '2019 – 2026 · 8.º de 8 semestres', en: '2019 – 2026 · 8th of 8 semesters' } as L, // TODO(confirmar) año de inicio
    note: {
      es: 'Proyecto de grado: AdvAI — auditoría legal de contratos con IA (RAG híbrido + LLMs).',
      en: 'Capstone: AdvAI — AI-powered legal contract auditing (hybrid RAG + LLMs).',
    } as L,
  },
  {
    title: { es: 'Desarrollo de Aplicaciones Web', en: 'Web Application Development' } as L,
    school: 'Solaning',
    period: { es: '2022 · Completado', en: '2022 · Completed' } as L,
    note: { es: '', en: '' } as L,
  },
];

export const learning = ['Platzi', 'Coursera', 'Udemy', 'freeCodeCamp', 'Google for Education', 'W3Schools'];

/* ------------------------------------------------------------------ */
/* HABILIDADES (agrupadas para ATS)                                    */
/* ------------------------------------------------------------------ */

export const skills: { group: L; items: string[] }[] = [
  {
    group: { es: 'Frontend', en: 'Frontend' },
    items: ['React', 'Next.js', 'React Native', 'TypeScript', 'JavaScript (ES2023)', 'HTML5', 'CSS3 / Sass', 'Tailwind CSS', 'Astro', 'Angular', 'Material UI', 'shadcn/ui', 'GSAP', 'Framer Motion'],
  },
  {
    group: { es: 'Backend y datos', en: 'Backend & Data' },
    items: ['Node.js', 'Express', 'Python', 'FastAPI', 'REST APIs', 'SSE', 'PostgreSQL', 'SQLite', 'Prisma', 'Drizzle', 'Supabase', 'Firebase (Firestore, Auth, Storage, Functions)'],
  },
  {
    group: { es: 'IA', en: 'AI' },
    items: ['Claude Code', 'LLM APIs (Groq, Gemini, DeepSeek)', 'Ollama (LLMs locales)', 'RAG', 'Búsqueda híbrida BM25 + embeddings', 'Prompt engineering', 'Agentes'],
  },
  {
    group: { es: 'Herramientas', en: 'Tools' },
    items: ['Git', 'GitHub', 'GitLab', 'Bruno / Postman', 'Electron', 'Vite', 'Docker', 'Linux (Arch)', 'Tailscale', 'Figma', 'v0', 'Vercel'],
  },
];

/** Marquee del portafolio (solo nombres). */
export const marquee = ['React', 'Next.js', 'TypeScript', 'React Native', 'Astro', 'Tailwind', 'Node.js', 'Python', 'FastAPI', 'Supabase', 'Firebase', 'PostgreSQL', 'Electron', 'GSAP', 'Ollama', 'Claude Code', 'Linux', 'Git'];

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
  stack: string[];
  links?: { label: string; href: string }[];
  accent: string; // color del caso de estudio
  featured: boolean;
  cv: boolean;
  confidential?: boolean; // código privado / sin demo pública
};

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
    role: { es: 'Diseño, arquitectura y desarrollo fullstack (solo).', en: 'Design, architecture and fullstack development (solo).' },
    highlights: {
      es: [
        'Búsqueda híbrida BM25 (SQLite FTS5) + embeddings bge-m3 fusionados por RRF sobre 3.267 artículos y 971 autos supremos.',
        'El modelo solo elige claves de las fuentes mostradas; el texto citado lo inserta el sistema → cero citas inventadas.',
        'Anonimización de datos personales antes de enviar texto a cualquier LLM; proveedores locales (Ollama) y gratuitos con failover.',
        'Progreso en vivo por SSE, comparación entre versiones del contrato e informe exportable a DOCX/PDF.',
        'Frontend en Next.js 16 + React 19 con visor PDF y cláusulas resaltadas por nivel de riesgo.',
      ],
      en: [
        'Hybrid search: BM25 (SQLite FTS5) + bge-m3 embeddings fused with RRF over 3,267 articles and 971 supreme court rulings.',
        'The model only picks keys from the sources shown; the quoted text is inserted by the system → zero hallucinated citations.',
        'Personal data is anonymized before any text reaches an LLM; local (Ollama) and free providers with automatic failover.',
        'Live progress via SSE, contract version diffing and DOCX/PDF report export.',
        'Next.js 16 + React 19 frontend with a PDF viewer and clauses highlighted by risk level.',
      ],
    },
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Python', 'FastAPI', 'SQLite FTS5', 'Ollama', 'RAG', 'SSE'],
    accent: '#c8ff2e',
    featured: true,
    cv: true,
    confidential: true,
  },
  {
    slug: 'carx',
    name: 'CarX',
    year: '2023 – 2026',
    kind: { es: 'Cliente · WANT Digital Agency', en: 'Client · WANT Digital Agency' },
    tagline: {
      es: 'SaaS de gestión para talleres mecánicos (antes Vulcano).',
      en: 'Management SaaS for auto repair shops (formerly Vulcano).',
    },
    problem: {
      es: 'Los talleres llevan órdenes, citas y vehículos en cuadernos y chats. CarX centraliza la operación: recepción, órdenes de servicio, agenda, mecánicos y asesores, cada uno con su propio panel.',
      en: 'Repair shops track orders, appointments and vehicles in notebooks and chats. CarX centralizes operations: intake, service orders, scheduling, mechanics and service advisors, each with their own dashboard.',
    },
    role: { es: 'Desarrollo frontend completo.', en: 'Full frontend development.' },
    highlights: {
      es: [
        'Dashboards por rol (asesor de servicio, mecánico, administrador).',
        'Agenda de citas con disponibilidad por fecha y búsqueda de vehículos.',
        'Seguimiento de órdenes por estado con historial de servicios.',
      ],
      en: [
        'Role-based dashboards (service advisor, mechanic, admin).',
        'Appointment scheduling with per-date availability and vehicle search.',
        'Order tracking by status with service history logs.',
      ],
    },
    stack: ['React', 'TypeScript', 'REST APIs'], // TODO(confirmar) stack exacto
    accent: '#ff6a3d',
    featured: true,
    cv: true,
    confidential: true,
  },
  {
    slug: 'agua-potable',
    name: "Agua Link'u",
    year: '2026',
    kind: { es: 'Proyecto comunitario', en: 'Community project' },
    tagline: {
      es: 'App de escritorio offline-first para cobrar el agua potable de una comunidad.',
      en: 'Offline-first desktop app for a rural community\'s water billing.',
    },
    problem: {
      es: "La comunidad Link'u (Sipe Sipe, Cochabamba) registraba lecturas de medidores a mano y sin respaldo. La app funciona 100% sin internet, emite boletas y respalda los datos cifrados en la nube.",
      en: "The Link'u community (Sipe Sipe, Cochabamba) logged water meter readings by hand with no backups. The app works 100% offline, prints bills and backs up encrypted data to the cloud.",
    },
    role: { es: 'Análisis, diseño y desarrollo completo.', en: 'Analysis, design and full development.' },
    highlights: {
      es: [
        'SQLite local como fuente de verdad; Electron + React con IPC.',
        'Respaldo automático cifrado con AES-256-GCM en Firebase Storage, con restauración manual.',
        'Boletas en PDF (doble copia) y captura con cámara.',
      ],
      en: [
        'Local SQLite as source of truth; Electron + React over IPC.',
        'Automatic AES-256-GCM encrypted backups to Firebase Storage, with manual restore.',
        'PDF bills (duplicate copy) and webcam capture.',
      ],
    },
    stack: ['Electron', 'React', 'SQLite', 'Firebase', 'Node.js', 'jsPDF'],
    accent: '#3db8ff',
    featured: true,
    cv: true,
  },
  {
    slug: 'onelife',
    name: 'One Life Fitness',
    year: '2023', // TODO(confirmar)
    kind: { es: 'Cliente · WANT Digital Agency', en: 'Client · WANT Digital Agency' },
    tagline: { es: 'App móvil para socios de gimnasio.', en: 'Mobile app for gym members.' },
    problem: {
      es: 'Cadena de gimnasios con sedes en Cochabamba y La Paz que necesitaba una app para sus socios.',
      en: 'Gym chain in Cochabamba and La Paz that needed an app for its members.',
    },
    role: { es: 'Desarrollo de la app en React Native.', en: 'React Native app development.' },
    highlights: { es: ['TODO(confirmar): funcionalidades principales.'], en: ['TODO: main features.'] },
    stack: ['React Native', 'TypeScript'],
    accent: '#ffd23d',
    featured: true,
    cv: false,
    confidential: true,
  },
  {
    slug: 'onehand',
    name: 'OneHand',
    year: '2024', // TODO(confirmar)
    kind: { es: 'Cliente · WANT Digital Agency', en: 'Client · WANT Digital Agency' },
    tagline: { es: 'Gestión de citas para un centro de fisioterapia.', en: 'Appointment management for a physiotherapy center.' },
    problem: {
      es: 'Un centro de fisioterapia necesitaba ordenar sus citas y pacientes.',
      en: 'A physiotherapy center needed to organize its appointments and patients.',
    },
    role: { es: 'Desarrollo frontend / móvil.', en: 'Frontend / mobile development.' },
    highlights: { es: ['TODO(confirmar): funcionalidades principales.'], en: ['TODO: main features.'] },
    stack: ['React Native', 'React'],
    accent: '#b58cff',
    featured: false,
    cv: false,
    confidential: true,
  },
  {
    slug: 'adsie',
    name: 'Adsie',
    year: '2024', // TODO(confirmar)
    kind: { es: 'Cliente · WANT Digital Agency', en: 'Client · WANT Digital Agency' },
    tagline: { es: 'Marketplace de campañas entre marcas e influencers.', en: 'Brand ↔ influencer campaign marketplace.' },
    problem: {
      es: 'Conecta empresas con influencers por ciudad: campañas, gigs, órdenes, contratos generados con IA y pagos con QR.',
      en: 'Connects companies with influencers by city: campaigns, gigs, orders, AI-generated contracts and QR payments.',
    },
    role: { es: 'Desarrollo frontend.', en: 'Frontend development.' }, // TODO(confirmar)
    highlights: {
      es: ['Flujo de campañas y postulaciones', 'Contratos generados con Gemini', 'Pagos con QR (BNB)'],
      en: ['Campaign and application flow', 'Gemini-generated contracts', 'QR payments (BNB)'],
    },
    stack: ['React', 'React Native', 'Gemini API'],
    accent: '#ff3d8b',
    featured: false,
    cv: false,
    confidential: true,
  },
  {
    slug: 'blessd',
    name: 'Blessd',
    year: '2022',
    kind: { es: 'Cliente · WANT Digital Agency', en: 'Client · WANT Digital Agency' },
    tagline: { es: 'Red social para iglesias.', en: 'Social network for churches.' },
    problem: {
      es: 'Red social para comunidades de iglesias. El producto no llegó a lanzarse.',
      en: 'Social network for church communities. The product was never launched.',
    },
    role: { es: 'Desarrollo frontend.', en: 'Frontend development.' },
    highlights: { es: ['Mi primer proyecto en la agencia.'], en: ['My first project at the agency.'] },
    stack: ['React Native'],
    accent: '#ffffff',
    featured: false,
    cv: false,
    confidential: true,
  },
  {
    slug: 'capadocia',
    name: 'Condominio Capadocia',
    year: '2025',
    kind: { es: 'Freelance', en: 'Freelance' },
    tagline: { es: 'Reservas de áreas comunes para un condominio.', en: 'Common-area booking for a condominium.' },
    problem: {
      es: 'Inquilinos, administradores y guardias reservando áreas comunes por WhatsApp. Plataforma con calendario y tres roles.',
      en: 'Tenants, admins and guards booking common areas over WhatsApp. A platform with a calendar and three roles.',
    },
    role: { es: 'Desarrollo fullstack.', en: 'Fullstack development.' },
    highlights: {
      es: ['Roles: inquilino, administrador, guardia', 'Calendario interactivo (FullCalendar)', 'Sistema de diseño propio sin librerías de UI', 'Exportación a Excel'],
      en: ['Roles: tenant, admin, guard', 'Interactive calendar (FullCalendar)', 'Custom design system, no UI libraries', 'Excel export'],
    },
    stack: ['React', 'TypeScript', 'Vite', 'Firebase', 'Cloud Functions'],
    accent: '#e8c39e',
    featured: true,
    cv: true,
  },
  {
    slug: 'eko',
    name: 'EKO',
    year: '2025',
    kind: { es: 'Proyecto propio', en: 'Personal project' },
    tagline: { es: 'E-commerce con panel de administración.', en: 'E-commerce with admin panel.' },
    problem: {
      es: 'Tienda en línea completa: catálogo, búsqueda difusa, carrito, cupones, órdenes y panel de administración.',
      en: 'Full online store: catalog, fuzzy search, cart, coupons, orders and admin panel.',
    },
    role: { es: 'Desarrollo fullstack.', en: 'Fullstack development.' },
    highlights: {
      es: ['Arquitectura por features', 'Estado global con Redux Toolkit', 'Supabase como backend'],
      en: ['Feature-based architecture', 'Global state with Redux Toolkit', 'Supabase backend'],
    },
    stack: ['React', 'TypeScript', 'Redux Toolkit', 'Supabase', 'MUI', 'Framer Motion'],
    accent: '#5dffb0',
    featured: false,
    cv: false,
  },
  {
    slug: 'ros',
    name: 'rOS',
    year: '2026',
    kind: { es: 'Proyecto personal', en: 'Personal project' },
    tagline: { es: 'Mi propia distro de Linux, basada en Arch.', en: 'My own Arch-based Linux distro.' },
    problem: {
      es: 'TODO(confirmar): qué es rOS, qué la hace distinta, en qué estado está.',
      en: 'TODO: what rOS is, what makes it different, current status.',
    },
    role: { es: 'Todo.', en: 'Everything.' },
    highlights: {
      es: ['Wayland (Hyprland / DankMaterialShell)', 'Dotfiles versionados', 'TODO(confirmar)'],
      en: ['Wayland (Hyprland / DankMaterialShell)', 'Versioned dotfiles', 'TODO'],
    },
    stack: ['Arch Linux', 'Hyprland', 'Shell', 'Kitty'],
    accent: '#8ab4ff',
    featured: true,
    cv: false,
  },
];

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
    title: { es: 'Construir', en: 'Build' },
    body: {
      es: 'Código tipado, componentes reutilizables y atención al detalle: rendimiento, accesibilidad y animación.',
      en: 'Typed code, reusable components and attention to detail: performance, accessibility and motion.',
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
