---
title: 'PDFs de tesis: extraer datos con IA sin confiarle todo, y mostrarlos sin comerse la RAM'
description: 'En SGPG, el sistema de proyectos de grado de mi universidad, cada PDF se procesa en el navegador: reglas deterministas donde se puede, un LLM donde conviene y heurísticas de respaldo. Y un visor que dibuja solo las páginas visibles.'
date: 2026-09-21
tags: ['ia', 'llm', 'nextjs', 'rendimiento']
project: 'sgpg'
lang: 'es'
---

**SGPG** es el sistema de gestión de proyectos de grado que hice para la carrera de Ingeniería de Sistemas de la UDABOL. Hoy lo usa la jefatura de carrera. Nació como un prototipo en v0 y lo fui convirtiendo en un producto real (Next.js 16, React 19, Firebase).

Dos problemas se llevaron la mayor parte del trabajo, y los dos tienen que ver con PDFs:

1. **Cargar cientos de tesis sin tipear sus datos a mano.**
2. **Verlas en el navegador sin que la pestaña consuma gigas de RAM.**

## Parte 1: extraer los datos de una tesis

Cuando la jefatura sube un PDF (o una carpeta entera con la carga masiva), el formulario tiene que llenarse solo: título, autor, carrera, año, resumen y palabras clave.

La tentación era mandar el PDF completo a un LLM y pedirle todo. No lo hice, por tres razones: los documentos son largos (tokens = tiempo y cuota), el modelo a veces inventa, y hay campos que se resuelven mejor con reglas. El resultado es un **((pipeline híbrido))** que corre en el navegador:

```ts
export async function extractPdfData(file: File): Promise<PdfExtraction> {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;

  // 1) Texto de las primeras 20 páginas (portada, resumen e introducción están ahí)
  const pageTexts = await textoDePaginas(pdf, Math.min(pdf.numPages, 20));

  // 2) Descartar páginas de índice: mucho ruido y ningún dato útil
  const utiles = pageTexts.filter((t) => !isLikelyTocPage(t));

  // 3) El resumen se extrae con reglas (determinista)
  const abstract = extractAbstractContent(utiles.join(' '));

  // 4) Título, autor, carrera, año y palabras clave: LLM (Groq) con salida JSON
  let datos = await pedirAlModelo(utiles.join(' ')).catch(() => ({}));

  // 5) Lo que el modelo no devolvió, se completa con heurísticas
  datos.title ||= extractTitleFallback(texto);
  datos.career ||= inferCareer(texto);
  datos.year ||= extractYear(texto);
  // …
  return { ...datos, abstract };
}
```

### Detectar la tabla de contenidos

Las páginas de índice arruinan cualquier extracción: están llenas de títulos de sección y números de página. Una heurística simple las detecta con buena precisión:

```ts
function isLikelyTocPage(pageText: string): boolean {
  const items = pageText.split(/\s+/).filter(Boolean);
  if (items.length < 15) return false;

  const puntos = items.filter((i) => i === '.').length;              // "Introducción . . . . . 4"
  const secciones = (pageText.match(/\b\d+\.\d+\b/g) || []).length;  // "1.2", "3.4"
  if ((puntos > 8 && secciones >= 2) || puntos > 15) return true;

  // Si menos del 35 % de los caracteres son letras, es casi seguro un índice
  const letras = pageText.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ]/g, '').length;
  const total = pageText.replace(/\s/g, '').length;
  return total > 80 && letras / total < 0.35;
}
```

### ¿Por qué el resumen no lo extrae la IA?

Porque hay tesis **sin** resumen o con la sección vacía. Un LLM, ante una sección vacía, tiende a "rellenar": toma el primer párrafo que encuentra (muchas veces los antecedentes) y lo devuelve como resumen. Eso es peor que un campo vacío, porque parece correcto.

Así que el resumen se extrae por posición: busco el título "RESUMEN", "ABSTRACT" o "INTRODUCCIÓN" y corto donde empieza la siguiente sección. Un detalle que me costó un bug: los marcadores de corte van **anclados a números de sección** (`1.1 ANTECEDENTES`, `1.2 PLANTEAMIENTO DEL PROBLEMA`…). Sin el número, la palabra "antecedentes" dentro de una oración del resumen cortaba el texto a la mitad.

