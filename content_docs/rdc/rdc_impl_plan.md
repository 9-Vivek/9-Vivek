# Relational Data Canvas Implementation Plan

## 1. Purpose and authority

This plan turns the current RDC product direction into an implementation sequence. `rdc_overview.md` remains the product source of truth; this document defines how to build it.

The first proof of RDC is the ASI curriculum-authoring use case. Geometry Dash (GD) follows as the second use case and is the test that the system is genuinely reusable rather than accidentally ASI-specific.

The plan deliberately keeps technology choices separate from product and domain contracts. A framework, database, or graph-layout library may be selected during implementation without changing the architecture below.

## 2. Decisions that resolve earlier contradictions

### 2.1 ASI precedes GD

The older implementation plan used GD as the first vertical application. That no longer matches the product direction.

The sequence is now:

1. build the smallest generic RDC foundation;
2. prove relational authoring and the generic graph with a real ASI canvas;
3. improve bulk authoring, query construction, and saved-view customization;
4. prove reuse with GD-oriented renderers on the same foundation;
5. add portability and stabilize the deterministic application; and
6. add optional AI only after deterministic workflows are sufficient on their own.

ASI hierarchy diagnostics and impact analysis are no longer sequencing gates. They remain candidates for later work when real use demonstrates that the generic graph and version 1 query contract are insufficient.

### 2.2 A canvas has one canonical entity schema

The engine specification says an entity belongs to a schema and a schema belongs to a collection. RDC uses a simpler and stricter model: each canvas has exactly one canonical schema, and every entity in that canvas conforms to it.

For RDC:

- a **canvas** is the workspace and isolation boundary;
- a canvas contains one canonical entity schema, entities, and saved views;
- `id` is the only field required in every canvas schema;
- fields such as `type`, when useful, are ordinary schema-defined data with no special engine semantics;
- grouping, filtering, and saved queries over any field provide every useful collection-like distinction.

There is no collection abstraction and no per-type schema registry. The engine operates on one relational entity universe per canvas.

### 2.3 Relationships are schema-defined references

RDC does not have a separate association record, association-type registry, edge schema, or relationship constraint language.

A relationship exists when a field in the canvas schema is defined as either Entity or List of Entity. Values are direct entity IDs, and the field name supplies meaning within that canvas. For example, an ASI schema may define `requires` as a List of Entity. Direct and reverse traversal derive from those stored references.

Reference fields do not contain queries or predicates restricting their targets. Their values are direct IDs only.

### 2.4 The table/editor is an authoring surface, not merely a renderer

Read-only representations consume a result set plus a rendering specification. The primary table/editor also displays data, but it has a separate responsibility: it issues validated commands that change entities and their schema-defined fields, including reference fields.

This avoids forcing mutation behavior into the renderer contract. A read-only table result view may still use the rendering layer.

### 2.5 Saved views reference definitions; cached results are disposable

A saved view references a canvas-scoped reusable query by stable ID and stores a rendering specification plus view metadata. Reusable queries retain immutable revision history. A view may cache a result for explicit-refresh behavior, but canvas entities remain the source of truth and refresh always executes the current referenced query.

A view records both the canvas revision and reusable-query revision used for its cache. Either revision advancing marks the view stale without changing what it displays. Views do not refresh automatically.

### 2.6 The graph is the first specialized rendering

The old renderer order (table, leaderboard, cards) served GD. The ASI-first order is:

1. authoring editor;
2. read-only table/list result renderer;
3. graph renderer with a hierarchical layout option;
4. configurable card and leaderboard renderers when the second use case demonstrates them.

A stricter hierarchy/tree mode is deferred until real data requires semantics beyond the generic graph renderer.

### 2.7 Traversal is MVP query functionality

Filter, sort, group, and limit are insufficient for RDC. One-hop traversal, bounded multi-hop traversal, reference-field selection, and reverse traversal are required for relational inspection. Aggregation, retained impact paths, and other query semantics wait until a concrete use case requires them.

## 3. Product boundary

### In scope through the GD proof

