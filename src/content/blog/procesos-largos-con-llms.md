---
title: 'Procesos largos con LLMs: varios proveedores, una cola que se reanuda y progreso en vivo'
description: 'Analizar un contrato cláusula por cláusula puede tomar minutos. En AdvAI lo resolví con un pool de modelos que respeta los límites de cada proveedor, un trabajador que sobrevive a reinicios y Server-Sent Events para mostrar el avance.'
date: 2026-09-24
tags: ['ia', 'llm', 'python', 'backend']
project: 'advai'
lang: 'es'
---

Una petición a un LLM tarda segundos. Un contrato de 30 cláusulas, cada una con búsqueda de fuentes y una llamada al modelo, más una revisión del contrato completo, tarda **minutos**. Y en ese tiempo pasan cosas: un proveedor responde `429 Too Many Requests`, otro se cae, el servidor se reinicia o el usuario cierra la pestaña.

En **AdvAI** tuve que diseñar para todo eso. Este artículo cuenta las tres piezas que lo resolvieron, con el código simplificado.

## 1. Un pool de modelos en vez de "el modelo"

AdvAI trabaja con modelos gratuitos: uno **local** con Ollama (privado, sin límites, funciona sin internet) y dos **en la nube** con capa gratuita, Groq y Gemini, que solo reciben texto anonimizado. El orden de preferencia se configura con una variable de entorno:

```bash
ADVAI_LLM=ollama,groq,gemini
```

Las capas gratuitas tienen límites por minuto: tantas peticiones, tantos tokens. En vez de chocar contra el límite y esperar el `429`, cada proveedor **((lleva la cuenta))** de lo que usó en el último minuto y dice si puede atender antes de intentarlo:

```python
class Proveedor:
    def libre(self, tokens_estimados: int = 0) -> bool:
        """¿Puede atender ahora sin pasarse de su cuota?"""
        ahora = time.time()
        if ahora < self.pausa_hasta:
            return False
        while self.usos and ahora - self.usos[0][0] > 60:   # ventana deslizante de 60 s
            self.usos.popleft()
        if self.peticiones_por_minuto and len(self.usos) >= self.peticiones_por_minuto:
            return False
        if self.tokens_por_minuto and sum(t for _, t in self.usos) + tokens_estimados > self.tokens_por_minuto:
            return False
        return True
```

El pool recorre los proveedores en orden y usa el primero que esté libre. Si uno falla, lo **pausa 30 segundos** y sigue con el siguiente; si todos están ocupados, espera un poco y vuelve a intentar, con un tiempo máximo:

```python
def completar_json(self, prompt, esquema, max_tokens=400, permitir_nube=True, espera_max=240):
    estimados = len(prompt) // 3 + max_tokens            # estimación barata de tokens
    candidatos = [p for p in self.activos() if permitir_nube or not p.nube]
    inicio = time.time()
    while time.time() - inicio < espera_max:
        for p in candidatos:
            if not p.libre(estimados) or not p._sem.acquire(blocking=False):
                continue
            try:
                datos, tokens = p.completar(prompt, esquema, max_tokens)
                p.registrar(tokens or estimados)
                return datos, f"{p.nombre}/{p.modelo}"      # quién respondió, para auditar
            except LimiteAlcanzado:
                pass                                        # cuota: probar con otro
            except Exception:
                p.pausar(30)                                # error: sacarlo un rato
            finally:
                p._sem.release()
        time.sleep(0.2)
    raise ErrorLLM("Ningún modelo pudo responder a tiempo")
```

Tres detalles importantes:

- **Un semáforo por proveedor** limita cuántas peticiones simultáneas atiende cada uno. Con varias cláusulas en paralelo, el trabajo se reparte según la capacidad de cada proveedor y el contrato no depende de la velocidad de uno solo.
- **`permitir_nube=False`** obliga a usar solo el modelo local. Es la puerta para tareas que nunca deben salir de la máquina.
- **La respuesta dice quién la generó** (`groq/…`, `ollama/…`). Cuando algo sale mal, saber qué modelo lo produjo ahorra horas.

## 2. Un trabajador que sobrevive a los reinicios

