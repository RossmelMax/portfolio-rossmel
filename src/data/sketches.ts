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
