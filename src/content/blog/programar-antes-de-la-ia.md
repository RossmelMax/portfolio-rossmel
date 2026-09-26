---
title: 'No soy un vibe coder: programé años sin IA y eso cambia cómo la uso'
description: 'Aprendí a programar a la vieja escuela y recién en mi último año en la agencia metimos IA al trabajo. Qué cambió, qué no, y las reglas que sigo para que la IA me haga mejor programador y no uno dependiente.'
date: 2026-09-26
tags: ['ia', 'carrera']
lang: 'es'
pinned: true
---

Hoy cualquiera puede pedirle a un modelo "hazme una app de tareas" y tener algo que funciona en diez minutos. Eso es genial, pero también tiene un nombre: **vibe coding**. Programar por intuición, aceptando lo que sale sin entender del todo por qué funciona.

Yo no aprendí así. Y creo que justamente por eso la IA me sirve tanto.

## Cómo aprendí: sin atajos

Empecé solo, en 2019, con mi primera computadora propia. No había asistentes que completaran el código: había documentación, cursos, foros y muchas noches de "¿por qué no funciona esto?".

En 2022 entré a WANT Digital Agency como pasante. Éramos dos en desarrollo: mi jefe en el backend y yo en el frontend. Ahí construí las interfaces web y móviles de productos reales para clientes de Bolivia y Estados Unidos: un SaaS multi-tenant para talleres mecánicos, apps en React Native, un menú digital para restaurantes, sitios web.

Durante casi todo ese tiempo **programamos a mano**. Si algo se rompía en producción, había que leer el stack trace, reproducir el error, poner `console.log` donde hiciera falta y entender el flujo completo. Si una librería no hacía lo que necesitábamos, había que leer su código. Recién en el **último año** en la agencia incorporamos IA al trabajo.

Esos años sin atajos me dejaron lo que ningún modelo te da: saber **por qué** el código funciona, y reconocer cuándo algo "se ve bien" pero está mal.

## Cuando llegó el boom

Con el boom de la IA fui probando prácticamente todo lo que aparecía:

- **GitHub Copilot**, para autocompletar dentro del editor.
- **ChatGPT**, **Gemini** y **DeepSeek**, para investigar, explicar errores y discutir enfoques.
- **Groq**, por su velocidad, que terminé usando dentro de mis propios productos (en SGPG extrae los datos de cada PDF).
- **Modelos locales** con Ollama, para lo privado y para no depender de internet (en AdvAI, un modelo local es la primera opción).
- Y últimamente **Claude**, que hoy es la herramienta central de mi flujo.

Cada una tiene su lugar. Pero ninguna reemplazó lo anterior: se sumaron a una base que ya existía.

## Lo que cambió

La IA me hizo **mucho más rápido** en lo que ya sabía hacer. Un formulario con validaciones, un endpoint CRUD, un script de migración: cosas que antes me tomaban una tarde ahora me toman minutos, y el tiempo que ahorro va al diseño, a la arquitectura y al detalle.

También me hizo **más curioso**. Con alguien a quien preguntarle a las 3 de la mañana, me animé a meterme en temas que antes me parecían lejanos: búsqueda híbrida y evaluación de LLMs para mi proyecto de grado, bootloaders y Wayland para mi propia versión de Arch, túneles y systemd para mi servidor casero. La IA no aprendió eso por mí: me acompañó mientras yo lo aprendía.

## Lo que no cambió

Lo que no cambió es la responsabilidad. **La IA propone; yo reviso, decido y respondo por cada línea.** Si el código falla en producción, al cliente no le importa quién lo escribió.

Y hay cosas que la IA todavía hace mal si la dejas sola: inventar una API que no existe, "arreglar" un test cambiando lo que el test verifica, meter una dependencia enorme para algo de diez líneas, o escribir código que funciona hoy y es imposible de mantener mañana. Detectar eso requiere haber escrito y mantenido código sin ayuda.

## Mis reglas para usar IA sin volverme dependiente

Estas son las reglas que sigo en el día a día. No son teoría: salieron de equivocarme.

1. **Si no lo entiendo, no entra.** Si el modelo me da algo que no sé explicar, le pido que me lo explique o lo reescribo yo. Código que no entiendes es deuda que pagas después.
2. **Primero el problema, después el prompt.** Antes de pedir código, escribo qué tiene que pasar, con qué datos y qué no puede romperse. Un buen pedido sale de entender el problema, no al revés.
3. **Los tests no se negocian.** Si un test falla, se arregla el código, no el test. Cuando la IA propone "ajustar" una aserción, leo dos veces.
4. **Medir en vez de creer.** En AdvAI no le creí al modelo que las citas estaban bien: armé un set de evaluación y medí. La recuperación pasó de 42,9 % a 80 % porque cada cambio se comparó con números, no con impresiones. Lo cuento en [este artículo](/blog/llm-sin-citas-inventadas/).
5. **La arquitectura la decido yo.** La IA es buenísima escribiendo una función; es mala decidiendo dónde vive esa función, qué datos ve y qué pasa cuando falla. Esas decisiones son el trabajo.
6. **Leer el diff completo.** Antes de cada commit reviso el cambio línea por línea, como si fuera el pull request de otra persona. Porque, en cierto modo, lo es.

## En resumen

No reniego de la IA: me potenció muchísimo y me dio más ganas de seguir aprendiendo y de entender cualquier tecnología que llegue a mis manos. Pero la uso como lo que es: un multiplicador. Y un multiplicador multiplica lo que ya tienes. Si la base es cero, el resultado también.

Si estás empezando, mi consejo es simple: **usa la IA para aprender, no para evitar aprender.** Pídele que te explique, no solo que te resuelva. La diferencia se nota el día que algo se rompe y el modelo no sabe por qué.
