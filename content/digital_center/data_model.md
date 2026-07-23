# Data Model

## Purpose

This document defines the shared data model for Digital Center.

It does not attempt to define every object in every feature. Calendar events, archive items, notes, switchboard context spaces, LLM workspace sessions, and feature-specific extension payloads should each be defined in their own module architecture documents.

The purpose of this document is to define the shared object universe: the small set of primitives and rules that allow independently owned modules to behave like one coherent system.

The global data model answers questions like:

- How is every object identified?
- How does one object reference another object without duplicating it?
- How do generic surfaces render unknown object types?
- How do global tags work?
- How does global search index objects across modules?
- How do time-based triggers surface across the app?
- How do extension objects fit into the system?
- How should local-first persistence, ownership, and derived data be handled?

The guiding principle is:

> Keep the global layer small, but make the shared contracts strong.

---

## Layer Hierarchy

The system should be thought of in layers.

```text
global/
  shared primitives, references, tags, search, themes, triggers

features/
  calendar/
  archive/
  notes/
  switchboard/
  llm-workspace/
  extensions/

features/extensions/providers/
  email/
  google-discover/
  linkedin/
  discord/
  etc.
```

The global layer defines the basic rules of the object universe. It should not know the full schema of a calendar event, archive item, note, switchboard context space, LLM workspace session, or Discord message.

Feature modules own their own canonical objects. The global layer only provides the shared contracts that allow those objects to be referenced, tagged, searched, themed, and surfaced.

The Extensions feature is itself a feature module. It owns the extension framework and base extension object model. Individual extension providers live underneath it.

---

## Ownership

Ownership is not about where data physically lives. In a local-first app, all data may live in the same local database or local files.

Ownership means **authority over meaning and mutation**.

A feature owns an object type if that feature is responsible for:

- defining the full schema
- validating it
- creating it
- mutating it
- deleting or archiving it
- migrating it between schema versions
- deciding what its fields mean
- exposing summaries and search projections to the rest of the app

For example:

- Archive owns archive items.
- Calendar owns calendar objects.
- Switchboard owns context spaces, their ingestion rules, and the objectives/tasks/reminders attached to a space.
- LLM Workspace owns conversation sessions, branches, and artifacts.

Other modules can reference these objects, but should not directly mutate their internals.

The rule is:

> Read broadly, mutate through the owner.

This allows the system to feel unified without turning every module into a dependency of every other module.

---

## Canonical vs. Derived Data

Every feature owns its canonical data: the user-authored or source-of-truth fields that must be preserved.

Derived data is data that can be recomputed from canonical data or external processing.

For example, an archive item may canonically store a URL, title, context note, tags, and saved timestamp. Processed page text, embeddings, summaries, and search tokens are derived. If the derived data is deleted or the schema changes, it should be possible to rebuild it.

Similarly, a note canonically stores its content and metadata. Recognized links, preview snippets, and search index entries can be derived.

Global search is also derived. It does not own the original objects. It stores or computes searchable projections exposed by feature modules.

The rule is:

> Canonical data is owned by the feature. Derived data is owned by the system or subsystem that computes it, and must be rebuildable when possible.

---

# Global Primitives

## BaseObject

`BaseObject` is the minimal identity and lifecycle contract for persisted objects.

It should not contain display fields like title, description, icon, or preview text. Those fields are not truly universal and often have feature-specific meaning.

A minimal shape is:

```ts
type BaseObject = {
  id: ObjectId;
  objectType: ObjectType;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt?: ISODateTime;
  schemaVersion: number;
};
```

### Why it exists

Every persisted object needs stable identity and lifecycle metadata.

### Why it belongs globally

All modules need the same ID, timestamp, deletion, and migration assumptions.

### What it should not do

`BaseObject` should not become a giant superclass. It should not hold generic preview fields, tags, search text, or feature-specific metadata.

---

## Shared Interfaces and Capabilities

Some shared behaviors should be modeled as lightweight interfaces or capability contracts rather than fields on `BaseObject`.

For example, many objects are taggable, searchable, referenceable, or mountable, but not every object needs those fields in the same way. A note, archive item, calendar object, context space, and extension object may all support tags, but the owning feature should still decide where those tag IDs live and what tagging means for that object.

Conceptually, this can be represented with interfaces like:

