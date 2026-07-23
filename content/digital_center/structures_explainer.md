# Structures Explainer

## Summary

Structures are first-class Digital Center objects for mostly-finished visual artifacts and custom representations.

They exist for information that should remain in a richer form than a note, archive item, calendar object, workstream, or context space can naturally provide. A Structure might be a static HTML dashboard, a Mermaid diagram, a future JSX/TSX mockup, a progress tracker, a roadmap visualization, or another custom artifact that deserves to be rendered and returned to later.

Structures solve two related problems:

1. **Artifact rendering:** Digital Center needs a clean place to store and view useful HTML or diagram artifacts without treating them like ordinary notes or external archive links.
2. **Custom representation:** Some parts of a user's digital life need specialized visual forms. Structures let those forms exist inside Digital Center while still participating in search, references, Context Spaces, and future intelligence layers.

Structures are not a code editor, plugin system, or arbitrary app runtime. Their role is to preserve, render, search, and connect visual representations.

---

## Position in Digital Center

Structures sit beside the other core feature types:

```text
Notes       = quick written capture
Archive     = saved external resources
Calendar    = time, rhythm, deadlines, and temporal objects
Workstreams = ordered paths of work
Switchboard = broad context organization
Structures  = custom visual representations
```

A Structure can be attached to a Context Space, found through global search, opened from references, and later used by LLM Workspace or extension-driven workflows.

Example:

```text
Context Space: Certifications
  Structure: Certification Progress Dashboard
  Workstream: Study AWS Developer Associate
  Calendar: Exam date / study windows
  Archive: AWS exam guide
  Notes: quick study observations
```

The Structure preserves the custom dashboard view. The rest of Digital Center provides time, execution, reference, and context around it.

---

## Product Boundary

Structures are intentionally not an authoring environment.

They should not try to provide:

- syntax highlighting as a core feature
- autocomplete
- linting
- formatting
- package management
- multi-file project editing
- component inspection
- debugging
- arbitrary external dependencies

The edit surface should stay simple: title, description, kind, source, searchable text, tags, and later emitted subobjects. Serious editing can happen in an external editor. Digital Center is where the artifact is stored, rendered, searched, and connected.

This boundary is permanent, not just a temporary v0 limitation.

---

# Layer 1: Core Structures

## Role

The first layer establishes Structures as renderable, searchable, referenceable artifacts.

Supported kinds:

```ts
type StructureKind = "html" | "mermaid";
```

Layer 1 supports:

- static HTML preview
- Mermaid.js diagram rendering
- plain source storage
- manual searchable text
- global search integration
- ObjectResolver / ObjectSummary integration
- reference support from Context Spaces

It does not support JSX/TSX rendering, emitted subobjects, external editor syncing, or LLM Workspace integration.

---

## Core Model

A conceptual shape:

```ts
type Structure = BaseObject & Taggable & {
  objectType: "structures.structure";
  title: string;
  description: string;
  kind: "html" | "mermaid";
  source: string;
  searchableText: string;
  tagIds: TagId[];
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};
```

The most important field is `searchableText`. Source code and diagram syntax are often poor semantic search material. The user needs a way to say what the artifact means.

For example, a certification dashboard may have noisy HTML source, but its searchable text can clearly say:

```text
Certification study roadmap for AWS Developer Associate, AWS ML Specialty,
NVIDIA Generative AI, PCPP1, and PCPP2. Tracks modules, topics,
completion, notes, and progress.
```

---

## UI Shape

The UI should resemble Notes more than Archive:

```text
Structures page
  left list
    title
    kind badge

  right detail panel
    edit / preview toggle
```

Edit view:

- title
- description
- kind selector
- searchable text
- source textarea
- tags if straightforward
- delete button

Preview view:

- HTML in a sandboxed iframe
- Mermaid rendered as a diagram
- readable failure state if rendering fails

There is no archive lifecycle. A Structure is either present or deleted.

---

## HTML and Mermaid

HTML is the first custom visual artifact format. It should render in a sandboxed iframe so the artifact does not become part of the app's privileged DOM.

Mermaid is included because diagrams are real visual structures, not just formatted text. Architecture diagrams, flowcharts, state machines, dependency maps, and roadmap diagrams all fit naturally here.

Markdown is intentionally excluded because Notes already handles markdown. JSON is excluded because it is a generic data structure, not a visual representation by itself.

---

# Layer 2: Structured Integration

## Role

The second layer makes Structures more semantically integrated without turning them into executable apps.

It adds:

- emitted subobjects
- auto-derived but overrideable searchable text
- JSX/TSX as stored source
- emissions from JSX/TSX artifacts

Supported kinds become:

```ts
type StructureKind = "html" | "mermaid" | "jsx" | "tsx";
```

JSX and TSX are stored as source at this layer, not executed.

---

## Emitted Subobjects

Some Structures contain meaningful internal entities.

A certification dashboard may contain:

