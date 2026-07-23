# Agentic Connectors Concept

## Executive Summary

Agentic Connectors are a future Digital Center integration model where external AI agents or MCP-enabled assistant systems gather information from outside platforms, transform it into Digital Center-compatible import packages, and hand those packages back to Digital Center for validation, review, and import.

The core idea is that Digital Center does not need to build and maintain native connectors for every external platform. Instead, it can define the destination language: structured import schemas for calendar objects, extension objects, workstreams, notes, archive items, reminders, and other Digital Center-native entities.

An external agent can use its own tool access to platforms such as Gmail, Outlook, Google Calendar, Teams Calendar, Microsoft Teams, Trello, or other MCP-enabled systems. It then returns a structured Digital Center import package. Digital Center parses that package, validates it, detects duplicates, and either presents suggested edits for review or automatically imports safe extension objects.

In this model, agents are the heart of connectors because they perform the broad, hard-to-maintain part of integration: external access, interpretation, and transformation. Digital Center remains the local object system, review surface, and canonical workspace.

The value is not merely asking an AI assistant questions about external platforms. The value is turning external information into local, searchable, taggable, referenceable Digital Center objects.

---

# 1. Motivation

Building native integrations for every useful platform is expensive and brittle.

Each external service has its own:

- authentication model
- API limitations
- object schemas
- permission boundaries
- rate limits
- sync behavior
- enterprise restrictions
- missing or partial data access
- long-term maintenance burden

For a local-first personal workspace, this creates an obvious problem. Digital Center wants to become a central operating layer for the user's digital life, but directly integrating with every platform is unrealistic, especially early on.

Meanwhile, AI assistants and MCP-enabled agent systems are increasingly able to access multiple external platforms through their own tool environments. A user may already be able to ask an assistant to inspect calendars, emails, task systems, messages, documents, or project boards.

Agentic Connectors use that external access as a bridge.

Instead of Digital Center fetching everything itself, Digital Center can provide:

- strict import schemas
- prompt templates
- validation logic
- preview/review UI
- duplicate detection
- source traceability
- local object creation

The external agent provides:

- platform access
- cross-source retrieval
- interpretation
- extraction
- transformation into Digital Center format

This allows Digital Center to support many external workflows without becoming responsible for every external API.

---

# 2. Core Flow

The future user experience looks like this:

```text
User opens Digital Center
  ↓
Selects an import/extraction workflow
  ↓
Chooses sources from a checklist
  ↓
Digital Center invokes or coordinates an LLM Workspace / external agent bridge
  ↓
The agent uses available platform tools or MCP servers
  ↓
The agent returns a Digital Center Import Package
  ↓
Digital Center validates and parses the package
  ↓
Digital Center shows suggested edits or auto-imports safe extension objects
  ↓
Canonical local objects are created or updated
```

Example source checklist:

```text
[x] Gmail
[x] Outlook
[ ] Google Calendar
[ ] Teams Calendar
[ ] Microsoft Teams
[ ] Trello
[ ] GitHub
```

Example extraction goals:

```text
Pull recent emails into the Email extension
Create draft calendar objects for next week
Extract workstreams from Trello and Teams messages
Find deadlines and markers from school/work communications
Import relevant project signals into a future Context Space
```

The key point is that Digital Center is not merely receiving prose. It is receiving structured data that can become part of its local object universe.

---

# 3. Agentic Connector Definition

An Agentic Connector is not a traditional API connector.

A traditional connector is usually:

```text
authenticate → fetch → normalize → sync → display
```

An Agentic Connector is:

```text
source selection → prompt/schema → agent tool access → structured extraction → import package → validation/review/import
```

It consists of several pieces:

1. **Source selection**  
   The user selects which external systems or accounts the agent should inspect.

2. **Extraction goal**  
   The user chooses what Digital Center should receive: emails, calendar drafts, workstream drafts, reminders, archive items, etc.

3. **Prompt template**  
   Digital Center provides a carefully written prompt instructing the agent what to inspect and how to transform it.

4. **Import schema**  
   Digital Center defines the exact JSON structure the agent must return.

