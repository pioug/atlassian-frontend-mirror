# @atlaskit/multi-select

## 15.0.5

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 15.0.4

### Patch Changes

- Updated dependencies

## 15.0.3

### Patch Changes

- Updated dependencies

## 15.0.2

### Patch Changes

- [`30853172ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30853172ff) - Reset babel config back to ie11 to prevent runtime issues in Jira and to unbreak the Confluence es5-check

## 15.0.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 15.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 14.0.4

### Patch Changes

- Updated dependencies

## 14.0.3

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 14.0.2

### Patch Changes

- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies
- Updated dependencies

## 14.0.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/avatar@17.1.7
  - @atlaskit/button@13.3.7
  - @atlaskit/droplist@10.0.1
  - @atlaskit/field-base@14.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/section-message@4.1.5
  - @atlaskit/spinner@12.1.4
  - @atlaskit/tag-group@9.0.6
  - @atlaskit/tag@9.0.13
  - @atlaskit/theme@9.5.1

## 14.0.0

### Major Changes

- [major][c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):

  BREAKING CHANGE: As part of AFP-1404, we are dropping flow support. It means that those packages are not typed. Consumer will need to manually add their types to the component.Background ticket: https://product-fabric.atlassian.net/browse/AFP-1397Plan: https://product-fabric.atlassian.net/wiki/spaces/AFP/pages/1052870901/Drop+Flow+Support+Plan

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/droplist@10.0.0
  - @atlaskit/field-base@14.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/tag@9.0.12

## 13.1.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 13.1.1

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/tag@9.0.7
  - @atlaskit/tag-group@9.0.4
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 13.1.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 13.0.15

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 13.0.14

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 13.0.13

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 13.0.12

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 13.0.11

- Updated dependencies [cc461c0022](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc461c0022):
  - @atlaskit/tag-group@9.0.0

## 13.0.10

### Patch Changes

- [patch][d905cbc0ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d905cbc0ac):

  Adding a condition to check if the component are referenced in tests running in CI. It reduces the noise and help reading the CI log.

## 13.0.9

### Patch Changes

- [patch][226a5fece8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/226a5fece8):

  Upating deprecation messages and adding console warning to improve visibility

## 13.0.8

- Updated dependencies [1adb8727e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1adb8727e3):
  - @atlaskit/tag-group@8.0.2
  - @atlaskit/tag@9.0.0

## 13.0.7

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/button@13.0.9
  - @atlaskit/droplist@9.0.8
  - @atlaskit/field-base@13.0.6
  - @atlaskit/section-message@4.0.5
  - @atlaskit/tag@8.0.5
  - @atlaskit/icon@19.0.0

## 13.0.6

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 13.0.5

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/button@13.0.8
  - @atlaskit/droplist@9.0.4
  - @atlaskit/field-base@13.0.4
  - @atlaskit/section-message@4.0.2
  - @atlaskit/tag@8.0.3
  - @atlaskit/icon@18.0.0

## 13.0.4

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 13.0.3

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
  - @atlaskit/button@13.0.4
  - @atlaskit/droplist@9.0.2
  - @atlaskit/field-base@13.0.1
  - @atlaskit/spinner@12.0.0

## 13.0.2

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/avatar@16.0.2
  - @atlaskit/icon@17.1.1
  - @atlaskit/tag@8.0.2
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 13.0.1

- [patch][21854842b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21854842b5):

  - Clean couple of TODO's that were already done

## 13.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 12.0.3

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/button@12.0.3
  - @atlaskit/droplist@8.0.5
  - @atlaskit/field-base@12.0.2
  - @atlaskit/icon@16.0.9
  - @atlaskit/section-message@2.0.3
  - @atlaskit/spinner@10.0.7
  - @atlaskit/tag@7.0.2
  - @atlaskit/theme@8.1.7

## 12.0.2

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/avatar@15.0.3
  - @atlaskit/droplist@8.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/section-message@2.0.2
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 12.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/avatar@15.0.1
  - @atlaskit/droplist@8.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/section-message@2.0.1
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 12.0.0

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

## 11.0.14

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/avatar@14.1.8
  - @atlaskit/button@10.1.2
  - @atlaskit/droplist@7.0.18
  - @atlaskit/field-base@11.0.14
  - @atlaskit/section-message@1.0.16
  - @atlaskit/tag@6.1.4
  - @atlaskit/icon@16.0.0

## 11.0.13

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/avatar@14.1.7
  - @atlaskit/button@10.1.1
  - @atlaskit/droplist@7.0.17
  - @atlaskit/field-base@11.0.13
  - @atlaskit/icon@15.0.2
  - @atlaskit/section-message@1.0.14
  - @atlaskit/spinner@9.0.13
  - @atlaskit/tag@6.1.3
  - @atlaskit/tag-group@6.0.8
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 11.0.12

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/droplist@7.0.16
  - @atlaskit/field-base@11.0.12
  - @atlaskit/icon@15.0.1
  - @atlaskit/section-message@1.0.13
  - @atlaskit/spinner@9.0.12
  - @atlaskit/tag@6.1.2
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6

## 11.0.11

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/avatar@14.1.5
  - @atlaskit/button@10.0.1
  - @atlaskit/droplist@7.0.14
  - @atlaskit/field-base@11.0.11
  - @atlaskit/section-message@1.0.12
  - @atlaskit/tag@6.1.1
  - @atlaskit/icon@15.0.0

## 11.0.10

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/avatar@14.1.4
  - @atlaskit/droplist@7.0.13
  - @atlaskit/icon@14.6.1
  - @atlaskit/section-message@1.0.11
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 11.0.9

- [patch][a637f5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a637f5e):

  - Refine and fix some flow type errors found by fixing @atlaskit/analytics-next HOCs to allow flow to type check properly

## 11.0.8

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 11.0.7

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/button@9.0.13
  - @atlaskit/droplist@7.0.10
  - @atlaskit/field-base@11.0.8
  - @atlaskit/section-message@1.0.8
  - @atlaskit/tag@6.0.8
  - @atlaskit/icon@14.0.0

## 11.0.6

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 11.0.5

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tag@6.0.5
  - @atlaskit/spinner@9.0.6
  - @atlaskit/section-message@1.0.5
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-base@11.0.5
  - @atlaskit/droplist@7.0.7
  - @atlaskit/button@9.0.6
  - @atlaskit/avatar@14.0.8
  - @atlaskit/docs@5.0.6

## 11.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/field-base@11.0.3
  - @atlaskit/tag@6.0.4
  - @atlaskit/tag-group@6.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/section-message@1.0.4
  - @atlaskit/icon@13.2.4
  - @atlaskit/droplist@7.0.5
  - @atlaskit/avatar@14.0.6

## 11.0.3

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/icon@13.2.2
  - @atlaskit/tag@6.0.3
  - @atlaskit/tag-group@6.0.3
  - @atlaskit/section-message@1.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/docs@5.0.2
  - @atlaskit/droplist@7.0.4
  - @atlaskit/avatar@14.0.5
  - @atlaskit/field-base@11.0.2

## 11.0.2

- [patch] Update docs, change dev deps [25d6e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d6e48)
- [none] Updated dependencies [25d6e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d6e48)
  - @atlaskit/avatar@14.0.3

## 11.0.1

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/tag@6.0.1
  - @atlaskit/tag-group@6.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/spinner@9.0.2
  - @atlaskit/docs@5.0.1
  - @atlaskit/droplist@7.0.2
  - @atlaskit/avatar@14.0.2

## 11.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/field-base@11.0.0
  - @atlaskit/tag@6.0.0
  - @atlaskit/tag-group@6.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/droplist@7.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/field-base@11.0.0
  - @atlaskit/tag@6.0.0
  - @atlaskit/tag-group@6.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/droplist@7.0.0
  - @atlaskit/avatar@14.0.0

## 10.2.4

- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/button@8.2.5
  - @atlaskit/tag@5.0.7
  - @atlaskit/tag-group@5.1.3
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/tag-group@5.1.3
  - @atlaskit/button@8.2.5
  - @atlaskit/tag@5.0.7

## 10.2.3

- [patch] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0
  - @atlaskit/tag-group@5.1.2
  - @atlaskit/tag@5.0.6

## 10.2.2

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/field-base@10.1.3
  - @atlaskit/droplist@6.2.1
  - @atlaskit/button@8.2.3

## 10.2.1

- [patch] Fix \$FlowFixMe and release packages [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/button@8.2.2
  - @atlaskit/tag@5.0.5
  - @atlaskit/spinner@7.1.1
  - @atlaskit/icon@12.3.1
  - @atlaskit/avatar@11.2.1

## 10.2.0

- [minor] Fixes types for Flow 0.74 [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [none] Updated dependencies [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
  - @atlaskit/button@8.2.0
  - @atlaskit/spinner@7.1.0
  - @atlaskit/icon@12.2.0
  - @atlaskit/avatar@11.2.0

## 10.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/field-base@10.1.2
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/tag@5.0.4
  - @atlaskit/tag-group@5.1.1
  - @atlaskit/spinner@7.0.2
  - @atlaskit/icon@12.1.2
  - @atlaskit/droplist@6.1.2

## 10.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/tag@5.0.3
  - @atlaskit/spinner@7.0.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/field-base@10.1.1
  - @atlaskit/droplist@6.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/avatar@11.1.1
  - @atlaskit/docs@4.1.1

## 10.1.0

- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/avatar@11.1.0
  - @atlaskit/tag-group@5.1.0
  - @atlaskit/tag@5.0.2
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/field-base@10.1.0
  - @atlaskit/droplist@6.1.0
  - @atlaskit/button@8.1.0

## 10.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/icon@12.0.0
  - @atlaskit/tag@5.0.0
  - @atlaskit/tag-group@5.0.0
  - @atlaskit/field-base@10.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/droplist@6.0.0
  - @atlaskit/avatar@11.0.0

## 9.0.2

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/tag@4.1.1
  - @atlaskit/tag-group@4.0.1
  - @atlaskit/field-base@9.0.3
  - @atlaskit/droplist@5.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4

## 9.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 8.1.2

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 8.1.1

- [patch] fix padding around loading message [56e78c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56e78c9)

## 8.1.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 8.0.7

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 8.0.6

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 8.0.5

- [patch] Flatten examples for easier consumer use [145b632](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/145b632)

## 8.0.3

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)
- [patch] Fix regression from migration in example 10 [a46dfd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a46dfd2)

## 8.0.1

- [patch] Manually bumped package ver to account for desync between ak and ak mk 2 versions [5518730](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5518730)

## 8.0.0

- Manual bump to fix desync between ak and ak-mk-2 versions
- No breaking changes

## 7.1.8

- [patch] migrate multi-select to ak-mk-2 [ea69e2e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea69e2e)

## 7.1.7 (2017-11-30)

- bug fix; release stories with fixed console errors ([3321c2b](https://bitbucket.org/atlassian/atlaskit/commits/3321c2b))

## 7.1.6 (2017-10-26)

- bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 7.1.5 (2017-10-22)

- bug fix; update styled-components dep and react peerDep ([6a67bf8](https://bitbucket.org/atlassian/atlaskit/commits/6a67bf8))

## 7.1.4 (2017-10-18)

- bug fix; updated icon dependency to fix IE 11 issues (issues closed: ak-3709) ([8e93274](https://bitbucket.org/atlassian/atlaskit/commits/8e93274))

## 7.1.3 (2017-09-14)

- bug fix; stateful Multi-select will fire onOpenChange only when the dropdown menu is opened o ([4d69a9d](https://bitbucket.org/atlassian/atlaskit/commits/4d69a9d))

## 7.1.2 (2017-09-11)

- bug fix; standardise placeholders (issues closed: #ak-3406) ([95187e1](https://bitbucket.org/atlassian/atlaskit/commits/95187e1))

## 7.1.1 (2017-09-05)

- bug fix; update styles for ie11 to respect flex-wrap ([7cec339](https://bitbucket.org/atlassian/atlaskit/commits/7cec339))

## 7.1.0 (2017-08-31)

- bug fix; loading options should not be exposed on the stateful component (issues closed: ak-3181) ([5eb9413](https://bitbucket.org/atlassian/atlaskit/commits/5eb9413))
- feature; added loading state for the initial fetching of data on the multi-select component (issues closed: ak-3181) ([638afd5](https://bitbucket.org/atlassian/atlaskit/commits/638afd5))

## 7.0.0 (2017-08-30)

- feature; update field base dependency for darkmode ([baeb283](https://bitbucket.org/atlassian/atlaskit/commits/baeb283))
- breaking; multi select has dark mode, util-shared-styles removed ([26ffe5c](https://bitbucket.org/atlassian/atlaskit/commits/26ffe5c))
- breaking; add dark mode to multi-select (issues closed: #ak-3400) ([26ffe5c](https://bitbucket.org/atlassian/atlaskit/commits/26ffe5c))

## 6.9.3 (2017-08-19)

- bug fix; aK-2249 use variables from utils-shared-styles instead of hard-coding font-size and (issues closed: ak-2249) ([77e32f8](https://bitbucket.org/atlassian/atlaskit/commits/77e32f8))
- bug fix; aK-2249 add font-size to multi-select input style to fix placeholder clipping in saf (issues closed: ak-2249) ([3048e4a](https://bitbucket.org/atlassian/atlaskit/commits/3048e4a))

## 6.9.2 (2017-08-11)

- bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))

## 6.9.1 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 6.9.0 (2017-07-25)

- feature; multi-select allows custom icon ([26e1a22](https://bitbucket.org/atlassian/atlaskit/commits/26e1a22))

## 6.8.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 6.8.0 (2017-07-20)

- feature; multi-select has the shouldFlip property, which will be passed to droplist ([14f7a50](https://bitbucket.org/atlassian/atlaskit/commits/14f7a50))

## 6.4.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))
- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 6.3.0 (2017-07-05)

- feature; adding prop filterValues to Multi-select's Item. ([b7c3342](https://bitbucket.org/atlassian/atlaskit/commits/b7c3342))

## 6.2.0 (2017-06-21)

- feature; adds \`footer\` prop to multiselect ([97f5113](https://bitbucket.org/atlassian/atlaskit/commits/97f5113))

## 6.1.0 (2017-06-16)

- feature; add invalidMessage property to multi-select ([f2ef82d](https://bitbucket.org/atlassian/atlaskit/commits/f2ef82d))

## 6.0.0 (2017-06-14)

- refactor multi-select to styled-components and change structure to match new sta ([10ecbc8](https://bitbucket.org/atlassian/atlaskit/commits/10ecbc8))
- feature; extend API of items prop to accept an array of items as well as an array of groups ([f1408de](https://bitbucket.org/atlassian/atlaskit/commits/f1408de))
- breaking; StatelessMultiSelect renamed to MultiSelectStateless for consistency | Move from less to styled components
- ISSUES CLOSED: #AK-2392

## 5.1.1 (2017-06-02)

- fix; bumped dependencies in multi-select ([21f4dd3](https://bitbucket.org/atlassian/atlaskit/commits/21f4dd3))

## 5.1.0 (2017-05-31)

- fix; items are now rendered with the correct type ([8cfa749](https://bitbucket.org/atlassian/atlaskit/commits/8cfa749))
- fix; update state with items when props received ([819b0b6](https://bitbucket.org/atlassian/atlaskit/commits/819b0b6))
- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- feature; create new item in multi-select is implemented ([f5df509](https://bitbucket.org/atlassian/atlaskit/commits/f5df509))
- feature; don't create an existing value ([c2d9c02](https://bitbucket.org/atlassian/atlaskit/commits/c2d9c02))

## 5.0.2 (2017-05-08)

- fix; multi-select - fixed bug preventing shift-tabbing focus away from a multi-select fie ([913de82](https://bitbucket.org/atlassian/atlaskit/commits/913de82))

## 5.0.1 (2017-05-04)

- fix; bumps tag dependency version ([4a53c4d](https://bitbucket.org/atlassian/atlaskit/commits/4a53c4d))

## 5.0.0 (2017-05-01)

- fix; display NoMatchesFound message, filter selected items by values ([bd00f35](https://bitbucket.org/atlassian/atlaskit/commits/bd00f35))
- fix; fixes NoMatchesFound message, filter selected items by values instead of reference ([1586172](https://bitbucket.org/atlassian/atlaskit/commits/1586172))
- breaking; Selected items are filtered out from the dropdown by theirs values instead of references
- ISSUES CLOSED: AK-1605

## 4.0.0 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))
- upgrade multi-select's dependencies: tag to 2.1.0, tag-group to 2.0.0 ([5da8e4e](https://bitbucket.org/atlassian/atlaskit/commits/5da8e4e))
- breaking; Introduce styled-component as a peer dependency

## 3.1.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 3.1.0 (2017-04-20)

- fix; upgrade droplist dependency version ([0dd084d](https://bitbucket.org/atlassian/atlaskit/commits/0dd084d))
- feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))
- temporarily revert changes ([8d22c2d](https://bitbucket.org/atlassian/atlaskit/commits/8d22c2d))

## 2.8.6 (2017-03-29)

- fix; fixes bug where group headings would be shown when all items had been selected ([674a87a](https://bitbucket.org/atlassian/atlaskit/commits/674a87a))
- feature; adds tag prop for relfecting elemBefore and appearnace on rendered tags ([e33e32b](https://bitbucket.org/atlassian/atlaskit/commits/e33e32b))
- breaking; tagElemBefore has been replaced with tag.elemBefore and tag.appearance has been added
- ISSUES CLOSED: AK-1987

## 2.8.4 (2017-03-23)

- fix; prevent default action if Enter pressed then Select is open ([ebd0d03](https://bitbucket.org/atlassian/atlaskit/commits/ebd0d03))
- fix; story with items descriptions is added ([acbf97b](https://bitbucket.org/atlassian/atlaskit/commits/acbf97b))
- fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 2.8.2 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 2.8.1 (2017-03-21)

- fix; adds proper itemShape validation and adds docs for Item in multiselect ([9d8198a](https://bitbucket.org/atlassian/atlaskit/commits/9d8198a))

## 2.8.0 (2017-03-07)

- feature; adds elemBefore and tagElemBefore props to multiselect ([67eef9f](https://bitbucket.org/atlassian/atlaskit/commits/67eef9f))

## 2.6.6 (2017-02-22)

- prevent default behavior for 'up' and 'down' key ([86a4716](https://bitbucket.org/atlassian/atlaskit/commits/86a4716))
- feature; selects should support different appearances ([961bd5c](https://bitbucket.org/atlassian/atlaskit/commits/961bd5c))

## 2.6.5 (2017-02-14)

- basic keyboard navigation is fixed ([8838672](https://bitbucket.org/atlassian/atlaskit/commits/8838672))

## 2.6.3 (2017-02-14)

- fix broken focus ring and scrolling ([6e30737](https://bitbucket.org/atlassian/atlaskit/commits/6e30737))

## 2.6.2 (2017-02-09)

- fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 2.6.1 (2017-02-09)

- clear input field when an item is selected ([95fbd48](https://bitbucket.org/atlassian/atlaskit/commits/95fbd48))

## 2.6.0 (2017-02-09)

- fix; selected items now appending themselves, not prepending ([dc563f9](https://bitbucket.org/atlassian/atlaskit/commits/dc563f9))

## 2.5.1 (2017-02-09)

- fix; fix height of the multi-select ([2eacf9f](https://bitbucket.org/atlassian/atlaskit/commits/2eacf9f))
- feature; isFocusedInitially implemented ([5747dd7](https://bitbucket.org/atlassian/atlaskit/commits/5747dd7))

## 2.4.0 (2017-02-08)

- feature; placeholder is implemented ([02d4946](https://bitbucket.org/atlassian/atlaskit/commits/02d4946))

## 2.3.1 (2017-02-07)

- multi select now closes itself after an item is selected ([a0dae54](https://bitbucket.org/atlassian/atlaskit/commits/a0dae54))
- update to the latest field base with the correct design ([ce38252](https://bitbucket.org/atlassian/atlaskit/commits/ce38252))
- feature; isInvalid, isRequired, isDisabled, isFirstChild properties are implemented ([f2b1b4f](https://bitbucket.org/atlassian/atlaskit/commits/f2b1b4f))

## 2.3.0 (2017-02-07)

- feature; 'default selected' items are implemented ([6c0242a](https://bitbucket.org/atlassian/atlaskit/commits/6c0242a))

## 2.2.1 (2017-02-06)

- fix; return correct value when onChange for the values happens ([d7b4e2f](https://bitbucket.org/atlassian/atlaskit/commits/d7b4e2f))

## 2.2.0 (2017-02-06)

- feature; support for the native submit is implemented ([dcc969a](https://bitbucket.org/atlassian/atlaskit/commits/dcc969a))

## 2.1.0 (2017-02-03)

- basic autocomplete is implemented ([98df620](https://bitbucket.org/atlassian/atlaskit/commits/98df620))
- noMatchesFound prop was added ([918b7cf](https://bitbucket.org/atlassian/atlaskit/commits/918b7cf))
