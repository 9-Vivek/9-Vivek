---
title: H-BFT Specification
description: A consensus and network-layer specification for sovereign, private-by-default data vaults.
publishDate: 2026-01-28
tags: [Consensus, Security, Distributed Systems]
summary: Infrastructure research for resilient local-first coordination.
featured: false
status: Specification draft
category: Infrastructure / Security
---

H-BFT is a network and consensus specification aimed at a specific local-first requirement: personal and collaborative data should remain available across trusted devices without making a central service the ultimate authority.

## Scope

The work examines membership, replication, conflict boundaries, and failure recovery for small sovereign data networks. It draws from Byzantine fault-tolerant systems while treating privacy and operator legibility as first-order constraints.

## Design priorities

- Private-by-default discovery and transport.
- Explicit trust domains rather than ambient global identity.
- Predictable recovery after devices have been offline.
- A specification small enough to audit and implement independently.

H-BFT remains research, not production security guidance. The draft is a vehicle for making infrastructure assumptions explicit before they harden inside applications.
