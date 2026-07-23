# Personal Intelligence Layer (PIL)

> *A reasoning build system that continuously transforms personal information into structured understanding.*

---

# Vision

The Personal Intelligence Layer (PIL) is a standalone reasoning engine designed to maintain an evolving understanding of a user's projects, ideas, goals, research, and digital life.

Unlike chat-based assistants, PIL is **stateful**.

Its purpose is not to answer isolated questions, but to continuously build, refine, and reinterpret a persistent model of the user's world.

Rather than storing conversations, it stores understanding.

Rather than retrieving information, it derives insight.

Long-term, this project is intended to become the intelligence subsystem of the Digital Center, but it is designed to be fully functional as an independent application.

---

# Core Philosophy

Information should not accumulate.

It should evolve.

Traditional knowledge systems optimize for storage and retrieval.

PIL optimizes for continuous interpretation.

Every document, update, note, or idea becomes another input into an evolving model of reality.

The system repeatedly asks:

- What changed?
- What does the current state now look like?
- What matters most?
- What opportunities have emerged?
- What assumptions are no longer true?
- What should the user focus on next?

---

# Mental Model

PIL is inspired far more by build systems and compiler pipelines than by conversational AI.

```
Raw Information
        │
        ▼
State Derivation
        │
        ▼
Canonical State
        │
        ▼
Reasoning Graph
        │
        ▼
Executive Understanding
```

The filesystem is the source of truth.

The LLM never owns memory.

It simply transforms one representation of information into another.

---

# Design Principles

## Files Are Truth

Every persistent object exists as a file.

The LLM reads files.

The LLM rewrites files.

The filesystem is the permanent knowledge store.

---

## Raw Information Is Immutable

Original information is never modified.

It represents historical truth.

Examples include:

- imported documents
- research
- notes
- project updates
- journal entries

---

## State Is Derived

State is never manually maintained.

Instead, it is continuously regenerated from raw information.

Each state file represents the current understanding of one concept.

Examples might include:

- Digital Center
- Personal Intelligence Layer
- Startup Idea
- Career
- Reading List

The organization of state files is determined by the intelligence system itself rather than predefined by the developer.

---

## Intelligence Is Layered

Complex reasoning is decomposed into specialized reasoning passes.

Each pass has one responsibility.

Examples:

- Strategic analysis
- Opportunity identification
- Systems thinking
- Architecture review
- Risk analysis
- Contrarian review

Higher layers consume outputs from lower layers.

---

## The System Is A Computational Graph

Every reasoning step is represented as a node.

A node has:

- inputs
- prompt
- model
- outputs

Nodes may depend on other nodes.

The orchestrator simply executes the graph.

It has no understanding of what the graph actually represents.

---

# Architecture

```
Raw Documents
Raw Updates
        │
        ▼
Derivers
        │
        ▼
State
        │
        ├──────────────┐
        ▼              ▼
Strategic Lens     Opportunity Lens
        │              │
        ├──────┐ ┌─────┤
        ▼      ▼ ▼
     Meta Reasoning
            │
            ▼
    Executive Summary
```

The graph can grow without modifying application code.

Adding intelligence simply means adding nodes.

---

# System Components

## Raw Store

Purpose:

Permanent storage of original information.

Contains:

- documents
- updates

Never modified.

---

## State Store

Purpose:

Maintain the current synthesized understanding of every important object.

State files are continuously rewritten by derivers.

History belongs in the Raw Store.

Current understanding belongs in State.

---

## Derivers

Derivers update canonical state.

They answer:

> Given everything I currently know, what does reality now look like?

Inputs:

- existing state
- newly ingested raw information

Outputs:

- file operations
- updated state files

Derivers are the only nodes allowed to modify state.

---

## Lenses

Lenses perform specialized reasoning over state.

Examples include:

- Strategic Lens
- Risk Lens
- Opportunity Lens
- Learning Lens
- Architecture Lens
- Career Lens
- Contrarian Lens

Lenses never modify state.

They only produce analysis.

