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
├── index.ts                              # Barrel exports
├── useSyncedBlockNodeComponent.tsx        # Core hooks for node management and memoization
├── ui/
│   ├── renderSyncedBlockContent.tsx       # Shared render branching logic (loading → error → success)
│   └── SyncedBlockNodeComponentRenderer.tsx # Renderer component with store manager + media SSR
└── types.ts                              # SyncedBlockRendererOptions type
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
