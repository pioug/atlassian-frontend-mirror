# @atlaskit/date-label

## 1.2.3

### Patch Changes

- Updated dependencies

## 1.2.2

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- [`bcfe498b206d5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bcfe498b206d5) -
  Adopt button and list-item motion tokens behind the use-pressable-motion rollout.

## 1.2.0

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

## 1.1.0

### Minor Changes

- [`b6b1f2f22c227`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b6b1f2f22c227) -
  Add button hover and pressed motion transitions to DateLabelDropdownTrigger, and fade between its
  content and loading spinner, behind the `platform-dst-motion-uplift-labels` feature gate.

## 1.0.4

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- [`1233133cba8f7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1233133cba8f7) -
  Updated the `spacious` neutral-appearance `DateLabel` and `DateLabelDropdownTrigger` colors to
  match a `subtle` Button: `color.border` border, `color.text.subtle` text, and `currentColor` icon.

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

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
