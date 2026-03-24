# Synced Block Provider — Developer Agent Guide

> **Package**: `@atlaskit/editor-synced-block-provider` **Purpose**: Data layer for synced blocks —
> store managers, block service API client, ARI generation, permissions, media tokens. **Full
> Knowledge Base**:
> [Synced Blocks — Comprehensive Knowledge Base](https://hello.atlassian.net/wiki/spaces/egcuc/pages/6679548384)

---

## Quick Context

This package manages the lifecycle and state of synced blocks for both source and reference nodes.
It provides the data fetching, caching, subscription, and persistence layer used by the editor
plugin and the renderer across Confluence and Jira.

---

## Source Structure

```
src/
├── index.ts                          ← Barrel export
├── store-manager/
│   ├── syncBlockStoreManager.ts      ← Parent coordinator for source + reference managers
│   ├── referenceSyncBlockStoreManager.ts ← Reference block lifecycle, cache, subscriptions, flush
│   └── sourceSyncBlockStoreManager.ts    ← Source block create, update, delete, flush
├── clients/
│   ├── block-service/
│   │   ├── blockService.ts           ← Block service API client (fetch, batch, CRUD)
│   │   └── ari.ts                    ← Block ARI generation/parsing
│   ├── confluence/
│   │   ├── ari.ts                    ← Confluence page ARI generation/parsing
│   │   └── fetchMediaToken.ts        ← Media token fetching via GraphQL (MediaUploadTokenQuery)
│   └── jira/
│       └── ari.ts                    ← Jira work item ARI generation/parsing
├── providers/
│   └── block-service/
│       └── blockServiceAPI.ts        ← Provider factory and API helpers
└── types/                            ← Shared types
```

---

## Key Concepts

### Store Manager Hierarchy

```
SyncBlockStoreManager (parent coordinator)
├── SourceSyncBlockStoreManager
│   ├── create(content) → Block Service API → returns resourceId
│   ├── update(resourceId, content) → debounced 3s write
│   ├── delete(resourceId) → soft delete
│   └── flush() → persist all pending changes on page save
└── ReferenceSyncBlockStoreManager
    ├── fetchSyncBlocksData(nodes) → batch fetch with deduplication
    ├── subscribeToSyncBlock(resourceId, localId, callback) → AGG WebSocket
    ├── fetchSyncBlockSourceInfo(resourceId) → title, URL metadata
    ├── getFromCache(resourceId) → retrieve cached data
    ├── flush() → save reference changes to backend
    └── destroy() → cleanup subscriptions and batchers
```

### ARI Formats & Utilities

| Function                                                     | ARI Pattern               | Example                                                         |
| ------------------------------------------------------------ | ------------------------- | --------------------------------------------------------------- |
| `generateBlockAri({cloudId, parentId, product, resourceId})` | Source block ARI          | `ari:cloud:block::{cloudId}/confluence-page:{pageId}/{localId}` |
| `generateBlockAriFromReference({cloudId, resourceId})`       | Reference block ARI       | —                                                               |
| `getConfluencePageAri({pageId, cloudId, pageType})`          | Confluence page           | `ari:cloud:confluence::{cloudId}:page/{pageId}`                 |
| `getJiraWorkItemAri({cloudId, workItemId})`                  | Jira issue                | `ari:cloud:jira::{cloudId}:work-item/{issueId}`                 |
| `getJiraWorkItemIdFromAri(ari)`                              | Extract issue ID from ARI | —                                                               |

### Block Service API

The client in `clients/block-service/blockService.ts` communicates via GraphQL at
`/gateway/api/graphql`:

- **Fetch**: Single or batch block content retrieval
- **Create**: Register new source block with content
- **Update**: Push content changes (debounced 3s)
- **Delete**: Soft delete a source block
- **Source Info**: Fetch metadata (source page title, URL)
- **References Info**: Fetch list of locations referencing a block

### Media Token Fetching

`fetchMediaToken(contentId)` → GraphQL `MediaUploadTokenQuery` → returns
`{token, config: {clientId, fileStoreUrl}, collectionId}`

Used when synced blocks contain media (images, files) — the reference needs a valid token to render
media from the source page.

---

## Common Tasks

### Adding a new API method

1. Add the GraphQL query/mutation in `clients/block-service/blockService.ts`
2. Expose it through the appropriate store manager
3. Export from `src/index.ts` if needed by product integrations
4. Add tests in `editor-synced-block-provider-tests`

### Debugging data issues

1. Check `ReferenceSyncBlockStoreManager` cache state
2. Verify ARI format matches expected pattern for the product
3. Check Block Service API responses in network tab (look for `/gateway/api/graphql`)
4. Use analytics:
   [HOW-TO: Debug errors](https://hello.atlassian.net/wiki/spaces/egcuc/pages/6342760320)

### Adding support for a new product

1. Create ARI utilities in `clients/{product}/ari.ts`
2. Ensure `generateBlockAri` supports the new product type
3. Add media token fetching if the product has media content
4. Update store managers if the product has unique lifecycle requirements

---

## Related Packages

- **Plugin**: `platform/packages/editor/editor-plugin-synced-block/` — uses store managers
- **Renderer**: `platform/packages/editor/editor-synced-block-renderer/` — uses fetch provider
- **Confluence**: `confluence/next/packages/fabric-providers/src/SyncedBlockProvider.ts` — wraps
  this provider
- **Jira**: `jira/src/packages/issue/issue-view-synced-block-provider/` — wraps this provider with
  Relay
