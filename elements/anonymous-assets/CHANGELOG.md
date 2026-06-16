# @atlassian/anonymous-assets

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

## 1.1.1

### Patch Changes

- [`72290778b16ca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/72290778b16ca) -
  Enrol mixed platform packages into the React Compiler with platform gating via
  isReactCompilerActivePlatform
- Updated dependencies

## 1.1.0

### Minor Changes

- [`302503d41b736`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/302503d41b736) -
  Autofix: add explicit package exports (barrel removal)

## 1.0.0

### Major Changes

- [`deb3d6a6498e8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/deb3d6a6498e8) -
  Removed `react-intl-next` alias and replaced all usages with `react-intl` directly.

  What changed: The `react-intl-next` npm alias (which resolved to `react-intl@^5`) has been
  removed. All imports now reference `react-intl` directly, and `peerDependencies` have been updated
  to `"^5.25.1 || ^6.0.0 || ^7.0.0"`.

  How consumer should update their code: Ensure `react-intl` is installed at a version satisfying
  `^5.25.1 || ^6.0.0 || ^7.0.0`. If your application was using `react-intl-next` as an npm alias, it
  can be safely removed. Replace any remaining `react-intl-next` imports with `react-intl`.

## 0.0.20

### Patch Changes

- Updated dependencies

## 0.0.19

### Patch Changes

- Updated dependencies

## 0.0.18

### Patch Changes

- Updated dependencies

## 0.0.17

### Patch Changes

- Updated dependencies

## 0.0.16

### Patch Changes

- Updated dependencies

## 0.0.15

### Patch Changes

- Updated dependencies

## 0.0.14

### Patch Changes

- Updated dependencies

## 0.0.13

### Patch Changes

- Updated dependencies

## 0.0.12

### Patch Changes

- Updated dependencies

## 0.0.11

### Patch Changes

- Updated dependencies

## 0.0.10

### Patch Changes

- Updated dependencies

## 0.0.9

### Patch Changes

- Updated dependencies

## 0.0.8

### Patch Changes

- [`411addc8f1770`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/411addc8f1770) -
  Migrate elements, search, smart-experiences, web-platform, forge, jql and bitbucket pkgs to use
  i18n NPM pkgs from Traduki
- Updated dependencies

## 0.0.7

### Patch Changes

- Updated dependencies

## 0.0.6

### Patch Changes

- Updated dependencies

## 0.0.5

### Patch Changes

- [`0fdcb6f2f96fd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0fdcb6f2f96fd) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 0.0.4

### Patch Changes

- [`cc97e427ef56c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cc97e427ef56c) -
  Update package examples

## 0.0.3

### Patch Changes

- Updated dependencies

## 0.0.2

### Patch Changes

- Updated dependencies
