import type { Lang } from './profile';

/** Textos de interfaz (no de contenido). */
export const ui = {
  es: {
    nav: { about: 'Sobre mí', work: 'Proyectos', experience: 'Experiencia', stack: 'Stack', contact: 'Contacto', cv: 'CV', blog: 'Blog', menu: 'Menú', close: 'Cerrar', theme: 'Cambiar tema' },
    hero: { hello: 'Hola, soy', scroll: 'Desliza', available: 'Disponible para nuevos proyectos', ctaWork: 'Ver proyectos', ctaCv: 'Descargar CV' },
    boot: {
      command: './portfolio --start',
      steps: ['cargando fuentes', 'compilando shaders', 'montando /proyectos ({n})', 'iniciando smooth-scroll'],
      done: 'listo. bienvenido.',
      skip: 'clic o cualquier tecla para saltar',
    },
    about: { kicker: '01 — Sobre mí' },
    experience: { kicker: '02 — Experiencia', present: 'Actualidad' },
    work: { kicker: '03 — Proyectos', title: 'Trabajo seleccionado', view: 'Ver caso', private: 'Código privado' },
    stack: { kicker: '04 — Stack' },
    workflow: { kicker: '05 — Cómo trabajo', title: 'IA como parte del flujo, no como atajo.' },
    contact: {
      kicker: '06 — Contacto',
      title: '¿Construimos algo juntos?',
      copy: 'Copiar correo',
      copied: '¡Copiado!',
      cv: 'Descargar CV',
      formTitle: 'O déjame un mensaje',
      name: 'Nombre',
      email: 'Tu correo',
      message: 'Mensaje',
      send: 'Enviar mensaje',
      sending: 'Enviando…',
      ok: '¡Mensaje enviado! Te respondo pronto.',
      invalid: 'Revisa los campos: nombre, un correo válido y tu mensaje.',
      captcha: 'Completa la verificación antispam e inténtalo de nuevo.',
      error: 'No se pudo enviar. Escríbeme directo a',
      term: {
        title: 'enviar-correo.sh',
        prompt: 'visitante@portfolio:~$',
        validate: 'validando campos',
        send: 'verificando antispam y enviando',
        ok: 'mensaje entregado. te respondo pronto.',
        fail: 'error',
        close: 'Cerrar',
      },
    },
    project: { problem: 'El problema', role: 'Mi rol', highlights: 'Lo destacado', learned: 'Lo que aprendí', stack: 'Stack', back: 'Volver', next: 'Siguiente proyecto' },
    footer: 'Hecho con Astro, GSAP y mucho café.',
    blog: {
      kicker: 'Blog',
      title: 'Notas de lo que construyo',
      intro: 'Documento en público lo que hago: decisiones técnicas, errores y lo que aprendo en el camino.',
      latest: 'Del blog',
      all: 'Ver todos los artículos',
      read: 'min de lectura',
      back: 'Volver al blog',
      commentTitle: '¿Dudas o comentarios sobre este artículo?',
      commentIntro: 'Escríbeme: leo todo y respondo por correo.',
      rss: 'RSS',
    },
    notFound: { title: 'Esta página no existe', body: 'Quizá el enlace cambió o se escribió mal.', home: 'Volver al inicio' },
    langSwitch: 'EN',
  },
  en: {
    nav: { about: 'About', work: 'Work', experience: 'Experience', stack: 'Stack', contact: 'Contact', cv: 'Resume', blog: 'Blog', menu: 'Menu', close: 'Close', theme: 'Toggle theme' },
    hero: { hello: "Hi, I'm", scroll: 'Scroll', available: 'Available for new projects', ctaWork: 'See my work', ctaCv: 'Download resume' },
    boot: {
      command: './portfolio --start',
      steps: ['loading fonts', 'compiling shaders', 'mounting /projects ({n})', 'starting smooth-scroll'],
      done: 'ready. welcome.',
      skip: 'click or press any key to skip',
    },
    about: { kicker: '01 — About' },
    experience: { kicker: '02 — Experience', present: 'Present' },
    work: { kicker: '03 — Work', title: 'Selected work', view: 'View case', private: 'Private code' },
    stack: { kicker: '04 — Stack' },
    workflow: { kicker: '05 — How I work', title: 'AI as part of the workflow, not a shortcut.' },
    contact: {
      kicker: '06 — Contact',
      title: "Let's build something together?",
      copy: 'Copy email',
      copied: 'Copied!',
      cv: 'Download resume',
      formTitle: 'Or leave me a message',
      name: 'Name',
      email: 'Your email',
      message: 'Message',
      send: 'Send message',
      sending: 'Sending…',
      ok: 'Message sent! I\'ll get back to you soon.',
      invalid: 'Please check the fields: name, a valid email and your message.',
      captcha: 'Please complete the anti-spam check and try again.',
      error: 'Couldn\'t send it. Email me directly at',
      term: {
        title: 'send-mail.sh',
        prompt: 'visitor@portfolio:~$',
        validate: 'validating fields',
        send: 'checking anti-spam and sending',
        ok: 'message delivered. I\'ll get back to you soon.',
        fail: 'error',
        close: 'Close',
      },
    },
    project: { problem: 'The problem', role: 'My role', highlights: 'Highlights', learned: 'What I learned', stack: 'Stack', back: 'Back', next: 'Next project' },
    footer: 'Built with Astro, GSAP and lots of coffee.',
    blog: {
      kicker: 'Blog',
      title: 'Notes on what I build',
      intro: 'I document my work in public: technical decisions, mistakes and what I learn along the way. Posts are mostly in Spanish.',
      latest: 'From the blog',
      all: 'See all posts',
      read: 'min read',
      back: 'Back to blog',
      commentTitle: 'Questions or comments about this post?',
      commentIntro: 'Write to me: I read everything and reply by email.',
      rss: 'RSS',
    },
    notFound: { title: 'This page doesn\'t exist', body: 'The link may have changed or been mistyped.', home: 'Back home' },
    langSwitch: 'ES',
  },
} as const;

export const t = (lang: Lang) => ui[lang];

/** Rutas por idioma. ES es el idioma por defecto (sin prefijo). */
export const paths = {
  home: (lang: Lang) => (lang === 'es' ? '/' : '/en/'),
  project: (lang: Lang, slug: string) => (lang === 'es' ? `/proyectos/${slug}/` : `/en/projects/${slug}/`),
  cv: (lang: Lang) => (lang === 'es' ? '/cv/' : '/en/cv/'),
  cvPdf: (lang: Lang) => `/cv/Rossmel-Abasto-CV-${lang.toUpperCase()}.pdf`,
  blog: () => '/blog/',
  post: (slug: string) => `/blog/${slug}/`,
};

const MONTHS = {
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/** "2022-06" → "jun 2022" / "Jun 2022" */
export function fmtMonth(ym: string | null, lang: Lang): string {
  if (!ym) return ui[lang].experience.present;
  const [y, m] = ym.split('-').map(Number);
  return `${MONTHS[lang][m - 1]} ${y}`;
}
