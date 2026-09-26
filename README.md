# portfolio-rossmel · v3

Portafolio y CV de **Rossmel Abasto**.

- Portafolio → `portfolio.rossmel.top` (animado, ES/EN)
- CV → `cv.rossmel.top` (compatible con ATS, HTML + PDF, ES/EN)

> La v1 (Angular 13, 2022) está en la rama `master`. Esta v3 se construyó desde cero.

---

## Índice

1. [Arranque rápido](#arranque-rápido)
2. [Stack y por qué](#stack-y-por-qué)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Cómo editar el contenido](#cómo-editar-el-contenido)
5. [Animaciones: cómo funcionan](#animaciones-cómo-funcionan)
6. [El CV (ATS)](#el-cv-ats)
7. [Idiomas (ES/EN)](#idiomas-esen)
8. [Despliegue en rossmel.top](#despliegue-en-rossmeltop)
9. [Estado actual y pendientes](#estado-actual-y-pendientes)
10. [Continuar con Claude Code local](#continuar-con-claude-code-local)
11. [Historial de decisiones](#historial-de-decisiones)

---

## Arranque rápido

Requisitos: **Node.js ≥ 22.12** y Chromium (solo para generar el PDF del CV).

```bash
npm install
npm run dev          # http://localhost:4321  (recarga en vivo)
npm run build        # genera el sitio estático en dist/
npm run cv:pdf       # genera los PDF del CV (requiere build previo)
npm run check        # verificación de tipos de Astro/TS
```

Flujo típico para publicar: `npm run build && npm run cv:pdf` → subir `dist/`.

En Arch: `sudo pacman -S nodejs npm chromium`. Si Chromium está en otra ruta:
`CHROMIUM_PATH=/ruta/a/chrome npm run cv:pdf`.

---

## Stack y por qué

| Pieza | Elección | Motivo |
|---|---|---|
| Framework | **Astro 7** | Genera HTML estático: carga rapidísima, buen SEO, cero JS salvo donde hace falta |
| Estilos | **Tailwind CSS v4** (vía `@tailwindcss/vite`) | Tokens en CSS (`src/styles/global.css`), sin archivo de config |
| Animación | **GSAP 3** (ScrollTrigger + SplitText) | El estándar para animaciones al scroll; ahora es 100% gratis, plugins incluidos |
| Smooth scroll | **Lenis** | Scroll suave sincronizado con ScrollTrigger |
| Hero | **Shader WebGL propio** (`src/scripts/shader.ts`) | Efecto "tinta líquida" que sigue el mouse sin cargar three.js |
| Fuentes | Space Grotesk (display), Inter (texto), JetBrains Mono (detalles) | Autoalojadas con `@fontsource` (sin Google Fonts en runtime) |
| Transiciones | View Transitions API (CSS `@view-transition`) | Transición entre páginas sin JS extra |
| PDF del CV | **playwright-core** + Chromium | Imprime la página `/cv` → PDF con texto real (lo leen los ATS) |

No hay React/Vue: todo es Astro + TypeScript. Si algún día se necesita una isla interactiva compleja,
se puede añadir `@astrojs/react`.

---

## Estructura del proyecto

```
src/
  data/
    profile.ts        ← TODO EL CONTENIDO (experiencia, proyectos, skills…) en ES/EN
    i18n.ts           ← textos de la interfaz, rutas por idioma, formato de fechas
  styles/global.css   ← tokens de diseño (colores, fuentes), grano, cursor, marquee
  layouts/Base.astro  ← <head>, SEO, JSON-LD, tema, carga de animaciones
  components/
    Home.astro        ← compone la página principal (se usa en / y /en/)
    Nav, Preloader, Hero, About, Experience, Projects, Stack, Workflow, Contact
    ProjectPage.astro ← plantilla de caso de estudio (/proyectos/<slug>)
    Resume.astro      ← el CV (ATS)
  scripts/
    animations.ts     ← GSAP + Lenis; se activa con atributos data-*
    shader.ts         ← fondo WebGL del hero
  pages/
    index.astro, cv.astro, proyectos/[slug].astro      (ES)
    en/index.astro, en/cv.astro, en/projects/[slug].astro (EN)
public/
  favicon.svg
  cv/Rossmel-Abasto-CV-{ES,EN}.pdf   ← generados por npm run cv:pdf
scripts/
  build-cv-pdf.mjs    ← genera los PDF
  serve-dist.mjs      ← servidor estático mínimo que usa el script anterior
docs/
  PROMPTS-CLAUDE-LOCAL.md   ← prompts para sacar info de la laptop/servidor
  PROYECTOS-CANDIDATOS.md   ← lista filtrada de repos para decidir qué mostrar
CLAUDE.md             ← instrucciones para Claude Code (local o nube)
```

### Rutas generadas

| Ruta | Qué es |
|---|---|
| `/` · `/en/` | Portafolio |
| `/proyectos/<slug>/` · `/en/projects/<slug>/` | Caso de estudio de cada proyecto |
| `/cv/` · `/en/cv/` | CV en HTML (imprimible) |
| `/cv/Rossmel-Abasto-CV-ES.pdf` · `…-EN.pdf` | CV en PDF |

---

## Cómo editar el contenido

**Todo está en `src/data/profile.ts`.** No hace falta tocar componentes para cambiar textos.

- Cada texto traducible es `{ es: '…', en: '…' }`.
- **Experiencia** → array `experience`. `cv: true` = aparece en el CV.
- **Proyectos** → array `projects`:
  - `featured: true` → tarjeta grande en la galería horizontal. `false` → lista de abajo.
  - `cv: true` → aparece en el CV (mantener 3–5 para que quepa en 2 páginas).
  - `confidential: true` → muestra "Código privado".
  - `accent` → color del caso de estudio y de la tarjeta.
  - `links` → demo, repo, Play Store… (opcional).
- **Habilidades** → `skills` (agrupadas; el CV las lista igual → buenas palabras clave para ATS).
- `// TODO(confirmar)` marca datos que Rossmel aún debe confirmar. Buscar con:
  `grep -rn "TODO" src/data`. El CV filtra automáticamente los textos que empiezan con `TODO`.

Para agregar un proyecto: copia un objeto del array `projects`, cambia `slug` (único, en minúsculas,
se usa en la URL) y los textos. La página del caso de estudio se genera sola.

### Imágenes de proyectos (pendiente)
Las tarjetas usan degradados del color `accent`. Para usar capturas reales: agregar un campo
`image` al tipo `Project`, poner los archivos en `src/assets/projects/` y usar `<Image />` de
`astro:assets` dentro de `[data-card-media]` en `Projects.astro` (el zoom al hacer scroll ya
está aplicado a ese elemento).

---

## Animaciones: cómo funcionan

`src/scripts/animations.ts` se carga en todas las páginas (salvo el CV) y activa efectos según
atributos HTML. Para animar algo nuevo, basta con añadir el atributo:

| Atributo | Efecto |
|---|---|
| `data-split` | Título que entra línea por línea (SplitText + máscara) |
| `data-reveal` (+ `data-reveal-delay="0.2"`) | Sube y aparece al entrar en pantalla |
| `data-words` | Párrafo cuyas palabras se "encienden" según el scroll |
| `data-horizontal` + `data-track` | Sección fijada con scroll horizontal (solo ≥768px) |
| `data-card` + `data-card-media` | Zoom del fondo de la tarjeta dentro del scroll horizontal |
| `data-timeline` + `data-progress` | Barra de progreso vertical de la experiencia |
| `data-parallax="0.3"` | Parallax |
| `data-count="42"` (+ `data-suffix="+"`) | Contador numérico |
| `data-magnetic` | Botón magnético (sigue al cursor) |
| `data-hover` | Agranda el cursor personalizado |

Otros detalles:
- **Preloader** (contador 000→100) solo la primera visita de la sesión (`sessionStorage`).
- **Nav** se oculta al bajar y reaparece al subir.
- **Cursor** personalizado solo con mouse (no en táctil).
- **`prefers-reduced-motion`**: se desactivan Lenis, preloader y animaciones; el contenido se
  ve completo y estático. Respetar esto siempre al añadir efectos.
- Tema oscuro por defecto; botón ◐ cambia a claro y se guarda en `localStorage`.

---

## El CV (ATS)

`src/components/Resume.astro` sigue las reglas que usan los lectores automáticos (ATS):

- una sola columna y orden de lectura lineal
- encabezados estándar: Resumen profesional, Habilidades técnicas, Experiencia laboral, Proyectos,
  Educación, Idiomas
- sin tablas, íconos, imágenes, columnas ni texto dentro de gráficos
- fuente estándar (Arial/Helvetica), texto seleccionable; el PDF sale de Chromium con capa de texto
- fechas homogéneas "mes año – mes año"
- flechas y símbolos raros se reemplazan automáticamente (`clean()` en `Resume.astro`)

Regenerar PDFs tras cualquier cambio de contenido: `npm run build && npm run cv:pdf`
(los PDF se guardan en `public/cv/` —se versionan— y en `dist/cv/`).

Consejos de contenido: bullets con **verbo + qué + resultado (con número)**; adaptar el resumen
y el orden de skills a cada oferta; máximo 2 páginas.

---

## Idiomas (ES/EN)

- Español es el idioma por defecto (sin prefijo); inglés vive en `/en/…`.
- Cada página enlaza su versión en el otro idioma (`hreflang` + botón ES/EN).
- Rutas centralizadas en `paths` de `src/data/i18n.ts`.

---

## Despliegue en rossmel.top

El sitio es **100% estático** (`dist/`). Objetivo:

| Subdominio | Sirve |
|---|---|
| `portfolio.rossmel.top` | `dist/` completo |
| `cv.rossmel.top` | la ruta `/cv/` (o redirección a `portfolio.rossmel.top/cv/`) |

⚠️ **Pendiente**: definir la infraestructura con la info del servidor/Tailscale
(ver `docs/PROMPTS-CLAUDE-LOCAL.md`, prompt 1). Opciones previstas:

**A. Caddy en el servidor propio** (recomendado si ya hay Caddy/IP pública o Cloudflare Tunnel):

```caddyfile
portfolio.rossmel.top {
  root * /srv/portfolio/dist
  encode zstd gzip
  file_server
  header /_astro/* Cache-Control "public, max-age=31536000, immutable"
}

cv.rossmel.top {
  root * /srv/portfolio/dist
  encode zstd gzip
  rewrite / /cv/
  file_server
}
```

**B. Cloudflare Tunnel** (si el servidor no tiene IP pública): `cloudflared` apuntando a un
servidor local (Caddy en `:8080`) con dos hostnames públicos.

**C. Hosting estático gestionado** (Cloudflare Pages / Vercel / Netlify) con dominio propio:
build `npm run build`, salida `dist/`, y en el DNS un CNAME por subdominio.

Nota: en la opción A, `cv.rossmel.top/` reescribe a `/cv/`; por eso el enlace "Ver portafolio" del CV
es absoluto (`portfolio.rossmel.top`). Los PDF (`/cv/*.pdf`) y assets (`/_astro/*`) se resuelven igual
en ambos subdominios porque comparten la misma carpeta `dist/`.

`site` en `astro.config.mjs` define el dominio canónico (SEO, OG, sitemap). Cambiarlo si cambia el dominio.

---

## Estado actual y pendientes

✅ Hecho (v3.0, sept. 2026)
- Proyecto nuevo en Astro 7 + Tailwind 4 + GSAP + Lenis
- Home con preloader, hero con shader, sobre mí, timeline de experiencia, galería horizontal de
  proyectos, stack con marquee, "cómo trabajo" (IA), contacto
- Casos de estudio por proyecto, ES/EN, modo claro/oscuro, SEO + JSON-LD
- CV ATS en HTML + PDF (ES/EN) generado desde los mismos datos

⏳ Pendiente
- [ ] Confirmar datos marcados `TODO(confirmar)` (fechas exactas, nivel de inglés, LinkedIn…)
- [ ] Decidir la lista final de proyectos (`docs/PROYECTOS-CANDIDATOS.md`)
- [ ] Info de rOS, homelab e historial de Claude Code (prompt 2)
- [ ] Capturas/imágenes reales de proyectos + imagen OG (`public/og.png`, 1200×630)
- [ ] Despliegue en `portfolio.rossmel.top` y `cv.rossmel.top` (prompt 1)
- [ ] Referencias visuales de Rossmel → ajustar dirección de arte
- [ ] Formulario de contacto real (hoy: mailto + copiar correo). Opción: endpoint propio en el
      servidor o servicio tipo Formspree/Resend
- [ ] Foto profesional (opcional)
- [ ] Probar Lighthouse (meta ≥95) y accesibilidad con teclado

---

## Continuar con Claude Code local

1. `git clone git@github.com:RossmelMax/portfolio-rossmel.git && cd portfolio-rossmel`
2. `git checkout <rama de trabajo>` (ver sección siguiente) y `npm install`
3. Abrir `claude` en la carpeta: lee `CLAUDE.md` automáticamente, que resume convenciones y estado.
4. Pedirle algo como: *"Lee README.md y docs/, y sigue con los pendientes."*

Ramas:
- `master` → v1 (Angular, 2022), solo como archivo histórico.
- `main` → rama por defecto.
- `claude/…` → ramas de trabajo creadas desde sesiones de Claude Code en la nube; se fusionan a `main`.

---

## Historial de decisiones

| Fecha | Decisión |
|---|---|
| 2026-09 | Reescritura total: Angular 13 → Astro 7. Una sola página con scroll narrativo en vez de rutas por sección. |
| 2026-09 | Astro en lugar de Next.js: sitio estático, más liviano, ideal para servirlo desde el servidor propio. |
| 2026-09 | Contenido centralizado en `profile.ts` para que portafolio y CV nunca se desincronicen. |
| 2026-09 | Shader WebGL propio en vez de three.js (≈4 KB vs ≈600 KB). |
| 2026-09 | Dominio propio `rossmel.top` en vez de Vercel. |
