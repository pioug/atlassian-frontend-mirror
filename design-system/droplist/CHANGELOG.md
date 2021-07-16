# @atlaskit/droplist

## 11.0.8

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 11.0.7

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.
- Updated dependencies

## 11.0.6

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 11.0.5

### Patch Changes

- Updated dependencies

## 11.0.4

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 11.0.3

### Patch Changes

- Updated dependencies

## 11.0.2

### Patch Changes

- [`30853172ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30853172ff) - Reset babel config back to ie11 to prevent runtime issues in Jira and to unbreak the Confluence es5-check

## 11.0.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 11.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 10.0.8

### Patch Changes

- Updated dependencies

## 10.0.7

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 10.0.6

### Patch Changes

- Updated dependencies

## 10.0.5

### Patch Changes

- Updated dependencies

## 10.0.4

### Patch Changes

- [patch][a4acc95793](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4acc95793):

  Change imports to comply with Atlassian conventions- Updated dependencies [3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):

- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/tooltip@15.2.6
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/webdriver-runner@0.3.4

## 10.0.3

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [8b9598a760](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b9598a760):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/item@11.0.2
  - @atlaskit/field-base@14.0.2
  - @atlaskit/button@13.3.9
  - @atlaskit/section-message@4.1.7
  - @atlaskit/spinner@12.1.6
  - @atlaskit/tooltip@15.2.5

## 10.0.2

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/section-message@4.1.6
  - @atlaskit/spinner@12.1.5
  - @atlaskit/tooltip@15.2.4

## 10.0.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/field-base@14.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/item@11.0.1
  - @atlaskit/layer@8.0.1
  - @atlaskit/section-message@4.1.5
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3

## 10.0.0

### Major Changes

- [major][c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):

  BREAKING CHANGE: As part of AFP-1404, we are dropping flow support. It means that those packages are not typed. Consumer will need to manually add their types to the component.Background ticket: https://product-fabric.atlassian.net/browse/AFP-1397Plan: https://product-fabric.atlassian.net/wiki/spaces/AFP/pages/1052870901/Drop+Flow+Support+Plan

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/field-base@14.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/item@11.0.0
  - @atlaskit/layer@8.0.0
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/tooltip@15.2.2

## 9.1.0

### Minor Changes

- [minor][0e2241e904](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e2241e904):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help products to write better integration and end to end tests.

## 9.0.19

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 9.0.18

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 9.0.17

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 9.0.16

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 9.0.15

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 9.0.14

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 9.0.13

- Updated dependencies [926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):
  - @atlaskit/analytics-next@6.0.0
  - @atlaskit/button@13.1.2
  - @atlaskit/tooltip@15.0.9

## 9.0.12

### Patch Changes

- [patch][d905cbc0ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d905cbc0ac):

  Adding a condition to check if the component are referenced in tests running in CI. It reduces the noise and help reading the CI log.

## 9.0.11

### Patch Changes

- [patch][226a5fece8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/226a5fece8):

  Upating deprecation messages and adding console warning to improve visibility

## 9.0.10

### Patch Changes

- [patch][27ae405d29](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27ae405d29):

  Removed unused dependencies from package.json for droplist: keycode and classnames were unused.

## 9.0.9

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 9.0.8

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/field-base@13.0.6
  - @atlaskit/item@10.0.5
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/icon@19.0.0

## 9.0.7

### Patch Changes

- [patch][6fe990954c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6fe990954c):

  Adjusted the offset prop for Popper to not use the deprecated format

## 9.0.6

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 9.0.5

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/icon@18.0.1
  - @atlaskit/item@10.0.3
  - @atlaskit/tooltip@15.0.0

## 9.0.4

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/field-base@13.0.4
  - @atlaskit/item@10.0.2
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/icon@18.0.0

## 9.0.3

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 9.0.2

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
  - @atlaskit/button@13.0.4
  - @atlaskit/field-base@13.0.1
  - @atlaskit/spinner@12.0.0

## 9.0.1

- [patch][21854842b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21854842b5):

  - Clean couple of TODO's that were already done

## 9.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 8.0.5

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/field-base@12.0.2
  - @atlaskit/icon@16.0.9
  - @atlaskit/item@9.0.1
  - @atlaskit/spinner@10.0.7
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 8.0.4

- [patch][6fd20256f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6fd20256f3):

  - Add positionFixed property to Popper

## 8.0.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/button@12.0.0

## 8.0.2

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

## 8.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/tooltip@13.0.1
  - @atlaskit/button@11.0.0

## 8.0.0

- [major][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):

  - Drop ES5 from all the flow modules

  ### Dropping CJS support in all @atlaskit packages

  As a breaking change, all @atlaskit packages will be dropping cjs distributions and will only distribute esm. This means all distributed code will be transpiled, but will still contain `import` and
  `export` declarations.

  The major reason for doing this is to allow us to support multiple entry points in packages, e.g:

  ```js
  import colors from `@atlaskit/theme/colors`;
  ```

  Previously this was sort of possible for consumers by doing something like:

  ```js
  import colors from `@atlaskit/theme/dist/esm/colors`;
  ```

  This has a couple of issues. 1, it treats the file system as API making internal refactors harder, we have to worry about how consumers might be using things that aren't _actually_ supposed to be used. 2. We are unable to do this _internally_ in @atlaskit packages. This leads to lots of packages bundling all of theme, just to use a single color, especially in situations where tree shaking fails.

  To support being able to use multiple entrypoints internally, we unfortunately cannot have multiple distributions as they would need to have very different imports from of their own internal dependencies.

  ES Modules are widely supported by all modern bundlers and can be worked around in node environments.

  We may choose to revisit this solution in the future if we find any unintended condequences, but we see this as a pretty sane path forward which should lead to some major bundle size decreases, saner API's and simpler package architecture.

  Please reach out to #fabric-build (if in Atlassian) or create an issue in [Design System Support](https://ecosystem.atlassian.net/secure/CreateIssue.jspa?pid=24670) (for external) if you have any questions or queries about this.

## 7.0.19

- [patch][08d8be9370](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08d8be9370):

  - Close droplist on 'Esc' key down to be compatible with IE and Edge

## 7.0.18

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/field-base@11.0.14
  - @atlaskit/item@8.0.15
  - @atlaskit/tooltip@12.1.15
  - @atlaskit/icon@16.0.0

## 7.0.17

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/field-base@11.0.13
  - @atlaskit/icon@15.0.2
  - @atlaskit/item@8.0.14
  - @atlaskit/layer@5.0.10
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/docs@6.0.0

## 7.0.16

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/field-base@11.0.12
  - @atlaskit/icon@15.0.1
  - @atlaskit/item@8.0.13
  - @atlaskit/spinner@9.0.12
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/theme@7.0.0

## 7.0.15

- [patch][7fbe95e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fbe95e):

  - Prevented onOpenChange from being called repeatedly when closed

## 7.0.14

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/field-base@11.0.11
  - @atlaskit/item@8.0.12
  - @atlaskit/tooltip@12.1.11
  - @atlaskit/icon@15.0.0

## 7.0.13

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/button@10.0.0

## 7.0.12

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 7.0.11

- [patch] Fix the dropdown menu height exceeding viewport height when appearance prop is set to ‘tall’ [0deec63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0deec63)

## 7.0.10

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/field-base@11.0.8
  - @atlaskit/item@8.0.8
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/icon@14.0.0

## 7.0.9

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 7.0.7

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/spinner@9.0.6
  - @atlaskit/item@8.0.5
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-base@11.0.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 7.0.6

- [patch] Updated dependencies [8242529](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8242529)
  - @atlaskit/layer@5.0.5

## 7.0.5

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/field-base@11.0.3
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/layer@5.0.4
  - @atlaskit/item@8.0.4
  - @atlaskit/icon@13.2.4

## 7.0.4

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/item@8.0.3
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/layer@5.0.3
  - @atlaskit/field-base@11.0.2

## 7.0.3

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/tooltip@12.0.3
  - @atlaskit/field-base@11.0.1
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/spinner@9.0.3
  - @atlaskit/layer@5.0.2
  - @atlaskit/item@8.0.2
  - @atlaskit/icon@13.2.1

## 7.0.2

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/tooltip@12.0.1
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/spinner@9.0.2
  - @atlaskit/docs@5.0.1

## 7.0.1

- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/item@8.0.1
  - @atlaskit/icon@13.1.1

## 7.0.0

- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/field-base@11.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/item@8.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/field-base@11.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/item@8.0.0
  - @atlaskit/icon@13.0.0

## 6.2.2

- [patch] Remove or update \$FlowFixMe [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/button@8.2.4
  - @atlaskit/icon@12.6.1

## 6.2.1

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/field-base@10.1.3
  - @atlaskit/button@8.2.3

## 6.2.0

- [minor] Add optional onPositioned prop to inform when the menu has been positioned by the underlying Layer component. [95a4592](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95a4592)
- [minor] Updated dependencies [95a4592](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95a4592)
  - @atlaskit/layer@4.2.0

## 6.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/field-base@10.1.2
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/layer@4.0.3
  - @atlaskit/spinner@7.0.2
  - @atlaskit/item@7.0.5
  - @atlaskit/icon@12.1.2

## 6.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/spinner@7.0.1
  - @atlaskit/item@7.0.4
  - @atlaskit/icon@12.1.1
  - @atlaskit/field-base@10.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1
  - @atlaskit/layer@4.0.2

## 6.1.0

- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/tooltip@10.2.0
  - @atlaskit/item@7.0.3
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/layer@4.0.1
  - @atlaskit/field-base@10.1.0
  - @atlaskit/button@8.1.0

## 6.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/tooltip@10.0.1
  - @atlaskit/item@7.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/field-base@10.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/spinner@6.0.1
  - @atlaskit/docs@4.0.1

## 6.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/item@7.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/field-base@10.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/layer@4.0.0

## 5.1.1

- [patch] removed errorneous CSS cursor styles from droplist [535d585](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/535d585)
- [none] Updated dependencies [535d585](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/535d585)

## 5.1.0

- [minor] Add `isMenuFixed` prop to force menu to render with position fixed to allow it to break out of non-visible overflow containers at the cost of scroll detachment. [e20ac40](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e20ac40)
- [none] Updated dependencies [e710cfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e710cfa)
  - @atlaskit/layer@3.2.0

## 5.0.3

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/item@6.0.3
  - @atlaskit/field-base@9.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/docs@3.0.4
  - @atlaskit/layer@3.1.1

## 5.0.1

- [patch] Fix clipping of dropdown item content due to line height issues [a0392ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0392ec)

## 5.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 4.12.2

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 4.12.1

- [patch] Update links in documentation [c4f7497](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c4f7497)

## 4.12.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 4.11.11

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 4.11.10

- [patch] fixes AK-4178 , added fix for double color icon in navigation [c6121d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6121d6)

## 4.11.8

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 4.11.7

- [patch] Change incorrect type info [ce915ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce915ea)

## 4.11.6

- [patch] transparent background for selected item in droplist [75445a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75445a6)

## 4.11.5

- [patch] migrate from ak to mk2 -> droplist [3b0ae0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b0ae0c)

## 4.11.4 (2017-12-04)

- bug fix; updated backgorund and color for droplist item in selected mode (issues closed: ak-3624) ([c1cb987](https://bitbucket.org/atlassian/atlaskit/commits/c1cb987))

## 4.11.3 (2017-11-15)

- bug fix; bumping to latest major version of internal dependencies ([be44c19](https://bitbucket.org/atlassian/atlaskit/commits/be44c19))

## 4.11.2 (2017-10-22)

- bug fix; update dependencies for react-16 ([077d1ad](https://bitbucket.org/atlassian/atlaskit/commits/077d1ad))

## 4.11.1 (2017-09-21)

- bug fix; update item dependency (issues closed: ak-3418) ([4f64804](https://bitbucket.org/atlassian/atlaskit/commits/4f64804))

## 4.11.0 (2017-08-31)

- bug fix; droplist dependencies bumped to latest (issues closed: ak-3392) ([f24b3ba](https://bitbucket.org/atlassian/atlaskit/commits/f24b3ba))
- feature; adding the ability to pass a boundariesElement to the Layer component (issues closed: ak-3416) ([f6a215e](https://bitbucket.org/atlassian/atlaskit/commits/f6a215e))

## 4.10.0 (2017-08-29)

- bug fix; remove unused theme file ([5481b6b](https://bitbucket.org/atlassian/atlaskit/commits/5481b6b))
- feature; droplist has darkmode style options (issues closed: ak-3399) ([f4e1c65](https://bitbucket.org/atlassian/atlaskit/commits/f4e1c65))

## 4.9.0 (2017-08-11)

- bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
- feature; implement darkmode for droplist ([35f9281](https://bitbucket.org/atlassian/atlaskit/commits/35f9281))

## 4.8.0 (2017-08-11)

- feature; implement darkmode for droplist ([35f9281](https://bitbucket.org/atlassian/atlaskit/commits/35f9281))

## 4.6.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))
- feature; convert dropdown-menu and droplist to declarative API ([f6e0292](https://bitbucket.org/atlassian/atlaskit/commits/f6e0292))

## 4.6.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 4.2.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 4.2.0 (2017-07-17)

- feature; adds maxHeight prop to droplist ([9a25a5a](https://bitbucket.org/atlassian/atlaskit/commits/9a25a5a))
- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 4.1.0 (2017-06-21)

- feature; adds appearance prop to droplist (allowing appearance="primary") ([6c07808](https://bitbucket.org/atlassian/atlaskit/commits/6c07808))

## 4.0.1 (2017-05-31)

- fix; remove tabIndex attribute from the item with 'option' type ([a09821d](https://bitbucket.org/atlassian/atlaskit/commits/a09821d))

## 4.0.0 (2017-05-29)

- replace LESS with SC ([4532bf8](https://bitbucket.org/atlassian/atlaskit/commits/4532bf8))
- breaking; removed TypeScript
- ISSUES CLOSED: AK-1517

## 3.9.0 (2017-05-26)

- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- feature; add isLoading to Droplist ([4de3242](https://bitbucket.org/atlassian/atlaskit/commits/4de3242))

## 3.8.1 (2017-05-16)

- fix; fix type definition for droplist published in npm ([ebb882c](https://bitbucket.org/atlassian/atlaskit/commits/ebb882c))

## 3.7.0 (2017-05-10)

- feature; add tooltip support to droplist items. ([2a2debc](https://bitbucket.org/atlassian/atlaskit/commits/2a2debc))
- feature; bumping icon in droplist component to 6.5.2 ([e99d87a](https://bitbucket.org/atlassian/atlaskit/commits/e99d87a))

## 3.6.0 (2017-05-01)

- feature; fix overflown items + additional property `shouldAllowMultilineItems` ([6af80cc](https://bitbucket.org/atlassian/atlaskit/commits/6af80cc))

## 3.5.1 (2017-04-20)

- fix; unmounting a droplist no longer leaves an event listener bound to the document ([6d3f7ef](https://bitbucket.org/atlassian/atlaskit/commits/6d3f7ef))

## 3.5.0 (2017-04-20)

- feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 3.4.1 (2017-04-18)

- fix; fix problem with text descenders being cut off ([6b8e621](https://bitbucket.org/atlassian/atlaskit/commits/6b8e621))

## 3.3.2 (2017-04-18)

- fix; bumps Layer version in droplist to allow fix from Layer ([2a1b3d2](https://bitbucket.org/atlassian/atlaskit/commits/2a1b3d2))
- feature; updated avatar dependency versions for comment, dropdown-menu, droplist, and page ([e4d2ae7](https://bitbucket.org/atlassian/atlaskit/commits/e4d2ae7))

## 3.3.1 (2017-04-06)

- fix; only remove maxHeight style for tall appearance ([76ef554](https://bitbucket.org/atlassian/atlaskit/commits/76ef554))

## 3.3.0 (2017-04-05)

- feature; avoid setting max-height when not required ([1cc2893](https://bitbucket.org/atlassian/atlaskit/commits/1cc2893))

## 3.2.0 (2017-03-29)

- feature; description in items is implemented ([73b19b1](https://bitbucket.org/atlassian/atlaskit/commits/73b19b1))

## 3.0.3 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))
- feature; title property for the item sub-component is added. ([c508706](https://bitbucket.org/atlassian/atlaskit/commits/c508706))

## 3.0.2 (2017-03-20)

- fix; fix some colors and paddings according to ADG3 specs ([bf03ac9](https://bitbucket.org/atlassian/atlaskit/commits/bf03ac9))

## 3.0.1 (2017-03-14)

- fix; fix colors and some paddings to be them more adg3 ([c51eb40](https://bitbucket.org/atlassian/atlaskit/commits/c51eb40))

## 3.0.0 (2017-03-07)

- fix; fix ts definition ([0f9969a](https://bitbucket.org/atlassian/atlaskit/commits/0f9969a))
- fix; fix ts definitions ([94d3efc](https://bitbucket.org/atlassian/atlaskit/commits/94d3efc))
- feature; clean up droplist component from all keyboard interactions and trigger ([22b2034](https://bitbucket.org/atlassian/atlaskit/commits/22b2034))
- breaking; Trigger is removed from export \| isKeyboardInteractionDisabled property is removed \|
- isTriggerDisabled property is removed \| isTriggerNotTabbable property is removed \| listContext roperty is removed \| all keyboard functionality is removed \| all focus functionality is removed
- ISSUES CLOSED: AK-1714

## 2.0.0 (2017-03-03)

- feature; merge droplist's subcomponents into the main package ([104f740](https://bitbucket.org/atlassian/atlaskit/commits/104f740))
- breaking; droplist-item, droplist-trigger, droplist-group components are now deprecated. Droplist exports them as a named export.

## 1.3.11 (2017-02-28)

- fix; dummy commit to release stories ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 1.3.9 (2017-02-28)

- fix; dummy commit to fix broken stories and missing registry pages ([a31e92a](https://bitbucket.org/atlassian/atlaskit/commits/a31e92a))

## 1.3.9 (2017-02-28)

- fix; dummy commit to release stories for components ([a105c02](https://bitbucket.org/atlassian/atlaskit/commits/a105c02))

## 1.3.8 (2017-02-28)

- fix; Removes jsdoc annotation from droplist ([a575f49](https://bitbucket.org/atlassian/atlaskit/commits/a575f49))

## 1.3.7 (2017-02-27)

- empty commit to make components release themselves ([5511fbe](https://bitbucket.org/atlassian/atlaskit/commits/5511fbe))

## 1.3.6 (2017-02-24)

- fix the 'dummy search' behavior when dropdown is open ([4176ab3](https://bitbucket.org/atlassian/atlaskit/commits/4176ab3))

## 1.3.4 (2017-02-15)

- fix situation when there is no items ([d249ae6](https://bitbucket.org/atlassian/atlaskit/commits/d249ae6))
- height of the dropdown list is calculated correctly now ([baaedc7](https://bitbucket.org/atlassian/atlaskit/commits/baaedc7))

## 1.3.2 (2017-02-14)

- fix broken focus ring and scrolling ([6e30737](https://bitbucket.org/atlassian/atlaskit/commits/6e30737))

## 1.3.1 (2017-02-10)

- fix; fix broken focus ring ([1959f0f](https://bitbucket.org/atlassian/atlaskit/commits/1959f0f))
- fix; refactor stories to use // rather than http:// ([a0826cf](https://bitbucket.org/atlassian/atlaskit/commits/a0826cf))

## 1.2.1 (2017-02-09)

- fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))
- feature; isKeyboardInteractionDisabled prop is added ([2b1ec2c](https://bitbucket.org/atlassian/atlaskit/commits/2b1ec2c))
