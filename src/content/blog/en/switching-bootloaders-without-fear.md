---
title: 'Switching bootloaders without fear: test Limine once with BootNext'
description: 'For rOS, my flavor of Arch, I replaced GRUB with Limine without risking the boot: install it side by side, test it on a single reboot and promote it only if it works. Idempotent scripts, pacman hooks and atomic copies to the ESP.'
date: 2026-09-19
tags: ['linux']
project: 'ros'
lang: 'en'
translationOf: 'cambiar-de-bootloader-sin-miedo'
---

Touching the bootloader is scary, and for good reason: if something goes wrong, the computer doesn't boot, and the problem sits right before the system you'd use to fix it.

For **rOS**, my own flavor of Arch, I wanted to switch from GRUB to **Limine**: it's simpler, boots fast and lets you customize the boot screen with the rOS identity (wallpaper, colors, name). But I wasn't willing to end up with a laptop that won't boot. This post covers the procedure I used, which works for any boot change on a UEFI machine.

## The idea: never replace, always add and test

The plan has three steps, each one reversible:

1. **Install Limine alongside GRUB**, without touching GRUB or the boot order.
2. **Test it on a single reboot** using UEFI's `BootNext`.
3. **Promote it** to first option only if it worked. GRUB stays as a fallback.

The key piece is `BootNext`: a UEFI variable that says "on the next boot, and **((only that one))**, use this entry". If Limine fails, just reboot: the firmware goes back to the normal order on its own and boots GRUB.

```bash
efibootmgr -n "$NUM"   # next boot, ONCE only, goes into Limine
```

## Step 1: install side by side, with a backup first

The install script is **==idempotent==**: you can run it ten times and the result is the same. If Limine is already installed, it only updates the config, the wallpaper and the binary on the EFI partition (ESP).

Before touching anything, back up what's about to change:

```bash
set -e
BK=/var/backups/ros-limine-$(date +%Y%m%d-%H%M%S); mkdir -p "$BK"
cp -a /boot/efi/EFI "$BK/ESP-EFI"                  # copy of the whole EFI folder
efibootmgr -v > "$BK/efibootmgr-antes.txt"         # and of the current boot order
```

A detail of `efibootmgr --create` that's easy to miss: **it creates the new entry and puts it first** in the boot order. If you don't fix that, on the next reboot Limine is already the default, untested. So, until it's promoted, the script moves it to the end:

```bash
find_num() { efibootmgr | sed -n 's/^Boot\([0-9A-F]\{4\}\)\*\{0,1\} rOS[[:space:]].*/\1/p' | head -1; }
NUM=$(find_num)
if [ -z "$NUM" ]; then
  efibootmgr --create --disk /dev/nvme0n1 --part 1 --label "rOS" --loader '\EFI\rOS\limine.efi'
  NUM=$(find_num)
fi
if [ ! -e /var/lib/ros-limine-promoted ]; then
  REST=$(efibootmgr | sed -n 's/^BootOrder: //p' | tr ',' '\n' | grep -v "^$NUM$" | paste -sd,)
  efibootmgr -o "$REST,$NUM"                       # Limine LAST until it's tested
fi
efibootmgr -n "$NUM"                               # test it once
```

The `/var/lib/ros-limine-promoted` file works as a flag: if the script runs again after promotion, it doesn't undo the promotion.

## Step 2: the kernel has to be where Limine can read it

This is where the first real problem showed up. Limine reads the kernel straight from the filesystem, but **it couldn't read my ext4 root partition**: it had a recent ext4 feature enabled (`orphan_file`) that Limine doesn't support.

The fix: copy the kernel and the initramfs to the **ESP**, which is FAT and Limine reads it just fine. But then every kernel update has to copy them again, or Limine would boot an old kernel with new modules.

That's what **pacman hooks** are for: they run after every transaction that touches certain files or packages:

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
Description = Syncing kernel and initramfs to the Limine ESP (rOS)...
When = PostTransaction
Exec = /usr/local/bin/ros-limine-sync
```

(There's a second, equally simple hook: when the `limine` package is updated, it copies the new binary to the ESP.)

## Copying to the ESP atomically

The ESP is usually small, and a kernel plus its initramfs is fairly heavy. If the copy stops halfway because of missing space, the file is corrupted and the computer won't boot. `ros-limine-sync` protects against that in three ways:

```bash
for f in vmlinuz-linux initramfs-linux.img; do
  src=/boot/$f; dst=$DST/$f
  cmp -s "$src" "$dst" && continue                       # 1) unchanged: do nothing
  need=$(( $(stat -c %s "$src") / 1024 + 4096 ))         # 2) enough space? (+4 MiB margin)
  avail=$(df --output=avail -k "$ESP" | tail -1)
  if [ "$avail" -lt "$need" ]; then
    echo "ERROR: not enough space on the ESP for $f; leaving it untouched"; rc=1; continue
  fi
  # 3) copy to a temp file and rename: the replacement is atomic
  if cp "$src" "$dst.new" && sync "$dst.new" && mv -f "$dst.new" "$dst"; then
    echo "updated $f"
  else
    rm -f "$dst.new"; echo "ERROR copying $f (keeping the previous version)"; rc=1
  fi
done
```

The **write to `.new`, then `mv`** pattern is the most useful trick in the whole project: `mv` within the same filesystem is atomic. You either have the complete old file or the complete new one. Never a half-written one.

## Step 3: promote (and how to roll back)

If the test boot worked, the promotion script puts Limine first and sets the flag:

```bash
REST=$(efibootmgr | sed -n 's/^BootOrder: //p' | tr ',' '\n' | grep -v "^$NUM$" | paste -sd,)
efibootmgr -o "$NUM,$REST"
touch /var/lib/ros-limine-promoted
```

And the Limine config includes an entry that **loads GRUB** (`efi_chainload`), plus Windows and a "verbose" kernel entry for diagnostics. So even with Limine as the default, GRUB is one key away.

## The same pattern, all over rOS

This way of working (add alongside, test, promote, with a rollback written in advance) ended up being how I do everything:

- **The greeter** (the login screen): one script enables the new one on top of `greetd`, and another one, meant to be run from a TTY with `Ctrl+Alt+F3`, reverts to the previous one if the screen doesn't show up.
- **Updates**: a Timeshift snapshot before updating packages.
- **Diagnostics**: a **read-only** script that collects into one file everything I need to understand a boot problem (partitions, ESP contents, config), without modifying anything.

## What I learned

- **Every system change must be reversible, and the rollback is written before the change.** When something breaks is not the time to figure out how to undo it.
- **`BootNext` is the "try without committing" of booting.** If you didn't know about it, it's gold.
- **Idempotency and atomic copies.** A script you can run twice without fear and files that are never half-written eliminate most disasters.
- **Understanding boot end to end** (UEFI firmware, ESP, bootloader, kernel, initramfs, greeter) took away my fear of breaking the system. And when you're not afraid of breaking it, you learn much faster.
