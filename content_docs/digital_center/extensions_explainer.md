# Extensions — Feature Explainer

## Purpose

Extensions allow the system to connect with external platforms and bring useful signals into a unified environment.

They are not meant to replace those platforms.

They exist to:

- surface important information quickly
- enable fast capture from external sources
- create continuity between different parts of a user's digital life

---

## Core Philosophy

Each extension should be:

- lightweight
- focused
- optional

The system should not become a dashboard full of competing content.

Extensions are tools, not the main experience.

---

## Core Extension Types

## 1. Email (Inbox Preview)

### Purpose

- provide a quick glance at inbox
- allow lightweight interaction

### Functionality

- show recent emails
- flag important items
- create reminder from email
- create note from email

### Constraints

- no full email client
- no sending
- no complex threading management

---

## 2. Google Discover (Feed)

### Purpose

- surface relevant content quickly
- allow fast capture into archive

### Functionality

- scrollable feed preview
- quick save to archive
- optional context note on save

### Constraints

- minimal UI
- not a full browsing environment

---

## 3. LinkedIn Feed

### Purpose

- extract useful signal from professional content

### Functionality

- preview posts
- save posts to archive
- extract useful ideas

### Constraints

- no full interaction layer
- no posting or messaging

---

## 4. Discord Chat

### Purpose

- surface important messages from selected channels

### Functionality

- preview messages
- extension-level message saving
- link message objects from notes

### Constraints

- no full chat experience
- no real-time messaging system
- manual and background periodic updates (no real-time sync)

---

## General Extension Model

All extensions should follow the same pattern:

### 1. Surface

Display relevant content from external source

### 2. Capture

Potentially enable user to:

- save to archive
- create reminder
- create note or reference from note

### 3. Minimal Interaction

Allow only the most essential interactions

---

## What Matters Most

1. Extensions must remain lightweight
2. They must not dominate the interface
3. They must improve capture speed
4. They must integrate cleanly with archive and notes

---

## What Extensions Are Not

Extensions are NOT:

- full platform replacements
- heavy dashboards
- independent apps inside the system

They are **connective tissue** between external platforms and the user's internal system.

---

## Design Direction

Extensions should:

- live behind a menu or panel
- be opened intentionally
- feel fast and responsive

They should enhance the system without distracting from its core purpose.

