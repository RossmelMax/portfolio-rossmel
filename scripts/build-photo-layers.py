#!/usr/bin/env python3
"""
Genera las capas de la foto del "Sobre mí" a partir de src/assets/rossmel.jpg
(foto con fondo negro y contorno lima alrededor de la persona):

  src/assets/rossmel-person.png   persona recortada, fondo transparente (sin reflejos verdes)
  src/assets/rossmel-outline.png  silueta un poco más grande: se pinta con el color de acento (CSS mask)

Ambas son 30 % más altas que la foto (la polera se alarga hacia abajo) para que al moverse
con el parallax nunca se vea el corte inferior.

Uso:  pip install pillow numpy scipy && python3 scripts/build-photo-layers.py
Si cambias de foto, tiene que seguir teniendo fondo oscuro y un contorno de color lima.
"""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

SRC = 'src/assets/rossmel.jpg'
EXT = 0.3          # alargue inferior (30 %)
GROW = 18          # cuánto más grande es el contorno que el original (px sobre 2048)

a = np.asarray(Image.open(SRC).convert('RGB')).astype(np.float32)
R, G, B = a[..., 0], a[..., 1], a[..., 2]

# 1) Contorno lima y silueta: el fondo es lo no-verde conectado al borde superior/lateral
green = (G > 150) & (R > 90) & (B < 110) & (G - B > 90) & (G > R)
green = ndi.binary_opening(green, iterations=1)
lab, _ = ndi.label(~ndi.binary_dilation(green, iterations=2))
edge = set(np.unique(lab[0, :])) | set(np.unique(lab[: lab.shape[0] // 2, 0])) | set(np.unique(lab[: lab.shape[0] // 2, -1]))
edge.discard(0)
sil = ndi.binary_fill_holes(~np.isin(lab, list(edge)))

# 2) Persona = silueta sin el verde (también el verde entre los rizos)
soft_green = (G > 110) & (G - B > 60) & (G > R + 5)
person = sil & ~ndi.binary_dilation(green | soft_green, iterations=2)
person = ndi.binary_opening(person, iterations=2)
lab, n = ndi.label(person)
sizes = ndi.sum(person, lab, range(1, n + 1))
person = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 400])

# 3) Quitar el tinte verde del pelo cerca del contorno y desvanecer los bordes más verdes
near = ndi.binary_dilation(green | soft_green, iterations=36) & person
greenness = np.clip((G - np.maximum(R, B)) / 70.0, 0, 1)
tint = near & (G > B + 8) & (G >= R)
m = np.minimum(np.minimum(R, G), B)
rgb = np.stack([np.where(tint, m * 1.02, R), np.where(tint, m * 0.97, G), np.where(tint, m, B)], -1)
alpha = np.asarray(Image.fromarray((person * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)
alpha *= np.where(near, 1 - greenness * 0.9, 1)
rgba = np.dstack([rgb, alpha]).clip(0, 255)

# 4) Alargar hacia abajo: la polera continúa con su color liso (sin rayas)
h = rgba.shape[0]
add = int(h * EXT)
band = rgba[-40:]
flat = np.median(band[..., :3][band[..., 3] > 200], axis=0)
last = rgba[-1]
rows = []
for i in range(add):
    t = min(1.0, i / 60.0)
    row = last.copy()
    row[:, :3] = last[:, :3] * (1 - t) + flat * t
    rows.append(row)
person_img = Image.fromarray(np.concatenate([rgba, np.stack(rows)], 0).astype(np.uint8))
person_img.resize((1400, int(1400 * (1 + EXT))), Image.LANCZOS).save('src/assets/rossmel-person.png', optimize=True)

# 5) Silueta del contorno (más grande), alargada igual, como máscara alfa
big = ndi.binary_dilation(sil, iterations=GROW)
big = np.concatenate([big, np.repeat(big[-1:], add, 0)], 0)
mask = Image.fromarray((big * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5))
mask = mask.resize((800, int(800 * (1 + EXT))), Image.LANCZOS)
out = Image.new('RGBA', mask.size, (255, 255, 255, 0))
out.putalpha(mask)
out.save('src/assets/rossmel-outline.png', optimize=True)
print('ok: src/assets/rossmel-person.png, src/assets/rossmel-outline.png')
