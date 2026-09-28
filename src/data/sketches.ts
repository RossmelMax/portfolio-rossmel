/**
 * Dibujos "a mano" (fine line) generados con rough.js al construir el sitio: en el navegador solo
 * llegan <path> de SVG, sin JavaScript extra. Cada dibujo tiene una semilla fija para que el trazo sea
 * siempre el mismo entre builds. Se usan con <Sketch name="…" /> y se dibujan solos al hacer scroll
 * (`data-draw` en animations.ts).
 *
 * Para agregar uno: un viewBox y una función que devuelve formas de rough.js
 * (line, linearPath, curve, circle, ellipse, arc, rectangle, polygon, path).
 */
import rough from 'roughjs';

type Gen = ReturnType<typeof rough.generator>;
type Drawable = ReturnType<Gen['line']>;
type Opts = Parameters<Gen['line']>[4];

export type SketchDef = {
  viewBox: string;
  /** true = se estira al tamaño del contenedor (anotaciones: círculos y subrayados) */
  stretch?: boolean;
  shapes: (g: Gen, o: Opts) => Drawable[];
};

const P = Math.PI;

export const sketches = {
  /* ---------- Cómo trabajo ---------- */
  understand: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [g.circle(42, 42, 50, o), g.line(60, 60, 88, 88, o), g.line(64, 58, 90, 84, { ...o, seed: 11 })],
  },
  design: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.polygon([[14, 86], [14, 18], [82, 86]], o),
      g.polygon([[27, 74], [27, 50], [51, 74]], { ...o, seed: 5 }),
      g.linearPath([[14, 32], [22, 32]], o),
      g.linearPath([[14, 46], [20, 46]], o),
      g.linearPath([[62, 12], [90, 40], [84, 46], [56, 18], [62, 12]], o),
    ],
  },
  build: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.linearPath([[34, 24], [10, 50], [34, 76]], o),
      g.linearPath([[66, 24], [90, 50], [66, 76]], o),
      g.line(58, 16, 42, 84, o),
    ],
  },
  measure: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.linearPath([[12, 10], [12, 88], [92, 88]], o),
      g.linearPath([[20, 72], [40, 56], [56, 64], [82, 28]], o),
      g.linearPath([[68, 28], [82, 28], [82, 42]], o),
    ],
  },
  ship: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.path('M50 8 C66 24 69 50 62 70 L38 70 C31 50 34 24 50 8 Z', o),
      g.circle(50, 38, 14, o),
      g.path('M38 56 L25 76 L39 71', o),
      g.path('M62 56 L75 76 L61 71', o),
      g.path('M44 75 Q50 94 56 75', o),
    ],
  },

  /* ---------- Mi historia ---------- */
  laptop: {
    viewBox: '0 0 110 100',
    shapes: (g, o) => [
      g.rectangle(8, 22, 58, 38, o),
      g.linearPath([[2, 68], [72, 68]], o),
      g.linearPath([[8, 60], [2, 68]], o),
      g.linearPath([[66, 60], [72, 68]], o),
      g.linearPath([[22, 34], [32, 40], [22, 46]], o),
      g.line(36, 47, 48, 47, o),
      g.path('M78 48 L82 80 L98 80 L102 48 Z', o),
      g.arc(102, 62, 12, 16, -P / 2, P / 2, false, o),
      g.curve([[86, 42], [82, 34], [88, 26], [84, 18]], o),
      g.curve([[95, 42], [91, 34], [97, 26], [93, 18]], { ...o, seed: 9 }),
    ],
  },
  linux: {
    viewBox: '0 0 200 100',
    shapes: (g, o) => [
      // Tux
      g.ellipse(50, 58, 54, 72, o),
      g.ellipse(50, 66, 32, 46, { ...o, seed: 4 }),
      g.circle(42, 36, 7, o),
      g.circle(58, 36, 7, o),
      g.path('M42 46 Q50 53 58 46 Q50 41 42 46 Z', o),
      g.curve([[25, 50], [16, 66], [24, 80]], o),
      g.curve([[75, 50], [84, 66], [76, 80]], o),
      g.ellipse(38, 94, 20, 7, o),
      g.ellipse(62, 94, 20, 7, o),
      // Arch
      g.path('M150 8 C141 34 131 58 108 94 C126 81 139 76 150 76 C161 76 174 81 192 94 C169 58 159 34 150 8 Z', o),
      g.path('M132 86 C138 70 144 60 150 60 C156 60 162 70 168 86', o),
    ],
  },
  work: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.rectangle(10, 34, 80, 52, o),
      g.path('M37 34 L37 22 L63 22 L63 34', o),
      g.line(10, 57, 90, 57, o),
      g.rectangle(44, 52, 12, 10, o),
    ],
  },
  spark: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.path('M46 10 Q50 46 88 52 Q50 58 46 94 Q42 58 6 52 Q42 46 46 10 Z', o),
      g.path('M82 8 Q83 18 92 19 Q83 20 82 30 Q81 20 72 19 Q81 18 82 8 Z', o),
    ],
  },
  homelab: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.linearPath([[6, 48], [50, 10], [94, 48]], o),
      g.rectangle(18, 44, 64, 48, o),
      g.rectangle(36, 56, 28, 30, o),
      g.line(41, 64, 59, 64, o),
      g.line(41, 72, 59, 72, o),
      g.circle(55, 80, 4, o),
    ],
  },

  /* ---------- Stack ---------- */
  browser: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.rectangle(8, 16, 84, 68, o),
      g.line(8, 32, 92, 32, o),
      g.circle(17, 24, 5, o),
      g.circle(27, 24, 5, o),
      g.linearPath([[22, 48], [44, 48]], o),
      g.linearPath([[22, 58], [70, 58]], o),
      g.linearPath([[22, 68], [58, 68]], o),
    ],
  },
  database: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.ellipse(50, 20, 64, 18, o),
      g.line(18, 20, 18, 80, o),
      g.line(82, 20, 82, 80, o),
      g.arc(50, 40, 64, 18, 0, P, false, o),
      g.arc(50, 60, 64, 18, 0, P, false, o),
      g.arc(50, 80, 64, 18, 0, P, false, o),
    ],
  },
  terminal: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.rectangle(8, 18, 84, 64, o),
      g.linearPath([[22, 40], [34, 50], [22, 60]], o),
      g.line(40, 62, 60, 62, o),
    ],
  },

  /* ---------- Home: acompañar el scroll ---------- */
  waves: {
    viewBox: '0 0 100 60',
    shapes: (g, o) => [
      g.circle(50, 30, 8, o),
      g.arc(50, 30, 30, 30, -P * 0.3, P * 0.3, false, o),
      g.arc(50, 30, 30, 30, P * 0.7, P * 1.3, false, o),
      g.arc(50, 30, 54, 50, -P * 0.3, P * 0.3, false, o),
      g.arc(50, 30, 54, 50, P * 0.7, P * 1.3, false, o),
    ],
  },
  swipe: {
    viewBox: '0 0 160 60',
    shapes: (g, o) => [g.curve([[6, 40], [50, 52], [100, 44], [148, 22]], o), g.linearPath([[128, 16], [150, 20], [140, 40]], o)],
  },
  scribble: {
    viewBox: '0 0 400 30',
    stretch: true,
    shapes: (g, o) => [g.curve([[4, 18], [80, 10], [160, 20], [240, 9], [320, 18], [396, 8]], o)],
  },
  flight: {
    viewBox: '0 0 400 260',
    shapes: (g, o) => [
      // estela punteada del avión (tramos cortos para que parezca discontinua)
      ...[[[10, 250], [40, 222]], [[52, 212], [84, 190]], [[98, 182], [134, 168]], [[150, 162], [186, 158]], [[202, 156], [236, 150]], [[250, 144], [280, 128]], [[292, 118], [312, 96]]]
        .map((seg, i) => g.linearPath(seg as [number, number][], { ...o, seed: 40 + i })),
      // avión de papel
      g.polygon([[318, 88], [394, 20], [340, 96]], o),
      g.polygon([[318, 88], [394, 20], [352, 70]], { ...o, seed: 51 }),
      g.line(340, 96, 352, 70, o),
    ],
  },
  cup: {
    viewBox: '0 0 60 60',
    shapes: (g, o) => [
      g.path('M10 22 L14 52 L38 52 L42 22 Z', o),
      g.arc(42, 34, 14, 16, -P / 2, P / 2, false, o),
      g.curve([[20, 16], [17, 10], [22, 4]], o),
      g.curve([[31, 16], [28, 10], [33, 4]], { ...o, seed: 8 }),
    ],
  },
  hook: {
    viewBox: '0 0 100 80',
    shapes: (g, o) => [g.curve([[92, 8], [60, 10], [30, 30], [14, 66]], o), g.linearPath([[4, 50], [14, 70], [32, 60]], o)],
  },

  /* ---------- Detalles varios ---------- */
  star: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [g.path('M50 8 L61 38 L94 40 L68 60 L77 92 L50 74 L23 92 L32 60 L6 40 L39 38 Z', o)],
  },
  bulb: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.path('M36 64 C22 54 20 30 36 18 C48 9 66 12 72 26 C80 42 72 56 64 64 L64 74 L36 74 Z', o),
      g.line(38, 82, 62, 82, o),
      g.line(42, 90, 58, 90, o),
      g.linearPath([[44, 64], [44, 46], [50, 52], [56, 46], [56, 64]], o),
    ],
  },
  pencil: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.polygon([[22, 70], [70, 22], [82, 34], [34, 82]], o),
      g.linearPath([[22, 70], [14, 88], [34, 82]], o),
      g.line(62, 30, 74, 42, o),
    ],
  },
  question: {
    viewBox: '0 0 100 120',
    shapes: (g, o) => [g.path('M28 36 C28 14 72 10 74 34 C76 52 50 54 50 76', o), g.circle(50, 98, 8, o)],
  },
  up: {
    viewBox: '0 0 60 60',
    shapes: (g, o) => [g.line(30, 46, 30, 14, o), g.linearPath([[18, 26], [30, 13], [42, 26]], o)],
  },
  ring: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [g.circle(50, 50, 88, { ...o, roughness: 0.9 })],
  },

  /* ---------- Un dibujo por proyecto (campo `doodle` en profile.ts) ---------- */
  cube: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => {
      // cubo de Rubik isométrico: 3 caras con su grilla de 3×3
      const L = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      const face = (a: number[], b: number[], c: number[], d: number[], s: number) => {
        const out = [g.polygon([a, b, c, d] as [number, number][], { ...o, seed: s })];
        for (const t of [1 / 3, 2 / 3]) {
          const [p, q] = [L(a, b, t), L(d, c, t)];
          const [r, u] = [L(a, d, t), L(b, c, t)];
          out.push(g.line(p[0], p[1], q[0], q[1], { ...o, seed: s + 1 }), g.line(r[0], r[1], u[0], u[1], { ...o, seed: s + 2 }));
        }
        return out;
      };
      return [
        ...face([50, 8], [88, 28], [50, 48], [12, 28], 3),
        ...face([12, 28], [50, 48], [50, 92], [12, 72], 7),
        ...face([50, 48], [88, 28], [88, 72], [50, 92], 11),
      ];
    },
  },
  notebook: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.rectangle(26, 8, 60, 84, o),
      ...[18, 32, 46, 60, 74].map((y, i) => g.ellipse(26, y, 14, 8, { ...o, seed: 20 + i })),
      ...[26, 38, 50, 62].map((y, i) => g.line(38, y, 76, y, { ...o, seed: 30 + i })),
      g.line(38, 74, 60, 74, o),
    ],
  },
  tv: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.rectangle(8, 28, 84, 56, o),
      g.line(42, 28, 28, 8, o),
      g.line(58, 28, 72, 8, o),
      g.polygon([[42, 44], [42, 70], [64, 57]], o),
      g.line(24, 84, 18, 94, o),
      g.line(76, 84, 82, 94, o),
    ],
  },
  scales: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.line(50, 18, 50, 88, o),
      g.line(30, 90, 70, 90, o),
      g.circle(50, 14, 8, o),
      g.line(12, 26, 88, 26, o),
      g.linearPath([[4, 56], [12, 26], [20, 56]], o),
      g.path('M2 56 Q12 70 22 56 Z', o),
      g.linearPath([[80, 56], [88, 26], [96, 56]], o),
      g.path('M78 56 Q88 70 98 56 Z', o),
    ],
  },
  car: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.path('M6 70 L6 56 L20 50 L32 32 L68 32 L80 50 L94 56 L94 70 Z', o),
      g.path('M36 37 L28 50 L48 50 L48 37 Z', o),
      g.path('M54 37 L54 50 L74 50 L66 37 Z', o),
      g.circle(28, 72, 18, o),
      g.circle(72, 72, 18, o),
    ],
  },
  gradcap: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.polygon([[50, 16], [94, 36], [50, 56], [6, 36]], o),
      g.path('M24 46 L24 66 Q50 82 76 66 L76 46', o),
      g.line(94, 36, 94, 64, o),
      g.circle(94, 68, 7, o),
    ],
  },
  drop: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.path('M50 6 C44 18 18 44 18 64 C18 82 32 94 50 94 C68 94 82 82 82 64 C82 44 56 18 50 6 Z', o),
      g.curve([[32, 62], [33, 74], [44, 82]], o),
    ],
  },
  megaphone: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.path('M10 40 L10 62 L28 62 L70 84 L70 18 L28 40 Z', o),
      g.line(28, 40, 28, 62, o),
      g.path('M32 64 L38 88 L48 88 L44 68', o),
      g.curve([[80, 38], [86, 51], [80, 64]], o),
      g.curve([[88, 28], [96, 51], [88, 74]], { ...o, seed: 9 }),
    ],
  },
  plate: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.circle(52, 52, 58, o),
      g.circle(52, 52, 38, { ...o, seed: 6 }),
      g.line(10, 36, 10, 90, o),
      g.path('M4 12 L4 28 Q10 38 16 28 L16 12', o),
      g.line(10, 12, 10, 28, o),
      g.path('M94 90 L94 12 Q84 28 86 52 L94 52', o),
    ],
  },
  dumbbell: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.line(24, 50, 76, 50, o),
      g.rectangle(6, 30, 10, 40, o),
      g.rectangle(16, 37, 8, 26, o),
      g.rectangle(84, 30, 10, 40, o),
      g.rectangle(76, 37, 8, 26, o),
    ],
  },
  calendar: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.rectangle(12, 20, 76, 70, o),
      g.line(12, 38, 88, 38, o),
      g.line(32, 12, 32, 28, o),
      g.line(68, 12, 68, 28, o),
      g.linearPath([[34, 64], [46, 76], [68, 50]], o),
    ],
  },
  bag: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [g.path('M14 34 L86 34 L80 92 L20 92 Z', o), g.path('M36 44 L36 30 C36 10 64 10 64 30 L64 44', o)],
  },
  heart: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.path('M50 88 C20 66 8 50 8 34 C8 20 18 12 30 12 C40 12 46 18 50 26 C54 18 60 12 70 12 C82 12 92 20 92 34 C92 50 80 66 50 88 Z', o),
    ],
  },
  pin: {
    viewBox: '0 0 100 100',
    shapes: (g, o) => [
      g.path('M50 94 C44 82 20 58 20 38 C20 20 34 8 50 8 C66 8 80 20 80 38 C80 58 56 82 50 94 Z', o),
      g.circle(50, 38, 20, o),
    ],
  },

  /* ---------- Anotaciones ---------- */
  circle: {
    viewBox: '0 0 200 100',
    stretch: true,
    shapes: (g, o) => [g.ellipse(100, 52, 188, 82, { ...o, roughness: 1.6 }), g.arc(100, 50, 196, 90, -P * 0.95, -P * 0.55, false, o)],
  },
  underline: {
    viewBox: '0 0 200 20',
    stretch: true,
    shapes: (g, o) => [g.curve([[2, 12], [60, 7], [130, 14], [198, 6]], o), g.curve([[20, 16], [90, 12], [170, 15]], { ...o, seed: 21 })],
  },
  arrow: {
    viewBox: '0 0 140 120',
    shapes: (g, o) => [g.curve([[132, 10], [96, 18], [56, 52], [24, 100]], o), g.linearPath([[10, 80], [22, 104], [44, 94]], o)],
  },
} satisfies Record<string, SketchDef>;

