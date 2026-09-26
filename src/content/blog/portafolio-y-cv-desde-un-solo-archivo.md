---
title: 'Cómo hice este portafolio: un solo archivo para la web, el CV y dos idiomas'
description: 'Este sitio y mi CV en PDF salen del mismo archivo de datos. Astro, animaciones con GSAP controladas por atributos, un shader WebGL con plan B en CSS, un CV que pasa filtros ATS y un subdominio resuelto con 10 líneas en el edge.'
date: 2026-09-13
tags: ['frontend', 'rendimiento']
lang: 'es'
---

Mi portafolio anterior era de 2022, en Angular, y hacía lo que hace la mayoría de los portafolios: quedarse viejo. Cuando la web, el CV y el perfil se mantienen por separado, siempre alguno queda desactualizado.

Para esta versión me puse una regla: **==el contenido se escribe una sola vez==**. Este artículo cuenta cómo está hecho el sitio que estás leyendo, y el [código es público](https://github.com/rossmelabasto/portfolio-rossmel).

## Una sola fuente de verdad

Todo el contenido (experiencia, proyectos, habilidades, textos) vive en **un archivo TypeScript**, `src/data/profile.ts`. Cada texto tiene sus dos idiomas juntos:

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
    featured: true,   // aparece en la portada
    cv: true,         // aparece en el CV
    confidential: true, // código privado: no se enlaza
  },
];
```

De ese archivo salen **la web en español** (`/`), **la web en inglés** (`/en/`), **el CV en los dos idiomas** (`/cv/` y `/en/cv/`) y **los PDF** del CV. Tener los dos idiomas lado a lado hace casi imposible olvidarse de traducir algo, y TypeScript avisa si falta uno.

Unas banderas simples controlan dónde aparece cada cosa: `featured` para la portada, `cv` para el CV (que tiene que caber en dos páginas) y `draft` para lo que todavía no está confirmado y no se publica en ningún lado.

## Un CV que lee una persona… y un robot

Muchas empresas filtran los CV con un **ATS** (Applicant Tracking System) antes de que los vea una persona. Un CV muy diseñado, con columnas, íconos y tablas, puede salir desordenado o vacío en ese filtro.

Por eso el CV es deliberadamente aburrido por dentro: **((una columna))**, sin tablas ni imágenes ni íconos, encabezados estándar ("Experiencia", "Educación", "Habilidades") y una fuente común. El diseño está en la tipografía y el espacio, no en adornos.

Los PDF se generan desde esa misma página con **Chromium sin interfaz** y Playwright:

```js
const browser = await chromium.launch({ executablePath: findChromium() });
for (const lang of ['es', 'en']) {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}${lang === 'es' ? '/cv/' : '/en/cv/'}`, { waitUntil: 'networkidle' });
  await page.pdf({ path: `public/cv/Rossmel-Abasto-CV-${lang.toUpperCase()}.pdf`, format: 'A4', preferCSSPageSize: true });
}
```

El resultado es un PDF con **texto real y seleccionable** (no una imagen), que es justo lo que un ATS necesita. Como el servicio de hosting no puede correr Chromium en su build, los PDF se generan en mi máquina y se versionan en el repo.

## Animaciones controladas por atributos

El sitio tiene bastante movimiento: títulos que entran línea por línea, párrafos que se "encienden" con el scroll, una galería horizontal, contadores. Todo con **GSAP** (ScrollTrigger y SplitText) y **Lenis** para el scroll suave.

Para no escribir JavaScript en cada componente, las animaciones se activan con **atributos `data-*`**:

```html
<h2 data-split>Trabajo seleccionado</h2>          <!-- entra línea por línea -->
<p data-words>Revisar un contrato toma horas…</p>  <!-- palabras que se encienden con el scroll -->
<div data-reveal data-reveal-delay="0.2">…</div>   <!-- sube y aparece -->
<span data-count="1800" data-suffix="+">0</span>    <!-- contador -->
```

