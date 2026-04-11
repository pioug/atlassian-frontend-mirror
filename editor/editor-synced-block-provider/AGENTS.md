# Synced Block Provider — Developer Agent Guide

> **Package**: `@atlaskit/editor-synced-block-provider`
>
> **For workflow guidance, debugging, and cross-package task guides, load the `synced-blocks`
> skill:**
> `get_skill(skill_name_or_path="platform/packages/editor/.rovodev/skills/synced-blocks/SKILL.md")`

---

## Quick Context

This package manages the lifecycle and state of synced blocks for both source and reference nodes.
It provides the data fetching, caching, subscription, and persistence layer used by the editor
plugin and the renderer across Confluence and Jira.

---

## Source Structure

```
src/
├── index.ts                          # Barrel export
├── store-manager/
│   ├── syncBlockStoreManager.ts      # Parent coordinator for source + reference managers
│   ├── referenceSyncBlockStoreManager.ts # Reference block lifecycle, cache, subscriptions, flush
│   └── sourceSyncBlockStoreManager.ts    # Source block create, update, delete, flush
├── clients/
│   ├── block-service/
│   │   ├── blockService.ts           # Block service API client (fetch, batch, CRUD)
│   │   └── ari.ts                    # Block ARI generation/parsing
│   ├── confluence/
│   │   ├── ari.ts                    # Confluence page ARI generation/parsing
│   │   └── fetchMediaToken.ts        # Media token fetching via GraphQL (MediaUploadTokenQuery)
│   └── jira/
│       └── ari.ts                    # Jira work item ARI generation/parsing
├── providers/
│   └── block-service/
│       └── blockServiceAPI.ts        # Provider factory and API helpers
└── types/                            # Shared types
```

---

## Key Exports and Types

### Store Manager Hierarchy

```
SyncBlockStoreManager (parent coordinator)
├── SourceSyncBlockStoreManager
│   ├── create(content) → Block Service API → returns resourceId
│   ├── updateSyncBlockData(node) → marks isDirty, caches content
│   ├── flush() → persist all dirty changes to backend
│   ├── hasUnsavedChanges() → checks isDirty + hasReceivedContentChange
│   └── delete(resourceId) → soft delete with confirmation
└── ReferenceSyncBlockStoreManager
    ├── fetchSyncBlocksData(nodes) → batch fetch with deduplication
    ├── subscribeToSyncBlock(resourceId, callback) → AGG WebSocket
    ├── fetchSyncBlockSourceInfo(resourceId) → title, URL metadata
    └── destroy() → cleanup subscriptions and batchers
```

### ARI Utilities

| Function                                                     | Purpose                   |
| ------------------------------------------------------------ | ------------------------- |
| `generateBlockAri({cloudId, parentId, product, resourceId})` | Generate source block ARI |
| `generateBlockAriFromReference({cloudId, resourceId})`       | Generate reference ARI    |
| `getConfluencePageAri({pageId, cloudId, pageType})`          | Confluence page ARI       |
| `getJiraWorkItemAri({cloudId, workItemId})`                  | Jira issue ARI            |

### Block Service API

The client in `clients/block-service/blockService.ts` communicates via GraphQL at
`/gateway/api/graphql`: Fetch, Create, Update (debounced 3s), Delete, Source Info, References Info.

### Media Token Fetching

`fetchMediaToken(contentId)` → GraphQL `MediaUploadTokenQuery` → returns
`{token, config: {clientId, fileStoreUrl}, collectionId}`

---

## Related Packages

- **Plugin**: `platform/packages/editor/editor-plugin-synced-block/`
- **Renderer**: `platform/packages/editor/editor-synced-block-renderer/`
- **Confluence**: `confluence/next/packages/fabric-providers/src/SyncedBlockProvider.ts`
- **Jira**: `jira/src/packages/issue/issue-view-synced-block-provider/`
