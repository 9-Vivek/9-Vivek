# Caching & derived data

This document describes the **derived** data the app caches to make global search
work, and the background-processing model that fills those caches. It defers to
[`data_model.md`](./data_model.md) on the canonical-vs-derived distinction —
read that first.

**One rule governs everything here:** these caches are *derived* and
*rebuildable*. Nothing in this document is a source of truth. Deleting any of the
storage keys below is safe — the data simply rebuilds (lazily, or on the next
background sweep). Canonical, feature-owned data (the `ArchiveItem`s themselves)
is never stored in these caches.

## The three derived stores

| Store | Storage key | Owner | Holds | Rebuilds via |
| --- | --- | --- | --- | --- |
| `EmbeddingCache` | `derived.search.embeddings` | global/search | One embedding vector per searchable doc | Lazily, in `runSmart` at search time |
| `ArchiveEnrichmentCache` | `derived.archive.enrichment` | Archive | Scraped OG metadata + capped `semanticExtract` | Background processing queue (or manual Process) |
| `ArchiveProcessingStore` | `derived.archive.processing` | Archive | Per-item attempt outcome (`done`/`empty`/`error`, attempts) | Re-attempts when missing |

All three follow the same shape: a schema-versioned JSON blob in `localStorage`,
a `Map` keyed by object ref, `hydrate()`/`persist()`/`pruneTo()`, and a garbled/
version-mismatched read degrades to empty (rebuildable).

## Invalidation

Each cache keys its freshness off a content hash so it self-invalidates without
explicit cache busting:

- **Enrichment & processing** key on `urlHash = sourceHash(item.url)`. Editing an
  item's URL makes the old record stale (`getEnrichment`/`getRecord` return
  `null`), so the item is eligible for reprocessing. Non-URL edits (title, note,
  tags) do not invalidate enrichment.
- **Embeddings** key on `sourceHash(doc.semanticText ?? doc.exactText)` **plus**
  `modelId`. When an item's `semanticText` changes — which is exactly what happens
  when enrichment lands, since enrichment feeds **only** `semanticText` — the hash
  changes, the cached vector misses, and `runSmart` re-embeds it. Because
  enrichment never touches `exactText`/`fields[]`, Exact/Lexical ranking is
  unaffected and embeddings don't churn on non-semantic edits.

`pruneTo(keep)` is called after writes with the set of live item refs, dropping
entries for deleted items so the caches don't grow unbounded.

## Lazy embeddings vs. queued enrichment

Two different cadences, deliberately:

- **Embeddings are lazy.** `GlobalSearchService.runSmart` pulls all in-scope docs,
  embeds the query, fills any cache misses in one batch `embed_texts` call,
  prunes, persists, then scores (hybrid lexical + cosine). The embedding backend
  is Tauri-only (`fastembed`/ONNX); in browser dev Smart silently falls back to
  Lexical. Nothing pre-computes embeddings — the first Smart search over new
  content pays for it, then it's cached.
- **Enrichment is queued.** Fetching a page's HTML is the expensive, network-bound,
  failure-prone step, so it runs in the background rather than at search time. See
  below.

This split is why "background processing" governs enrichment, not embedding:
embeddings are cheap to fill on demand and gated by content hashes; enrichment is
where the real I/O and the user-visible "is this processed yet?" question live.

## Background processing queue

`ArchiveProcessingQueue` (`src/features/archive/process/`) orchestrates *when*
`enrichArchiveItem` runs. It does **not** change how content is fetched or parsed
— that's still `fetchPageMetadata` (runtime-branched fetch, 8s timeout, DOMParser,
`semanticExtract` capped at 4000 chars). The queue only decides scheduling.

### Toggle semantics (`AppSettings.backgroundProcessing`, default **on**)

- **On:** newly-saved items and any un-enriched existing items are swept and
  enriched in the background. New saves are picked up automatically — the capture
  popup just creates the item; the worker (see below) notices it via the store
  subscription.
- **Off:** no automatic enrichment of new saves or existing items. **Already-
  enriched data is retained** — turning the toggle off never discards anything.
  The *only* way to process while off is the per-item **Process** button in the
  Archive detail panel, which forces that one item through immediately.
- When on, the Process button still works — it moves the item to the **front** of
  the queue (priority) rather than running out-of-band.

### Single-window worker

The worker runs **only in the main/all window** (the palette window, which hosts
the capture popup, never processes). In Tauri there are two webview windows with
separate store instances; a palette-window save reaches the main window through
the existing cross-window sync (the `storage:changed` event + focus re-hydrate),
at which point the main worker's `archiveStore` subscription fires and it sweeps
the new item. This avoids two windows double-fetching the same URL.

### Pending set & retry/terminal policy

"Pending" is *derived*, not a stored list: an item needs processing when it has no
fresh enrichment **and** no terminal attempt record for its current `urlHash`.
Outcomes:

- `done` — enrichment produced content. Terminal (until `urlHash` changes).
- `empty` — fetch succeeded but nothing useful was extracted. Terminal.
- `error` — fetch/parse threw. Retried up to `MAX_ATTEMPTS = 3`, then terminal.

A manual **Process** (`process(id, { force: true })`) bypasses terminal status and
re-attempts regardless. The processing store exists precisely so the background
sweep doesn't re-fetch dead/empty URLs on every launch.

The worker is sequential (concurrency 1) and subscribable, so the detail panel's
Process button reflects live status: `unprocessed → queued → processing →
processed` (or `error`/`empty` with a Retry affordance).

## Failure modes (all degrade gracefully)

- Fetch failure / timeout / non-OK / browser CORS → no enrichment record, item
  stays saved with its base fields; recorded as `error`/`empty` so search still
  works.
- Item deleted mid-fetch → the post-fetch existence check skips the write.
- Cache write failure → caught; search runs without that enrichment.
- Embedding backend unavailable → Smart falls back to Lexical.
- Any `derived.*` key deleted or garbled → treated as empty and rebuilt.