- local or single-user canvases;
- one canonical, schema-defined entity shape per canvas;
- validated entity CRUD, including entity-reference fields;
- a comfortable structured authoring UI;
- deterministic structured queries;
- result sets that include entities and relationship information derived from reference fields;
- saved views with explicit refresh and stale state;
- configurable read-only table/list, graph, leaderboard, and card renderings as required by the first two use cases;
- import and export sufficient to move or back up a canvas;
- automated tests for domain rules, queries, persistence, and key user flows.

### Explicitly deferred

- natural-language querying and AI-generated rendering specifications;
- direct editing inside graph or hierarchy views;
- real-time collaboration or multi-user conflict resolution;
- a general dashboard builder;
- arbitrary plugin or renderer marketplaces;
- unbounded graph algorithms or a graph database;
- automatic live refresh of saved views;
- domain logic embedded in the generic engine.

## 4. Target architecture

The implementation should preserve these dependency directions:

```text
RDC application shell
  |-- Authoring UI ---------> mutation commands
  |-- View UI --------------> saved-view service
  |                            |-- query
  |                            |-- result set
  |                            `-- rendering specification
  |
  |-- ASI definitions ------- canvas schema, data, queries, view specs
  `-- GD definitions -------- canvas schema, data, queries, view specs

Domain services
  |-- schema validation
  |-- entity mutations
  |-- query execution
  |-- saved-view lifecycle and staleness
  `-- import/export

Persistence adapter
  `-- canvases, canonical schemas, entities, views, revisions

Renderers
  `-- consume result sets and rendering specifications only
```

The domain and query layers must be usable without the UI. Storage access occurs behind an adapter. Renderers must not query storage or interpret ASI/GD semantics.

## 5. Minimum durable contracts

Exact language types and database columns may differ, but the following concepts should be explicit and versionable.

### Canvas

```text
Canvas
  id
  name
  schemaVersion
  revision
  metadata
```

`revision` increases after every committed entity-data mutation and drives saved-view staleness.

### Canonical canvas schema

```text
EntitySchema
  canvasId
  version
  fields[]
  displayField
  metadata

FieldDefinition
  key
  valueType
  typeConfiguration
  system
```

The schema applies to every entity in the canvas. `id` is its only universally required field. Implemented singular value types are text, number, boolean, date, date/time, choice, Entity, rating, and duration. `List` wraps exactly one singular type and cannot nest another list. Rating configuration supplies a positive denominator while stored numerators may be any number. Duration configuration supplies an ordered subset of weeks, days, hours, minutes, seconds, and milliseconds; values are stored as nonnegative milliseconds and decomposed for editing and display.

Choice fields may define one level of parent/child nesting and may be configured for single- or multi-select. Both parents and children are valid stored values. Children are internally parent-qualified, so identical child labels under different parents remain distinct. A query for a parent matches the parent or any direct child included in the field; a query for a child matches only that child. Child values render as `Parent > Child` outside the compact entity selector, and multi-select displays comma-separated paths. Changing single-select to multi-select wraps existing values losslessly. Changing back unwraps one-item selections and requires confirmation before clearing only selections with multiple values.

All other fields are use-case-defined. `type` may be present in a canvas schema but has no special meaning to the engine.

### Entity reference fields

```text
FieldDefinition
  key: requires
  valueType: List
  listItemType: Entity
```

An Entity field stores one direct ID. A List of Entity stores zero or more direct IDs. “Entity” is the formal schema type; its values still identify specific individuals. These fields contain no embedded filters, queries, target predicates, separate edge properties, or association records.

Direction follows storage: the entity containing the field is the source, and each referenced ID is a target. Reverse traversal is derived by finding entities whose selected reference field contains the target ID.

### Entity

```text
Entity
  canvasId
  values
```

`values` contains all schema-defined fields and must include `id`. An entity is validated against its canvas's single canonical schema. A relationship is present directly in `values` whenever an Entity or List-of-Entity field is populated.

### Structured query

```text
Query
  from
  filters[]
  traversals[]
  select
  sort[]
  groupBy[]
  limit
```

`from` selects entities using ordinary field predicates or explicit entity IDs. A traversal names one or more entity-reference fields, direction, and depth. MVP traversal depth must be explicitly bounded.

### Result set

```text
ResultSet
  entities[]
  relationships[]
  ordering
  groups
  queryMetadata
  canvasRevision
