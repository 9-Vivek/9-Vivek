# Workstreams — Feature Explainer

## Executive Summary

Workstreams are lightweight execution containers for related work inside Digital Center.

They fill the gap between broad **Context Spaces** and concrete **Calendar objects**. A Context Space represents an ongoing domain of focus, such as a course, internship project, research area, or personal initiative. A Calendar object represents something placed in time. A Workstream represents the ordered path of work between those two levels.

Informally, Workstreams are called **Streams** in the interface. The primary home for Streams is the right sidebar, not a full page. The sidebar overlays the current app surface instead of compressing the layout, so the user can pull up active work while using Calendar, Notes, Archive, Home, LLM Workspace, or future features.

A Workstream consists of:

- a title
- a short plaintext description
- optional references to other Digital Center objects
- an ordered list of WorkstreamItems
- an optional Context Space association
- a derived status based on current execution position
- an archived flag

Each WorkstreamItem may link to zero or exactly one canonical Calendar object. The calendar object can be one of the five concrete calendar object types:

- event
- task instance
- task window
- deadline
- marker

Context bands are excluded because they are created and managed separately.

Workstreams are intentionally limited. They are not a project management system, not a Kanban board, not a task database, and not an incoming-signal hub. They do not include subtasks, priorities, labels, due dates, dependencies, or project analytics. Their purpose is to give the user a simple, ordered, app-wide way to see and advance the work they are currently moving through.

---

## 1. Purpose

The purpose of Workstreams is to represent a bounded path of work that is larger than a single calendar object but smaller than a full Context Space.

Examples:

- `CIS 4500 Project 2`
- `Algorithms midterm prep`
- `Global search implementation`
- `InterDigital demo polish`
- `Personal website rebuild`
- `Tax documents cleanup`

A Workstream answers:

> What am I trying to work through, and what is the current sequence of steps?

It does not answer every project-management question. It does not manage incoming signals. It does not replace Calendar, Notes, Archive, or Context Spaces. It simply gives related work a durable, ordered container that can be accessed from anywhere.

---

## 2. Why Workstreams Exist

Digital Center has several levels of structure:

- **Notes** capture quick thoughts.
- **Archive** captures saved digital resources.
- **Calendar** places objects in time.
- **Context Spaces** collect broad domains of focus and incoming signal.
- **LLM Workspace** supports deep reasoning over explicitly mounted context.

A missing level exists between Context Spaces and Calendar objects.

Some work is too small to become a Context Space but too structured to exist only as isolated calendar entries. An assignment, implementation milestone, research prep sequence, or application packet may have multiple steps, references, and scheduled placements. It needs a simple container, but not a full project dashboard.

Workstreams provide that middle layer.

---

## 3. Relationship to Context Spaces

A Workstream may optionally belong to a Context Space.

For example:

```text
Context Space: CIS 4500
  Workstream: Project 2
  Workstream: Midterm prep
  Workstream: Reading catch-up
```

Or:

```text
Context Space: Digital Center
  Workstream: Global search
  Workstream: Workstreams sidebar
  Workstream: Calendar recurrence cleanup
```

But a Workstream does not require a Context Space. Some streams are standalone and do not need a broader semantic domain.

Examples:

- `Renew passport`
- `Clean laptop files`
- `Plan weekend trip`

The distinction is:

| Concept | Meaning |
|---|---|
| Context Space | Broad domain of focus and incoming signal |
| Workstream | Bounded ordered path of work |
| Calendar object | Concrete time placement or time anchor |

Context Spaces are for ongoing domains. Workstreams are for sequences of work.

---

## 4. Relationship to Calendar

Workstreams do not own time.

Calendar owns time.

A Workstream owns an ordered list of WorkstreamItems. Each item may optionally link to a single Calendar object. That Calendar object is the scheduled or time-anchored representation of the item.

For example:

