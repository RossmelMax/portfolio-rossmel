---
title: 'Anonymizing a contract before sending it to an LLM (without another LLM)'
description: 'In AdvAI no name, ID number or tax ID leaves the machine: a rule-based anonymizer swaps them for stable placeholders and the system restores them in the answer. How it works and why I didn''t use AI for it.'
date: 2026-09-22
tags: ['ai', 'llm', 'privacy', 'python']
project: 'advai'
lang: 'en'
translationOf: 'anonimizar-antes-de-llamar-a-un-llm'
---

A contract is full of personal data: full names, national ID numbers, tax IDs, phone numbers, addresses, license plates, property registry numbers. If you want to analyze it with a cloud model (Groq, Gemini…), all of that travels to a server you don't control.

In **AdvAI**, my capstone project, the rule is simple: **only anonymized text reaches the cloud**. This post explains how I solved it and why the solution wasn't "another AI model".

## The temptation: using an LLM to anonymize

The first thing anyone thinks of is asking a model: "replace the personal data in this text". It has two problems:

1. **To anonymize with a cloud model, you first have to send it the data.** Exactly what you wanted to avoid.
2. **It's not deterministic.** Today it replaces the name, tomorrow one slips through. And you can't test it with a test that always passes.

So AdvAI's anonymizer is **plain code**: regular expressions and rules designed for Bolivian contracts. No external services, fast, and with results you can test.

## Stable placeholders, not asterisks

The key idea: don't delete the data, **replace it with placeholders that keep the meaning**. The model needs to know that "the seller" and "the buyer" are different people and who committed to what.

- The parties to the contract are replaced by **their role**: `[VENDEDOR]` (seller), `[COMPRADORA]` (buyer), `[ARRENDATARIO]` (tenant)…
- Other people and companies: `[PERSONA_1]`, `[EMPRESA_1]`…
- Identifying data: `[CI_1]` (ID number), `[NIT_1]` (tax ID), `[TELEFONO_1]`, `[PLACA_1]` (license plate), `[DIRECCION_1]` (address)…

And what the legal analysis **does need** is kept: amounts, percentages, deadlines and dates.

A before and after (with made-up data; contracts are in Spanish, so the example is too):

```text
Before: Juan Carlos Pérez Rojas, con C.I. 1234567 CB, en adelante EL VENDEDOR,
        y María López, en adelante LA COMPRADORA, acuerdan el precio de Bs 50.000.

After:  [VENDEDOR], con [CI_1], en adelante EL VENDEDOR,
        y [COMPRADORA], en adelante LA COMPRADORA, acuerdan el precio de Bs 50.000.
```

## Detecting the parties: "hereinafter THE SELLER"

Contracts have an almost universal formula to define the parties: *"…, en adelante EL VENDEDOR"* ("hereinafter THE SELLER"), *"…, en adelante denominada LA ARRENDATARIA"*. That formula is a gift: it gives me the name **and** the role at once.

The regular expression (simplified) looks for a name or a company name, some data in between and the phrase "en adelante":

```python
DEF_PARTE = re.compile(
    rf"(?P<quien>{EMPRESA}|{NOMBRE})"        # person or company name
    rf"(?P<medio>[^.;]{{0,260}}?)"          # data in between (ID number, address…)
    rf"en\s+adelante\s+(?:denominad[oa]s?\s+|llamad[oa]s?\s+)?"
    rf"(?P<rol>(?:EL|LA|LOS|LAS)\s+[A-ZÁÉÍÓÚÑ ]{{2,40}}?)",
    re.S)
```

`NOMBRE` is 2 to 5 capitalized words (allowing "de", "del", "de la" between surnames) and `EMPRESA` is a sequence of words ending in a corporate suffix: `S.R.L.`, `S.A.`, `Ltda.`… So "Juan Carlos Pérez Rojas, en adelante EL VENDEDOR" becomes `[VENDEDOR]`.

Then, in order:

1. **Representatives and people with titles** ("represented by…", "Mr.", "Lic.", "Dr."…) → `[PERSONA_n]`.
2. **Companies** that aren't parties to the contract → `[EMPRESA_n]`.
3. **Pattern-based data**: email, national ID (with its department suffix: CB, LP, SC…), tax ID, property registry number, license plate, phone (8-digit Bolivian mobile numbers, with or without +591) and address ("Av.", "Calle", "Zona"… followed by a name and a number).

## False positives matter too

A rule that looks for "capitalized words" finds names, but also "Código Civil", "Tribunal Supremo" or "Santa Cruz". If I anonymize those, the model loses exactly the legal context it needs.

That's why there's a list of words that are **never** personal names: institutions, cities, departments, contract terms ("Cláusula", "Primera", "Testimonio"…) and even car brands that show up in sales contracts. A name needs at least two capitalized words and none from that list.

## Details that prevent subtle bugs

Three small decisions that made the difference:

- **Replace the longest first.** If I replace "Juan Pérez" before "Juan Pérez Rojas", I end up with `[PERSONA_1] Rojas`. Sorting by descending length avoids it.
- **Variants of the same name.** A contract says "Juan Carlos Pérez Rojas" at the start and "Juan Carlos" or "Juan Pérez" later on. For names of three or more words, those short forms are also replaced with the same placeholder.
- **One map for the whole contract.** The analysis runs clause by clause, in parallel. If each clause were anonymized separately, the same seller could be `[PERSONA_1]` in one and `[PERSONA_3]` in another. So the **whole contract is anonymized once** and that map is applied to each clause.

The interface is three methods:

```python
texto_anon, mapa = Anonimizador().anonimizar(contrato)   # once per contract
clausula_anon = Anonimizador.aplicar(clausula, mapa)       # for each clause
respuesta = Anonimizador.restaurar(respuesta_llm, mapa)    # when the model answers
```

## The map never leaves the server

The `placeholder → real data` map stays on the server. The model sees `[VENDEDOR]`; when it answers "the obligation of [VENDEDOR] to deliver the property…", the system restores the real data before showing it to the lawyer. The user reads their contract with real names; the AI provider never saw them.

On top of that, AdvAI prefers a **local model** (Ollama) when it's available, and cloud providers only step in as a fallback. But even when the cloud is used, the text has already been anonymized.

## What I learned

- **Not every AI problem is solved with AI.** For something that has to behave the same way every time, well-tested rules beat a model.
- **Privacy by design changes the architecture.** The map, the replacement order and "anonymize once per contract" came from thinking about privacy from the start, not bolting it on at the end.
- **False positives cost as much as false negatives.** Over-anonymizing destroys the context the model needs to reason.

Are you sending user data to an LLM? Before picking the model, ask yourself which part of the text it really needs to see.
