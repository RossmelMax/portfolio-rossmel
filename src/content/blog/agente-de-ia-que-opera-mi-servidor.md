---
title: 'Un agente de IA que opera mi servidor: memoria en archivos y skills como procedimientos'
description: 'Mi homelab lo mantiene un agente (OpenClaw) que corre 24/7. Lo que lo hace confiable no es el modelo: es la memoria escrita en Markdown, las líneas rojas y los procedimientos con criterios de éxito. Así lo organicé.'
date: 2026-09-26
tags: ['ia', 'linux']
project: 'homelab'
lang: 'es'
---

En casa tengo un servidor modesto: un Pentium de 4 hilos con menos de 4 GB de RAM, detrás de CGNAT (sin IP pública ni puertos abiertos). Aun así sirve una docena de servicios con HTTPS, backups y monitoreo.

Quien lo mantiene la mayor parte del tiempo no soy yo: es un **agente de IA** basado en OpenClaw que corre 24/7 y con el que hablo por chat web o por Telegram. Actualiza paquetes, revisa servicios, hace backups y me reporta.

Un agente así, sin más, es "un chat con acceso a la terminal": útil, pero impredecible. Cada sesión empieza de cero, puede repetir un error que ya cometió y dar por bueno algo que no lo está. Lo que lo vuelve confiable no es el modelo. Es **escribir las cosas**.

## 1. La memoria vive en archivos

Un modelo no recuerda nada entre sesiones. La solución de OpenClaw es simple y poderosa: la memoria es un **workspace de archivos Markdown** versionado con git.

```text
workspace/
├── AGENTS.md        # cómo trabajar: reglas, límites, flujo
├── USER.md          # quién soy, cómo me gusta que me hablen
├── MEMORY.md        # memoria de largo plazo, curada
├── memory/
│   └── 2026-09-25.md  # notas crudas del día
└── skills/          # procedimientos (ver abajo)
```

- Las **notas diarias** son el registro crudo: qué se hizo, qué falló, qué quedó pendiente.
- **MEMORY.md** es lo destilado: decisiones, contexto y lecciones que valen para siempre. Cada tanto, el agente relee las notas diarias y pasa lo importante a la memoria de largo plazo.
- Una regla de privacidad importante: MEMORY.md tiene contexto personal, así que **solo se carga en conversaciones conmigo**, nunca en contextos compartidos.

La instrucción que más impacto tuvo está en AGENTS.md: *"las notas mentales no sobreviven a un reinicio; los archivos sí"*. Si le digo "acuérdate de esto", lo escribe. Si comete un error, lo documenta para no repetirlo.

## 2. Líneas rojas explícitas

Un agente con acceso a la terminal puede hacer mucho daño con buenas intenciones. Así que AGENTS.md define límites claros:

- **No sacar datos privados de la máquina.** Nunca.
- **No correr comandos destructivos sin preguntar.**
- **Antes de cambiar una configuración** (crontab, units de systemd, configs de servicios, archivos del shell), **inspeccionar el estado actual** y preservar o combinar por defecto. Nada de sobrescribir un archivo entero para cambiar una línea.
- **Preferir `trash` sobre `rm`**: recuperable le gana a borrado.
- **Preguntar antes de cualquier cosa que salga de la máquina**: correos, publicaciones, cualquier acción externa.

Y una regla que me ahorró bastante trabajo: antes de construir algo a medida, **buscar si ya existe** una herramienta open source o un plugin que lo resuelva. Construir solo si lo existente no sirve.

## 3. Skills: procedimientos con criterios de éxito

Esta es la parte que más me gustó diseñar. Cada tarea que se repite (o que salió mal una vez) se convierte en una **skill**: un archivo Markdown con un procedimiento paso a paso. Lo importante es que **cada paso tiene un criterio de éxito verificable**.

Por ejemplo, la skill para **retomar un proyecto después de semanas sin tocarlo**:

```markdown
---
name: resume-project-after-gap
description: Retomar un proyecto después de un tiempo: reconstruir el estado del repo,
  el trabajo sin commitear y los problemas pendientes a partir de git y la memoria.
---

## Pasos
1. Buscar el proyecto en la memoria (notas diarias y secciones de "Pendientes").
   Criterio: tienes los resúmenes de sesiones anteriores que lo mencionan.
2. Foto del estado de git: status, últimos commits, diff, stash y reflog.
   Criterio: sabes la rama, la fecha del último commit, los archivos sin commitear y si hay stash.
3. Fechar el trabajo sin commitear: comparar la fecha de modificación de los archivos
   con la del último commit.
   Criterio: puedes decir cuándo se hicieron los cambios pendientes.
4. Verificar que el código sin commitear compila antes de describirlo como usable.
   Criterio: resultado del typecheck conocido.
5. Reportar el estado y proponer el siguiente paso. No editar nada hasta que el usuario confirme.

## Trampas
- Compilar no es lo mismo que funcionar: los cambios de parseo necesitan archivos reales
  antes de prometer que andan.
```

Tres cosas hacen que este formato funcione:

- **Criterios, no intenciones.** "Revisar los servicios" es vago; "cada servicio confirmado activo, o un arreglo aplicado y re-verificado" no deja lugar a un "todo bien" inventado.
- **La sección de trampas.** Cada vez que el agente se equivocó, la causa quedó escrita. Por ejemplo: buscar en un log que tiene bytes binarios con `grep` normal devuelve 0 coincidencias en silencio (hay que usar `grep -a`); o declarar caído un servicio por haber escrito mal el nombre de su unidad de systemd.
- **Terminar con "no hacer nada sin confirmar"** en las tareas donde el siguiente paso es una decisión mía.

## 4. Automatizar con un modelo más barato

Con los procedimientos escritos, las tareas programadas ya no necesitan el modelo más caro. El **mantenimiento semanal** corre solo, en una sesión aislada, con un modelo rápido y económico siguiendo la skill al pie de la letra:

1. Actualizar paquetes.
2. Si se actualizó el kernel, anotar que hay un reinicio pendiente. **Nunca reiniciar solo**: los servicios siguen funcionando con el kernel viejo en memoria y el momento del reinicio lo coordino yo.
3. Verificar cada servicio con el método correcto para cada uno (una respuesta HTTP 401 de un servicio con autenticación significa que **está arriba**, no que falló).
4. Backups de las bases de datos del agente y limpieza de los más viejos que tres semanas.
5. Reporte corto: paquetes actualizados, reinicio pendiente o no, backups creados y espacio libre.

La última regla de esa skill es mi favorita: *"si un comando termina sospechosamente rápido, verificar con otro método antes de reportar"*. Es exactamente lo que haría una persona con experiencia.

## Lo que aprendí

- **Un agente es tan bueno como su documentación.** Memoria, límites y procedimientos escritos pesan más que el modelo que uses.
- **Los criterios de éxito verificables son lo que evita las alucinaciones operativas.** El agente no puede decir "listo" si no puede mostrar el criterio cumplido.
- **Documentar los errores rinde más que evitarlos.** Cada trampa escrita es un error que no se repite.
- Y algo que aplica fuera de los agentes: **escribir procedimientos claros me hizo entender mejor mi propio servidor.** Si no puedes explicárselo paso a paso a un agente, probablemente tampoco lo tienes claro tú.
