# @atlaskit/feature-gate-fetcher

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

## 0.3.0

### Minor Changes

- [`ebab8f80bfc40`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ebab8f80bfc40) -
  Autofix: add explicit package exports (barrel removal)

### Patch Changes

- Updated dependencies

## 0.2.16

### Patch Changes

- Updated dependencies

## 0.2.15

### Patch Changes

- Updated dependencies

## 0.2.14

### Patch Changes

- Updated dependencies

## 0.2.13

### Patch Changes

- Updated dependencies

## 0.2.12

### Patch Changes

- Updated dependencies

## 0.2.11

### Patch Changes

- Updated dependencies

## 0.2.10

### Patch Changes

- Updated dependencies

## 0.2.9

### Patch Changes

- Updated dependencies

## 0.2.8

### Patch Changes

- Updated dependencies

## 0.2.7

### Patch Changes

- Updated dependencies

## 0.2.6

### Patch Changes

- Updated dependencies

## 0.2.5

### Patch Changes

- Updated dependencies

## 0.2.4

### Patch Changes

- Updated dependencies

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#157451](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157451)
  [`3733e5e12d1dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3733e5e12d1dc) -
  Bump statsig-js-lite
- [#157451](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157451)
  [`3733e5e12d1dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3733e5e12d1dc) -
  Bump statsig-js-lite
- [#157451](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157451)
  [`3733e5e12d1dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3733e5e12d1dc) -
  Update statsig-js-lite

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [#158460](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/158460)
  [`bcb59292573a3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bcb59292573a3) -
  Set a sensible default for `perimeter` based on the hostname, rather than always defaulting to
  commercial

### Patch Changes

- Updated dependencies

## 0.0.5

### Patch Changes

- Updated dependencies

## 0.0.4

### Patch Changes

- Updated dependencies

## 0.0.3

### Patch Changes

- [#151557](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151557)
  [`0935b95608ca3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0935b95608ca3) -
  Remove temp types instead depending on js client
- Updated dependencies

## 0.0.2

### Patch Changes

- [#146698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/146698)
  [`5e8dade0bdb2a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e8dade0bdb2a) -
  Update Response error type thrown and provider temp type

## 0.0.1

### Patch Changes

- [#143752](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143752)
  [`4ff5c18e2ad36`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4ff5c18e2ad36) -
  Created package
