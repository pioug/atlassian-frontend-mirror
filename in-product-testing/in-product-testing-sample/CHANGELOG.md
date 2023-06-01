# @atlaskit/in-product-testing-sample

## 0.3.3

### Patch Changes

- [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies

## 0.3.2

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 0.3.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 0.3.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

## 0.2.9

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils

## 0.2.8

### Patch Changes

- [`e6930b68815`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6930b68815) - Added basic in-product tests for notifications

## 0.2.7

### Patch Changes

- [`13d94f43dd0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/13d94f43dd0) - Created an in-product test for the recent work component

## 0.2.6

### Patch Changes

- [`68ce35bc0f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/68ce35bc0f5) - Created an in-product test for `people-menu`

## 0.2.5

### Patch Changes

- [`d2cde0ebdfd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2cde0ebdfd) - fix editor cypress tests and delete media cypress tests

## 0.2.4

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 0.2.3

### Patch Changes

- [`46059beebbf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/46059beebbf) - - include **tests_external** in build
  - replace usage of @local-cypress package with @cypress
  - bump @cypress from ^6.4.0 to ^7.7.0
  - import cypress types into @atlaskit/in-product-testing tsconfig

## 0.2.2

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 0.2.1

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 0.2.0

### Minor Changes

- [`8e6a1034cfd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e6a1034cfd) - EDM-1730: added in-product Cypress tests for Smart Links

## 0.1.1

### Patch Changes

- [`9e09b407b43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e09b407b43) - Exclude `__tests_external__` from the `build/tsconfig.json`.
  Add `local-cypress` and remove types export.

## 0.1.0

### Minor Changes

- [`d575abf3498`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d575abf3498) - EDM-1640: Introduce Cypress in-product tests in Atlassian Frontend

  Example test:

  ```
  import { editorFundamentalsTestCollection } from '@atlaskit/editor-common/in-product';

  //code to navigate to the page

  editorFundamentalsTestCollection({}).test(cy);

  ```
