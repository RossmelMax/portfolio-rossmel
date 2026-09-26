---
title: 'Offline-first de verdad: una app de cobro de agua con Electron y SQLite'
description: "Link'u registra lecturas de medidores y emite boletas para una comunidad rural donde internet no es garantía. SQLite como fuente de verdad, toda la lógica en el proceso principal, tarifas congeladas en cada boleta y respaldos cifrados con AES-256-GCM."
date: 2026-09-26
tags: ['electron', 'react', 'seguridad']
project: 'agua-potable'
lang: 'es'
---

**Link'u** es una comunidad de Sipe Sipe, en Cochabamba, que administra su propio sistema de agua potable. Las lecturas de los medidores se anotaban a mano y los cobros se llevaban en papel, sin ningún respaldo. Y es una comunidad en expansión: cada año hay más afiliados.

Me contrataron para digitalizarlo. El requisito que definió toda la arquitectura fue este: **la app tiene que funcionar igual sin internet**. No "funcionar con un modo offline", sino que internet sea un extra.

## Arquitectura: la nube es solo un respaldo

```text
┌──────────────────────────── Electron ─────────────────────────────┐
│  React (renderer)  ──IPC──▶  Proceso principal                    │
│                                ├─ database.js    (SQLite local)   │
│                                ├─ ipcHandlers.js (CRUD + auditoría)│
│                                └─ cloud.js       (respaldo cifrado)│
└───────────────────────────────────────────────────────────────────┘
```

- **SQLite es la fuente de verdad.** Afiliados, medidores, boletas, usuarios y el historial viven en un archivo local. Leer y escribir es instantáneo y no depende de nada externo.
- **La nube (Firebase Storage) solo guarda respaldos.** Si no hay red o no está configurada, la app no se entera: sigue funcionando.
- **Sin servidor propio.** Para una comunidad pequeña, un servidor es un costo mensual y un punto de falla más.

## Regla 1: el renderer no toca nada

En Electron es muy fácil darle a la interfaz acceso a Node.js y que React consulte la base directamente. También es muy fácil que eso termine siendo un agujero de seguridad.

En Link'u, la ventana corre con `contextIsolation: true` y `nodeIntegration: false`, y el renderer solo ve una **lista cerrada de funciones** expuesta desde el `preload`:

```js
// preload.js: lo ÚNICO que la interfaz puede hacer
contextBridge.exposeInMainWorld('electronAPI', {
  getAfiliados: (query, opts) => ipcRenderer.invoke('get-afiliados', query, opts),
  createAfiliado: (afiliado) => ipcRenderer.invoke('create-afiliado', afiliado),
  createRecibo: (recibo) => ipcRenderer.invoke('create-recibo', recibo),
  // …
});
```

Todo lo demás vive en el proceso principal: las consultas SQL, la sesión (quién inició sesión se guarda ahí, no en el estado de React) y, como regla del proyecto, los **permisos** y los **cálculos de montos**. La interfaz pide; el proceso principal decide. Si alguien manipula la interfaz, lo que llega al proceso principal sigue siendo una lista cerrada de operaciones. Hay cuatro niveles (maestro, administrador, operario y consulta) y el usuario maestro siempre exige contraseña y no se puede desactivar ni borrar.

## Regla 2: una boleta emitida no cambia nunca

La fórmula es simple:

```text
consumo = lectura_actual − lectura_anterior
total   = tarifa_básica + consumo × costo_m3 + otros_cargos
```

El problema aparece cuando **cambian las tarifas**. Si la boleta guarda solo el consumo y calcula el total con la tarifa vigente, un aumento de precio en junio cambiaría el monto de las boletas de marzo. Y eso, en una comunidad donde el cobro es un tema sensible, es un conflicto asegurado.

La solución: cada boleta guarda una **foto de las tarifas** del momento en que se emitió (`tarifa_basica_snapshot`, `costo_m3_snapshot`, `otros_snapshot`), además del total y el **monto en letras** que se imprime. Lo emitido queda congelado.

Y el dinero nunca en decimales flotantes: `0.1 + 0.2` no es `0.3` en JavaScript. Los montos se manejan en **centavos enteros** y se formatean solo al mostrarlos.

## Regla 3: todo deja rastro

Cada acción importante (crear un afiliado, emitir o cobrar una boleta, cambiar una tarifa) se registra en una tabla de **auditoría**: quién, cuándo, qué y con qué detalle. El login incluye una foto del operario tomada con la cámara, que se guarda como evidencia junto al registro. Fue un pedido del cliente: yo no lo habría elegido, pero para ellos saber quién estaba frente a la computadora era clave.

## Respaldos cifrados con AES-256-GCM

Cada pocos minutos (configurable), al cerrar la app y con un botón "Respaldar ahora", la app exporta todas las tablas a JSON, **las cifra** y las sube a la nube. El cifrado usa lo que trae Node, sin dependencias:

```js
function encrypt(plaintext, secret) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(secret, salt, 32);   // clave derivada del secreto
  const iv = crypto.randomBytes(12);                 // IV de 96 bits, nuevo en cada respaldo
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const data = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return JSON.stringify({
    v: 1,                                            // versión del formato
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    tag: cipher.getAuthTag().toString('hex'),        // detecta cualquier alteración
    data: data.toString('base64'),
  });
}
```

Por qué así:

- **GCM autentica además de cifrar.** Si alguien modifica el archivo, el `tag` no coincide y el descifrado falla, en vez de restaurar datos corruptos.
- **Un secreto por instalación**, generado automáticamente la primera vez y guardado localmente. Nada hardcodeado en el código.
- **`v: 1` en el formato.** Si mañana cambio el algoritmo, sé con qué versión se cifró cada respaldo.
- **Las credenciales de la nube no van en el instalador.** Se copian aparte en la computadora del comité.

Restaurar descarga el último respaldo, lo descifra y reemplaza los datos locales, siempre con confirmación.

## Boletas en PDF sin librerías de PDF

Las boletas se imprimen con **doble copia por hoja**: una para el afiliado y otra para el comité. En vez de sumar una librería para generar PDFs, uso el motor que Electron ya trae: armo el HTML de la boleta, lo cargo en una ventana **invisible** (`offscreen`) y llamo a `webContents.printToPDF()`. El diseño se hace con HTML y CSS normales, y el resultado es idéntico en Windows y Linux.

## Distribución

La comunidad usa Windows, y yo desarrollo en Linux. Un workflow de **GitHub Actions** compila el instalador de Windows en un runner de Windows en cada push y en cada tag de versión, y el empaquetado genera también una versión portable y un AppImage. Las **actualizaciones automáticas** permiten entregar correcciones sin ir hasta la comunidad con un USB.

## Lo que aprendí

- **Offline-first es una decisión de arquitectura, no una función.** Si la nube es la fuente de verdad, "modo offline" es un parche. Si lo local es la fuente de verdad, la nube es un respaldo y no puede romper nada.
- **Lo emitido no se recalcula.** Guardar la foto de las tarifas en cada boleta evitó toda una categoría de conflictos.
- **En Electron, el proceso principal es tu backend.** Tratarlo así (permisos, validaciones y cálculos ahí, la interfaz solo pide) hace la app mucho más segura.
- **Escuchar al cliente.** El software es para ellos: el login con foto no era mi idea, pero resolvía un problema real de confianza.
