/**
 * Todas las animaciones del sitio. Se activan con atributos data-*:
 *
 *  data-split          título que entra línea por línea al aparecer
 *  data-reveal         bloque que sube y aparece (data-reveal-delay="0.2")
 *  data-words          párrafo cuyas palabras se "encienden" con el scroll (scrub)
 *  data-horizontal     sección fijada con scroll horizontal (contenedor)
 *    └ data-track      la fila que se desplaza
 *  data-timeline       línea de tiempo con barra de progreso
 *    └ data-progress   barra que crece
 *  data-parallax="0.2" desplazamiento parallax
 *  data-magnetic       botón que "atrae" el cursor
 *  data-count="42"     contador numérico
 *  data-hover          agranda el cursor personalizado
 *  data-layers         foto en capas: parallax por profundidad al hacer scroll + inclinación con el mouse
 *    └ data-layer="0.5"   profundidad de cada capa (0 = quieta, 1 = la que más se mueve)
 *    └ data-layer-outline la capa del contorno: aparece y crece para sobresalir
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;

/* ---------------- Smooth scroll ---------------- */
function initLenis() {
  if (reduced) return null;
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anclas internas con scroll suave
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')!;
      const el = id.length > 1 ? document.querySelector(id) : null;
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -20 });
    });
  });
  return lenis;
}

/* ---------------- Preloader ---------------- */
function initPreloader(): Promise<void> {
  const el = document.querySelector<HTMLElement>('[data-preloader]');
  if (!el) return Promise.resolve();
  const seen = (() => {
    try { return sessionStorage.getItem('preloaded') === '1'; } catch { return false; }
  })();
  if (seen || reduced) {
    el.remove();
    return Promise.resolve();
  }
  try { sessionStorage.setItem('preloaded', '1'); } catch { /* sin storage */ }

  // Terminal que "arranca" el portafolio. Se salta con clic o cualquier tecla.
  const boot = JSON.parse(el.dataset.boot ?? '{}') as { prompt: string; command: string; steps: string[]; done: string };
  const log = el.querySelector<HTMLElement>('[data-boot-log]')!;
  let skipped = false;
  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, skipped ? 0 : ms));
  const esc = (t: string) => t.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);
  let html = '';
  const render = (extra = '') => (log.innerHTML = html + extra + '<span class="boot-caret">█</span>');

  const run = async () => {
    html = `<span class="text-accent">${esc(boot.prompt)}</span> `;
    for (const ch of boot.command) { html += esc(ch); render(); await wait(28); }
    html += '\n'; render(); await wait(180);
    for (const step of boot.steps) {
      html += `<span class="text-muted">[</span> <span class="text-accent">ok</span> <span class="text-muted">]</span> ${esc(step)}\n`;
      render(); await wait(150);
    }
    html += `\n<span class="text-accent">✓</span> ${esc(boot.done)}\n`;
    render(); await wait(420);
  };

  return new Promise((resolve) => {
    const skip = () => { skipped = true; };
    window.addEventListener('keydown', skip, { once: true });
    el.addEventListener('pointerdown', skip, { once: true });
    run().then(() => {
      window.removeEventListener('keydown', skip);
      gsap.to(el, {
        yPercent: -100, duration: skipped ? 0.5 : 0.9, ease: 'expo.inOut',
        onComplete: () => { el.remove(); resolve(); },
      });
    });
  });
}

/* ---------------- Hero intro ---------------- */
function heroIntro(): gsap.core.Timeline | null {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return null;
  const title = hero.querySelector<HTMLElement>('[data-hero-title]');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  if (title) {
    const split = SplitText.create(title, { type: 'chars,lines', linesClass: 'split-line' });
    tl.from(split.chars, { yPercent: 110, rotate: 6, duration: 1.2, stagger: 0.03 });
  }
  tl.from(hero.querySelectorAll('[data-hero-fade]'), { opacity: 0, y: 24, duration: 1, stagger: 0.1 }, '-=0.8');

  // El hero se hunde y se desvanece al hacer scroll
  gsap.to(hero.querySelector('[data-hero-inner]'), {
    yPercent: 25,
    opacity: 0.2,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
  return tl;
}

/* ---------------- Reveals ---------------- */
/** Una tarea por elemento: se ejecutan en pedazos (runChunked) para no congelar el hero. */
function revealTasks(): (() => void)[] {
  const tasks: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => tasks.push(() => {
    const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    gsap.from(split.lines, {
      yPercent: 105,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  }));

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => tasks.push(() => {
    gsap.from(el, {
      y: 48,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      delay: Number(el.dataset.revealDelay ?? 0),
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  }));

  document.querySelectorAll<HTMLElement>('[data-words]').forEach((el) => tasks.push(() => {
    // aria 'hidden': el lector de pantalla lee una copia limpia del párrafo (no se permite aria-label en <p>)
    const split = SplitText.create(el, { type: 'words', aria: 'hidden' });
    gsap.fromTo(
      split.words,
      { opacity: 0.18 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
      },
    );
  }));

  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => tasks.push(() => {
    const target = Number(el.dataset.count);
    if (!el.dataset.count || Number.isNaN(target)) return; // data-count vacío no es un contador
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString(document.documentElement.lang) + (el.dataset.suffix ?? '')),
    });
  }));

  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => tasks.push(() => {
    const amt = Number(el.dataset.parallax || 0.2);
    gsap.to(el, {
      yPercent: -100 * amt,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }));
  return tasks;
}

/* ---------------- Scroll horizontal (proyectos) ---------------- */
function initHorizontal() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px)', () => {
    document.querySelectorAll<HTMLElement>('[data-horizontal]').forEach((section) => {
      const track = section.querySelector<HTMLElement>('[data-track]');
      if (!track) return;
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      // Cada tarjeta gira/escala un poco según su posición
      track.querySelectorAll<HTMLElement>('[data-card]').forEach((card) => {
        gsap.fromTo(
          card.querySelector('[data-card-media]'),
          { scale: 1.15 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
          },
        );
      });
    });
  });
}

