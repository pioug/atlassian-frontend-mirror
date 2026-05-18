# Synced Blocks Plugin — Developer Agent Guide

> **For workflow guidance, debugging, and cross-package task guides, load the `synced-blocks`
> skill:**
> `get_skill(skill_name_or_path="platform/packages/editor/.rovodev/skills/synced-blocks/SKILL.md")`

---

## Quick Context

**Synced Blocks** lets users create reusable content blocks (source) that can be referenced across
Confluence pages and Jira issue descriptions. This package is the core editor plugin — it registers
ADF nodes, toolbar/menu integration, commands, and ProseMirror plugins.

**Two ADF node types:**

- `bodiedSyncBlock` — **Source** sync block (contains the editable content)
- `syncBlock` — **Reference** sync block (renders content fetched from Block Service)

---

## Plugin Internals (`src/`)

```
src/
├── index.ts                    # Re-exports plugin + type
├── syncedBlockPlugin.tsx       # Top-level: registers nodes, commands, UI, pm-plugins
├── syncedBlockPluginType.ts    # TypeScript interfaces for options, shared state, dependencies
├── editor-actions/
│   └── index.ts                # flushBodiedSyncBlocks, flushSyncBlocks,
│                                 discardUnpublishedSyncBlocks (EDITOR-6473)
├── editor-commands/
│   └── index.ts                # createSyncedBlock, copySyncedBlockReferenceToClipboardEditorCommand,
│                                 removeSyncedBlockAtPos, unsyncSyncBlock
├── nodeviews/
│   ├── syncedBlock.tsx         # NodeView for reference (syncBlock) — read-only, fetches from BE
│   ├── lazySyncedBlock.tsx     # Lazy-loaded wrapper for syncedBlock (EDITOR-6928)
│   └── bodiedSyncedBlock.tsx   # NodeView for source (bodiedSyncBlock) — nested editor with content
├── pm-plugins/
│   ├── main.ts                 # Core state machine: lifecycle, creation, deletion, cache,
│   │                             status decoration apply path (gated by editor_synced_block_perf)
│   ├── menu-and-toolbar-experiences.ts # Experience tracking for menu/toolbar interactions
│   └── utils/
│       ├── track-sync-blocks.ts                    # Tracks mutations, updates shared state
│       ├── handle-bodied-sync-block-creation.ts    # Creation flow, local cache, retry logic
│       ├── handle-bodied-sync-block-removal.ts     # Deletion flow, BE synchronization
│       ├── has-synced-blocks.ts                    # O(childCount) presence check (EDITOR-6928 lazy init)
│       ├── transaction-inserts-synced-block.ts     # Detect tr inserts a synced block (lazy init)
│       ├── selection-decorations.ts                # Selection decoration helpers
│       ├── rebase-transaction.ts                   # Rebase helpers used by main.ts
│       ├── ignore-dom-event.ts                     # DOM event guard
│       └── utils.ts                                # Misc shared helpers
├── ui/
│   ├── toolbar-components.tsx    # Primary toolbar button ("Create Synced Block")
│   ├── floating-toolbar.tsx      # Node-level actions: delete, unsync, copy link, view locations
│   ├── block-menu-components.tsx # Block menu entry
│   ├── quick-insert.tsx          # Slash command / quick insert config
│   ├── DeleteConfirmationModal.tsx # Deletion confirmation dialog
│   ├── SyncBlockRefresher.tsx    # Periodic data refresh from backend
│   └── Flag.tsx                  # Error/info flags (offline, copy notifications)
└── types/
    └── index.ts                # FLAG_ID, SyncedBlockSharedState, BodiedSyncBlockDeletionStatus
```

### Editor Actions

This package exposes top-level **editor actions** (in `editor-actions/index.ts`) that products call
from outside the plugin lifecycle:

- `flushBodiedSyncBlocks(store)` — flush all dirty source blocks
- `flushSyncBlocks(store)` — flush reference manager (e.g. on save)
- `discardUnpublishedSyncBlocks(store)` — delete unpublished blocks on cancel (added in EDITOR-6473;
  used by Confluence's editor cancel flow)

### Lazy Init & Perf (EDITOR-6928 / EDITOR-6930)

Behind the `editor_synced_block_perf` experiment, `main.ts`:

- Skips creating synced-block plugin state and node-views for documents with no synced blocks
  (`hasSyncedBlocks(doc)`).
- Computes `statusDecorationSet` inside `apply()` and stores it on plugin state, then exposes it via
  an O(1) `decorations` prop instead of an O(n) `doc.descendants()` walk on every transaction.
- Uses `sourceSyncBlockStoreManager.hasPendingCreations()` for an O(1) pending-creation early return
  in `buildStatusDecorations()`.

### Key Code Patterns

**Creating a sync block** (flow through the code):

1. User triggers via toolbar/block menu/slash command → `ui/toolbar-components.tsx` or
   `ui/block-menu-components.tsx`
2. Calls `editor-commands/createSyncedBlock` → inserts `bodiedSyncBlock` node into document
3. `pm-plugins/main.ts` detects new node → `handle-bodied-sync-block-creation.ts` → calls
   `SyncBlockStoreManager.create()` → Block Service API
4. `menu-and-toolbar-experiences.ts` fires experience event

**Reference rendering** (flow through the code):

1. `nodeviews/syncedBlock.tsx` mounts for each `syncBlock` node
2. Calls `ReferenceSyncBlockStoreManager.fetch(resourceId)` → Block Service API
3. Renders content via nested renderer from `editor-synced-block-renderer`
4. Subscribes to AGG WebSocket for real-time updates
