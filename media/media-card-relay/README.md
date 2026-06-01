# @atlaskit/media-card-relay

A Relay-aware wrapper around `@atlaskit/media-card`'s `Card` component for Media SSR metadata.

## Overview

This package implements the **fragment colocation architecture** for media cards (Phase 5 of BMPT-7771). Products can spread a Media-owned GraphQL fragment and pass a fragment ref to the card, without knowing media internals.

## Prerequisites

> ⚠️ **AGG `MediaItem` hydration must be enabled** (Phases 1–4 of BMPT-7771) for this package to deliver SSR benefits. The card renders correctly without it, but SSR metadata will not be populated from the fragment.

This package requires:
- `react-relay` (as a peer dependency — provided by your host app)
- The `MediaItem` type registered in AGG with Nadel hydration enabled

## Usage

### 1. Spread the fragment in your query

```graphql
# In your product query:
query MyAttachmentQuery($attachmentId: ID!) {
  jiraPlatformAttachment(id: $attachmentId) {
    mediaItem {
      ...cardRelay_mediaItem  # spread the Media-owned fragment
    }
  }
}
```

### 2. Pass the fragment ref to MediaCardRelay

```tsx
import { MediaCardRelay } from '@atlaskit/media-card-relay';

function MyAttachment({ attachment }) {
  return (
    <MediaCardRelay
      identifier={{ id: attachment.fileId, mediaItemType: 'file', collectionName: '' }}
      mediaItemRef={attachment.mediaItem}  // fragment ref from the query
      mediaClientConfig={mediaClientConfig}
    />
  );
}
```

## Production usage (post-AGG schema)

> **Note:** This pattern requires the AGG `MediaItem` schema to be registered (BMPT-7771 Phases 1–4). Until then, use the [mock-based examples](./examples/) for development and testing.

Once the schema is available, spread `...cardRelay_mediaItem` in your product query and pass the ref to `<MediaCardRelay>`:

```graphql
query MyAttachmentQuery($id: ID!) {
  jira_attachment(id: $id) {
    mediaItem {
      ...cardRelay_mediaItem
    }
  }
}
```

```tsx
import { MediaCardRelay } from '@atlaskit/media-card-relay';
import { useFragment, useLazyLoadQuery, graphql } from 'react-relay';

function AttachmentCard({ id }: { id: string }) {
  const data = useLazyLoadQuery(graphql`
    query AttachmentCardQuery($id: ID!) {
      jira_attachment(id: $id) {
        mediaItem {
          ...cardRelay_mediaItem
        }
      }
    }
  `, { id });

  return (
    <MediaCardRelay
      mediaItemRef={data?.jira_attachment?.mediaItem ?? null}
      identifier={{ mediaItemType: 'file', id, collectionName: 'my-collection' }}
      dimensions={{ width: 300, height: 200 }}
    />
  );
}
```

## Examples

Runnable examples (using `relay-test-utils` mock refs until the AGG schema lands):

| File | Demonstrates |
|------|--------------|
| `examples/00-basic.tsx` | Basic image card via mock fragment ref |
| `examples/01-gate-on-vs-off.tsx` | Side-by-side `platform_media_ssr_data_seed` gate ON vs OFF |
| `examples/02-loading-and-error-states.tsx` | Processing, failed, and no-ref (client-fetch) fallback states |
| `examples/03-different-file-types.tsx` | Image, video, PDF, audio, unknown file type matrix |
| `examples/04-card-actions.tsx` | `CardProps` extras (actions, onClick, selected) flow-through |

## API

### `<MediaCardRelay>`

Accepts all props from `@atlaskit/media-card`'s `Card` except `ssrFileState` (which is derived from the fragment), plus:

| Prop | Type | Description |
|------|------|-------------|
| `mediaItemRef` | `cardRelay_mediaItem$key \| null` | A Relay fragment ref obtained by spreading `...cardRelay_mediaItem` on a `MediaItem` in your query. |

## Phase 5b: Statsig-gated SSR Behavior

Phase 5b introduces a feature gate (`platform_media_ssr_data_seed`) to control how SSR data is passed to the Card:

### Gate Behavior

| State | Behavior | Notes |
|-------|----------|-------|
| **ON** (`platform_media_ssr_data_seed=true`) | `<Card>` receives full `ssrFileState` from fragment | Rich SSR metadata (`cdnUrl`, `artifacts`, `representations`, `processingStatus`, etc.) is passed directly. This is the target state for all consumers. |
| **OFF** (`platform_media_ssr_data_seed=false`) | `<Card>` receives no SSR seed (gate evaluated inside `Card`/`FileCard`) | The gate is off; SSR data is not forwarded. Used for gradual rollout. |

### Adoption Guide

Products consuming `<MediaCardRelay>` should:

1. **Spread the fragment** in your query (see [Usage](#usage) section above)
2. **Provide `mediaItemRef`** to `<MediaCardRelay mediaItemRef={...} />`
3. **Monitor the gate state** — once `platform_media_ssr_data_seed` is enabled for your tenant, your card will automatically use the rich SSR data
4. **No code changes required** — the component handles gate transitions transparently

**Note:** `@atlaskit/media-card`'s `Card` component accepts `ssrFileState` in Phase 5b. This wrapper derives it from the fragment and forwards it, with gate decisions evaluated inside `Card`/`FileCard`.

## Team

Owned by **Media Experience** (Media Platform team).