```ts
type Taggable = {
  tagIds: TagId[];
};

type Referenceable = {
  id: ObjectId;
  objectType: ObjectType;
};

type Searchable = {
  getSearchDocument(): SearchDocument;
};
```

These interfaces are not meant to create a rigid inheritance tree. They are shared contracts that describe what a feature object can participate in.

### Why this exists

This avoids bloating `BaseObject` while still making common behaviors explicit.

Instead of saying every object has tags, search fields, previews, and theme data, the model says:

> Some objects participate in tagging, search, references, etc. through shared capability contracts.

### Why it belongs globally

The capability names and expectations need to be consistent across modules. However, the actual data remains owned by the feature object that implements the capability.

For example:

- Archive items and notes may be `Taggable`, `Searchable`,  `Referenceable`, and `Mountable`.
- Reminders may be `Taggable` and `Searchable` but are not `Referenceable` or `Mountable`.
- Calendar rhythm templates may be `Referenceable` but not `Mountable`.

`Mountable` is the generalized successor to the old board-specific "pinnable" idea: any `Referenceable` object can be **mounted into a surface that collects references** — a Switchboard Context Space stream, or an LLM Workspace context bundle — without being copied. The capability is not tied to any single feature; it simply marks objects that such surfaces are allowed to gather.

This keeps the shared model flexible without forcing every object into one large universal schema.

---

## ObjectReference

`ObjectReference` is the universal pointer format.

It says:

> This object points to another object somewhere in the system.

A simple shape is:

```ts
type ObjectReference = {
  objectType: ObjectType;
  objectId: ObjectId;
};
```

A Switchboard reference (or an LLM Workspace mounted object) pointing at an archive item might store:

```ts
{
  objectType: "archive.item",
  objectId: "arch_123"
}
```

### Why it exists

Cross-object linking is central to the app. Notes can reference archive items. Switchboard context spaces can reference calendar objects. Reminders can reference extension objects. Search results can point back to any object.

### Why it belongs globally

Every module needs a common way to point to objects owned by other modules without duplicating them.

### Key rule

A reference is not a copy. It should remain stable even if the referenced object changes.

If a referenced object is missing, deleted, or unavailable, the UI should degrade gracefully rather than crashing.

---

## ObjectResolver and ObjectSummary

An `ObjectReference` only identifies an object. It does not explain how to find it, summarize it, search it, or render it.

That is the job of an `ObjectResolver`.

Each module registers a resolver for the object types it owns. The resolver knows how to:

- find an object by ID
- produce a compact summary for generic UI
- produce a search document for global search

A resolver conceptually looks like:

```ts
type ObjectResolver<T> = {
  objectType: ObjectType;
  getById(id: ObjectId): T | null;
  getSummary(object: T): ObjectSummary;
  getSearchDocument(object: T): SearchDocument;
};
```

`ObjectSummary` is the compact, derived shape returned for generic surfaces:

```ts
type ObjectSummary = {
  ref: ObjectReference;
  title: string;
  subtitle?: string;
  description?: string;
  featureId: FeatureId;
  updatedAt?: ISODateTime;
};
```

### Why this exists

Generic surfaces need to show references without knowing every feature’s internal schema.

For example:

- Switchboard reference cards
- LLM Workspace mounted-object chips
- global search results
- related-object chips
- command palette results
- add-from-system search
- reminder target displays

All of these need a small representation of an object. But they should not import the full Archive, Notes, Calendar, or Extensions schema.

### Why it belongs globally

The resolver contract is the bridge between module-owned objects and global UI surfaces.

### Important distinction

`ObjectSummary` is derived, not canonical. It should not be stored as the source of truth.

The owning feature decides how to summarize its objects. The generic UI simply asks the registry for the summary.

---

## Tag

Tags are global labels that can be applied across features.

A tag might look like:

```ts
type Tag = {
  id: TagId;
  name: string;
  createdAt: ISODateTime;
  color?: string;
};
```

### Why it exists

Tags provide cross-module organization. The same tag can apply to notes, archive items, calendar objects, context spaces, and extension objects.

### Why it belongs globally

If every feature owned its own tags, the system would fragment quickly. A tag like `startup`, `internship`, or `rag` should mean the same thing everywhere.

### Design rules

Tags should be stored as IDs, not raw strings, wherever possible.

Tags should not be used to encode object type, feature identity, or mode identity. They are for user-defined organization.

