# @atlaskit/input

## 8.0.7

### Patch Changes

- Updated dependencies

## 8.0.6

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 8.0.5

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.

## 8.0.4

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 8.0.3

### Patch Changes

- Updated dependencies

## 8.0.2

### Patch Changes

- [`30853172ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30853172ff) - Reset babel config back to ie11 to prevent runtime issues in Jira and to unbreak the Confluence es5-check

## 8.0.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 8.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 7.0.2

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 7.0.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/field-base@14.0.1
  - @atlaskit/section-message@4.1.5
  - @atlaskit/theme@9.5.1

## 7.0.0

### Major Changes

- [major][c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):

  BREAKING CHANGE: As part of AFP-1404, we are dropping flow support. It means that those packages are not typed. Consumer will need to manually add their types to the component.Background ticket: https://product-fabric.atlassian.net/browse/AFP-1397Plan: https://product-fabric.atlassian.net/wiki/spaces/AFP/pages/1052870901/Drop+Flow+Support+Plan

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/field-base@14.0.0
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1

## 6.0.8

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 6.0.7

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 6.0.6

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 6.0.5

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 6.0.4

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 6.0.3

### Patch Changes

- [patch][d905cbc0ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d905cbc0ac):

  Adding a condition to check if the component are referenced in tests running in CI. It reduces the noise and help reading the CI log.

## 6.0.2

### Patch Changes

- [patch][226a5fece8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/226a5fece8):

  Upating deprecation messages and adding console warning to improve visibility

## 6.0.1

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 6.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 5.0.2

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/field-base@12.0.2
  - @atlaskit/theme@8.1.7

## 5.0.1

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

## 5.0.0

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

## 4.0.9

- [patch][0a297ba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a297ba):

  - Packages should not be shown in the navigation, search and overview

## 4.0.8

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/field-base@11.0.12
  - @atlaskit/theme@7.0.0

## 4.0.7

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 4.0.6

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 4.0.4

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/field-base@11.0.5

## 4.0.3

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/field-base@11.0.3
  - @atlaskit/theme@5.1.3

## 4.0.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/theme@5.1.2
  - @atlaskit/field-base@11.0.2

## 4.0.1

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/field-base@11.0.1
  - @atlaskit/theme@5.1.1

## 4.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/field-base@11.0.0
  - @atlaskit/theme@5.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/field-base@11.0.0
  - @atlaskit/theme@5.0.0

## 3.0.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/field-base@10.1.2
  - @atlaskit/theme@4.0.4

## 3.0.1

- [patch] Fixed disabled field colour in Safari [b9f0068](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9f0068)
- [none] Updated dependencies [b9f0068](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9f0068)

## 3.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/field-base@10.0.0
  - @atlaskit/theme@4.0.0

## 2.0.2

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/field-base@9.0.3
  - @atlaskit/theme@3.2.2

## 2.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 1.7.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 1.7.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 1.6.6

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 1.6.5

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 1.6.4

- [patch] Fixed font-size in Input component [bebf0ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bebf0ab)

## 1.6.3

- [patch] Minor documentation fixes [f0e96bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0e96bd)

## 1.6.2

- [patch] Move input to new repository [0d7c5fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7c5fd)

## 1.6.1 (2017-11-15)

- bug fix; bumping internal dependencies to latest major version ([d5b6fb9](https://bitbucket.org/atlassian/atlaskit/commits/d5b6fb9))

## 1.6.0 (2017-10-24)

- feature; expose select method on Input class (issues closed: ak-3727) ([82aa750](https://bitbucket.org/atlassian/atlaskit/commits/82aa750))

## 1.5.4 (2017-10-22)

- bug fix; update styled component dependency and react peerDep ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))

## 1.5.3 (2017-09-05)

- bug fix; input component now also inherits the letter-spacing from the CSS reset. ([cf96c4c](https://bitbucket.org/atlassian/atlaskit/commits/cf96c4c))
- bug fix; inputs in IE11 no longer change size when used with inline-edit ([029cca6](https://bitbucket.org/atlassian/atlaskit/commits/029cca6))

## 1.5.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 1.5.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 1.2.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))
- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 1.1.3 (2017-07-13)

- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

## 1.1.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 1.1.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 1.1.0 (2017-03-29)

- feature; use styled-components to style the input component ([79a9e0b](https://bitbucket.org/atlassian/atlaskit/commits/79a9e0b))

## 1.0.10 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.9 (2017-02-28)

- fix; dummy commit to release stories ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 1.0.7 (2017-02-28)

- fix; dummy commit to fix broken stories and missing registry pages ([a31e92a](https://bitbucket.org/atlassian/atlaskit/commits/a31e92a))

## 1.0.7 (2017-02-28)

- fix; dummy commit to release stories for components ([a105c02](https://bitbucket.org/atlassian/atlaskit/commits/a105c02))

## 1.0.6 (2017-02-28)

- fix; removes jsdoc annoations and moves them to usage.md ([0df7be1](https://bitbucket.org/atlassian/atlaskit/commits/0df7be1))

## 1.0.5 (2017-02-27)

- empty commit to make components release themselves ([5511fbe](https://bitbucket.org/atlassian/atlaskit/commits/5511fbe))

## 1.0.4 (2017-02-22)

- fix; Adds description to input package.json ([643ebed](https://bitbucket.org/atlassian/atlaskit/commits/643ebed))
- fix; Adds docs to input component ([46dc9b4](https://bitbucket.org/atlassian/atlaskit/commits/46dc9b4))

## 1.0.3 (2017-02-16)

- fix; fixes a bug when inline-edit switch to read view programatically ([3a93e51](https://bitbucket.org/atlassian/atlaskit/commits/3a93e51))

## 1.0.2 (2017-02-09)

- fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.0.1 (2017-02-06)

- fix; Updates package to use scoped ak packages ([107381d](https://bitbucket.org/atlassian/atlaskit/commits/107381d))
