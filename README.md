# Vivek Pragada — Portfolio & Research Hub

I'm a Computer Science & AI student at the University of Pennsylvania (rising junior), building software at the intersection of human-computer interaction research and local-first systems engineering.

This repository hosts my personal site and research hub, where I write about **Active Cognition Computing (ACC)**—a framework for software that maintains context and cognitive state rather than merely storing artifacts—and build the projects that test it in practice.

## What I'm working on

- **[Active Cognition Computing](src/content/research/acc.md)** - a research framework proposing that software should track the evolving context around a user's intentions, not just the files and messages that result from it.
- **[Digital Center](src/content/projects/digital-center.md)** — a local-first desktop operating layer that connects specialized tools through connectors, extensions, shared references, and contextual workspaces.
- **[Relational Data Canvas (RDC)](src/content/projects/rdc.md)** — a schema-driven environment for authoring relational data and exploring it through a deterministic storage → query → result set → render pipeline.
- **[Personal Intelligence Layer](src/content/projects/pil.md)** — a filesystem-based reasoning pipeline that continuously derives structured understanding from personal information.
- **[H-BFT](src/content/research/h-bft.md)** — research into human-anchored, sovereign network infrastructure for private-by-default local-first systems.
- **[Semantic Workspace](src/content/commercial/semantic-workspace.md)** — an open-core VS Code extension that lets developers and coding agents navigate a codebase by purpose and intent, not just file path.

I care about systems that are legible, local-first, and agency-preserving: software that helps people sustain thought instead of deciding for them.

## Site structure

The homepage introduces my work and serves as the hub for the site. A persistent right-side navigation panel connects the major sections:

- **Overview** — ACC's direction and the relationship between the research and engineering work.
- **Research** — the ACC framework and H-BFT specification.
- **Projects** — Digital Center, RDC, and the Personal Intelligence Layer.
- **Applied Work** — public-facing applications of the broader technical direction.
- **Professional Credentials** — certifications and current coursework.
- **Professional Capabilities** — skills and experience.

The panel also contains direct links to [GitHub](https://github.com/9-Vivek), [LinkedIn](https://www.linkedin.com/in/vivekpragada941/), and [email](mailto:vpragada@seas.upenn.edu).

## Development

Built with Astro and Tailwind CSS, using content collections so new research notes and projects can be added as Markdown without touching layouts. Deployed statically to GitHub Pages.

```sh
pnpm install
pnpm run dev
pnpm run build
```

<!--
The production build is emitted to `dist/`. The default deployment path is `/portfolio`; override `SITE_URL` and `BASE_PATH` for a different GitHub Pages repository or a custom domain.

Public site content lives in `src/content`. Add a Markdown file to `research`, `projects`, `notes`, or `commercial` and the corresponding index and detail page will be generated automatically. Source and planning documents used to prepare the public summaries live in `content_docs`; those documents are intentionally more comprehensive than the website copy.

Entry visibility can be controlled in `src/config/visibility.json`, which allows work to remain in the content collection without being included in the generated public site.

-->

<!--
**9-Vivek/9-Vivek** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
-->
