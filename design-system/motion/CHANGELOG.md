# @atlaskit/motion

## 5.3.9

### Patch Changes

- Updated dependencies

## 5.3.8

### Patch Changes

- Updated dependencies

## 5.3.7

### Patch Changes

- [`39e543109ec09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e543109ec09) -
  add type info to forwardRef components
- Updated dependencies

## 5.3.6

### Patch Changes

- [`5867b0fce9502`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5867b0fce9502) -
  The exported constant `reduceMotionAsPerUserPreference` has been marked as deprecated and will be
  removed in a future release. Going forward, you should hardcode this media query in your styles.

## 5.3.5

### Patch Changes

- [`4e874b2f5938f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4e874b2f5938f) -
  fix typescript issues during local consumption for adminhub

## 5.3.4

### Patch Changes

- Updated dependencies

## 5.3.3

### Patch Changes

- Updated dependencies

## 5.3.2

### Patch Changes

- [`255837cfba315`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/255837cfba315) -
  Internal changes to how border radius is applied.

## 5.3.1

### Patch Changes

- [`23bcc5bbc9cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23bcc5bbc9cee) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 5.3.0

### Minor Changes

- [#200597](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/200597)
  [`31cebf6340cea`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/31cebf6340cea) -
  [ux] Update Motion Curves and create entrypoints for newly created component

## 5.2.0

### Minor Changes

- [#195850](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195850)
  [`9b1d8d585ee26`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9b1d8d585ee26) -
  Add New Motion Curves and a Component that can be used to apply the Motion Curves to all animation
  types

## 5.1.7

### Patch Changes

- Updated dependencies

## 5.1.6

### Patch Changes

- [#182316](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/182316)
  [`3e3e11916be69`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3e3e11916be69) -
  Migrated the internal usage of @atlaskit/focus-ring which uses Emotion for styling, to the new
  version built with Compiled CSS-in-JS.

## 5.1.5

### Patch Changes

- Updated dependencies

## 5.1.4

### Patch Changes

- Updated dependencies

## 5.1.3

### Patch Changes

- [#155827](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155827)
  [`f6f4f5a8a8ae8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f6f4f5a8a8ae8) -
  Cleans up the `platform_design_system_motion_on_finish_fix` feature gate.

## 5.1.2

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 5.1.1

### Patch Changes

