# @atlaskit/tile

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
