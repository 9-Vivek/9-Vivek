# Relational Data Canvas (RDC)

## 1. Executive Summary

Relational Data Canvas (RDC) is a human-facing workspace for working with structured, relational data through an easy-to-edit interface and interchangeable read-only representations.

RDC is not a replacement for a database, a graph database, a dashboard, or an AI assistant. Its purpose is to make structured data **pleasant to author, inspect, and explore** without coupling the underlying data to a particular representation.

The core idea is:

> **Edit entities and their relationships in a user-friendly structured editor; query the underlying entity universe; render the result through an explicit representation.**

RDC builds on the architecture previously defined for Explorer Engine:

```text
Entities / Relationships
        ↓
      Query
        ↓
    Result Set
        ↓
Rendering Specification
        ↓
     Renderer
        ↓
    Read-only View
```

Explorer Engine remains the deterministic exploration layer. RDC adds the human-facing authoring environment around it.

The initial RDC experience does **not** need a large collection of sophisticated views. A small number of strong, explicit renderers are enough to prove the model. The first important use case is ASI, where the same relational data can be rendered as:

1. a **Capability Graph** showing the dependency structure of learner capabilities.
2. a **K_D Graph / Tree / Hierarchy** showing the relevant knowledge territory and its organization.
3. eventually, a simple **relational impact/list view** for questions such as "what is affected if this entity is removed?"

AI can eventually assist with translating natural-language requests into queries or transforming results into appropriate rendering specifications. That is a later layer. The initial system should use explicit queries and explicitly implemented renderers so that the core remains deterministic, understandable, and easy to test.

---

# 2. What RDC Is

RDC is a **relational data authoring and exploration environment**.

The fundamental data unit is an **Entity**.

An entity has:

- an `id`;
- zero or more additional fields defined by the canvas schema.

Each canvas defines exactly one canonical schema, and every entity in that canvas conforms to it. `id` is the only field that every canvas schema must contain. Fields such as `type` are optional use-case choices with no special engine meaning.

Relationships are represented directly by schema fields whose values are either one entity ID or a list of entity IDs. There are no separate association records, association types, or embedded queries that constrain relationship targets.

For example, an ASI capability might be represented conceptually as:

```text
C7
type: capability
title: Make justified system-level decisions

schema-defined entity ID fields:
  requires → C5
  requires → C6
  supported_by → K17
  developed_by → I23
```

The data does not say that C7 *is a graph node*.

It simply describes C7 and its relationships.

A graph renderer can then turn those relationships into a graph.

A table renderer could display the same entity as a row.

A future analysis query could return all entities affected by removing C7.

The underlying entity does not change when its representation changes.

---

# 3. Relationship to Explorer Engine

RDC should be understood as the **workspace surrounding Explorer Engine**, not as a replacement for it.

The prior Explorer Engine architecture deliberately separates storage, schema, queries, results, rendering specifications, and renderers. Explorer Engine is a semantic exploration layer above existing storage rather than another database. It is also explicitly deterministic: the same data and query should produce the same result set. 

The original model is:

```text
Human
  ↓
(optional) LLM / Query Translator
  ↓
Structured Query
  ↓
Explorer Engine
  ↓
Result Set
  ↓
(optional) Rendering Transformer
  ↓
Rendering Specification
  ↓
Renderer
  ↓
UI
```

RDC adds the missing **authoring experience**:

```text
                    ┌─────────────────────┐
                    │   RDC Workspace     │
                    │                     │
                    │ Entity Editor       │
                    │ Query / View Tools  │
                    │ Read-only Views     │
                    └──────────┬──────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │ Underlying Data     │
                    │ Canonical Schema    │
                    │ + Entities w/ refs  │
                    └──────────┬──────────┘
                               │
                               ↓
                         Explorer Engine
                               │
                         ┌─────┴─────┐
                         ↓           ↓
                    Result Set   Query Results
                         │
                         ↓
                  Rendering System
                         │
                         ↓
                   Read-only View
```

The distinction matters:

- **Explorer Engine** answers: "What data does this query produce?"
- **RDC** answers: "How can a human comfortably create, inspect, and explore that data?"
- **Renderer** answers: "How should this result be represented?"
- **AI**, eventually, can help humans formulate queries or rendering specifications.

---

# 4. Core Principles