---

## Meta Layer

Meta nodes synthesize outputs from multiple lenses.

Examples:

- Executive Summary
- Cross-lens synthesis
- Alignment review

The executive summary should become the primary interface presented to the user.

---

# File Structure

```
pil/

    docs/
    
    src/

    system/
    
        raw/
            documents/
            updates/
    
        state/
    
        outputs/
    
        nodes/
            deriver.md
            lenses.md
            meta.md
```

The filesystem intentionally remains minimal.

The intelligence layer is responsible for organizing knowledge, not the application.

---

# Metadata

Every generated file should contain lightweight metadata.

Example:

```yaml
---
id: digital-center

type: project

updated: 2026-06-26

generated_by: update-deriver

sources:
  - raw/updates/update_2026_06_26.md
---
```

Below the metadata, all content remains free-form Markdown.

Only metadata should be standardized.

Knowledge itself should remain flexible.

---

# Node Definition

Nodes are stored inside prompt documents.

Each node defines:

- name
- inputs
- prompt
- optional model configuration

Example:

```markdown
---
name: Strategic Lens

inputs:
    - state/*

prompt:

Identify:

- highest leverage projects
- emerging opportunities
- unnecessary complexity
- current priorities

Return a structured Markdown report.
---
```

The orchestrator simply parses every node and executes it.

No node-specific application code should exist.

---

# Prompt Files

## deriver.md

Contains two node definitions.

### Document Deriver

Responsible for creating and updating state from newly added documents.

### Update Deriver

Responsible for integrating user updates into existing state.

The derivers do not directly modify files.

Instead they emit file operations describing exactly what should happen.

---

## lenses.md

Contains every reasoning lens.

Each node is separated by:

```
---
```

Adding a new lens should require only adding another node definition.

No code changes.

---

## meta.md

Contains the final reasoning layer.

Initially this consists of a single node:

Executive Summary

Inputs:

- all lens outputs

Purpose:

Produce the highest-value briefing possible based on the user's stated intent.

---

# File Operations

LLMs should never directly modify files.

Instead they emit operations.

Example:

```json
{
    "operations": [
        {
            "type": "update",
            "file": "state/digital-center.md",
            "content": "..."
        },
        {
            "type": "create",
            "file": "state/personal-intelligence-layer.md",
            "content": "..."
        },
        {
            "type": "archive",
            "file": "state/old-idea.md"
        }
    ]
}
```

The Python runtime validates and executes these operations.

This creates a clean separation between reasoning and execution.

---

# Execution Pipeline

```
New Raw Files
        │
        ▼
Run Derivers
        │
        ▼
Update State
        │
        ▼
Run Lens Graph
        │
        ▼
Generate Outputs
        │
        ▼
Run Meta Layer
        │
        ▼
Executive Summary
```

Eventually the pipeline should become dependency-aware so that only invalidated nodes are recomputed.

---

# Version 1 Goals

The objective of Version 1 is to prove a single hypothesis:

> A graph of specialized reasoning passes operating over continuously derived state can produce significantly more useful understanding than isolated LLM conversations.

Version 1 intentionally avoids:

- databases
- vector stores
- graph databases
- embeddings
- autonomous agents
- multi-agent orchestration
- UI complexity

The focus is entirely on establishing the reasoning architecture.

---

# Long-Term Vision

Potential future capabilities include:

- Incremental graph execution
- Local and cloud model backends
- Dependency tracking
- Provenance tracking
- Confidence estimation
- Observer nodes
- Automated lens generation
- Semantic search
- Knowledge graph visualization
- Digital Center integration
- Continuous background reasoning

These are extensions of the architecture, not requirements for its foundation.

---

# Guiding Principle

PIL is not a chatbot.

It is not a note-taking application.

It is not an AI agent.

PIL is a **reasoning build system**.

Raw information is treated as source code.

Canonical state is an intermediate representation.

Lenses are analysis passes.

The executive summary is the compiled artifact: a continually rebuilt understanding of the user's world.