# @atlaskit/editor-ui-control-model

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

## 1.2.0

### Minor Changes

- [`7b2ab46c79d94`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7b2ab46c79d94) -
  Autofix: add explicit package exports (barrel removal)

## 1.1.1

### Patch Changes

- [`9e45c7ac76c9a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9e45c7ac76c9a) -
  Enrol editor core packages into the React Compiler with platform gating via
  isReactCompilerActivePlatform

## 1.1.0

### Minor Changes

- [`031e535207444`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/031e535207444) -
  Implements the surface renderer for the new Editor UI controls registry, providing a unified
  component for rendering editor menu trees.

## 1.0.0

### Major Changes

- [`35fd4b17a4355`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/35fd4b17a4355) -
  EDITOR-5598 Create initial implementation of Editor UI Control Registry, implementing its API for
  adding elements to the registry and retrieving menu elements for a surface.