---

## ResourceRef

`ResourceRef` is the shared pointer format for resources outside or adjacent to the app.

It can represent:

- external URL
- local file
- app-managed file
- Obsidian path
- provider resource
- extension-linked resource

A possible shape is:

```ts
type ResourceRef = {
  kind: "url" | "local-file" | "app-file" | "obsidian-path" | "provider-resource";
  uri: string;
  label?: string;
  provider?: {
    featureId?: FeatureId;
    integrationId?: string;
    externalId?: string;
    fetchedAt?: ISODateTime;
  };
};
```

### Why it exists

Many features need to point to external or file-like things. Archive items point to URLs. Notes may contain links. Switchboard spaces may include image/file/link cards. Extensions may surface external platform resources. Obsidian export may point to a vault path.

### Why it belongs globally

All modules need one consistent way to represent resource pointers without inventing their own incompatible formats.

---

## FeatureTheme

`FeatureTheme` defines reusable visual language templates.

It combines colors, density, spacing/shape preferences, and broad visual style.

A possible shape is:

```ts
type FeatureTheme = {
  id: string;
  name: string;
  colors: {
    background: string;
    surface: string;
    text: string;
    mutedText: string;
    border: string;
    accent: string;
    accentSoft?: string;
    danger?: string;
    success?: string;
  };
  visualLanguage: {
    density: "compact" | "comfortable" | "spacious";
    radius: "sharp" | "soft" | "rounded";
    contrast: "low" | "medium" | "high";
    glow?: boolean;
  };
};
```

A feature can then select a theme template.

### Why it exists

Different features can have distinct visual identities, but they should still draw from a common design language.

### Why it belongs globally

The app should not have each feature inventing its own incompatible color or density system.

---

## SearchDocument

`SearchDocument` is the derived projection used by global search.

It is not the original object. It is what a module contributes to the search index.

A possible shape is:

```ts
type SearchDocument = {
  ref: ObjectReference;
  title: string;
  exactText: string;
  semanticText?: string;
  tagIds?: TagId[];
  updatedAt: ISODateTime;
  featureId: FeatureId;
  embeddingRef?: string;
};
```

### Why it exists

Global search cannot simply search `BaseObject`. Different objects have different searchable fields.

A note is searched through its content. An archive item is searched through its title, URL, context note, tags, and possibly processed page text. A calendar object is searched through its title and description. An extension object may be searched through provider-specific fields.

Each module knows how to produce the right search projection for its own objects.

### Why it belongs globally

Global search needs one shared indexing shape.

### Key rule

`SearchDocument` is derived and rebuildable. The original object remains owned by its feature module.

---

## TimeTrigger

`TimeTrigger` is a thin app-wide scheduling primitive.

It exists so that time-based prompts can surface at the homepage/app-shell level, even if they were created by a specific feature.

A possible shape is:

```ts
type TimeTrigger = BaseObject & {
  objectType: "global.timeTrigger";
  fireAt: ISODateTime;
  title: string;
  body?: string;
  targetRef?: ObjectReference;
  status: "pending" | "fired" | "dismissed" | "snoozed";
  snoozedUntil?: ISODateTime;
  createdByFeature: FeatureId;
};
```

### Why it exists

Reminders, follow-ups, archive read-later prompts, project task nudges, and other future time-based prompts need a shared way to surface.

### Why it belongs globally

The app shell or homepage needs to know when something should fire without understanding the full feature-owned object behind it.

### What it is not

`TimeTrigger` is not a full reminder. A Reminder can be owned by a future Reminder module. The Reminder can create a `TimeTrigger`, but the trigger itself only handles app-wide firing behavior.

---

# Extensions Layer

The Extensions feature is a feature-level system, not part of the global primitive layer.

It owns:

- extension definitions
- extension configuration
- extension sync state
- extension objects
- extension capabilities
- provider-specific payloads

The global layer only needs to be able to reference and search extension objects through the same resolver and reference contracts used elsewhere.

---

## ExtensionManifest

An `ExtensionManifest` is an extension’s self-description.

It tells the app:

- who the extension is
- what object types it provides
- what capabilities it supports
- what configuration it needs
- what entry points it participates in
- what permissions it requires

A conceptual shape is:

