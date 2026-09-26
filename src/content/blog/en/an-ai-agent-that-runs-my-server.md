---
title: 'An AI agent that runs my server: memory in files and skills as procedures'
description: 'My homelab is maintained by an agent (OpenClaw) running 24/7. What makes it reliable isn''t the model: it''s memory written in Markdown, explicit red lines and procedures with success criteria. Here''s how I organized it.'
date: 2026-09-23
tags: ['ai', 'linux']
project: 'homelab'
lang: 'en'
translationOf: 'agente-de-ia-que-opera-mi-servidor'
---

At home I have a modest server: a 4-thread Pentium with less than 4 GB of RAM, behind CGNAT (no public IP, no open ports). It still serves a dozen services with HTTPS, backups and monitoring.

Most of the time, the one maintaining it isn't me: it's an **AI agent** based on OpenClaw that runs 24/7 and that I talk to through a web chat or Telegram. It updates packages, checks services, runs backups and reports back.

An agent like that, out of the box, is "a chat with terminal access": useful, but unpredictable. Every session starts from scratch, it can repeat a mistake it already made and sign off on something that isn't right. What makes it reliable isn't the model. It's **writing things down**.

## 1. Memory lives in files

A model remembers nothing between sessions. OpenClaw's solution is simple and powerful: memory is a **workspace of Markdown files** versioned with git.

```text
workspace/
├── AGENTS.md        # how to work: rules, limits, flow
├── USER.md          # who I am, how I like to be talked to
├── MEMORY.md        # long-term memory, curated
├── memory/
│   └── 2026-09-25.md  # raw notes for the day
└── skills/          # procedures (see below)
```

- **Daily notes** are the raw log: what was done, what failed, what's pending.
- **MEMORY.md** is the distilled version: decisions, context and lessons that hold forever. Every so often, the agent rereads the daily notes and moves what matters into long-term memory.
- An important privacy rule: MEMORY.md holds personal context, so it's **only loaded in conversations with me**, never in shared contexts.

The instruction with the biggest impact is in AGENTS.md: *"mental notes don't survive a restart; files do"*. If I tell it "remember this", it writes it down. If it makes a mistake, it documents it so it doesn't happen again.

## 2. Explicit red lines

An agent with terminal access can do a lot of damage with good intentions. So AGENTS.md sets clear limits:

- **Never take private data off the machine.** Ever.
- **Don't run destructive commands without asking.**
- **Before changing a configuration** (crontab, systemd units, service configs, shell files), **inspect the current state** and preserve or merge by default. No overwriting a whole file to change one line.
- **Prefer `trash` over `rm`**: recoverable beats gone.
- **Ask before anything that leaves the machine**: emails, posts, any external action.

And one rule that saved me a lot of work: before building something custom, **check whether it already exists** as an open-source tool or plugin. Only build it if what exists doesn't fit.

## 3. Skills: procedures with success criteria

This is the part I enjoyed designing the most. Every task that repeats (or that went wrong once) becomes a **skill**: a Markdown file with a step-by-step procedure. The key is that **every step has a verifiable success criterion**.

For example, the skill for **picking a project back up after weeks away**:

```markdown
---
name: resume-project-after-gap
description: Resume a project after a gap: reconstruct repo state, uncommitted work
  and pending problems from git + memory.
---

## Steps
1. Search memory for the project (daily notes and "Pending" sections).
   Criterion: you have the summaries of previous sessions that mention it.
2. Snapshot the git state: status, recent commits, diff, stash and reflog.
   Criterion: you know the branch, the last commit date, uncommitted files and any stash.
3. Date the uncommitted work: compare the files' modification time
   with the last commit's date.
   Criterion: you can state when the pending changes were made.
4. Verify the uncommitted code compiles before describing it as usable.
   Criterion: typecheck result known.
5. Report the state and propose the next step. Don't edit anything until the user confirms.

## Pitfalls
- Compiling is not the same as working: parsing changes need real input files
  before promising they work.
```

Three things make this format work:

- **Criteria, not intentions.** "Check the services" is vague; "every service confirmed active, or a fix applied and re-verified" leaves no room for a made-up "all good".
- **The pitfalls section.** Every time the agent got something wrong, the cause was written down. For example: running a plain `grep` over a log that contains binary bytes silently returns 0 matches (you need `grep -a`); or declaring a service down because its systemd unit name was misspelled.
- **Ending with "don't do anything without confirmation"** on tasks where the next step is my decision.

## 4. Automating with a cheaper model

With the procedures written down, scheduled tasks no longer need the most expensive model. **Weekly maintenance** runs on its own, in an isolated session, with a fast and cheap model following the skill to the letter:

1. Update packages.
2. If the kernel was updated, note that a reboot is pending. **Never reboot on its own**: services keep running on the old kernel in memory, and I pick when to reboot.
3. Check each service with the right method for it (an HTTP 401 from a service with authentication means it's **up**, not that it failed).
4. Back up the agent's databases and prune backups older than three weeks.
5. Short report: packages updated, reboot pending or not, backups created and free disk space.

The last rule of that skill is my favorite: *"if a command finishes suspiciously fast, verify with a different method before reporting"*. It's exactly what an experienced person would do.

## What I learned

- **An agent is only as good as its documentation.** Written memory, limits and procedures matter more than the model you use.
- **Verifiable success criteria are what prevent operational hallucinations.** The agent can't say "done" if it can't show the criterion was met.
- **Documenting mistakes pays off more than avoiding them.** Every written pitfall is a mistake that doesn't repeat.
- And something that applies beyond agents: **writing clear procedures made me understand my own server better.** If you can't explain it step by step to an agent, you probably don't have it clear yourself.
