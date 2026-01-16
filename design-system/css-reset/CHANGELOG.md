# @atlaskit/css-reset

## 7.3.11

### Patch Changes

- Updated dependencies

## 7.3.10

### Patch Changes

- Updated dependencies

## 7.3.9

### Patch Changes

- Updated dependencies

## 7.3.8

### Patch Changes

- Updated dependencies

## 7.3.7

### Patch Changes

- [`248faa32d4835`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/248faa32d4835) -
  Internal changes to how borders are applied.

## 7.3.6

### Patch Changes

- [`f0662cd7a143e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0662cd7a143e) -
  Internal changes to how borders are applied.
- Updated dependencies

## 7.3.5

### Patch Changes

- Updated dependencies

## 7.3.4

### Patch Changes

- Updated dependencies

## 7.3.3

### Patch Changes

- Updated dependencies

## 7.3.2

### Patch Changes

- Updated dependencies

## 7.3.1

### Patch Changes

- [#164146](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164146)
  [`cb9fe0058ed87`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cb9fe0058ed87) -
  Updates package.json direct dependencies to align with actual usage.

## 7.3.0

### Minor Changes

- [#157071](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157071)
  [`a149a0b1559ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a149a0b1559ec) -
  We are testing the migration to the ADS Link component behind a feature flag. If this fix is
  successful it will be available in a later release.

### Patch Changes

- Updated dependencies

## 7.2.0

### Minor Changes

