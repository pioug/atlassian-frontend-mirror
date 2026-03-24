# Synced Blocks — Developer Agent Guide

> **Purpose**: This guide helps AI agents and developers implement features, fix bugs, and clean up
> feature gates in the Synced Blocks codebase. It provides architectural context, key file
> locations, common patterns, and debugging guidance.
>
> **Full Knowledge Base**:
> [Synced Blocks — Comprehensive Knowledge Base](https://hello.atlassian.net/wiki/spaces/egcuc/pages/6679548384)
> (Confluence)

---

## Quick Context

**Synced Blocks** lets users create reusable content blocks (source) that can be referenced across
Confluence pages and Jira issue descriptions. Edits to the source propagate to all references in
near real-time via the Block Service backend and AGG GraphQL WebSocket subscriptions.

**Two ADF node types:**

- `bodiedSyncBlock` — **Source** sync block (contains the editable content)
- `syncBlock` — **Reference** sync block (renders content fetched from block service)

---

## Package Map

### Platform (shared across products)

| Package            | Path                                                           | Purpose                                                                                          |
| ------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Plugin**         | `platform/packages/editor/editor-plugin-synced-block/`         | Core editor plugin — registers nodes, toolbar, commands, block menu integration                  |
| **Provider**       | `platform/packages/editor/editor-synced-block-provider/`       | Data layer — store managers, block service API client, ARI generation, permissions, media tokens |
| **Renderer**       | `platform/packages/editor/editor-synced-block-renderer/`       | View-mode rendering of reference sync blocks using nested renderer                               |
| **Plugin Tests**   | `platform/packages/editor/editor-plugin-synced-block-tests/`   | Integration tests for the plugin                                                                 |
| **Provider Tests** | `platform/packages/editor/editor-synced-block-provider-tests/` | Tests for store managers and provider hooks                                                      |
| **Renderer Tests** | `platform/packages/editor/editor-synced-block-renderer-tests/` | Tests for renderer components                                                                    |

Also touches:

- `platform/packages/editor/editor-common` — shared types
- `platform/packages/editor/editor-core` — plugin registration
- `platform/packages/renderer` — reference rendering in view mode

### Confluence

| File/Package        | Path                                                                                   | Purpose                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| SyncedBlockProvider | `confluence/next/packages/fabric-providers/src/SyncedBlockProvider.ts`                 | Wraps platform provider with Confluence config (AGG endpoint, media tokens, permissions) |
| SyncedBlockPreload  | `confluence/next/packages/fabric-providers/src/SyncedBlockPreload.ts`                  | Preloads sync block data for SSR                                                         |
| SSR Data Loading    | `confluence/next/packages/fabric-providers/src/SyncedBlockLoadSSRData.ts`              | Loads SSR data                                                                           |
| Edit Page Preload   | `confluence/next/packages/load-edit-page/src/preload/preloadSyncedBlocksData.ts`       | Preloads data for edit page                                                              |
| Editor Preload      | `confluence/next/packages/load-edit-page/src/preload/preloadEditorSyncedBlocksData.ts` | Editor-specific preloading                                                               |
| Full Page Editor    | `confluence/next/packages/full-page-editor/src/FullPageEditorComponent.tsx`            | Integrates sync block plugin into editor                                                 |

### Jira

| File/Package        | Path                                                        | Purpose                                       |
| ------------------- | ----------------------------------------------------------- | --------------------------------------------- |
| Provider Package    | `jira/src/packages/issue/issue-view-synced-block-provider/` | Core Jira integration package                 |
| Node Component Hook | `src/useSyncedBlockProviderNodeComponent.tsx`               | Creates synced block node components for Jira |
| Editor HOC          | `src/withSyncedBlockProviderEditor.tsx`                     | Wraps Jira editor with sync block support     |
| Renderer HOC        | `src/withSyncedBlockProviderRenderer.tsx`                   | Wraps Jira renderer with sync block support   |
| Prefetch            | `src/prefetchSyncedBlocks.ts`                               | Prefetches sync block data in issue view      |
| Relay Fetch         | `src/useRelaySyncBlockFetchProvider.tsx`                    | Real-time updates via Relay subscriptions     |

---

## Key Concepts

### Source vs Reference

- **Source** (`bodiedSyncBlock`): The original content block. Content is stored in the page ADF AND
  in the Block Service. Editable inline.
- **Reference** (`syncBlock`): A read-only copy that fetches content from Block Service. Rendered
  via nested renderer. Shows "Synced from [page]" label.

### Data Flow

1. **Create source** → Content saved to Block Service via API → ARI generated from page ID + local
   ID
2. **Create reference** → Copy source link → Paste → `syncBlock` node inserted with `resourceId`
3. **Edit source** → Content pushed to Block Service → AGG subscription notifies references →
   References re-fetch and re-render
4. **SSR** → On page load, Confluence/Jira preloads sync block data from Block Service in bulk

### ARI Format

- Confluence: `ari:cloud:block::{cloudId}/confluence-page:{pageId}/{localId}`
- Jira: `ari:cloud:block::{cloudId}/jira-work-item:{issueId}/{localId}`

### Store Managers

- `SyncBlockStoreManager` — Manages source sync block state (create, update, delete, flush)
- `ReferenceSyncBlockStoreManager` — Manages reference sync block state (fetch, subscribe, cache)
- `SyncBlockInMemorySessionCache` — Caches data for view→edit transitions

---

## Plugin Internals (`editor-plugin-synced-block/src/`)

The plugin follows a layered architecture:

```
syncedBlockPlugin.tsx          ← Top-level: registers nodes, commands, UI, pm-plugins
├── syncedBlockPluginType.ts   ← TypeScript interfaces for options, shared state, dependencies
├── editor-commands/
│   └── index.ts               ← createSyncedBlock, copySyncedBlockReferenceToClipboardEditorCommand,
│                                 removeSyncedBlockAtPos, unsyncSyncBlock
├── nodeviews/
│   ├── syncedBlock.tsx        ← NodeView for reference (syncBlock) — read-only, fetches from BE
│   ├── bodiedSyncedBlock.tsx  ← NodeView for source (bodiedSyncBlock) — nested editor with content
│   └── bodiedSyncBlockNodeWithToDOMFixed.ts ← DOM serialization fix variant (experiment-gated)
├── pm-plugins/
│   ├── main.ts                ← Core state machine: sync block lifecycle, creation, deletion, cache
│   ├── menu-and-toolbar-experiences.ts ← Experience tracking for menu/toolbar interactions
│   └── utils/
│       ├── track-sync-blocks.ts              ← Tracks mutations, updates shared state
│       ├── handle-bodied-sync-block-creation.ts ← Creation flow, local cache, retry logic
│       └── handle-bodied-sync-block-removal.ts  ← Deletion flow, BE synchronization
├── ui/
│   ├── toolbar-components.tsx    ← Primary toolbar button ("Create Synced Block")
│   ├── floating-toolbar.tsx      ← Node-level actions: delete, unsync, copy link, view locations
│   ├── block-menu-components.tsx ← Block menu entry
│   ├── quick-insert.tsx          ← Slash command / quick insert config
│   ├── DeleteConfirmationModal.tsx ← Deletion confirmation dialog
│   ├── SyncBlockRefresher.tsx    ← Periodic data refresh from backend
│   └── Flag.tsx                  ← Error/info flags (offline, copy notifications)
└── types/
    └── index.ts               ← FLAG_ID, SyncedBlockSharedState, BodiedSyncBlockDeletionStatus
```

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

---

## Common Tasks

### Implementing a new feature in sync blocks

1. **Identify scope**: Does it affect source, reference, or both? Editor, renderer, or both?
2. **Platform first**: Make changes in `editor-plugin-synced-block` or
   `editor-synced-block-provider`
3. **Product integration**: Update Confluence (`fabric-providers`) and/or Jira
   (`issue-view-synced-block-provider`)
4. **Feature gate**: Use a DnH **Experiment** (not a feature gate) for production changes. See
   [Experiment and gates page](https://hello.atlassian.net/wiki/spaces/egcuc/pages/6390978659)
5. **Analytics**: Add experience tracking events (see `EDITOR-1665` pattern)
6. **Test**: Add tests in the corresponding test package

### Fixing a bug

1. **Check supported node types**:
   [Edit at source](https://hello.atlassian.net/wiki/spaces/egcuc/pages/5926568979) |
   [Edit anywhere](https://hello.atlassian.net/wiki/spaces/egcuc/pages/5864526866)
2. **Check unsupported content handling**:
   [Unsupported content](https://hello.atlassian.net/wiki/spaces/egcuc/pages/5687277297)
3. **Debug with analytics**:
   [HOW-TO: Use analytics to debug errors](https://hello.atlassian.net/wiki/spaces/egcuc/pages/6342760320)
4. **Gate the fix**: Use DnH Experiment, not a feature gate
5. **Test on staging**: Verify on Hello (hello.atlassian.net) with experiment enabled

### Cleaning up a feature gate

1. Find the gate key in
   [Experiment and gates](https://hello.atlassian.net/wiki/spaces/egcuc/pages/6390978659)
2. Search codebase: `grep -r "gate_key_name" platform/ confluence/ jira/`
3. Remove conditional logic, keep the "enabled" code path
4. Remove the Switcheroo/Statsig configuration
5. Update the Confluence page to mark as "Cleaned up"

### Adding support for a new node type in sync blocks

1. Check if node is in the supported list:
   [Supported node types](https://hello.atlassian.net/wiki/spaces/egcuc/pages/5926568979)
2. For **source**: Update the allowed node schema in `editor-plugin-synced-block`
3. For **reference**: Ensure nested renderer in `editor-synced-block-renderer` can render the node
4. Test in both classic pages and live pages
5. Test in Jira issue description renderer

---

## Performance Considerations

- **VC90**: Sync blocks can regress VC90 due to content shift (CLS). Reference blocks fetch content
  async and shift the page. Use SSR preloading to mitigate.
- **SSR**: Bulk fetch endpoint reduces waterfall. Configurable via
  `platform_editor_sync_block_ssr_config`.
- **View→Edit transition**: Cache sync block data in session storage (see
  `SyncBlockInMemorySessionCache`)
- **Criterion tests**:
  [Perf test page](https://hello.atlassian.net/wiki/spaces/egcuc/pages/6498888237)

---

## Analytics Events Quick Reference

**Experience events** (SLO-driving): `asyncOperation` type

- `fetchSyncedBlock`, `fetchSyncedBlockSourceInfo`, `fetchSyncedBlockReferencesInfo`
- `syncedBlockCreate`, `syncedBlockUpdate`, `syncedBlockDelete`
- `referenceSyncedBlockUpdate`

**Menu/toolbar events**: `menuAction` and `toolbarAction` types

- `syncedBlockCreate` (quickInsertMenu, blockMenu, primaryToolbar)
- `syncedBlockDelete`, `referenceSyncedBlockDelete` (syncedBlockToolbar)
- `syncedBlockUnsync`, `referenceSyncedBlockUnsync` (syncedBlockToolbar)
- `syncedBlockViewLocations`, `syncedBlockEditSource` (syncedBlockToolbar)

**Standard analytics events**: Track individual sync block operations

- `fetched/fetchSyncedBlock` — attributes: `resourceId`, `blockInstanceId`, `sourceProduct`
- `rendered/renderSyncedBlock` — attributes: `resourceId`, `sourceProduct`, state
  (`loaded`/`error`/`permissionDenied`/`missingSource`)
- `inserted/documentInserted` (page save) — attributes: `numberOfSyncedBlocks`,
  `numberOfReferencedSyncedBlocks`

Full catalogue:
[Synced Block Analytics Catalogue](https://hello.atlassian.net/wiki/spaces/egcuc/pages/6332253480)

---

## Key Jira Queries

```
# All synced block tickets
"Epic Link" in (EDITOR-1519, EDITOR-2441, EDITOR-1783, EDITOR-3936, EDITOR-3586, EDITOR-5010)

# Open bugs
... AND type = Bug AND status not in (Done, "Won't do") ORDER BY priority DESC

# M2 (Jira source creation)
"Epic Link" = EDITOR-5010 ORDER BY created DESC
```

---

## Key Confluence Pages

- **Architecture**: https://hello.atlassian.net/wiki/spaces/egcuc/pages/5505188521
- **Implementation view**: https://hello.atlassian.net/wiki/spaces/egcuc/pages/5997083214
- **Decisions record**: https://hello.atlassian.net/wiki/spaces/egcuc/pages/5882558842
- **Feature flags**: https://hello.atlassian.net/wiki/spaces/egcuc/pages/6390978659
- **Analytics catalogue**: https://hello.atlassian.net/wiki/spaces/egcuc/pages/6332253480
- **Debug errors HOW-TO**: https://hello.atlassian.net/wiki/spaces/egcuc/pages/6342760320

---

## Slack Channels

- **Engineering**: https://atlassian.enterprise.slack.com/archives/C09DZT1TBNW
- **Product & Design**: https://atlassian.enterprise.slack.com/archives/C091Y69RBGU
- **M2 / Jira**: https://atlassian.enterprise.slack.com/archives/C09RS7JCBED