Un solo archivo, `animations.ts`, busca esos atributos y crea las animaciones. Los componentes quedan limpios y agregar movimiento es agregar un atributo.

Y lo más importante: si el sistema operativo pide **menos movimiento** (`prefers-reduced-motion`), no se anima nada y todo se muestra de entrada. Las animaciones son un extra, nunca una condición para leer el contenido.

## Un shader WebGL… con plan B

El fondo del inicio es un **shader de "tinta líquida"** escrito a mano en WebGL (sin three.js: no valía la pena cargar una librería de cientos de KB para dibujar un rectángulo). Reacciona al mouse y toma los colores del tema actual.

Tres decisiones para que no castigue a nadie:

- **Resolución según la pantalla.** El canvas se dibuja a una fracción de la resolución real, ajustada por la densidad de píxeles. En escritorio, la mitad alcanza (el efecto es borroso por naturaleza); en celulares, con pantallas densas y un canvas chico, hace falta más para que no se vea pixelado.
- **Máximo 30 cuadros por segundo** y pausa cuando el hero no está en pantalla (un `IntersectionObserver`). El movimiento es lento, así que 60 fps solo gastarían batería.
- **Plan B en CSS.** Me pasó que en mi propia computadora el navegador tenía WebGL desactivado por un problema del driver de video. Desde entonces, `mountShader()` devuelve `false` si no puede crear el contexto, y el hero muestra un fondo con gradientes animados en CSS. Nadie ve un hueco negro.

```ts
const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
if (!gl) {
  console.info('[hero] WebGL no disponible: se usa el fondo CSS de respaldo.');
  return false;
}
```

## El subdominio del CV en 10 líneas

Quería que `cv.rossmel.top` mostrara el CV directamente, sin redirigir y sin un segundo sitio. El sitio está en **Cloudflare Pages**, así que una función en el edge resuelve la raíz de ese subdominio:

```js
export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  if (url.hostname.startsWith('cv.') && url.pathname === '/') {
    return env.ASSETS.fetch(new URL('/cv/', url)); // sirve /cv/ sin cambiar la URL
  }
  return next();
}
```

Un archivo `_routes.json` limita la función a `/` (y al endpoint del formulario de contacto): el resto del sitio son archivos estáticos que no ejecutan nada. Un solo proyecto, un solo build y dos dominios.

## Rendimiento: lo que más movió la aguja

- **CSS en línea.** Astro inserta los estilos en el HTML (`inlineStylesheets: 'always'`), así el navegador no espera un archivo CSS extra para pintar la primera pantalla.
- **Precarga de las dos fuentes principales**, para que el título no "salte" cuando cargan.
- **El preloader solo la primera vez.** La terminal de arranque se muestra una vez por sesión: una clase en `<html>` que se pone antes de pintar evita que aparezca aunque sea un cuadro en las visitas siguientes.
- **Primero el nombre, después el resto.** Preparar todas las animaciones de la página justo cuando entra el título trababa los celulares unos 300 ms. Ahora se preparan cuando termina esa entrada y en pedazos de ~8 ms, cediendo un cuadro entre cada uno.
- **Sitio estático.** No hay servidor que responder: HTML ya generado, servido desde la red de Cloudflare.

## Lo que aprendí

- **Escribir el contenido una vez** es la mejor decisión del proyecto. Actualizar el CV es cambiar una línea y correr un comando.
- **Los efectos necesitan un plan B.** Si no hubiera probado en mi propia máquina con WebGL roto, el sitio habría mostrado un fondo negro a quien tuviera el mismo problema.
- **Un CV "bonito" y un CV que funciona no son lo mismo.** El que tiene que pasar un filtro automático gana siendo simple.
- **Las animaciones no son el contenido.** Respetar `prefers-reduced-motion` es una línea de código y le cambia la experiencia a mucha gente.
