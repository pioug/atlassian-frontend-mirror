# @atlaskit/single-select

## 10.0.7

### Patch Changes

- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Internal changes to remove `@atlaskit/theme/math` usage.
- Updated dependencies

## 10.0.6

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 10.0.5

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.
- Updated dependencies

## 10.0.4

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 10.0.3

### Patch Changes

- Updated dependencies

## 10.0.2

### Patch Changes

- [`30853172ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30853172ff) - Reset babel config back to ie11 to prevent runtime issues in Jira and to unbreak the Confluence es5-check

## 10.0.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 10.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 9.0.4

### Patch Changes

- Updated dependencies

## 9.0.3

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 9.0.2

### Patch Changes

- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies
- Updated dependencies

## 9.0.1

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
  - @atlaskit/theme@9.5.1

## 9.0.0

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

## 8.0.14

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 8.0.13

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 8.0.12

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 8.0.11

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 8.0.10

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 8.0.9

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 8.0.8

### Patch Changes

- [patch][d905cbc0ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d905cbc0ac):

  Adding a condition to check if the component are referenced in tests running in CI. It reduces the noise and help reading the CI log.

## 8.0.7

### Patch Changes

- [patch][226a5fece8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/226a5fece8):

  Upating deprecation messages and adding console warning to improve visibility

## 8.0.6

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/button@13.0.9
  - @atlaskit/droplist@9.0.8
  - @atlaskit/field-base@13.0.6
  - @atlaskit/section-message@4.0.5
  - @atlaskit/icon@19.0.0

## 8.0.5

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 8.0.4

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/button@13.0.8
  - @atlaskit/droplist@9.0.4
  - @atlaskit/field-base@13.0.4
  - @atlaskit/section-message@4.0.2
  - @atlaskit/icon@18.0.0

## 8.0.3

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 8.0.2

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
  - @atlaskit/button@13.0.4
  - @atlaskit/droplist@9.0.2
  - @atlaskit/field-base@13.0.1
  - @atlaskit/spinner@12.0.0

## 8.0.1

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/avatar@16.0.2
  - @atlaskit/icon@17.1.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 8.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 7.0.3

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/button@12.0.3
  - @atlaskit/droplist@8.0.5
  - @atlaskit/field-base@12.0.2
  - @atlaskit/icon@16.0.9
  - @atlaskit/section-message@2.0.3
  - @atlaskit/spinner@10.0.7
  - @atlaskit/theme@8.1.7

## 7.0.2

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/avatar@15.0.3
  - @atlaskit/droplist@8.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/section-message@2.0.2
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 7.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/avatar@15.0.1
  - @atlaskit/droplist@8.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/section-message@2.0.1
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 7.0.0

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

## 6.0.12

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/avatar@14.1.8
  - @atlaskit/button@10.1.2
  - @atlaskit/droplist@7.0.18
  - @atlaskit/field-base@11.0.14
  - @atlaskit/section-message@1.0.16
  - @atlaskit/icon@16.0.0

## 6.0.11

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/avatar@14.1.7
  - @atlaskit/button@10.1.1
  - @atlaskit/droplist@7.0.17
  - @atlaskit/field-base@11.0.13
  - @atlaskit/icon@15.0.2
  - @atlaskit/section-message@1.0.14
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 6.0.10

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/droplist@7.0.16
  - @atlaskit/field-base@11.0.12
  - @atlaskit/icon@15.0.1
  - @atlaskit/section-message@1.0.13
  - @atlaskit/spinner@9.0.12
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6

## 6.0.9

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/avatar@14.1.5
  - @atlaskit/button@10.0.1
  - @atlaskit/droplist@7.0.14
  - @atlaskit/field-base@11.0.11
  - @atlaskit/section-message@1.0.12
  - @atlaskit/icon@15.0.0

## 6.0.8

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/avatar@14.1.4
  - @atlaskit/droplist@7.0.13
  - @atlaskit/icon@14.6.1
  - @atlaskit/section-message@1.0.11
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 6.0.7

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 6.0.6

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/button@9.0.13
  - @atlaskit/droplist@7.0.10
  - @atlaskit/field-base@11.0.8
  - @atlaskit/section-message@1.0.8
  - @atlaskit/icon@14.0.0

## 6.0.5

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 6.0.4

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/spinner@9.0.6
  - @atlaskit/section-message@1.0.5
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-base@11.0.5
  - @atlaskit/droplist@7.0.7
  - @atlaskit/button@9.0.6
  - @atlaskit/avatar@14.0.8
  - @atlaskit/docs@5.0.6

## 6.0.3

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/icon@13.2.2
  - @atlaskit/section-message@1.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/docs@5.0.2
  - @atlaskit/droplist@7.0.4
  - @atlaskit/avatar@14.0.5
  - @atlaskit/field-base@11.0.2

## 6.0.2

- [patch] Update docs, change dev deps [25d6e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d6e48)
- [none] Updated dependencies [25d6e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d6e48)
  - @atlaskit/avatar@14.0.3

## 6.0.1

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/button@9.0.2
  - @atlaskit/spinner@9.0.2
  - @atlaskit/docs@5.0.1
  - @atlaskit/droplist@7.0.2
  - @atlaskit/avatar@14.0.2

## 6.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/field-base@11.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/droplist@7.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/field-base@11.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/droplist@7.0.0
  - @atlaskit/avatar@14.0.0

## 5.2.5

- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/button@8.2.5
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/button@8.2.5

## 5.2.4

- [patch] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0

## 5.2.3

- [patch] Button should be a dev dependency [50ca31b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ca31b)
- [none] Updated dependencies [50ca31b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ca31b)

## 5.2.2

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/field-base@10.1.3
  - @atlaskit/droplist@6.2.1
  - @atlaskit/button@8.2.3

## 5.2.1

- [patch] Fix \$FlowFixMe and release packages [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/button@8.2.2
  - @atlaskit/spinner@7.1.1
  - @atlaskit/icon@12.3.1
  - @atlaskit/avatar@11.2.1

## 5.2.0

- [minor] Fixes types for Flow 0.74 [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [none] Updated dependencies [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
  - @atlaskit/button@8.2.0
  - @atlaskit/spinner@7.1.0
  - @atlaskit/icon@12.2.0
  - @atlaskit/avatar@11.2.0

## 5.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/field-base@10.1.2
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/spinner@7.0.2
  - @atlaskit/icon@12.1.2
  - @atlaskit/droplist@6.1.2

## 5.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/spinner@7.0.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/field-base@10.1.1
  - @atlaskit/droplist@6.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/avatar@11.1.1
  - @atlaskit/docs@4.1.1

## 5.1.0

- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/avatar@11.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/field-base@10.1.0
  - @atlaskit/droplist@6.1.0
  - @atlaskit/button@8.1.0

## 5.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/icon@12.0.0
  - @atlaskit/field-base@10.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/droplist@6.0.0
  - @atlaskit/avatar@11.0.0

## 4.0.3

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/field-base@9.0.3
  - @atlaskit/droplist@5.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4

## 4.0.2

- [patch] Export types for Single select [dd51dad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd51dad)
- [none] Updated dependencies [dd51dad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd51dad)

## 4.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 3.3.4

- [patch] Makes packages Flow types compatible with version 0.67 [25daac0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25daac0)

## 3.3.2

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 3.3.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 3.2.4

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 3.2.3

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 3.2.2

- [patch] Fixes dependency on @atlaskit/webdriver-runner to be a devDependency [4567857](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4567857)

## 3.2.1

## 3.2.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 3.1.4

- [patch] Remove index.js from root, fix flow type, remove react from dep [4f1e6d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4f1e6d1)

## 3.1.3

- [patch] Migrate signle-select to atlaskit-mk-2 repo [ee8d580](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee8d580)

## 3.1.2 (2017-11-24)

- bug fix; prevent inline-dialog from closing when event is prevented and prevent default for c (issues closed: ak-3870) ([8ae0c3b](https://bitbucket.org/atlassian/atlaskit/commits/8ae0c3b))

## 3.1.1 (2017-11-24)

- bug fix; fix single select dropdown not closing on blur (issues closed: ak-3916) ([ae1d589](https://bitbucket.org/atlassian/atlaskit/commits/ae1d589))

## 3.1.0 (2017-11-23)

- feature; hide groups without matches when filtering single-select component ([e5dde4b](https://bitbucket.org/atlassian/atlaskit/commits/e5dde4b))

## 3.0.1 (2017-11-13)

- bug fix; fix single select focus in IE11 (issues closed: ak-3832) ([2b83759](https://bitbucket.org/atlassian/atlaskit/commits/2b83759))

## 3.0.0 (2017-10-26)

- breaking; If your item.content is JSX (instead of a string) then you must also supply the new item.label ([9d61a1b](https://bitbucket.org/atlassian/atlaskit/commits/9d61a1b))
- breaking; select items with JSX content now behave correctly (issues closed: ak-3505) ([9d61a1b](https://bitbucket.org/atlassian/atlaskit/commits/9d61a1b))

## 2.0.5 (2017-10-26)

- bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 2.0.4 (2017-10-22)

- bug fix; update styled-components dep and react peerDep ([6a67bf8](https://bitbucket.org/atlassian/atlaskit/commits/6a67bf8))

## 2.0.3 (2017-10-18)

- bug fix; updated icon dependency to fix IE 11 issues (issues closed: ak-3709) ([8e93274](https://bitbucket.org/atlassian/atlaskit/commits/8e93274))

## 2.0.2 (2017-10-16)

- bug fix; disabled native autocomplete on the autocomplete component (issues closed: ak-3691) ([c4fd697](https://bitbucket.org/atlassian/atlaskit/commits/c4fd697))

## 2.0.1 (2017-09-11)

- bug fix; standardise placeholders (issues closed: #ak-3406) ([95187e1](https://bitbucket.org/atlassian/atlaskit/commits/95187e1))

## 2.0.0 (2017-09-06)

- bug fix; fix how gridsize is implemented in styles ([586d583](https://bitbucket.org/atlassian/atlaskit/commits/586d583))
- feature; bump field base component for dark mode ([df986db](https://bitbucket.org/atlassian/atlaskit/commits/df986db))
- breaking; Dark mode added for single-select, util-shared-styles removed ([df016de](https://bitbucket.org/atlassian/atlaskit/commits/df016de))
- breaking; darkmode added for single-select ([df016de](https://bitbucket.org/atlassian/atlaskit/commits/df016de))

## 1.19.1 (2017-09-05)

- bug fix; removing unused focus outline from single-select triggers. Fieldbase handles the glo ([7792b87](https://bitbucket.org/atlassian/atlaskit/commits/7792b87))

## 1.19.0 (2017-08-31)

- feature; added loading state for the initial fetching of data on the single-select component (issues closed: ak-3181) ([473effe](https://bitbucket.org/atlassian/atlaskit/commits/473effe))

## 1.18.0 (2017-08-22)

- feature; single select items now support filterValues which, when present, are used instead (issues closed: ak-3348) ([523f485](https://bitbucket.org/atlassian/atlaskit/commits/523f485))

## 1.17.4 (2017-08-21)

- bug fix; fixes bug in single select that would cause the shouldFocus prop to not work on initia ([1a13257](https://bitbucket.org/atlassian/atlaskit/commits/1a13257))

## 1.17.3 (2017-08-11)

- bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))

## 1.17.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 1.17.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 1.13.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))
- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 1.12.1 (2017-07-17)

- fix; replace "\*" with last version of tooltip "1.2.0" ([769c35d](https://bitbucket.org/atlassian/atlaskit/commits/769c35d))
- feature; adds maxHeight prop to single-select ([296a6e1](https://bitbucket.org/atlassian/atlaskit/commits/296a6e1))

## 1.12.0 (2017-06-29)

- feature; single select has shouldFlip prop that sets whether the droplist should flip its po ([b31523a](https://bitbucket.org/atlassian/atlaskit/commits/b31523a))

## 1.11.0 (2017-06-01)

- feature; add invalidMessage to single-select ([5b30d9a](https://bitbucket.org/atlassian/atlaskit/commits/5b30d9a))

## 1.10.2 (2017-05-31)

- fix; bump field-base in single-select to fix invalid icon ([493a339](https://bitbucket.org/atlassian/atlaskit/commits/493a339))
- fix; items now rendered with the correct type ([8761a17](https://bitbucket.org/atlassian/atlaskit/commits/8761a17))
- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

## 1.10.1 (2017-05-25)

- fix; opening droplist should focus autocomplete field ([1d3f188](https://bitbucket.org/atlassian/atlaskit/commits/1d3f188))

## 1.10.0 (2017-05-11)

- feature; bump field-base version in single-select ([fcd6dfa](https://bitbucket.org/atlassian/atlaskit/commits/fcd6dfa))

## 1.8.0 (2017-05-10)

- fix; fixed imports for icons ([7999eae](https://bitbucket.org/atlassian/atlaskit/commits/7999eae))
- feature; add tooltip support. ([b7445b1](https://bitbucket.org/atlassian/atlaskit/commits/b7445b1))
- feature; bump icon to 6.5.2 version ([92daa36](https://bitbucket.org/atlassian/atlaskit/commits/92daa36))

## 1.7.5 (2017-05-08)

- fix; single select - removed ability to control a disabled single-select with the keyboar ([b9102fb](https://bitbucket.org/atlassian/atlaskit/commits/b9102fb))
- fix; single-select - fix groups selecting multiple options ([2a7f469](https://bitbucket.org/atlassian/atlaskit/commits/2a7f469))

## 1.7.3 (2017-04-27)

- fix; allow single-select droplist to be wider than the parent ([2ddd9a4](https://bitbucket.org/atlassian/atlaskit/commits/2ddd9a4))
- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 1.7.2 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 1.7.1 (2017-04-20)

- fix; improve the behaviour of SingleSelect's shouldFocus prop ([edcc82e](https://bitbucket.org/atlassian/atlaskit/commits/edcc82e))

## 1.7.0 (2017-04-20)

- fix; upgrade droplist dependency version ([0dd084d](https://bitbucket.org/atlassian/atlaskit/commits/0dd084d))
- feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))
- temporarily revert changes ([8d22c2d](https://bitbucket.org/atlassian/atlaskit/commits/8d22c2d))

## 1.5.1 (2017-03-23)

- fix; prevent default action if Enter pressed then Select is open ([2e78967](https://bitbucket.org/atlassian/atlaskit/commits/2e78967))
- fix; updates and descriptions ([ec8aca1](https://bitbucket.org/atlassian/atlaskit/commits/ec8aca1))
- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))
- feature; selected items will now render their elemBefore content in the select field ([31fa403](https://bitbucket.org/atlassian/atlaskit/commits/31fa403))

## 1.4.1 (2017-03-20)

- fix; select now closes itself after clicking on the trigger ([46638c1](https://bitbucket.org/atlassian/atlaskit/commits/46638c1))
- feature; shouldWrapEditViewWithFieldBase prop on inline-edit and style fixes for single-sele ([4946f21](https://bitbucket.org/atlassian/atlaskit/commits/4946f21))

## 1.4.0 (2017-02-24)

- fix bug when focus doesn't work with previously selected item ([53493ae](https://bitbucket.org/atlassian/atlaskit/commits/53493ae))
- fix bug where only every second item was selected ([bbd09cf](https://bitbucket.org/atlassian/atlaskit/commits/bbd09cf))
- fix the 'dummy search' behavior when dropdown is open ([4176ab3](https://bitbucket.org/atlassian/atlaskit/commits/4176ab3))
- replace null to undefined and fix broken tests ([682506e](https://bitbucket.org/atlassian/atlaskit/commits/682506e))
- small fixes after review ([d356301](https://bitbucket.org/atlassian/atlaskit/commits/d356301))

## 1.3.0 (2017-02-23)

- dummy search is implemented ([cc26e47](https://bitbucket.org/atlassian/atlaskit/commits/cc26e47))

## 1.2.1 (2017-02-22)

- prevent default behavior for 'up' and 'down' key ([86a4716](https://bitbucket.org/atlassian/atlaskit/commits/86a4716))

## 1.2.0 (2017-02-20)

- feature; selects should support different appearances ([961bd5c](https://bitbucket.org/atlassian/atlaskit/commits/961bd5c))
- single select with autocomplete is implemented ([4b22219](https://bitbucket.org/atlassian/atlaskit/commits/4b22219))

## 1.1.0 (2017-02-19)

- feature; Select is now submittable ([5f66784](https://bitbucket.org/atlassian/atlaskit/commits/5f66784))

## 1.0.8 (2017-02-17)

- fix; add a story with groups in single-select ([5c9fbc8](https://bitbucket.org/atlassian/atlaskit/commits/5c9fbc8))

## 1.0.7 (2017-02-15)

- height of the dropdown list is calculated correctly now ([baaedc7](https://bitbucket.org/atlassian/atlaskit/commits/baaedc7))

## 1.0.5 (2017-02-14)

- fix broken focus ring and scrolling ([6e30737](https://bitbucket.org/atlassian/atlaskit/commits/6e30737))

## 1.0.4 (2017-02-09)

- fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.0.3 (2017-02-07)

- update to the latest field base with the correct design ([ce38252](https://bitbucket.org/atlassian/atlaskit/commits/ce38252))

## 1.0.2 (2017-02-03)

- fix; fix the component name in usage.md ([28e796f](https://bitbucket.org/atlassian/atlaskit/commits/28e796f))
