# Synced Block Renderer — Developer Agent Guide

> **Package**: `@atlaskit/editor-synced-block-renderer`
>
> **For workflow guidance, debugging, and cross-package task guides, load the `synced-blocks`
> skill:**
> `get_skill(skill_name_or_path="platform/packages/editor/.rovodev/skills/synced-blocks/SKILL.md")`

---

## Quick Context

This package renders reference `syncBlock` nodes in view mode (Confluence page view, Jira issue
view). It fetches content from the Block Service, handles loading/error/offline states, and supports
SSR for performance-critical page loads.

---

## Source Structure

```
src/
├── index.ts                                # Barrel exports
├── useSyncedBlockNodeComponent.tsx         # Core hooks for node management and memoization
├── getSyncedBlockRenderer.tsx              # Factory for editor-mode synced block renderer
├── types.ts                                # SyncedBlockRendererOptions type
└── ui/
    ├── __generated__/                      # Generated GraphQL types
    ├── assets/                             # Static assets (icons, illustrations)
    ├── renderSyncedBlockContent.tsx        # Shared render branching logic (loading → error → success)
    ├── SyncedBlockNodeComponentRenderer.tsx # Renderer component with store manager + media SSR
    ├── SyncedBlockRenderer.tsx             # View-mode reference block renderer
    ├── AKRendererWrapper.tsx               # Wraps content in AKRenderer with required providers
    ├── SyncedBlockLoadingState.tsx         # Loading skeleton UI
    ├── SyncedBlockErrorComponent.tsx       # Generic error component
    ├── SyncedBlockErrorStateCard.tsx       # Error state card scaffold
    ├── SyncedBlockGenericError.tsx         # Generic error variant
    ├── SyncedBlockLoadError.tsx            # Load failure variant
    ├── SyncedBlockNotFoundError.tsx        # Block not found variant
    ├── SyncedBlockEntityNotFoundError.tsx  # Source entity (page/issue) not found variant
    ├── SyncedBlockOfflineError.tsx         # Offline error variant
    ├── SyncedBlockPermissionDenied.tsx     # 403 / no-access variant
    └── SyncedBlockUnpublishedError.tsx     # Source not yet published variant
```

---

## Key Exports

```typescript
getSyncBlockNodesFromDoc; // Extract SyncBlockNode[] from a DocNode
useMemoizedSyncedBlockNodeComponent; // Returns memoized component for rendering reference blocks
type GetSyncedBlockNodeComponentProps; // Props for the memoized component
getSyncedBlockRenderer; // Factory for editor-mode synced block renderer
renderSyncedBlockContent; // Shared render branching logic
type RenderSyncedBlockContentParams;
type SyncedBlockNodeProps; // From SyncedBlockNodeComponentRenderer
```

---

## Render Decision Tree (`renderSyncedBlockContent`)

1. **Offline + not SSR** → offline error component
2. **Loading + no instance** → loading skeleton
3. **SSR + instance error** → loading state (deferred to client-side hydration)
4. **Missing resourceId / error / no data / deleted** → error component
5. **Unpublished** → unpublished error component
6. **Success** → wraps content in `AKRendererWrapper` and renders

### SSR Behaviour

- Skips offline error in SSR; returns loading if SSR + error (deferred)
- Sets media SSR mode to `'server'` during SSR, `'client'` after hydration
- SSR errors tracked via `handleSSRErrorsAnalytics` in deferred `useEffect`
- Uses `isSSR()` from `@atlaskit/editor-common/core-utils`

---

## Related Packages

- **Plugin**: `platform/packages/editor/editor-plugin-synced-block/`
- **Provider**: `platform/packages/editor/editor-synced-block-provider/`
- **Confluence renderer**: `confluence/next/packages/adf-renderer/`
- **Jira**: `jira/src/packages/issue/issue-view-synced-block-provider/`
