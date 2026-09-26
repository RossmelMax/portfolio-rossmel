---
title: 'Truly offline-first: a water billing app with Electron and SQLite'
description: "Link'u records meter readings and issues bills for a rural community where the internet isn't guaranteed. SQLite as the source of truth, all logic in the main process, rates frozen on every bill and AES-256-GCM encrypted backups."
date: 2026-09-18
tags: ['electron', 'react', 'security']
project: 'agua-potable'
lang: 'en'
translationOf: 'offline-first-electron-sqlite'
---

**Link'u** is a community in Sipe Sipe, Cochabamba (Bolivia), that runs its own drinking water system. Meter readings were written down by hand and payments were tracked on paper, with no backup at all. And it's a growing community: every year there are more members.

I was hired to digitize it. The requirement that shaped the whole architecture was this: **the app has to work the same without the internet**. Not "work with an offline mode", but treat the internet as an extra.

## Architecture: the cloud is just a backup

```text
┌──────────────────────────── Electron ─────────────────────────────┐
│  React (renderer)  ──IPC──▶  Main process                         │
│                                ├─ database.js    (local SQLite)   │
│                                ├─ ipcHandlers.js (CRUD + audit)   │
│                                └─ cloud.js       (encrypted backup)│
└───────────────────────────────────────────────────────────────────┘
```

- **SQLite is the source of truth.** Members, meters, bills, users and history live in a local file. Reads and writes are instant and depend on nothing external.
- **The cloud (Firebase Storage) only stores backups.** If there's no network, or it isn't configured, the app doesn't even notice: it keeps working.
- **No server of my own.** For a small community, a server is a monthly cost and one more point of failure.

## Rule 1: the renderer touches nothing

In Electron it's very easy to give the UI access to Node.js and let React query the database directly. It's also very easy for that to end up as a security hole.

In Link'u, the window runs with `contextIsolation: true` and `nodeIntegration: false`, and the renderer only sees a **closed list of functions** exposed from the `preload` script:

```js
// preload.js: the ONLY things the UI can do
contextBridge.exposeInMainWorld('electronAPI', {
  getAfiliados: (query, opts) => ipcRenderer.invoke('get-afiliados', query, opts),
  createAfiliado: (afiliado) => ipcRenderer.invoke('create-afiliado', afiliado),
  createRecibo: (recibo) => ipcRenderer.invoke('create-recibo', recibo),
  // …
});
```

Everything else lives in the main process: SQL queries, the session (who's logged in is stored there, not in React state) and, as a project rule, **permissions** and **amount calculations**. The UI asks; the main process decides. If someone tampers with the UI, what reaches the main process is still a closed list of operations. There are four access levels (master, administrator, operator and read-only), and the master user always requires a password and can't be disabled or deleted.

## Rule 2: an issued bill never changes

The formula is simple:

```text
consumption = current_reading − previous_reading
total       = base_rate + consumption × cost_per_m3 + other_charges
```

The problem shows up when **rates change**. If the bill only stores the consumption and computes the total with the current rate, a price increase in June would change the amount of March's bills. In a community where billing is a sensitive topic, that's a guaranteed conflict.

The fix: every bill stores a **==snapshot of the rates==** at the moment it was issued (`tarifa_basica_snapshot`, `costo_m3_snapshot`, `otros_snapshot`), along with the total and the **amount in words** that gets printed. What's issued stays frozen.

And money is never stored as floating-point numbers: `0.1 + 0.2` isn't `0.3` in JavaScript. Amounts are handled as **((integer cents))** and only formatted when displayed.

## Rule 3: everything leaves a trail

Every important action (creating a member, issuing or collecting a bill, changing a rate) is recorded in an **audit** table: who, when, what and with which details. Login includes a photo of the operator taken with the camera, stored as evidence alongside the record. It was the client's request: I wouldn't have chosen it, but for them knowing who was at the computer was key.

## Backups encrypted with AES-256-GCM

Every few minutes (configurable), when the app closes and with a "Back up now" button, the app exports every table to JSON, **encrypts it** and uploads it to the cloud. Encryption uses what ships with Node, no dependencies:

```js
function encrypt(plaintext, secret) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(secret, salt, 32);   // key derived from the secret
  const iv = crypto.randomBytes(12);                 // 96-bit IV, new for every backup
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const data = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return JSON.stringify({
    v: 1,                                            // format version
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    tag: cipher.getAuthTag().toString('hex'),        // detects any tampering
    data: data.toString('base64'),
  });
}
```

Why this way:

- **GCM authenticates as well as encrypts.** If someone modifies the file, the `tag` doesn't match and decryption fails, instead of restoring corrupted data.
- **One secret per installation**, generated automatically the first time and stored locally. Nothing hardcoded.
- **`v: 1` in the format.** If I change the algorithm tomorrow, I know which version encrypted each backup.
- **Cloud credentials don't ship in the installer.** They're copied separately onto the committee's computer.

Restoring downloads the latest backup, decrypts it and replaces the local data, always after a confirmation.

## PDF bills without a PDF library

Bills are printed with **two copies per sheet**: one for the member and one for the committee. Instead of adding a PDF library, I use the engine Electron already ships: I build the bill's HTML, load it in an **invisible** (`offscreen`) window and call `webContents.printToPDF()`. The layout is plain HTML and CSS, and the result is identical on Windows and Linux.

## Distribution

The community uses Windows, and I develop on Linux. A **GitHub Actions** workflow builds the Windows installer on a Windows runner on every push and every version tag, and packaging also produces a portable build and an AppImage. **Automatic updates** let me ship fixes without traveling to the community with a USB drive.

## What I learned

- **Offline-first is an architecture decision, not a feature.** If the cloud is the source of truth, "offline mode" is a patch. If local is the source of truth, the cloud is a backup and can't break anything.
- **What's issued is never recalculated.** Storing a snapshot of the rates on every bill avoided a whole category of conflicts.
- **In Electron, the main process is your backend.** Treating it that way (permissions, validation and calculations there, the UI only asks) makes the app far more secure.
- **Listen to the client.** The software is for them: photo login wasn't my idea, but it solved a real trust problem.