### El prompt: contexto del dominio y JSON estricto

Para lo que sí va al modelo (Groq, con un modelo abierto de la familia gpt-oss), el prompt le explica cómo es una portada de tesis boliviana: dónde aparece "POSTULANTE:", que la carrera va después de "CARRERA DE…", que el año suele estar junto a "Cochabamba – Bolivia". Y se pide la salida con `response_format: { type: 'json_object' }` y `temperature: 0.1`, para respuestas estables.

Aun así, el parseo es defensivo: si el modelo envuelve el JSON en texto, se busca el primer objeto `{…}`; si nada funciona, se devuelve un objeto vacío y **las heurísticas toman el control**. La carga de una tesis nunca falla porque el modelo haya fallado.

La carrera es un buen ejemplo de "reglas primero": busco el patrón explícito `CARRERA DE INGENIERÍA…`. Buscar la palabra suelta "sistemas" fallaba, porque aparece en cualquier tesis ("…sistemas de control SCADA…").

## Parte 2: un visor que no se come la RAM

La primera versión del visor usaba pdf.js y **renderizaba todas las páginas al abrir**. Con una tesis de 200 páginas eso son 200 canvas en memoria, y el consumo de RAM se disparaba.

La solución tiene dos caminos, según el navegador:

- **Chrome, Edge y Safari** tienen un visor de PDF nativo que ya carga las páginas a demanda. Descargo el archivo, creo una URL `blob:` y lo muestro en un `<iframe>`. Lo importante: **==revocar la URL==** al desmontar el componente con `URL.revokeObjectURL`, o el PDF queda en memoria.
- **Firefox** usa pdf.js, pero con **renderizado perezoso**: solo se dibujan las páginas visibles y se liberan las que salen de la pantalla.

El corazón del renderizado perezoso es un `IntersectionObserver`:

```ts
// Un placeholder por página, con el alto correcto para que el scroll no salte
for (let i = 1; i <= doc.numPages; i++) {
  const ph = document.createElement('div');
  ph.dataset.page = String(i);
  ph.style.aspectRatio = '0.7727'; // hoja carta (612 × 792)
  pages.appendChild(ph);
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      const n = Number((e.target as HTMLElement).dataset.page);
      if (e.isIntersecting) renderPage(n, e.target);   // entra: dibujar
      else clearPage(n, e.target);                      // sale: liberar el canvas
    }
  },
  { root: scroll, rootMargin: '600px 0px' },            // empezar un poco antes de que se vea
);
```

Tres detalles que hacen que funcione bien:

- **Placeholders con proporción real.** Sin ellos, el documento "crece" mientras se dibuja y el scroll salta.
- **`rootMargin: 600px`** empieza a dibujar un poco antes de que la página entre en pantalla: al hacer scroll normal no se ve el blanco.
- **Densidad de píxeles con tope** (`Math.min(devicePixelRatio, 1.5)`): en pantallas 3x, dibujar a resolución completa triplica la memoria sin una diferencia visible en texto.

Y la limpieza al desmontar: `observer.disconnect()`, vaciar el contenedor y `doc.destroy()` para que pdf.js libere su worker. Con esto la memoria queda **acotada a unas pocas páginas**, sin importar si la tesis tiene 30 o 300.

## Lo que aprendí

- **Reglas donde se puede, IA donde conviene.** El LLM resuelve lo ambiguo (el título en una portada desordenada); las reglas resuelven lo que tiene que ser exacto (un resumen que no existe debe quedar vacío).
- **Toda llamada a un modelo necesita un plan B.** Si el modelo falla o devuelve basura, el usuario igual tiene que poder trabajar.
- **Un prototipo generado con IA es un punto de partida.** v0 me dio pantallas en horas; el rendimiento, los permisos y el versionado de documentos los tuve que resolver yo, entendiendo a fondo el código.
- **Probar con documentos reales.** Un PDF de prueba de pocas páginas no muestra un problema de memoria que sí aparece con una tesis completa.
