# Digital Center — Expanded Overview

## Overview

Digital Center is a local-first personal workspace for people who are constantly learning, building, reading, saving, planning, and moving between different streams of work.

It is designed around a simple idea: modern digital life produces too much useful signal for scattered tools to handle well. Time-bound obligations live in calendars. Project work lives in boards. Notes live in one place, saved articles in another, reminders somewhere else, and useful context from email, feeds, chats, and links often disappears before it can become actionable.

Digital Center brings those pieces into one coherent environment. Its goal is not to replace every specialized tool, but to create a better personal layer above them: a place to capture what matters, organize it quickly, and return to it when the context becomes relevant again.

## Purpose

The core loop of the app is **capture and return**.

Capture the progress of a day: what you planned, what you saved, what you thought about, what you need to remember, what projects moved forward, what information came in, and what context matters later.

Return to it cleanly: search it, reopen it, arrange it, review it, connect it to time, and continue from where you left off.

The app is meant to feel fast, personal, and owned. It should work primarily from local data, with internet access used only where it adds value: connectors, fetching saved content, AI-powered processing, semantic search, summaries, and future integrations.

## Positioning: an operating layer, not a replacement

Digital Center does not try to become the best knowledge base, the best email client, or the best project tracker. Specialized tools — a PKM like Capacities or Obsidian, external calendars, messaging platforms — remain the best place for the domains they already serve well.

Digital Center's role is to sit **above** those systems as a personal operating layer: the place where time, active work, context, external signals, quick capture, visual artifacts, and AI reasoning come together in one shared object universe. External systems keep ownership of their domains; Digital Center makes the useful parts of that information operationally visible everywhere else — in search, in Context Spaces, in the LLM Workspace, on Home.

Concretely, this means a durable knowledge object can keep living in a PKM while a lightweight mirror of it participates in Digital Center's search, references, and context surfaces. A quick note captured here can later be promoted into a full PKM without losing the thread back to where it started. External system relationships can map onto Digital Center's own without being blindly merged into them. The guiding principle: **specialized tools remain the source of truth for what they're good at; Digital Center is where it all becomes reachable and actionable.**

## Feel

Digital Center should feel like a convenient desktop workspace rather than a generic productivity dashboard. It should be compact, quick to navigate, keyboard-friendly, and calm enough to keep open for long stretches and in the background.

The interface should support both structure and messiness. Some things belong in clean lists and calendars. Other things need a flexible context space, a quick note, a saved link with one-line context, or a custom visual artifact. The app should make room for all of these without forcing every thought or object into the same shape.

The guiding feeling is:

> Capture what matters now, and make it easy to return to later.

Keyboard shortcuts should feel like part of the workspace itself, not an optional extra. That means quick keys for navigation, search, capture, and moving between components, plus system-wide shortcuts for focused popups and lightweight capture surfaces that work even when the app isn't in the foreground.

A user should be able to pull up global search, save a note, create a reminder, or capture a link without leaving their current flow. Digital Center should be available when needed, out of the way when not, and fast enough that capturing never feels like a separate task.

## Main Components

### Home

Home is the app-level awareness surface. It gives the user a compact view of what matters now: upcoming calendar items, active context spaces, recent captures, pending reminders, and anything that may need attention.

It is not meant to become a dense dashboard. Its purpose is to help the user re-enter the system quickly, notice what requires attention, and jump into the right component without hunting.

### Calendar

The calendar is the time and planning center. It combines concrete objects — events, task instances, task windows, deadlines, and markers — with reusable weekly rhythm templates that represent how the week is meant to feel, independent of any single week's actual events. Time-bound reminders can appear on the calendar as lightweight attention markers, but reminders remain app-level objects rather than calendar-native events.

Unlike a normal calendar, it is not only about what happens when. It also helps represent the shape of a week: modes of work, energy, focus, and recurring structure, as background context rather than as containers that own the day's events. The same calendar can be viewed through different templates and filters without duplicating reality — there is one shared space of concrete objects, and many swappable lenses onto it.

### Archive

The archive is a local-first memory index for saved digital content: links, articles, videos, papers, posts, and other external resources, alongside context notes, tags, categories, and search metadata.

Its purpose is not to become a full reader or media player. It exists so that useful things can be saved quickly — in seconds, with as little as a bare URL — and found again later, with enough personal context to remember why they mattered. Every saved item can carry a short note answering "why did I save this?", because a link without that context loses meaning over time. Optional background processing can fetch metadata and build semantic search embeddings, but capture and browsing never wait on it.

### Notes

Notes are a low-friction capture layer for quick thoughts, ideas, and written fragments. A note should be creatable instantly, without navigating away from whatever the user is doing, and it stays unorganized until it's worth naming, tagging, or promoting.

The notes system is intentionally lighter than a full knowledge base — it is a staging layer for fleeting thoughts, not a destination for durable knowledge work. It can connect to an Obsidian vault through a one-way push, letting Digital Center act as the fast capture layer while Obsidian (or a comparable PKM) remains the long-term knowledge home. The emotional target is: "I can write this down instantly and deal with it later."

### Switchboard

The switchboard is the configuration and orchestration core. It organizes the workspace around **Context Spaces** — semantic domains of a user's life or work (a startup platform, a research thread, personal finance) — rather than by storage location. A space collects references to objects living in other features; nothing is duplicated or moved, and attaching something creates a link, not a copy.

Each space has two modes. The **Architect view** is a full-screen dashboard inside Digital Center for wiring a space together: a 2×2 grid of attached notes, saved content, external signals, and an LLM Workspace preview, alongside a context rail holding the space's description, current objective, tags, and its execution list of attached workstreams and calendar blocks. The **Execution overlays** are lightweight, borderless, on-demand floating sidebars — a left "reference" panel and a right "execution" panel — that project the active context over external applications like an IDE or browser, then disappear the moment focus returns to the underlying tool. This is the bridge between planning a piece of work and actually doing it without switching mental context.

