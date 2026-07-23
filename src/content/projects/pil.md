---
title: Personal Intelligence Layer
description: A filesystem-based reasoning build system that continuously transforms personal information into structured, evolving understanding.
publishDate: 2026-03-18
tags: [Reasoning Systems, Filesystem, Local AI]
summary: A stateful reasoning pipeline built around derived state, specialized lenses, and explicit provenance.
featured: true
status: Version 1 specification
category: Reasoning system
---

The Personal Intelligence Layer (PIL) is a standalone reasoning engine for maintaining an evolving understanding of a user's projects, goals, ideas, research, and digital life. It is designed to become an intelligence subsystem of Digital Center, but its architecture does not depend on that interface.

PIL is not organized around chat history. It treats reasoning more like a compiler or build pipeline: raw information is source material, canonical state is an intermediate representation, specialized lenses are analysis passes, and the executive summary is a compiled artifact.

## Files are truth

Original documents and updates are immutable inputs. The system repeatedly derives current state from those sources rather than asking a model to maintain memory inside a conversation. Persistent objects remain ordinary files with lightweight metadata recording their sources, update time, and generating node.

The model never owns the filesystem. Reasoning nodes emit validated file operations; a Python runtime decides whether to create, update, or archive state files.

## Reasoning graph

PIL decomposes intelligence into explicit nodes with declared inputs, prompts, models, and outputs:

- **Derivers** integrate new raw material into canonical state. They are the only nodes allowed to propose state changes.
- **Lenses** perform specialized analysis - strategic, architectural, opportunity, risk, learning, or contrarian - without modifying state.
- **Meta nodes** synthesize several lens outputs into an executive understanding of what changed, what matters, and what deserves attention next.

Adding a new form of reasoning should mean adding a node definition, not writing node-specific orchestration code.

## Version 1 boundary

The first version intentionally excludes databases, embeddings, vector stores, graph databases, autonomous agents, multi-agent orchestration, and complex UI. It tests one narrower hypothesis: whether a graph of specialized reasoning passes over continuously derived state produces more useful understanding than isolated model conversations.

The governing distinction is simple: PIL does not store conversations. It rebuilds understanding.
