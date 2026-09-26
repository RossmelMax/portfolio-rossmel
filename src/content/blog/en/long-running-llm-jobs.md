---
title: 'Long-running LLM jobs: multiple providers, a resumable queue and live progress'
description: 'Analyzing a contract clause by clause can take minutes. In AdvAI I solved it with a model pool that respects each provider''s limits, a worker that survives restarts and Server-Sent Events to show progress.'
date: 2026-09-24
tags: ['ai', 'llm', 'python', 'backend']
project: 'advai'
lang: 'en'
translationOf: 'procesos-largos-con-llms'
---

A request to an LLM takes seconds. A 30-clause contract, each clause with a source search and a model call, plus a review of the whole contract, takes **minutes**. And a lot happens in that time: a provider answers `429 Too Many Requests`, another one goes down, the server restarts or the user closes the tab.

In **AdvAI** I had to design for all of that. This post covers the three pieces that solved it, with simplified code.

## 1. A pool of models instead of "the model"

AdvAI works with free models: one **local** model with Ollama (private, no limits, works offline) and two **cloud** models with free tiers, Groq and Gemini, which only receive anonymized text. The order of preference is set with an environment variable:

```bash
ADVAI_LLM=ollama,groq,gemini
```

Free tiers have per-minute limits: so many requests, so many tokens. Instead of hitting the limit and waiting for the `429`, each provider **keeps track** of what it used in the last minute and says whether it can take a request before trying:

```python
class Proveedor:
    def libre(self, tokens_estimados: int = 0) -> bool:
        """Can it take a request now without exceeding its quota?"""
        ahora = time.time()
        if ahora < self.pausa_hasta:
            return False
        while self.usos and ahora - self.usos[0][0] > 60:   # 60-second sliding window
            self.usos.popleft()
        if self.peticiones_por_minuto and len(self.usos) >= self.peticiones_por_minuto:
            return False
        if self.tokens_por_minuto and sum(t for _, t in self.usos) + tokens_estimados > self.tokens_por_minuto:
            return False
        return True
```

The pool walks through the providers in order and uses the first one that's free. If one fails, it **pauses it for 30 seconds** and moves on to the next; if they're all busy, it waits a bit and tries again, up to a maximum time:

```python
def completar_json(self, prompt, esquema, max_tokens=400, permitir_nube=True, espera_max=240):
    estimados = len(prompt) // 3 + max_tokens            # cheap token estimate
    candidatos = [p for p in self.activos() if permitir_nube or not p.nube]
    inicio = time.time()
    while time.time() - inicio < espera_max:
        for p in candidatos:
            if not p.libre(estimados) or not p._sem.acquire(blocking=False):
                continue
            try:
                datos, tokens = p.completar(prompt, esquema, max_tokens)
                p.registrar(tokens or estimados)
                return datos, f"{p.nombre}/{p.modelo}"      # who answered, for auditing
            except LimiteAlcanzado:
                pass                                        # quota hit: try another one
            except Exception:
                p.pausar(30)                                # error: take it out for a while
            finally:
                p._sem.release()
        time.sleep(0.2)
    raise ErrorLLM("No model could answer in time")
```

Three important details:

- **One semaphore per provider** limits how many concurrent requests each one handles. With several clauses in parallel, the work is spread according to each provider's capacity, and the contract doesn't depend on the speed of a single one.
- **`permitir_nube=False`** ("allow cloud") forces the local model only. It's the gate for tasks that must never leave the machine.
- **The answer says who generated it** (`groq/…`, `ollama/…`). When something goes wrong, knowing which model produced it saves hours.

## 2. A worker that survives restarts

The analysis doesn't run inside the HTTP request: the endpoint stores the contract, creates a *version* with status `pendiente` (pending) and puts it in a queue. A **worker thread** processes it in stages and saves every step to SQLite:

```text
document → compare with previous version → clauses (in parallel) → full-contract review → done
```

Since the state lives in the database and not in memory, resuming after a restart is trivial. On startup, the worker looks for whatever was left halfway:

```python
def iniciar(self):
    for r in con.execute("SELECT id FROM versiones WHERE estado IN ('pendiente','procesando') ORDER BY id"):
        self.cola.put(r["id"])
    threading.Thread(target=self._bucle, daemon=True).start()
```

And each stage checks what's already done before doing it: if that version's clauses were already extracted, the document isn't read again; only the clauses that are still pending or that failed are sent to the model. If the server restarts with 20 clauses done, those 20 aren't repeated.

A bonus of storing everything per clause: when the lawyer uploads **a new version** of the same contract, the system aligns its clauses with the previous version and **reuses the analysis of the ones that didn't change**. You only pay (in time) for what's new.

And a golden rule for the loop: **an exception never kills the thread**. It's logged, the version is marked as `error` with a readable message, and the worker moves on to the next one.

## 3. Live progress with Server-Sent Events

To show progress I used **Server-Sent Events (SSE)** instead of WebSockets: communication is one-way (server → browser), it works over plain HTTP and the browser reconnects on its own.

Each stage publishes an event to an in-memory queue per version, and the FastAPI endpoint subscribes to it:

```python
@app.get("/api/versiones/{vid}/eventos")
async def eventos(vid: int, request: Request):
    q = trabajador.eventos.suscribir(vid)

    async def flujo():
        try:
            v = estado_actual(vid)                          # 1) first, the current state
            yield f"data: {json.dumps({'tipo': 'estado', **v})}\n\n"
            if v["estado"] in ("listo", "error"):
                return
            while not await request.is_disconnected():      # 2) then, every change
                try:
                    ev = await asyncio.to_thread(q.get, True, 15)
                except queue.Empty:
                    yield ": latido\n\n"                    # SSE comment: keeps the connection alive
                    continue
                yield f"data: {json.dumps(ev)}\n\n"
                if ev["tipo"] in ("fin", "error"):
                    return
        finally:
            trabajador.eventos.desuscribir(vid, q)          # never leave orphaned subscribers

    return StreamingResponse(flujo(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
```

What I learned building this:

- **Send the current state first.** If the user reloads the page mid-analysis, they don't sit waiting for the next event: they immediately see which stage it's in.
- **The heartbeat.** Some proxies drop connections that don't send anything for a while. A line starting with `:` is a comment in SSE: the browser ignores it, but it keeps the connection alive.
- **`X-Accel-Buffering: no`** stops an nginx-style proxy from buffering the events and sending them all together at the end.
- **`asyncio.to_thread`** lets you wait on a blocking `queue.Queue` (the worker thread's) without freezing the async server.

On the frontend (Next.js), an `EventSource` listens for those events and paints the clauses with their risk level as they arrive, instead of a loading bar that says nothing.

## What I learned

- **Design for graceful failure.** With free LLMs, a `429` isn't an exception: it's part of the day. Counting usage up front beats reacting to the error.
- **State belongs in the database, not in memory.** Everything else (resuming, reusing, showing progress) comes almost for free after that.
- **SSE is underrated.** For showing the progress of a long job, it's simpler than WebSockets and does exactly what you need.
