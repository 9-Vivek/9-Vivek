# Switchboard — Feature Explainer & Architecture Blueprint

## 1. Purpose & Core Philosophy

The **Switchboard** organizes Digital Center around **Context Spaces** — semantic domains of a user's life or work (e.g., `#Startup-Platform`, `#ML-Research`, `#Personal-Finance`). Rather than grouping work by where it's stored, a context space collects references to objects that already live in other features (Notes, Archive, Calendar, Structures, Workstreams). Nothing is duplicated or moved — attaching something to a space creates a link, not a copy.

The Switchboard operates in two modes:

1. **The Architect Phase (Main App Page):** A full-screen environment inside Digital Center for creating, configuring, and reviewing the state of a context space.
2. **The Execution Phase (Floating Global Overlays):** Lightweight, on-demand desktop sidebars that project the active context *over* external tools (IDEs, browsers, design tools) without resizing or obscuring them.

---

## 2. The Main Switchboard Page (The Architect View)

### State A: The Global Directory

The root view shows all context spaces as styled cards. Each card summarises the space's current state — title, subtitle, accent, objective snippet, and attachment count. Spaces can be sorted by recency, size, or a manually fixed layout (drag-reorder). Archived spaces appear in a collapsed section below the active grid.

### State B: The Context Workspace (Dashboard + Context Rail)

Clicking a card opens the space's detail view, which has two modes: **Dashboard** (read) and **Configure** (edit). The dashboard is divided into a left panel and a right rail separated by a drag-resizable splitter.

#### Left panel — 2×2 card grid

```text
┌──────────────────────────────────┬──────────────────────────────────┐
│          NOTES POOL              │         CONTENT STREAM           │
│  Attached notes from the Notes   │  Attached archive items,         │
│  feature.                        │  structures/diagrams, and any    │
│                                  │  other non-calendar content.     │
├──────────────────────────────────┼──────────────────────────────────┤
│           SIGNALS                │        LLM WORKSPACE             │
│  (placeholder — future           │  (coming soon)                   │
│  extension-driven signals)       │                                  │
└──────────────────────────────────┴──────────────────────────────────┘
```

#### Right rail — Context + Execution

The right rail is a fixed-width panel (drag-resizable) containing collapsible sections:

- **Description** — freeform background context for the space (read-only here; edit in Configure).
- **Current Objective** — a short inline-editable statement of the immediate goal. Edits persist live without switching modes.
- **Tags** — space-level tags for cross-feature organisation.
- **Execution** — the active task list for this space: attached workstreams and calendar blocks. Workstreams are the primary item here — each is a lightweight ordered task list scoped to this space. Calendar events and task instances explicitly attached to the space also appear. This is where execution lives; the content lanes in the left panel provide supporting reference material.

#### Attaching objects

All attachment is manual. Clicking **+ Attach** in the breadcrumb bar opens an inline search that spans all features. Lane routing is silent and automatic: calendar objects go to Execution, notes to Notes Pool, everything else (archive items, structures, diagrams, etc.) to Content Stream. Structures are ordinary content objects — they attach to Content Stream like any other item and carry no special treatment. Hovering an attached item reveals a **×** to detach; the original object is untouched.

---

## 3. The Global Cockpit (The Overlay System)

When the user moves to deep work in an external tool, they can project the active context into their peripheral vision using **Global Overlays** — a left panel and a right panel. Both are floating, borderless, always-on-top windows that appear and disappear without resizing or moving the underlying application.

```text
LEFT OVERLAY (Reference)                    RIGHT OVERLAY (Execution)

┌────────────────────────────────────┐      ┌────────────────────────────────────┐
│  NOTES POOL                        │      │  CURRENT OBJECTIVE                 │
│  Fleeting code ideas, scratch      │      │  Implement OAuth2 securely         │
├────────────────────────────────────┤      ├────────────────────────────────────┤
│  CONTENT STREAM                    │      │  ACTIVE WORKSTREAM                 │
│  Postgres specs, saved references  │      │  [ ] Design migration file         │
├────────────────────────────────────┤      │  [x] Write token validation        │
│  SIGNALS                           │      │  [ ] Generate test suite           │
│  (placeholder)                     │      │                                    │
└────────────────────────────────────┘      └────────────────────────────────────┘
```

### Right Overlay Panel (Execution)

The right panel is optimised for minimal horizontal footprint and maximum signal-to-noise. It shows:

1. **Current Objective** — the space's immediate goal, surfaced as a stable anchor against rabbit-hole distractions.
2. **Active Workstream** — the ordered task list for the active stream in this space, with the current-position item highlighted. Items can be checked off directly from the overlay. This is a live projection of the Workstreams feature scoped to the active space — not a freeform checklist.

### Left Overlay Panel (Reference)

The left panel mirrors the content lanes from the main dashboard in an accordion layout. Each lane collapses to a single-line summary and expands on click to reveal its individual items. Only one lane is expanded at a time. Clicking an item passes the reference back to the main app, which opens the originating feature directly on that object.

---

## 4. System Properties

### Data model

A context space owns only its metadata (title, subtitle, objective, description, accent, tags) and two lists of references: `workstreamRefs` (links to Workstream objects owned by the Workstreams feature) and `attachments` (links to any other feature's objects, each carrying its assigned lane). The space never duplicates or stores the linked objects themselves.

### Local-first

The Switchboard operates entirely locally. No data is synced to an external service. References remain stable as the linked objects are edited — the space always resolves to the current state of the object, not a snapshot.

### Overlay performance

Overlay panels are decoupled, borderless, always-on-top window threads. They float over external applications without resizing the system desktop or compressing active tools. They dismiss instantly when focus shifts away.
