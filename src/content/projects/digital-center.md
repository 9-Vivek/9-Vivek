---
title: Digital Center
description: A local-first desktop laboratory for contextual spaces, adaptive overlays, and non-hierarchical organization.
publishDate: 2026-03-12
tags: [Tauri, React, Local-first]
summary: A working environment for testing the interface implications of ACC.
featured: true
status: Active experiment
category: Laboratory
---

Digital Center is the primary experimental surface for Active Cognition Computing. It is a local-first desktop application built with Tauri and React, designed to test whether a workspace can preserve the shape of an active inquiry rather than forcing it into a folder tree.

## Architectural premise

The application separates durable source material from contextual presentation. Artifacts remain ordinary local data. A context layer records meaningful relationships, active tasks, view state, and user-authored signals without taking ownership of the underlying files.

## Experiments

- Context-dependent interface overlays that reveal tools only when they are relevant.
- Contextual spaces that can span files, notes, tasks, and generated projections.
- Non-hierarchical organization built on explicit relationships rather than duplicated artifacts.
- Local language-model assistance through Ollama, with inference treated as a reversible suggestion.

## What it is testing

Digital Center is not intended to prove that every interface should become adaptive. It is a controlled place to learn which context signals actually reduce reconstruction cost—and which merely add complexity.
