# Notes — Feature Explainer

## Purpose

The Notes system is a lightweight capture layer for thoughts, ideas, and quick written content.

It is not meant to replace a full knowledge base. Instead, it acts as:

**fast capture → temporary holding → optional long-term promotion**

This system should feel significantly easier and faster than opening a traditional note-taking app.

---

## Core Philosophy

There are two types of notes:

1. **Quick notes** — short, unstructured, captured instantly
2. **Knowledge notes** — structured, permanent, stored elsewhere (e.g., Obsidian)

This system is designed primarily for quick notes.

---

## Core Functionality

### 1. Instant Capture

Users should be able to create a note instantly:

- via keyboard shortcut
- via small popup
- without navigating away from current context

The note should be:

- unnamed by default
- stored immediately
- editable later

---

### 2. Unorganized Note Pool

All new notes initially go into an "unorganized" pool.

This pool represents:

- thoughts not yet processed
- ideas not yet categorized

Users can later:

- rename notes
- add tags
- move notes to structured categories

---

### 3. Lightweight Organization

Users should be able to:

- rename notes
- tag notes
- filter/search notes

This should be simple and optional.

No complex folder hierarchy is required.

---

### 4. Obsidian Connector (One-Way)

The system supports sending notes to an external Obsidian vault.

### Behavior:

- user selects a note
- clicks "Send to Obsidian"
- note is written as a file in the vault
- single button to open Obsidian app directly

Optional enhancement:

- AI suggests a destination folder

Important constraints:

- no two-way sync
- no editing Obsidian notes inside this system

This keeps responsibilities clear.

---

### 5. Search

Search must support:

- note content
- titles
- tags

Search should be:

- fast
- forgiving
- reliable

---

### 6. Linking

Notes should support:

- basic URL recognition
- simple linking to other system objects (optional)

No advanced graph system is required at this stage.

---

## What Matters Most

1. Capture must be frictionless
2. Notes must not require structure upfront
3. Organizing later must be easy
4. Obsidian integration must be clean, simple, convenient, and optional
5. The system must not feel like "real note-taking work"

---

## What It Is Not

The Notes system is NOT:

- a full knowledge graph
- a replacement for Obsidian
- a long-form writing tool

It is a **fast, low-friction capture layer**.

---

## Design Direction

The Notes system should feel:

- minimal
- fast
- lightweight
- low-pressure

It should prioritize:

- quick entry
- simple list view
- easy filtering

The emotional feel should be:

> "I can write this down instantly and deal with it later."

