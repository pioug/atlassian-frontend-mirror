# @atlaskit/editor-ui-control-model

## 2.2.0

### Minor Changes

- [`779a0020403de`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/779a0020403de) -
  Add async hidden support to paste menu registered components, including timeout/error handling and
  single Smart Link URL context from the paste options toolbar. Use Smart Card access checks to hide
  Smart Link Display as options and AI Add Summary / Ask Rovo paste actions for inaccessible
  single-link pastes in Confluence.

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