```ts
type ExtensionManifest = {
  id: string;
  name: string;
  description?: string;
  version: string;
  provider: "built-in" | "third-party";
  objectTypes: ExtensionObjectTypeDefinition[];
  capabilities: ExtensionCapability[];
  configSchema?: ExtensionConfigField[];
  permissions?: ExtensionPermission[];
  entryPoints?: {
    panel?: boolean;
    quickCapture?: boolean;
    backgroundSync?: boolean;
    globalSearch?: boolean;
  };
};
```

### Purpose

The manifest is the contract between an extension and the app.

The app uses it to know how to display the extension, what settings to ask for, what actions to show, and whether the extension participates in panels, background sync, global search, or quick capture.

---

## ExtensionObject

An `ExtensionObject` is an object surfaced by an extension.

It should extend `BaseObject`, but live under the Extensions feature rather than the global layer.

A conceptual shape is:

```ts
type ExtensionObject = BaseObject & {
  extensionId: string;
  externalId: string;
  sourceUrl?: string;
  title: string;
  capturedAt?: ISODateTime;
  fetchedAt?: ISODateTime;
  rawType: string;
  payload: unknown;
  tagIds?: TagId[];
};
```

The `payload` is provider-specific.

For Discord, it might include server, channel, author, message text, and sent time.

For email, it might include sender, subject, snippet, received time, and thread ID.

### Purpose

Extension objects need to be first-class enough to be referenced, searched, pinned to boards, saved to archive, or used to create notes/reminders.

But their provider-specific details should remain inside the extension provider module.

---

## ExtensionCapability

Capabilities describe what an extension can do.

Examples:

- surface content in an extension panel
- participate in global search
- sync in the background
- save to archive
- create note
- create reminder
- pin to board

### Purpose

Capabilities allow the UI to show the right actions for each extension without hardcoding behavior for every provider.

An email extension and a Discord extension may both support creating reminders, but only some extensions may support background sync or archive capture.

---

## ExtensionConfig

`ExtensionConfig` stores the user’s actual settings for an extension.

For example, a Discord config might store selected servers, selected channels, and sync frequency.

An email config might store selected inboxes, unread-only settings, or item limits.

### Purpose

The manifest defines what can be configured. The config stores what the user chose.

---

## ExtensionSyncState

`ExtensionSyncState` tracks whether an extension is enabled, syncing, idle, disabled, or failing.

External systems are unreliable. Authentication can expire, APIs can fail, network access can disappear, and rate limits can occur.

This state should be separate from the objects themselves.

### Purpose

The app needs to know whether the extension is healthy without confusing sync errors with the validity of already captured objects.

---

## Provider Modules

Each provider module owns its own payload schema and source-specific logic.

Examples:

- Email provider owns email message payloads.
- Discord provider owns Discord message payloads.
- LinkedIn provider owns LinkedIn post payloads.
- Google Discover provider owns feed item payloads.

The Extensions feature owns the base framework. Providers own source-specific meaning.

---

# Persistence and Migration

The app is local-first. The data model should assume that canonical data is stored locally and remains accessible even when internet access is unavailable.

A root app state or local database should track:

- app schema version
- global primitives
- feature-owned canonical stores
- extension state
- derived indexes and caches

Feature modules should have their own schema versions where needed. This makes it possible to migrate Notes without touching Archive, or migrate Switchboard without changing Calendar.

Derived data such as search indexes, embeddings, processed archive content, and object summaries should be rebuildable when possible.

The persistence rule is:

> Store canonical data carefully. Treat derived data as disposable or rebuildable unless explicitly marked otherwise.

---

# Module Interaction Rules

## Read broadly, mutate through owner

A module can read objects from other modules through references, summaries, and selectors.

It should not directly mutate another module’s canonical object internals.

## References should remain stable

Object IDs should not change when titles, tags, or display properties change.

## Generic surfaces use resolvers

Switchboard, the LLM Workspace, global search, command palettes, reference chips, and related-object panels should not directly know every feature schema. They should use the object registry and module resolvers.

## Feature-specific connectors belong to their feature