## 4.1 Entities are the source data

Entities conforming to the canvas's one canonical schema are the source of truth. Relationships exist within those entities as ID-valued fields.

A graph is not canonical.

A table is not canonical.

A tree is not canonical.

They are representations of the same underlying data.

Therefore:

> Editing a representation should ultimately mean editing the underlying entity fields, not creating a second copy of the data.

For the initial implementation, graph views should be explicitly **read-only**.

---

## 4.2 Views are derived

A view is produced from:

```text
Query
  ↓
Result Set
  ↓
Rendering Specification
  ↓
Renderer
```

This means a capability graph can be regenerated whenever the underlying data changes.

A view can therefore behave as a persistent saved representation while remaining derived from entity data.

---

## 4.3 Views are snapshots until refreshed

The initial UX should favor a simple model:

1. Edit the underlying data.
2. The existing view remains unchanged.
3. Click **Update / Refresh**.
4. The query executes again.
5. The renderer produces the new representation.

This is preferable to making every rendered representation a live editing surface.

For example:

```text
Edit C7
  ↓
Save entity
  ↓
[Capability Graph is now stale]
  ↓
Click "Update Graph"
  ↓
Query runs
  ↓
Graph reflects C7's new relationships
```

This makes the source of truth obvious and keeps rendering deterministic.

---

## 4.4 Renderers do not understand domain semantics

A renderer should not need to know what a "capability" or "lesson" is.

It should receive:

- a result set;
- a rendering specification.

It then produces the appropriate UI.

The capability graph is therefore a graph renderer configured to interpret the relevant relationships in the result set—not a special hard-coded "ASI capability graph" subsystem.

This preserves the generic nature of the engine.

---

## 4.5 The engine remains deterministic

The initial core should contain no AI.

Given:

```text
same data + same query + same rendering specification
```

the result should be deterministic.

This keeps the system:

- testable;
- explainable;
- predictable;
- debuggable.

AI should be an optional layer above this deterministic core.

---

## 4.6 The authoring experience matters

The database itself is not the user experience.

A conventional database administration interface may technically expose all of the underlying information while still being an extremely poor environment for thinking and authoring.

RDC therefore needs a structured editor that makes it easy to:

- create entities;
- edit fields;
- edit any fields defined by the canvas schema;
- populate entity ID and list-of-entity-IDs fields;
- inspect relationships;
- search/filter entities;
- make changes quickly;
- understand what relationships mean.

The goal is not to hide the structured nature of the data. It is to make structured editing **human-friendly**.

---

# 5. The Entity Model

The exact schema mechanism can remain generic.

Conceptually, an entity has:

```text
Entity
├── id
└── <zero or more schema-defined fields>
```

Each canvas has one canonical schema defining the valid structure of every entity in its entity universe.

At minimum, the schema should be capable of defining:

- fields;
- field types;
- validation;
- optional metadata.

Field types include text, number, boolean, date, date/time, choice, Entity, rating, duration, and List of any singular type. Reference fields are Entity or List of Entity and store IDs directly. They do not contain queries, target predicates, or separate edge properties. List cannot nest List; choices may have one parent/child level and optional multi-select; rating and duration behavior is configured at the field level.

A generic entity can therefore support many domain-specific objects without the engine itself knowing their meaning.

For example, an ASI canvas might contain:

```text
Capability
Knowledge Concept
Tier
Module
Lesson
Intervention
Evidence Type
```

The engine does not need special knowledge of any of these.

They are distinctions expressed by ordinary schema fields and values when the ASI canvas needs them. RDC assigns no special semantics to a field named `type`.

---

# 6. Entity References Are the Main Source of Expressive Power

A simple collection of independent entities is not especially interesting.

The important capability of RDC comes from entity ID references stored in schema-defined fields.

Examples:

```text
C7
  requires → C5

C5
  requires → C4

Lesson 12
  develops → C5

Intervention 12b
  evaluates → C5

C5
  supported_by → K17
```

These reference fields allow queries to traverse the underlying structure in the stored or reverse direction.

This is what makes it possible to generate representations that were not explicitly stored as separate artifacts.

For example, a query can ask:

> Find all capabilities and their `requires` relationships.

The resulting graph can then be rendered without maintaining a separate graph database.

More complex queries can eventually ask questions such as:

