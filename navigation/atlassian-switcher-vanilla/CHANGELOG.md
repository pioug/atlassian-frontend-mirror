# @atlaskit/atlassian-switcher-vanilla

## 3.0.8

### Patch Changes

- Updated dependencies

## 3.0.7

### Patch Changes

- Updated dependencies

## 3.0.6

### Patch Changes

- Updated dependencies

## 3.0.5

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 3.0.4

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 3.0.3

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- [`3c50349ede`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c50349ede) - Upgrade analytics-next to prevent event loss (https://hello.atlassian.net/wiki/spaces/AFP/blog/2020/08/26/828144759/ACTION+REQUIRED+-+upgrade+analytics-next+to+prevent+event+loss)

## 3.0.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 3.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 2.1.12

### Patch Changes

- Updated dependencies

## 2.1.11

### Patch Changes

- Updated dependencies

## 2.1.10

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/atlassian-switcher-test-utils@0.3.1
  - @atlaskit/atlassian-switcher@5.9.1

## 2.1.9

### Patch Changes

- Updated dependencies [d9b3b4022c](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9b3b4022c):
  - @atlaskit/atlassian-switcher-test-utils@0.3.0
  - @atlaskit/atlassian-switcher@5.8.0

## 2.1.8

### Patch Changes

- Updated dependencies [f3e30019f0](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3e30019f0):
  - @atlaskit/atlassian-switcher-test-utils@0.2.0
  - @atlaskit/atlassian-switcher@5.1.0

## 2.1.7

### Patch Changes

- Updated dependencies [15239ee523](https://bitbucket.org/atlassian/atlassian-frontend/commits/15239ee523):
  - @atlaskit/atlassian-switcher@5.0.0

## 2.1.6

### Patch Changes

- Updated dependencies [54588e51df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/54588e51df):
  - @atlaskit/atlassian-switcher@4.9.0
  - @atlaskit/atlassian-switcher-test-utils@0.1.0

## 2.1.5

### Patch Changes

- [patch][ce21161796](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce21161796):

  Fix some types that were being transpiled to 'any'

## 2.1.4

### Patch Changes

- [patch][6bc87c7501](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6bc87c7501):

  Split mockEndpoints into a separate package

## 2.1.3

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 2.1.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 2.1.1

### Patch Changes

- [patch][8ec4a18b58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ec4a18b58):

  Updating examples

## 2.1.0

### Minor Changes

- [minor][42afbf2163](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42afbf2163):

  Only show try links if the product is not provisioned for any of the available sites

## 2.0.0

### Major Changes

- [major][deff626951](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/deff626951):

  Remove enableUserCentricProducts feature flag, enable account centric switcher by default

## 1.0.0

### Major Changes

- [major][fa67fac4c0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa67fac4c0):

  Improving docs

## 0.0.1

### Patch Changes

- [patch][a9bf2f8d31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a9bf2f8d31):

  Adding vanilla wrapper for Atlassian switcher
