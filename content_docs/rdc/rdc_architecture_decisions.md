# RDC Architecture Decisions

This file records the foundational decisions made for Milestone 0. Later changes should be documented here before they alter a durable contract.

## ADR-001: Desktop runtime and UI

- **Decision:** Use Tauri 2 with React 19, TypeScript, and Vite.
- **Reason:** RDC is a local-first desktop application. Tauri provides a small native shell and lets the UI remain a conventional React application.
- **UI hierarchy:** Canvases are the top-level tab row. The selected canvas's authoring and saved views occupy a second tab row directly beneath it.

## ADR-002: Persistence ownership

- **Decision:** The Rust/Tauri process owns local persistence. The React UI accesses it through a small command-backed interface.
- **Database:** SQLite through `rusqlite`, built with bundled SQLite for reproducible local setup.
- **Location:** The database lives in Tauri's application data directory, not in the source tree or current working directory.
- **Reason:** SQLite provides transactional, inspectable, single-file local persistence without a service dependency.

## ADR-003: Migrations

- **Decision:** Run ordered, append-only SQL migrations when the application opens the database.
- **Tracking:** Applied versions are stored in `schema_migrations`.
- **Milestone 0 scope:** The first migration stores canvas identity and revision only. Canonical schemas and entities are introduced in Milestone 1.

## ADR-004: Stable identifiers

- **Decision:** Use opaque UUID v4 strings for persisted identifiers.
- **Reason:** They are locally generatable, stable across import/export, and do not embed domain meaning.

## ADR-005: Versioning

- **Decision:** Version database migrations independently from persisted schema and saved-view formats.
- **Current scope:** Database migration versioning is implemented now. Canvas-schema and saved-view format versions begin when those objects are introduced.

## ADR-006: Graph rendering

- **Decision:** Defer the graph library until Milestone 4.
- **Constraint:** The selected library must accept generic result sets and rendering specifications, support hierarchical layout, and remain independent of ASI semantics.
- **Reason:** Choosing it before the result-set and renderer contracts exist would add an unused dependency.

## ADR-007: Import and export

- **Decision:** Use a versioned JSON document when import/export is implemented.
- **Constraint:** The document must preserve canvas identity, its single canonical schema, entities, and saved-view definitions without relying on SQLite internals.
- **Reason:** JSON is portable, inspectable, and separates the interchange contract from storage.

## ADR-008: Module boundaries

- **Domain:** Defines application concepts and repository interfaces; imports neither UI nor concrete persistence.
- **Persistence:** Implements domain repository interfaces and owns migrations.
- **Query:** Will execute deterministic structured queries over domain-facing data access.
- **Renderers:** Will consume result sets and rendering specifications without fetching storage.
- **UI:** Composes the application and depends on domain-facing interfaces rather than SQLite.

## ADR-009: Optional fields and schema changes

- **Decision:** `id` is the only mandatory field. Every other schema-defined field may be empty on any entity.
- **Rename:** Renaming a field preserves existing values under the new key.
- **Type change:** The application previews entities with incompatible non-empty values. After confirmation, only those values are cleared.
- **Removal:** The application previews entities with non-empty values. After confirmation, the field and all of its values are removed.
- **Safety:** Preview and application are both evaluated against current data, and destructive application is transactional.

## ADR-010: Entity deletion and references

- **Decision:** Before deleting an entity, RDC derives incoming references by scanning schema-defined Entity and List-of-Entity fields.
- **Confirmation:** When references exist, the confirmation names each referencing entity and field.
- **Cleanup:** Confirmed deletion clears singular references and removes the ID from list references in the same transaction as deletion.
- **Integrity:** New or edited non-empty reference values must resolve to an entity in the same canvas.

## ADR-011: Schema display and field order

- **Display field:** Each canvas schema stores one `displayField` key. Compact entity representations use only that field and fall back to the entity ID when its value is empty.
- **Field order:** Schema field order is durable and drives authoring, inspection, and table column order. Reordering must submit an exact permutation of all current field keys.
- **Schema changes:** Renaming the selected display field updates `displayField`. Removing it resets `displayField` to `id` after the normal confirmation flow.
- **Versioning:** Changing the display field or field order advances both schema version and canvas revision.

