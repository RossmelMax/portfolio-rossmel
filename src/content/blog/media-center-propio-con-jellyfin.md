---
title: 'Tu propio Netflix en casa: un media center con Jellyfin, Docker y acceso seguro'
description: 'Cómo armé Selflix, mi media center con Jellyfin en un servidor casero modesto: Docker, la estructura de carpetas que Jellyfin espera, acceso desde fuera sin abrir puertos, cuentas por persona y las trampas que me costaron horas.'
date: 2026-09-26
tags: ['homelab', 'linux', 'docker']
project: 'selflix'
lang: 'es'
---

Si tienes películas y series repartidas en carpetas y discos (en mi caso, uno venía de Windows), ver algo termina siendo abrir carpetas, adivinar cuál era el capítulo siguiente y pasar el archivo al celular.

**Jellyfin** resuelve eso: es un servidor multimedia libre y gratuito que ordena tu biblioteca, descarga pósters y sinopsis, recuerda por dónde ibas y tiene apps para el celular, la tele y el navegador. Es como tener tu propio Netflix, con tus archivos y sin suscripción.

Así nació **Selflix**, mi media center. Corre en mi homelab, un servidor casero bastante modesto, y este artículo cuenta cómo montarlo y las trampas que encontré en el camino.

## 1. Jellyfin en Docker

Docker es la forma más limpia de instalarlo: la configuración queda en una carpeta, actualizar es cambiar la imagen y no ensucias el sistema.

```yaml
# docker-compose.yml
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin
    user: 1000:1000                 # tu usuario: los archivos nuevos quedan a tu nombre
    ports:
      - 127.0.0.1:8096:8096         # solo accesible desde la propia máquina (ver punto 4)
    volumes:
      - ./config:/config            # base de datos, usuarios, metadatos
      - ./cache:/cache
      - /srv/media:/media:ro        # tus películas y series, en solo lectura
    restart: unless-stopped
```

Dos decisiones que recomiendo:

- **La biblioteca en solo lectura (`:ro`).** Jellyfin no necesita modificar tus archivos, y así un error de configuración nunca puede borrarlos.
- **Publicar el puerto solo en `127.0.0.1`.** Por defecto Docker lo expone en todas las interfaces de red. Si el acceso desde fuera va por un túnel (más abajo), no hay motivo para que el puerto quede abierto a la red local.

`docker compose up -d`, abrir `http://localhost:8096` y el asistente te guía para crear el usuario administrador y las bibliotecas.

## 2. La estructura de carpetas que Jellyfin espera

Esta es la parte que más tiempo me costó, y la más importante. Jellyfin identifica cada película y serie **por el nombre de la carpeta y del archivo**. Si la estructura no es la que espera, la serie aparece vacía, con los capítulos desordenados o duplicada.

```text
/srv/media/
├── peliculas/
│   └── Interestelar (2014)/
│       └── Interestelar (2014).mkv
└── series/
    └── Avatar - La leyenda de Aang (2005)/
        ├── Season 1/
        │   ├── Avatar - S01E01 - El chico del iceberg.mkv
        │   └── Avatar - S01E02 - El regreso del Avatar.mkv
        └── Season 2/
            └── …
```

Las reglas prácticas:

- **Nombre y año** en la carpeta: `Título (Año)`. El año evita confundir series con el mismo nombre (hay más de una *Ben 10*, por ejemplo).
- **`Season N`** para cada temporada y **`SxxExx`** en cada archivo.
- **Nada de carpetas extra en el medio.** Una estructura como `Serie/Nombre-del-release/S01/archivo.mkv` rompe la indexación. Hay que mover los archivos reales a `Serie/Season 1/`.
- **No uses enlaces simbólicos para "acomodar" la biblioteca.** Parece una solución elegante, pero Jellyfin indexa el archivo real **y** el enlace, y cada capítulo aparece dos veces. Mover (o copiar) el archivo es lo que funciona.

### Cuando el orden de los capítulos no coincide

A veces los archivos vienen numerados distinto al orden oficial de emisión. Para comparar, uso **TVMaze**, que tiene una API pública **sin clave**:

```bash
# 1) Buscar la serie (revisa la fecha de estreno: puede haber varias con el mismo nombre)
curl -s "https://api.tvmaze.com/search/shows?q=avatar+the+last+airbender"

# 2) Todos los capítulos con temporada, número, título y fecha de emisión
curl -s "https://api.tvmaze.com/shows/{id}/episodes" -o episodios.json
```

Con esa lista, un script en Python compara **por título normalizado** (minúsculas, sin tildes, sin signos) y renombra cada archivo a `Serie - SxxEyy - Título.ext`. Comparar por título y no por número es clave: si el número del archivo está mal, justamente es el que no puedes usar.

## 3. Pósters que faltan

Jellyfin descarga pósters y sinopsis de fuentes como TMDB. Casi siempre funciona, pero cuando una serie queda sin imágenes (por ejemplo, después de cambiar de proveedor de metadatos), refrescar desde la interfaz no siempre las recupera.

Lo más confiable que encontré: **poner la imagen a mano en la carpeta**. Jellyfin lee `poster.jpg` al refrescar:

