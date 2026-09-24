# @atlaskit/tile

## 5.0.0

### Major Changes

- [`0c7c7be927bde`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0c7c7be927bde) -
  Remove deprecated Volt re-export shims from public package entry points. Consumers should import
  from the replacement subpaths or implementation entry points instead.

### Patch Changes

- Updated dependencies

## 4.1.3

### Patch Changes

- Updated dependencies

## 4.1.2

### Patch Changes

- Updated dependencies

## 4.1.1

### Patch Changes

- Updated dependencies

## 4.1.0

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

## 4.0.1

### Patch Changes

- [`95d4618be32ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/95d4618be32ae) -
  Experimental React 19 peer dependency support. This patch widens the peer range; CI coverage is
  partial.
- Updated dependencies

## 4.0.0

### Major Changes

- [`48e7d03469b80`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/48e7d03469b80) -
  Apply Volt entry-point and barrel-removal standards across these design-system packages. Public
  `exports` now resolve **directly** to `./src/*` implementations instead of intermediate
  `./src/entry-points/*` re-exports, root barrels and remaining entry-point shims are marked
  deprecated in favour of per-export subpaths, and a few new subpaths are added
  (`@atlaskit/badge/badge-new`, `@atlaskit/tile/tile-skeleton`, `@atlaskit/popper/main`,
  `@atlaskit/section-message/message`, `@atlaskit/section-message/message-action`).

  ### Why this is breaking

  Subpaths and the package root can now resolve to the **same module instance**. Consumers that
  deep-imported `entry-points/*`, or `jest.mock()`'d a specific subpath may need updates.
  `@atlaskit/image`'s root export now points at `./src/ui/image/index.tsx`.
  `@atlaskit/checkbox/checkbox` now exports a named `Checkbox` from the implementation module
  (default export retained for backwards compatibility).

  ### Migration

  Prefer published subpaths over the package root:

  ```ts
  import { Checkbox } from '@atlaskit/checkbox/checkbox';
  import TextField from '@atlaskit/textfield/text-field';
  import Popup from '@atlaskit/popup/popup';
  import SectionMessage from '@atlaskit/section-message/message';
  import EmptyState from '@atlaskit/empty-state/empty-state';
  ```

  If you imported through internal entry-point modules, switch to the public subpath:

  ```diff
  -import Checkbox from '@atlaskit/checkbox/entry-points/checkbox';
  +import { Checkbox } from '@atlaskit/checkbox/checkbox';
  ```

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [`6eda34cb9c42f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6eda34cb9c42f) -
  Apply Volt entry-point and multi-export standards via `volt-migrate-package`. This is a **major**
  change to `@atlaskit/tile`: the package `exports` map has been restructured so every public
  subpath now resolves **directly** to its `./src/*` implementation instead of going through an
  intermediate `./src/entry-points/*` re-export. No public subpaths were removed.

  ### Why this is breaking

  Because each subpath now points straight at its implementation module, a subpath and the package
  root can resolve to the **same module instance**. Consumers that deep-import the internal
  `entry-points/*` files, or that `jest.mock()` a specific subpath, may observe changed
  resolution/behaviour and need updating.

  ### Migration — public imports are unchanged

  Importing the published subpaths (or the package root) continues to work as before:

  ```ts
  // Still valid — no change required
  import Tile from '@atlaskit/tile/tile';
  ```

  If you were reaching into the internal entry-point modules, switch to the public subpath:

  ```diff
  -import Tile from '@atlaskit/tile/entry-points/tile';
  +import Tile from '@atlaskit/tile/tile';
  ```

  ### Before / after `exports` map

  ```diff
    "exports": {
      ".": "./src/index.tsx",
      "./skeleton": "./src/entry-points/skeleton.tsx",
  -   "./tile": "./src/entry-points/tile.tsx",
  +   "./tile": "./src/tile.tsx",
  -   "./types": "./src/entry-points/types.tsx",
  +   "./types": "./src/types.tsx",
    }
  ```

## 2.3.1

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [`50738f6a4a2fb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/50738f6a4a2fb) -
  Improved image scaling and validation for assets passed into tiles:
  - Non-inset tiles now apply `object-fit: cover` to `img` elements, ensuring raster images are
    cropped to a square rather than distorted when the image is not square.
  - Added dev-mode console warnings when a raster image (PNG/JPG/GIF/WebP/AVIF) passed into a tile
    is not square or is not retina-compatible (i.e. the image's natural dimensions are less than 2x
    the rendered tile size). These warnings only appear in development builds and are silent in
    production.

## 2.2.0

### Minor Changes

- [`2f56c78f969b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2f56c78f969b8) -
  Update i18n NPM package versions for teamwork-graph (Group 16)

### Patch Changes

- Updated dependencies

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [`cd097a2111788`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cd097a2111788) -
  Republish packages depending on `@atlaskit/react-compiler-gating` so their published dependency
  reference is updated to the renamed `@atlaskit/react-compiler-gating` scope.

  The earlier rename of `@atlassian/react-compiler-gating` to `@atlaskit/react-compiler-gating` only
  bumped the renamed package itself, so dependent packages were never republished and their
  published versions still referenced the old `@atlassian/react-compiler-gating` name, which is not
  available in the public npm registry. This minor bump republishes all affected packages with the
  corrected dependency.

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [`ee28cf33718b0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee28cf33718b0) -
  Add @atlaskit/react-compiler-gating as a runtime dependency to enable React Compiler platform
  gating.
- Updated dependencies

## 2.0.0

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

## 1.1.0

### Minor Changes

- [`31b1ede297136`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/31b1ede297136) -
  Autofix: add explicit package exports (barrel removal)

## 1.0.8

### Patch Changes

- Updated dependencies

## 1.0.7

### Patch Changes

- Updated dependencies

## 1.0.6

### Patch Changes

- [`02483200273ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/02483200273ec) -
  Enrol all Design System UI packages into the React Compiler with platform gating via
  isReactCompilerActivePlatform.
- Updated dependencies

## 1.0.5

### Patch Changes

- Updated dependencies

## 1.0.4

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [`14886457b3a3a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/14886457b3a3a) -
  Suppress i18n violations

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [`951d5982db119`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/951d5982db119) -
  Released for general availability

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- [`e1c9823b0b420`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e1c9823b0b420) -
  Fixed issue with sizing of certain `@atlaskit/emoji` assets within tiles.
- Updated dependencies

## 0.2.0

### Minor Changes

- [`f20393c20ed30`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f20393c20ed30) -
  Added new Tile Skeleton to act as a placeholder while content loads.

## 0.1.4

### Patch Changes

- [`99f4f441fac8c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/99f4f441fac8c) -
  Removed unused dependencies.

## 0.1.3

### Patch Changes

- [`965e35f10a8f1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/965e35f10a8f1) -
  Implemented new design token `radius.tile` for tile border radius.

## 0.1.2

### Patch Changes

- [`9e77915865d6e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9e77915865d6e) -
  - Corrected border width
  - Simplified labelling method

## 0.1.1

### Patch Changes

- [`f6b3f669a74bf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f6b3f669a74bf) -
  - Prevented tile from resizing in flex containers, to maintain correct sizing.
  - Updated dependencies
