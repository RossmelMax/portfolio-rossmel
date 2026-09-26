# Perfil de GitHub (repo rossmelabasto/rossmelabasto)

1. Crear el repo **público** `rossmelabasto/rossmelabasto` (mismo nombre que el usuario: GitHub lo muestra
   en el perfil).
2. Copiar a su raíz: `README.md`, `assets/header.svg` y `.github/workflows/` de esta carpeta.
3. En el repo: Settings → Actions → General → Workflow permissions → "Read and write".
4. Actions → correr a mano `snake` (crea la rama `output` con los SVG) y `blog-posts`.
5. Perfil: bio "Frontend → Fullstack · IA · Linux", sitio https://portfolio.rossmel.top,
   ubicación Cochabamba, Bolivia. Fijar (pin) los repos públicos que valgan la pena.

Regenerar el encabezado animado (si cambian textos): en portfolio-rossmel,
`python3 scripts/build-github-header.py` (requiere `pip install fonttools brotli`) y copiar
`docs/github-profile/assets/header.svg` al repo del perfil.