```text
Avatar - La leyenda de Aang (2005)/
├── poster.jpg            ← póster de la serie
├── Season 1/
│   └── poster.jpg        ← póster de la temporada
```

Refrescas el ítem y aparece. Sin API keys y sin pelearte con los proveedores.

## 4. Verlo desde fuera de casa, sin abrir puertos

Mi servidor está detrás de **CGNAT**: no tengo IP pública, así que abrir puertos en el router ni siquiera es una opción. Y aunque lo fuera, exponer un servicio de casa directamente a internet no es buena idea.

La solución es un **túnel**. Con **Cloudflare Tunnel**, un pequeño programa (`cloudflared`) corre en el servidor y abre una conexión **saliente** hacia Cloudflare. Las visitas llegan a Cloudflare, que las manda por ese túnel al Jellyfin local. Del lado de mi casa no hay ningún puerto abierto.

```yaml
# ~/.cloudflared/config.yml (ejemplo)
tunnel: mi-tunel
credentials-file: /home/usuario/.cloudflared/mi-tunel.json
ingress:
  - hostname: media.ejemplo.com
    service: http://127.0.0.1:8096
  - service: http_status:404       # todo lo demás: 404
```

```bash
cloudflared tunnel route dns mi-tunel media.ejemplo.com   # crea el registro DNS
sudo systemctl restart cloudflared                        # aplicar cambios
```

A cambio obtienes HTTPS automático y tu dominio propio. Un detalle: reiniciar `cloudflared` corta por unos segundos **todos** los servicios que pasan por ese túnel, así que conviene agrupar los cambios.

(Para acceder solo tú, sin exponer nada a internet, otra opción excelente es **Tailscale**: una red privada entre tus dispositivos.)

## 5. Cuentas para cada persona

Cada persona tiene **su propia cuenta**: así cada uno tiene su historial, su "seguir viendo" y, si quieres, solo ciertas bibliotecas visibles. Las cuentas nuevas se crean sin permisos de administrador.

Se puede hacer desde el panel, pero también por la API, útil para automatizarlo. Una trampa de la versión 10.11: **el encabezado `X-Emby-Authorization` es obligatorio incluso para iniciar sesión**. Sin él, la respuesta es un críptico `Error processing request.`

```bash
curl -s -X POST http://127.0.0.1:8096/Users/AuthenticateByName \
  -H 'Content-Type: application/json' \
  -H 'X-Emby-Authorization: MediaBrowser Client=scripts, Device=servidor, DeviceId=scripts01, Version=1.0.0' \
  -d '{"Username":"admin","Pw":"…"}'
# → { "AccessToken": "…", "User": { "Policy": { "IsAdministrator": true } } }
```

Con ese token puedes listar usuarios (`GET /Users`), crear uno (`POST /Users/New`) y ponerle una contraseña temporal que la persona cambia en su primer ingreso. Nunca pidas contraseñas por chat.

## 6. Un disco que viene de Windows

Parte de mi biblioteca estaba en un disco externo formateado en NTFS. Linux lo lee sin problema con `ntfs-3g`, pero para que se monte solo en cada arranque hay que agregarlo a `/etc/fstab` **por UUID** (el nombre `/dev/sdb1` puede cambiar si conectas otro disco):

```bash
lsblk -o NAME,SIZE,FSTYPE,LABEL,UUID      # encontrar el UUID de la partición
sudo mkdir -p /srv/media/externo
sudo mount -t ntfs-3g /dev/sdb1 /srv/media/externo   # probar a mano primero
```

```text
# /etc/fstab
UUID=XXXXXXXXXXXXXXXX  /srv/media/externo  ntfs-3g  defaults,uid=1000,gid=1000,nofail  0  0
```

Montarlo a mano y verificar que ves tus archivos **antes** de tocar `fstab` evita sustos. Y `nofail` hace que el servidor arranque igual si el disco no está conectado.

## Tips para un servidor modesto

Mi servidor no tiene una GPU ni un procesador potente. En un equipo así, lo que más ayuda es:

- **Priorizar la reproducción directa.** Convertir video en tiempo real (transcodificar) es lo que más CPU consume. Si los archivos están en formatos que el celular y la tele reproducen de forma nativa (H.264/H.265 en MKV o MP4), el servidor casi no trabaja: solo entrega el archivo.
- **Las apps oficiales** de Jellyfin (Android, Android TV, navegador) suelen reproducir directo más formatos que otras.
- **Los escaneos de biblioteca corren en segundo plano.** Un escaneo aceptado no es un escaneo terminado: si algo "no aparece", espera a que termine antes de buscar el error.

## Lo que aprendí

- **La estructura de carpetas es el 80 % del trabajo.** Jellyfin es tan bueno como el orden de tus archivos.
- **Los atajos elegantes a veces duplican todo.** Los enlaces simbólicos parecían la solución perfecta y resultaron ser el problema.
- **Nunca expongas un servicio de casa directo a internet.** Un túnel o una red privada te dan acceso desde cualquier lado sin abrir la puerta de tu red.
- **Documentar las trampas.** Cada problema de esta lista quedó escrito en los procedimientos del agente que cuida mi servidor, y ya no se repite.
