---
title: Personal Intelligence Layer
description: A local mediation layer connecting personal context, models, tools, memory, and user-authored policy.
publishDate: 2026-03-18
tags: [Local AI, Context, Architecture]
summary: A user-controlled intelligence substrate for the ACC ecosystem.
featured: true
status: Architecture research
category: Personal systems
---

The Personal Intelligence Layer (PIL) is a proposed local system boundary between a person’s cognitive context and the models or tools that may act on it.

## Role

PIL is not a single assistant interface. It is the layer responsible for assembling context, enforcing user-authored policy, routing work to appropriate local or remote models, and recording what was inferred versus what the user explicitly stated.

## Responsibilities

- Maintain inspectable working context across applications.
- Separate durable memory from temporary model input.
- Route tasks across local models, tools, and optional network services.
- Make permissions and data movement visible.
- Preserve a stable user-controlled boundary as individual models change.

## Relationship to other projects

Digital Center is one interface that could consume PIL. Explorer Engine can project its indexed relationships into task-specific views. H-BFT explores how selected state could be replicated across a user’s trusted devices.
