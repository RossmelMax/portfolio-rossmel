#!/usr/bin/env python3
"""
Genera las capas de la foto del "Sobre mí":

  src/assets/rossmel-person.png   persona recortada (fondo transparente), 28 % más alta que el cuadro
  src/assets/rossmel-outline.png  silueta ampliada tipo sticker: se pinta con el color de acento (CSS mask)

Fuentes (NO se suben al repo por privacidad; pedírselas a Rossmel):
  --white     foto editada con fondo blanco (cuadrada): da el recorte fino del pelo
  --original  foto original del celular: aporta la polera real debajo del cuadro

La original se alinea sola con la editada (correlación sobre la cara), así que pueden tener
tamaños distintos. Uso:
  pip install pillow numpy scipy
  python3 scripts/build-photo-layers.py --white blanco.jpg --original original.jpg
"""
import argparse
import numpy as np
from PIL import Image, ImageOps, ImageFilter
from scipy import ndimage as ndi

ap = argparse.ArgumentParser()
ap.add_argument('--white', required=True)
ap.add_argument('--original', required=True)
ap.add_argument('--align', help='"a,tx,ty" de una corrida anterior (salta la búsqueda, que tarda unos minutos)')
args = ap.parse_args()

N = 1600          # lado del cuadro de trabajo
EXT = 0.28        # alto extra debajo del cuadro (polera real)
RING = 46         # grosor del contorno alrededor de la silueta (px sobre N)

white = ImageOps.exif_transpose(Image.open(args.white)).convert('RGB').resize((N, N), Image.LANCZOS)
orig = ImageOps.exif_transpose(Image.open(args.original)).convert('RGB')