- [#138389](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/138389)
  [`84baabc71342d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/84baabc71342d) -
  Fixes the changes in `7.1.0` where the added `style:first-child` tag selectors were targeting all
  subsequent-siblings instead of the explicit next-sibling. This may fix some visual issues during
  SSR or when Emotion isn't properly setup.

## 7.1.0

### Minor Changes

- [#136371](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/136371)
  [`00035716330df`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/00035716330df) -
  Expands `@atlaskit/css-reset` to better handle the scenarios where Emotion, Compiled, or similar
  CSS-in-JS auto-inject a `<style>` tag at runtime, primarily impacting SSR hydration when setup
  incorrectly.

  While we expect Emotion to be setup properly via https://emotion.sh/docs/ssr, this may still solve
  for an upcoming scenario with Streaming SSR hydration where we don't have a solution for Emotion,
  and this may reduce flashes of incorrect styling.

  tl;dr: Typically we see code like this—styles come in via the `<head>`

  ```html
  <head>
  	<link rel="stylesheet" src="…" />
  	<style>
  		.abcd1234 {
  			color: red;
  		}
  	</style>
  </head>
  <body>
  	<div>
  		<h1 class="abcd1234">Hello world</h1>
  	</div>
  </body>
  ```

  However, several CSS-in-JS libraries inject styles like this initially and then hoist them into
  the `<head>` later, so the HTML coming from SSR/Streaming SSR may look like:

  ```html
  <div>
  	<style>
  		.abcd1234 {
  			color: red;
  		}
  	</style>
  	<h1 class="abcd1234">Hello world</h1>
  </div>
  ```

  This code should now handle that—removing the `margin-top` from `h1` either when it is the
  `first-child`, or there is a `style` tag that is the first-child with an `h1` as a subsequent
  sibling (eg. second child).

## 7.0.2

### Patch Changes

- [#136290](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/136290)
  [`631bb21b7ec55`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/631bb21b7ec55) -
  Force bundle.css to be in a consistent formatting through internal formatting utils (Prettier)

## 7.0.1

### Patch Changes

- Updated dependencies

## 7.0.0

### Major Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

### Patch Changes

- Updated dependencies

## 6.16.0

### Minor Changes

- [#116530](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116530)
  [`08551d0287167`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/08551d0287167) -
  Removed letter spacing from h1 elements.

## 6.15.0

### Minor Changes

- [#116060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116060)
  [`e1144ab353315`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e1144ab353315) -
  Removed letter spacing from h2 elements.

## 6.14.0

### Minor Changes

- [#113770](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113770)
  [`37f43dcd24ede`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/37f43dcd24ede) -
  Removed letter spacing from h3 elements.

## 6.13.1

### Patch Changes

- Updated dependencies

## 6.13.0

### Minor Changes

- [#112805](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112805)
  [`aefa654dbcbae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/aefa654dbcbae) -
  Removed letter spacing from h4 elements.

## 6.12.0

### Minor Changes

- [#111741](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111741)
  [`99106cc9d8c19`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/99106cc9d8c19) -
  Removed letter spacing from h5 elements.

## 6.11.6

### Patch Changes

- Updated dependencies

## 6.11.5

### Patch Changes

- [#105672](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105672)
  [`cb6ee69d77f15`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cb6ee69d77f15) -
  Update dependencies.

## 6.11.4

### Patch Changes

- Updated dependencies

## 6.11.3

### Patch Changes

- [#101383](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101383)
  [`c733052840ce2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c733052840ce2) -
  Remove deprecated constants from css-reset. Apply correct default code font family based on
  typography modern theme.

## 6.11.2

### Patch Changes

- Updated dependencies

## 6.11.1

### Patch Changes

- Updated dependencies

## 6.11.0

### Minor Changes

- [#141343](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141343)
  [`95f59fd3d63f9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/95f59fd3d63f9) -
  Tokenize small element on CSS reset inline with new typography system.

## 6.10.1

### Patch Changes

- Updated dependencies

## 6.10.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 6.9.2

### Patch Changes

- [#120049](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120049)
  [`77504ff274f72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77504ff274f72) -
  DSP-19576: Assign names to anonymous default exports

## 6.9.1

### Patch Changes

- [#109928](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109928)
  [`026200e81a78b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/026200e81a78b) -
  Remove dependency fbjs

## 6.9.0

### Minor Changes

- [#90498](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90498)
  [`25c2f0f694c3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/25c2f0f694c3) -
  Add support for React 18 in non-strict mode.

## 6.8.0

### Minor Changes

- [#87162](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87162)
  [`555f5611abaf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/555f5611abaf) -
  Utilise typography tokens in css reset without any UI changes

## 6.7.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 6.7.0

### Minor Changes

- [#78788](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78788)
  [`f7801c9b84ac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f7801c9b84ac) -
  Add a new entrypoint ./bundle.css

## 6.6.2

### Patch Changes

- [#58867](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58867)
  [`ece3768d98ba`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ece3768d98ba) -
  Internal change to remove any usages of font tokens with hardcoded values as these tokens are
  being deprecated.

## 6.6.1

### Patch Changes

- [#41883](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41883)
  [`893f68af200`](https://bitbucket.org/atlassian/atlassian-frontend/commits/893f68af200) - check in
  bundle.css file into source, update package scripts

## 6.6.0

### Minor Changes

- [#41575](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41575)
  [`8d437d8aeb4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d437d8aeb4) - add a
  styles entry point to export all concatenated styles

## 6.5.4

### Patch Changes

- [#37167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37167)
  [`461d74c2e9d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/461d74c2e9d) - change
  color because of insufficient color contrast for focus indicator

## 6.5.3

### Patch Changes

- [#35441](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35441)
  [`599bfe90ee3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/599bfe90ee3) - Internal
  change to use shape tokens. There is no expected visual change.

## 6.5.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 6.5.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 6.5.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 6.4.1

### Patch Changes

- [#32932](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32932)
  [`35d89e93915`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35d89e93915) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 6.4.0

### Minor Changes

- [#32211](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32211)
  [`f91b48763da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f91b48763da) - [ux]
  Updates the body font size to use a typography token. This is a no-op change as the typography
  theme is not active.

### Patch Changes

- [#32507](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32507)
  [`2d3b7c04afb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d3b7c04afb) - Enroll
  @atlaskit/css-reset to push model consumption

## 6.3.21

### Patch Changes

- [#32175](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32175)
  [`8e0b1456821`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e0b1456821) - Migrated
  use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 6.3.20

### Patch Changes

- [#27634](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27634)
  [`718d5ad3044`](https://bitbucket.org/atlassian/atlassian-frontend/commits/718d5ad3044) - Updates
  to support the new `@atlaskit/tokens` theming API.
- Updated dependencies

## 6.3.19

### Patch Changes

- [#28324](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28324)
  [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving performance.

## 6.3.18

### Patch Changes

- Updated dependencies

## 6.3.17

### Patch Changes

- Updated dependencies

## 6.3.16

### Patch Changes

- Updated dependencies

## 6.3.15

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 6.3.14

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 6.3.13

### Patch Changes

- Updated dependencies

## 6.3.12

### Patch Changes

- [#20721](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20721)
  [`70968c17cc9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70968c17cc9) - Remove
  invalid selectors and associated rules

## 6.3.11

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 6.3.10

### Patch Changes

- Updated dependencies

## 6.3.9

### Patch Changes

- Updated dependencies

## 6.3.8

### Patch Changes

- Updated dependencies

## 6.3.7

### Patch Changes

- [#18980](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/18980)
  [`2d430dae7d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d430dae7d2) - Removes
  <template /> override for IE11.

## 6.3.6

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Updates
  usage of deprecated token names so they're aligned with the latest naming conventions. No UI or
  visual changes
- Updated dependencies

## 6.3.5

### Patch Changes

- Updated dependencies

## 6.3.4

### Patch Changes

- [#17514](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17514)
  [`02a2f889019`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02a2f889019) - Removes
  css that sets the SVG text element's color styles

## 6.3.3

### Patch Changes

- [#17127](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17127)
  [`5168407f185`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5168407f185) - Fixes an
  issue in the CSS reset where the SVG text element didn't inherit the correct reset styles.

## 6.3.2

### Patch Changes

- [#16864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16864)
  [`b8fd2911013`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8fd2911013) - [ux]
  Reduced motion styles that were causing layout flickers have been removed.

## 6.3.1

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 6.3.0

### Minor Changes

- [#16479](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16479)
  [`5b605d39119`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b605d39119) -
  Scrollbars now respect theme selection

## 6.2.0

### Minor Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777)
  [`fd7b67c606a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd7b67c606a) - [ux] The
  reset now uses focus-visible (if supported) instead of styling :focus directly.

### Patch Changes

- Updated dependencies

## 6.1.4

### Patch Changes

- Updated dependencies

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

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`92620c3aa0d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/92620c3aa0d) - [ux]
  Reduced motion support has been added to the CSS reset.
- [`950a744a150`](https://bitbucket.org/atlassian/atlassian-frontend/commits/950a744a150) - [ux]
  Color values now sourced through tokens.

### Patch Changes

- Updated dependencies

## 6.0.5

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 6.0.4

### Patch Changes

- [#5653](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5653)
  [`cdfd30ef56`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cdfd30ef56) - Bumping
  dep for fbjs util and moving it to a devDep for css-reset

## 6.0.3

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 6.0.2

### Patch Changes

- Updated dependencies

## 6.0.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 6.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 5.0.12

### Patch Changes

- [#2624](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2624)
  [`82a7c30a60`](https://bitbucket.org/atlassian/atlassian-frontend/commits/82a7c30a60) - The
  module:es2019 field for css-reset should also point to bundle.css instead of a js file

## 5.0.11

### Patch Changes

- [#2591](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2591)
  [`c2dbd2384c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2dbd2384c) - FIX:
  Override for the default button font style introduced in latest Chrome 83.x.x.x

## 5.0.10

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
  - @atlaskit/docs@8.3.2
  - @atlaskit/theme@9.5.1

## 5.0.9

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 5.0.8

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

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
  - Removing the generation of the entry-points at the root Please see this
    [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this
    [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points)
    for further details

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
  - css-reset has been converted to Typescript. Typescript consumers will now get static type
    safety. Flow types are no longer provided. No API or behavioural changes.

## 4.0.1

- [patch][52868d4352](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/52868d4352):
  - Fixed regression of font-weight for `<small>` elements

## 4.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 3.0.8

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/theme@8.1.7

## 3.0.7

- [patch][6c0d9da30e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c0d9da30e):
  - Removes deprecated css property text-decoration-skip: ink. Users should no longer see a warning
    to update the property.

## 3.0.6

- Updated dependencies
  [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
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

- [patch] Moved to @atlaskit/theme for all the values from util-shared-styles
  [6d35164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d35164)

## 3.0.1

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/docs@5.0.2

## 3.0.0

- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/docs@5.0.0

## 2.0.8

- [patch] Fix flow config and add back flow fix me
  [107da09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/107da09)
- [none] Updated dependencies
  [107da09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/107da09)

## 2.0.7

- [patch] Remove or update \$FlowFixMe
  [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies
  [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)

## 2.0.6

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)

## 2.0.5

- [patch] Update changelogs to remove duplicate
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/docs@4.1.1

## 2.0.4

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/docs@4.1.0

## 2.0.3

- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/docs@4.0.0

## 2.0.2

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/docs@3.0.4

## 2.0.1

- [patch] Remove negative spacing
  [ac73181](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac73181)

## 2.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 1.2.3

- [patch] Fixed main styles in IE11
  [5aa8105](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5aa8105)

## 1.2.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 1.2.1

- [patch] Packages Flow types for elements components
  [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 1.2.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 1.1.7

- [patch] migrated css reset from ak to ak-mk2
  [53ce5eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/53ce5eb)

## 1.1.6 (2017-11-30)

- bug fix; release stories with fixed console errors
  ([3321c2b](https://bitbucket.org/atlassian/atlaskit/commits/3321c2b))

## 1.1.5 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps
  ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 1.1.4 (2017-05-24)

- fix; fixing webkit code font issue
  ([2f0ee47](https://bitbucket.org/atlassian/atlaskit/commits/2f0ee47))

## 1.1.3 (2017-05-11)

- fix; use ADG 3 font family for code and kbd tags
  ([37ac71a](https://bitbucket.org/atlassian/atlaskit/commits/37ac71a))

## 1.1.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license.
  ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 1.1.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and
  ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 1.1.0 (2017-04-20)

- feature; removed explicit style! imports, set style-loader in webpack config
  ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 1.0.5 (2017-03-23)

- fix; Empty commit to release the component
  ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.0.3 (2017-03-21)

## 1.0.3 (2017-03-21)

- fix; maintainers for all the packages were added
  ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.2 (2017-02-07)

## 1.0.1 (2017-02-06)

- fix; Updates package to use scoped ak packages
  ([58fd6c5](https://bitbucket.org/atlassian/atlaskit/commits/58fd6c5))
- fix; correct package name in css-reset docs
  ([670ec8f](https://bitbucket.org/atlassian/atlaskit/commits/670ec8f))