5. **Agent/tool execution**  
   The agent uses whatever tool or MCP access is available to gather the data.

6. **Validation and parsing**  
   Digital Center checks that the returned package is valid, safe, and understandable.

7. **Review or auto-import**  
   Depending on the target and user settings, objects are either presented as suggested edits or imported directly.

8. **Canonical local creation**  
   Accepted imports become Digital Center-native objects or extension objects.

---

# 4. Digital Center Import Package

The core technical artifact is the **Digital Center Import Package**.

This is a structured, versioned output produced by the agent and consumed by Digital Center.

A conceptual shape:

```ts
type DigitalCenterImportPackage = {
  version: number;
  source: ImportSource;
  generatedAt: ISODateTime;
  generatedBy?: string;
  mode?: "review" | "auto";

  nativeDrafts?: {
    calendar?: CalendarImportDraft[];
    workstreams?: WorkstreamImportDraft[];
    notes?: NoteImportDraft[];
    archive?: ArchiveImportDraft[];
    reminders?: ReminderImportDraft[];
  };

  extensionObjects?: {
    extensionId: string;
    objectType: string;
    objects: ExtensionObjectImportDraft[];
  }[];

  sourceRefs?: ImportSourceRef[];
  warnings?: string[];
};
```

The precise schema can evolve, but the principle should remain stable:

> Agents produce draft/import objects. Digital Center validates and decides what becomes canonical.

---

# 5. Two Import Categories

Agentic Connectors feed two different kinds of targets.

## 5.1 Native Digital Center Objects

Some imports target first-class Digital Center systems.

Examples:

- Calendar
- Notes
- Archive
- Workstreams
- Reminders
- Switchboard Context Spaces
- LLM Workspace context bundles

These imports should usually be treated as **drafts** or **suggested edits**, because the agent is making semantic judgments.

For example, when importing from Google Calendar, Teams Calendar, or Trello, the agent may infer:

- fixed meetings as events
- due dates as deadlines
- soft goals as markers
- suggested work periods as task windows
- planned execution sessions as task instances
- multi-step obligations as workstreams

Because these affect the user's planning system, Digital Center should show them in an accept/deny/edit panel before committing them.

## 5.2 Extension Objects

Other imports target extension-specific object stores.

Examples:

- Email messages
- Teams messages
- Discord messages
- LinkedIn posts
- GitHub issues
- feed items

These are often safer to auto-import because they are read-only representations of external objects rather than agent-inferred planning commitments.

For example, pulling recent emails should not necessarily create reminders or archive items. It should create Email extension objects that live in a dedicated read-only Email extension page.

Those imported email objects can then be:

- searched
- tagged
- referenced
- opened in the Email extension UI
- linked to workstreams
- mounted into LLM Workspace
- routed into Switchboard later
- converted into reminders, notes, or archive items when appropriate

This preserves the distinction between raw external source objects and user-owned Digital Center objects.

---

# 6. Calendar as a Native Target

The Digital Center calendar is not an extension. It is a native system with a richer temporal grammar than ordinary external calendars.

Digital Center can distinguish between:

- events
- task instances
- task windows
- deadlines
- markers

Most external calendars flatten these into generic events. Agentic import is useful because the agent can infer the correct Digital Center object type from surrounding context.

Examples:

```text
"Meet Alex 2–3 PM"
→ Event
```

```text
"Project report due Friday at 11:59 PM"
→ Deadline
```

```text
"Try to have the first draft done by Wednesday"
→ Marker
```

```text
"Work on the project sometime Thursday evening"
→ Task Window
```

```text
"Write intro section from 7–8 PM"
→ Task Instance
```

This is one of the reasons the Digital Center calendar is valuable. It can represent planning semantics that ordinary calendars cannot.

For that reason, calendar imports should generally appear as draft suggested edits before becoming canonical calendar objects.

---

# 7. Extensions as Digital Center-Native Source Surfaces

Extensions are not just pipelines that convert external information into reminders or archive items.

An extension is a dedicated read-only or lightweight interaction surface that presents external source objects in Digital Center language.

For example, an Email extension should be a better lightweight email-reading surface inside Digital Center:

