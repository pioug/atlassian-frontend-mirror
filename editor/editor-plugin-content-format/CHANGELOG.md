# @atlaskit/editor-plugin-content-format

## 6.0.0

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

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.1.0

### Minor Changes

- [`f1eebdf4ed96b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1eebdf4ed96b) -
  Autofix: add explicit package exports (barrel removal)

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- [`27529d2f5ddfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/27529d2f5ddfe) -
  Update README.md and 0-intro.tsx
- Updated dependencies

## 2.0.2

### Patch Changes

- [`82c0224977f47`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/82c0224977f47) -
  Update README.md and 0-intro.tsx
- Updated dependencies

## 2.0.1

### Patch Changes

- [`5892e575833a1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5892e575833a1) -
  Internal changes to remove unnecessary token fallbacks and imports from `@atlaskit/theme`
- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [`77341edf4fd78`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/77341edf4fd78) -
  [EDITOR-3786] Added a new plugin `@atlaskit/editor-plugin-content-format`, and made
  `@atlaskit/editor-plugin-code-block-advanced` have a dependancy on it. Removed the ResizeObserver
  from `@atlaskit/editor-plugin-code-block-advanced` and replaced it with a way to observe changes
  to the `contentMode`. Updated examples to update the state of the new plugin so that examples work
  with the new behaviour.