export type SketchName = keyof typeof sketches;

/** Trazos SVG listos para pintar. */
export function sketchPaths(name: SketchName, seed = 1) {
  const def: SketchDef = sketches[name];
  const g = rough.generator();
  const o: Opts = { roughness: 1.1, bowing: 1.2, stroke: 'currentColor', strokeWidth: 1.4, seed, disableMultiStroke: false };
  return { viewBox: def.viewBox, stretch: !!def.stretch, paths: def.shapes(g, o).flatMap((d) => g.toPaths(d)).map((p) => p.d) };
}

/** Marcas de anotación en textos: ==subrayado== y ((círculo)). */
export const MARK_RE = /(==[^=]+==|\(\([^)]+\)\))/;

/** Texto sin marcas (para CV, meta descripciones, JSON-LD, búsqueda). */
export const stripMarks = (t: string) => t.replace(/==([^=]+)==/g, '$1').replace(/\(\(([^)]+)\)\)/g, '$1');

/** HTML de una anotación (lo usa el plugin de Markdown del blog; el mismo markup que <Marked>). */
export function markHtml(kind: 'underline' | 'circle', text: string, seed: number) {
  const { viewBox, paths } = sketchPaths(kind, seed);
  const svgCls = kind === 'underline'
    ? 'pointer-events-none absolute -bottom-2 left-0 h-3 w-full text-accent'
    : 'pointer-events-none absolute -left-3 -top-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)] text-accent';
  const esc = (x: string) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const d = paths.map((p) => `<path d="${p}" pathLength="1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`).join('');
  return `<span class="relative inline-block whitespace-nowrap text-fg${kind === 'circle' ? ' mx-2' : ''}">${esc(text)}<svg viewBox="${viewBox}" fill="none" aria-hidden="true" class="${svgCls}" data-draw preserveAspectRatio="none">${d}</svg></span>`;
}

