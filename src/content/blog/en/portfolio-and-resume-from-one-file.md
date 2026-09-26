---
title: 'How I built this portfolio: one file for the website, the resume and two languages'
description: 'This site and my PDF resume come from the same data file. Astro, GSAP animations driven by attributes, a WebGL shader with a CSS plan B, a resume that passes ATS filters and a subdomain solved with 10 lines at the edge.'
date: 2026-09-13
tags: ['frontend', 'performance']
lang: 'en'
translationOf: 'portafolio-y-cv-desde-un-solo-archivo'
---

My previous portfolio was from 2022, built in Angular, and it did what most portfolios do: go stale. When the website, the resume and the profile are maintained separately, one of them is always out of date.

For this version I set myself a rule: **==content is written only once==**. This post covers how the site you're reading is built, and the [code is public](https://github.com/rossmelabasto/portfolio-rossmel).

## A single source of truth

All the content (experience, projects, skills, copy) lives in **one TypeScript file**, `src/data/profile.ts`. Every text has both languages side by side:

```ts
export type L = Record<'es' | 'en', string>;

export const projects: Project[] = [
  {
    slug: 'advai',
    name: 'AdvAI',
    tagline: {
      es: 'Auditoría legal de contratos con IA y citas verificables.',
      en: 'AI legal contract auditing with verifiable citations.',
    },
    featured: true,   // shows up on the home page
    cv: true,         // shows up on the resume
    confidential: true, // private code: no link
  },
];
```

That one file produces **the site in Spanish** (`/`), **the site in English** (`/en/`), **the resume in both languages** (`/cv/` and `/en/cv/`) and **the resume PDFs**. Having both languages next to each other makes it almost impossible to forget a translation, and TypeScript complains if one is missing.

A few simple flags control where everything appears: `featured` for the home page, `cv` for the resume (which has to fit on two pages) and `draft` for anything not confirmed yet, which isn't published anywhere.

## A resume read by a person… and a robot

Many companies filter resumes with an **ATS** (Applicant Tracking System) before a person ever sees them. A heavily designed resume, with columns, icons and tables, can come out scrambled or empty on the other side.

That's why the resume is deliberately boring on the inside: **((one column))**, no tables, images or icons, standard headings ("Experience", "Education", "Skills") and a common font. The design is in the typography and spacing, not in decoration.

The PDFs are generated from that same page with **headless Chromium** and Playwright:

```js
const browser = await chromium.launch({ executablePath: findChromium() });
for (const lang of ['es', 'en']) {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}${lang === 'es' ? '/cv/' : '/en/cv/'}`, { waitUntil: 'networkidle' });
  await page.pdf({ path: `public/cv/Rossmel-Abasto-CV-${lang.toUpperCase()}.pdf`, format: 'A4', preferCSSPageSize: true });
}
```

The result is a PDF with **real, selectable text** (not an image), which is exactly what an ATS needs. Since the hosting service can't run Chromium during its build, the PDFs are generated on my machine and committed to the repo.

## Animations driven by attributes

The site has quite a bit of motion: headings that come in line by line, paragraphs that "light up" as you scroll, a horizontal gallery, counters. All with **GSAP** (ScrollTrigger and SplitText) and **Lenis** for smooth scrolling.

To avoid writing JavaScript in every component, animations are enabled with **`data-*` attributes**:

```html
<h2 data-split>Selected work</h2>                  <!-- comes in line by line -->
<p data-words>Reviewing a contract takes hours…</p> <!-- words light up with the scroll -->
<div data-reveal data-reveal-delay="0.2">…</div>   <!-- slides up and fades in -->
<span data-count="1800" data-suffix="+">0</span>    <!-- counter -->
```

A single file, `animations.ts`, looks for those attributes and creates the animations. Components stay clean, and adding motion means adding an attribute.

And most importantly: if the operating system asks for **reduced motion** (`prefers-reduced-motion`), nothing is animated and everything shows up right away. Animations are an extra, never a requirement to read the content.

## A WebGL shader… with a plan B

The home page background is a hand-written **"liquid ink" WebGL shader** (no three.js: it wasn't worth loading a library of hundreds of KB to draw a rectangle). It reacts to the mouse and picks up the current theme's colors.

Three decisions so it doesn't punish anyone:

- **Resolution based on the screen.** The canvas is drawn at a fraction of the real resolution, adjusted by pixel density. On desktop, half is enough (the effect is blurry by nature); on phones, with dense screens and a small canvas, it needs more so it doesn't look pixelated.
- **30 frames per second max**, and it pauses when the hero is off-screen (an `IntersectionObserver`). The motion is slow, so 60 fps would only burn battery.
- **A CSS plan B.** On my own computer, the browser had WebGL disabled because of a graphics driver issue. Since then, `mountShader()` returns `false` if it can't create the context, and the hero shows an animated CSS gradient background instead. Nobody sees a black hole.

```ts
const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
if (!gl) {
  console.info('[hero] WebGL unavailable: using the CSS fallback background.');
  return false;
}
```

## The resume subdomain in 10 lines

I wanted `cv.rossmel.top` to show the resume directly, without a redirect and without a second site. The site runs on **Cloudflare Pages**, so a function at the edge handles the root of that subdomain:

```js
export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  if (url.hostname.startsWith('cv.') && url.pathname === '/') {
    return env.ASSETS.fetch(new URL('/cv/', url)); // serves /cv/ without changing the URL
  }
  return next();
}
```

A `_routes.json` file limits the function to `/` (and the contact form endpoint): the rest of the site is static files that run nothing. One project, one build, two domains.

## Performance: what moved the needle most

- **Inline CSS.** Astro inlines the styles into the HTML (`inlineStylesheets: 'always'`), so the browser doesn't wait for an extra CSS file to paint the first screen.
- **Preloading the two main fonts**, so the heading doesn't "jump" when they load.
- **The preloader only the first time.** The boot terminal shows once per session: a class set on `<html>` before painting keeps it from flashing even for a frame on later visits.
- **Name first, everything else after.** Setting up every animation on the page right as the title animated in froze phones for about 300 ms. Now they're set up after that intro, in ~8 ms chunks, yielding a frame between each one.
- **A static site.** There's no server to respond: pre-generated HTML, served from Cloudflare's network.

## What I learned

- **Writing content once** was the best decision in the project. Updating the resume means changing one line and running one command.
- **Effects need a plan B.** If I hadn't tested on my own machine with broken WebGL, the site would have shown a black background to anyone with the same problem.
- **A "pretty" resume and a resume that works are not the same.** The one that has to pass an automated filter wins by being simple.
- **Animations are not the content.** Respecting `prefers-reduced-motion` is one line of code and changes the experience for a lot of people.
