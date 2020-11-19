# @atlaskit/activity-provider

## 2.3.2

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 2.3.1

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 2.3.0

### Minor Changes

- [`903a529a3e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/903a529a3e) - Return types in activity-provider which will be used in analytics
  Adds in instrumentation metrics for HyperLinkToolBar

## 2.2.0

### Minor Changes

- [`d1c666bb6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1c666bb6d) - Adds activity analytic events

## 2.1.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 2.1.0

### Minor Changes

- [`b530b169db`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b530b169db) - EDM-642 update graphql filter

### Patch Changes

- [`db19eeb8c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db19eeb8c5) - - rename some of the properties for ActivityItem
  - a new SearchProvider for quick link search

## 2.0.0

### Major Changes

- [`71c78f8719`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71c78f8719) - EDM-642 Use new ActivityProvider and it's going to be a replacement of the existing `@atlaskit/activity`. The new ActivityProvider will use the new platform API instead of talking to the old Activity Service API.