/**
 * Estela punteada para los dibujos "en vuelo" (<SketchFlight>): una curva de 400×260 cortada en
 * tramos. `variant` cambia la forma (0 = curva suave, 1 = con rulo, 2 = salto).
 */
export function trailPaths(seed = 1, variant = 0) {
  const curves: [number, number][][] = [
    [[10, 250], [120, 160], [220, 196], [292, 112]],
    [[10, 244], [300, 200], [70, 60], [288, 110]],
    [[10, 200], [70, 20], [200, 270], [290, 112]],
  ];
  const [a, b, c, d] = curves[variant % curves.length];
  const at = (t: number): [number, number] => {
    const m = 1 - t;
    return [0, 1].map((k) => m * m * m * a[k] + 3 * m * m * t * b[k] + 3 * m * t * t * c[k] + t * t * t * d[k]) as [number, number];
  };
  const g = rough.generator();
  const o: Opts = { roughness: 0.8, bowing: 1, stroke: 'currentColor', strokeWidth: 1.4, seed, disableMultiStroke: true };
  const N = 42;
  const out: string[] = [];
  for (let i = 0; i < N; i += 3) {
    const pts = [at(i / N), at((i + 1) / N), at((i + 2) / N)];
    out.push(...g.toPaths(g.curve(pts, { ...o, seed: seed + i })).map((p) => p.d));
  }
  return out;
}
