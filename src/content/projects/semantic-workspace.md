---
title: Semantic Workspace
description: An open-core VS Code extension that maps files and tasks by utility and intent using metadata sidecars.
publishDate: 2026-02-20
tags: [VS Code, TypeScript, Metadata]
summary: Intent-oriented navigation for codebases without changing their physical layout.
featured: true
status: Prototype
category: Productization
---

Semantic Workspace explores a practical problem: the best physical organization of a codebase is rarely the best organization for every task performed within it.

## Sidecars, not migration

The extension keeps the filesystem intact. Small metadata sidecars describe functional utility, task intent, and semantic relationships. Those descriptions allow multiple task-specific maps to coexist over the same source tree.

## Design constraints

- No proprietary storage format for source code.
- Graceful degradation when metadata is absent.
- Inspectable, versionable relationships.
- Useful navigation before any language-model inference is introduced.

The open-core model is intended to keep the representational layer portable while leaving room for polished team workflows and advanced projections.
