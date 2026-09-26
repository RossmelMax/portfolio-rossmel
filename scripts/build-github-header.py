"""
Genera docs/github-profile/assets/header.svg: encabezado animado del perfil de GitHub
(logo + nombre + terminal que escribe sola), con las fuentes incrustadas en subset para que
se vea igual en cualquier navegador sin depender de servicios externos.
Uso: python3 scripts/build-github-header.py   (requiere: pip install fonttools brotli)
"""
import base64, io, html
from fontTools import subset
from fontTools.ttLib import TTFont

NM = 'node_modules'
SG = f'{NM}/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2'
JB = f'{NM}/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2'
OUT = 'docs/github-profile/assets/header.svg'

LIME, BG, FG, MUTED = '#c8ff2e', '#0a0a0b', '#ededea', '#8a8a86'
W, H = 1200, 440
CYCLE = 14.0  # segundos por vuelta de la animación

NAME = ['ROSSMEL', 'ABASTO']
ROLE = 'Frontend → Fullstack · IA · Linux'
PROMPT = 'rossmel@rOS:~$'
LINES = [  # (tipo, texto)
    ('cmd', 'whoami'),
    ('out', 'dev frontend → fullstack · cochabamba, bolivia'),
    ('cmd', 'cat stack.txt'),
    ('out', 'react · next.js · react-native · ts · python'),
    ('cmd', './status --now'),
    ('ok', 'último semestre de ing. de sistemas'),
    ('ok', 'disponible para nuevos proyectos'),
]
LOGO = ['M40 1040 520 80v520H360v440h-60V640L100 1040ZM460 320v220H350Z',
        'M560 80l260 520H560ZM620 320v220h110Z',
        'M560 640h280l30 60H620v100h300l120 240H560v-60h390l-60-120H560Z']

def font_b64(path, text, variable_wght=None):
    f = TTFont(path)
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']
    s = subset.Subsetter(opts); s.populate(text=text); s.subset(f)
    if variable_wght and 'fvar' in f:
        from fontTools.varLib import instancer
        f = instancer.instantiateVariableFont(f, {'wght': variable_wght})
    buf = io.BytesIO(); f.flavor = 'woff2'; f.save(buf)
    return base64.b64encode(buf.getvalue()).decode()

mono_text = PROMPT + ''.join(t for _, t in LINES) + ROLE + '[] ok✓█portfolio.rossmel.top'
sg = font_b64(SG, ''.join(NAME) + ROLE, variable_wght=700)
jb = font_b64(JB, mono_text)

# --- terminal: cada línea aparece en orden (clip que crece = efecto de escritura) ---
tx, ty, tw = 600, 140, 560
line_h, char_w, fs = 30, 10.2, 17
t = 0.8
anims = []
for i, (kind, text) in enumerate(LINES):
    y = ty + 58 + i * line_h
    if kind == 'cmd':
        body = (f'<tspan fill="{LIME}">{html.escape(PROMPT)}</tspan> '
                f'<tspan fill="{FG}">{html.escape(text)}</tspan>')
        n = len(PROMPT) + 1 + len(text)
        start_w = (len(PROMPT) + 1) * char_w  # el prompt aparece de golpe, el comando se "escribe"
        dur = 0.06 * len(text)
    elif kind == 'ok':
        body = (f'<tspan fill="{MUTED}">[</tspan><tspan fill="{LIME}"> ok </tspan>'
                f'<tspan fill="{MUTED}">]</tspan> <tspan fill="{FG}">{html.escape(text)}</tspan>')
        n = 7 + len(text); start_w = n * char_w; dur = 0.0
    else:
        body = f'<tspan fill="{MUTED}">{html.escape(text)}</tspan>'
        n = len(text); start_w = n * char_w; dur = 0.0
    full = n * char_w + 4
    t0, t1 = t, t + dur
    k0, k1 = t0 / CYCLE, max(t1, t0 + 0.01) / CYCLE
    kend = 0.94  # todo visible hasta el 94 % del ciclo, luego se reinicia
    anims.append(f'''
    <clipPath id="c{i}"><rect x="{tx + 24}" y="{y - 22}" height="{line_h}" width="0">
      <animate attributeName="width" dur="{CYCLE}s" repeatCount="indefinite" calcMode="linear"
        keyTimes="0;{k0:.4f};{k0 + 0.0001:.4f};{k1:.4f};{kend};1"
        values="0;0;{start_w:.1f};{full:.1f};{full:.1f};0"/>
    </rect></clipPath>
    <text x="{tx + 24}" y="{y}" clip-path="url(#c{i})" class="m">{body}</text>''')
    t = t1 + (0.55 if kind == 'cmd' else 0.25)

