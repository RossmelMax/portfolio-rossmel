---
title: 'Programar antes y después de la IA: lo que me dejaron los años de hacerlo a mano'
description: 'Aprendí a la vieja escuela y recién en mi último año en WANT metimos IA al trabajo. Qué cambió, qué no, y cómo decido cuándo dejar que la IA vaya rápido y cuándo revisar con lupa.'
date: 2026-09-16
tags: ['ia', 'carrera']
lang: 'es'
pinned: true
---

Hoy cualquiera puede pedirle a un modelo "hazme una app de tareas" y tener algo funcionando en diez minutos. Es increíble, y lo uso todos los días. Pero mi forma de usar la IA tiene mucho que ver con cómo aprendí a programar antes de que existiera.

## Cómo aprendí: sin atajos

Empecé solo, en 2019, con mi primera computadora propia. No había asistentes que completaran el código: había documentación, cursos, foros y muchas noches de "¿por qué no funciona esto?".

En 2022 entré a WANT Digital Agency como pasante. Éramos dos en desarrollo: mi jefe en el backend y yo en el frontend. Ahí construí las interfaces web y móviles de productos reales para clientes de Bolivia y Estados Unidos: un SaaS multi-tenant para talleres mecánicos, apps en React Native, un menú digital para restaurantes, sitios web.

Durante casi todo ese tiempo **programamos a mano**. Si algo se rompía en producción, había que leer el stack trace, reproducir el error y entender el flujo completo hasta encontrar la causa. Recién en mi **último año** en WANT incorporamos IA al trabajo.

Esos años me dejaron algo que hoy valoro mucho: cuando la IA me devuelve código, **lo entiendo**. Sé por qué funciona, dónde se va a romper y cómo mantenerlo.

## Cuando llegó el boom

Con el boom de la IA fui probando prácticamente todo lo que aparecía:

- **GitHub Copilot**, para autocompletar dentro del editor.
- **ChatGPT**, **Gemini** y **DeepSeek**, para investigar, explicar errores y discutir enfoques.
- **Groq**, por su velocidad, que terminé usando dentro de mis propios productos (en SGPG extrae los datos de cada PDF).
- **Modelos locales** con Ollama, para lo privado y para no depender de internet (en AdvAI, un modelo local es la primera opción).
- Y últimamente **Claude**, que hoy es la herramienta central de mi flujo.

Cada una tiene su lugar, y ninguna reemplazó lo anterior: se sumaron a una base que ya existía.

## Lo que cambió

La IA me hizo **mucho más rápido**. Un formulario con validaciones, un endpoint CRUD, un script de migración: cosas que antes me tomaban una tarde ahora me toman minutos, y el tiempo que ahorro va al diseño, a la arquitectura y al detalle.

También me hizo **más curioso**. Con alguien a quien preguntarle a las 3 de la mañana, me animé a meterme en temas que antes me parecían lejanos: búsqueda híbrida y evaluación de LLMs para mi proyecto de grado, bootloaders y Wayland para mi propia versión de Arch, túneles y systemd para mi servidor casero. La IA no aprendió eso por mí: me acompañó mientras yo lo aprendía.

## Dos velocidades

No todo proyecto merece el mismo cuidado, y ahí está buena parte del criterio:

- **Explorar.** Un prototipo, una herramienta para mí, un experimento de fin de semana: dejo que la IA avance rápido y me concentro en si la idea funciona. Si algo falla, lo leo y lo entiendo en el momento.
- **Entregar.** Algo que va a producción, que usa un cliente o que maneja datos de otras personas: ahí reviso el diff, pienso en los casos borde y me aseguro de poder explicar cada parte.

Pasar de una velocidad a la otra es natural cuando entiendes el código. SGPG, por ejemplo, empezó como un prototipo generado con v0 en pocas horas; convertirlo en algo que usa la jefatura de carrera (permisos, versionado de documentos, un visor de PDF que no se come la RAM) fue trabajo de ingeniería, y fue posible porque sabía qué estaba mirando.

## Lo que me funciona

Algunas prácticas que fui adoptando, sobre todo en lo que se entrega:

1. **Primero el problema, después el prompt.** Antes de pedir código, tengo claro qué tiene que pasar, con qué datos y qué no puede romperse. Un buen pedido sale de entender el problema.
2. **Los tests miden el código, no al revés.** Si un test falla, se arregla el código. Cuando una sugerencia "ajusta" lo que el test verifica, la leo dos veces.
3. **Medir en vez de creer.** En AdvAI armé un set de evaluación en lugar de confiar en que "las respuestas se ven bien". La recuperación pasó de 42,9 % a 80 % porque cada cambio se comparó con números. Lo cuento en [este artículo](/blog/llm-sin-citas-inventadas/).
4. **La arquitectura la decido yo.** La IA es buenísima escribiendo una función; las decisiones de dónde vive, qué datos ve y qué pasa cuando falla siguen siendo el trabajo.
5. **Leer el diff como si fuera de otra persona.** Porque, en cierto modo, lo es.

## En resumen

La IA me potenció muchísimo y me dio más ganas de seguir aprendiendo y de entender cualquier tecnología que llegue a mis manos. La uso como un multiplicador, y un multiplicador multiplica lo que ya tienes: los años de programar a mano son justamente lo que hace que hoy le saque tanto provecho.

Si estás empezando, mi consejo es simple: **usa la IA también para aprender**. Pídele que te explique, no solo que te resuelva. La diferencia se nota el día que algo se rompe.
