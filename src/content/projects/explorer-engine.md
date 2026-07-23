---
title: Explorer Engine
description: A lightweight projection engine that turns graph-indexed data into context-aware visual views called Lenses.
publishDate: 2026-02-06
tags: [Graphs, Projection, Python]
summary: Separate stored knowledge from the views used to understand it.
featured: false
status: In development
category: Infrastructure / Projection
---

Explorer Engine converts graph-indexed source data into temporary, task-specific visual projections called Lenses. The engine is deliberately presentation-agnostic: it determines what belongs in a view and why, leaving rendering to the consuming interface.

## Why projections

A single canonical interface cannot express every useful relationship in a complex knowledge system. A debugging task, literature review, and project handoff each require different boundaries—even when they draw from the same material.

Lenses make those boundaries explicit and disposable. They can be saved, compared, and regenerated without copying or restructuring the source data.

## Relationship to ACC

Explorer Engine provides one possible mechanism for translating active context into interface state. Its central research question is whether projection rules can remain understandable as the underlying graph and the user's working context both evolve.