## ADR-012: Structured query version 1

- **Serialization:** Query fixtures are versioned JSON objects. Version 1 has optional `from`, `traversals`, `relationshipFields`, `select`, `sort`, `groupBy`, and `limit` members. Predicates within `from` compose with AND.
- **Execution:** Selection produces roots; each bounded traversal expands from those roots; sorting, limit, projection, grouping, and relationship derivation produce a read-only `ResultSet` at the current canvas revision.
- **Bounds:** Traversal depth is limited to 1–8 and result count to 10,000. Visited-ID tracking bounds cycles. Missing referenced IDs are never followed or emitted as in-result relationships.
- **Determinism:** Default ordering and all semantic ties use entity ID solely to make structurally equal inputs produce structurally equal outputs. This tie-breaker carries no product-level rank meaning.
- **Renderer boundary:** The query engine consumes an already loaded `CanvasDocument`. Read-only list and table renderers consume its `ResultSet` and do not read persistence themselves.

### Empty-value policies

The following are deliberately separate query policies and are implemented as independently tested functions:

- comparison predicates (`eq`, `neq`, `contains`, `not_contains`, `gt`, `gte`, `lt`, `lte`) never match an entity whose queried field is empty;
- `is_empty` and `is_not_empty` are explicit predicates available for every field;
- sorting by a field excludes entities whose value for that field is empty;
- sorting any List field means descending list length, regardless of requested direction; equal-length entities have no semantic order;
- grouping a scalar field creates one group per populated value;
- grouping any List field places an entity in every item-value group;
- grouping any empty value places each empty entity in its own group after all populated groups.

## ADR-013: Reusable query library

- **Scope:** Each canvas owns an ordered library of reusable structured-query definitions.
- **Contents:** A reusable query stores its opaque ID, name, description, and versioned query JSON only. It does not store a rendering specification, copied/cached results, or refresh state; those remain Milestone 3 saved-view responsibilities.
- **Lifecycle:** Users can create, select, rename/update, and explicitly confirm deletion of reusable queries. Names are unique within a canvas, case-insensitively.
- **Initial library:** New and migrated canvases are seeded exactly once from a shared three-query catalog. Deleting an initial query is durable and never triggers reseeding.
- **Presentation:** Result sets retain raw entity IDs. Read-only renderers resolve entity-reference values and derived relationship endpoints through the canvas display field, falling back to ID when necessary.

## ADR-014: Query revisions and saved views

- **Query history:** Every reusable-query update creates an immutable, monotonically numbered revision containing the query name, description, and structured definition. History is retained indefinitely. Loading an older revision and saving creates a new head revision; history is never rewritten.
- **Reference:** A saved view references a reusable query by stable ID rather than copying its query definition. Deleting a referenced query is blocked with the dependent saved-view names until those views are deleted or reassigned.
- **Contents:** A saved view stores its name, query ID, versioned rendering specification, last-run canvas revision, last-run query revision, and optional cached `ResultSet`.
- **Staleness:** A view is stale when it has never run, the canvas revision differs from its last-run canvas revision, or its reusable query's head revision differs from its last-run query revision. Canvas and query staleness are evaluated independently.
- **Explicit refresh:** Opening a stale view continues to show its prior cached result unchanged. Refresh executes the current query against the current canvas and atomically replaces the cached result only if both revisions are still current when persistence commits it.
- **Configuration:** Changing a view's query reference or renderer requires saving the configuration before refresh. Changing the query reference preserves the old cache but marks it stale.
- **Initial renderers:** Rendering specification version 1 supports read-only `list` and `table` renderers. Invalid or unknown specifications are rejected before persistence.
- **Workbench boundary:** The Query page remains a neutral inspection surface with list/table switching. Rich or use-case-specific renderers belong to saved views, where their versioned configuration and refresh state can be persisted. Extracting a current reusable-query result into a view reuses that result as the initial cache rather than executing the query again.

## ADR-015: Generic hierarchical graph renderer

