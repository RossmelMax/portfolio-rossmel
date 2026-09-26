/**
 * Fondo del hero: shader WebGL de "tinta líquida" que reacciona al mouse.
 * Sin dependencias (WebGL1 puro) para no cargar three.js solo por esto.
 */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uAccent;
uniform vec3 uBg;

// Simplex-ish noise (iq)
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash(i)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
  return dot(n, vec3(70.0));
}
float fbm(vec2 p) {
  float f = 0.0;
  float w = 0.5;
  for (int i = 0; i < 5; i++) { f += w * noise(p); p *= 2.0; w *= 0.5; }
  return f;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes.xy) / uRes.y;
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);

  float t = uTime * 0.06;
  vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 3.1));
  vec2 r = vec2(fbm(p * 1.8 + q * 2.0 + vec2(1.7, 9.2) + t * 1.5), fbm(p * 1.8 + q * 2.0 + vec2(8.3, 2.8)));
  float f = fbm(p * 1.2 + r * 1.6);

  float d = length(p - m);
  f += 0.35 * smoothstep(0.55, 0.0, d);

  float ink = smoothstep(0.15, 0.95, f);
  vec3 col = mix(uBg, uAccent, ink * 0.55);
  col = mix(col, uBg, smoothstep(0.35, 1.0, uv.y) * 0.25);
  // viñeta
  col *= 1.0 - 0.45 * length(uv - 0.5);
  gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.trim().replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function mountShader(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) return;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uMouse = gl.getUniformLocation(prog, 'uMouse');
  const uAccent = gl.getUniformLocation(prog, 'uAccent');
  const uBg = gl.getUniformLocation(prog, 'uBg');

  const readColors = () => {
    const cs = getComputedStyle(document.documentElement);
    gl.uniform3fv(uAccent, hexToRgb(cs.getPropertyValue('--accent') || '#c8ff2e'));
    gl.uniform3fv(uBg, hexToRgb(cs.getPropertyValue('--bg') || '#0a0a0b'));
  };
  readColors();
  new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Resolución reducida: el efecto es suave, no necesita píxeles nativos.
  const scale = 0.5;
  const resize = () => {
    canvas.width = Math.max(1, Math.floor(canvas.clientWidth * scale));
    canvas.height = Math.max(1, Math.floor(canvas.clientHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  resize();
  window.addEventListener('resize', resize);

  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  window.addEventListener('pointermove', (e) => {
    mouse.tx = e.clientX / window.innerWidth;
    mouse.ty = 1 - e.clientY / window.innerHeight;
  });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);

  const start = performance.now();
  const frame = (now: number) => {
    if (visible) {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl.uniform1f(uTime, reduced ? 10 : (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    if (!reduced) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
