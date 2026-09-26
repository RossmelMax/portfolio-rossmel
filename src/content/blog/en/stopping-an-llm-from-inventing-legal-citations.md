---
title: 'How I stopped an LLM from inventing articles of the Civil Code'
description: 'In AdvAI, my capstone project, the model doesn''t write legal citations: it only picks from real sources and the system inserts the verbatim text. That''s how I went from "sounds right" to verifiable citations.'
date: 2026-09-15
tags: ['ai', 'llm', 'rag', 'python']
project: 'advai'
lang: 'en'
translationOf: 'llm-sin-citas-inventadas'
---

If you ask an LLM to review a contract and cite the law, it will almost always answer with something that **sounds** perfect: "according to article 519 of the Civil Code…". The problem is that sometimes that article doesn't say that. Or it doesn't exist.

For a lawyer, a made-up citation is worse than no citation: it wastes their time and, if they don't check it, it can cost them a case. That was the core problem of **AdvAI**, my capstone project at UDABOL: a system that analyzes contracts against Bolivia's Civil Code, Commercial Code and Supreme Court case law.

This post is about the design decision that taught me the most in the whole project.

## What AdvAI does

The lawyer uploads a contract (PDF, DOCX, ODT…). The system:

1. Splits it into clauses.
2. For each clause, searches for the relevant laws and rulings.
3. Returns a risk level, an analysis and **verbatim citations** that can be verified.
4. Reviews the whole contract: missing clauses, contradictions and changes between versions.

Step 3 is where LLMs fail if you leave them alone.

## The key idea: the model doesn't write the citation

The obvious approach would be to give the model the clause and the retrieved articles and ask for an analysis with citations. The problem is that, even with the sources in the prompt, an LLM can mix articles, change words or cite one that wasn't among them: it generates text, it doesn't copy it.

No prompt guarantees that won't happen. What does guarantee it is **changing who writes the citation**:

- The system retrieves the candidate sources and shows each one to the model with a short **key** (for example, `AS/0039/2018#1` for case law).
- The model answers in JSON with a fixed schema: its analysis and **only the keys** of the sources that back each point.
- The system discards any key that wasn't among the ones shown and **pastes the verbatim text** of each source from the database.

Simplified, it looks like this:

```python
fuentes = recuperar(clausula)                      # candidate articles and supreme court rulings
mostradas = {f.clave: f for f in fuentes}

respuesta = llm.json(prompt(clausula, fuentes), esquema=JuicioClausula)

citas = [
    {"clave": k, "texto": mostradas[k].texto_literal}   # the system writes the text
    for k in respuesta.claves
    if k in mostradas                                   # invented key → discarded
]
```

The model keeps doing what it does well (reasoning about the text), but it can no longer invent the content of a citation: in the worst case it picks a less relevant source, and that can be measured and improved.

## Retrieval matters more than the model

If the right source isn't among the candidates, no prompt can save it. That's why search is **hybrid**:

- **BM25** (with SQLite FTS5) for exact terms: in law, terms like "anticresis" or "evicción" (legal concepts with no casual synonym) have to match exactly.
- **Embeddings** (`bge-m3`, running locally with Ollama) for meaning: a clause can say the same thing as an article in different words.
- Both lists are combined with **Reciprocal Rank Fusion (RRF)**, which rewards sources that rank high in both.

The corpus has 3,267 articles and 971 case-law entries.

## Measure before optimizing

It's very easy to "feel" that results are improving. So I built an evaluation set with clauses and the sources that should come up for each one. With that, every change stopped being a hunch:

- Retrieval (hit@8: the right source among the top 8) went from **42.9% to 80%**.
- Over 40 evaluated clauses: **82.9%** correct citations and **94.6%** of clauses with no severe risk error.

An honest caveat: this is an internal evaluation, not yet validated by lawyers. But it already lets me compare versions of the system with numbers instead of impressions.

## Privacy: anonymize before leaving the machine

Contracts contain names, ID numbers, tax IDs, addresses, license plates… Before any text reaches a cloud model, AdvAI replaces that data with placeholders and keeps the map on the server. When the answer comes back, the data is restored. There's also a local model (Ollama) and providers with automatic failover: if one fails, the next one takes over.

## What I learned

- **An LLM is not a database.** The fix for hallucinations wasn't a better prompt; it was an architecture where the model can't write what it shouldn't.
- **Without evaluation, you're guessing.** The test set was what added the most value to the project.
- **Retrieval is half the work.** Improving retrieval raised quality more than switching models.

If you're building something with RAG and citations, or you're curious about the project, write to me below: I love talking about this.
