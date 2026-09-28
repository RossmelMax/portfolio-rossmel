---
title: 'Cambiar de bootloader sin miedo: probar Limine una sola vez con BootNext'
description: 'Para rOS, mi flavor de Arch, reemplacé GRUB por Limine sin arriesgar el arranque: instalarlo al lado, probarlo en un único reinicio y promoverlo solo si funciona. Scripts idempotentes, hooks de pacman y copias atómicas a la ESP.'
date: 2026-09-19
tags: ['linux']
project: 'ros'
lang: 'es'
---

Tocar el bootloader da miedo, y con razón: si algo sale mal, la computadora no arranca y el problema está justo antes del sistema que usarías para arreglarlo.

Para **rOS**, mi propio flavor de Arch, quería cambiar GRUB por **Limine**: es más simple, arranca rápido y permite personalizar la pantalla de inicio con la identidad de rOS (fondo, colores, nombre). Pero no estaba dispuesto a quedarme con una laptop que no arranca. Este artículo cuenta el procedimiento que usé, y que sirve para cualquier cambio de arranque en un equipo UEFI.

## La idea: nunca reemplazar, siempre agregar y probar

El plan tiene tres pasos, cada uno reversible:

1. **Instalar Limine al lado de GRUB**, sin tocar GRUB ni el orden de arranque.
2. **Probarlo en un único reinicio** usando `BootNext` de UEFI.
3. **Promoverlo** a primera opción solo si funcionó. GRUB queda como respaldo.

La pieza clave es `BootNext`: una variable de UEFI que dice "en el próximo arranque, y **((solo en ese))**, usa esta entrada". Si Limine falla, basta con reiniciar: el firmware vuelve solo al orden normal y entra por GRUB.

```bash
efibootmgr -n "$NUM"   # próximo arranque, UNA sola vez, entra a Limine
```

## Paso 1: instalar al lado, con respaldo previo

El script de instalación es **==idempotente==**: se puede correr diez veces y el resultado es el mismo. Si Limine ya está instalado, solo actualiza la configuración, el fondo y el binario en la partición EFI (ESP).

Antes de tocar nada, respalda lo que va a cambiar:

```bash
set -e
BK=/var/backups/ros-limine-$(date +%Y%m%d-%H%M%S); mkdir -p "$BK"
cp -a /boot/efi/EFI "$BK/ESP-EFI"                  # copia de toda la carpeta EFI
efibootmgr -v > "$BK/efibootmgr-antes.txt"         # y del orden de arranque actual
```

Un detalle de `efibootmgr --create` que es fácil pasar por alto: **crea la entrada nueva y la pone primera** en el orden de arranque. Si no lo corriges, en el siguiente reinicio Limine ya es el predeterminado, sin haberlo probado. Por eso, hasta que se promueva, el script la manda al final:

```bash
find_num() { efibootmgr | sed -n 's/^Boot\([0-9A-F]\{4\}\)\*\{0,1\} rOS[[:space:]].*/\1/p' | head -1; }
NUM=$(find_num)
if [ -z "$NUM" ]; then
  efibootmgr --create --disk /dev/nvme0n1 --part 1 --label "rOS" --loader '\EFI\rOS\limine.efi'
  NUM=$(find_num)
fi
if [ ! -e /var/lib/ros-limine-promoted ]; then
  REST=$(efibootmgr | sed -n 's/^BootOrder: //p' | tr ',' '\n' | grep -v "^$NUM$" | paste -sd,)
  efibootmgr -o "$REST,$NUM"                       # Limine ÚLTIMO hasta que se pruebe
fi
efibootmgr -n "$NUM"                               # probar una sola vez
```

El archivo `/var/lib/ros-limine-promoted` funciona como bandera: si el script se vuelve a correr después de promover, no deshace la promoción.

## Paso 2: el kernel tiene que estar donde Limine lo pueda leer

Acá apareció el primer problema real. Limine lee el kernel directamente del sistema de archivos, pero **no podía leer mi partición raíz ext4**: tenía activada una función reciente de ext4 (`orphan_file`) que Limine no soporta.

La solución: copiar el kernel y el initramfs a la **ESP**, que es FAT y Limine la lee sin problemas. Pero entonces cada actualización del kernel tiene que volver a copiarlos, o Limine arrancaría un kernel viejo con módulos nuevos.

