# @atlaskit/container-picker

## 1.1.11

### Patch Changes

- [`b85e7ce12cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b85e7ce12cd) - Internal upgrade of memoize-one to 6.0.0

## 1.1.10

### Patch Changes

- [`ccda387eede`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ccda387eede) - smart-user-picker extracted out from user-picker to smart-user-picker package. smart-user-picker in user-picker is now deprecated but still backwards compatible. Please use @atlassian/smart-user-picker for smart-user-picker.

## 1.1.9

### Patch Changes

- Updated dependencies

## 1.1.8

### Patch Changes

- Updated dependencies

## 1.1.7

### Patch Changes

- [`c50a63f9f72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c50a63f9f72) - Upgrade `@types/react-select` to `v3.1.2` and fix type breaks
- Updated dependencies

## 1.1.6

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 1.1.5

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 1.1.4

### Patch Changes

- Updated dependencies

## 1.1.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 1.1.2

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [`1d975c2179`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d975c2179) - Add analytics to container picker

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [`889c5d5782`](https://bitbucket.org/atlassian/atlassian-frontend/commits/889c5d5782) - Container picker provides a pre-packaged solution for getting a ranked list of containers (Jira project/ confluence space). This saves consumers from having to implement the connection to a recommendations backing service. Can be analogous to smart user picker but for containers.

  Container picker calls Collaboration graph for bootstrap suggestions and Cross-Product User Search for queried suggestions.

  Disclaimer: the package is currently in beta stages
  TODO

  - Adding analytics

  - Using CPUS search client to communicate with CPUS
