---
title: 'Your own Netflix at home: a media center with Jellyfin, Docker and secure access'
description: 'How I built Selflix, my Jellyfin media center on a modest home server: Docker, the folder structure Jellyfin expects, access from outside without opening ports, per-person accounts and the pitfalls that cost me hours.'
date: 2026-09-26
tags: ['homelab', 'linux', 'docker']
project: 'selflix'
lang: 'en'
translationOf: 'media-center-propio-con-jellyfin'
---

If you have movies and shows scattered across folders and drives (in my case, one of them came from Windows), watching something ends up being opening folders, guessing which episode was next and copying the file to your phone.

**Jellyfin** solves that: it's a free, open-source media server that organizes your library, downloads posters and synopses, remembers where you left off and has apps for phones, TVs and the browser. It's like having your own Netflix, with your own files and no subscription.

That's how **Selflix**, my media center, was born. It runs on my homelab, a fairly modest home server, and this post covers how to set it up and the pitfalls I found along the way.

## 1. Jellyfin in Docker

Docker is the cleanest way to install it: the configuration lives in one folder, updating means changing the image and you don't clutter the system.

```yaml
# docker-compose.yml
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin
    user: 1000:1000                 # your user: new files belong to you
    ports:
      - 127.0.0.1:8096:8096         # only reachable from the machine itself (see step 4)
    volumes:
      - ./config:/config            # database, users, metadata
      - ./cache:/cache
      - /srv/media:/media:ro        # your movies and shows, read-only
    restart: unless-stopped
```

Two decisions I recommend:

- **The library read-only (`:ro`).** Jellyfin doesn't need to modify your files, and this way a configuration mistake can never delete them.
- **Publish the port only on `127.0.0.1`.** By default Docker exposes it on every network interface. If outside access goes through a tunnel (below), there's no reason to leave the port open to the local network.

`docker compose up -d`, open `http://localhost:8096` and the wizard walks you through creating the admin user and the libraries.

## 2. The folder structure Jellyfin expects

This is the part that took me the most time, and the most important one. Jellyfin identifies each movie and show **by the folder and file name**. If the structure isn't what it expects, the show appears empty, with episodes out of order or duplicated.

```text
/srv/media/
├── movies/
│   └── Interstellar (2014)/
│       └── Interstellar (2014).mkv
└── shows/
    └── Avatar - The Last Airbender (2005)/
        ├── Season 1/
        │   ├── Avatar - S01E01 - The Boy in the Iceberg.mkv
        │   └── Avatar - S01E02 - The Avatar Returns.mkv
        └── Season 2/
            └── …
```

The practical rules:

