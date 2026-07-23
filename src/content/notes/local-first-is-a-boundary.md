---
title: Local-first is a boundary, not a checkbox
description: Why offline support alone does not create a local-first system.
publishDate: 2026-03-01
tags: [Local-first, Architecture]
summary: The meaningful question is where authority lives, not whether a cache exists.
featured: true
category: Field note
---

“Works offline” describes availability. “Local-first” describes authority.

A system can cache every screen and still make the server the final source of truth. Conversely, a system may use network services while keeping user-held data and local operations authoritative. The architecture becomes clearer when local-first is treated as a boundary decision: which operations require permission from infrastructure the user does not control?

That question should be answered separately for reading, creating, editing, identity, collaboration, recovery, and export. The resulting matrix is more useful than a single local-first label.
