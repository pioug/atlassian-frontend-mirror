# @atlaskit/in-product-testing-sample

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