Para eso sirven los **hooks de pacman**, que se ejecutan después de cada transacción que toque ciertos archivos o paquetes:

```ini
[Trigger]
Operation = Install
Operation = Upgrade
Type = Path
Target = usr/lib/modules/*/vmlinuz
Target = usr/lib/initcpio/*

[Trigger]
Operation = Install
Operation = Upgrade
Type = Package
Target = linux
Target = mkinitcpio
Target = intel-ucode

[Action]
Description = Sincronizando kernel e initramfs con la ESP de Limine (rOS)...
When = PostTransaction
Exec = /usr/local/bin/ros-limine-sync
```

(Hay un segundo hook igual de simple: cuando se actualiza el paquete `limine`, copia el binario nuevo a la ESP.)

## Copiar a la ESP de forma atómica

La ESP suele ser chica, y un kernel con su initramfs pesa bastante. Si la copia se queda a la mitad por falta de espacio, el archivo queda corrupto y la computadora no arranca. `ros-limine-sync` se cuida de tres formas:

```bash
for f in vmlinuz-linux initramfs-linux.img; do
  src=/boot/$f; dst=$DST/$f
  cmp -s "$src" "$dst" && continue                       # 1) si no cambió, no hacer nada
  need=$(( $(stat -c %s "$src") / 1024 + 4096 ))         # 2) ¿hay espacio? (+4 MiB de margen)
  avail=$(df --output=avail -k "$ESP" | tail -1)
  if [ "$avail" -lt "$need" ]; then
    echo "ERROR: sin espacio en la ESP para $f; no se toca"; rc=1; continue
  fi
  # 3) copiar a un archivo temporal y renombrar: el reemplazo es atómico
  if cp "$src" "$dst.new" && sync "$dst.new" && mv -f "$dst.new" "$dst"; then
    echo "actualizado $f"
  else
    rm -f "$dst.new"; echo "ERROR copiando $f (se conserva la versión anterior)"; rc=1
  fi
done
```

El patrón **escribir en `.new` y después `mv`** es el truco más útil de todo el proyecto: `mv` dentro del mismo sistema de archivos es atómico. O queda el archivo viejo completo, o el nuevo completo. Nunca uno a medias.

## Paso 3: promover (y cómo volver atrás)

Si el arranque de prueba funcionó, el script de promoción pone Limine primero y deja la bandera:

```bash
REST=$(efibootmgr | sed -n 's/^BootOrder: //p' | tr ',' '\n' | grep -v "^$NUM$" | paste -sd,)
efibootmgr -o "$NUM,$REST"
touch /var/lib/ros-limine-promoted
```

Y la configuración de Limine incluye una entrada que **carga GRUB** (`efi_chainload`), además de Windows y una entrada "verbose" del kernel para diagnosticar. Así, incluso con Limine como predeterminado, GRUB está a una tecla de distancia.

## El mismo patrón, en todo rOS

Esta forma de trabajar (agregar al lado, probar, promover, con un rollback escrito de antemano) la terminé usando para todo:

- **El greeter** (la pantalla de inicio de sesión): un script activa el nuevo sobre `greetd` y otro, pensado para correr desde una TTY con `Ctrl+Alt+F3`, vuelve al anterior si la pantalla no aparece.
- **Las actualizaciones**: antes de actualizar paquetes, un snapshot de Timeshift.
- **Los diagnósticos**: un script de **solo lectura** que junta en un archivo todo lo que necesito para entender un problema de arranque (particiones, contenido de la ESP, configuración), sin modificar nada.

## Lo que aprendí

- **Todo cambio al sistema tiene que ser reversible, y el rollback se escribe antes del cambio.** Cuando algo falla, no es momento de pensar cómo deshacerlo.
- **`BootNext` es el "probar sin comprometerse" del arranque.** Si no lo conocías, vale oro.
- **Idempotencia y copias atómicas.** Un script que se puede correr dos veces sin miedo y archivos que nunca quedan a medias eliminan la mayoría de los desastres.
- **Entender el arranque de punta a punta** (firmware UEFI, ESP, bootloader, kernel, initramfs, greeter) me quitó el miedo a romper el sistema. Y cuando no tienes miedo de romperlo, aprendes mucho más rápido.
