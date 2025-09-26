# @atlaskit/tag-group

## 12.0.4

### Patch Changes

- [`39e543109ec09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e543109ec09) -
  add type info to forwardRef components

## 12.0.3

### Patch Changes

- [`31c57f650ba07`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/31c57f650ba07) -
  Improving tests for server side rendering and hydration

## 12.0.2

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.

## 12.0.1

### Patch Changes

- [#125724](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/125724)
  [`07fff87fc682a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/07fff87fc682a) -
  Update dependencies.

## 12.0.0

### Major Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

## 11.2.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

## 11.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

## 11.0.1

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 11.0.0

### Major Changes

- [#168994](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168994)
  [`7fae455cf3b5f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7fae455cf3b5f) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/tag-group`, you will need to ensure that
  your bundler is configured to handle `.css` imports correctly. Most bundlers come with built-in
  support for `.css` imports, so you may not need to do anything. If you are using a different
  bundler, please refer to the documentation for that bundler to understand how to handle `.css`
  imports.

  For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

## 10.6.1

### Patch Changes

- [#165798](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165798)
  [`d0ba9d90d42e5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0ba9d90d42e5) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 10.6.0

### Minor Changes

- [#140301](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140301)
  [`f9f50b90f0693`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f9f50b90f0693) -
  [ux] Assistive technologies now define TagGroup as a group. Additionally `label` and `titleId`
  props introduced to label the current group.

## 10.5.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

## 10.4.0

### Minor Changes

- [#111016](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111016)
  [`d131599730792`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d131599730792) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

## 10.3.0

### Minor Changes

- [#94462](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94462)
  [`a87afa0ac818`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a87afa0ac818) -
  Add support for React 18 in non-strict mode.

## 10.2.7

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 10.2.6

### Patch Changes

- [#61319](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61319)
  [`864383d2cc09`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/864383d2cc09) -
  Exports type of tag group to resolve lint error when using code gen

## 10.2.5

### Patch Changes

- [#39308](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39308)
  [`d01e1d4059c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d01e1d4059c) - Added
  this package into push model consumption.

## 10.2.4

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json

## 10.2.3

### Patch Changes

- [#32935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32935)
  [`b1bdec7cce2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1bdec7cce2) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 10.2.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 10.2.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 10.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

## 10.1.2

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 10.1.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 10.1.0

### Minor Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`b70da512137`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b70da512137) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

## 10.0.14

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 10.0.13

### Patch Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`45ebe7af434`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45ebe7af434) - Moved to
  using declarative entrypoints internally. Public API is unchanged.

## 10.0.12

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 10.0.11

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`562a5b38aa9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/562a5b38aa9) - Styles
  have been rewritten in preparation for migrating to compiled.

## 10.0.10

### Patch Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`cd34d8ca8ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd34d8ca8ea) - Internal
  wiring up to the tokens techstack, no code changes.

## 10.0.9

### Patch Changes

- [#11980](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11980)
  [`b0183dd2972`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0183dd2972) - Updated
  package.json decriptions and documentation. Docs have moved from atlaskit.atlassian.com to
  atlassian.design

## 10.0.8

### Patch Changes

- [#12167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12167)
  [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates
  to development dependency `storybook-addon-performance`

## 10.0.7

### Patch Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`c4820147878`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c4820147878) - Removed
  temporary comment introduced in previous patch

## 10.0.6

### Patch Changes

- [#9510](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9510)
  [`30a7d113d24`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30a7d113d24) -
  Workaround to force a build of tag-group on Confluence

## 10.0.5

### Patch Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`afbc1c0b7b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/afbc1c0b7b5) - Removing
  dormant file from tag-group

## 10.0.4

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 10.0.3

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 10.0.2

### Patch Changes

- [#5155](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5155)
  [`e8bd7e3a2a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8bd7e3a2a) - The
  changes are mainly on performance tunning for tag-group. As part of the change, we rewrote
  `TagGroup` with function component.

## 10.0.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 10.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 9.0.8

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 9.0.7

### Patch Changes

- [#1868](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/1868)
  [`e1f57427e0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e1f57427e0) - Change
  imports to comply with Atlassian conventions

## 9.0.6

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/avatar@17.1.7
  - @atlaskit/tag@9.0.13

## 9.0.5

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 9.0.4

- Updated dependencies
  [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/tag@9.0.7
  - @atlaskit/avatar@17.0.0

## 9.0.3

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 9.0.2

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 9.0.1

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 9.0.0

### Major Changes

- [major][cc461c0022](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc461c0022):

  @atlaskit/tag-group has been converted to Typescript. Typescript consumers will now get static
  type safety. Flow types are no longer provided. No API or behavioural changes.

## 8.0.2

- Updated dependencies
  [1adb8727e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1adb8727e3):
  - @atlaskit/tag@9.0.0

## 8.0.1

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 8.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 7.0.2

- [patch][1b1a519188](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b1a519188):

  - Updating to latest tag changes

## 7.0.1

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

## 7.0.0

- [major][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):

  - Drop ES5 from all the flow modules

  ### Dropping CJS support in all @atlaskit packages

  As a breaking change, all @atlaskit packages will be dropping cjs distributions and will only
  distribute esm. This means all distributed code will be transpiled, but will still contain
  `import` and `export` declarations.

  The major reason for doing this is to allow us to support multiple entry points in packages, e.g:

  ```js
  import colors from `@atlaskit/theme/colors`;
  ```

  Previously this was sort of possible for consumers by doing something like:

  ```js
  import colors from `@atlaskit/theme/dist/esm/colors`;
  ```

  This has a couple of issues. 1, it treats the file system as API making internal refactors harder,
  we have to worry about how consumers might be using things that aren't _actually_ supposed to be
  used. 2. We are unable to do this _internally_ in @atlaskit packages. This leads to lots of
  packages bundling all of theme, just to use a single color, especially in situations where tree
  shaking fails.

  To support being able to use multiple entrypoints internally, we unfortunately cannot have
  multiple distributions as they would need to have very different imports from of their own
  internal dependencies.

  ES Modules are widely supported by all modern bundlers and can be worked around in node
  environments.

  We may choose to revisit this solution in the future if we find any unintended condequences, but
  we see this as a pretty sane path forward which should lead to some major bundle size decreases,
  saner API's and simpler package architecture.

  Please reach out to #fabric-build (if in Atlassian) or create an issue in
  [Design System Support](https://ecosystem.atlassian.net/secure/CreateIssue.jspa?pid=24670) (for
  external) if you have any questions or queries about this.

## 6.0.8

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/avatar@14.1.7
  - @atlaskit/tag@6.1.3
  - @atlaskit/docs@6.0.0

## 6.0.7

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 6.0.6

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 6.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/tag@6.0.4
  - @atlaskit/avatar@14.0.6

## 6.0.3

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/tag@6.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/avatar@14.0.5

## 6.0.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/tag@6.0.2
  - @atlaskit/avatar@14.0.4

## 6.0.1

- [patch] Move analytics tests and replace elements to core
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/tag@6.0.1
  - @atlaskit/docs@5.0.1
  - @atlaskit/avatar@14.0.2

## 6.0.0

- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tag@6.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/tag@6.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/avatar@14.0.0

## 5.1.3

- [none] Updated dependencies
  [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/tag@5.0.7
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies
  [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/tag@5.0.7

## 5.1.2

- [patch] Updated dependencies
  [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0
  - @atlaskit/tag@5.0.6

## 5.1.1

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/tag@5.0.4

## 5.1.0

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/avatar@11.1.0
  - @atlaskit/tag@5.0.2
  - @atlaskit/docs@4.1.0

## 5.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies
  [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/tag@5.0.1
  - @atlaskit/docs@4.0.1
  - @atlaskit/avatar@11.0.1

## 5.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/tag@5.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/avatar@11.0.0

## 4.0.1

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/tag@4.1.1
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4

## 4.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 3.6.1

- [patch] Re-releasing due to potentially broken babel release
  [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 3.6.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3
  [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 3.5.3

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 3.5.2

- [patch] Packages Flow types for elements components
  [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 3.5.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 3.4.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily
  ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.4.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps
  ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.1.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts
  ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))
- feature; added ES module builds to dist and add jsnext:main to most ADG packages
  ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.0.1 (2017-07-13)

- fix; add prop-types as a dependency to avoid React 15.x warnings
  ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

## 3.0.0 (2017-05-06)

- feature; updates tag dependency to 2.x
  ([ec6544f](https://bitbucket.org/atlassian/atlaskit/commits/ec6544f))
- breaking; introduces a peer dependency on @atlaskit/tag version 2.x

## 2.0.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license.
  ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 2.0.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and
  ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 2.0.0 (2017-04-05)

- refactor the tag-group component to use styled-components
  ([0a3c118](https://bitbucket.org/atlassian/atlaskit/commits/0a3c118))
- breaking; added peerDependency "styled-components", removed dependency "classnames"
- ISSUES CLOSED: AK-2034

## 1.0.7 (2017-04-02)

- fix; change one of the maintainers
  ([e9a3011](https://bitbucket.org/atlassian/atlaskit/commits/e9a3011))

## 1.0.6 (2017-03-28)

- fix; adds story for rounded tags in a tag group
  ([51bfe30](https://bitbucket.org/atlassian/atlaskit/commits/51bfe30))

## 1.0.5 (2017-03-23)

- fix; Empty commit to release the component
  ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.0.3 (2017-03-21)

- fix; maintainers for all the packages were added
  ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.2 (2017-02-28)

- fix; adds warning ot usage.md about editing readme
  ([db6a143](https://bitbucket.org/atlassian/atlaskit/commits/db6a143))
- fix; removes jsdoc annotations, moves content to usage.md
  ([826a4e0](https://bitbucket.org/atlassian/atlaskit/commits/826a4e0))
- fix; dummy commit to release stories
  ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 1.0.1 (2017-02-07)

- fix; Updates package to use scoped ak packages
  ([2d3fc62](https://bitbucket.org/atlassian/atlaskit/commits/2d3fc62))
