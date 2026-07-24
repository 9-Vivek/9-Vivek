# Hi, I'm Vivek

I'm a Computer Science & AI student at the University of Pennsylvania (rising junior), building software at the intersection of human-computer interaction research and local-first systems engineering.

This repository hosts my personal site and research hub, where I write about **Active Cognition Computing (ACC)** - a framework for software that maintains context and cognitive state rather than merely storing artifacts - and build the projects that test it in practice.

## What I'm working on

- **[Active Cognition Computing](src/content/research/acc.md)** - a research framework proposing that software should track the evolving context around a user's intentions, not just the files and messages that result from it.
- **[Digital Center](src/content/projects/digital-center.md)** - a local-first desktop workspace (Tauri + React) for capturing signal and resuming work with context intact.
- **[Personal Intelligence Layer](src/content/projects/pil.md)** - a filesystem-based reasoning pipeline that continuously derives structured understanding from personal information.
- **[Semantic Workspace](src/content/commercial/semantic-workspace.md)** - an open-core VS Code extension that lets developers and coding agents navigate a codebase by purpose and intent, not just file path.
- **[AI Systems Institute](src/content/commercial/ai-systems-institute.md)** - a learning platform teaching students to design, evaluate, and integrate complete AI systems.
- **[Explorer Engine](src/content/projects/explorer-engine.md)** and **[H-BFT](src/content/research/h-bft.md)** - supporting research into deterministic data presentation and human-anchored, sovereign network infrastructure.

I care about systems that are legible, local-first, and agency-preserving: software that helps people sustain thought instead of deciding for them.

## About this site

Built with Astro and Tailwind CSS, using content collections so new research notes and projects can be added as Markdown without touching layouts. Deployed statically to GitHub Pages.

```sh
pnpm install
pnpm run dev
```

The production build is emitted to `dist/`. The default deployment path is `/portfolio`; override `SITE_URL` and `BASE_PATH` for a different GitHub Pages repository or a custom domain.

Content lives in `src/content`. Add a Markdown file to `research`, `projects`, `notes`, or `commercial` and the corresponding index and detail page will be generated automatically.


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