```

`relationships` is derived output identifying source entity ID, reference field, and target entity ID. It is not separately stored data. By default, emit only relationships whose source and target entities are both present in the result. Boundary references or separately grouped results must be explicit in the query/result contract.

### Saved view

```text
SavedView
  id
  canvasId
  name
  queryId
  renderingSpecification
  lastRunCanvasRevision
  lastRunQueryRevision
  cachedResult
  metadata
```

`queryId` references a canvas-scoped reusable query with immutable numbered revisions. The cached result is disposable derived state retained only to support explicit refresh semantics; entities remain the source of truth.

### Rendering specification

Every specification identifies a renderer and contains only renderer-supported options. Specifications are validated before use. Renderer contracts should be versioned before persisted views are relied upon for migration compatibility.

## 6. Implementation strategy

Work in vertical slices. Each milestone must leave a runnable application and close a real user loop. Avoid building a universal schema/query/rendering framework ahead of demonstrated ASI and GD needs.

Within each milestone, implement domain behavior and tests before or alongside UI wiring. A milestone is complete only when its acceptance scenario works through persistence, not when isolated components exist.

## 7. Milestones

### Milestone 0 - Project foundation and decisions

Establish the executable application, test harness, persistence migration mechanism, and package/module boundaries for domain, persistence, query, UI, and renderers.

Also record short architecture decisions for:

- application/runtime stack;
- persistence technology and JSON/property storage strategy;
- stable ID format;
- schema and saved-view versioning;
- graph visualization/layout library;
- import/export format.

Deliverable: an application opens an empty canvas, can persist its identity, and runs in local development and automated tests.

Exit criteria:

- a fresh environment can be initialized reproducibly;
- migrations can create and upgrade the data store;
- unit and application-level smoke tests run with one command;
- domain modules do not import UI or concrete storage modules.

### Milestone 1 - Canonical relational authoring slice

Implement Canvas, its canonical EntitySchema, and Entity. Add validation and mutation services, followed by the smallest useful authoring UI.

The UI should let the architect:

- filter entities by any schema field;
- browse/search the matching entities;
- create, edit, and delete an entity;
- view outgoing and incoming references;
- edit Entity and List-of-Entity fields using searchable entity selection;
- see schema-validation and unresolved-ID errors before a bad change is committed.

Deletion should be safe and explicit. If reference fields point to an entity, the application must show the impact and require a deliberate choice defined by policy; silent dangling IDs are never allowed.

Deliverable: a small mixed ASI seed canvas can be authored without direct database access.

Exit criteria:

- every entity is validated against the canvas's one canonical schema;
- singular and list reference fields persist correctly;
- invalid fields and unresolved referenced IDs are rejected;
- incoming and outgoing relationships are legible from an entity's details;
- persistence round trips do not change entity content.

### Milestone 2 - Query engine and result inspection

Implement a deterministic in-process query engine over the persistence abstraction. Support:

- selection by field predicates or by entity ID;
- field predicates with AND composition;
- sorting and limit;
- reference-field selection;
- outgoing and incoming traversal;
- bounded multi-hop traversal;
- field projection;
- simple grouping needed by list/table output.

Define deterministic ordering and tie-breaking so identical data and query objects produce structurally equal result sets. Add a developer-facing query fixture format before building a broad visual query builder.

Milestone 2 query semantics treat empty values explicitly and independently by operation. Comparison predicates omit empty operands, while `is_empty` and `is_not_empty` remain valid. Sorting omits entities with an empty sort field. Grouping places each such entity in its own group after populated groups. Grouping any List field places an entity in every item-value group; sorting one orders non-empty lists from longest to shortest, with no semantic order inside equal-length groups. These policies must remain separate implementation decisions so one can change without implicitly changing the others.

Milestone 2 also completes the schema editor's persisted `displayField` selector and field reordering. Compact renderings use only the selected display field and fall back to ID when it is empty.

Before Milestone 3, the developer fixture selector becomes a canvas-scoped reusable-query library. These records contain query definitions and descriptive metadata only; saved views will later pair such query behavior with rendering specifications and refresh state. Result contracts continue to carry IDs, while inspection renderers show the canvas display value for reference fields and derived relationship endpoints.

Deliverable: checked-in ASI queries return stable entity-and-derived-relationship result sets and can be inspected in a read-only table/list.

Exit criteria:

- capability selection plus `requires` edges returns the expected subgraph;
- reverse traversal finds dependents;
- traversal across an ASI reference field works regardless of which optional categorization fields the schema defines;
- cycles and unresolved referenced IDs cannot cause unbounded execution;
- deterministic golden/fixture tests cover each query operator.

### Milestone 3 - Saved views and refresh semantics

Implement saved queries paired with rendering specifications. A view run records `lastRunRevision`; later entity edits visibly mark it stale. Refresh reruns the query and replaces only the derived displayed/cached result.

In the implemented contract, a saved view references a canvas-scoped reusable query by ID. Reusable queries retain immutable numbered revision history, and each saved view records both the canvas revision and query revision used for its cached result. Either kind of change marks the view stale without replacing what it currently displays. A referenced reusable query cannot be deleted until dependent saved views are deleted or reassigned.

A result produced from the current revision of a reusable query can be extracted directly into a saved view. Extraction carries over the selected list/table presentation and stores the existing result as the view's first cache without rerunning the query. The Query page remains a neutral list/table inspection surface; richer renderers and their persisted configuration belong to saved views.

The first rendering specifications should cover read-only table/list output and the graph options needed by ASI. Do not build a general end-user rendering-spec editor yet; use validated presets with a small set of editable options.

Deliverable: users can open, save, rename, run, refresh, and delete reusable views without duplicating entities.

Exit criteria:

- saving a view does not copy entity data into the view definition;
- editing entity data marks previously run views stale;
- a stale view stays visually unchanged until refresh;
- reopening and refreshing a saved view is deterministic;
- invalid or obsolete specifications fail with an actionable error.

### Milestone 4 - Generic capability graph renderer

Add a generic read-only graph renderer configured by a rendering specification.

No ASI schema slice or seed dataset is created in this milestone. The renderer operates on whatever entities, queries, and entity-reference fields the user has already authored.

Required graph behavior:

- labels from a configured entity field;
- edges derived from configured entity-reference fields;
- hierarchical layout suitable for dependencies;
- deterministic direction and stable-enough placement for repeated inspection;
- zoom, pan, fit-to-view, and node selection;
- a selected node opens entity details without enabling graph editing;
- filters or focus controls sufficient to inspect a useful subgraph;
- explicit refresh and stale indication.

Deliverable: the user configures a saved graph view over existing records and entity-reference fields, refreshes it, and uses it to inspect dependency structure.

Exit criteria:

- no capability or dependency is stored separately for the graph;
- adding, changing, or removing a dependency appears only after refresh;
- shared prerequisites and multi-parent structures render correctly;
- cycles are detected and reported; the data remains accessible even when hierarchical layout cannot represent it cleanly;
- graph code contains no ASI-specific entity or relation names.

### Milestone 5 - Authoring productivity

Make sustained entity authoring fast without turning the canvas into a permanently tabular product. Bulk entry may use a temporary grid or import preview, while the normal entity list remains compact.

Implement:

- clipboard-based TSV/CSV bulk creation with schema-field mapping;
- a validation preview that reports invalid values, duplicate IDs, and unresolved references before mutation;
- forward references between entities in the same valid batch;
- entity multi-selection and bulk operations to set, clear, add to a list, or remove from a list;
- duplicate entity and save-and-create-another workflows;
- faster searchable reference selection; and
- discoverable keyboard commands for new, save, navigation, search, cancel, and confirmed deletion.

Each bulk mutation is all-or-nothing, increments the canvas revision once, and applies the existing relational confirmation and cleanup rules. Do not add UI-only undo. Undo/redo requires a durable history design that covers schema, entity, query, and batch mutations consistently.

The implemented M5 contract requires explicit IDs for clipboard imports, permits forward references within the same valid batch, and adds no persistence migration. Existing data remains in place. Multi-entity edits use the same validation rules as individual edits and require confirmation before replacing or removing populated values.

Deliverable: a user can paste a related set of entities, correct validation problems, create them atomically, and maintain the result efficiently with bulk edits and keyboard navigation.

Exit criteria:

- invalid rows never produce a partial import;
- references may target existing entities or valid IDs in the same batch;
- destructive bulk changes name affected entities before confirmation;
- one successful batch produces one canvas revision and makes saved views stale once;
- all commands are available without shortcuts, and shortcuts do not fire while incompatible controls are active; and
- ordinary single-entity authoring remains at least as capable as before.

### Implemented schema-power pass

Before Milestone 6, expand the schema without introducing multiple schemas or entity classes:

- replace the special list-of-entity-IDs type with generic `List<singular type>` and rename the singular reference type to `Entity`;
- add field-configured ratings and durations;
- add exactly one parent/child level to choices, including parent-inclusive query matching;
- retain compatibility when loading legacy `enum`, `entity_id`, and `entity_id_list` schema JSON; and
- add optional canvas ranking as a system-managed, queryable `rank` field.

Enabling ranking initializes current entities to 1–n in their existing order and appends new entities. Rank is edited in the ordinary entity form; moving an entity to rank x shifts the intervening entities and never creates ties or gaps. Deletion compacts later ranks. Disabling ranking is a confirmed destructive action that removes the field and every stored rank; reenabling initializes fresh ranks rather than restoring old values. A user-defined `rank` field must be renamed or removed before ranking can be enabled.

This pass adds only the additive canvas `rank_enabled` column. It does not rewrite existing schema or entity JSON; legacy types are normalized when loaded and persisted on a later schema mutation.

### Milestone 6 - Schema-aware query builder and explainer

Keep structured JSON as the durable query format while making that format understandable and constructible through the UI. This milestone improves authoring rather than adding substantial query semantics.

The implemented editor is Form-first and keeps JSON as an equivalent secondary mode. Form edits emit canonical formatted JSON; JSON may retain an invalid draft, and switching back to Form is blocked with a path-specific error rather than discarding or coercing that draft. Valid definitions preview automatically after a short debounce, with manual refresh still available. Predicates remain AND-only, and every traversal clause independently starts from the original roots before reached entities are unioned. No query semantics, persistence schema, or reusable-query revision behavior changes in this milestone.

Implement:

- an in-app reference for starting IDs, predicates and operators, traversals, relationship fields, projection, sorting, grouping, limits, and every empty-value rule;
- a deterministic plain-language explanation of the current query;
- a schema-aware form editor that offers only valid fields and operators;
- form controls for every currently supported query clause;
- synchronized form and JSON modes backed by one structured query value;
- clause-level validation with actionable errors; and
- live result preview and result-count feedback.

Switching editors must not change query meaning. Saving through either mode creates the same immutable reusable-query revision used today.

Deliverable: a user can construct, understand, run, revise, and save any currently supported query without needing to author JSON directly.

Exit criteria:

- every valid version 1 query can be represented by the form editor;
- form-to-JSON-to-form round trips preserve semantics;
- invalid field/operator combinations cannot be produced by the form and are explained when entered as JSON;
- the explainer states traversal direction, depth, grouping, sorting, projection, limits, and empty-value effects when present; and
- query execution and revision-history behavior remain unchanged.

### Milestone 7 - Renderer configuration foundation

Make saved views the configurable presentation layer while keeping the Query page a neutral list/table inspection surface. Introduce the next rendering-specification version with an explicit migration from existing version 1 specifications to equivalent defaults.

Shared saved-view controls cover:

- visible fields, field order, and per-view labels;
- reference labels defaulting to the canvas display field;
- density, spacing, typography scale, borders, radius, and validated color tokens;
- optional field-value color rules with deterministic precedence;
- live preview against the cached result; and
- reset-to-default behavior for individual settings and the full renderer.

Renderer-specific controls cover:

- **List:** compact-row or card layout, row height, card width, primary and secondary fields, and field placement.
- **Table:** column visibility, order, width, alignment, row height, and sticky header or columns.
- **Graph:** node dimensions, primary and secondary fields, level spacing, node and edge colors, edge labels, and cycle highlighting.

Configuration is validated data, not arbitrary CSS. Presentation-only changes must not run the query or alter the cached result. If a configured field is absent from the cached result, the view explains that the query projection must include it.

Deliverable: a user can customize and persist useful list, table, and graph presentations through controls rather than editing JSON or CSS.

Exit criteria:

- all existing saved views migrate to visually equivalent defaults;
- configuration survives restart and remains scoped to its saved view;
- changing presentation leaves entity data, query revisions, and cached results unchanged;
- invalid or obsolete fields and unsupported specification versions fail actionably;
- renderer defaults remain usable without customization; and
- accessibility and contrast are preserved by the supported design controls.

### Milestone 8 - Additional renderers and second-use-case proof

Use the renderer-configuration foundation to add only the representations demonstrated by the next real use case. The expected GD slice is a card renderer and a leaderboard/ranked-list renderer; add query behavior only when that slice proves it necessary.

Both renderers consume the existing `ResultSet`, use shared field and design controls, and contain no GD-specific field names or rules. A leaderboard receives order from the query result rather than implementing a separate ranking engine. Cards change representation only; they do not duplicate entity data.

Deliverable: a real second-domain canvas can be authored, queried, and viewed through configurable table/list, card, and leaderboard presentations on the same engine used by ASI.

Exit criteria:

- card and leaderboard views are configured entirely through rendering specifications;
- the same reusable query can back multiple differently configured views;
- ranking is deterministic and traceable to query ordering;
- no second-domain terminology appears in domain, query, persistence, or generic renderer code; and
- completing the second use case requires no new top-level data abstraction.

Hierarchy/tree variants, richer graph diagnostics, and ASI impact analysis remain valid later work, but they are not prerequisites for this milestone. Add them when real data demonstrates a need and define their semantics before implementation.

### Milestone 9 - Portability and stabilization

Harden the application after both use cases exercise the shared contracts:

- versioned whole-canvas export and validated import;
- explicit import behavior for creating a new canvas, replacing one, or merging into one;
- schema, query, saved-view, and rendering-specification migrations;
- larger-data performance profiling and targeted optimization;
- accessibility and keyboard-workflow review;
- recovery from invalid files, interrupted operations, and obsolete specifications;
- end-to-end regression suites for both use cases; and
- concise user, query-language, import/export, and developer documentation.

Import validation occurs before mutation and never leaves a partially imported canvas. Export includes canonical schema and entities plus reusable queries and saved-view definitions; cached results and layouts may be omitted or regenerated as disposable derived state.

Deliverable: a reliable local-first, single-user RDC release suitable for regular use and safe backup or transfer.

Exit criteria:

- a canvas export/import round trip preserves canonical data and runnable definitions;
- merge and replacement conflicts are previewed and require an explicit choice;
- failed imports leave existing canvases unchanged;
- supported historical formats migrate deterministically;
- representative larger canvases remain responsive within documented limits; and
- critical author, query, refresh, customize, export, and restore workflows pass end-to-end tests.

### Milestone 10 - Optional intelligence layer

Only after the deterministic release is stable, add optional AI adapters for:

- natural language to validated structured query;
- presentation requests to validated rendering specifications; and
- explanations grounded in result entities and relationship paths.

AI output passes the same validation and versioning boundaries as manually authored inputs. The domain, persistence, query, and renderer layers continue to work unchanged with AI disabled, and no AI operation mutates canonical data without the same preview and confirmation required for manual action.

Deliverable: optional assistance accelerates query and presentation authoring without becoming part of RDC's correctness model.

Exit criteria:

- generated queries and specifications are inspectable and editable before use;
- invalid output is rejected without mutation;
- explanations identify the result data on which they rely;
- disabling or removing AI preserves every deterministic workflow; and
- canonical mutations never occur from unconfirmed generated output.

## 8. Testing strategy

### Domain tests

Test schema validation, singular and list reference fields, referenced-ID resolution, deletion policy, canvas isolation, batch validation, forward references, and all-or-nothing bulk mutations.

### Query conformance tests

Use small, readable fixtures with expected result sets. Cover empty data, cycles, disconnected graphs, duplicate-looking labels, reverse traversal, unresolved IDs, depth limits, stable ordering, and traversal across different reference fields. The form editor, JSON editor, and plain-language explainer use the same fixtures so semantic round trips are testable.

### Persistence contract tests

Run the same repository contract against the production adapter and an isolated test adapter if one exists. Include atomic batches, revision increments, query and rendering-specification migrations, and import/export round trips.

### Renderer contract tests

Given fixed result sets and rendering specifications, verify validation, defaults, migration, and renderer output/state. Test shared configuration once at its contract boundary and renderer-specific behavior separately. Important layouts and interactions need focused tests without relying exclusively on brittle full-screen pixel snapshots.

### End-to-end scenarios

Maintain at least these durable workflows:

1. paste a batch containing forward references, resolve preview errors, and commit it atomically;
2. multi-select entities, preview a destructive relational edit, confirm it, and observe one revision change;
3. construct the same query through the form and JSON editors, inspect its explanation, and save a new revision;
4. edit a relationship, observe a stale graph, refresh it, and inspect the new edge;
5. customize list, table, and graph views, restart the application, and retain equivalent presentation;
6. create and rank a second-domain record, then inspect it through configurable table, leaderboard, and card views; and
7. export and re-import representative canvases with equivalent canonical data and runnable definitions.

## 9. Cross-cutting rules

- Canonical mutations go through domain services; UI components do not write storage directly.
- Every record and query is scoped to one canvas unless a future feature explicitly defines cross-canvas behavior.
- Persisted schema, query, and rendering objects are versioned.
- Queries have explicit resource limits, especially traversal depth and result size.
- Unknown schema fields and values are data, not reasons to change engine code.
- Renderers never fetch additional domain data behind the result-set contract.
- Cached layouts or results are disposable derived state.
- Bulk mutations validate completely before writing, commit atomically, and increment the canvas revision once.
- Destructive actions show relational impact and prevent silent dangling IDs.
- Presentation configuration cannot mutate entities, queries, or cached result sets.
- User-defined appearance is validated data; renderers do not execute arbitrary CSS or code.
- Accessibility and keyboard operation are part of the authoring experience, not a final cosmetic pass.

## 10. Deferred decisions and when to make them

The completed milestones have resolved the stack, storage, deletion, query-serialization, and initial graph decisions. The remaining deferred decisions are made only when their feature enters scope:

- **Undo/redo history:** before exposing any undo command; decide durability, cross-session behavior, and interaction with schema and bulk mutations.
- **Conditional-style rule language:** during Milestone 7, before field-value color rules become persistent data.
- **Additional renderer set:** at the start of Milestone 8, using demonstrated needs from the second real canvas rather than a speculative renderer catalog.
- **Hierarchy/tree semantics:** when a real dataset needs a stricter interpretation than the graph renderer; define parents, cross-links, multiple parents, cycles, external references, and disconnected roots first.
- **Additional query semantics, including impact paths:** when a real question cannot be expressed by version 1; define its deterministic result contract before extending serialization.
- **Import conflict identity and merge rules:** before Milestone 9 import mutations are implemented.
- **AI provider, privacy, and local/remote execution:** before Milestone 10 adapters are selected.

None of these choices should weaken the invariants that each canvas has one canonical schema, queries are deterministic, and views are derived from its entities.

## 11. Release gates

### First-use-case gate

Proceed to the second-domain proof when a real ASI canvas demonstrates:

- comfortable individual and bulk entity and relationship authoring;
- understandable, editable, reusable queries;
- refreshable and configurable saved views, including the graph renderer;
- persistence across restart without semantic loss; and
- no ASI knowledge in the domain, query, persistence, or generic renderer layers.

A strict hierarchy renderer, deeper graph diagnostics, impact-path queries, and export/import are not prerequisites unless the real first-use-case workflow demonstrates that they are necessary.

### Generic RDC gate

Call the deterministic RDC foundation release-ready only when:

- both ASI and GD work through the same domain, query, saved-view, and rendering contracts;
- the second use case adds no new top-level data abstraction;
- portability and migration round trips pass; and
- critical workflows meet the documented reliability, accessibility, and performance limits.

### AI gate

Begin AI integration only when manually authored queries and rendering specifications are sufficient to exercise and test all supported behavior.