> What curriculum entities depend on this capability?

or:

> What entities become affected if this node is removed?

The complexity of RDC therefore comes primarily from **relational querying and relationship semantics**, not from rendering.

---

# 7. Queries

A query is a structured description of what data should be retrieved or derived.

The initial query system can remain deliberately modest.

Useful operations include:

- filter;
- sort;
- group;
- limit;
- traverse relationships;
- select fields;
- basic aggregation.

For example:

```text
filter:
    type = capability
```

combined with a request to include relevant `requires` relationships can produce the input to a capability graph.

A more complex query might conceptually express:

```text
Find:
    modules and lessons

Related through:
    develops → capability

Where:
    capability = C7
```

The exact query syntax is an implementation decision. The architectural requirement is that queries remain structured, deterministic, and independent of presentation.

Natural-language query translation can be added later.

---

# 8. Result Sets

A query produces a **Result Set**.

The result set contains data such as:

- selected entities;
- ordering;
- grouping;
- relationship information;
- metadata necessary for rendering.

It should not contain UI-specific instructions.

For example, the result set might contain:

```text
C1
C2
C3
C4

relationships:
C2 → requires → C1
C3 → requires → C2
C4 → requires → C2
```

The result set does not say:

> "Draw this as a graph."

That belongs to the rendering layer.

---

# 9. Rendering Specifications

A Rendering Specification describes how a result set should be displayed.

Conceptually:

```json
{
  "renderer": "graph",
  "node": {
    "label": "title"
  },
  "edge": {
    "relationship": "requires"
  },
  "layout": "hierarchical"
}
```

The exact specification will evolve.

The important architectural principle is:

> **The query determines what data is present; the rendering specification determines how that data is represented.**

This allows the same query result to potentially be rendered as a graph, table, tree, or another representation.

---

# 10. Initial Renderers

The first implementation should use **explicitly implemented renderers**, not an AI-generated rendering layer.

This is intentionally conservative.

The goal is to prove:

1. entities can be edited comfortably;
2. relationships are stored correctly;
3. queries can retrieve them;
4. result sets can be generated;
5. useful representations can be rendered;
6. representations can be refreshed after data changes.

The initial renderer set should be small.

## 10.1 Table Renderer

The table is the primary authoring-oriented representation.

It should support:

- editable fields;
- readable relationship fields;
- sorting/filtering;
- creation and deletion;
- relationship editing;
- basic validation.

The table is where the architect primarily edits entity fields.

It is not merely another visualization.

---

## 10.2 Graph Renderer

The graph renderer provides a read-only relational representation.

It should support:

- nodes;
- labeled relationships;
- hierarchical or force-directed layouts;
- readable labels;
- zoom/pan;
- selecting a node;
- basic filtering;
- refresh/update from source data.

It should not initially support direct graph editing.

The graph exists to make relational structure visually legible.

---

## 10.3 Tree / Hierarchy Renderer

A tree/hierarchy renderer is useful when the relevant relationships are inherently hierarchical.

This may initially be implemented as a configuration or mode of the graph renderer rather than as an entirely separate technical subsystem.

The important distinction is conceptual:

- graph: arbitrary relevant relationships;
- tree/hierarchy: parent/child structure emphasized.

The same underlying entities can support either.

---

# 11. Initial Intelligence

RDC should eventually gain an intelligence layer, but this should come **after the deterministic core works**.

There are two obvious future uses.

## 11.1 Query translation

Human:

> "Show me everything that depends on C7."

AI:

```text
Structured Query
```

Explorer Engine:

```text
Result Set
```

## 11.2 Rendering transformation

Human:

> "Show this as a hierarchy."

AI:

```text
Rendering Specification
```

Renderer:

```text
Read-only hierarchy
```

This is consistent with the prior Explorer Engine architecture, where the internal LLM can translate natural-language requests into structured queries and, later, transform results into rendering specifications.

The AI should not directly access storage or replace the deterministic engine.

---

# 12. ASI: First Use Case

## 12.1 What is ASI?

ASI is an AI education initiative focused on helping students develop practical, systems-oriented capability with AI.

For the purposes of RDC, the important point is simply that ASI's curriculum is not just a linear list of lessons. Its architecture contains multiple kinds of entities with meaningful relationships.