Obsidian export belongs to Notes. Trello/MS Planner loading belongs to the Switchboard (feeding a context space's project awareness). These are not general marketplace extensions since they are not independent extension surfaces.

## General external signal surfaces belong to Extensions

Email, Google Discover, LinkedIn, Discord, and similar sources should follow the Extensions framework.

---

# Examples

## Example 1: Mount a Discord message into a Switchboard Context Space

This example uses the Switchboard, but the same mechanism applies to any surface that collects `Mountable` references — an LLM Workspace context bundle works identically.

### What is already there

Before the user does anything, several pieces already exist.

The Discord extension is installed and enabled. Its `ExtensionManifest` declares that it provides Discord message objects and supports actions such as surfacing messages, global search, and being mounted into reference surfaces.

The Discord provider has already synced or loaded selected messages. One of those messages exists as an `ExtensionObject` owned by the Extensions feature:

```ts
{
  id: "extobj_456",
  objectType: "extensions.discord.message",
  extensionId: "discord",
  externalId: "discord_msg_abc",
  title: "Message from Alex in #ai-tools",
  payload: {
    serverName: "AI Builders",
    channelName: "ai-tools",
    authorName: "Alex",
    messageText: "Try evaluating the workflow on edge-case PDFs...",
    sentAt: "2026-05-05T15:30:00"
  }
}
```

The Extensions feature has registered an object resolver for `extensions.discord.message`. That resolver knows how to find this object by ID and produce summaries/search documents for it.

A Context Space also already exists, owned by the Switchboard feature.

### What happens at runtime

The user opens the Context Space's Architect view and clicks an “Add from system” search control.

They search for `edge-case PDFs`.

The search surface queries the global search index. The Discord message appears because the Extensions resolver previously contributed a `SearchDocument` for it.

The user selects the Discord message result and chooses to add it to the current space.

The Switchboard does not copy the Discord message. It creates a reference entry in the space:

```ts
{
  id: "card_1",
  type: "reference",
  reference: {
    objectType: "extensions.discord.message",
    objectId: "extobj_456"
  }
}
```

When the space renders, the Switchboard sees that the entry contains an `ObjectReference`. It asks the object registry for a summary.

The object registry routes the request to the Extensions resolver for `extensions.discord.message`.

The resolver loads the object and returns an `ObjectSummary`:

```ts
{
  ref: {
    objectType: "extensions.discord.message",
    objectId: "extobj_456"
  },
  title: "Message from Alex in #ai-tools",
  subtitle: "Discord",
  description: "Try evaluating the workflow on edge-case PDFs...",
  featureId: "extensions"
}
```

The Switchboard renders a readable reference card from that summary.

If the underlying Discord object later updates or becomes unavailable, the space's entry still contains the original reference. The UI can either show the updated summary or display a missing/unavailable state.

The important point is that the Switchboard owns the context-space membership and arrangement, while Extensions owns the Discord message.

---

## Example 2: Global search across Notes, Archive, and Calendar

### What is already there

Before the user searches, each feature owns its own canonical objects.

Notes owns notes. Archive owns archive items. Calendar owns calendar objects.

Each of those feature modules has registered an object resolver.

Each resolver knows how to produce a `SearchDocument` for the objects it owns.

For example, a note resolver may produce search text from the note title, body, and tags. An archive resolver may produce search text from the saved title, URL, context note, tags, and processed page content. A calendar resolver may produce search text from event or task titles and descriptions.

A global search index already exists as derived data. It contains `SearchDocument` entries from the participating modules.

### What happens at runtime

The user opens global search and types:

```text
prototype demo
```

The global search system searches the derived index, not the raw feature stores directly.

It finds matching `SearchDocument`s from multiple features:

- a note about prototype demo ideas
- an archive item about demo velocity
- a calendar event for a mentor meeting

Each search result points back to the original object using an `ObjectReference`.

At this point, the search UI needs to display the results. It does not know or care about the full schemas of notes, archive items, or calendar objects.

For each result, it asks the object registry for an `ObjectSummary`.

The registry routes each request to the correct feature resolver:

- `notes.note` → Notes resolver
- `archive.item` → Archive resolver
- `calendar.event` → Calendar resolver

Each resolver returns a compact summary suitable for generic display.

The global search UI renders those summaries as results.

When the user clicks one result, the app uses the same `ObjectReference` to route to the owning feature’s full object view.

The key pipeline is:

```text
Feature-owned object
  → module resolver produces SearchDocument
  → global search index stores derived search representation
  → user searches
  → search returns ObjectReference results
  → object registry resolves summaries
  → generic UI renders results
  → clicking routes to owning feature
```

This lets global search work across the whole app without global search owning or understanding every feature’s canonical schema.