```text
Workstream: CIS 4500 Project 2
  Item: Read assignment spec
    Calendar link: Task window, Monday 7:00-8:00 PM
  Item: Design schema
    Calendar link: Task instance, Tuesday 9:00-10:30 PM
  Item: Submit project
    Calendar link: Deadline, Friday 11:59 PM
```

An item may also be unscheduled:

```text
Item: Review feedback from TA
  Calendar link: none
```

This is intentional. Workstreams should allow planning before scheduling. The user should not be forced to place every step in time immediately.

---

## 5. WorkstreamItems

A WorkstreamItem is a simple ordered step inside a Workstream.

It is not a full task object. It does not have subtasks, labels, due dates, priorities, dependencies, or its own independent project state.

A WorkstreamItem contains:

- title
- order position
- optional linked Calendar object

Each item may link to zero or exactly one Calendar object.

If a piece of work requires multiple sessions, each session should be represented as a separate item.

Example:

```text
Workstream: Algorithms midterm prep
  1. Review dynamic programming notes
  2. Practice dynamic programming problems
  3. Review graph algorithms notes
  4. Practice graph algorithms problems
  5. Final review session
```

Each of these can be scheduled independently as a task instance, task window, deadline, marker, or event depending on what the user needs.

---

## 6. Scheduling Flow

In Edit or Focus view, a WorkstreamItem can expose a **Schedule** action.

The scheduling flow is:

```text
WorkstreamItem
  → Schedule
  → open Calendar creation flow
  → preload item title
  → user chooses one of the concrete calendar object types
  → Calendar creates canonical object
  → WorkstreamItem stores reference to created calendar object
```

The Calendar remains the owner of the created object. The Workstream only stores an `ObjectReference` to it.

This preserves the global ownership rule:

> Read broadly, mutate through the owner.

The Workstream can display and navigate to the calendar object, but the Calendar feature owns time, validation, editing, recurrence, and calendar-specific behavior.

---

## 7. References

A Workstream may include references to other Digital Center objects.

References are attached to the Workstream itself, not embedded inside the description field.

Possible references include:

- notes
- archive items
- calendar objects
- extension objects later

Every reference add should be intentional. Workstreams are not incoming-signal containers. They do not automatically ingest items the way Context Spaces may eventually do.

The first version should use a simple **Add Reference** button that opens global search or an object picker. The user selects an object, and the Workstream stores an `ObjectReference`.

Future versions may support inline reference insertion inside richer descriptions, but that is not required for the initial model.

---

## 8. Description Area

A Workstream has a short plaintext description area.

The description is for lightweight context, such as:

- what this stream is about
- what outcome matters
- constraints to remember
- quick notes about approach

It should not become a full note editor or knowledge base.

For the initial version, plaintext is enough. If a Workstream needs long-form writing, it should reference a Note instead.

---

## 9. Status and Execution Position

Workstream status is derived, not manually set.

The Workstream has a current execution position represented by a marker between items.

Status derives from that position:

| Execution position | Derived status |
|---|---|
| Before the first item | Not started |
| Between first and final item | In progress |
| After the final item | Done |

Archive state is separate.

A Workstream may have an `archived` flag. Archiving removes the stream from the active list without changing the meaning of its execution status.

This keeps status simple:

```text
status = derived from current position
archived = separate visibility/lifecycle flag
```

There should be no manual override for `not started`, `in progress`, or `done` in the initial model.

---

## 10. Sidebar Placement

The Workstreams interface lives in the right sidebar, labeled informally as **Streams**.

The sidebar overlays the current page instead of compressing the page horizontally. This is important because Streams are meant to be accessible from anywhere without disrupting the current workspace.

The sidebar is not a full page because Workstreams are not meant to be a primary destination. They are an active-support surface.

The user should be able to pull up Streams, check the current path, schedule an item, open a reference, or focus on the current stream without leaving the current feature unnecessarily.

---

## 11. Sidebar Views

