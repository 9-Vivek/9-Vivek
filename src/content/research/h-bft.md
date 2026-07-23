---
title: H-BFT Specification
description: A research specification for sovereign, private-by-default replication and coordination across trusted local-first systems.
publishDate: 2026-01-28
tags: [Consensus, Security, Distributed Systems]
summary: Infrastructure research for resilient, user-controlled coordination.
featured: true
status: Specification draft
category: Research / Infrastructure
---

H-BFT asks what kind of network substrate is appropriate when personal cognitive state must remain private, available, and under the user's authority. It is a consensus and network-layer research specification for small groups of trusted devices and collaborators rather than an attempt to build a global public ledger.

## Problem boundary

Local-first applications work well on one device. The harder problem begins when state must move between a laptop, desktop, mobile device, and a small set of collaborators without making a central service the final authority.

H-BFT explores membership, replication, conflict boundaries, and recovery in that environment. Byzantine fault-tolerance is a reference point, but the specification prioritizes bounded trust domains, understandable operations, and private discovery.

## Design priorities

- Private-by-default discovery and transport.
- Explicit membership rather than ambient global identity.
- Predictable recovery after devices have been offline.
- Legible failure states and operator-controlled repair.
- A specification small enough to audit and implement independently.

## Relationship to ACC

An ACC system may preserve sensitive state: intentions, active goals, relationships, unresolved questions, and a history of attention. That state cannot be treated as ordinary cloud telemetry. H-BFT is one attempt to define infrastructure that respects the sensitivity of the cognitive layer.

The work remains a specification draft and should not be treated as production security guidance.