/* ---------------- Foto en capas ---------------- */
function initLayers() {
  document.querySelectorAll<HTMLElement>('[data-layers]').forEach((box) => {
    const layers = [...box.querySelectorAll<HTMLElement>('[data-layer]')];
    const outline = box.querySelector<HTMLElement>('[data-layer-outline]');
    // Scroll: cada capa se desplaza según su profundidad; en el centro de la pantalla quedan alineadas
    const tl = gsap.timeline({ scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
    layers.forEach((l) => {
      const d = Number(l.dataset.layer) || 0;
      tl.fromTo(l, { yPercent: 10 * d }, { yPercent: -10 * d, ease: 'none', duration: 1 }, 0);
    });
    // El contorno aparece y crece un poco para sobresalir detrás de la persona
    if (outline) {
      tl.fromTo(outline, { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1.03, ease: 'power2.out', duration: 0.45 }, 0)
        .to(outline, { scale: 1.07, ease: 'none', duration: 0.55 }, 0.45);
    }
    // Mouse: inclinación con profundidad (solo punteros finos)
    if (!finePointer) return;
    const movers = layers.map((l) => {
      const d = Number(l.dataset.layer) || 0;
      return { d, x: gsap.quickTo(l, 'x', { duration: 0.6, ease: 'power3' }), y: gsap.quickTo(l, 'y', { duration: 0.6, ease: 'power3' }) };
    });
    box.addEventListener('pointermove', (e) => {
      const r = box.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      movers.forEach((m) => { m.x(px * 28 * m.d); m.y(py * 20 * m.d); });
    });
    box.addEventListener('pointerleave', () => movers.forEach((m) => { m.x(0); m.y(0); }));
  });
}

/* ---------------- Timeline ---------------- */
function initTimeline() {
  document.querySelectorAll<HTMLElement>('[data-timeline]').forEach((tl) => {
    const bar = tl.querySelector('[data-progress]');
    if (!bar) return;
    gsap.fromTo(
      bar,
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', scrollTrigger: { trigger: tl, start: 'top 70%', end: 'bottom 70%', scrub: true } },
    );
  });
}

/* ---------------- Cursor + magnéticos ---------------- */
function initCursor() {
  if (!finePointer || reduced) return;
  const cursor = document.querySelector<HTMLElement>('[data-cursor]');
  if (!cursor) return;
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { cursor.classList.add('is-active'); xTo(e.clientX); yTo(e.clientY); });
  document.querySelectorAll('a, button, [data-hover]').forEach((el) => {
    el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
  });

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * 0.35);
      y((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    el.addEventListener('pointerleave', () => { x(0); y(0); });
  });
}

/* ---------------- Nav: se oculta al bajar ---------------- */
function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      nav.dataset.scrolled = 'true';
      gsap.to(nav, { yPercent: self.direction === 1 ? -120 : 0, duration: 0.4, ease: 'power3.out' });
    },
    onLeaveBack: () => { nav.dataset.scrolled = 'false'; },
  });
}

/* ---------------- Trabajo en pedazos ---------------- */
const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/** Ejecuta tareas en tandas de ~8 ms, cediendo un frame entre tandas: el navegador sigue animando. */
async function runChunked(tasks: (() => void)[], budget = 8) {
  let start = performance.now();
  for (const task of tasks) {
    task();
    if (performance.now() - start > budget) {
      await nextFrame();
      start = performance.now();
    }
  }
}

/**
 * Espera a que la entrada del nombre termine (o a que el usuario interactúe, o 1,6 s como máximo).
 * Preparar el resto de animaciones durante la entrada congelaba el hero ~300 ms en celulares.
 */
function introSettled(tl: gsap.core.Timeline | null): Promise<void> {
  if (!tl) return Promise.resolve();
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      ['wheel', 'touchstart', 'keydown'].forEach((e) => window.removeEventListener(e, finish));
      resolve();
    };
    ['wheel', 'touchstart', 'keydown'].forEach((e) => window.addEventListener(e, finish, { passive: true, once: true }));
    setTimeout(finish, 1600);
  });
}

/* ---------------- Arranque ---------------- */
export async function initAnimations() {
  // Si hay reduced-motion, se muestra todo sin animar
  initLenis();
  initCursor();
  if (reduced) {
    document.querySelector('[data-preloader]')?.remove();
    return;
  }
  await document.fonts.ready; // SplitText necesita las fuentes cargadas para medir líneas
  await initPreloader();
  const intro = heroIntro();
  initNav();
  await introSettled(intro);
  // El resto de la página se prepara después, en pedazos, sin trabar la entrada del nombre
  await nextFrame();
  initHorizontal();
  initTimeline();
  initLayers();
  await nextFrame();
  await runChunked(revealTasks());
  ScrollTrigger.refresh();
}