In particular, Tier 1 of ASI defines a proficiency standard and a capability dependency structure. The curriculum also contains knowledge territory, modules, lessons, interventions, and related objects.

This makes ASI a useful first domain for testing RDC because the architect needs to create and inspect relational structures while developing the curriculum.

---

# 13. ASI Representation One: Capability Graph

The first important ASI view is the **Capability Graph**.

The architect develops a capability dependency structure such as:

```text
C8
 ↓
C7
 ├── requires → C5
 └── requires → C6
          ↓
         ...
```

The source data is simply the capability entities, including ID-reference fields such as `requires`.

The graph is generated by a query such as:

```text
filter:
    type = capability

relationships:
    requires
```

with a graph rendering specification.

The result is a read-only graph showing the current capability architecture.

The workflow becomes:

```text
Edit capabilities / relationships
          ↓
Save
          ↓
Update Capability Graph
          ↓
Inspect structure
          ↓
Identify missing or questionable dependencies
          ↓
Return to editor
```

This is valuable because the architect can reason spatially about the dependency structure without manually maintaining a second diagram.

---

# 14. ASI Representation Two: K_D Graph / Tree

ASI also needs a representation of `K_D`, the knowledge territory associated with the tier.

`K_D` represents the relevant domain knowledge structure—not simply a list of topics.

It may contain concepts such as:

```text
AI models
 ├── training
 ├── inference
 ├── capabilities
 └── limitations

AI systems
 ├── components
 ├── workflows
 ├── tools
 └── evaluation
```

The exact structure will be determined during curriculum architecture.

RDC should not encode these concepts into its core.

Instead, ASI defines one canvas schema and its entities, including any ID-reference fields, and RDC renders them.

Depending on the relationship structure, the architect should be able to inspect `K_D` as:

- a tree/hierarchy when the structure is predominantly hierarchical;
- a graph when cross-connections matter.

Again, the important point is that these are **views over the same data**, not separate maintained artifacts.

---

# 15. A Useful Future ASI Representation: Impact / Dependency Results

A third representation does not need to be another complex visualization.

A simple result list may actually be more useful.

For example:

> **What is affected if capability C5 is removed?**

The query could return:

```text
Affected capabilities
- C7
- C8

Affected curriculum
- Module 3
- Lesson 7
- Lesson 12

Affected interventions
- I14
- I19
```

This is a good example of why the relational model matters.

The answer does not need a specialized visualization.

It can simply be a query result rendered as a list or table.

The underlying intelligence is in the **query**, not in inventing a new view.

---

# 16. Why ASI Is a Good First Use Case

ASI does not require RDC to have dozens of views.

It needs something much more modest:

> **A comfortable way to author relational curriculum data and inspect a few important structures derived from it.**

Without RDC, the architect could store the information in a conventional database such as Supabase. That provides storage and relational data operations, but the database administration surface is not necessarily a good environment for thinking through a complex conceptual structure.

With RDC:

```text
                    ASI Canvas

       ┌─────────────────────────────────┐
       │ User-friendly Entity Editor     │
       └────────────────┬────────────────┘
                        │
                        ↓
             ASI entities + relationships
                        │
             ┌──────────┴──────────┐
             ↓                     ↓
       Capability Query         K_D Query
             ↓                     ↓
       Graph Renderer       Graph/Tree Renderer
             ↓                     ↓
       Capability Graph        K_D View
```

The same architecture can later support impact queries and other useful analyses without requiring a new data representation.

---

# 17. What RDC Should Not Become

The initial implementation should resist several tempting expansions.

## Not a graph editor

The graph is initially read-only.

Editing happens against entity fields.

## Not a database replacement

RDC can sit above an existing storage system.

Storage remains an implementation detail.

## Not an AI assistant

AI is an optional layer that can later help formulate queries or rendering specifications.

## Not a dashboard framework

RDC is about exploring and authoring relational data, not building arbitrary application dashboards.

## Not a curriculum-specific application

ASI should be a schema/use case, not something the engine inherently understands.

## Not a huge visualization library

A few excellent renderers are preferable to dozens of mediocre ones.

---

# 18. MVP Architecture

A practical first version can therefore be surprisingly small:

```text
┌─────────────────────────────────────────┐
│               RDC UI                    │
│                                         │
│  Entity Table / Editor                  │
│  Query Controls                         │
│  Saved Views                            │
│  Read-only Graph / Tree                 │
└──────────────────┬──────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────┐
│          Relational Data Model          │
│                                         │
│  Entities                               │
│  Schemas                                │
│  Entity ID reference fields              │
└──────────────────┬──────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────┐
│          Explorer Engine                │
│                                         │
│  Query → Result Set                     │
└──────────────────┬──────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────┐
│          Rendering Layer                │
│                                         │
│  Table Renderer                         │
│  Graph Renderer                         │
│  Tree Renderer                          │
└─────────────────────────────────────────┘
```

AI is deliberately outside the critical path for the MVP.

---

# 19. Persistent Views

A view should be persistable as an object.

Conceptually:

```text
View
├── id
├── name
├── query
├── rendering specification
└── metadata
```

For example:

```text
ASI / Tier 1 Capability Graph

Query:
    type = capability

Renderer:
    graph

Relationships:
    requires

Layout:
    hierarchical
```

When the architect returns to the canvas, the saved view can be rerun against the current data.

This gives RDC a useful property:

> **The architect can save ways of looking at the data without duplicating the data itself.**

---

# 20. Editing and Refresh Workflow

The initial ASI workflow should be intentionally straightforward.

### Step 1 — Author

Use the table editor to create or modify entity fields, including ID references.

### Step 2 — Save

Persist the entity data.

### Step 3 — Inspect

Open a saved view such as the Capability Graph.

### Step 4 — Refresh

Explicitly update the view from the latest data.

### Step 5 — Reason

Use the representation to identify structural issues.

### Step 6 — Edit

Return to the canonical table and make changes.

This creates a simple loop:

```text
Author
  ↓
Render
  ↓
Inspect
  ↓
Think
  ↓
Modify
  ↓
Render again
```

That loop is the primary value of RDC.

---

# 21. Future Direction

Once the deterministic core and initial renderers are proven, RDC can become more intelligent without changing its foundational architecture.

Potential future layers include:

### Natural-language query

```text
"What capabilities depend on C5?"
        ↓
      LLM
        ↓
Structured Query
```

### Natural-language representation

```text
"Show this hierarchically."
        ↓
      LLM
        ↓
Rendering Specification
```

### Analytical assistance

```text
"What's affected if I remove C5?"
        ↓
      LLM / Query System
        ↓
Structured relational query
        ↓
Result
```

The important architectural principle remains:

> **AI should help determine what to ask or how to display it; the deterministic data and query engine should remain responsible for what the data actually says.**

This preserves the separation established by Explorer Engine.

---

# 22. Success Criteria

RDC succeeds initially if an architect can take a relational dataset and comfortably do the following:

1. Create and edit entities without working directly in an awkward database administration interface.
2. Create and modify entity ID and list-of-entity-IDs fields.
3. Run simple structured queries such as `type = capability`.
4. Save a query as a reusable view.
5. Render that result as a graph.
6. Render hierarchical data as a tree/hierarchy.
7. Refresh a view after changing its underlying data.
8. Trust that the representation is derived from the entities rather than separately maintained.
9. Run simple relational queries whose answers are useful as lists or tables.
10. Add a new canvas schema/domain without changing the core engine.

The ASI proof of concept should specifically demonstrate:

- a Capability Graph;
- a K_D Graph/Tree;
- at least one useful relational impact query;
- a comfortable entity/relationship editing experience.

If those work well, RDC has demonstrated the core thesis without requiring the full future intelligence layer.

---

# 23. The Core Thesis

RDC is ultimately about separating **data, questions, and representations** while making the underlying structured data easy for a human to author.

```text
                SOURCE DATA
       Schema-conforming Entities
                    │
             ┌──────┴──────┐
             ↓             ↓
          QUERY          QUERY
             ↓             ↓
        Result Set     Result Set
             │             │
             ↓             ↓
         Graph          Table
             │
             ↓
          Human
```

The graph is not the data.

The table is not the data.

The query is not the data.

They are different ways of interacting with and understanding the same relational entity universe.

**Relational Data Canvas provides the human-facing environment in which that model becomes practical.**

ASI is the first compelling use case because its capability architecture and knowledge territory naturally benefit from relational authoring and visual inspection, while remaining generic enough to prove that RDC is a reusable system rather than an ASI-specific tool.
