# @atlaskit/help-layout

## 3.0.3

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- [`df9dc928897`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df9dc928897) - Update the team information in the packages maintained by the In Product Help team

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [`cbed2edbd0c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cbed2edbd0c) - [ux] Ranamed prop "title" to "headerTitle". Added the prop "headerContent" where we can pass a React.node to render underneath the header title

## 2.0.7

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 2.0.6

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 2.0.5

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo analytics-next file restructure to allow external ts definitions to continue working

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 2.0.0

### Major Changes

- [`3f24892368`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f24892368) - Added help-layout component to the atlaskit library
