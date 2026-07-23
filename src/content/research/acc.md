---
title: Active Cognition Computing
description: A framework for software that maintains context and cognitive state instead of merely storing artifacts.
publishDate: 2026-02-01
tags: [HCI, Cognitive Systems, Local-first]
summary: From artifact-centric storage toward software that supports the continuity of thought.
featured: true
status: Working framework
category: Research / Framework
---

Most software is organized around artifacts: files, records, messages, and the containers that hold them. This model is durable, legible, and easy for computers to implement. It is also a poor representation of how people think.

Active Cognition Computing (ACC) proposes a complementary paradigm: software should maintain a useful, inspectable model of the user's active context. The unit of continuity becomes not the file, but the evolving cognitive state around an intention.

## The problem with artifact-centric systems

A folder remembers where a document was stored. It does not remember why it mattered, what question it was answering, what alternatives were rejected, or which adjacent ideas were active at the time. Those connections exist transiently in the user's memory and are lost whenever attention shifts.

The result is a recurring reconstruction cost. Returning to meaningful work means rebuilding the state that made the artifacts intelligible.

## A cognitive-centric model

ACC treats context as a first-class system object. A context can include active goals, relevant artifacts, interaction history, unresolved questions, semantic relationships, and the user's preferred view of the material.

This does not imply opaque automation. A useful cognitive system should be:

- **Legible:** the state it maintains can be inspected and corrected.
- **Local-first:** core value remains available without a network connection.
- **Agency-preserving:** suggestions remain subordinate to user intent.
- **Continuity-oriented:** the system makes resumption cheaper than reconstruction.

## Research direction

The framework is being tested through several distinct systems. Digital Center explores capture-and-return workflows, Context Spaces, overlays, and explicit model context. PIL treats personal understanding as derived state produced by a reasoning build graph. Explorer Engine separates structured queries from interchangeable representations, while Semantic Workspace tests semantic navigation and AI context inside codebases. H-BFT asks what network assumptions would be required if sensitive cognitive state must remain sovereign.

> The goal is not software that thinks for the user. It is software that helps the user sustain thought.

The next phase is to formalize the state model, define measurable cognitive continuity, and document design patterns that can be evaluated across applications.
