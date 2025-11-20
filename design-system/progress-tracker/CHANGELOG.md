# @atlaskit/progress-tracker

## 10.3.10

### Patch Changes

- Updated dependencies

## 10.3.9

### Patch Changes

- Updated dependencies

## 10.3.8

### Patch Changes

- Updated dependencies

## 10.3.7

### Patch Changes

- Updated dependencies

## 10.3.6

### Patch Changes

- Updated dependencies

## 10.3.5

### Patch Changes

- Updated dependencies

## 10.3.4

### Patch Changes

- Updated dependencies

## 10.3.3

### Patch Changes

- Updated dependencies

## 10.3.2

### Patch Changes

- Updated dependencies

## 10.3.1

### Patch Changes

- Updated dependencies

## 10.3.0

### Minor Changes

- [#185065](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185065)
  [`e5274f9f73365`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e5274f9f73365) -
  Replaces 'cosy' spacing prop with 'cozy' to align with standard US spelling. (cosy is still
  functional).

## 10.2.2

### Patch Changes

- Updated dependencies

## 10.2.1

### Patch Changes

- Updated dependencies

## 10.2.0

### Minor Changes

- [#175003](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175003)
  [`0d715469b8a4d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0d715469b8a4d) -
  This release enables functionality previously tested and rolled out under a feature flag. Progress
  tracker links are now rendered using the Anchor primitive by default, allowing automatic router
  link configuration with App Provider.

  The `render` prop, which only supported overriding links, has been deprecated. To migrate,
  configure router links using [App Provider](https://atlassian.design/components/app-provider).

## 10.1.3

### Patch Changes

- Updated dependencies

## 10.1.2

### Patch Changes

- Updated dependencies

## 10.1.1

### Patch Changes

- [#155802](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155802)
  [`08019848e3eab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/08019848e3eab) -
  Refreshed "issue" terminology.
- Updated dependencies

## 10.1.0

### Minor Changes

- [#157071](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157071)
  [`a149a0b1559ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a149a0b1559ec) -
  We are testing the migration to the ADS Link component behind a feature flag. If this fix is
  successful it will be available in a later release.

### Patch Changes

- Updated dependencies

## 10.0.4

### Patch Changes

- [#150382](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150382)
  [`878831658be56`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/878831658be56) -
  Update ProgressTracker to an ordered list for better semantics.

## 10.0.3

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 10.0.2

### Patch Changes

- Updated dependencies

## 10.0.1

### Patch Changes

- [#119565](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119565)
  [`a7f1d79b42b68`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a7f1d79b42b68) -
  Update dependencies and remove unused internal export.

## 10.0.0

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

## 9.4.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

### Patch Changes

- Updated dependencies

## 9.3.3

### Patch Changes

- Updated dependencies

## 9.3.2

### Patch Changes

- Updated dependencies

## 9.3.1

### Patch Changes

- Updated dependencies

## 9.3.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 9.2.0

### Minor Changes

- [#107227](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107227)
  [`08728da34c4fd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/08728da34c4fd) -
  The step marker for disabled steps has been updated to use the disabled icon color token. This
  change is no longer behind a feature flag.

## 9.1.0

### Minor Changes

- [#103302](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103302)
  [`057afb45671d1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/057afb45671d1) -
  [ux] The step marker for disabled steps has been updated to use the disabled icon color token.

## 9.0.3

### Patch Changes

- [#102501](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102501)
  [`02cb9c9836baf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/02cb9c9836baf) -
  Internal change only. Cleaning up orphaned code.

## 9.0.2

### Patch Changes

- Updated dependencies

## 9.0.1

### Patch Changes

- [#180713](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/180713)
  [`103e97b52f101`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/103e97b52f101) -
  Removes feature flag removing internal use of the legacy NodeResolver package in favor of react
  refs

## 9.0.0

### Major Changes

- [#171836](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171836)
  [`30eff06f3753e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30eff06f3753e) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/progress-tracker`, you will need to ensure
  that your bundler is configured to handle `.css` imports correctly. Most bundlers come with
  built-in support for `.css` imports, so you may not need to do anything. If you are using a
  different bundler, please refer to the documentation for that bundler to understand how to handle
  `.css` imports.

  For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

## 8.11.1

### Patch Changes

- Updated dependencies

## 8.11.0

### Minor Changes

- [#170799](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170799)
  [`5c6ea433574d2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c6ea433574d2) -
  We are testing changes behind a feature gate. Progress tracker steps have been updated to use
  automatic router link configuration (from App provider). If this change is successful it will be
  available in a later release.

## 8.10.3

### Patch Changes

- [#168892](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168892)
  [`5eb2a70adb262`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5eb2a70adb262) -
  Remove react-router-dom from devDependencies as it is incompatible with React 18.

## 8.10.2

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 8.10.1

### Patch Changes

- Updated dependencies

## 8.10.0

### Minor Changes

- [#154699](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154699)
  [`fddbc0849871c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fddbc0849871c) -
  DSP-21285 replacing platform-design-system-dsp-20687-transition-group with
  platform_design_system_team_transition_group_r18

## 8.9.4

### Patch Changes

- Updated dependencies

## 8.9.3

### Patch Changes

- [#145688](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145688)
  [`8b5cef4cf858b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8b5cef4cf858b) -
  Removal of FF platform-progress-tracker-functional-facade which was added during the functional
  component conversion

## 8.9.2

### Patch Changes

- Updated dependencies

## 8.9.1

### Patch Changes

- [#142762](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/142762)
  [`2bbc16219edd2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2bbc16219edd2) -
  [ux] Disabled, visited and current step indicator font weight change from semibold to bold.

## 8.9.0

### Minor Changes

- [`2d1da097bd763`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2d1da097bd763) -
  DSP-20687 removing usage of findDOMNode in react-transition-group behind ff

## 8.8.2

### Patch Changes

- [#134667](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/134667)
  [`7e834d0456744`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7e834d0456744) -
  Converting ProgressTracker component from class component to functional component

## 8.8.1

### Patch Changes

- Updated dependencies

## 8.8.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 8.7.6

### Patch Changes

- Updated dependencies

## 8.7.5

### Patch Changes

- [#119932](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/119932)
  [`798a9f4b8913d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/798a9f4b8913d) -
  Updated styling to ensure bullet point styles aren't added when rendered in certain UI Kit
  extensions points.

## 8.7.4

### Patch Changes

- Updated dependencies

## 8.7.3

### Patch Changes

- Updated dependencies

## 8.7.2

### Patch Changes

- Updated dependencies

## 8.7.1

### Patch Changes

- Updated dependencies

## 8.7.0

### Minor Changes

- [#110836](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110836)
  [`a8bd419fd70b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a8bd419fd70b9) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 8.6.3

### Patch Changes

- [#102669](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102669)
  [`57f9d0819e9e6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f9d0819e9e6) -
  Internal change only. Update spacing to use logical properties and tokenise typography values.

## 8.6.2

### Patch Changes

- Updated dependencies

## 8.6.1

### Patch Changes

- [#98707](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98707)
  [`7cce9cbf2f08`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7cce9cbf2f08) -
  Internal changes to how text is rendered. There is no expected visual change.

## 8.6.0

### Minor Changes

- [#99069](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/99069)
  [`609d5a37c656`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/609d5a37c656) -
  Add support for React 18 in non-strict mode.

## 8.5.11

### Patch Changes

- Updated dependencies

## 8.5.10

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 8.5.9

### Patch Changes

- Updated dependencies

## 8.5.8

### Patch Changes

- Updated dependencies

## 8.5.7

### Patch Changes

- Updated dependencies

## 8.5.6

### Patch Changes

- Updated dependencies

## 8.5.5

### Patch Changes

- [#41451](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41451)
  [`b9bbfbe5bbf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9bbfbe5bbf) - Added
  this package into push model consumption.

## 8.5.4

### Patch Changes

- Updated dependencies

## 8.5.3

### Patch Changes

- [#38750](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38750)
  [`6ab9799d402`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ab9799d402) - The
  internal composition of this component has changed. There is no expected change in behavior.
- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 8.5.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 8.5.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 8.5.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 8.4.10

### Patch Changes

- [#32211](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32211)
  [`65e4baeea85`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65e4baeea85) - Internal
  changes.

## 8.4.9

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 8.4.8

### Patch Changes

- [#31480](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31480)
  [`173f6371859`](https://bitbucket.org/atlassian/atlassian-frontend/commits/173f6371859) - Migrates
  unit tests from enzyme to RTL.

## 8.4.7

### Patch Changes

- [#31242](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31242)
  [`cfe48bb7ece`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfe48bb7ece) - Internal
  change only. Replace usages of Inline/Stack with stable version from `@atlaskit/primitives`.

## 8.4.6

### Patch Changes

- Updated dependencies

## 8.4.5

### Patch Changes

- [#29390](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29390)
  [`18aeca8c199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18aeca8c199) - Internal
  change to update token references. There is no expected behaviour or visual change.

## 8.4.4

### Patch Changes

- [#29227](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29227)
  [`4ee60bafc6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ee60bafc6d) -
  ED-16603: Remove tooltips from VR tests and make them opt in. To opt-in, add `allowedSideEffects`
  when loading the page.

## 8.4.3

### Patch Changes

- [#27891](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27891)
  [`eadbf13d8c0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eadbf13d8c0) - Updated
  usages of `Text`, `Box`, `Stack`, and `Inline` primitives to reflect their updated APIs. There are
  no visual or behaviour changes.
- Updated dependencies

## 8.4.2

### Patch Changes

- Updated dependencies

## 8.4.1

### Patch Changes

- Updated dependencies

## 8.4.0

### Minor Changes

- [#27326](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27326)
  [`eb709e1fde3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb709e1fde3) - [ux]
  Apply spacing tokens and primitive components. Reduce padding between stage labels and progress
  bar by 4px - overall height of component is therefore also 4px shorter.

## 8.3.4

### Patch Changes

- Updated dependencies

## 8.3.3

### Patch Changes

- [#26488](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26488)
  [`bc989043572`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc989043572) - Internal
  changes to apply spacing tokens. This should be a no-op change.

## 8.3.2

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303)
  [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op
  change to introduce spacing tokens to design system components.

## 8.3.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 8.3.0

### Minor Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`099a8b4949e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/099a8b4949e) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- Updated dependencies

## 8.2.5

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 8.2.4

### Patch Changes

- Updated dependencies

## 8.2.3

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 8.2.2

### Patch Changes

- Updated dependencies

## 8.2.1

### Patch Changes

- Updated dependencies

## 8.2.0

### Minor Changes

- [#19019](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19019)
  [`4e96270c06e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e96270c06e) - [ux]
  Instrumented progress-tracker with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- Updated dependencies

## 8.1.0

### Minor Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777)
  [`d2429272ffa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2429272ffa) - Migrates
  usage of `styled-components` to `@emotion`. Under the hood the component also no longer uses
  `@atlaskit/page/grid`, although still uses the same spacing scale.

## 8.0.4

### Patch Changes

- Updated dependencies

## 8.0.3

### Patch Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`b90c0237824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90c0237824) - Update
  package.jsons to remove unused dependencies.
- Updated dependencies

## 8.0.2

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 8.0.1

### Patch Changes

- [#12412](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12412)
  [`8ae29c21d55`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8ae29c21d55) - Removed
  the `!important` declaration from the top margin style.

## 8.0.0

### Major Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230)
  [`3e1d0e22b98`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e1d0e22b98) - [ux]
  Marked a progress tracker wrapper as unordered list. Step component wrapper has been changed to li
  tag for each step. Added label prop that is used as aria-label.

### Patch Changes

- Updated dependencies

## 7.0.6

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 7.0.5

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 7.0.4

### Patch Changes

- Updated dependencies

## 7.0.3

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 7.0.2

### Patch Changes

- [#3293](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3293)
  [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme
  and package information has been updated to point to the new design system website.

## 7.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 7.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 6.1.8

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 6.1.7

### Patch Changes

- [#2677](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2677)
  [`4560b65a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4560b65a4f) - upgrade
  react-transition-group to latest

## 6.1.6

### Patch Changes

- [patch][8ca2bfc206](https://bitbucket.org/atlassian/atlassian-frontend/commits/8ca2bfc206):

  Change imports to comply with Atlassian conventions- Updated dependencies
  [443bb984ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/443bb984ab):

- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies
  [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
  - @atlaskit/page@11.0.13
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1

## 6.1.5

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/page@11.0.12
  - @atlaskit/theme@9.5.1

## 6.1.4

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/page@11.0.11

## 6.1.3

### Patch Changes

- [patch][a70bb511fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/a70bb511fc):

  Fixes an issue with how ProgressTracker deals with stages being added or removed-
  [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result-
  Updated dependencies
  [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies
  [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies
  [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5
  - @atlaskit/page@11.0.10

## 6.1.2

### Patch Changes

- [patch][68c39bdac6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/68c39bdac6):

  Fixes ProgressTracker not showing transition animations

## 6.1.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 6.1.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 6.0.8

### Patch Changes

- [patch][4432d729b7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4432d729b7):

  @atlaskit/progress-tracker has been converted to Typescript. Typescript consumers will now get
  static type safety. Flow types are no longer provided. No API or behavioural changes.

## 6.0.7

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

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

- [patch][202fda1d9e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/202fda1d9e):

  Moved dependencies to devDependencies in progress-tracker: move 'react-dom' to devDependencies.

## 6.0.2

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 6.0.1

- Updated dependencies
  [3af5a7e685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3af5a7e685):
  - @atlaskit/page@11.0.0

## 6.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 5.0.2

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/theme@8.1.7

## 5.0.1

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):
  - Removes duplicate babel-runtime dependency

## 5.0.0

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

## 4.0.10

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/page@8.0.12
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 4.0.9

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/theme@7.0.0

## 4.0.8

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 4.0.7

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 4.0.5

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/docs@5.0.6

## 4.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/page@8.0.3
  - @atlaskit/theme@5.1.3

## 4.0.3

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/page@8.0.2
  - @atlaskit/theme@5.1.2
  - @atlaskit/docs@5.0.2

## 4.0.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/page@8.0.1
  - @atlaskit/theme@5.1.1

## 4.0.1

- [patch] Move analytics tests and replace elements to core
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/docs@5.0.1

## 4.0.0

- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/page@8.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/page@8.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0

## 3.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/page@7.1.1
  - @atlaskit/theme@4.0.4

## 3.1.1

- [patch] Update changelogs to remove duplicate
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/docs@4.1.1

## 3.1.0

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/page@7.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2

## 3.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies
  [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/page@7.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 3.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/page@7.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 2.0.3

- [patch] Updated dependencies
  [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/page@6.0.4

## 2.0.2

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/page@6.0.3
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 2.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 1.3.1

- [patch] Re-releasing due to potentially broken babel release
  [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 1.3.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3
  [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 1.2.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 1.2.1

- [patch] Packages Flow types for elements components
  [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 1.2.0

- [minor] Updated examples to use named import for clarity
  [541f2fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/541f2fb)

## 1.1.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 1.0.2

- [patch] Added animations to progress bar
  [369af3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/369af3a)

## 0.2.0

- [minor] Initial Release of Atlaskit Progress Tracker
  [3b3c9df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b3c9df)
