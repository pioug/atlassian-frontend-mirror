# @atlaskit/media-card-relay

## 1.1.2

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- [`be8a71519cbc2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/be8a71519cbc2) -
  Add support for seeding media card file state from SSR media node metadata, behind the
  `platform_media_ssr_data_seed` feature gate.

  `@atlaskit/media-client` gains a Relay-free `mapSsrMediaItemToFileState`. Malformed, partial, or
  non-array input yields `undefined` rather than throwing.

  `@atlaskit/media-card` accepts an optional `ssrMediaItem` prop. When `ssrFileState` is absent and
  the gate is on, the card converts `ssrMediaItem` to FileState via `mapSsrMediaItemToFileState` and
  seeds `useFileState`. `ssrFileState` still wins when both are provided (Relay / media-card-relay).

  `@atlaskit/renderer` extends `MediaSSR` with `ssrMediaItems` — the host's SSR media payload,
  passed through untouched. The renderer finds the matching item by id and forwards it as
  `ssrMediaItem` to Card. Hosts need no knowledge of `FileState` or of media internals. The field is
  optional and additive: hosts that do not supply it, and media ids without an entry, keep the
  current fetch behaviour.

  `@atlaskit/media-card-relay`'s `MediaCardRelay` / `MediaInlineCardRelay` now call the shared
  `mapSsrMediaItemToFileState` mapper directly (the Relay fragment data is structurally assignable
  to `SsrMediaItem`, so no cast or wrapper is needed). Its public API and behaviour are unchanged.

  `@atlaskit/media-file-preview` now forwards an SSR-seeded pre-signed `previewCdnUrl` to the new
  optional `MediaClient.getImageUrlSync(id, params, seededCdnUrl)` argument when
  `platform_media_ssr_data_seed` is enabled and CDN delivery is in use. `@atlaskit/media-client`
  preserves the signed CDN asset URL and inserts supported image parameters before the `wm-ari` /
  `wm-v` watermark anchor, avoiding query-string rebuilding or re-encoding that can invalidate
  CloudFront signatures. Path-based routing, isolated cloud, GCP, and callers without a seeded URL
  retain the existing URL-generation behaviour.

- Updated dependencies

## 1.1.0

### Minor Changes

- [`d82e6f76528ab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d82e6f76528ab) -
  Add direct subpath package exports as part of the linking-platform, search, media, and
  design-system barrel-removal (de-barrel) migration.

  These packages now expose their individual modules via explicit `package.json` `exports` subpaths
  so that consumers can import directly from the leaf module (e.g. `@atlaskit/pkg/thing`) instead of
  the package barrel/index. This adds new public entry points without changing or removing any
  existing exports, so it is a backwards-compatible additive change.

  No runtime behaviour changes; this is an API-surface (entry-point) addition to support
  tree-shaking and to unblock removal of the barrel index files.

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [`1562c8fde9669`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1562c8fde9669) -
  Add @ts-expect-error suppressions for TypeScript errors surfaced after enabling
  typescriptExcludeUndefinedFromNullableUnion in the Relay compiler config.
- Updated dependencies

## 1.0.0

### Major Changes

- [`f2dc9097319f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2dc9097319f0) - ###
  Dropped support for _legacy_ Typescript 4 types. **Typescript 5 is now the new minimum**.

  Removes the `typesVersions` property and `dist/types-ts4.5` directory from the dist.

  Types are now exclusively via the `"types": "dist/types/index.d.ts"` property.

  ```diff
  - "typesVersions": {
  -    ">=4.5 <4.9": {
  -        "*": [
  -            "dist/types-ts4.5/*",
  -            "dist/types-ts4.5/index.d.ts"
  -        ]
  -    }
  - },
  ```

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [`a68f551856a81`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a68f551856a81) -
  Add MediaCardRelay and MediaInlineCardRelay components — Relay-native media card components that
  co-locate GraphQL fragments with their rendering components, enabling SSR-seeded file state via
  the mediaCardRelay_mediaItem fragment.

### Patch Changes

- Updated dependencies