- recent messages
- tags
- search
- source metadata
- references
- global search participation
- actions to create notes, reminders, archive items, or workstream references

A future Email extension object might look conceptually like:

```ts
type EmailMessageObject = {
  id: ObjectId;
  objectType: "extensions.email.message";
  provider: "gmail" | "outlook" | "unknown";
  externalId?: string;
  subject: string;
  sender: string;
  recipients?: string[];
  receivedAt: ISODateTime;
  snippet?: string;
  bodyPreview?: string;
  sourceUrl?: string;
  tagIds?: TagId[];
  readState?: "read" | "unread" | "unknown";
  importedAt: ISODateTime;
  sourceRefs: ImportSourceRef[];
};
```

The object is local and Digital Center-native enough to be searched, tagged, referenced, and displayed, while still being read-only relative to the original platform.

Future extensions to MCP-accessible systems can follow the same pattern:

```text
external platform object
→ agentic import package
→ extension-native object
→ dedicated Digital Center extension page
→ searchable/referenceable/taggable object
```

---

# 8. Review Mode and Auto Mode

Agentic imports should support two operating modes.

## Review Mode

Review mode is used when the agent is proposing changes to native Digital Center systems.

Best for:

- calendar objects
- workstreams
- reminders
- archive captures from ambiguous sources
- notes generated from external synthesis
- context-space routing

Flow:

```text
agent proposes → Digital Center validates → user reviews → user accepts/rejects/edits → canonical objects are created
```

This mode protects the user from incorrect inference.

## Auto Mode

Auto mode is used when the pipeline imports external source objects into extension stores.

Best for:

- recent emails
- Teams messages
- Discord messages
- feed items
- GitHub issues
- LinkedIn posts

Flow:

```text
agent extracts → Digital Center validates → extension objects are imported automatically
```

Auto mode is appropriate when the import is mostly preserving source material rather than creating planning commitments.

For example:

```text
"Pull all recent emails from these inboxes"
```

should be able to import into the Email extension without requiring the user to approve every individual email.

---

# 9. Relationship to LLM Workspace

The LLM Workspace is the natural internal bridge for Agentic Connectors.

In a future version, Digital Center may already have a connection from the app to an intelligent agent. Agentic Connector workflows can use that connection to:

- start a new extraction session
- provide the relevant prompt template
- specify the selected sources
- instruct the agent to use available tools/MCP servers
- request a strict Digital Center Import Package
- parse the returned response

This does not mean the user has to manually manage a chat every time. The LLM Workspace can act as the internal orchestration layer behind a more productized import UI.

The user sees:

```text
Choose sources → choose target → run import → review/accept
```

Internally, Digital Center may be using an agent session and import prompt to produce the package.

---

# 10. Example Workflows

## 10.1 Pull Recent Emails

User chooses:

```text
Source: Gmail + Outlook
Target: Email Extension
Scope: last 7 days, selected inboxes
Mode: Auto
```

Flow:

```text
Agent reads selected inboxes
  ↓
Agent returns Email extension objects
  ↓
Digital Center validates duplicates/source metadata
  ↓
Objects are imported into Email extension
  ↓
User can search, tag, reference, or act on them
```

## 10.2 Import Next Week's Calendar

User chooses:

```text
Sources: Google Calendar, Teams Calendar, Trello
Target: Calendar
Mode: Review
```

Flow:

```text
Agent inspects external events/cards
  ↓
Agent infers Digital Center temporal types
  ↓
Digital Center shows draft events, deadlines, markers, task windows, and task instances
  ↓
User accepts/rejects/edits
  ↓
Accepted drafts become native calendar objects
```

## 10.3 Extract Workstreams from Project Systems

User chooses:

```text
Sources: Trello, Teams messages, project emails
Target: Workstreams
Mode: Review
```

Flow:

```text
Agent identifies multi-step obligations
  ↓
Agent creates Workstream drafts with ordered items and references
  ↓
Digital Center previews them
  ↓
User accepts useful workstreams
```

## 10.4 Import Team Messages into an Extension

User chooses:

```text
Source: Microsoft Teams
Target: Teams Extension
Mode: Auto or Review
```

Flow:

