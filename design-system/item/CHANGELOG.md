# @atlaskit/item

## 12.0.6

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 12.0.5

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.

## 12.0.4

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 12.0.3

### Patch Changes

- Updated dependencies

## 12.0.2

### Patch Changes

- [`30853172ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30853172ff) - Reset babel config back to ie11 to prevent runtime issues in Jira and to unbreak the Confluence es5-check

## 12.0.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 12.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 11.0.3

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 11.0.2

### Patch Changes

- [patch][8b9598a760](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b9598a760):

  Follow-up for AFP-1401, remove types and annotations.- [patch][eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):

  Follow-up on AFP-1401 when removing types to component. Some left over types and small issues- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/avatar@17.1.9
  - @atlaskit/lozenge@9.1.6
  - @atlaskit/tooltip@15.2.5

## 11.0.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/avatar@17.1.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/lozenge@9.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3

## 11.0.0

### Major Changes

- [major][c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):

  BREAKING CHANGE: As part of AFP-1404, we are dropping flow support. It means that those packages are not typed. Consumer will need to manually add their types to the component.Background ticket: https://product-fabric.atlassian.net/browse/AFP-1397Plan: https://product-fabric.atlassian.net/wiki/spaces/AFP/pages/1052870901/Drop+Flow+Support+Plan

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/icon@20.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/docs@8.3.1
  - @atlaskit/tooltip@15.2.2

## 10.2.0

### Minor Changes

- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Allowing support for using with new react-beautiful-dnd 12.x API

### Patch Changes

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/tooltip@15.2.0
  - @atlaskit/avatar@17.1.5

## 10.1.6

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 10.1.5

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 10.1.4

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 10.1.3

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 10.1.2

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 10.1.1

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 10.1.0

### Minor Changes

- [minor][2580f7493e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2580f7493e):

  Allows the width to be customised via theme

## 10.0.6

### Patch Changes

- [patch][64850480b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64850480b6):

  Reintroduces dist/cjs builds

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 10.0.5

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/icon@19.0.0

## 10.0.4

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 10.0.3

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/avatar@16.0.4
  - @atlaskit/icon@18.0.1
  - @atlaskit/tooltip@15.0.0

## 10.0.2

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/icon@18.0.0

## 10.0.1

- Updated dependencies [ed41cac6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed41cac6ac):
  - @atlaskit/theme@9.0.3
  - @atlaskit/lozenge@9.0.0

## 10.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 9.0.1

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/icon@16.0.9
  - @atlaskit/lozenge@7.0.2
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 9.0.0

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

## 8.0.15

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/avatar@14.1.8
  - @atlaskit/tooltip@12.1.15
  - @atlaskit/icon@16.0.0

## 8.0.14

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/avatar@14.1.7
  - @atlaskit/icon@15.0.2
  - @atlaskit/lozenge@6.2.4
  - @atlaskit/theme@7.0.1
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/docs@6.0.0

## 8.0.13

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/icon@15.0.1
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6
  - @atlaskit/lozenge@6.2.3

## 8.0.12

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/avatar@14.1.5
  - @atlaskit/tooltip@12.1.11
  - @atlaskit/icon@15.0.0

## 8.0.11

- [patch] Consume smallFontSize from @atlaskit/theme [a6f8a43](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6f8a43)

## 8.0.10

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 8.0.9

- [patch] Fixing selected style for Item and Fixing focus on Quick search when component is not remounted [9532a1b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9532a1b)

## 8.0.8

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/icon@14.0.0

## 8.0.7

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 8.0.5

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/lozenge@6.1.5
  - @atlaskit/icon@13.2.5
  - @atlaskit/avatar@14.0.8
  - @atlaskit/docs@5.0.6

## 8.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/lozenge@6.1.4
  - @atlaskit/icon@13.2.4
  - @atlaskit/avatar@14.0.6

## 8.0.3

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/theme@5.1.2
  - @atlaskit/lozenge@6.1.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/avatar@14.0.5

## 8.0.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/tooltip@12.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/lozenge@6.1.2
  - @atlaskit/icon@13.2.1
  - @atlaskit/avatar@14.0.4

## 8.0.1

- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/icon@13.1.1
  - @atlaskit/avatar@14.0.1

## 8.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar@14.0.0

## 7.0.8

- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0

## 7.0.7

- [patch] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0

## 7.0.6

- [patch] Fix getThemeStyle to support some valid falsy values [4f1894e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4f1894e)
- [none] Updated dependencies [4f1894e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4f1894e)

## 7.0.5

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/theme@4.0.4
  - @atlaskit/lozenge@5.0.4
  - @atlaskit/icon@12.1.2

## 7.0.4

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/lozenge@5.0.3
  - @atlaskit/icon@12.1.1
  - @atlaskit/avatar@11.1.1
  - @atlaskit/docs@4.1.1

## 7.0.3

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/tooltip@10.2.0
  - @atlaskit/avatar@11.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/lozenge@5.0.2

## 7.0.2

- [patch] Fixing onKeyDown callback on AkNavigationItem. [44137ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44137ed)
- [none] Updated dependencies [44137ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44137ed)

## 7.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/tooltip@10.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/lozenge@5.0.1
  - @atlaskit/docs@4.0.1
  - @atlaskit/avatar@11.0.1

## 7.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/lozenge@5.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/avatar@11.0.0

## 6.0.3

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/theme@3.2.2
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4
  - @atlaskit/lozenge@4.0.1

## 6.0.1

- [patch] Fix item content being cut off in windows due to line-height and font anti-aliasing issues [0b4181d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0b4181d)

## 6.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 5.1.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 5.1.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 5.0.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 5.0.1

- [patch] fixes AK-4178 , added fix for double color icon in navigation [c6121d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6121d6)

## 5.0.0

- [major] update navigation and item's usage of react-beautiful-dnd from 2.x to 4.x. [aeefa01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aeefa01)

## 4.2.11

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 4.2.10

- [patch] item will now always render a linkComponent when provided. fixes bug whereby it was only rendered if the href prop was also set. [df1a14d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df1a14d)

## 4.2.8

- [patch] Mark packages as internal [016d74d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/016d74d)

## 4.2.7

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 4.2.6

- [patch] Updated inline-edit test type, migrated item, updated pagination imports to account for removed root index file [b48c074](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b48c074)

## 4.2.5 (2017-11-28)

- bug fix; fix AK-3666 ([278a34c](https://bitbucket.org/atlassian/atlaskit/commits/278a34c))

## 4.2.4 (2017-11-23)

- bug fix; fix default item theme before & after elem spacing not working ([9b025b5](https://bitbucket.org/atlassian/atlaskit/commits/9b025b5))

## 4.2.3 (2017-11-20)

- bug fix; fS-3907 Use content attribute instead of description for Tooltip ([25c9604](https://bitbucket.org/atlassian/atlaskit/commits/25c9604))
- bug fix; fS-3907 Bump tooltip version in icon, item and util-shared-styles ([6d20540](https://bitbucket.org/atlassian/atlaskit/commits/6d20540))

## 4.2.2 (2017-11-17)

- bug fix; bumping internal dependencies to the latest major version ([005780c](https://bitbucket.org/atlassian/atlaskit/commits/005780c))

## 4.2.1 (2017-10-27)

- bug fix; fix typing ([cbaa440](https://bitbucket.org/atlassian/atlaskit/commits/cbaa440))

## 4.2.0 (2017-10-23)

- feature; move HOC from dropdown to item ([f48e6bf](https://bitbucket.org/atlassian/atlaskit/commits/f48e6bf))

## 4.1.4 (2017-10-22)

- bug fix; update styled component dependency and react peerDep ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))

## 4.1.3 (2017-10-16)

- bug fix; selected items now receive hover style as expected (issues closed: ak-3650) ([f8f4510](https://bitbucket.org/atlassian/atlaskit/commits/f8f4510))

## 4.1.2 (2017-10-12)

- bug fix; bumps version of Page (issues closed: ak-3680) ([8713649](https://bitbucket.org/atlassian/atlaskit/commits/8713649))

## 4.1.1 (2017-10-05)

- bug fix; fix item line height ([ec6a01f](https://bitbucket.org/atlassian/atlaskit/commits/ec6a01f))

## 4.1.0 (2017-09-27)

- feature; convert item to use theme package ([e860165](https://bitbucket.org/atlassian/atlaskit/commits/e860165))

## 4.0.0 (2017-09-19)

- breaking; item theme accepts top/right/bottom/left options for padding rather than x/y ([bedf215](https://bitbucket.org/atlassian/atlaskit/commits/bedf215))
- breaking; item theme accepts top/right/bottom/left options for padding rather than x/y (issues closed: ak-3418) ([bedf215](https://bitbucket.org/atlassian/atlaskit/commits/bedf215))

## 3.1.4 (2017-09-11)

- bug fix; selected item text colour is now unchanged when hovered (issues closed: ak-3308) ([e8be246](https://bitbucket.org/atlassian/atlaskit/commits/e8be246))

## 3.1.3 (2017-09-06)

- bug fix; compact items now have tighter spacing (issues closed: ak-3441) ([c378809](https://bitbucket.org/atlassian/atlaskit/commits/c378809))

## 3.1.2 (2017-09-05)

- bug fix; add defensive styles to link items to prevent CSS resets overwriting colour etc. (issues closed: ak-3391) ([4fa64a6](https://bitbucket.org/atlassian/atlaskit/commits/4fa64a6))

## 3.1.1 (2017-08-24)

- bug fix; fix alignment of navigation item group action (issues closed: ak-3279) ([4f98025](https://bitbucket.org/atlassian/atlaskit/commits/4f98025))

## 3.1.0 (2017-08-22)

- feature; accept new ItemGroup.role prop (still defaults to "group") (issues closed: ak-3325) ([747d3da](https://bitbucket.org/atlassian/atlaskit/commits/747d3da))

## 3.0.0 (2017-08-18)

- bug fix; removing log command and moved some things to variables. ([0ec36f2](https://bitbucket.org/atlassian/atlaskit/commits/0ec36f2))
- feature; reverting back to the original Item theme, but adding before/after theming ([cc7da77](https://bitbucket.org/atlassian/atlaskit/commits/cc7da77))
- breaking; ContainerTitleDropdown rebuilt to use Item and Dropdown under the hood. No longer accepts a ([026ea83](https://bitbucket.org/atlassian/atlaskit/commits/026ea83))
- breaking; refactor of Item and Navigation to support Project Switcher dropdown menus ([026ea83](https://bitbucket.org/atlassian/atlaskit/commits/026ea83))
- feature; added new spacing prop for Items ([414757f](https://bitbucket.org/atlassian/atlaskit/commits/414757f))

## 2.2.3 (2017-08-18)

- bug fix; fix navigation group title rendering action button twice (issues closed: ak-3219) ([b82bc4c](https://bitbucket.org/atlassian/atlaskit/commits/b82bc4c))

## 2.2.2 (2017-08-11)

- bug fix; deprecating @atlaskit/drag-and-drop. It has been moved to react-natural-drag ([7183656](https://bitbucket.org/atlassian/atlaskit/commits/7183656))

## 2.2.1 (2017-08-07)

- bug fix; moving item spacing responsiblity from middle to before and after icons (issues closed: ak-3211) ([be80f99](https://bitbucket.org/atlassian/atlaskit/commits/be80f99))

## 2.2.0 (2017-08-03)

- feature; improving support and examples for drag and drop in navigation (issues closed: ak-1862) ([c1e0986](https://bitbucket.org/atlassian/atlaskit/commits/c1e0986))

## 2.1.0 (2017-07-28)

- fix; disable flex styling on item component to ensure expected height ([cdcada1](https://bitbucket.org/atlassian/atlaskit/commits/cdcada1))
- feature; add support for [@atlaskit](https://github.com/atlaskit)/drag-and-drop in [@atlaskit](https://github.com/atlaskit)/item ([8caee18](https://bitbucket.org/atlassian/atlaskit/commits/8caee18))

## 1.0.0 (2017-07-21)

- feature; generic item component to be composed into other components ([36ebd08](https://bitbucket.org/atlassian/atlaskit/commits/36ebd08))