### Workstreams

Informally called **Streams**, workstreams are lightweight, ordered execution containers that fill the gap between a broad Context Space and a single concrete Calendar object. A Context Space represents an ongoing domain of focus; a calendar object represents something placed in time; a Workstream represents the ordered path of work between the two — an assignment, an implementation milestone, a study plan — as a simple sequence of steps rather than a full project-management system.

Each step in a stream may optionally link to exactly one calendar object (an event, task instance, task window, deadline, or marker), so planning can happen before scheduling, and scheduling can happen incrementally as steps become concrete. A stream's status — not started, in progress, done — is derived automatically from a draggable "current position" marker rather than set by hand. Streams live in an always-available right-hand sidebar that overlays the current page rather than compressing it, because the point is to keep active work visible while using Calendar, Notes, Archive, or anything else, not to make Streams a destination of its own.

### Structures

Structures are first-class objects for mostly-finished visual artifacts and custom representations that don't fit naturally into a note, archive item, calendar object, or workstream — a static HTML dashboard, a Mermaid diagram, a progress tracker, a roadmap visualization, or (eventually) a small React mockup.

Structures exist because not every piece of information should be flattened into one universal shape. A Structure is deliberately not a code editor or a plugin runtime: the edit surface stays simple (title, description, kind, source, searchable text, tags), serious authoring happens elsewhere, and Digital Center's job is to store, render, search, and connect the result. Like any other object, a Structure can be attached to a Context Space, surfaced through global search, and — longer term — mounted into the LLM Workspace or allowed to emit lightweight sub-objects (the modules of a certification tracker, the phases of a roadmap) that participate in the same search and reference fabric.

### LLM Workspace

The LLM Workspace is a full-screen environment for deep AI reasoning that treats a conversation as a **structured workspace** rather than a flat, chronological chat log. Long AI conversations lose their shape over time — decisions, branches, and produced artifacts all blur into one scrolling transcript — so the workspace separates a session into four layers: a persistent **orientation layer** of non-mutating briefs and constraints; a branchable **source layer** that preserves the canonical (and forkable) conversation record; a durable **artifact layer** for outputs like specs, drafts, or code that are worth keeping independent of the chat; and a **conversation map** that graphs the structural skeleton of decisions, definitions, and fixes so a dense project history stays navigable.

Its real leverage comes from Digital Center's local data architecture: a user can explicitly mount native objects — archive items, notes, calendar constraints, extension signals — into a session and control exactly what context the model reasons over, rather than relying on an opaque, ever-growing chat history. A Context Space can hand off its objective, task list, and relevant attachments into the LLM Workspace as a pre-assembled context bundle, and the workspace in turn leaves a lightweight footprint back on the Switchboard — a live preview of the conversation's health and a snapshot of its current orientation — so a user can gauge the state of their AI-assisted work without opening the full environment.

### Extensions

Extensions connect outside sources such as email, feeds, LinkedIn, and Discord. They are lightweight, optional surfaces for glancing at useful signal and capturing it into notes, archive, reminders, or other parts of the system — not full replacements for the platforms they connect to, and not another set of dashboards competing for attention.

Every extension follows the same shape: surface relevant content from the external source, offer minimal capture actions (save to archive, create a note or reminder), and otherwise stay out of the way. They live behind a menu or panel, opened intentionally, so external noise doesn't leak into the core capture-and-return loop.

## How the pieces fit together

Each feature owns a distinct layer of the same picture, and none of them try to do each other's job:

- **Notes** — fast, unstructured capture.
- **Archive** — saved external resources with personal context.
- **Calendar** — time, rhythm, and deadlines.
- **Workstreams** — ordered paths of work, between a domain and a moment in time.
- **Switchboard** — the broad domains (Context Spaces) that tie everything together, plus the projection of active work into external tools.
- **Structures** — custom visual representations that don't fit any of the above.
- **LLM Workspace** — deep reasoning over explicitly chosen slices of all of it.
- **Extensions** — the on-ramp for signal from outside the app.

A single piece of work can move fluidly through several of these: a saved article in Archive informs a note, the note seeds a workstream item, the item gets scheduled onto the calendar, the whole thread is attached to a Context Space, and a difficult design decision along the way gets worked through in the LLM Workspace with that same context mounted in. No feature duplicates another's data to make this possible — everything is linked by reference, so the owning feature stays the single source of truth.

## Future Vision

The long-term vision is a fully personal digital center: local-first, extensible, searchable, and deeply integrated with the user's actual workflows — including the specialized tools that remain the best place for durable knowledge work.

That includes deeper bridges into external PKMs and other systems, so knowledge that lives elsewhere still becomes visible to search, Context Spaces, and the LLM Workspace, without Digital Center trying to absorb it. It also includes a shift in how retrieval works: search answers "what am I looking for right now," but the next layer is **persistent queries and saved views** — a way to tell Digital Center what set of objects, native or mirrored, it should continuously maintain and present, in whatever form (list, timeline, board, graph) fits the moment.

Beyond that, the roadmap includes richer AI support for categorization, semantic search, and summarization; analytics for understanding time, attention, and saved information; broader browser and desktop capture; and eventually an extension ecosystem where new integrations plug into the same capture-and-return model.

The goal is not to build another isolated productivity app. The goal is to build a personal operating layer for digital life: a place where learning, planning, saving, thinking, and returning to context all become faster and more connected — while the tools that already do one thing well keep doing it, visibly, as part of the same system.
