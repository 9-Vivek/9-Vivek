---
title: Semantic Workspace
description: An open-core developer tool that adds a Git-friendly semantic layer above code files for navigation, architecture, and AI context.
publishDate: 2026-02-20
tags: [VS Code, Metadata, Developer Tools]
summary: Navigate codebases by purpose, feature, layer, ownership, and relationships rather than path alone.
featured: true
status: Foundation and MVP planning
category: Open-core product
---

Semantic Workspace starts from a limitation of the folder tree: a file has one physical path, but it may participate in several features, runtime layers, ownership boundaries, tests, and architectural relationships.

The product adds an explicit semantic layer above the repository so developers and coding agents can understand files by purpose and intent without changing the source tree.

## Repository-native metadata

Metadata lives inside a Git-friendly `.semantic-workspace/` directory. A typed schema can describe fields such as feature, layer, purpose, runtime, owner, related files, and agent notes. The same directory stores file annotations, saved views, and exported context bundles.

Early workflows are deliberately manual. Annotation forces architectural intent to become explicit and provides evidence about which metadata is valuable before inference is introduced.

## Local developer tool

The first product is a local VS Code extension supported by CLI tooling. It reads the repository metadata, groups files through semantic projections, and allows teams to preserve views by feature, layer, owner, or task.

It can also export concise context bundles for AI coding tools. Instead of sending a raw file dump, a bundle can describe the relevant files, their purposes and relationships, likely risks, owners, and tests. Semantic Workspace is intended to improve coding agents, not replace them.

## Open-core direction

The schema, local storage format, extension, CLI, saved views, and context export are intended to remain open. Potential paid value sits around team collaboration, semantic pull-request summaries, ownership maps, architecture-drift detection, managed integrations, and organization-level context across multiple repositories.

AI-assisted annotation comes later. Models may suggest metadata, infer relationships, or assemble task-aware context, but human review remains part of the control boundary.
