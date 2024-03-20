# @atlaskit/in-product-testing-sample

## 0.3.4

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116) [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) - Upgrade Typescript from `4.9.5` to `5.4.2`

## 0.3.3

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443) [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies

## 0.3.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 0.3.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 0.3.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

## 0.2.9

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424) [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils

## 0.2.8

### Patch Changes

- [#29020](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29020) [`e6930b68815`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6930b68815) - Added basic in-product tests for notifications

## 0.2.7

### Patch Changes

- [#28717](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28717) [`13d94f43dd0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/13d94f43dd0) - Created an in-product test for the recent work component

## 0.2.6

### Patch Changes

- [#28656](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28656) [`68ce35bc0f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/68ce35bc0f5) - Created an in-product test for `people-menu`

## 0.2.5

### Patch Changes

- [#26241](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26241) [`d2cde0ebdfd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2cde0ebdfd) - fix editor cypress tests and delete media cypress tests

## 0.2.4

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874) [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 0.2.3

### Patch Changes

- [#24818](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24818) [`46059beebbf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/46059beebbf) - - include **tests_external** in build
  - replace usage of @local-cypress package with @cypress
  - bump @cypress from ^6.4.0 to ^7.7.0
  - import cypress types into @atlaskit/in-product-testing tsconfig

## 0.2.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492) [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 0.2.1

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650) [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 0.2.0

### Minor Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302) [`8e6a1034cfd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e6a1034cfd) - EDM-1730: added in-product Cypress tests for Smart Links

## 0.1.1

### Patch Changes

- [#11778](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11778) [`9e09b407b43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e09b407b43) - Exclude `__tests_external__` from the `build/tsconfig.json`.
  Add `local-cypress` and remove types export.

## 0.1.0

### Minor Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230) [`d575abf3498`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d575abf3498) - EDM-1640: Introduce Cypress in-product tests in Atlassian Frontend

  Example test:

  ```
  import { editorFundamentalsTestCollection } from '@atlaskit/editor-common/in-product';

  //code to navigate to the page

  editorFundamentalsTestCollection({}).test(cy);

  ```
