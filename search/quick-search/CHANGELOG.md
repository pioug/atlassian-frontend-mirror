# @atlaskit/quick-search

## 8.0.9

### Patch Changes

- Updated dependencies

## 8.0.8

### Patch Changes

- [`ea354666ca2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea354666ca2) - Added testid to default ObjectResult's AvatarImage.
- Updated dependencies

## 8.0.7

### Patch Changes

- [`524b20aff9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/524b20aff9a) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs
- [`3c0349f272a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c0349f272a) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs
- [`591d34f966f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/591d34f966f) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs

## 8.0.6

### Patch Changes

- [`7fc13cf50a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7fc13cf50a2) - Fixes interal test referencing a compponent directly.
- Updated dependencies

## 8.0.5

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 8.0.4

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 8.0.3

### Patch Changes

- Updated dependencies

## 8.0.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 8.0.1

### Patch Changes

- Updated dependencies

## 8.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 7.8.9

### Patch Changes

- Updated dependencies

## 7.8.8

### Patch Changes

- Updated dependencies

## 7.8.7

### Patch Changes

- [`649f69b6d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/649f69b6d7) - Patch all packages that are used by confluence that have a broken es2019 dist

## 7.8.6

### Patch Changes

- [`131cee6d7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/131cee6d7a) - Add missing tslib dependency

## 7.8.5

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics@7.0.1
  - @atlaskit/avatar@17.1.7
  - @atlaskit/drawer@5.3.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/item@11.0.1
  - @atlaskit/navigation@36.0.1
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1

## 7.8.4

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/analytics@7.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/item@11.0.0
  - @atlaskit/navigation@36.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/docs@8.3.1
  - @atlaskit/drawer@5.3.1

## 7.8.3

### Patch Changes

- [patch][36f6e99c5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36f6e99c5b):

  Fix type errors caused when generating declaration files

## 7.8.2

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fix quicksearch text input when using an IME (affects Japanese/Chinese users)

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/avatar@17.1.5
  - @atlaskit/drawer@5.2.0
  - @atlaskit/item@10.2.0
  - @atlaskit/navigation@35.3.0

## 7.8.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 7.8.0

### Minor Changes

- [minor][bff5be0d46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bff5be0d46):

  Quick search autocomplete analytics instrumentation

## 7.7.2

### Patch Changes

- [patch][6aa50ae773](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6aa50ae773):

  remove use of deprecated FieldBase component in quick search

## 7.7.1

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/drawer@5.0.10
  - @atlaskit/item@10.1.5
  - @atlaskit/navigation@35.2.2
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 7.7.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 7.6.8

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 7.6.7

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 7.6.6

- Updated dependencies [75c64ee36a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75c64ee36a):
  - @atlaskit/drawer@5.0.0

## 7.6.5

### Patch Changes

- [patch][dd9ca0710e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd9ca0710e):

  Removed incorrect jsnext:main field from package.json

## 7.6.4

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 7.6.3

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 7.6.2

### Patch Changes

- [patch][5427f7028a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5427f7028a):

  Fixing problem with subtext colours not matching between pages and people in the Quick Search complex experiment.

## 7.6.1

### Patch Changes

- [patch][8f711664af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f711664af):

  Added analytics for current space filter component

## 7.6.0

### Minor Changes

- [minor][8d013cf28c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d013cf28c):

  added more filters button next to confluence current space filter

## 7.5.1

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/drawer@4.2.1
  - @atlaskit/field-base@13.0.6
  - @atlaskit/item@10.0.5
  - @atlaskit/navigation@35.1.8
  - @atlaskit/icon@19.0.0

## 7.5.0

### Minor Changes

- [minor][e6f5e7a694](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6f5e7a694):

  added current space filter for confluence

## 7.4.1

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/drawer@4.1.3
  - @atlaskit/field-base@13.0.4
  - @atlaskit/item@10.0.2
  - @atlaskit/navigation@35.1.5
  - @atlaskit/icon@18.0.0

## 7.4.0

### Minor Changes

- [minor][ad12f5342d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ad12f5342d):

  Internal refactor

## 7.3.0

- [minor][42b0b6f253](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42b0b6f253):

  - Adding autocomplete functionality to quick-search. New prop `autocomplete`.

## 7.2.0

- [minor][4d5fb33572](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d5fb33572):

  - Jira new design for advanced search

## 7.1.0

- [minor][5a49043dac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a49043dac):

  - Enable strictPropertyInitialization in tsconfig.base

## 7.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 6.1.2

- [patch][d3cad2622e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3cad2622e):

  - Removes babel-runtime in favour of @babel/runtime

## 6.1.1

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/drawer@3.0.7
  - @atlaskit/field-base@12.0.2
  - @atlaskit/icon@16.0.9
  - @atlaskit/item@9.0.1
  - @atlaskit/navigation@34.0.4
  - @atlaskit/theme@8.1.7

## 6.1.0

- [minor][038e080474](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/038e080474):

  - Expose inputControls as a prop for passing in additional controls to the search input box

## 6.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 6.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 5.4.1

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/icon@16.0.4
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics@5.0.0
  - @atlaskit/avatar@15.0.0
  - @atlaskit/drawer@3.0.0
  - @atlaskit/field-base@12.0.0
  - @atlaskit/item@9.0.0
  - @atlaskit/navigation@34.0.0
  - @atlaskit/theme@8.0.0

## 5.4.0

- [minor][7be03e992f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7be03e992f):

  - Add support to register callback for category selection change on advanced search

## 5.3.0

- [minor][25fffe3e00](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25fffe3e00):

  - ED-6228 Enable stricter types for quick-search package

## 5.2.5

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/avatar@14.1.8
  - @atlaskit/drawer@2.7.1
  - @atlaskit/field-base@11.0.14
  - @atlaskit/item@8.0.15
  - @atlaskit/navigation@33.3.9
  - @atlaskit/icon@16.0.0

## 5.2.4

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics@4.0.7
  - @atlaskit/avatar@14.1.7
  - @atlaskit/drawer@2.6.1
  - @atlaskit/field-base@11.0.13
  - @atlaskit/icon@15.0.2
  - @atlaskit/item@8.0.14
  - @atlaskit/navigation@33.3.8
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 5.2.3

- [patch][d498de7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d498de7):

  - Include type of result for boards and filters in jira search

## 5.2.2

- [patch][38debc1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38debc1):

  - trigger analytics on advanced search dropdown item clicked, disable jira people search

## 5.2.1

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/drawer@2.5.4
  - @atlaskit/field-base@11.0.12
  - @atlaskit/icon@15.0.1
  - @atlaskit/item@8.0.13
  - @atlaskit/navigation@33.3.7
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6

## 5.2.0

- [minor][347a474](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/347a474):

  - Added icon on selected to quick search results

## 5.1.2

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/avatar@14.1.5
  - @atlaskit/drawer@2.5.3
  - @atlaskit/field-base@11.0.11
  - @atlaskit/item@8.0.12
  - @atlaskit/navigation@33.3.6
  - @atlaskit/icon@15.0.0

## 5.1.1

- [patch][f480bab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f480bab):

  - Convert padding to margin to fix a scrolling issue in global-search

## 5.1.0

- [minor][e93ffe0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e93ffe0):

  - Change container result item to accept a react node as the subtext

## 5.0.0

- [major][2da04ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2da04ed):

  - Migrate component from flow to TypeScript. Upgrading should not cause any problems but we are releasing a new major version because of the amount of changes that were being made internally. Please reach out to the maintainers in case you are having trouble uprading to the latest version.

## 4.2.13

- [patch] Fixes styling of item captions and subtext [d0d45ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0d45ff)

## 4.2.12

- [patch] Fix sub text style. [5bdb0bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5bdb0bb)

## 4.2.11

- [patch] Add link to advanced issue search at the top of the jira pre query screen. [f0f66b7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0f66b7)

## 4.2.10

- [patch] Fixing selected style for Item and Fixing focus on Quick search when component is not remounted [9532a1b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9532a1b)

## 4.2.9

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/field-base@11.0.8
  - @atlaskit/item@8.0.8
  - @atlaskit/navigation@33.1.11
  - @atlaskit/icon@14.0.0

## 4.2.8

- [patch] Add support for Jira default icons for boards, filters and issues [deb791d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/deb791d)

## 4.2.7

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/navigation@33.1.5
  - @atlaskit/item@8.0.5
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-base@11.0.5
  - @atlaskit/avatar@14.0.8
  - @atlaskit/docs@5.0.6

## 4.2.6

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/navigation@33.1.3
  - @atlaskit/field-base@11.0.3
  - @atlaskit/theme@5.1.3
  - @atlaskit/analytics@4.0.4
  - @atlaskit/item@8.0.4
  - @atlaskit/icon@13.2.4
  - @atlaskit/avatar@14.0.6

## 4.2.5

- [patch] Make context prop optional [3f902d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f902d5)
- [none] Updated dependencies [3f902d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f902d5)

## 4.2.4

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/navigation@33.1.2
  - @atlaskit/item@8.0.3
  - @atlaskit/icon@13.2.2
  - @atlaskit/theme@5.1.2
  - @atlaskit/docs@5.0.2
  - @atlaskit/analytics@4.0.3
  - @atlaskit/avatar@14.0.5
  - @atlaskit/field-base@11.0.2

## 4.2.3

- [patch] add missing attributes to analytics [2a0346a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a0346a)
- [patch] Updated dependencies [2a0346a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a0346a)

## 4.2.2

- [patch] fix keyboard navigation [2dbff95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2dbff95)
- [patch] Updated dependencies [2dbff95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2dbff95)

## 4.2.1

- [patch] reduce number of updates/rendering in quick-search [9fbaafd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9fbaafd)
- [patch] Updated dependencies [9fbaafd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9fbaafd)

## 4.2.0

- [minor] Rewrite internal keyboard handling implementation. [0ebfc9a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ebfc9a)
- [none] Updated dependencies [0ebfc9a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ebfc9a)

## 4.1.0

- [minor] Passes the keyboard event from quick search to the submit event handler to ensure global search redirects with the complete search query. [2d6668f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d6668f)
- [none] Updated dependencies [2d6668f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d6668f)

## 4.0.1

- [patch] Add extra analytics event for highlight and selection of a search result [12e79bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12e79bf)
- [patch] Updated dependencies [12e79bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12e79bf)

## 4.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/field-base@11.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/analytics@4.0.0
  - @atlaskit/navigation@33.0.0
  - @atlaskit/item@8.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/navigation@33.0.0
  - @atlaskit/field-base@11.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/analytics@4.0.0
  - @atlaskit/item@8.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar@14.0.0

## 3.0.2

- [patch] Move tests under src and club unit, integration, visual regression [39c427d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/39c427d)
- [none] Updated dependencies [39c427d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/39c427d)

## 3.0.1

- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/item@7.0.8
  - @atlaskit/navigation@32.3.3
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/navigation@32.3.3
  - @atlaskit/item@7.0.8

## 3.0.0

- [major] Search header is now sticky. Needs navigation 32.3.0 or higher to work properly. [8bf8e51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8bf8e51)
- [minor] Support sticky header and footer [8b8ace1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b8ace1)
- [none] Updated dependencies [8bf8e51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8bf8e51)
  - @atlaskit/navigation@32.3.2
- [none] Updated dependencies [8b8ace1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b8ace1)
  - @atlaskit/navigation@32.3.2

## 2.3.4

- [patch] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0
  - @atlaskit/navigation@32.3.1
  - @atlaskit/item@7.0.7

## 2.3.3

- [patch] Replace faker with lightweight internal functions [1c3352a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c3352a)
- [none] Updated dependencies [1c3352a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c3352a)

## 2.3.2

- [patch] Decreasing padding on items and fix analytics.' [0f73740](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f73740)
- [none] Updated dependencies [0f73740](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f73740)

## 2.3.1

- [patch] Minor bugfixes and UI tweaks. [80899e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80899e1)
- [none] Updated dependencies [80899e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80899e1)

## 2.3.0

- [minor] Fixes types for Flow 0.74 [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [none] Updated dependencies [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
  - @atlaskit/navigation@32.2.0
  - @atlaskit/icon@12.2.0
  - @atlaskit/avatar@11.2.0

## 2.2.0

- [minor] onSearchSubmit prop also triggers on Shift+Enter [745b283](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/745b283)
- [none] Updated dependencies [745b283](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/745b283)

## 2.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/item@7.0.4
  - @atlaskit/icon@12.1.1
  - @atlaskit/field-base@10.1.1
  - @atlaskit/avatar@11.1.1
  - @atlaskit/docs@4.1.1
  - @atlaskit/analytics@3.0.5

## 2.1.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/navigation@32.1.0
  - @atlaskit/item@7.0.3
  - @atlaskit/avatar@11.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/analytics@3.0.4
  - @atlaskit/field-base@10.1.0

## 2.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/navigation@32.0.0
  - @atlaskit/item@7.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/field-base@10.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/analytics@3.0.2
  - @atlaskit/avatar@11.0.0

## 1.7.2

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/navigation@31.0.5

## 1.7.1

- [patch] Fix searchbox height. [586f868](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/586f868)
- [none] Updated dependencies [586f868](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/586f868)

## 1.7.0

- [minor] Change subText rendering of ObjectResult [dc6bfd7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc6bfd7)
- [none] Updated dependencies [dc6bfd7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc6bfd7)

## 1.6.0

- [minor] UI Polish [65392e5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65392e5)
- [none] Updated dependencies [65392e5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65392e5)

## 1.5.0

- [minor] Add Avatar prop to quick search result types [aefb12d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aefb12d)

## 1.4.2

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/navigation@31.0.4
  - @atlaskit/item@6.0.3
  - @atlaskit/field-base@9.0.3
  - @atlaskit/theme@3.2.2
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4
  - @atlaskit/analytics@3.0.1

## 1.4.1

## 1.4.0

- [minor] Add support for linkComponent prop [4c9e683](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c9e683)

## 1.3.2

- [patch] Remove dependency on navigation [756d26b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/756d26b)

## 1.3.1

## 1.3.0

- [minor] Remove unecessary dependencies [3bd4dd8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3bd4dd8)

## 1.2.0

- [minor] Add missing AkSearch legacy export [1b40786](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b40786)

## 1.1.0

- [minor] Fix wrongly named legacy exports [e7baf6b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7baf6b)

## 1.0.0

- [major] Extract quick-search from @atlaskit/navigation [dda7e32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dda7e32)
