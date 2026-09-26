---
title: 'Cómo evité que un LLM invente artículos del Código Civil'
description: 'En AdvAI, mi proyecto de grado, el modelo no escribe las citas legales: solo elige entre fuentes reales y el sistema pone el texto literal. Así pasé de "suena bien" a citas verificables.'
date: 2026-09-15
tags: ['ia', 'llm', 'rag', 'python']
project: 'advai'
lang: 'es'
---

Si le pides a un LLM que revise un contrato y cite la ley, casi siempre te va a responder algo que **suena** perfecto: "según el artículo 519 del Código Civil…". El problema es que a veces ese artículo no dice eso. O no existe.

Para un abogado, una cita inventada es peor que ninguna cita: le hace perder tiempo y, si no la verifica, le puede costar un caso. Ese fue el problema central de **AdvAI**, mi proyecto de grado en la UDABOL: un sistema que analiza contratos frente al Código Civil, el Código de Comercio y la jurisprudencia del Tribunal Supremo de Justicia de Bolivia.

Este artículo cuenta la decisión de diseño que más me enseñó en todo el proyecto.

## Lo que hace AdvAI

El abogado sube un contrato (PDF, DOCX, ODT…). El sistema:

1. Lo separa en cláusulas.
2. Por cada cláusula busca las normas y fallos relevantes.
3. Devuelve un nivel de riesgo, un análisis y **citas literales** que se pueden verificar.
4. Revisa el contrato completo: cláusulas que faltan, contradicciones y cambios entre versiones.

El paso 3 es donde los LLMs fallan si los dejas solos.

## La idea clave: el modelo no escribe la cita

Lo obvio sería pasarle al modelo la cláusula y los artículos recuperados, y pedirle un análisis con citas. El problema es que, aunque las fuentes estén en el prompt, un LLM puede mezclar artículos, cambiar palabras o citar uno que no estaba entre ellas: genera texto, no lo copia.

Ningún prompt garantiza que eso no pase. Lo que sí lo garantiza es **cambiar quién escribe la cita**:

- El sistema recupera las fuentes candidatas y le muestra cada una al modelo con una **clave** corta (por ejemplo, `AS/0039/2018#1` en el caso de la jurisprudencia).
- El modelo responde en JSON con un esquema fijo: su análisis y **solo las claves** de las fuentes que respaldan cada punto.
- El sistema descarta cualquier clave que no esté entre las que se mostraron y **pega el texto literal** de cada fuente desde la base de datos.

Simplificado, se ve así:

```python
fuentes = recuperar(clausula)                      # artículos y autos supremos candidatos
mostradas = {f.clave: f for f in fuentes}

respuesta = llm.json(prompt(clausula, fuentes), esquema=JuicioClausula)

citas = [
    {"clave": k, "texto": mostradas[k].texto_literal}   # el texto lo pone el sistema
    for k in respuesta.claves
    if k in mostradas                                   # clave inventada → se descarta
]
```

El modelo sigue haciendo lo que hace bien (razonar sobre el texto), pero ya no puede inventar el contenido de una cita: en el peor caso elige una fuente poco relevante, y eso se puede medir y mejorar.

## Buscar bien importa más que el modelo

Si la fuente correcta no está entre las candidatas, no hay prompt que la salve. Por eso la búsqueda es **híbrida**:

- **BM25** (con SQLite FTS5) para los términos exactos: en derecho, "anticresis" o "evicción" tienen que coincidir tal cual.
- **Embeddings** (`bge-m3`, corriendo local con Ollama) para lo semántico: una cláusula puede decir lo mismo que un artículo con otras palabras.
- Las dos listas se combinan con **Reciprocal Rank Fusion (RRF)**, que premia a las fuentes que aparecen arriba en ambas.

El corpus tiene 3.267 artículos y 971 entradas de jurisprudencia.

## Medir antes de optimizar

Es muy fácil "sentir" que los resultados mejoran. Por eso armé un set de evaluación con cláusulas y las fuentes que deberían aparecer para cada una. Con eso, cada cambio dejó de ser una intuición:

- La recuperación (acierto@8: la fuente correcta entre las 8 primeras) pasó de **42,9 % a 80 %**.
- Sobre 40 cláusulas evaluadas: **82,9 %** de citas correctas y **94,6 %** de cláusulas sin un error grave de riesgo.

Una aclaración honesta: es una evaluación interna, todavía no validada por abogados. Pero ya permite comparar versiones del sistema con números en lugar de impresiones.

## Privacidad: anonimizar antes de salir de la máquina

Los contratos tienen nombres, carnets, NIT, direcciones, placas… Antes de que cualquier texto llegue a un modelo en la nube, AdvAI reemplaza esos datos por marcadores y guarda el mapa en el servidor. Cuando vuelve la respuesta, se restauran. Además hay un modelo local (Ollama) y proveedores con respaldo automático: si uno falla, sigue otro.

## Lo que aprendí

- **Un LLM no es una base de datos.** La solución a las alucinaciones no fue un mejor prompt, fue una arquitectura donde el modelo no puede escribir lo que no debe.
- **Sin evaluación, estás adivinando.** El set de prueba fue lo que más valor le dio al proyecto.
- **La búsqueda es la mitad del trabajo.** Mejorar la recuperación subió la calidad más que cambiar de modelo.

Si estás construyendo algo con RAG y citas, o te interesa el proyecto, escríbeme abajo: me encanta hablar de esto.
