---
title: 'Thesis PDFs: extracting data with AI without trusting it with everything, and showing them without eating all the RAM'
description: 'In SGPG, my university''s thesis management system, every PDF is processed in the browser: deterministic rules where possible, an LLM where it pays off and heuristic fallbacks. Plus a viewer that only draws the visible pages.'
date: 2026-09-21
tags: ['ai', 'llm', 'nextjs', 'performance']
project: 'sgpg'
lang: 'en'
translationOf: 'pdfs-de-tesis-ia-y-memoria'
---

**SGPG** is the thesis project management system I built for the Systems Engineering program at UDABOL. Today the head of the program uses it. It started as a v0 prototype, and I turned it into a real product (Next.js 16, React 19, Firebase).

Two problems took most of the work, and both involve PDFs:

1. **Loading hundreds of theses without typing their data by hand.**
2. **Viewing them in the browser without the tab eating gigabytes of RAM.**

## Part 1: extracting a thesis's data

When the program office uploads a PDF (or a whole folder with bulk upload), the form has to fill itself in: title, author, program, year, abstract and keywords.

The temptation was to send the whole PDF to an LLM and ask for everything. I didn't, for three reasons: the documents are long (tokens = time and quota), the model sometimes makes things up, and some fields are better solved with rules. The result is a **((hybrid pipeline))** that runs in the browser:

```ts
export async function extractPdfData(file: File): Promise<PdfExtraction> {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;

  // 1) Text from the first 20 pages (cover, abstract and introduction live there)
  const pageTexts = await textoDePaginas(pdf, Math.min(pdf.numPages, 20));

  // 2) Drop table-of-contents pages: lots of noise and no useful data
  const utiles = pageTexts.filter((t) => !isLikelyTocPage(t));

  // 3) The abstract is extracted with rules (deterministic)
  const abstract = extractAbstractContent(utiles.join(' '));

  // 4) Title, author, program, year and keywords: LLM (Groq) with JSON output
  let datos = await pedirAlModelo(utiles.join(' ')).catch(() => ({}));

  // 5) Whatever the model didn't return is filled in with heuristics
  datos.title ||= extractTitleFallback(texto);
  datos.career ||= inferCareer(texto);
  datos.year ||= extractYear(texto);
  // …
  return { ...datos, abstract };
}
```

### Detecting the table of contents

Table-of-contents pages ruin any extraction: they're full of section titles and page numbers. A simple heuristic detects them quite accurately:

```ts
function isLikelyTocPage(pageText: string): boolean {
  const items = pageText.split(/\s+/).filter(Boolean);
  if (items.length < 15) return false;

  const puntos = items.filter((i) => i === '.').length;              // "Introduction . . . . . 4"
  const secciones = (pageText.match(/\b\d+\.\d+\b/g) || []).length;  // "1.2", "3.4"
  if ((puntos > 8 && secciones >= 2) || puntos > 15) return true;

  // If fewer than 35% of the characters are letters, it's almost certainly a TOC
  const letras = pageText.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ]/g, '').length;
  const total = pageText.replace(/\s/g, '').length;
  return total > 80 && letras / total < 0.35;
}
```

### Why doesn't AI extract the abstract?

Because some theses have **no** abstract, or an empty section. Faced with an empty section, an LLM tends to "fill in the gap": it grabs the first paragraph it finds (often the background section) and returns it as the abstract. That's worse than an empty field, because it looks right.

So the abstract is extracted by position: I look for the heading "RESUMEN", "ABSTRACT" or "INTRODUCCIÓN" and cut where the next section starts. A detail that cost me a bug: the cut-off markers are **anchored to section numbers** (`1.1 ANTECEDENTES`, `1.2 PLANTEAMIENTO DEL PROBLEMA`…). Without the number, the word "antecedentes" (background) inside a sentence of the abstract would cut the text in half.

### The prompt: domain context and strict JSON

For what does go to the model (Groq, with an open model from the gpt-oss family), the prompt explains what a Bolivian thesis cover looks like: where "POSTULANTE:" (candidate) appears, that the program comes after "CARRERA DE…", that the year usually sits next to "Cochabamba – Bolivia". The output is requested with `response_format: { type: 'json_object' }` and `temperature: 0.1`, for stable answers.

Even so, parsing is defensive: if the model wraps the JSON in text, it looks for the first `{…}` object; if nothing works, it returns an empty object and **the heuristics take over**. Uploading a thesis never fails because the model failed.

The program field is a good example of "rules first": I look for the explicit pattern `CARRERA DE INGENIERÍA…`. Searching for the bare word "sistemas" failed, because it shows up in any thesis ("…SCADA control systems…").

## Part 2: a viewer that doesn't eat the RAM

The first version of the viewer used pdf.js and **rendered every page on open**. With a 200-page thesis that's 200 canvases in memory, and RAM usage went through the roof.

The solution takes two paths, depending on the browser:

- **Chrome, Edge and Safari** have a native PDF viewer that already loads pages on demand. I download the file, create a `blob:` URL and show it in an `<iframe>`. The important part: **==revoke the URL==** with `URL.revokeObjectURL` when the component unmounts, or the PDF stays in memory.
- **Firefox** uses pdf.js, but with **lazy rendering**: only the visible pages are drawn, and the ones that leave the screen are released.

The heart of lazy rendering is an `IntersectionObserver`:

```ts
// One placeholder per page, with the right height so the scroll doesn't jump
for (let i = 1; i <= doc.numPages; i++) {
  const ph = document.createElement('div');
  ph.dataset.page = String(i);
  ph.style.aspectRatio = '0.7727'; // US Letter page (612 × 792)
  pages.appendChild(ph);
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      const n = Number((e.target as HTMLElement).dataset.page);
      if (e.isIntersecting) renderPage(n, e.target);   // enters: draw
      else clearPage(n, e.target);                      // leaves: free the canvas
    }
  },
  { root: scroll, rootMargin: '600px 0px' },            // start a bit before it's visible
);
```

Three details that make it work well:

- **Placeholders with the real aspect ratio.** Without them, the document "grows" while it's drawn and the scroll jumps.
- **`rootMargin: 600px`** starts drawing a bit before the page enters the screen: with normal scrolling you never see a blank page.
- **Capped pixel density** (`Math.min(devicePixelRatio, 1.5)`): on 3x screens, drawing at full resolution triples memory use with no visible difference for text.

And the cleanup on unmount: `observer.disconnect()`, empty the container and `doc.destroy()` so pdf.js releases its worker. With this, memory stays **bounded to a few pages**, whether the thesis has 30 pages or 300.

## What I learned

- **Rules where you can, AI where it pays off.** The LLM handles the ambiguous parts (the title on a messy cover); rules handle what must be exact (an abstract that doesn't exist must stay empty).
- **Every model call needs a plan B.** If the model fails or returns garbage, the user still has to be able to work.
- **An AI-generated prototype is a starting point.** v0 gave me screens in hours; performance, permissions and document versioning were mine to solve, with a deep understanding of the code.
- **Test with real documents.** A test PDF with a few pages won't show a memory problem that does appear with a full thesis.
