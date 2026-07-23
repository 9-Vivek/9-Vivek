# Project Brief: Developer Portfolio & Research Hub

### Purpose & Objective

Build a modern, minimalistic personal developer portfolio site. The primary goal is to present the developer as a software architect who bridges **theoretical human-computer interaction (HCI) research** with **practical, local-first engineering**.

The site serves two distinct functions:

1. **Research Hub (The "North Star"):** Introduces *Active Cognition Computing (ACC)*, a emerging theoretical framework exploring how software can act as an externalized, persistent extension of human cognition.
2. **Technical Portfolio (The "Proof"):** Highlights active open-source and personal engineering projects (ranging from local-first applications to distributed consensus research) that serve as real-world implementations or laboratories for the overarching theory.

This project is not a startup landing page.

It should feel closer to:

- an academic research website
- technical documentation
- an engineer's notebook
- a software architecture portfolio

than a product marketing site.

The emphasis is clarity, credibility, and technical depth rather than conversion-oriented design.

---

## Key Information & Content Outline

### 1. Hero / Header Section

- **Identity:** Software Developer & CS/AI Student.
- **Core Framing:** Building high-bandwidth software for active human cognition, local-first environments, and sovereign data systems.

### 2. Featured Thought Leadership / Research (ACC Framework)

- **Title:** Active Cognition Computing (ACC)
- **Overview:** A theoretical framework shifting software paradigms from *Artifact-Centric* (file storage and rigid folder trees) to *Cognitive-Centric* (maintaining dynamic context and state models for the user).
- **Placeholder CTA:** Link to download/read the upcoming *ACC Technical Whitepaper* (PDF / long-form post placeholder).

### 3. Portfolio & Engineering Projects

#### The Laboratory (Active Experimentation)

- **Digital Center:** A local-first desktop application built with Tauri and React. Acts as a sandbox testing context-dependent UI overlays, contextual spaces, and non-hierarchical organization.

#### Commercial Productization

- **Semantic Workspace:** An open-core VSCode extension that maps codebase files and tasks by functional utility and task intent via metadata sidecars rather than static file paths.

#### Infrastructure & Network Security

- **H-BFT Specification:** A consensus and network-layer specification designed to provide sovereign, private-by-default data vaults for local-first applications.
- **Explorer Engine:** A lightweight projection engine that converts raw, graph-indexed data into context-aware visual views (Lenses).

### 4. Background & Credentials

- **Education & Certifications:** Computer Science & AI focus, alongside AWS & AI/ML credentials.
- **Skills/Tech Stack:** Tauri, React, Vite, Python, Local LLMs (Ollama/llama3.2), TypeScript, Systems Design, Distributed Systems.

---

## Technical Requirements & Architecture

### Framework

Use Astro with Tailwind CSS.

The site should be generated as a fully static website with minimal client-side JavaScript. React components may be used only where interactivity provides clear value.

Do not build this as a server-rendered application.

---

### Deployment

Target GitHub Pages.

Requirements:

- Static site generation only
- Compatible with GitHub Pages
- Output to `/dist`
- No server runtime
- No database
- No API routes
- No authentication backend
- Minimal GitHub Actions workflow for automatic deployment

Assume the site may initially be deployed to a repository subpath such as:

```
https://username.github.io/portfolio/
```

Configure Astro accordingly using the appropriate `site` and `base` settings.

The deployment configuration should be easy to change later if a custom domain is added.

---

### Content Architecture

Research papers, specifications, and project documentation should be authored as Markdown files.

Use Astro Content Collections so new content can be added without modifying layouts.

Suggested structure:

```
src/content/

    research/
        acc.md
        whitepaper.md

    projects/
        digital-center.md
        semantic-workspace.md
        explorer-engine.md
        h-bft.md

    notes/
```

Every document should support:

- title
- description
- publish date
- tags
- summary
- optional featured status

---

### Site Structure

The homepage should function as a hub.

Suggested navigation:

Home
Research
Projects
Notes
About

Research and Projects should share a consistent page layout while remaining independent content collections.

---

### Design Goals

Prioritize readability over decoration.

The aesthetic should resemble modern developer documentation rather than a startup landing page.

Characteristics:

- dark mode
- generous whitespace
- restrained typography
- subtle motion only
- responsive layout
- accessibility first
- fast loading
- semantic HTML

Avoid:

- excessive animations
- large hero videos
- carousels
- generic marketing sections
- unnecessary JavaScript

---

### Performance

Optimize for Lighthouse.

Goals:

- static HTML wherever possible
- lazy-load images
- optimized fonts
- minimal JavaScript
- excellent SEO
- WCAG-conscious accessibility

---

### Extensibility

The site should be maintainable as a long-term research hub.

Adding a new project, paper, or note should require only creating a new Markdown document.

Layouts, navigation, and indexes should update automatically.

The architecture should support future additions such as:

- downloadable PDFs
- citations
- diagrams
- image galleries
- project timelines
- publication lists
- RSS feed
- search