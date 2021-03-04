# @atlaskit/atlassian-switcher-test-utils

## 0.6.1

### Patch Changes

- [`b56828f3881`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b56828f3881) - Fixes an issue where recent containers would fail to load.

## 0.6.0

### Minor Changes

- [`de57e508231`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de57e508231) - Recent containers mock data has been removed as the endpoint has been decommissioned.

## 0.5.3

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 0.5.2

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 0.5.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 0.5.0

### Minor Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 0.4.0

### Minor Changes

- [`3e8ee36cde`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e8ee36cde) - Remove \* export from switcher-test-utils

### Patch Changes

- [`38f39c2de9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/38f39c2de9) - REMOVED apsMigrationAvailableProductsProvider. API MIGRATED available-products

## 0.3.2

### Patch Changes

- [`131cee6d7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/131cee6d7a) - Add missing tslib dependency

## 0.3.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes

## 0.3.0

### Minor Changes

- [minor][d9b3b4022c](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9b3b4022c):

  Add a feature flag property to enable fetching recent containers via a collaboration graph endpoint

## 0.2.1

### Patch Changes

- [patch][4f7f265efa](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f7f265efa):

  Atlassian Switcher - remove activity count based top site selection

## 0.2.0

### Minor Changes

- [minor][f3e30019f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3e30019f0):

  CROSSFLOW-154 introduce new isDefaultEditionFreeExperimentEnabled prop to control copy changes in the discover section of the switcher

## 0.1.1

### Patch Changes

- [patch][026ed7dadf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/026ed7dadf):

  Export a new fetch function so clients can create a custom data provider for joinable sites section on the atlassian switcher

## 0.1.0

### Minor Changes

- [minor][54588e51df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/54588e51df):

  Add recommendationsFeatureFlags to generic-switcher

## 0.0.1

### Patch Changes

- [patch][6bc87c7501](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6bc87c7501):

  Split mockEndpoints into a separate package