- **Name and year** in the folder: `Title (Year)`. The year avoids mixing up shows with the same name (there's more than one *Ben 10*, for example).
- **`Season N`** for each season and **`SxxExx`** in every file.
- **No extra folders in between.** A structure like `Show/Release-Name/S01/file.mkv` breaks indexing. You have to move the real files into `Show/Season 1/`.
- **Don't use symlinks to "arrange" the library.** It looks like an elegant solution, but Jellyfin indexes the real file **and** the link, and every episode shows up twice. Moving (or copying) the file is what works.

### When the episode order doesn't match

Sometimes files come numbered differently from the official air order. To compare, I use **TVMaze**, which has a public API with **no key**:

```bash
# 1) Find the show (check the premiere date: there may be several with the same name)
curl -s "https://api.tvmaze.com/search/shows?q=avatar+the+last+airbender"

# 2) Every episode with season, number, title and air date
curl -s "https://api.tvmaze.com/shows/{id}/episodes" -o episodes.json
```

With that list, a Python script compares **by normalized title** (lowercase, no accents, no punctuation) and renames each file to `Show - SxxEyy - Title.ext`. Comparing by title rather than number is key: if the file's number is wrong, it's exactly the one you can't use.

## 3. Missing posters

Jellyfin downloads posters and synopses from sources like TMDB. It almost always works, but when a show ends up with no images (for example, after switching metadata providers), refreshing from the UI doesn't always bring them back.

The most reliable fix I found: **put the image in the folder by hand**. Jellyfin reads `poster.jpg` on refresh:

```text
Avatar - The Last Airbender (2005)/
├── poster.jpg            ← show poster
├── Season 1/
│   └── poster.jpg        ← season poster
```

Refresh the item and it appears. No API keys and no fighting with providers.

## 4. Watching from outside home, without opening ports

My server sits behind **((CGNAT))**: I don't have a public IP, so opening ports on the router isn't even an option. And even if it were, exposing a home service directly to the internet isn't a good idea.

The solution is a **tunnel**. With **Cloudflare Tunnel**, a small program (`cloudflared`) runs on the server and opens an **outbound** connection to Cloudflare. Visitors reach Cloudflare, which sends them through that tunnel to the local Jellyfin. On my home's side, no port is open.

```yaml
# ~/.cloudflared/config.yml (example)
tunnel: my-tunnel
credentials-file: /home/user/.cloudflared/my-tunnel.json
ingress:
  - hostname: media.example.com
    service: http://127.0.0.1:8096
  - service: http_status:404       # everything else: 404
```

```bash
cloudflared tunnel route dns my-tunnel media.example.com   # creates the DNS record
sudo systemctl restart cloudflared                          # apply changes
```

In return you get automatic HTTPS and your own domain. One detail: restarting `cloudflared` cuts **every** service going through that tunnel for a few seconds, so it's worth batching changes.

(For access only for yourself, without exposing anything to the internet, another excellent option is **Tailscale**: a private network between your devices.)

## 5. One account per person

Each person gets **==their own account==**: that way everyone has their own history, their own "continue watching" and, if you want, only certain libraries visible. New accounts are created without admin permissions.

You can do it from the dashboard, but also through the API, which is handy for automating it. A gotcha in version 10.11: **the `X-Emby-Authorization` header is required even to log in**. Without it, the response is a cryptic `Error processing request.`

```bash
curl -s -X POST http://127.0.0.1:8096/Users/AuthenticateByName \
  -H 'Content-Type: application/json' \
  -H 'X-Emby-Authorization: MediaBrowser Client=scripts, Device=server, DeviceId=scripts01, Version=1.0.0' \
  -d '{"Username":"admin","Pw":"…"}'
# → { "AccessToken": "…", "User": { "Policy": { "IsAdministrator": true } } }
```

With that token you can list users (`GET /Users`), create one (`POST /Users/New`) and set a temporary password the person changes on first login. Never ask for passwords over chat.

## 6. A drive that came from Windows

Part of my library was on an external drive formatted as NTFS. Linux reads it without trouble with `ntfs-3g`, but for it to mount automatically on every boot you have to add it to `/etc/fstab` **by UUID** (the `/dev/sdb1` name can change if you plug in another drive):

```bash
lsblk -o NAME,SIZE,FSTYPE,LABEL,UUID      # find the partition's UUID
sudo mkdir -p /srv/media/external
sudo mount -t ntfs-3g /dev/sdb1 /srv/media/external   # test by hand first
```

```text
# /etc/fstab
UUID=XXXXXXXXXXXXXXXX  /srv/media/external  ntfs-3g  defaults,uid=1000,gid=1000,nofail  0  0
```

Mounting it by hand and checking you can see your files **before** touching `fstab` saves you some scares. And `nofail` lets the server boot even if the drive isn't connected.

## Tips for a modest server

My server has no GPU and no powerful CPU. On a machine like that, what helps most is:

- **Prefer direct play.** Converting video on the fly (transcoding) is what uses the most CPU. If files are in formats the phone and TV play natively (H.264/H.265 in MKV or MP4), the server barely works: it just hands over the file.
- **The official Jellyfin apps** (Android, Android TV, browser) usually direct-play more formats than others.
- **Library scans run in the background.** An accepted scan isn't a finished scan: if something "doesn't show up", wait for it to finish before hunting for the bug.

## What I learned

- **Folder structure is 80% of the work.** Jellyfin is only as good as the order of your files.
- **Elegant shortcuts sometimes duplicate everything.** Symlinks looked like the perfect solution and turned out to be the problem.
- **Never expose a home service straight to the internet.** A tunnel or a private network gives you access from anywhere without opening the door to your network.
- **Document the pitfalls.** Every problem on this list was written into the procedures of the agent that looks after my server, and it doesn't happen again.
