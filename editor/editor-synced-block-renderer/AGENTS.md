# Synced Block Renderer — Developer Agent Guide

> **Package**: `@atlaskit/editor-synced-block-renderer` **Purpose**: View-mode rendering of
> reference synced blocks using nested renderer with SSR support. **Full Knowledge Base**:
> [Synced Blocks — Comprehensive Knowledge Base](https://hello.atlassian.net/wiki/spaces/egcuc/pages/6679548384)

---

## Quick Context

This package renders reference `syncBlock` nodes in view mode (Confluence page view, Jira issue
view). It fetches content from the Block Service, handles loading/error/offline states, and supports
SSR for performance-critical page loads.

---

## Source Structure

```
src/
├── index.ts                              ← Barrel exports
├── useSyncedBlockNodeComponent.tsx        ← Core hooks for node management and memoization
├── ui/
│   ├── renderSyncedBlockContent.tsx       ← Shared render branching logic (loading → error → success)
│   └── SyncedBlockNodeComponentRenderer.tsx ← Renderer component with store manager + media SSR
└── types.ts                              ← SyncedBlockRendererOptions type
```

---

## Key Exports

```typescript
getSyncBlockNodesFromDoc; // Extract SyncBlockNode[] from a DocNode
useMemoizedSyncedBlockNodeComponent; // Returns memoized component for rendering reference blocks
getSyncedBlockRenderer; // Factory for editor-mode synced block renderer
renderSyncedBlockContent; // Shared render branching logic
```

---

## How It Works

### `getSyncBlockNodesFromDoc(doc: DocNode)`

Extracts all `syncBlock` nodes from a document's content array. Maps through `doc.content`, converts
each via `convertSyncBlockJSONNodeToSyncBlockNode`, filters out undefined entries. Returns `[]` if
content is empty.

### `renderSyncedBlockContent(params)`

Central rendering decision tree (checked sequentially):

1. **Offline + not SSR** → offline error component
2. **Loading + no instance** → loading skeleton
3. **SSR + instance error** → loading state (deferred to client-side hydration)
4. **Missing resourceId / error / no data / deleted** → error component
5. **Unpublished** → unpublished error component
6. **Success** → wraps content in `AKRendererWrapper` and renders

### `useMemoizedSyncedBlockNodeComponent(options)`

1. Creates memoized `SyncBlockStoreManager` via `useMemoizedSyncBlockStoreManager`
2. First `useEffect`: processes prefetched data via `getPrefetchedData()`
3. Second `useEffect`: triggers initial fetch of synced block data
4. Returns memoized callback wrapping `SyncedBlockNodeComponentRenderer` in `ErrorBoundary` +
   `SyncBlockActionsProvider`

### SSR Behaviour

- `renderSyncedBlockContent`: Skips offline error in SSR; returns loading if SSR + error (deferred)
- `SyncedBlockNodeComponentRenderer`: Sets media SSR mode to `'server'` during SSR, `'client'` after
  hydration
- SSR errors tracked via `handleSSRErrorsAnalytics` in deferred `useEffect`
- Uses `isSSR()` from `@atlaskit/editor-common/core-utils`

---

## Common Tasks

### Fixing a rendering bug

1. Identify if it's a loading state, error state, or content rendering issue
2. Check `renderSyncedBlockContent` branching logic — which path is being hit?
3. For content issues, check if the ADF node type is supported:
   [Supported nodes](https://hello.atlassian.net/wiki/spaces/egcuc/pages/5926568979)
4. For SSR issues, check if `isSSR()` detection and hydration timing are correct

### Adding a new error state

1. Add condition check in `renderSyncedBlockContent.tsx`
2. Create error component UI
3. Add analytics event for the new error state
4. Ensure SSR path handles it gracefully (deferred to client if needed)

### Performance considerations

- Reference blocks can regress VC90 due to content shift (CLS)
- SSR preloading mitigates this — ensure `getPrefetchedData()` is populated
- Use `SyncBlockInMemorySessionCache` for view→edit transitions
- Monitor: [VC90 investigation](https://hello.atlassian.net/wiki/spaces/egcuc/pages/6528071518)

---

## Related Packages

- **Plugin**: `platform/packages/editor/editor-plugin-synced-block/` — uses `getSyncedBlockRenderer`
- **Provider**: `platform/packages/editor/editor-synced-block-provider/` — provides store manager
  and fetch
- **Confluence renderer**: `confluence/next/packages/adf-renderer/` — integrates this for page view
- **Jira**: `jira/src/packages/issue/issue-view-synced-block-provider/` — uses
  `useMemoizedSyncedBlockNodeComponent`