El análisis no corre dentro de la petición HTTP: el endpoint guarda el contrato, crea una *versión* con estado `pendiente` y la pone en una cola. Un **hilo trabajador** la procesa por etapas y guarda cada avance en SQLite:

```text
documento → comparar con la versión anterior → cláusulas (en paralelo) → análisis integral → listo
```

Como el estado vive en la base de datos y no en memoria, reanudar después de un reinicio es trivial. Al arrancar, el trabajador busca lo que quedó a medias:

```python
def iniciar(self):
    for r in con.execute("SELECT id FROM versiones WHERE estado IN ('pendiente','procesando') ORDER BY id"):
        self.cola.put(r["id"])
    threading.Thread(target=self._bucle, daemon=True).start()
```

Y cada etapa revisa qué ya está hecho antes de hacerlo: si las cláusulas de esa versión ya se extrajeron, no se vuelve a leer el documento; solo se mandan al modelo las cláusulas que siguen pendientes o que fallaron. Si el servidor se reinicia con 20 cláusulas listas, esas 20 no se repiten.

Un bonus de guardar todo por cláusula: cuando el abogado sube **una nueva versión** del mismo contrato, el sistema alinea las cláusulas con la versión anterior y **reutiliza el análisis de las que no cambiaron**. Solo se paga (en tiempo) por lo nuevo.

Y una regla de oro del bucle: **==una excepción nunca mata al hilo==**. Se registra, la versión queda en estado `error` con un mensaje legible y el trabajador sigue con la siguiente.

## 3. Progreso en vivo con Server-Sent Events

Para mostrar el avance usé **Server-Sent Events (SSE)** en lugar de WebSockets: la comunicación es en un solo sentido (servidor → navegador), funciona sobre HTTP normal y el navegador reconecta solo.

Cada etapa publica un evento en una cola en memoria por versión, y el endpoint de FastAPI se suscribe:

```python
@app.get("/api/versiones/{vid}/eventos")
async def eventos(vid: int, request: Request):
    q = trabajador.eventos.suscribir(vid)

    async def flujo():
        try:
            v = estado_actual(vid)                          # 1) primero, el estado actual
            yield f"data: {json.dumps({'tipo': 'estado', **v})}\n\n"
            if v["estado"] in ("listo", "error"):
                return
            while not await request.is_disconnected():      # 2) luego, cada cambio
                try:
                    ev = await asyncio.to_thread(q.get, True, 15)
                except queue.Empty:
                    yield ": latido\n\n"                    # comentario SSE: mantiene viva la conexión
                    continue
                yield f"data: {json.dumps(ev)}\n\n"
                if ev["tipo"] in ("fin", "error"):
                    return
        finally:
            trabajador.eventos.desuscribir(vid, q)          # nunca dejar suscriptores huérfanos

    return StreamingResponse(flujo(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
```

Lo que aprendí armando esto:

- **Mandar primero el estado actual.** Si el usuario recarga la página a mitad del análisis, no se queda esperando el próximo evento: ve de inmediato en qué etapa va.
- **El latido.** Algunos proxies cortan conexiones que no envían nada por un rato. Una línea que empieza con `:` es un comentario en SSE: el navegador la ignora, pero mantiene la conexión viva.
- **`X-Accel-Buffering: no`** evita que un proxy tipo nginx acumule los eventos y los mande todos juntos al final.
- **`asyncio.to_thread`** permite esperar una `queue.Queue` bloqueante (la del hilo trabajador) sin congelar el servidor asíncrono.

En el frontend (Next.js), un `EventSource` escucha esos eventos y va pintando las cláusulas con su nivel de riesgo a medida que llegan, en vez de una barra de carga que no dice nada.

## Lo que aprendí

- **Diseña para que falle bien.** Con LLMs gratuitos, el `429` no es una excepción: es parte del día. Contar el uso por adelantado es mejor que reaccionar al error.
- **El estado va en la base de datos, no en la memoria.** Todo lo demás (reanudar, reutilizar, mostrar progreso) sale casi gratis después de eso.
- **SSE es subestimado.** Para mostrar el progreso de un proceso largo, es más simple que WebSockets y hace exactamente lo que necesitas.
