# Digital Center Positioning: Operating Layer Above Specialized Systems

## Executive Summary

Digital Center is not intended to replace specialized tools such as Capacities, Obsidian, email clients, messaging platforms, or external calendars.

Its role is to sit **above** them as a personal operating layer: a place where time, active work, context, external signals, quick capture, visual artifacts, and AI reasoning can be brought into one shared object universe.

The central distinction is:

> Specialized tools remain the best place for the domains they serve well. Digital Center makes the useful parts of those domains operationally visible across the rest of a user's digital life.

This is especially important for personal knowledge management (PKM). A tool like Capacities may be a better place for durable course notes, books, people, topics, research objects, backlinks, properties, and knowledge-oriented queries. Digital Center does not need to recreate those strengths. Instead, it should let those objects remain owned by Capacities while mirroring enough of them into Digital Center to participate in global search, Context Spaces, LLM Workspace, references, Home, and future persistent views.

---

## PKM Example: Capacities

Capacities and Digital Center overlap in several areas, but they have different centers of gravity.

Capacities is primarily a **knowledge and thinking environment** built around typed objects, properties, relationships, backlinks, queries, and reusable views.

Digital Center is primarily an **operational environment** built around time, execution, active context, system-wide capture, external signals, and cross-tool orchestration.

A user should not have to choose one or the other.

A reasonable division is:

- **Capacities**: durable knowledge objects, structured research, people, books, topics, long-term notes, PKM workflows.
- **Digital Center**: Calendar, Streams, Switchboard, quick capture, reminders, Structures, LLM Workspace, external signal aggregation, overlays, and system-level return-to-context.

Digital Center's native Notes therefore remain intentionally minimal. They are a universal quick-capture staging layer, not a replacement for a full PKM. A captured note may later remain lightweight, be attached to a Stream, or be promoted into Capacities or Obsidian.

The same principle applies to Archive. Capacities may provide a richer reading and web-resource workflow, but Digital Center still needs a universal low-friction resource capture layer because Context Spaces, global search, LLM Workspace, and other operational surfaces need direct access to saved resources.

---

## Mirrored External Objects

To make this positioning real, Digital Center should support **specialized PKM extensions**.

A PKM extension should not flatten external objects into generic Digital Center Notes or Archive items. Instead, the external system remains authoritative while Digital Center maintains a local mirror or projection sufficient for:

- global search
- ObjectReference / ObjectSummary
- Context Space ingestion
- LLM Workspace mounting
- tagging or tag mapping
- related-object surfaces
- Home and future persistent views

For example, a Capacities extension could expose:

- books
- people
- topics
- custom object types
- web links
- notes/pages
- tags
- relationships

These objects would remain Capacities-owned but become operationally visible inside Digital Center.

This creates three broad layers:

```text
Native Digital Center objects
  Calendar, Streams, Notes, Archive, Structures, Reminders, Context Spaces

Mirrored external objects
  Capacities objects, Obsidian notes, emails, Teams messages, GitHub issues, etc.

Shared object fabric
  Search, references, summaries, tag mappings, Context Spaces,
  LLM Workspace, Home, relationships, and saved views
```

The guiding rule is:

> External systems keep ownership; Digital Center keeps visibility and operational access.

---

## Promotion and Lineage

When a lightweight Digital Center object is promoted into a PKM, the relationship should be preserved.

Example:

```text
Quick Note in Digital Center
→ promoted to Capacities object
→ later mirrored back through the Capacities extension
```

Digital Center should retain lineage so the original quick note and the durable PKM object are not treated as unrelated duplicates.

This allows search and other surfaces to prefer the durable object while preserving the history of capture and promotion.

---

## Tag Mapping, Not Blind Tag Merging

Tags from external systems should not automatically become identical to Digital Center tags simply because their names match.

Instead, Digital Center should support explicit mappings:

```text
Digital Center tag: AI
  ↔ Capacities tag: AI
  ↔ Obsidian tag: #ai
```

This preserves external identity while allowing unified filtering and search.

---

## PKM Adapter Model

Each PKM can have a specialized extension and UI, but the bridge into Digital Center should follow a common adapter contract.

Different systems may use different transport mechanisms:

- Capacities: scheduled full export or API
- Obsidian: local vault filesystem
- Notion: API or export
- other PKMs: whatever reliable source they expose

The goal is not universal synchronization logic. The goal is a consistent way for external knowledge objects to participate in the Digital Center object universe.

---

## Why This Matters

Without these bridges, external knowledge is not lost, but it becomes **operationally invisible** to Digital Center.

That means it cannot naturally participate in:

- global search
- Context Space streams
- LLM Workspace context mounting
- Home orientation
- related-object views
- future AI reasoning across the user's actual environment

The PKM extension layer solves this without requiring Digital Center to become a PKM itself.

---

## Future Direction: Queries and Persistent Views

As Digital Center matures, global search should evolve beyond one-time retrieval.

The next major layer is **queries and persistent views**.

Search answers:

> What am I looking for right now?

A persistent query answers:

> What set of objects do I want Digital Center to continuously maintain for me?

A query could span both native and mirrored external objects, for example:

- all upcoming deadlines related to a course
- all objects tagged `AI` updated in the last month
- all Capacities objects, Archive items, Notes, and Structures relevant to a Context Space
- all active Streams plus related calendar objects
- all recent external signals connected to a project

The same query could then be rendered through different **saved views**:

- list
- cards
- table
- timeline
- calendar-like view
- graph

This should remain compatible with Digital Center's feature-owned architecture: features expose queryable capabilities without giving up ownership of their schemas.

A useful distinction is:

> **Structure** = intentionally authored visual representation  
> **Saved View** = dynamically generated representation of a persistent query

Graph views can then emerge naturally from existing references, links, context membership, workstream relationships, PKM relationships, and mounted objects before the system ever needs a more elaborate relationship ontology.

---

## Positioning Principle

Digital Center should not try to become the best PKM, the best email client, the best messaging app, or the best file manager.

Its advantage is the layer those tools do not provide together:

- rich temporal grammar through Calendar
- ordered execution through Streams
- operational context through Switchboard
- system-level access through shortcuts and overlays
- custom visual representations through Structures
- explicit AI context through LLM Workspace
- cross-system visibility through specialized extensions
- unified retrieval through search and future persistent views

The product position is therefore:

> **Digital Center is the operating layer above specialized digital systems. It does not replace where information belongs; it makes that information available where the rest of the user's digital life needs it.**