The Streams sidebar has three main views:

```text
List
Edit
Focus
```

## 11.1 List View

List View shows all Workstreams grouped by lifecycle/status.

Suggested groups:

- In progress
- Not started
- Done
- Archived

Archived streams may be collapsed by default.

List View should support:

- opening a Workstream in Focus View
- opening a Workstream in Edit View
- creating a new Workstream
- seeing basic status and linked context spaces at a glance

The list should be compact and operational.

---

## 11.2 Edit View

Edit View is for creating or modifying a Workstream.

It includes:

- title field
- plaintext description area
- references section
- ordered WorkstreamItem list
- add item action
- drag-to-reorder item list
- Schedule action for each item
- archived checkbox

There is no progress line in Edit View. The current execution position belongs to Focus View.

Edit View is about defining the stream, not executing it.

---

## 11.3 Focus View

Focus View is the read-only execution view.

It shows:

- Workstream title
- derived status
- description
- references
- ordered items
- scheduled item links
- current execution position marker
- Schedule Next action
- Edit action

The current execution position marker is a draggable line between items. Moving the line updates the current position and therefore the derived status.

Scheduled items are clickable and should open the linked object in Calendar.

Focus View answers:

> Where am I in this stream, and what should I do next?

---

## 12. Schedule Next

Focus View should include a **Schedule Next** action.

The next item is the item immediately after the current execution position.

When clicked, Schedule Next begins the same scheduling flow as an item-level Schedule button:

```text
next WorkstreamItem
  → Calendar creation flow
  → preload item title
  → create chosen calendar object type
  → attach resulting ObjectReference to the item
```

This makes Focus View useful during active planning. The user can look at the stream, identify the next step, and place it into time without switching mental modes.

---

## 13. Recurrence and Series Distinction

Workstreams are separate from Calendar recurrence and Calendar series.

- **Recurrence** creates repeated calendar objects at regular time intervals.
- **Series** groups related calendar objects of a single calendar object type.
- **Workstreams** group ordered work items and optionally link each item to a calendar object.

A Workstream may contain items that link to objects belonging to a Calendar series. But the Workstream itself is not a series.

This distinction prevents Series from becoming a project/task system and prevents Workstreams from becoming a second calendar.

---

## 14. Data Model Sketch

A minimal conceptual shape:

```ts
type Workstream = {
  id: string;
  title: string;
  description: string;
  contextSpaceRef?: ObjectReference;
  referenceRefs: ObjectReference[];
  items: WorkstreamItem[];
  currentPosition: number;
  archived: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};
```

```ts
type WorkstreamItem = {
  id: string;
  title: string;
  calendarRef?: ObjectReference;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};
```

Derived status:

```ts
type WorkstreamStatus = "not-started" | "in-progress" | "done";
```

```text
if currentPosition <= 0 → not-started
if currentPosition >= items.length → done
otherwise → in-progress
```

`archived` is not a status. It is a lifecycle/visibility flag.

---

## 15. Future Extensions

Likely future improvements include:

- inline references inside a richer description area
- AI-assisted Workstream creation from selected context, such as an assignment spec, archive item, note set, or LLM Workspace output
- mounting Workstreams into the LLM Workspace as explicit context

These future improvements should preserve the lightweight character of the feature.

The core rule remains:

> Workstreams should make active work easier to resume and advance, not turn planning into another project.

---

## 17. Design Principle

Workstreams exist to preserve intentional structure without adding psychological weight.

They should be quick to create, easy to inspect, and available from anywhere. The user should not feel like they are managing a project system. They should feel like they are keeping a simple ordered thread of work visible while using the rest of Digital Center.

The operational summary is:

```text
Context Space = broad domain
Workstream = ordered path of work
WorkstreamItem = one step in that path
Calendar object = time placement or time anchor
Reference = intentional connection to another Digital Center object
Streams sidebar = app-wide access surface
```
