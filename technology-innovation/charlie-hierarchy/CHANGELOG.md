# @atlaskit/charlie-hierarchy

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

## 0.2.0

### Minor Changes

- [`437eba4b32d0d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/437eba4b32d0d) -
  Autofix: add explicit package exports (barrel removal)

## 0.1.18

### Patch Changes

- [`42a9772eb71b8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/42a9772eb71b8) -
  replace 'react-intl-next' alias with 'react-intl'

## 0.1.17

### Patch Changes

- Updated dependencies

## 0.1.16

### Patch Changes

- Updated dependencies

## 0.1.15

### Patch Changes

- Updated dependencies

## 0.1.14

### Patch Changes

- Updated dependencies

## 0.1.13

### Patch Changes

- Updated dependencies

## 0.1.12

### Patch Changes

- Updated dependencies

## 0.1.11

### Patch Changes

- Updated dependencies

## 0.1.10

### Patch Changes

- Updated dependencies

## 0.1.9

### Patch Changes

- Updated dependencies

## 0.1.8

### Patch Changes

- Updated dependencies

## 0.1.7

### Patch Changes

- Updated dependencies

## 0.1.6

### Patch Changes

- Updated dependencies

## 0.1.5

### Patch Changes

- Updated dependencies

## 0.1.4

### Patch Changes

- Updated dependencies

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- [`806cfe1c4e6b7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/806cfe1c4e6b7) -
  Internal changes to how border radius is applied.

## 0.1.1

### Patch Changes

- [`d20026853a75b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d20026853a75b) -
  [ux] Support basic stacking functionality

## 0.1.0

### Minor Changes

- [`6e47d2a4d95a7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6e47d2a4d95a7) -
  Added export

## 0.0.7

### Patch Changes

- [#198800](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/198800)
  [`060485e2f0561`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/060485e2f0561) -
  Added use-hierarchy hook for interacting with the hierarchy data

## 0.0.6

### Patch Changes

- Updated dependencies

## 0.0.5

### Patch Changes

- [#180200](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/180200)
  [`762b4a66fd9ab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/762b4a66fd9ab) -
  Fixed styling/UI issues with our current charlie-hierarchy page

## 0.0.4

### Patch Changes

- Updated dependencies

## 0.0.3

### Patch Changes

- Updated dependencies

## 0.0.2

### Patch Changes

- Updated dependencies