```text
Agent pulls selected messages or channels
  ↓
Agent returns Teams extension objects
  ↓
Digital Center imports them into a dedicated Teams extension page
  ↓
Objects can later be searched, tagged, referenced, or routed into context spaces
```

---

# 11. Source Traceability

Every imported object should preserve its origin.

This matters because agentic imports may not have a stable direct API connection after the fact.

Useful metadata includes:

- source platform
- account or inbox/calendar name when available
- external ID when available
- source URL when available
- source timestamp
- import batch ID
- generated-by agent/model/tool
- prompt template version
- confidence or warning fields when appropriate

A conceptual source reference:

```ts
type ImportSourceRef = {
  platform: string;
  provider?: string;
  externalId?: string;
  sourceUrl?: string;
  sourceTitle?: string;
  sourceTimestamp?: ISODateTime;
  importedAt: ISODateTime;
  importBatchId: string;
  capturedVia: "agentic-import" | "manual-import" | "native-connector";
};
```

The goal is not perfect sync. The goal is durable local provenance.

---

# 12. Duplicate Handling

Agentic imports need duplicate detection, especially in auto mode.

Potential duplicate signals:

- provider external ID
- source URL
- message ID
- calendar event ID
- subject/sender/timestamp fingerprint
- title/time similarity
- content hash
- import batch history

Digital Center should avoid creating duplicate extension objects or duplicate calendar drafts when the same external information is imported repeatedly.

For extension objects, duplicate handling can often be automatic.

For native objects, likely duplicates should be displayed clearly in the review panel.

---

# 13. Trust and Safety Boundary

Agentic Connector output should be treated as structured suggestions, not unquestioned truth.

Important rules:

1. **Validate everything.**  
   The agent must output schema-valid data before Digital Center accepts it.

2. **Use review mode for semantic commitments.**  
   Calendar objects, deadlines, reminders, and workstreams should generally be reviewed before import.

3. **Keep auto mode for safer object preservation.**  
   Auto mode is best for read-only extension object ingestion.

4. **Preserve provenance.**  
   Imported objects should know where they came from.

5. **Avoid silent high-impact changes.**  
   The app should not quietly alter the user's planning system based only on agent inference unless the user has explicitly configured that behavior.

---

# 14. Relationship to Native Connectors

Agentic Connectors do not eliminate native connectors entirely.

The long-term model is:

```text
Native connector when polish, reliability, or frequent interaction matters.
Agentic connector when breadth, flexibility, or source diversity matters.
```

Examples where native connectors still make sense:

- browser extension for Archive capture
- local file/clipboard capture
- core calendar creation/editing inside Digital Center
- internal Notes/Archive/Workstreams/Search systems
- possibly a few high-value external connectors later

Examples where agentic connectors are attractive:

- occasional import from many external platforms
- MCP-accessible systems
- task extraction from messages
- calendar interpretation from mixed sources
- email import where an agent already has access
- project state extraction from Trello/Teams/GitHub/docs

The important point is that Digital Center can support both approaches without treating native integration as the only path.

---

# 15. Why This Is More Than Asking ChatGPT

A user could ask ChatGPT:

```text
What did I miss in my email?
```

But that produces a temporary answer inside a chat.

Digital Center's value is that the answer can become structured local data:

- extension objects
- calendar drafts
- workstreams
- archive items
- notes
- reminders
- references
- searchable records

The agent provides access and interpretation. Digital Center provides continuity, local structure, object identity, review, and reuse.

The result is not just information. It is an update to the user's personal operating layer.

---

# 16. Strategic Position

Agentic Connectors are a future-facing integration strategy for Digital Center.

They support the broader product philosophy:

> Digital Center is the central local object language and workspace, while agentic pipelines provide broad external reach.

This allows Digital Center to remain local-first and structured without requiring direct native integrations for every platform.

The eventual differentiator is:

```text
External platforms + MCP/tool-enabled agents
  → Digital Center import packages
  → native objects and extension surfaces
  → searchable, taggable, referenceable local workspace
```

This makes Digital Center a place where external information does not merely get summarized. It gets transformed into something the user can keep, search, connect, schedule, act on, and return to.
