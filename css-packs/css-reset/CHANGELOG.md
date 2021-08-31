# @atlaskit/css-reset

## 6.1.3

### Patch Changes

- Updated dependencies

## 6.1.2

### Patch Changes

- Updated dependencies

## 6.1.1

### Patch Changes

- Updated dependencies

## 6.1.0

### Minor Changes

- [`92620c3aa0d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/92620c3aa0d) - [ux] Reduced motion support has been added to the CSS reset.
- [`950a744a150`](https://bitbucket.org/atlassian/atlassian-frontend/commits/950a744a150) - [ux] Color values now sourced through tokens.

### Patch Changes

- Updated dependencies

## 6.0.5

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 6.0.4

### Patch Changes

- [`cdfd30ef56`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cdfd30ef56) - Bumping dep for fbjs util and moving it to a devDep for css-reset

## 6.0.3

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 6.0.2

### Patch Changes

- Updated dependencies

## 6.0.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 6.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 5.0.12

### Patch Changes

- [`82a7c30a60`](https://bitbucket.org/atlassian/atlassian-frontend/commits/82a7c30a60) - The module:es2019 field for css-reset should also point to bundle.css instead of a js file

## 5.0.11

### Patch Changes

- [`c2dbd2384c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2dbd2384c) - FIX: Override for the default button font style introduced in latest Chrome 83.x.x.x

## 5.0.10

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/theme@9.5.1

## 5.0.9

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 5.0.8

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 5.0.7

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 5.0.6

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 5.0.5

### Patch Changes

- [patch][f34776be97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f34776be97):

  Type definition files are now referenced in package.json

## 5.0.4

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 5.0.3

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 5.0.2

### Patch Changes

- [patch][7cf5934805](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cf5934805):

  Update pkg.module to be same as pkg.main = dist/bundle.css

## 5.0.1

### Patch Changes

- [patch][20da6280cb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/20da6280cb):

  Replace babel/node with ts-node for building css

## 5.0.0

- [major][bfb006f65a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bfb006f65a):

  - css-reset has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 4.0.1

- [patch][52868d4352](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/52868d4352):

  - Fixed regression of font-weight for <small> elements

## 4.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 3.0.8

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/theme@8.1.7

## 3.0.7

- [patch][6c0d9da30e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c0d9da30e):

  - Removes deprecated css property text-decoration-skip: ink. Users should no longer see a warning to update the property.

## 3.0.6

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/docs@7.0.0
  - @atlaskit/theme@8.0.0

## 3.0.5

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 3.0.4

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/theme@7.0.0

## 3.0.3

- [patch][ef9931d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef9931d):

  - Fix issues with ; due to prettier

## 3.0.2

- [patch] Moved to @atlaskit/theme for all the values from util-shared-styles [6d35164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d35164)

## 3.0.1

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/docs@5.0.2

## 3.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/docs@5.0.0

## 2.0.8

- [patch] Fix flow config and add back flow fix me [107da09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/107da09)
- [none] Updated dependencies [107da09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/107da09)

## 2.0.7

- [patch] Remove or update \$FlowFixMe [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)

## 2.0.6

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)

## 2.0.5

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/docs@4.1.1

## 2.0.4

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/docs@4.1.0

## 2.0.3

- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/docs@4.0.0

## 2.0.2

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/docs@3.0.4

## 2.0.1

- [patch] Remove negative spacing [ac73181](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac73181)

## 2.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 1.2.3

- [patch] Fixed main styles in IE11 [5aa8105](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5aa8105)

## 1.2.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 1.2.1

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 1.2.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 1.1.7

- [patch] migrated css reset from ak to ak-mk2 [53ce5eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/53ce5eb)

## 1.1.6 (2017-11-30)

- bug fix; release stories with fixed console errors ([3321c2b](https://bitbucket.org/atlassian/atlaskit/commits/3321c2b))

## 1.1.5 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 1.1.4 (2017-05-24)

- fix; fixing webkit code font issue ([2f0ee47](https://bitbucket.org/atlassian/atlaskit/commits/2f0ee47))

## 1.1.3 (2017-05-11)

- fix; use ADG 3 font family for code and kbd tags ([37ac71a](https://bitbucket.org/atlassian/atlaskit/commits/37ac71a))

## 1.1.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 1.1.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 1.1.0 (2017-04-20)

- feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 1.0.5 (2017-03-23)

- fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.0.3 (2017-03-21)

## 1.0.3 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.2 (2017-02-07)

## 1.0.1 (2017-02-06)

- fix; Updates package to use scoped ak packages ([58fd6c5](https://bitbucket.org/atlassian/atlaskit/commits/58fd6c5))
- fix; correct package name in css-reset docs ([670ec8f](https://bitbucket.org/atlassian/atlaskit/commits/670ec8f))