- [#124596](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124596)
  [`a1ba68bc43a89`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a1ba68bc43a89) -
  Update `@atlaskit/platform-feature-flags` dependency from wildcard `*` to `^1.1.0`

## 5.1.0

### Minor Changes

- [#121186](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121186)
  [`ee09118dbb2b5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee09118dbb2b5) -
  We are testing a bug fix behind the `platform_design_system_motion_on_finish_fix` feature gate. If
  this fix is successful it will be available in a later release.

  This fix ensures that the exiting `onFinish` is called even when reduced motion is enabled.

## 5.0.0

### Major Changes

- [#114024](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/114024)
  [`d2720e17d293e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d2720e17d293e) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  therest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/motion`, you will need to ensure that your
  bundler is configured to handle `.css` imports correctly. Most bundlers come with built-in support
  for `.css` imports, so you may notneed to do anything.

  If you are using a different bundler, please refer to the documentation for that bundler to
  understand how to handle `.css` imports. For more information on the migration, please refer to
  [RFC-73 Migrating our components toCompiledCSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/859)

## 4.0.0

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

## 3.1.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

## 3.0.0

### Major Changes

- [#114382](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114382)
  [`5033cb80b3765`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5033cb80b3765) -
  Breaking change removing the ability to provide arbitrary animation timing functions in favor of a
  pre-defined set: `linear` `ease-in` `ease-out` `ease-in-out`.

  Introduced `animationTimingFunctionExiting` to support changing the timing function based on
  `state` (`entering`/`exiting`)

### Patch Changes

- [#114382](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114382)
  [`5033cb80b3765`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5033cb80b3765) -
  Updates internal animation logic to leverage static animation timing names, rather than arbitrary
  values.

## 2.0.2

### Patch Changes

- [#113714](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113714)
  [`8285339ba23ae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8285339ba23ae) -
  Update dependencies and remove unused internal exports and files.

## 2.0.1

### Patch Changes

- [#113458](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113458)
  [`9114c12b5682f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9114c12b5682f) -
  Refactors internal styles so that dynamically declared styles are now static where possible.

## 2.0.0

### Major Changes

- [#109511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109511)
  [`18d4f58b2d05d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/18d4f58b2d05d) -
  Motion now only accepts static duration values via the `duration` props of `SlideIn` / `FadeIn` /
  etc components. These have been replaced with an enumerated list of durations `small`, `medium`,
  `large` and `none`. This was done in order to support adoption of `@compiled/react`, which does
  not have support for dynamic css properties when in extraction mode.

## 1.10.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.9.3

### Patch Changes

- [#166087](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166087)
  [`3ab7d7da348ab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3ab7d7da348ab) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 1.9.2

### Patch Changes

- Updated dependencies

## 1.9.1

### Patch Changes

- [#145306](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145306)
  [`43b81fd5ead81`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/43b81fd5ead81) -
  Remove react-router-dom from devDependencies as it is incompatible with React 18, and was only
  used in an example.

## 1.9.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 1.8.0

### Minor Changes

- [#125755](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125755)
  [`861f8cfbff102`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/861f8cfbff102) -
  Refactor internals to better support React 18 strict mode.

## 1.7.4

### Patch Changes

- [#116025](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116025)
  [`cd506a937e44f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cd506a937e44f) -
  Internal change to how typography is applied. There should be no visual change.

## 1.7.3

### Patch Changes

- Updated dependencies

## 1.7.2

### Patch Changes

- [#114683](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114683)
  [`ff0815316ab38`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff0815316ab38) -
  Removes usage of custom theme button in places where its API is not being used and the default
  button is able to be used instead. This should give a slight performance (runtime) improvement.

## 1.7.1

### Patch Changes

- [#113947](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113947)
  [`169747d542a4f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/169747d542a4f) -
  Support exiting animation in strict mode.

## 1.7.0

### Minor Changes

- [#110670](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110670)
  [`c733254a2dd6e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c733254a2dd6e) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

## 1.6.1

### Patch Changes

- [#93481](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93481)
  [`c826eb17b113e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c826eb17b113e) -
  Remove examples of the logos that have been deprecated by the '@atlaskit/logo' package.

## 1.6.0

### Minor Changes

- [#96658](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96658)
  [`21b4a15e7182`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/21b4a15e7182) -
  Add support for React 18 in non-strict mode.

## 1.5.3

### Patch Changes

- [#94316](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94316)
  [`35fd5ed8e1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35fd5ed8e1d7) -
  Upgrading internal dependency `bind-event-listener` to `@^3.0.0`

## 1.5.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.5.1

### Patch Changes

- [#41372](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41372)
  [`971e55b3699`](https://bitbucket.org/atlassian/atlassian-frontend/commits/971e55b3699) - Prefix
  unused opts variable with '\_' to fix typechecking under local consumption

## 1.5.0

### Minor Changes

- [#40426](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40426)
  [`b3ba6514308`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3ba6514308) -
  Introduce `reduceMotionAsPerUserPreference` in favour of `prefersReducedMotion` as the latter does
  not work correctly with Compiled.

## 1.4.5

### Patch Changes

- [#39731](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39731)
  [`1f371d41ccb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f371d41ccb) - Motion
  is now enrolled into the product push model for Jira.

## 1.4.4

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json

## 1.4.3

### Patch Changes

- [#33652](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33652)
  [`e7ea6832ad2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7ea6832ad2) - Bans the
  use of React.FC/React.FunctionComponent type in ADS components as part of the React 18 migration
  work. The change is internal only and should not introduce any changes for the component
  consumers.

## 1.4.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 1.4.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 1.4.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 1.3.2

### Patch Changes

- [#30905](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30905)
  [`8081a4b12d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8081a4b12d3) - Fixed a
  type error for the `ResizingHeight` component caused by not rendering valid JSX

## 1.3.1

### Patch Changes

- [#30125](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30125)
  [`7f5f23dcb68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f5f23dcb68) -
  Introduce shape tokens to some packages.

## 1.3.0

### Minor Changes

- [#25860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25860)
  [`a86726f0b16`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a86726f0b16) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

## 1.2.4

### Patch Changes

- [#26408](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26408)
  [`9de88fa1e1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9de88fa1e1e) - Internal
  changes to include spacing tokens in component implementations.

## 1.2.3

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 1.2.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 1.2.1

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`01a461fe433`](https://bitbucket.org/atlassian/atlassian-frontend/commits/01a461fe433) - Internal
  code change turning on new linting rules.
- Updated dependencies

## 1.2.0

### Minor Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`a1c9465b456`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1c9465b456) - -
  `FadeIn` now supports different exit directions using the `exitDirection` prop
  - `FadeIn` now supports different distance options for animations, using the `distance` prop

## 1.1.2

### Patch Changes

- [#22614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22614)
  [`8a5bdb3c844`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a5bdb3c844) -
  Upgrading internal dependency (bind-event-listener) for improved internal types

## 1.1.1

### Patch Changes

- [#22029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22029)
  [`e4b612d1c48`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4b612d1c48) - Internal
  migration to bind-event-listener for safer DOM Event cleanup

## 1.1.0

### Minor Changes

- [#21335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21335)
  [`8630371ec57`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8630371ec57) -
  **Note**: It is a re-release of the wrongly `patched` version `1.0.4` that should have been a
  `minor` release.

  Add a useIsReducedMotion() hook that returns the user's current motion preference.

  Other internal changes:
  - Upgrade to TypeScript 4.2.4

## 1.0.4

### Patch Changes

_WRONG RELEASE TYPE - DON'T USE_

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 1.0.3

### Patch Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`cd34d8ca8ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd34d8ca8ea) - Internal
  wiring up to the tokens techstack, no code changes.

## 1.0.2

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 1.0.1

### Patch Changes

- [#11692](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11692)
  [`08b6e9821d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08b6e9821d0) -
  ExitingPersistence is now memoised to prevent a re-render that terminates the exit animation when
  its children have not changed.

## 1.0.0

### Major Changes

- [#10609](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10609)
  [`4925538af72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4925538af72) - This
  `1.0.0` release denotes that the package API is now stable and is no longer in developer preview.
  There are **NO API CHANGES** in this release.

## 0.4.8

### Patch Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`12f99a7b1ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12f99a7b1ab) - Export
  useExitingPersistence from @atlaskit/motion, and fix types for children of ExitingPersistence.

## 0.4.7

### Patch Changes

- [#9641](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9641)
  [`9d9f1490c22`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d9f1490c22) -
  @atlaskit/motion now supports multi entry-points. Users can now import only the parts of this
  module they need, reducing the size of your final bundle.

  Entry-points include:

  ```
  @atlaskit/motion/curves
  @atlaskit/motion/durations
  @atlaskit/motion/accessibility
  @atlaskit/motion/exiting-persistence
  @atlaskit/motion/fade-in
  @atlaskit/motion/slide-in
  @atlaskit/motion/zoom-in
  @atlaskit/motion/shrink-out
  @atlaskit/motion/staggered-entrance
  ```

## 0.4.6

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 0.4.5

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 0.4.4

### Patch Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749)
  [`02df8cde1d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02df8cde1d) - Readme now
  points to the correct docs URL.

## 0.4.3

### Patch Changes

- [#4424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4424)
  [`81c95008a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81c95008a4) - Remove
  transform if FadeIn movement is not provided

## 0.4.2

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 0.4.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`60dd4ecc69`](https://bitbucket.org/atlassian/atlassian-frontend/commits/60dd4ecc69) - Changed
  export all to export individual components in index
- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 0.4.0

### Minor Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 0.3.0

### Minor Changes

- [#2763](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2763)
  [`dd275c9b81`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd275c9b81) - Added the
  option to animate opacity within `SlideIn`.

  You can now add the property `animateOpacity` which if true, animates the opacity from 0 -> 1 on
  enter and 1 -> 0 on exit.

## 0.2.6

### Patch Changes

- [#2943](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2943)
  [`1e4930567c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e4930567c) - There
  should be no noticeable changes to consumers of `motion`, but we now remove the animation styles
  once an animation is complete, or if the elements are not meant to animate on initial mount. This
  prevents a class of bugs where we were seeing unintended animations.

## 0.2.5

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 0.2.4

### Patch Changes

- [patch][e5eb921e97](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5eb921e97):

  Change imports to comply with Atlassian conventions- Updated dependencies
  [3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):

- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies
  [f6667f2909](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6667f2909):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies
  [a4d063330a](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4d063330a):
  - @atlaskit/tooltip@15.2.6
  - @atlaskit/button@13.3.11
  - @atlaskit/logo@12.3.4
  - @atlaskit/lozenge@9.1.7

## 0.2.3

### Patch Changes

- [patch][5633f516a4](https://bitbucket.org/atlassian/atlassian-frontend/commits/5633f516a4):

  Fixes timeout and raf hooks not having a stable reference.- Updated dependencies
  [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

- Updated dependencies
  [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies
  [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies
  [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/button@13.3.10

## 0.2.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/button@13.3.7
  - @atlaskit/logo@12.3.2
  - @atlaskit/lozenge@9.1.4
  - @atlaskit/section-message@4.1.5
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3

## 0.2.1

### Patch Changes

- [patch][166d7b1626](https://bitbucket.org/atlassian/atlassian-frontend/commits/166d7b1626):

  Fixes motion blowing up when rendered on the server. - @atlaskit/logo@12.3.1
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/tooltip@15.2.2

## 0.2.0

### Minor Changes

- [minor][1d72045e6b](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d72045e6b):

  `SlideIn` is now more customizable and has new props:
  - **BREAKING CHANGE: ** `from` prop has been renamed to `enterFrom`
  - You can now optionally set an explicit `exitTo` prop which specifies which direction the
    component will animate towards when exiting. The `from` prop has also been renamed to
    `enterFrom`. If no `exitTo` prop is set, the exiting motion will default to being the reverse of
    the entrance motion. i.e. if `enterFrom={"right"}` then the element will slide in from the right
    and then exit towards the right as well.
  - You can now optionally set the prop `animationTimingFunction` to override animation curve to use
    when entrancing v.s. when exiting.

### Patch Changes

- Updated dependencies
  [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
  - @atlaskit/docs@8.3.0

## 0.1.2

### Patch Changes

- [patch][6fecf8ec66](https://bitbucket.org/atlassian/atlassian-frontend/commits/6fecf8ec66):

  FadeIn component has had its css keyframes adjusted to affect how much it animates up.-
  [patch][f214e55182](https://bitbucket.org/atlassian/atlassian-frontend/commits/f214e55182):

  Added a SlideIn component. Useful for when things slide in from outside of the viewport. It comes
  with a pairing exiting motion.-
  [patch][98342c8dca](https://bitbucket.org/atlassian/atlassian-frontend/commits/98342c8dca):

  Added a ShinkOut component. Useful for removing an element from the DOM by shrinking it to zero
  width. Does not have a pairing entering motion.-
  [patch][0aebb4f6ff](https://bitbucket.org/atlassian/atlassian-frontend/commits/0aebb4f6ff):

  Added a ZoomIn component. Useful for highlighting specific actions, buttons, etc, when entering
  the DOM. Comes with a pairing exiting motion.-
  [patch][8161987117](https://bitbucket.org/atlassian/atlassian-frontend/commits/8161987117):

  Allow consumers to toggle secondary entrance motion on FadeIn-
  [patch][38cde500c7](https://bitbucket.org/atlassian/atlassian-frontend/commits/38cde500c7):

  Added a ResizingHeight component. This is the component equivalent of the useResizingHeight hook.-
  Updated dependencies
  [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):

- Updated dependencies
  [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5
  - @atlaskit/lozenge@9.1.3
  - @atlaskit/section-message@4.1.3
  - @atlaskit/tooltip@15.2.1

## 0.1.1

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  New `<ExitingPersistence />` component

  You can now persist exiting elements using `ExitingPersistence`. Doing so will allow them to
  animate away while exiting.

  There are three ways you can utilise this component:

  **Conditionally rendering a single component**

  ```
  import { FadeIn, ExitingPersistence } from '@atlaskit/motion';

  ({ entered }) => (
    <div>
      <ExitingPersistence>
        {entered && (
          <FadeIn>{props => <div {...props}>hello world</div>}</FadeIn>
        )}
      </ExitingPersistence>
    </div>
  );
  ```

  **Conditionally rendering multiple components**

  ```
  import { FadeIn, ExitingPersistence } from '@atlaskit/motion';

  () => (
    <ExitingPersistence>
      {one && <FadeIn>{props => <div {...props}>hello world</div>}</FadeIn>}
      {two && <FadeIn>{props => <div {...props}>hello world</div>}</FadeIn>}
    </ExitingPersistence>
  );
  ```

  **Conditionally rendering elements in an array**

  Make sure to have unique keys for every element!

  ```
  import { FadeIn, ExitingPersistence } from '@atlaskit/motion';

  () => (
    <ExitingPersistence>
      {elements.map(element => (
        // Key is very important here!
        <FadeIn key={element.key}>
          {props => <div {...props}>hello world</div>}
        </FadeIn>
      ))}
    </ExitingPersistence>
  );
  ```

  Updated `<StaggeredEntrance />` component

  `StaggeredEntrance` no longer has the limitation of requiring motions to be the direct descendant.
  Simply ensure your motion elements are somewhere in the child tree and they will have their
  entrance motion staggered.

  ```
  import { FadeIn, StaggeredEntrance } from '@atlaskit/motion';

  () => (
    <StaggeredEntrance>
      <div>
        {items.map(logo => (
          <div key={logo.key}>
            <FadeIn>{props => <div {...props} />}</FadeIn>
          </div>
        ))}
      </div>
    </StaggeredEntrance>
  );
  ```

## 0.1.0

### Minor Changes

- [minor][5c3fc52da7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5c3fc52da7):

  The internal `Motion` component is now called `KeyframesMotion`.-
  [minor][1dd6a6d6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1dd6a6d6ac):

  `ExitingPersistence` now has an `appear` prop. Previously entering motions would always appear
  when mounting - now you have to opt into the behaviour.

  ```diff
  -<ExitingPersistence>
  +<ExitingPersistence appear>
    ...
  </ExitingPersistence>
  ```

### Patch Changes

- [patch][f175c8088f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f175c8088f):

  Fixes non-exiting elements from re-rendering unnecessarily.

## 0.0.4

### Patch Changes

- [patch][f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):

  Corrects the type exports for typography, colors, elevation and layers. If you were doing any
  dynamic code it may break you. Refer to the
  [upgrade guide](/packages/core/theme/docs/upgrade-guide) for help upgrading.- Updated dependencies
  [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):

- Updated dependencies
  [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
  - @atlaskit/theme@9.3.0

## 0.0.3

### Patch Changes

- [patch][94abe7f41a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/94abe7f41a):

  New `useResizingHeight()` hook

  This is a small yet powerful hook which you can consume to enable an element to resize its
  `height` when it changes after a state transition. It uses CSS under-the-hood to maximize
  performance.

  ```
  import { useResizingHeight } from '@atlaskit/motion';

  ({ text }) => <div {...useResizingHeight()}>{text}</div>;
  ```

## 0.0.2

### Patch Changes

- [patch][d8a99823e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d8a99823e2):

  Adds FadeIn and StaggeredEntrance components and reduced motion utilities.

## 0.0.1

### Patch Changes

- [patch][cdcb428642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdcb428642):

  Initial release of @atlaskit/motion
