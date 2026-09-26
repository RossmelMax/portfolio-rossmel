import type { Lang } from './profile';

/** Textos de interfaz (no de contenido). */
export const ui = {
  es: {
    nav: { about: 'Sobre mí', work: 'Proyectos', experience: 'Experiencia', stack: 'Stack', contact: 'Contacto', cv: 'CV' },
    hero: { hello: 'Hola, soy', scroll: 'Desliza', available: 'Disponible para nuevos proyectos' },
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
    },
    project: { problem: 'El problema', role: 'Mi rol', highlights: 'Lo destacado', stack: 'Stack', back: 'Volver', next: 'Siguiente proyecto' },
    footer: 'Hecho con Astro, GSAP y mucho café.',
    langSwitch: 'EN',
  },
  en: {
    nav: { about: 'About', work: 'Work', experience: 'Experience', stack: 'Stack', contact: 'Contact', cv: 'Resume' },
    hero: { hello: "Hi, I'm", scroll: 'Scroll', available: 'Available for new projects' },
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
    },
    project: { problem: 'The problem', role: 'My role', highlights: 'Highlights', stack: 'Stack', back: 'Back', next: 'Next project' },
    footer: 'Built with Astro, GSAP and lots of coffee.',
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
