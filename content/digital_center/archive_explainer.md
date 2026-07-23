# Archive — Feature Explainer

## Purpose

The Archive is a fast, local-first system for saving, organizing, and retrieving digital content (links, articles, videos, papers, posts) along with minimal personal context.

It is not meant to be a content viewer, media player, or long-form reading environment. Its core purpose is:

**capture → remember → retrieve**

The Archive should feel:
- extremely fast to save into
- extremely easy to scan
- extremely reliable to search later

---

## Core Functionality

### 1. Fast Capture

Users should be able to save content with minimal friction:
- save just a URL
- optionally include a short context note
- optionally tag or categorize

Capture should support:
- keyboard shortcut (ideal)
- paste link into input
- button-triggered quick save

The system should not require full metadata or perfect structure at capture time.

---

### 2. Lightweight Data Model

Each archive item contains:
- title (can be auto-filled or user-edited)
- URL
- source type (article, YouTube, paper, feed, etc.)
- saved timestamp
- optional context note
- optional tags
- optional category

The system must work even if only the URL is saved.

---

### 3. Background Processing (Optional)

The archive supports an optional "processing" mode:
- fetch metadata from known sources (title, text, etc.)
- extract useful content for indexing
- build semantic search embeddings

This should be:
- optional
- non-blocking
- clearly indicated

Users should be able to:
- toggle processing globally
- trigger processing manually per item

---

### 4. Search (Core Experience)

Search is the most important interaction.

It must support:
- exact keyword search
- semantic search (when enabled)
- searching across:
  - titles
  - notes
  - tags
  - categories

Search should feel:
- instant
- forgiving
- powerful

Users should be able to switch between:
- exact search
- semantic search

---

### 5. Scanning and Retrieval

The main view should prioritize:
- recent-first listing
- compact, high-density results
- quick visual parsing

Each item should display:
- source type
- timestamp
- title
- short context note
- tags

The goal is:
**find what you need in seconds**

---

### 6. Context Preservation

Each saved item can include a short note answering:

> "Why did I save this?"

This is critical.

Without context, saved links lose meaning over time.

The note should be:
- optional
- short
- easy to edit later

---

### 7. Minimal Actions per Item

Each item should support:
- open original source
- edit note/tags
- create reminder
- send to notes system

No heavy workflow should be required.

---

## What Matters Most

1. Capture must be extremely fast
2. Search must be extremely reliable
3. Context notes must be easy to add and revisit
4. The interface must stay clean and not overloaded
5. Processing must not block usage

---

## What It Is Not

The Archive is NOT:
- a full reading app
- a content player
- a media management system
- a heavy research database

It is a **personal memory index of digital inputs**.

---

## Design Direction

The Archive should feel:
- dense but readable
- fast and responsive
- slightly technical / futuristic
- optimized for scanning and retrieval

The UI should emphasize:
- search first
- results list second
- detail panel third

Everything else is secondary.

