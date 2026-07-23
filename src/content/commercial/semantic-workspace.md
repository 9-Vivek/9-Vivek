---
title: Semantic Workspace
description: An open-core VS Code extension that maps files and tasks by utility and intent using metadata sidecars.
publishDate: 2026-02-20
tags: [VS Code, TypeScript, Metadata]
summary: Intent-oriented navigation for codebases without changing their physical layout.
featured: true
status: Prototype
category: Applied product
---

Semantic Workspace applies ACC principles to a narrow commercial setting: navigating and coordinating work inside a software codebase.

## Sidecars, not migration

The extension keeps the filesystem intact. Small metadata sidecars describe functional utility, task intent, and semantic relationships. Multiple task-specific maps can coexist over the same source tree without changing paths or duplicating code.

## Product boundary

The open-core foundation keeps metadata portable and inspectable. Product value comes from reliable workflows around task mapping, team context, visualization, and integration—not from locking source code into a proprietary format.

## Design constraints

- Graceful degradation when metadata is absent.
- Inspectable, versionable relationships.
- Useful navigation before model inference is introduced.
- Clear separation between repository truth and generated interpretation.
