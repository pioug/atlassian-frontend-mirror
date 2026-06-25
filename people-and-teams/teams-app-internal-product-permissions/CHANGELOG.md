# @atlaskit/teams-app-internal-product-permissions

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

## 1.4.0

### Minor Changes

- [`fb2784c333519`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fb2784c333519) -
  Autofix: add explicit package exports (barrel removal)

## 1.3.1

### Patch Changes

- [`7fb5bfbafb83e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7fb5bfbafb83e) -
  Enrol people-and-teams packages into the React Compiler with platform gating via
  isReactCompilerActivePlatform

## 1.3.0

### Minor Changes

- [`2fed5ef28cecf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2fed5ef28cecf) -
  Remove dead code from teams-app-internal-product-permissions package

## 1.2.9

### Patch Changes

- Updated dependencies

## 1.2.8

### Patch Changes

- Updated dependencies

## 1.2.7

### Patch Changes

- Updated dependencies

## 1.2.6

### Patch Changes

- Updated dependencies

## 1.2.5

### Patch Changes

- Updated dependencies

## 1.2.4

### Patch Changes

- Updated dependencies

## 1.2.3

### Patch Changes

- Updated dependencies

## 1.2.2

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- [#198711](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/198711)
  [`13c959a691047`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/13c959a691047) -
  Wait for all the responses to check product permissions

## 1.2.0

### Minor Changes

- [#199487](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/199487)
  [`3ba9d6d9213a6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3ba9d6d9213a6) -
  Fix create space permission for confluence

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [`3c3c951f9cd92`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3c3c951f9cd92) -
  [ux] Add create container feature to team profile

## 1.0.0

### Major Changes

- [#186163](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/186163)
  [`0381da31ec5b4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0381da31ec5b4) -
  New package to check user's product permissions