def align():
  # ---- 1) Alinear la original con la editada (escala + desplazamiento, buscando sobre la cara) ----
  # Búsqueda en dos pasos: a 1/4 de resolución por todo el rango y luego fina alrededor del mejor.
  k = 1500 / orig.width
  o_small = np.asarray(orig.resize((1500, round(orig.height * k)), Image.BILINEAR).convert('L')).astype(np.float32)
  face = white.convert('L').crop((480, 650, 1120, 1250))

  def ncc(img, fc, s, x, y):
      cw, ch = int(fc.width * s), int(fc.height * s)
      c = np.asarray(fc.resize((cw, ch), Image.BILINEAR)).astype(np.float32)
      o = img[y:y + ch, x:x + cw]
      if o.shape != c.shape:
          return -1
      return float((((c - c.mean()) / c.std()) * ((o - o.mean()) / o.std())).mean())

  q = 4
  o_q = np.asarray(Image.fromarray(o_small).resize((o_small.shape[1] // q, o_small.shape[0] // q), Image.BILINEAR))
  face_q = face.resize((face.width // q, face.height // q), Image.BILINEAR)
  best = (-1, 1, 0, 0)
  for s in np.arange(0.70, 1.20, 0.01):
      for y in range(0, o_q.shape[0] - int(face_q.height * s), 2):
          for x in range(0, o_q.shape[1] - int(face_q.width * s), 2):
              sc = ncc(o_q, face_q, s, x, y)
              if sc > best[0]:
                  best = (sc, s, x * q, y * q)
  _, s0, x0, y0 = best
  for s in np.arange(s0 - 0.01, s0 + 0.0101, 0.001):
      for y in range(y0 - 10, y0 + 11, 2):
          for x in range(x0 - 10, x0 + 11, 2):
              sc = ncc(o_small, face, s, x, y)
              if sc > best[0]:
                  best = (sc, s, x, y)
  score, s, x, y = best
  print(f'alineación: corr={score:.3f} escala={s:.3f}')
  # white (u,v) -> original (full res) = ((u*s + x - 480*s)/k, (v*s + y - 650*s)/k)
  a_ = s / k
  tx, ty = (x - 480 * s) / k, (y - 650 * s) / k
  print(f'--align "{a_:.6f},{tx:.3f},{ty:.3f}"')
  return a_, tx, ty

a_, tx, ty = map(float, args.align.split(',')) if args.align else align()
H = int(N * (1 + EXT))
orig_al = orig.transform((N, H), Image.AFFINE, (a_, 0, tx, 0, a_, ty), Image.BICUBIC)
O = np.asarray(orig_al).astype(np.float32)

# ---- 2) Alfa fino desde la foto con fondo blanco ----
Wf = np.asarray(white).astype(np.float32)
L = Wf @ np.array([0.299, 0.587, 0.114])
mx, mn = Wf.max(-1), Wf.min(-1)
sat = (mx - mn) / np.maximum(mx, 1)
bgcol = np.median(Wf[:40].reshape(-1, 3), axis=0)
Lbg = float(bgcol @ np.array([0.299, 0.587, 0.114]))
# fondo "duro": claro, poco saturado y conectado con los bordes superior/laterales
bgish = (L > Lbg - 28) & (sat < 0.10)
lab, _ = ndi.label(bgish)
edge = set(np.unique(lab[0])) | set(np.unique(lab[:, 0])) | set(np.unique(lab[:, -1]))
edge.discard(0)
hard = ndi.binary_fill_holes(~np.isin(lab, list(edge)))
hard = ndi.binary_opening(hard, iterations=2)
# parecido al fondo (0..1): claro y sin color → huecos entre rizos y bordes de pelo
# (la edición dejó grises claros alrededor de los rizos: todo lo claro y sin color cuenta como fondo)
b = np.clip((L - 70) / (175 - 70), 0, 1) * (1 - np.clip(sat / 0.16, 0, 1))
band = ndi.binary_dilation(hard, iterations=6)
alpha = np.where(band, 1 - b, 0.0)
# cuerpo interior sólido (evita transparencias en piel clara o brillos)
# en la zona del pelo (arriba de los ojos) los grises no son sólidos: son restos de la edición
yy = np.arange(N)[:, None]
hairzone = np.broadcast_to(yy < int(N * 0.5), (N, N))
core = ndi.binary_erosion(hard, iterations=18) & ~(b > 0.85) & ~(hairzone & (b > 0.3))
alpha = np.where(core, 1.0, alpha)
alpha = ndi.gaussian_filter(alpha, 0.7)
# descontaminar: en los bordes semitransparentes del pelo, el color es el del pelo (sin blanco mezclado)
hair = np.median(Wf[core & (L < 60)].reshape(-1, 3), axis=0)
edge_px = (alpha < 0.97) & ~core
w = np.clip((1 - alpha) * 1.6, 0, 1)[..., None]           # cuanto más transparente, más color de pelo
rgb = np.where(edge_px[..., None], Wf * (1 - w) + hair * w, Wf)
rgb = np.where((edge_px & (L > 90))[..., None], hair, rgb)   # restos claros → pelo
rgb = np.where(alpha[..., None] > 0.02, rgb, 0)

# ---- 3) Debajo del cuadro: la polera real de la original ----
Lo = O @ np.array([0.299, 0.587, 0.114])
shirt = ndi.binary_opening(Lo < 95, iterations=3)
shirt = ndi.binary_fill_holes(shirt)
ext_alpha = ndi.gaussian_filter(shirt.astype(np.float32), 1.0)
full_rgb = np.concatenate([rgb, O[N:]], 0)
full_a = np.concatenate([alpha, ext_alpha[N:]], 0)
# costura: mezclar 40 px antes del borde inferior del cuadro
for i in range(40):
    t = (i + 1) / 41
    r = N - 40 + i
    full_rgb[r] = full_rgb[r] * (1 - t) + O[r] * t
    full_a[r] = full_a[r] * (1 - t) + ext_alpha[r] * t

person = Image.fromarray(np.dstack([full_rgb, full_a * 255]).clip(0, 255).astype(np.uint8), 'RGBA')
person.resize((1400, int(1400 * (1 + EXT))), Image.LANCZOS).save('src/assets/rossmel-person.png', optimize=True)

# ---- 4) Contorno tipo sticker: silueta ampliada y suavizada ----
sil = ndi.binary_fill_holes(full_a > 0.5)
grown = ndi.distance_transform_edt(~sil) <= RING
smooth = ndi.gaussian_filter(grown.astype(np.float32), 9) > 0.5
mask = Image.fromarray((smooth * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
mask = mask.resize((800, int(800 * (1 + EXT))), Image.LANCZOS)
out = Image.new('RGBA', mask.size, (255, 255, 255, 0))
out.putalpha(mask)
out.save('src/assets/rossmel-outline.png', optimize=True)
print('ok: src/assets/rossmel-person.png, src/assets/rossmel-outline.png')
