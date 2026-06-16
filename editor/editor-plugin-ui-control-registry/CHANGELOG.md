# @atlaskit/editor-plugin-ui-control-registry

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

- [`ebab8f80bfc40`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ebab8f80bfc40) -
  Autofix: add explicit package exports (barrel removal)

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [`0f4a08b633f6e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0f4a08b633f6e) -
  Internal changes to remove unnecessary token fallbacks and imports from `@atlaskit/theme`
- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [`031e535207444`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/031e535207444) -
  Implements the surface renderer for the new Editor UI controls registry, providing a unified
  component for rendering editor menu trees.

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [`35fd4b17a4355`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/35fd4b17a4355) -
  EDITOR-5598 Create initial implementation of Editor UI Control Registry, implementing its API for
  adding elements to the registry and retrieving menu elements for a surface.

### Patch Changes

- Updated dependencies
