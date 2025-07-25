# @atlaskit/flag

## 17.2.4

### Patch Changes

- Updated dependencies

## 17.2.3

### Patch Changes

- [#188952](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188952)
  [`1a88e6e2601ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1a88e6e2601ae) -
  Migrated usage of renamed/deprecated icons
- Updated dependencies

## 17.2.2

### Patch Changes

- [#185048](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185048)
  [`216bdb050fde5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/216bdb050fde5) -
  Replaces custom dismiss button implementation with the default base button

## 17.2.1

### Patch Changes

- Updated dependencies

## 17.2.0

### Minor Changes

- [#175869](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175869)
  [`e7f822af7edc1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e7f822af7edc1) -
  Updated usages of deprecated icons with replacement icons

### Patch Changes

- Updated dependencies

## 17.1.10

### Patch Changes

- Updated dependencies

## 17.1.9

### Patch Changes

- [#175398](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175398)
  [`28c7d87f8d2e0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/28c7d87f8d2e0) -
  Updated dev dependencies.
- Updated dependencies

## 17.1.8

### Patch Changes

- Updated dependencies

## 17.1.7

### Patch Changes

- Updated dependencies

## 17.1.6

### Patch Changes

- Updated dependencies

## 17.1.5

### Patch Changes

- [#155802](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/155802)
  [`08019848e3eab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/08019848e3eab) -
  Refreshed "issue" terminology.
- Updated dependencies

## 17.1.4

### Patch Changes

- Updated dependencies

## 17.1.3

### Patch Changes

- Updated dependencies

## 17.1.2

### Patch Changes

- Updated dependencies

## 17.1.1

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 17.1.0

### Minor Changes

- [#128153](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/128153)
  [`00925dc5af2a6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/00925dc5af2a6) -
  [ux] Flag description and actions now explicitly set the font style to use typography tokens,
  instead of relying on the CSS reset to be present. This change is behind the feature flag
  `platform_ads_explicit_font_styles`.

## 17.0.0

### Major Changes

- [#124832](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124832)
  [`aa446a240d0bd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/aa446a240d0bd) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR.

  Please note, in order to use this version of `@atlaskit/flag`, you will need to ensure that your
  bundler is configured to handle `.css` imports correctly. Most bundlers come with built-in support
  for `.css` imports, so you may not need to do anything. If you are using a different bundler,
  please refer to the documentation for that bundler to understand how to handle `.css` imports.

  For more information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

### Patch Changes

- Updated dependencies

## 16.2.1

### Patch Changes

- Updated dependencies

## 16.2.0

### Minor Changes

- [#122900](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122900)
  [`d8df33a58ab3b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d8df33a58ab3b) -
  Updated flag dismiss and expand button to use new icons. This change is behind a feature flag and
  will be available in a later release.

## 16.1.3

### Patch Changes

- Updated dependencies

## 16.1.2

### Patch Changes

- Updated dependencies

## 16.1.1

### Patch Changes

- [#119202](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119202)
  [`903841d1b85ba`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/903841d1b85ba) -
  Removes the explicit return type on withFlagsProvider to allow typescript to infer the real type.
  This allows consumers to have a better typescript experience and not have to cast the
  withFlagsProvider type in storybook.

## 16.1.0

### Minor Changes

- [#118326](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118326)
  [`47ed83a62335a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/47ed83a62335a) -
  We are testing improvements behind a feature flag. Flags with default icons, and support for icons
  with no spacing. If this fix is successful it will be available in a later release.

### Patch Changes

- Updated dependencies

## 16.0.0

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

## 15.9.4

### Patch Changes

- Updated dependencies

## 15.9.3

### Patch Changes

- [#114382](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114382)
  [`5033cb80b3765`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5033cb80b3765) -
  Updates internal animation logic to leverage static animation timing names, rather than arbitrary
  values.
- Updated dependencies

## 15.9.2

### Patch Changes

- Updated dependencies

## 15.9.1

### Patch Changes

- Updated dependencies

## 15.9.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 15.8.15

### Patch Changes

- [#107176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107176)
  [`124bd21a27dae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/124bd21a27dae) -
  Update dependencies.

## 15.8.14

### Patch Changes

- Updated dependencies

## 15.8.13

### Patch Changes

- [#173066](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/173066)
  [`2eea1b16e9f57`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2eea1b16e9f57) -
  delayAnnouncement type added for AutoDismissFlag

## 15.8.12

### Patch Changes

- Updated dependencies

## 15.8.11

### Patch Changes

- Updated dependencies

## 15.8.10

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 15.8.9

### Patch Changes

- Updated dependencies

## 15.8.8

### Patch Changes

- [#162319](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162319)
  [`2ac6ec33aa35a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2ac6ec33aa35a) -
  Added aria-hidden to title and description when delayAnnouncement enabled to avoid duplicate
  announcement. Also removed condition for role alert

## 15.8.7

### Patch Changes

- Updated dependencies

## 15.8.6

### Patch Changes

- Updated dependencies

## 15.8.5

### Patch Changes

- [#152429](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/152429)
  [`5d414827c3394`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5d414827c3394) -
  Removes usages of deprecated CustomThemeButton in favor of the new Button

## 15.8.4

### Patch Changes

- Updated dependencies

## 15.8.3

### Patch Changes

- Updated dependencies

## 15.8.2

### Patch Changes

- Updated dependencies

## 15.8.1

### Patch Changes

- Updated dependencies

## 15.8.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 15.7.5

### Patch Changes

- Updated dependencies

## 15.7.4

### Patch Changes

- Updated dependencies

## 15.7.3

### Patch Changes

- Updated dependencies

## 15.7.2

### Patch Changes

- [#120049](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120049)
  [`77504ff274f72`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77504ff274f72) -
  DSP-19576: Assign names to anonymous default exports

## 15.7.1

### Patch Changes

- Updated dependencies

## 15.7.0

### Minor Changes

- [#118560](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118560)
  [`cca5dee6530a8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cca5dee6530a8) -
  Accessibility improvements. Add `headingLevel` prop.

## 15.6.5

### Patch Changes

- Updated dependencies

## 15.6.4

### Patch Changes

- Updated dependencies

## 15.6.3

### Patch Changes

- Updated dependencies

## 15.6.2

### Patch Changes

- [#113275](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113275)
  [`b52de02acc0d0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b52de02acc0d0) -
  Add support to delay the screen reader announcement by props

## 15.6.1

### Patch Changes

- Updated dependencies

## 15.6.0

### Minor Changes

- [#111878](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111878)
  [`223959ef57c80`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/223959ef57c80) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 15.5.3

### Patch Changes

- Updated dependencies

## 15.5.2

### Patch Changes

- [#101206](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101206)
  [`e7b8d483e629`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e7b8d483e629) -
  Introduce a new prop shouldRenderToParent on FlagProvider to render flag group directly to parent
  instead of Portal

## 15.5.1

### Patch Changes

- Updated dependencies

## 15.5.0

### Minor Changes

- [#96792](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96792)
  [`bbed9621a7a3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bbed9621a7a3) -
  HTML buttons used in flags have been replaced with the `Pressable` primitive.

## 15.4.1

### Patch Changes

- [#87978](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87978)
  [`23eb450d6c2b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/23eb450d6c2b) -
  Internal change only: update to use new typography system.

## 15.4.0

### Minor Changes

- [#91526](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91526)
  [`3f7f99daae4a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3f7f99daae4a) -
  Add support for React 18 in non-strict mode.

## 15.3.0

### Minor Changes

- [#85860](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/85860)
  [`6c6d44b0293f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6c6d44b0293f) -
  Add shouldRenderToParent prop on flag group to render directly in the parent so the flags can be
  acessed in aria-modal components

## 15.2.27

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 15.2.26

### Patch Changes

- Updated dependencies

## 15.2.25

### Patch Changes

- Updated dependencies

## 15.2.24

### Patch Changes

- Updated dependencies

## 15.2.23

### Patch Changes

- Updated dependencies

## 15.2.22

### Patch Changes

- Updated dependencies

## 15.2.21

### Patch Changes

- Updated dependencies

## 15.2.20

### Patch Changes

- [#41729](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41729)
  [`04235acacd6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04235acacd6) - Enrol
  package to push model in Jira

## 15.2.19

### Patch Changes

- Updated dependencies

## 15.2.18

### Patch Changes

- [#40332](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40332)
  [`4d35602a23a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d35602a23a) - Removes
  tabindex from Flag container

## 15.2.17

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 15.2.16

### Patch Changes

- [#37533](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37533)
  [`1ed303de3e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ed303de3e8) - Updated
  dependencies
- [#37419](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37419)
  [`95401cac781`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95401cac781) - Internal
  change to component composition. There is no expected change.

## 15.2.15

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754)
  [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use
  `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility
  testing.

## 15.2.14

### Patch Changes

- [#36412](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36412)
  [`7e4085cd951`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e4085cd951) - Allow
  caret version range in @atlaskit/primitives dependency.

## 15.2.13

### Patch Changes

- Updated dependencies

## 15.2.12

### Patch Changes

- Updated dependencies

## 15.2.11

### Patch Changes

- Updated dependencies

## 15.2.10

### Patch Changes

- Updated dependencies

## 15.2.9

### Patch Changes

- Updated dependencies

## 15.2.8

### Patch Changes

- [#35337](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35337)
  [`529814693a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/529814693a1) - Pin
  version of @atlaskit/primitives so it resolves to correct version

## 15.2.7

### Patch Changes

- [#33833](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33833)
  [`b8b41649492`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8b41649492) - Update
  how certain background colors are referenced by name. Internal changes only.
- Updated dependencies

## 15.2.6

### Patch Changes

- [#34922](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34922)
  [`779727e307a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/779727e307a) - Internal
  change only. Replace all instances of Box with stable @atlaskit/primitives version.

## 15.2.5

### Patch Changes

- Updated dependencies

## 15.2.4

### Patch Changes

- [#34881](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34881)
  [`774ed69ecef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/774ed69ecef) - Internal
  changes to use space tokens for spacing values. There is no visual change.

## 15.2.3

### Patch Changes

- [#33652](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33652)
  [`e7ea6832ad2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7ea6832ad2) - Bans the
  use of React.FC/React.FunctionComponent type in ADS components as part of the React 18 migration
  work. The change is internal only and should not introduce any changes for the component
  consumers.

## 15.2.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 15.2.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 15.2.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 15.1.6

### Patch Changes

- [#32211](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32211)
  [`4ba10567310`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ba10567310) - Internal
  changes.

## 15.1.5

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 15.1.4

### Patch Changes

- Updated dependencies

## 15.1.3

### Patch Changes

- Updated dependencies

## 15.1.2

### Patch Changes

- Updated dependencies

## 15.1.1

### Patch Changes

- Updated dependencies

## 15.1.0

### Minor Changes

- [#31299](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31299)
  [`be1170b4b1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be1170b4b1f) - Removes
  custom appearance styles for focus. Now uses `color.border.focused` token consistenly across all
  appearances..

### Patch Changes

- Updated dependencies

## 15.0.12

### Patch Changes

- Updated dependencies

## 15.0.11

### Patch Changes

- [#31206](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31206)
  [`261420360ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/261420360ec) - Upgrades
  component types to support React 18.
- Updated dependencies

## 15.0.10

### Patch Changes

- [#31338](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31338)
  [`74c1b81a476`](https://bitbucket.org/atlassian/atlassian-frontend/commits/74c1b81a476) - Replaces
  use of `gridSize` with space tokens. There is no expected visual change.

## 15.0.9

### Patch Changes

- [#31242](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31242)
  [`cfe48bb7ece`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfe48bb7ece) - Internal
  change only. Replace usages of Inline/Stack with stable version from `@atlaskit/primitives`.

## 15.0.8

### Patch Changes

- [#31041](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31041)
  [`842bb999a85`](https://bitbucket.org/atlassian/atlassian-frontend/commits/842bb999a85) - Internal
  change only. Replace usages of Inline/Stack with stable version from `@atlaskit/primitives`.

## 15.0.7

### Patch Changes

- Updated dependencies

## 15.0.6

### Patch Changes

- Updated dependencies

## 15.0.5

### Patch Changes

- [#27891](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27891)
  [`eadbf13d8c0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eadbf13d8c0) - Updated
  usages of `Text`, `Box`, `Stack`, and `Inline` primitives to reflect their updated APIs. There are
  no visual or behaviour changes.
- Updated dependencies

## 15.0.4

### Patch Changes

- [#28064](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28064)
  [`b0f6dd0bc35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0f6dd0bc35) - Updated
  to use typography tokens. There is no expected behaviour or visual change.

## 15.0.3

### Patch Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`56a44cd0ae9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56a44cd0ae9) - - [ux]
  Updated Flag component colored background buttons to use correct tokens for better contrast
  - Made the button color type stricter and extracted local css variable names into constants

## 15.0.2

### Patch Changes

- Updated dependencies

## 15.0.1

### Patch Changes

- Updated dependencies

## 15.0.0

### Major Changes

- [#26712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26712)
  [`f7b2dbd6eba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7b2dbd6eba) - BREAKING
  CHANGE: We have removed support for legacy light and dark themes. Previously, Flag used the
  `useGlobalTheme` hook to detect 'light' or 'dark' modes and apply suitable styles accordingly.
  This functionality has been removed in favor of supporting token-based light and dark themes as
  well as including fallbacks for non-token environments.

  Other changes include:

  - Flag shadow is now the same across normal and bold flags and has been made consistent with
    overlay shadows in other components.
  - Dismiss button is better aligned within the Flag and has a more consistent hit target.
  - Flag icon is better aligned with content.
  - Internal change to the way styles are applied.

### Patch Changes

- [`a1af6f8bb99`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1af6f8bb99) - Fixes a
  regression that could cause Flag description or actions to display incorrectly or not at all.
- [`373f54c8212`](https://bitbucket.org/atlassian/atlassian-frontend/commits/373f54c8212) - Fixed an
  issue where Flag title or description could overflow its container if a single word exceeded the
  length of the container (for example, long filenames).
- [`bbd4e296a68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bbd4e296a68) - Fixes a
  regression that could cause Flag description or actions to display incorrectly or not at all.
- Updated dependencies

## 14.7.3

### Patch Changes

- Updated dependencies

## 14.7.2

### Patch Changes

- [#26408](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26408)
  [`9de88fa1e1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9de88fa1e1e) - Internal
  changes to include spacing tokens in component implementations.

## 14.7.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 14.7.0

### Minor Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`d176305ad56`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d176305ad56) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- Updated dependencies

## 14.6.4

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 14.6.3

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381)
  [`8202e37941b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8202e37941b) - Internal
  code change turning on new linting rules.
- Updated dependencies

## 14.6.2

### Patch Changes

- [#23303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23303)
  [`982f05dc6b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/982f05dc6b9) - [ux]
  Remove left indentation on bold flag's actions section

## 14.6.1

### Patch Changes

- [#22642](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22642)
  [`45ebe7af434`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45ebe7af434) - Moved to
  using declarative entrypoints internally. Public API is unchanged.
- Updated dependencies

## 14.6.0

### Minor Changes

- [#22029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22029)
  [`379b0a864df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/379b0a864df) - [ux]
  Remove truncation of titles and wrap text instead. Very slightly changed title text positioning.

### Patch Changes

- [`f16146d83ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f16146d83ff) - [ux] Fix
  cross icon positioning
- Updated dependencies

## 14.5.9

### Patch Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570)
  [`2329b0e8cc0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2329b0e8cc0) - [ux]
  DSP-4541 Update wrongly used tokens

## 14.5.8

### Patch Changes

- Updated dependencies

## 14.5.7

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4
- Updated dependencies

## 14.5.6

### Patch Changes

- Updated dependencies

## 14.5.5

### Patch Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618)
  [`0739258f502`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0739258f502) - [ux]
  Fixed token usages on backgrounds and action links.
- Updated dependencies

## 14.5.4

### Patch Changes

- Updated dependencies

## 14.5.3

### Patch Changes

- Updated dependencies

## 14.5.2

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Internal
  changes to support adoption of '@compiled/react'.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The
  no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when
  auto-fixing by correctly formatting token ids.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - An a11y
  fix for the flag dismiss/toggle button such that it retains focus when toggled.
- Updated dependencies

## 14.5.1

### Patch Changes

- Updated dependencies

## 14.5.0

### Minor Changes

- [#17576](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17576)
  [`c04528ade6a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c04528ade6a) -
  **Note**: It is a re-release of the wrongly `patched` version `14.4.2` that should have been a
  `minor` release.

  [ux] Instrumented flag with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- Updated dependencies

## 14.4.2

### Minor Changes

_WRONG RELEASE TYPE - DON'T USE_

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`4567d73813c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4567d73813c) -
  Instrumented flag with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 14.4.1

### Patch Changes

- Updated dependencies

## 14.4.0

### Minor Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`230e1862182`](https://bitbucket.org/atlassian/atlassian-frontend/commits/230e1862182) - Fix a11y
  eslint error in Flag component

### Patch Changes

- Updated dependencies

## 14.3.4

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 14.3.3

### Patch Changes

- [#11649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11649)
  [`bc7669cb402`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc7669cb402) - [ux]
  Fixed flag labels to be more accurately describe their elements.

## 14.3.2

### Patch Changes

- [#12167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12167)
  [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates
  to development dependency `storybook-addon-performance`

## 14.3.1

### Patch Changes

- [#11113](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11113)
  [`1964787a3ce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1964787a3ce) - [ux]
  fixes issue where flags wrapped in another component would fail to autodismiss after 8 seconds in
  FlagGroup
- Updated dependencies

## 14.3.0

### Minor Changes

- [#10569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10569)
  [`c139588c86d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c139588c86d) - Remove
  aria-expanded attribute from Flag close buttons

## 14.2.4

### Patch Changes

- Updated dependencies

## 14.2.3

### Patch Changes

- [#9973](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9973)
  [`57f551bad1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/57f551bad1f) - Flag
  group children types now can have falsy children.

## 14.2.2

### Patch Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use
  injected package name and version for analytics instead of version.json.
- [`b11ea3f327e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b11ea3f327e) - [ux] Fix
  text not being able to be selected.
- Updated dependencies

## 14.2.1

### Patch Changes

- [#7762](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7762)
  [`952019cfd39`](https://bitbucket.org/atlassian/atlassian-frontend/commits/952019cfd39) - Removed
  extraneous/unnecessary dependencies for design system components.

## 14.2.0

### Minor Changes

- [#7882](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7882)
  [`6a9e722703e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a9e722703e) - You can
  now place an `onDismissed` prop on a Flag. This was removed as part of a major version upgrade and
  was previously a "private prop". It has been added back as there is a need for a Flag to know when
  it is being dimissed.

## 14.1.0

### Minor Changes

- [#6930](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6930)
  [`f92b240fc3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f92b240fc3) - Add an
  optional id attribute to FlagGroup via props

## 14.0.8

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 14.0.7

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 14.0.6

### Patch Changes

- Updated dependencies

## 14.0.5

### Patch Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749)
  [`83e32fa998`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83e32fa998) - Now uses
  `useAnalyticsEventHandler` in @atlaskit/analytics-next rather than its own version of the hook
- [`93b04d1161`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93b04d1161) - Fixed
  focus ring cut off issue on flag
- Updated dependencies

## 14.0.4

### Patch Changes

- [#4707](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4707)
  [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable
  integration tests for Edge browser

## 14.0.3

### Patch Changes

- [#4538](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4538)
  [`c740579074`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c740579074) - The h2 for
  Flag Groups no longer causes scrollbars to be triggered when a flag displays.

## 14.0.2

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 14.0.1

### Patch Changes

- [#3293](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3293)
  [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme
  and package information has been updated to point to the new design system website.

## 14.0.0

### Major Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`807cd28fc0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/807cd28fc0) - In this
  version we made flag dramatically faster, lighter and easier to use 🤩

  ### Changes

  In `13.0.0` we bring significant performance improvements as well as improving the experience of
  using flag.

  - Flag no longer has a `peerDependency` on `styled-components@3`. Internally flag is now using
    `@emotion/core` for styling
  - Change Flag and FlagGroup to use our standardized and performant `@atlaskit/motion` instead of
    `react-transition-group`. Along with this change exit animations are now 2x quicker than the
    entering animation as per the standardized animation practices in `motion`.
  - Add a `FlagProvider` wrapper for single page applications that allows you to show flags in a
    flag group imperatively by calling a function, `showFlags` that is stored in the context. Check
    the docs for more details
  - Removed the private props `isDismissAllowed` and `onDismissed` from `FlagProps`, in favour of
    accessing them from context that FlagGroup creates.
  - Made types more specific, `onDismissed` on `FlagGroup` is now defined as
    `(id: number | string, analyticsEvent: UIAnalyticsEvent) => void`

### Patch Changes

- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 13.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 12.4.5

### Patch Changes

- [#2859](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2859)
  [`eec3c9944e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eec3c9944e) - Export
  FlagProps type

## 12.4.4

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 12.4.3

### Patch Changes

- [#2677](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2677)
  [`4560b65a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4560b65a4f) - upgrade
  react-transition-group to latest

## 12.4.2

### Patch Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137)
  [`98f462e2aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98f462e2aa) - Bumping
  use the latest version of @atlaskit/spinner
- Updated dependencies

## 12.4.1

### Patch Changes

- Updated dependencies

## 12.4.0

### Minor Changes

- [#1868](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/1868)
  [`958b2bf6f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/958b2bf6f8) - FIX:
  Screen reader text won't be rendered when there is no flag FIX: FlagGroup screen reader text
  defaults to `h2` tag now. Was previously h1. NEW: Customize screen reader text and the tag that
  renders the text

### Patch Changes

- Updated dependencies

## 12.3.11

### Patch Changes

- [patch][bf7a09790f](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf7a09790f):

  Change imports to comply with Atlassian conventions- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

- Updated dependencies
  [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies
  [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/webdriver-runner@0.3.4

## 12.3.10

### Patch Changes

- Updated dependencies
  [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies
  [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/field-radio-group@7.0.2
  - @atlaskit/button@13.3.9
  - @atlaskit/spinner@12.1.6

## 12.3.9

### Patch Changes

- Updated dependencies
  [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/spinner@12.1.5

## 12.3.8

### Patch Changes

- [patch][5ecbbaadb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ecbbaadb3):

  Fixes flag icon being slightly off center.- Updated dependencies
  [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):

  - @atlaskit/icon@20.0.2

## 12.3.7

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/field-radio-group@7.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/portal@3.1.6
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1

## 12.3.6

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/field-radio-group@7.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/portal@3.1.5

## 12.3.5

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

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
  - @atlaskit/portal@3.1.4
  - @atlaskit/spinner@12.1.3

## 12.3.4

### Patch Changes

- [patch][d222c2b987](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d222c2b987):

  Theme has been converted to Typescript. Typescript consumers will now get static type safety. Flow
  types are no longer provided.

  ### Breaking

  ** getTokens props changes ** When defining the value function passed into a ThemeProvider, the
  getTokens parameter cannot be called without props; if no props are provided an empty object `{}`
  must be passed in:

  ```javascript
  <CustomTheme.Provider
    value={t => ({ ...t(), backgroundColor: '#333'})}
  >
  ```

  becomes:

  ```javascript
  <CustomTheme.Provider
    value={t => ({ ...t({}), backgroundColor: '#333'})}
  >
  ```

  ** Color palette changes ** Color palettes have been moved into their own file. Users will need to
  update imports from this:

  ```javascript
  import { colors } from '@atlaskit/theme';

  colors.colorPalette('8');
  ```

  to this:

  ```javascript
  import { colorPalette } from '@atlaskit/theme';

  colorPalette.colorPalette('8');
  ```

  or for multi entry-point users:

  ```javascript
  import * as colors from '@atlaskit/theme/colors';

  colors.colorPalette('8');
  ```

  to this:

  ```javascript
  import * as colorPalettes from '@atlaskit/theme/color-palette';

  colorPalettes.colorPalette('8');
  ```

## 12.3.3

### Patch Changes

- [patch][f86839ca4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f86839ca4e):

  @atlaskit/portal had an issue in IE11 and this is fixed in 3.1.2

## 12.3.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 12.3.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 12.3.0

### Minor Changes

- [minor][33d2e11038](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/33d2e11038):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help
  products to write better integration and end to end tests.

## 12.2.2

### Patch Changes

- [patch][2b158873d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b158873d1):

  Add linting rule to prevent unsafe usage of setTimeout within React components.

## 12.2.1

### Patch Changes

- [patch][67a3a1ee02](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67a3a1ee02):

  Converts prop types to interfaces

## 12.2.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 12.1.0

### Minor Changes

- [minor][3e0267e5dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e0267e5dd):

  FlagGroup is centered on mobile

## 12.0.20

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 12.0.19

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 12.0.18

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 12.0.17

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 12.0.16

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

  Analytics-next has been converted to Typescript. Typescript consumers will now get static type
  safety. Flow types are no longer provided. No behavioural changes.

  **Breaking changes**

  - `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
  - `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

  **Breaking changes to TypeScript annotations**

  - `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide
    props as a generic type.
  - `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide
    props as a generic type.
  - Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source
    code
  - Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match
    source code
  - Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match
    source code
  - Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
  - Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
  - Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
  - Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
  - Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
  - Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 12.0.15

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 12.0.14

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 12.0.13

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 12.0.12

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

## 12.0.11

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props
  as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps
  of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 12.0.10

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/field-radio-group@6.0.4
  - @atlaskit/portal@3.0.7
  - @atlaskit/icon@19.0.0

## 12.0.9

### Patch Changes

- [patch][76b4718f7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76b4718f7d):

  Fixing mounting and unmounting animations

## 12.0.8

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 12.0.7

### Patch Changes

- [patch][93bcf314c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93bcf314c6):

  Added missing tslib dep

## 12.0.6

### Patch Changes

- [patch][9c80ef7539](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c80ef7539):

  The update to node 10 reveals that unknown type is breaking the extract react types. I had to
  replace unknown type by any

## 12.0.5

### Patch Changes

- [patch][ff649e1001](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff649e1001):

  Widens type of title prop from string to ReactNode. This gives flexibility to pass i18n components
  as flag titles.

## 12.0.4

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/field-radio-group@6.0.2
  - @atlaskit/portal@3.0.3
  - @atlaskit/icon@18.0.0

## 12.0.3

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull
    Request #5942 for details

## 12.0.2

- Updated dependencies
  [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
- Updated dependencies
  [dacfb81ca1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dacfb81ca1):
  - @atlaskit/button@13.0.4
  - @atlaskit/spinner@12.0.0
  - @atlaskit/portal@3.0.0

## 12.0.1

- [patch][cdba81d4f2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba81d4f2):

  - export the correct types so typescript usage works correctly

## 12.0.0

- [major][238b65171f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/238b65171f):

  - @atlaskit/flag has been converted to Typescript. Typescript consumers will now get static type
    safety. Flow types are no longer provided. No API or behavioural changes.

## 11.0.1

- [patch][dccab11ef4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dccab11ef4):

  - Fixed incorrect flag appearing after dismiss a previous one

## 11.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 10.0.7

- Updated dependencies
  [5b6b4d6a0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b6b4d6a0f):
  - @atlaskit/portal@1.0.0

## 10.0.6

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/field-radio-group@5.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/spinner@10.0.7
  - @atlaskit/theme@8.1.7

## 10.0.5

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/field-radio-group@5.0.2
  - @atlaskit/icon@16.0.8
  - @atlaskit/portal@0.3.1
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 10.0.4

- [patch][23672bbd2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23672bbd2d):

  - Improvement: Align the flag actions with title and text for normal appearance flags

## 10.0.3

- Updated dependencies
  [ce4e1b4780](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce4e1b4780):
  - @atlaskit/portal@0.3.0

## 10.0.2

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

## 10.0.1

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/field-radio-group@5.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/portal@0.2.1
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 10.0.0

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

## 9.1.10

- Updated dependencies
  [27cacd44ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27cacd44ab):
  - @atlaskit/portal@0.1.0

## 9.1.9

- Updated dependencies
  [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/field-radio-group@4.0.15
  - @atlaskit/portal@0.0.18
  - @atlaskit/icon@16.0.0

## 9.1.8

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/field-radio-group@4.0.14
  - @atlaskit/icon@15.0.2
  - @atlaskit/portal@0.0.17
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 9.1.7

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/field-radio-group@4.0.13
  - @atlaskit/icon@15.0.1
  - @atlaskit/spinner@9.0.12
  - @atlaskit/theme@7.0.0

## 9.1.6

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/field-radio-group@4.0.12
  - @atlaskit/portal@0.0.16
  - @atlaskit/icon@15.0.0

## 9.1.5

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/field-radio-group@4.0.11
  - @atlaskit/icon@14.6.1
  - @atlaskit/portal@0.0.15
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 9.1.4

- Updated dependencies [1fb2c2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1fb2c2a):
  - @atlaskit/portal@0.0.14

## 9.1.3

- Updated dependencies [3f5a4dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f5a4dd):
  - @atlaskit/portal@0.0.13

## 9.1.2

- [patch] Updated dependencies
  [aaab348](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aaab348)
  - @atlaskit/portal@0.0.12

## 9.1.1

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 9.1.0

- [minor] Now the flag actions accept href and target
  [65af057](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65af057)
- [patch] Updated the flag actions to accept the href and target as props
  [43ac1ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/43ac1ec)

## 9.0.13

- [patch] Updated the flag to use atlaskit button
  [d2084ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2084ad)

## 9.0.12

- [patch] Updated the flag actions use gridSize and fontSize properly
  [3e7da11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e7da11)

## 9.0.11

- [patch] Updated dependencies
  [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/field-radio-group@4.0.8
  - @atlaskit/portal@0.0.10
  - @atlaskit/icon@14.0.0

## 9.0.10

- [patch] Updated dependencies
  [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/icon@13.8.1
  - @atlaskit/portal@0.0.9

## 9.0.9

- [patch] Updated dependencies
  [d9d2f0d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9d2f0d)
- [none] Updated dependencies
  [89be4f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89be4f1)
  - @atlaskit/portal@0.0.8
  - @atlaskit/layer-manager@5.0.11

## 9.0.8

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 9.0.6

- [patch] Updated flags to use atlaskit portal instead of Layer manger
  [b9e6757](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9e6757)
- [none] Updated dependencies
  [b9e6757](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9e6757)

## 9.0.5

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/spinner@9.0.6
  - @atlaskit/layer-manager@5.0.6
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-radio-group@4.0.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 9.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/field-radio-group@4.0.4
  - @atlaskit/layer-manager@5.0.5
  - @atlaskit/icon@13.2.4

## 9.0.3

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/layer-manager@5.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/field-radio-group@4.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2

## 9.0.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/spinner@9.0.3
  - @atlaskit/field-radio-group@4.0.2
  - @atlaskit/layer-manager@5.0.3
  - @atlaskit/icon@13.2.1

## 9.0.1

- [patch] Move analytics tests and replace elements to core
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies
  [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/spinner@9.0.2
  - @atlaskit/docs@5.0.1
  - @atlaskit/field-radio-group@4.0.1

## 9.0.0

- [major] Provides analytics for common component interations. See the
  [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for
  more details. If you are using enzyme for testing you will have to use
  [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme).
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/icon@13.0.0

## 8.2.0

- [minor] Reduce autodismiss flag duration from 15 seconds to 8 seconds
  [5f6ec84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f6ec84)

## 8.1.5

- [patch] Remove or update \$FlowFixMe
  [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies
  [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/button@8.2.4
  - @atlaskit/field-radio-group@3.1.3
  - @atlaskit/icon@12.6.1

## 8.1.4

- [patch] Button should be a dev dependency
  [50ca31b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ca31b)
- [none] Updated dependencies
  [50ca31b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ca31b)

## 8.1.3

- [patch] Updated dependencies
  [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/button@8.2.3

## 8.1.2

- [patch] Fix \$FlowFixMe and release packages
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/button@8.2.2
  - @atlaskit/spinner@7.1.1
  - @atlaskit/field-radio-group@3.1.2
  - @atlaskit/icon@12.3.1

## 8.1.1

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/spinner@7.0.2
  - @atlaskit/field-radio-group@3.0.4
  - @atlaskit/layer-manager@4.2.1
  - @atlaskit/icon@12.1.2

## 8.1.0

- [patch] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/layer-manager@4.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/field-radio-group@3.0.2
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/button@8.1.0

## 8.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies
  [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/layer-manager@4.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/field-radio-group@3.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/spinner@6.0.1
  - @atlaskit/docs@4.0.1

## 8.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/layer-manager@4.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/field-radio-group@3.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0

## 7.0.3

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/layer-manager@3.0.4
  - @atlaskit/field-radio-group@2.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/docs@3.0.4

## 7.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 6.5.3

- [patch] Export the AppearanceTypes type
  [d38fc10](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d38fc10)

## 6.5.2

- [patch] Makes packages Flow types compatible with version 0.67
  [25daac0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25daac0)

## 6.5.1

- [patch] Re-releasing due to potentially broken babel release
  [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 6.5.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3
  [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 6.4.6

- [patch] adds aria-expanded value to expander button in flag
  [7de4577](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7de4577)

## 6.4.5

- [patch] updates Flag to closer match ADG spec
  [5392b60](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5392b60)

## 6.4.4

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 6.4.2

- [patch] Remove babel-plugin-react-flow-props-to-prop-types
  [06c1f08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c1f08)

## 6.4.1

- [patch] Packages Flow types for elements components
  [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 6.4.0

- [minor] Update buttonIcon size depending if CrossIcon or ChevronIcon
  [16bf4e5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/16bf4e5)

## 6.3.0

- [minor] Update the expand button to medium size
  [05d8bd5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05d8bd5)

## 6.2.2

- [patch] Migrate Navigation from Ak repo to ak mk 2 repo, Fixed flow typing inconsistencies in ak
  mk 2 [bdeef5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdeef5b)

## 6.2.1

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website,
  \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 6.2.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 6.1.9

- [patch] migrated flag to mk2
  [630489e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/630489e)

## 6.1.8 (2017-11-22)

- bug fix; long messages in Flags start to wrap, not overflow content.
  ([b69c45f](https://bitbucket.org/atlassian/atlaskit/commits/b69c45f))

## 6.1.7 (2017-11-15)

- bug fix; fix flags within page components appearing behind navigation (issues closed: ak-1823)
  ([08e397e](https://bitbucket.org/atlassian/atlaskit/commits/08e397e))

## 6.1.6 (2017-11-13)

- bug fix; update flag's react-transition-group dependency from v1 to v2 (issues closed: ak-3755)
  ([32f3af3](https://bitbucket.org/atlassian/atlaskit/commits/32f3af3))

## 6.1.5 (2017-11-02)

- bug fix; added missing dependencies (issues closed: ak-3782)
  ([4dbc3ef](https://bitbucket.org/atlassian/atlaskit/commits/4dbc3ef))

## 6.1.4 (2017-10-26)

- bug fix; fix to rebuild stories
  ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 6.1.3 (2017-10-22)

- bug fix; update styled component dependency and react peerDep
  ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))

## 6.1.2 (2017-10-15)

- bug fix; update dependencies for react 16 compatibility
  ([fc47c94](https://bitbucket.org/atlassian/atlaskit/commits/fc47c94))

## 6.1.1 (2017-10-12)

- bug fix; bumps version of Page (issues closed: ak-3680)
  ([8713649](https://bitbucket.org/atlassian/atlaskit/commits/8713649))

## 6.1.0 (2017-08-17)

- feature; adding new AutoDismissFlag component (issues closed: ak-2974 ak-1503)
  ([9aa91c0](https://bitbucket.org/atlassian/atlaskit/commits/9aa91c0))

## 6.0.0 (2017-08-16)

- breaking; The Flag.id prop has been changed from optional to required.
  ([91f8dc4](https://bitbucket.org/atlassian/atlaskit/commits/91f8dc4))
- breaking; FlagGroup no longer illegally reads Flag.props.key
  ([91f8dc4](https://bitbucket.org/atlassian/atlaskit/commits/91f8dc4))

## 5.0.1 (2017-08-15)

- bug fix; flag transitions between appearances smoothly, hides expand icon if not needed (issues
  closed: ak-2973 ak-3155) ([0766202](https://bitbucket.org/atlassian/atlaskit/commits/0766202))

## 5.0.0 (2017-08-11)

- bug fix; fix the theme-dependency
  ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
- breaking; affects internal styled-components implementation
  ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme
  ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))

## 4.0.0 (2017-08-11)

- breaking; affects internal styled-components implementation
  ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme
  ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))

## 3.4.4 (2017-08-04)

- bug fix; moves babel-plugin-react-flow-props-to-prop-types to a devDependency
  ([6378b88](https://bitbucket.org/atlassian/atlaskit/commits/6378b88))

## 3.4.3 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily
  ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.4.2 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps
  ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.1.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts
  ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 3.1.0 (2017-07-17)

- fix; replace incorrect component description in Flag storybook
  ([2c42255](https://bitbucket.org/atlassian/atlaskit/commits/2c42255))
- feature; added ES module builds to dist and add jsnext:main to most ADG packages
  ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.0.0 (2017-07-06)

- fix; add TransitionGroup to FlagGroup to handle lifecycle animations
  ([6dbb237](https://bitbucket.org/atlassian/atlaskit/commits/6dbb237))
- breaking; Removed shouldDismiss prop from Flag. Just set a FlagGroup's children declaratively and
  animation will be handled automatically with TransitionGroup (you don't need to wait until the
  flag has animated out before updating your state).
- ISSUES CLOSED: AK-2558

## 2.2.1 (2017-06-19)

- fix; bump Flag icon dependency to 7.x
  ([35bb4fa](https://bitbucket.org/atlassian/atlaskit/commits/35bb4fa))

## 2.2.0 (2017-06-05)

- fix; add prop-types as a dependency to avoid React 15.x warnings
  ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- feature; added new optional bold flags, controlled by the Flag.appearance prop
  ([b78dca7](https://bitbucket.org/atlassian/atlaskit/commits/b78dca7))

## 2.1.2 (2017-05-12)

- fix; flag dismiss button focus style and spacing now correct
  ([c0130be](https://bitbucket.org/atlassian/atlaskit/commits/c0130be))

## 2.1.1 (2017-05-11)

- fix; bump modal-dialog dep, and change to a devDep
  ([d16f887](https://bitbucket.org/atlassian/atlaskit/commits/d16f887))

## 2.1.0 (2017-05-06)

- feature; allow flags to be dismissed programatically via shouldDismiss prop
  ([445dcb4](https://bitbucket.org/atlassian/atlaskit/commits/445dcb4))

## 2.0.4 (2017-05-02)

- fix; change to dependency on util-shared-styles to correct version
  ([a052c60](https://bitbucket.org/atlassian/atlaskit/commits/a052c60))

## 2.0.3 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license.
  ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 2.0.2 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and
  ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 2.0.1 (2017-04-13)

- fix; update flag stories to use new readme component
  ([1c56c84](https://bitbucket.org/atlassian/atlaskit/commits/1c56c84))

## 2.0.0 (2017-04-04)

- refactor the flag component to use styled-components
  ([615208f](https://bitbucket.org/atlassian/atlaskit/commits/615208f))
- breaking; added peerDependency "styled-components”, removed dependency “classnames”
- ISSUES CLOSED: AK-2028

## 1.0.9 (2017-03-23)

- fix; Empty commit to release the component
  ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.0.6 (2017-03-21)

- fix; accept JSX in description prop
  ([c986abf](https://bitbucket.org/atlassian/atlaskit/commits/c986abf))
- fix; maintainers for all the packages were added
  ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.5 (2017-02-27)

- fix; update flag's icon dependency to latest
  ([e60c12a](https://bitbucket.org/atlassian/atlaskit/commits/e60c12a))

## 1.0.4 (2017-02-20)

- fix; use correctly scoped package names in npm docs
  ([91dbd2f](https://bitbucket.org/atlassian/atlaskit/commits/91dbd2f))

## 1.0.3 (2017-02-10)

- fix; Dummy commit to release components to registry
  ([5bac43b](https://bitbucket.org/atlassian/atlaskit/commits/5bac43b))
