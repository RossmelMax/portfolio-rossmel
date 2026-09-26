# Checklist de revisión exhaustiva (para Claude local con Chrome)

Objetivo: encontrar todo lo que falle, se vea mal o se lea raro en portfolio.rossmel.top,
cv.rossmel.top y el blog, **sin cambiar código**: solo reportar.

## Cómo revisar
- Chrome normal y en incógnito (para ver la terminal de arranque), ventana de escritorio (1440 px y
  1920 px) y emulación móvil (DevTools: iPhone 14 y un Android de 360 px).
- Modo oscuro **y claro** (botón ◐) en cada página.
- Español y English (botón EN/ES) en cada página.

## Qué revisar
1. **Modo claro**: contraste de textos (grises sobre claro), bordes invisibles, el fondo animado
   del hero, tarjetas de proyectos, formulario, terminal de envío, 404 y blog.
2. **Móvil**: nada se sale del ancho (scroll horizontal), textos gigantes cortados, el menú
   "Menú", los botones del hero, la foto, la línea de tiempo, el formulario y el teclado.
3. **Animaciones**: que nada quede invisible/atascado al hacer scroll rápido, al recargar a mitad
   de página o al volver con el botón "atrás"; scroll horizontal de proyectos; cursor y botones
   magnéticos; con "reducir movimiento" activado (DevTools → Rendering → prefers-reduced-motion).
4. **Hero sin WebGL**: chrome://gpu para ver si WebGL está activo; si no, debe verse el fondo de
   respaldo (manchas lima). Reportar qué dice chrome://gpu en "WebGL".
5. **Textos**: faltas de ortografía, frases raras o traducciones literales en ES y EN (casos de
   estudio, "Lo que aprendí", blog, CV). Anotar la frase exacta y la página.
6. **Enlaces**: todos los links internos y externos (GitHub, LinkedIn, eko-store, lynx.com.bo,
   PDFs del CV, RSS del blog, sitemap). Ninguno debe dar 404.
7. **CV**: cv.rossmel.top y /en/cv/ en pantalla y en vista de impresión (Ctrl+P); los PDF ES y EN
   descargan, tienen 2 páginas y el texto se puede seleccionar.
8. **Formulario**: en la home y al final del artículo del blog (el asunto del correo debe
   mencionar el artículo). Probar también un correo inválido y ver el mensaje de error.
9. **Accesibilidad**: navegar toda la home solo con Tab/Shift+Tab/Enter: que se vea el foco,
   que el menú móvil y el diálogo de la terminal se cierren con Escape.
10. **Rendimiento**: Lighthouse (móvil) en /, /cv/, un caso de estudio y el artículo; anotar las
    4 notas y las 3 mejoras principales que sugiere.
11. **Compartir**: pegar portfolio.rossmel.top y el link del artículo en
    https://www.opengraph.xyz/ y revisar la vista previa.
12. **Consola**: errores en la consola de DevTools en cada página.

## Formato del reporte
Una lista agrupada por página, cada ítem con: gravedad (alta/media/baja), qué pasa, dónde
(URL, idioma, tema, dispositivo) y una captura si ayuda. Al final, un top 5 de lo más importante.