- certifications
- modules
- topics
- tasks
- progress states

A roadmap may contain:

- phases
- milestones
- dependencies
- decisions

A diagram may contain:

- nodes
- systems
- relationships

Layer 2 allows a Structure to emit lightweight subobjects owned by the parent Structure.

Conceptual shape:

```ts
type StructureEmission = {
  id: string;
  kind: string;
  title: string;
  description?: string;
  searchableText?: string;
  sourcePath?: string;
  metadata?: Record<string, unknown>;
};
```

Example:

```text
Structure: Certification Progress Dashboard
  emits:
    Certification: AWS Developer Associate
    Certification: NVIDIA Generative AI
    Module: Serverless Compute
    Topic: Lambda Permissions & IAM
```

These emitted subobjects can contribute to search and may later become referenceable from Context Spaces or other Digital Center surfaces.

The parent Structure remains the owner. Emissions are not independent feature objects unless a future architecture deliberately promotes them.

---

## Derived Searchable Text

Layer 2 can derive search text from:

- visible HTML text
- Mermaid node labels
- declared emissions
- simple JSX/TSX static text
- comments or manifest sections

But derived text should always be overrideable or supplementable.

Reason: the source rarely captures the artifact's actual meaning as well as the user can.

A good model should distinguish:

```text
derived searchable text = what the system can infer
manual searchable text   = what the user says this means
```

The search document can use both, but the user must retain final control.

---

## JSX/TSX as Stored Source

Layer 2 supports JSX/TSX as stored Structure source because many LLM-generated visual artifacts are produced as React components.

At this layer:

- source is stored
- searchable text works
- emissions can be declared
- preview shows an unsupported-runtime placeholder
- no JSX/TSX is executed

This lets Digital Center preserve and integrate these artifacts before the runtime is ready.

---

# Layer 3: Isolated JSX/TSX Runtime

## Role

The third layer adds rendering for constrained JSX/TSX artifacts.

This is not a general plugin system and not a way to run arbitrary mini-apps. It is a controlled runtime for simple visual mockups and dashboards.

Intended artifacts:

- static dashboards
- simple progress trackers
- visual mockups
- roadmap views
- tables/matrices
- lightweight interactive prototypes
- single-file LLM-generated visual components

Not intended:

- full applications
- multi-file projects
- arbitrary npm packages
- networked apps
- filesystem access
- direct mutation of Digital Center state
- unrestricted plugin behavior

---

## Runtime Constraints

A safe JSX/TSX runtime should enforce strict limits.

### Single-file artifacts

A Structure should be one JSX/TSX file, not a project folder with package manifests, build configs, and arbitrary imports.

### No arbitrary imports

Imports should be disallowed or limited to a small allowlist, such as:

- React
- basic React hooks
- approved icon set
- explicit runtime helpers

### No network access by default

Structures are representations, not connectors. They should not fetch arbitrary remote data unless a later permission model explicitly allows it.

### No filesystem access

The runtime should not access local files, Tauri filesystem APIs, or app-managed storage.

### No parent app access

A Structure should not reach into the parent Digital Center window, stores, registries, or privileged APIs.

Any interaction must pass through a narrow runtime bridge.

### Explicit props only

If a runtime Structure receives app data, it should receive it through explicit, read-only props.

Example:

```ts
type StructureRuntimeProps = {
  structure: StructureSummary;
  emissions?: StructureEmission[];
  context?: StructureRenderContext;
};
```

The Structure should not be able to query the app freely.

---

## Runtime Bridge

A future runtime bridge should be small and permissioned.

Reasonable early bridge actions:

- open a referenced object
- open an emitted subobject
- notify the parent of a selected emission
- request navigation within the Structure

Actions to avoid initially:

- creating arbitrary Digital Center objects
- mutating Calendar, Workstreams, Notes, or Switchboard
- reading arbitrary app state
- accessing connectors
- writing files

The bridge is a boundary, not a convenience API.

---

## Relationship to Extensions

Structures and Extensions are different.

```text
Structure = user-owned visual representation
Extension = external integration/signal provider
```

A JSX/TSX runtime should not accidentally become the Extensions framework. Extensions may eventually produce or feed Structures, but a Structure remains an artifact, not a connector.

---

# Long-Term Meaning

Structures clarify an important Digital Center principle:

```text
Digital Center should not force every kind of information
into one universal object shape.
```

Some information needs a custom representation. The scalable answer is not to flatten it into Notes, Calendar, Workstreams, or Context Spaces. The scalable answer is to let custom representations exist as first-class objects that still obey the shared object universe.

A Structure should therefore be:

- renderable
- searchable
- referenceable
- attachable to Context Spaces
- openable from global search
- potentially mountable into LLM Workspace
- eventually capable of emitting subobjects

This lets Digital Center support unique representations without becoming a chaotic arbitrary app runtime.

The core idea is:

```text
Preserve the custom view,
but integrate it into the system.
```
