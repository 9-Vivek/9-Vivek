---
title: Relational Data Canvas
description: A human-facing workspace for authoring structured relational data and exploring it through a layered, deterministic view pipeline.
publishDate: 2026-08-19
tags: [Relational Data, Structured Authoring, Visualization]
summary: A schema-driven canvas that separates canonical entity data from the tables, graphs, trees, and other views derived from it.
featured: false
status: Architecture and implementation planning
category: Data workspace
---

Relational Data Canvas (RDC) is a workspace for making structured, relational data pleasant to author, inspect, and explore. It combines a human-friendly entity editor with the deterministic query-and-rendering architecture previously developed as Explorer Engine.

RDC is not a database, graph database, dashboard, or AI assistant. Each canvas has one canonical schema, and its entities remain the source of truth. Relationships are stored directly in schema-defined fields as references to other entity IDs. Tables, graphs, trees, and lists are derived representations of that same underlying entity universe.

Its architecture is organized as a strict layered pipeline: **storage → query → result set → render**. Storage owns canonical entities and relationships. Queries select a relevant projection without prescribing its appearance. Result sets provide a stable, presentation-independent contract. Renderers then turn that contract into a table, graph, hierarchy, list, or another view. Each layer can evolve independently without collapsing data authority, selection logic, and presentation into one system.

## Author once, view many ways

The core pipeline is explicit:

1. **Storage** preserves canonical entities, schema-defined fields, and relationships.
2. **Query** selects the entities, fields, and relationship paths relevant to a question.
3. **Result set** packages that selection into a presentation-independent structure.
4. **Render** applies a rendering specification and produces a read-only view.

Changing a representation does not change the data model. The same entities can appear in an editable table, a dependency graph, a hierarchy, or an impact list without maintaining duplicate artifacts.

## Human-facing authoring

The primary editing surface is schema-driven rather than domain-specific. It supports field validation, readable relationship controls, filtering, sorting, and direct entity creation. Graph and hierarchy views begin as read-only snapshots: after editing source data, the user deliberately refreshes a view to regenerate it.

This boundary keeps authority clear. Views help a person reason spatially about relationships, but edits ultimately resolve to canonical entity fields.

## Deterministic core

The initial engine contains no AI. The same data, query, and rendering specification must produce the same result. Renderers remain generic and do not need to understand domain concepts such as capabilities, lessons, books, or projects.

AI may later translate natural-language requests into structured queries or rendering specifications. It remains an optional layer above the engine and does not receive direct storage access.

## Use cases

RDC is intended for domains where people need to author one structured body of information and examine its relationships from several perspectives. Examples include dependency mapping, knowledge structures, research landscapes, project relationships, system inventories, and impact analysis. The same source data can support spatial exploration, hierarchical inspection, tabular editing, and targeted relational queries without being recreated for each representation.

The initial implementation is intentionally narrow: a dependable entity editor, structured queries, and a small renderer set covering tables, graphs, and hierarchies.

## Big-picture position

RDC occupies the structured-representation layer of the broader ACC direction. It makes relationships explicit without allowing any single storage layout or visual form to become the permanent definition of the information. Within the professional portfolio, it demonstrates schema design, relational query architecture, reusable rendering systems, and a disciplined boundary between deterministic software and optional AI assistance.
