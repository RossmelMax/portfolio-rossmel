---
title: 'Coding before and after AI: what years of doing it by hand left me'
description: 'I learned the old-school way, and we only brought AI into our work during my last year at WANT. What changed, what didn''t, and how I decide when to let AI move fast and when to review with a magnifying glass.'
date: 2026-09-16
tags: ['ai', 'career']
lang: 'en'
translationOf: 'programar-antes-de-la-ia'
pinned: true
---

Today anyone can ask a model to "build me a to-do app" and have something running in ten minutes. It's amazing, and I use it every day. But the way I use AI has a lot to do with how I learned to code before it existed.

## How I learned: no shortcuts

I started on my own in 2019, with my first personal computer. There were no assistants completing code: there was documentation, courses, forums and many "why isn't this working?" nights.

In 2022 I joined WANT Digital Agency as an intern. The dev team was two people: my boss on the backend and me on the frontend. There I built the web and mobile interfaces of real products for clients in Bolivia and the United States: a multi-tenant SaaS for auto repair shops, React Native apps, a digital menu for restaurants, websites.

For almost all of that time **we coded by hand**. If something broke in production, you had to read the stack trace, reproduce the error and understand the whole flow until you found the cause. We only brought AI into our work in my **last year** at WANT.

Those years left me something I value a lot today: when AI hands me code, **I understand it**. I know why it works, where it's going to break and how to maintain it.

## When the boom hit

When the AI boom hit I tried pretty much everything that came out:

- **GitHub Copilot**, for autocomplete inside the editor.
- **ChatGPT**, **Gemini** and **DeepSeek**, to research, explain errors and discuss approaches.
- **Groq**, for its speed, which I ended up using inside my own products (in SGPG it extracts the data from each PDF).
- **Local models** with Ollama, for private things and to not depend on the internet (in AdvAI, a local model is the first choice).
- And lately **Claude**, which is now the core tool of my workflow.

Each one has its place, and none of them replaced what came before: they added to a foundation that already existed.

## What changed

AI made me **much faster**. A form with validation, a CRUD endpoint, a migration script: things that used to take me an afternoon now take minutes, and the time I save goes into design, architecture and detail.

It also made me **more curious**. With someone to ask at 3 a.m., I dared to dive into topics that used to feel far away: hybrid search and LLM evaluation for my capstone, bootloaders and Wayland for my own flavor of Arch, tunnels and systemd for my home server. AI didn't learn those things for me: it kept me company while I learned them.

## Two speeds

Not every project deserves the same care, and a good part of the judgment lives there:

- **Explore.** A prototype, a tool for myself, a weekend experiment: I let AI move fast and focus on whether the idea works. If something fails, I read it and understand it on the spot.
- **Ship.** Something going to production, used by a client or handling other people's data: there I review the diff, think about the edge cases and make sure I can explain every part.

Switching from one speed to the other comes naturally when you understand the code. SGPG, for example, started as a prototype generated with v0 in a few hours; turning it into something the head of my university program actually uses (permissions, document versioning, a PDF viewer that doesn't eat all the RAM) was engineering work, and it was possible because I knew what I was looking at.

## What works for me

A few practices I've adopted, especially for things that ship:

1. **Problem first, prompt second.** Before asking for code, I'm clear on what has to happen, with what data and what must not break. A good request comes from understanding the problem.
2. **Tests measure the code, not the other way around.** If a test fails, you fix the code. When a suggestion "adjusts" what the test checks, I read it twice.
3. **Measure instead of believing.** In AdvAI I built an evaluation set instead of trusting that "the answers look good". Retrieval went from 42.9% to 80% because every change was compared with numbers. I tell that story in [this post](/en/blog/stopping-an-llm-from-inventing-legal-citations/).
4. **I decide the architecture.** AI is great at writing a function; deciding where it lives, what data it sees and what happens when it fails is still the job.
5. **Read the diff as if it were someone else's.** Because, in a way, it is.

## In short

AI has boosted me a lot and made me even more eager to keep learning and understand every technology that comes my way. I use it as a multiplier, and a multiplier multiplies what you already have: the years of coding by hand are exactly what lets me get so much out of it today.

If you're just starting, my advice is simple: **use AI to learn, too**. Ask it to explain, not just to solve. You'll notice the difference the day something breaks.
