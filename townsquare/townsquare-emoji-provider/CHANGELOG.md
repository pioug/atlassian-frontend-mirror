# @atlaskit/townsquare-emoji-provider

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

## 1.0.10

### Patch Changes

- [`4e3a4fec88b62`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4e3a4fec88b62) -
  Enrol townsquare packages into the React Compiler with platform gating via
  isReactCompilerActivePlatform
- Updated dependencies

## 1.0.9

### Patch Changes

- [`42a9772eb71b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/42a9772eb71b8) -
  replace 'react-intl-next' alias with 'react-intl'

## 1.0.8

### Patch Changes

- Updated dependencies

## 1.0.7

### Patch Changes

- Updated dependencies

## 1.0.6

### Patch Changes

- Updated dependencies

## 1.0.5

### Patch Changes

- Updated dependencies

## 1.0.4

### Patch Changes

- [`1d6dc826f01b7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1d6dc826f01b7) -
  [ux] Correct fallbak space not used

## 1.0.3

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [`58a7e84e13fe2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/58a7e84e13fe2) -
  [ux] Add a component to render project emoji and include lock icon for private projects.