- **Data boundary:** Graphs consume only a saved view's cached `ResultSet`; they never create graph-specific copies of entities or relationships and never read live entity values around stale-cache semantics.
- **Configuration:** A version 1 graph specification selects a label field, zero or more entity-reference fields, and the hierarchical layout. Persistence validates configured fields against the canvas schema; obsolete configurations fail visibly in the renderer.
- **Direction:** If A references B, A is placed above B as the higher abstraction, while the rendered arrow points B → A to show dependency flow.
- **Layout:** Nodes and strongly connected components are ordered by stable entity IDs. Shared prerequisites and multiple parents remain ordinary graph structures. Cycles are reported and highlighted without hiding their entities or edges.
- **Interaction:** The graph is read-only and provides zoom, pan, fit, label filtering, one-hop neighbor focus, and cached entity-detail inspection.
- **Scope:** The renderer contains no ASI schema, seed data, entity names, or relationship names.

## ADR-016: Transactional bulk authoring

- **Storage compatibility:** Milestone 5 adds commands, not tables or columns. Existing canvas, schema, entity, query, saved-view, and cached-result data require no migration or rewrite.
- **Bulk identity:** Clipboard imports require explicit entity IDs so references may target existing entities or entities later in the same batch.
- **Validation:** The complete batch is normalized and validated against the canvas schema before any insert. Duplicate IDs, existing IDs, invalid values, self-references, and unresolved references reject the batch.
- **Atomicity:** A valid bulk creation or bulk edit commits in one SQLite transaction and increments the canvas revision once. A failed or rejected batch writes nothing.
- **Bulk editing:** Multi-entity operations support set, clear, add-to-list, and remove-from-list. Operations use the same field-type and reference validation as individual editing.
- **Confirmation:** Replacing or removing populated values requires confirmation that names the affected entities. Additive and no-op changes do not require confirmation.

## ADR-017: Composable field types and nested choices

- **Type model:** Singular schema types are text, number, boolean, date, date/time, choice, Entity, rating, and duration. `List` has one configured singular item type; nested lists are invalid. The prior `entity_id_list` type is represented as `List<Entity>`.
- **References:** `Entity` is the formal type name, while stored values remain direct IDs of specific entities. Neither singular nor list references can contain embedded queries or constraints.
- **Ratings:** A rating field has a positive denominator. Its stored numerator may be any finite number, including zero, decimals, and negative values.
- **Durations:** A duration field has an ordered, nonempty unit selection from weeks through milliseconds. Storage is one nonnegative millisecond value; editing and rendering decompose it using the configured units.
- **Choices:** Choices support exactly one parent/child level and an optional multi-select mode. Parent and child values are both selectable, and identical child labels under different parents remain distinct through parent-qualified stored values. Equality against a parent includes that parent and its children; equality against a child includes only that child. Multi-select predicates match when any included value matches, as does `List<Choice>`. Child values render as `Parent > Child` outside the compact entity selector, with multiple selections comma-separated. Single-to-multi schema changes wrap values; multi-to-single changes unwrap one-item arrays and confirm before clearing only ambiguous multi-item arrays.
- **Compatibility:** Existing `enum`, `entity_id`, and `entity_id_list` schema JSON remains readable and is normalized in memory to the new model. No existing entity values are rewritten by the migration.

## ADR-018: Optional canvas ranking

- **Representation:** Ranking is a canvas-level option implemented as a system-managed `rank` number field in the canvas's one schema. It is queryable and appears in the normal entity editor, but schema rename, type-change, removal, and bulk-edit operations cannot mutate it.
- **Invariant:** While enabled, n entities have exactly the integer ranks 1 through n. New entities append. Editing rank on an entity atomically shifts the intervening range; deleting an entity compacts the ranks after it.
- **Lifecycle:** Enabling initializes rank from current persisted entity order. Disabling requires confirmation, removes the field and all values, and provides no restoration on reenabling. A user field keyed `rank` blocks enablement.
- **Migration:** Migration 7 adds only `canvases.rank_enabled` with a false default. Existing canvases, schemas, entities, queries, views, revisions, and cached results remain in place.