caret_y = ty + 58 + len(LINES) * line_h
logo = ''.join(f'<path d="{d}"/>' for d in LOGO)
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="Rossmel Abasto — Frontend → Fullstack · IA">
  <style>
    @font-face {{ font-family: SG; src: url(data:font/woff2;base64,{sg}) format('woff2'); font-weight: 700; }}
    @font-face {{ font-family: JB; src: url(data:font/woff2;base64,{jb}) format('woff2'); }}
    .d {{ font-family: SG, sans-serif; font-weight: 700; }}
    .m {{ font-family: JB, monospace; font-size: {fs}px; font-variant-ligatures: none; }}
    .caret {{ animation: blink 1s steps(1) infinite; }}
    @keyframes blink {{ 50% {{ opacity: 0; }} }}
    .glow {{ animation: breathe 8s ease-in-out infinite alternate; transform-origin: 1000px 60px; }}
    @keyframes breathe {{ from {{ opacity: .75; transform: scale(1); }} to {{ opacity: 1; transform: scale(1.12); }} }}
  </style>
  <defs>
    <radialGradient id="g" cx="1000" cy="60" r="520" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="{LIME}" stop-opacity=".32"/><stop offset="1" stop-color="{LIME}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="{W}" height="{H}" rx="28" fill="{BG}"/>
  <rect class="glow" width="{W}" height="{H}" rx="28" fill="url(#g)"/>
  <rect x=".5" y=".5" width="{W - 1}" height="{H - 1}" rx="28" fill="none" stroke="{FG}" stroke-opacity=".12"/>

  <g transform="translate(56 52) scale(.0556)" fill="{LIME}" fill-rule="evenodd">{logo}</g>
  <text x="56" y="232" class="d" font-size="96" fill="{FG}" letter-spacing="-3">{NAME[0]}</text>
  <text x="56" y="318" class="d" font-size="96" fill="{FG}" letter-spacing="-3">{NAME[1]}</text>
  <text x="58" y="380" class="m" fill="{MUTED}" font-size="18">{html.escape(ROLE)}</text>

  <g>
    <rect x="{tx}" y="{ty - 20}" width="{tw}" height="{len(LINES) * line_h + 96}" rx="16" fill="#121214" stroke="{FG}" stroke-opacity=".12"/>
    <circle cx="{tx + 24}" cy="{ty + 4}" r="6" fill="#ff5f57"/><circle cx="{tx + 44}" cy="{ty + 4}" r="6" fill="#febc2e"/><circle cx="{tx + 64}" cy="{ty + 4}" r="6" fill="#28c840"/>
    <text x="{tx + 86}" y="{ty + 9}" class="m" font-size="13" fill="{MUTED}">rossmel — zsh</text>
    <line x1="{tx}" x2="{tx + tw}" y1="{ty + 24}" y2="{ty + 24}" stroke="{FG}" stroke-opacity=".12"/>
    {''.join(anims)}
    <rect class="caret" x="{tx + 24}" y="{caret_y - 16}" width="10" height="20" fill="{LIME}"/>
  </g>
</svg>
'''
open(OUT, 'w').write(svg)
print('✓', OUT, f'{len(svg) // 1024} KB')
