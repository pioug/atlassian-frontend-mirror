# @atlaskit/page

## 12.0.7

### Patch Changes

- [`cd34d8ca8ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd34d8ca8ea) - Internal wiring up to the tokens techstack, no code changes.

## 12.0.6

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.

## 12.0.5

### Patch Changes

- [`b30ac8f0656`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b30ac8f0656) - Removes an extraneous development dependency

## 12.0.4

### Patch Changes

- [`8047104b93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8047104b93) - Remove invalid `spacing` attribute in rendered HTML by not passing unused spacing prop to internal Grid component.

## 12.0.3

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 12.0.2

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 12.0.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 12.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 11.0.14

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 11.0.13

### Patch Changes

- [patch][443bb984ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/443bb984ab):

  Change imports to comply with Atlassian conventions- Updated dependencies [9e4b195732](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e4b195732):

- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [f6667f2909](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6667f2909):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [c21a796623](https://bitbucket.org/atlassian/atlassian-frontend/commits/c21a796623):
  - @atlaskit/toggle@8.1.7
  - @atlaskit/button@13.3.11
  - @atlaskit/logo@12.3.4
  - @atlaskit/banner@10.1.8

## 11.0.12

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/banner@10.1.5
  - @atlaskit/button@13.3.7
  - @atlaskit/logo@12.3.2
  - @atlaskit/navigation@36.0.1
  - @atlaskit/toggle@8.1.4

## 11.0.11

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/navigation@36.0.0
  - @atlaskit/logo@12.3.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/banner@10.1.4
  - @atlaskit/button@13.3.6

## 11.0.10

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result- Updated dependencies [6dccb16bfc](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dccb16bfc):

- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/toggle@8.1.3
  - @atlaskit/banner@10.1.3
  - @atlaskit/button@13.3.5

## 11.0.9

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 11.0.8

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 11.0.7

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 11.0.6

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 11.0.5

- Updated dependencies [7e9d653278](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e9d653278):
  - @atlaskit/navigation@35.1.12
  - @atlaskit/toggle@8.0.0

## 11.0.4

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 11.0.3

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 11.0.2

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 11.0.1

### Patch Changes

- [patch][93bcf314c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93bcf314c6):

  Added missing tslib dep

## 11.0.0

- [major][3af5a7e685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3af5a7e685):

  - @atlaskit/page has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 10.0.2

- Updated dependencies [4b07b57640](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b07b57640):
  - @atlaskit/button@13.0.2
  - @atlaskit/navigation@35.1.1
  - @atlaskit/logo@12.0.0

## 10.0.1

- [patch][7a68e88827](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7a68e88827):

  - Fixed aria-hidden attribute for banner container

## 10.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 9.0.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/banner@9.0.1
  - @atlaskit/logo@10.0.3
  - @atlaskit/navigation@34.0.3
  - @atlaskit/toggle@6.0.3
  - @atlaskit/button@12.0.0

## 9.0.2

- Updated dependencies [1433f91820](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1433f91820):
  - @atlaskit/banner@9.0.0

## 9.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/banner@8.0.1
  - @atlaskit/logo@10.0.1
  - @atlaskit/navigation@34.0.1
  - @atlaskit/toggle@6.0.1
  - @atlaskit/button@11.0.0

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

## 8.0.12

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/banner@7.0.12
  - @atlaskit/button@10.1.1
  - @atlaskit/logo@9.2.6
  - @atlaskit/navigation@33.3.8
  - @atlaskit/toggle@5.0.14
  - @atlaskit/docs@6.0.0

## 8.0.11

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/banner@7.0.9
  - @atlaskit/logo@9.2.4
  - @atlaskit/navigation@33.3.5
  - @atlaskit/toggle@5.0.11
  - @atlaskit/button@10.0.0

## 8.0.10

- [patch][84e8015](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84e8015):

  - Bump react-syntax-highlighter to 10.0.1

## 8.0.9

- [patch] Fix webpack 3 support for page & code [03af95e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03af95e)

## 8.0.8

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 8.0.7

- [patch] Upgrade react-syntax-highlighter again and use async loaded prism [260d66a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/260d66a)

## 8.0.6

- [patch] Upgraded react-syntax-highlighter to 8.0.2 [7cc7000](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cc7000)

## 8.0.5

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 8.0.3

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/navigation@33.1.3
  - @atlaskit/toggle@5.0.5
  - @atlaskit/button@9.0.5
  - @atlaskit/banner@7.0.3
  - @atlaskit/icon@13.2.4

## 8.0.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/navigation@33.1.2
  - @atlaskit/toggle@5.0.4
  - @atlaskit/banner@7.0.2
  - @atlaskit/docs@5.0.2

## 8.0.1

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/toggle@5.0.3
  - @atlaskit/banner@7.0.1
  - @atlaskit/navigation@33.1.1

## 8.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/toggle@5.0.0
  - @atlaskit/banner@7.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/navigation@33.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/navigation@33.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/banner@7.0.0
  - @atlaskit/docs@5.0.0

## 7.2.1

- [patch] Fixed typo in grid component [c1fda8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1fda8b)
- [none] Updated dependencies [c1fda8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1fda8b)

## 7.2.0

- [minor] Fixes types for Flow 0.74 [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [none] Updated dependencies [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
  - @atlaskit/navigation@32.2.0

## 7.1.1

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/toggle@4.0.3
  - @atlaskit/navigation@32.1.1

## 7.1.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/navigation@32.1.0
  - @atlaskit/toggle@4.0.2
  - @atlaskit/banner@6.1.0
  - @atlaskit/docs@4.1.0

## 7.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/navigation@32.0.1
  - @atlaskit/toggle@4.0.1
  - @atlaskit/banner@6.0.1
  - @atlaskit/docs@4.0.1

## 7.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/navigation@32.0.0
  - @atlaskit/toggle@4.0.0
  - @atlaskit/banner@6.0.0
  - @atlaskit/docs@4.0.0

## 6.0.4

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/banner@5.0.3
  - @atlaskit/navigation@31.0.5

## 6.0.3

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/toggle@3.0.2
  - @atlaskit/navigation@31.0.4
  - @atlaskit/banner@5.0.2
  - @atlaskit/docs@3.0.4

## 6.0.2

- [patch] Remove unused dependencies [3cfb3fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3cfb3fe)

## 6.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 5.1.2

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 5.1.1

- [patch] Update links in documentation [c4f7497](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c4f7497)

## 5.1.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 5.0.15

- [patch] added min-with on text to enable text truncating [44fc258](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44fc258)

## 5.0.14

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 5.0.12

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 5.0.10

- [patch] Minor documentation fixes [f0e96bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0e96bd)

## 5.0.9

- [patch] Minor manual bump for packages desync'd from npm [e988c58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e988c58)

## 5.0.8

- Manual bump to resolve desync with npm package version.

## 5.0.7

- [patch] Enabling syntax highlighter language auto-detect [4831bd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4831bd2)

## 5.0.6

- [patch] Migrated to mk2 repo, build system & docs. [64e83f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64e83f3)

## 5.0.5 (2017-12-05)

- bug fix; remove the object literal being passed to the ThemeProvider which was causing unnece (issues closed: ak-3988) ([96ebc12](https://bitbucket.org/atlassian/atlaskit/commits/96ebc12))

## 5.0.4 (2017-11-17)

- bug fix; bumping internal dependencies to the latest major versions ([4da3a3d](https://bitbucket.org/atlassian/atlaskit/commits/4da3a3d))

## 5.0.3 (2017-10-26)

- bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 5.0.2 (2017-10-22)

- bug fix; update styled-components dep and react peerDep ([6a67bf8](https://bitbucket.org/atlassian/atlaskit/commits/6a67bf8))

## 5.0.1 (2017-10-12)

- bug fix; fix Changelog.md for 5.0.0 release ([bedd9fc](https://bitbucket.org/atlassian/atlaskit/commits/bedd9fc))

## 5.0.0 (2017-10-11)

- breaking; PageContent will now shrink to match the viewport size when the content allows ([9f038db0bcf8](https://bitbucket.org/atlassian/atlaskit/commits/9f038db0bcf8))

## 4.4.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 4.4.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 4.1.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 4.1.0 (2017-07-17)

- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 4.0.1 (2017-05-26)

- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- fix; pin react-lorem-component version to avoid newly released broken version ([6f3d9c6](https://bitbucket.org/atlassian/atlaskit/commits/6f3d9c6))

## 4.0.0 (2017-05-15)

- refactoring the Page component so it no longer needs to know the width of the N ([888c008](https://bitbucket.org/atlassian/atlaskit/commits/888c008))
- breaking; Removing navigationWidth prop from the Page component

## 3.1.3 (2017-04-28)

- fix; page no longer renders badly if there is not much content and a banner specified ([8c94555](https://bitbucket.org/atlassian/atlaskit/commits/8c94555))

## 3.1.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 3.1.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 3.1.0 (2017-04-18)

- feature; updated avatar dependency versions for comment, dropdown-menu, droplist, and page ([e4d2ae7](https://bitbucket.org/atlassian/atlaskit/commits/e4d2ae7))

## 3.0.4 (2017-03-23)

- fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 3.0.2 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 3.0.1 (2017-03-07)

- fix; fixes the storybook for page so that it interacts with banner correctly ([3c4ac16](https://bitbucket.org/atlassian/atlaskit/commits/3c4ac16))

## 2.0.2 (2017-02-09)

- fix; Grids no longer have a min-height ([8491a1d](https://bitbucket.org/atlassian/atlaskit/commits/8491a1d))
- fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))
- feature; Add [@atlaskit](https://github.com/atlaskit)/navigation support to Page ([fcb10f1](https://bitbucket.org/atlassian/atlaskit/commits/fcb10f1))
- feature; add isBannerOpen to Page, to allow integration with the Banner component ([9444506](https://bitbucket.org/atlassian/atlaskit/commits/9444506))
- feature; add support to Page for navigation width resizing ([9ffa440](https://bitbucket.org/atlassian/atlaskit/commits/9ffa440))
- feature; Page now has props for navigation and banner and positions them accordingly ([f7fc87a](https://bitbucket.org/atlassian/atlaskit/commits/f7fc87a))
- breaking; navigation no longer explicitly 100vh in height. It gets the height from the page slot instead.
- breaking; grids no longer have a min-height

## 2.0.1 (2017-02-06)

- fix; Updates package to use scoped ak packages ([f20663d](https://bitbucket.org/atlassian/atlaskit/commits/f20663d))
