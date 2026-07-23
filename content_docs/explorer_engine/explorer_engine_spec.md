# Explorer Engine Specification

## Vision

Explorer Engine is a generic software engine for exploring structured collections of entities through reusable queries and interchangeable visual representations.

Traditional applications tightly couple:

- storage
- schema
- business logic
- presentation

Explorer Engine intentionally separates these concerns into independent layers.

The goal is not to build another database.

The goal is to build a semantic exploration layer above existing storage.

---

# Core Philosophy

Everything is an Entity.

An entity belongs to a schema.

A schema belongs to a collection.

Collections are explored through queries.

Queries produce result sets.

Result sets are rendered by interchangeable renderers.

No renderer knows anything about the underlying schema.

---

# Design Principles

## Decouple Everything

Storage should not dictate understanding.

Schemas should not dictate presentation.

Presentation should not dictate storage.

AI should not dictate engine behavior.

Each layer should have a single responsibility.

---

## Generic by Default

The engine should never know what:

- achievements are
- Geometry Dash levels are
- books are
- files are
- projects are

Those are schema definitions.

The engine operates purely on structured entities.

---

## Deterministic Core

The engine itself contains no AI.

Given the same query and the same data:

Result Set A should always equal Result Set A.

This makes the engine:

- testable
- explainable
- deterministic

---

# Core Concepts

## Entity

A structured object.

Examples:

- Level
- Achievement
- Book
- File
- Movie

---

## Schema

Defines:

- fields
- field types
- validation
- optional metadata

Schemas contain no presentation logic.

---

## Collection

A group of entities sharing a schema.

Examples:

- Rated Levels
- Books
- Projects

---

## Query

A structured object describing what data should be retrieved.

Conceptually similar to a NoSQL query.

Example operations:

- filter
- sort
- group
- limit
- aggregate

The engine executes queries.

The engine never interprets natural language.

---

## Result Set

Output of a query.

Contains:

- entities
- ordering
- grouping
- metadata

Result Sets contain no UI information.

---

## Rendering Specification

Describes how a Result Set should be displayed.

Example:

{
  renderer: "table",
  columns: [...],
  groupHeaders: true,
  compact: false
}

Rendering Specifications are independent of the Result Set.

---

## Renderer

Consumes:

- Result Set
- Rendering Specification

Produces UI.

Examples:

- Table
- Cards
- Timeline
- Leaderboard
- Tree

---

# Engine Architecture

Human
↓

(Optional) Internal LLM
(Query Translator)
↓

Structured Query Object

↓

Explorer Engine

↓

Result Set

↓

(Optional) Internal LLM
(Rendering Transformer)

↓

Rendering Specification

↓

Renderer

↓

UI

---

# Internal LLM

The internal LLM never directly accesses storage.

Its responsibilities are:

## Query Translation

Natural language

↓

Structured Query Object

Example:

"Show my hardest completed demons"

↓

{
 filter...
 sort...
}

---

## Rendering Transformation (Future)

Result Set

↓

Rendering Specification

Example:

"Display as compact cards grouped by tier."

↓

{
 renderer: "cards",
 groupBy: ...
}

The MVP will fake this layer using manually created rendering specifications.

---

# Non-Goals

Explorer Engine is NOT:

- a database
- an ORM
- an AI assistant
- a spreadsheet
- a dashboard framework

It is an exploration engine.

---

# Success Criteria

A new schema should require little more than:

- schema definition
- seed data

Everything else should work unchanged.