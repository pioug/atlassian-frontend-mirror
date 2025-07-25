# @atlaskit/inline-message

## 15.3.5

### Patch Changes

- [#188952](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188952)
  [`1a88e6e2601ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1a88e6e2601ae) -
  Migrated usage of renamed/deprecated icons
- Updated dependencies

## 15.3.4

### Patch Changes

- [#184952](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/184952)
  [`d25b30df1d8cf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d25b30df1d8cf) -
  Removes invalid html nesting (Divs in Buttons)

## 15.3.3

### Patch Changes

- Updated dependencies

## 15.3.2

### Patch Changes

- [#175398](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175398)
  [`28c7d87f8d2e0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/28c7d87f8d2e0) -
  Updated dev dependencies.
- Updated dependencies

## 15.3.1

### Patch Changes

- Updated dependencies

## 15.3.0

### Minor Changes

- [#160675](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160675)
  [`ec40f9de24066`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ec40f9de24066) -
  Adds `spacing` prop to allow compact spacing on the underlying icon button.
- [#160675](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160675)
  [`5160a5ab2e887`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5160a5ab2e887) -
  Adds `spacing` prop to allow compact spacing on the underlying icon button.

## 15.2.1

### Patch Changes

- Updated dependencies

## 15.2.0

### Minor Changes

- [#157071](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157071)
  [`a149a0b1559ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a149a0b1559ec) -
  We are testing the migration to the ADS Link component behind a feature flag. If this fix is
  successful it will be available in a later release.

### Patch Changes

- Updated dependencies

## 15.1.0

### Minor Changes

- [#152852](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/152852)
  [`ae720e711e4d2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ae720e711e4d2) -
  Adds `fallbackPlacements` prop for specifying a list of backup placements to try when the main
  `placement` does not have enough space. This matches the API of `Popup`.

### Patch Changes

- Updated dependencies

## 15.0.1

### Patch Changes

- Updated dependencies

## 15.0.0

### Major Changes

- [#148091](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148091)
  [`25880861de2d3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/25880861de2d3) -
  Removed deprecated `type` prop. Use the `appearance` prop instead.

### Patch Changes

- Updated dependencies

## 14.0.5

### Patch Changes

- Updated dependencies

## 14.0.4

### Patch Changes

- Updated dependencies

## 14.0.3

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 14.0.2

### Patch Changes

- Updated dependencies

## 14.0.1

### Patch Changes

- Updated dependencies

## 14.0.0

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

## 13.2.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

### Patch Changes

- Updated dependencies

## 13.1.2

### Patch Changes

- Updated dependencies

## 13.1.1

### Patch Changes

- Updated dependencies

## 13.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 13.0.3

### Patch Changes

- [#108679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108679)
  [`b35940a97f3a8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b35940a97f3a8) -
  Update dev dependencies.

## 13.0.2

### Patch Changes

- Updated dependencies

## 13.0.1

### Patch Changes

- Updated dependencies

## 13.0.0

### Major Changes

- [#175912](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175912)
  [`4facbe306465b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4facbe306465b) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR. Please note, in order to
  use this version of `@atlaskit/inline-message`, you will need to ensure that your bundler is
  configured to handle `.css` imports correctly. Most bundlers come with built-in support for `.css`
  imports, so you may not need to do anything. If you are using a different bundler, please refer to
  the documentation for that bundler to understand how to handle `.css` imports. For more
  information on the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

### Patch Changes

- Updated dependencies

## 12.4.3

### Patch Changes

- [#171994](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171994)
  [`be58e4bb2e387`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/be58e4bb2e387) -
  Migrating usages of UNSAFE types and entrypoints that have been renamed in `@atlaskit/icon` and
  `@atlaskit/icon-lab`.
- Updated dependencies

## 12.4.2

### Patch Changes

- [#166026](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166026)
  [`962b5e77810fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/962b5e77810fb) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 12.4.1

### Patch Changes

- Updated dependencies

## 12.4.0

### Minor Changes

- [#157176](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157176)
  [`3d03c4f1002ab`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3d03c4f1002ab) -
  Integrate layering and use CloseManager instead

### Patch Changes

- Updated dependencies

## 12.3.6

### Patch Changes

- Updated dependencies

## 12.3.5

### Patch Changes

- [#149694](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149694)
  [`770bc26d556f7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/770bc26d556f7) -
  Migrate to new icons behind a feature flag
- Updated dependencies

## 12.3.4

### Patch Changes

- Updated dependencies

## 12.3.3

### Patch Changes

- Updated dependencies

## 12.3.2

### Patch Changes

- Updated dependencies

## 12.3.1

### Patch Changes

- Updated dependencies

## 12.3.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 12.2.9

### Patch Changes

- Updated dependencies

## 12.2.8

### Patch Changes

- Updated dependencies

## 12.2.7

### Patch Changes

- Updated dependencies

## 12.2.6

### Patch Changes

- Updated dependencies

## 12.2.5

### Patch Changes

- Updated dependencies

## 12.2.4

### Patch Changes

- [#114683](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114683)
  [`ff0815316ab38`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ff0815316ab38) -
  Removes usage of custom theme button in places where its API is not being used and the default
  button is able to be used instead. This should give a slight performance (runtime) improvement.

## 12.2.3

### Patch Changes

- Updated dependencies

## 12.2.2

### Patch Changes

- [#113051](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113051)
  [`8fb8ca26fb173`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8fb8ca26fb173) -
  Integrate layering in inline dialog
- Updated dependencies

## 12.2.1

### Patch Changes

- Updated dependencies

## 12.2.0

### Minor Changes

- [#110670](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110670)
  [`c733254a2dd6e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c733254a2dd6e) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 12.1.3

### Patch Changes

- Updated dependencies

## 12.1.2

### Patch Changes

- [#104958](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104958)
  [`45033e519694`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/45033e519694) -
  Add layering support to fix escape keyboard issue in modals

## 12.1.1

### Patch Changes

- [#101830](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101830)
  [`3ae5d8dba986`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3ae5d8dba986) -
  Internal change only; update to use primitive components and tokenised typography.
- Updated dependencies

## 12.1.0

### Minor Changes

- [#96634](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96634)
  [`047cd471b7e2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/047cd471b7e2) -
  Add support for React 18 in non-strict mode.

## 12.0.5

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 12.0.4

### Patch Changes

- [#69022](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69022)
  [`395c74147990`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/395c74147990) -
  Migrate packages to use declarative entry points

## 12.0.3

### Patch Changes

- [#63677](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63677)
  [`f320c8ce5039`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f320c8ce5039) -
  This package has been added to the Jira push model.

## 12.0.2

### Patch Changes

- Updated dependencies

## 12.0.1

### Patch Changes

- Updated dependencies

## 12.0.0

### Major Changes

- [#41791](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41791)
  [`ec7c2a38247`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec7c2a38247) - Removed
  all remaining legacy theming logic from the Calendar, Form, InlineDialog, InlineEdit and
  InlineMessage components.

### Patch Changes

- Updated dependencies

## 11.5.8

### Patch Changes

- [#42261](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42261)
  [`5bbffa62596`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bbffa62596) - Remove
  shadowed variable and use type imports

## 11.5.7

### Patch Changes

- [#40650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40650)
  [`07aa588c8a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07aa588c8a4) - Reverts
  the fix to text descender cut-off, due to incompatibilities with Firefox and Safari.

## 11.5.6

### Patch Changes

- [#40832](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40832)
  [`89fccc9c758`](https://bitbucket.org/atlassian/atlassian-frontend/commits/89fccc9c758) - Add
  aria-expanded to communicate expanded/ collapsed state

## 11.5.5

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json
- Updated dependencies

## 11.5.4

### Patch Changes

- [#38209](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38209)
  [`56b444b56a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56b444b56a8) - Fix a
  bug where text descenders were cut off at high zoom levels on Windows

## 11.5.3

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754)
  [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use
  `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility
  testing.

## 11.5.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 11.5.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 11.5.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 11.4.10

### Patch Changes

- [#31552](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31552)
  [`f6d92b4a378`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6d92b4a378) - Migrates
  unit tests from enzyme to RTL.

## 11.4.9

### Patch Changes

- Updated dependencies

## 11.4.8

### Patch Changes

- [#29390](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29390)
  [`18aeca8c199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18aeca8c199) - Internal
  change to update token references. There is no expected behaviour or visual change.

## 11.4.7

### Patch Changes

- [#28064](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28064)
  [`b0f6dd0bc35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0f6dd0bc35) - Updated
  to use typography tokens. There is no expected behaviour or visual change.

## 11.4.6

### Patch Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090)
  [`25902de2d93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/25902de2d93) - [ux]
  Added pressed (active) state styles for the secondary text.

## 11.4.5

### Patch Changes

- Updated dependencies

## 11.4.4

### Patch Changes

- Updated dependencies

## 11.4.3

### Patch Changes

- Updated dependencies

## 11.4.2

### Patch Changes

- [#26408](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26408)
  [`9de88fa1e1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9de88fa1e1e) - Internal
  changes to include spacing tokens in component implementations.

## 11.4.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 11.4.0

### Minor Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004)
  [`bcf29b33526`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bcf29b33526) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- Updated dependencies

## 11.3.1

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 11.3.0

### Minor Changes

- [#23573](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23573)
  [`38469010a1c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/38469010a1c) - Replaces
  usage of the `type` prop with `appearance`.

## 11.2.8

### Patch Changes

- [#21545](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21545)
  [`efa50ac72ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efa50ac72ba) - Adjusts
  jsdoc strings to improve prop documentation

## 11.2.7

### Patch Changes

- Updated dependencies

## 11.2.6

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4
- Updated dependencies

## 11.2.5

### Patch Changes

- Updated dependencies

## 11.2.4

### Patch Changes

- Updated dependencies

## 11.2.3

### Patch Changes

- Updated dependencies

## 11.2.2

### Patch Changes

- Updated dependencies

## 11.2.1

### Patch Changes

- Updated dependencies

## 11.2.0

### Minor Changes

- [#16759](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16759)
  [`3d6d3a581d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d6d3a581d6) -
  Instrumented `@atlaskit/inline-message` with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

## 11.1.5

### Patch Changes

- [#15632](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15632)
  [`34282240102`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34282240102) - Adds
  explicit type to button usages components.

## 11.1.4

### Patch Changes

- Updated dependencies

## 11.1.3

### Patch Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`af4bca32ad4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af4bca32ad4) - Internal
  changes to supress eslint rules.
- Updated dependencies

## 11.1.2

### Patch Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`8279380176b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8279380176b) - Internal
  code changes.
- Updated dependencies

## 11.1.1

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 11.1.0

### Minor Changes

- [#12328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12328)
  [`1489097139d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1489097139d) - Added
  iconLabel prop to provide useful information to users with screen readers
- [`65388bb777d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65388bb777d) - Removes
  the `styled-components` dependency from the package. Still has a transitive reliance on
  `styled-components` via `inline-dialog`. There should be no visual or UX change.

### Patch Changes

- [`9c98e8227f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c98e8227f6) - Internal
  refactor for style declarations.
- Updated dependencies

## 11.0.8

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 11.0.7

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 11.0.6

### Patch Changes

- Updated dependencies

## 11.0.5

### Patch Changes

- Updated dependencies

## 11.0.4

### Patch Changes

- [#4707](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4707)
  [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable
  integration tests for Edge browser

## 11.0.3

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 11.0.2

### Patch Changes

- [#3293](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3293)
  [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme
  and package information has been updated to point to the new design system website.

## 11.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`94ba4f2381`](https://bitbucket.org/atlassian/atlassian-frontend/commits/94ba4f2381) - Formatted
  testId prop description. The prop description was formatted incorrectly.

## 11.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 10.1.8

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866)
  [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and
  supporting files will no longer be published to npm

## 10.1.7

### Patch Changes

- Updated dependencies

## 10.1.6

### Patch Changes

- [patch][68e206c857](https://bitbucket.org/atlassian/atlassian-frontend/commits/68e206c857):

  Change imports to comply with Atlassian conventions- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

- Updated dependencies
  [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies
  [3a09573b4e](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a09573b4e):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies
  [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/inline-dialog@12.1.12
  - @atlaskit/webdriver-runner@0.3.4

## 10.1.5

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
  - @atlaskit/button@13.3.9
  - @atlaskit/inline-dialog@12.1.11

## 10.1.4

### Patch Changes

- Updated dependencies
  [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/inline-dialog@12.1.10

## 10.1.3

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/inline-dialog@12.1.9
  - @atlaskit/theme@9.5.1

## 10.1.2

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/inline-dialog@12.1.8

## 10.1.1

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
  - @atlaskit/inline-dialog@12.1.7

## 10.1.0

### Minor Changes

- [minor][3c86f3180f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c86f3180f):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help
  products to write better integration and end to end tests.

## 10.0.15

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 10.0.14

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 10.0.13

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 10.0.12

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 10.0.11

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 10.0.10

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 10.0.9

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

## 10.0.8

### Patch Changes

- [patch][29a1f158c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29a1f158c1):

  Use default react import in typescript files.

## 10.0.7

- Updated dependencies
  [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/inline-dialog@12.0.3
  - @atlaskit/icon@19.0.0

## 10.0.6

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 10.0.5

### Patch Changes

- [patch][93bcf314c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93bcf314c6):

  Added missing tslib dep

## 10.0.4

### Patch Changes

- [patch][3b13bd0816](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b13bd0816):

  Both title and secondaryText prop type changed from string to React.ReactNode. This provides more
  flexibility for consumers to provide i18n components such as FormattedMessage.

## 10.0.3

- Updated dependencies
  [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/inline-dialog@12.0.1
  - @atlaskit/icon@18.0.0

## 10.0.2

- Updated dependencies
  [181209d135](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/181209d135):
  - @atlaskit/inline-dialog@12.0.0

## 10.0.1

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull
    Request #5942 for details

## 10.0.0

- [major][66af32c013](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66af32c013):

  - @atlaskit/inline-message has been converted to Typescript. Typescript consumers will now get
    static type safety. Flow types are no longer provided. No API or behavioural changes.

## 9.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 8.0.3

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/inline-dialog@10.0.4
  - @atlaskit/theme@8.1.7

## 8.0.2

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/icon@16.0.8
  - @atlaskit/inline-dialog@10.0.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 8.0.1

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/inline-dialog@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 8.0.0

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

## 7.0.11

- Updated dependencies
  [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/inline-dialog@9.0.14
  - @atlaskit/icon@16.0.0

## 7.0.10

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/icon@15.0.2
  - @atlaskit/inline-dialog@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 7.0.9

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/icon@15.0.1
  - @atlaskit/inline-dialog@9.0.12
  - @atlaskit/theme@7.0.0

## 7.0.8

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/inline-dialog@9.0.11
  - @atlaskit/icon@15.0.0

## 7.0.7

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/inline-dialog@9.0.10
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 7.0.6

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 7.0.5

- [patch] Updated dependencies
  [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/inline-dialog@9.0.6
  - @atlaskit/icon@14.0.0

## 7.0.4

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 7.0.3

- [patch] Inline-message now closes on outside click correctly.
  [988b80a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/988b80a)

## 7.0.1

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/inline-dialog@9.0.2
  - @atlaskit/icon@13.2.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 7.0.0

- [major] Inline-message "position" prop has been changed to "placement" to align with what is in
  @atlaskit/inline-dialog and react-popper
  [333a440](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/333a440)

* [patch] Updated dependencies
  [1d9e75a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9e75a)
  - @atlaskit/inline-dialog@9.0.0
* [none] Updated dependencies
  [a3109d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3109d3)
  - @atlaskit/inline-dialog@9.0.0
* [none] Updated dependencies
  [87d45d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d45d3)
  - @atlaskit/inline-dialog@9.0.0
* [none] Updated dependencies
  [a08b0c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a08b0c2)
  - @atlaskit/inline-dialog@9.0.0

## 6.0.3

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/inline-dialog@8.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/icon@13.2.4

## 6.0.2

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/inline-dialog@8.0.3
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/docs@5.0.2

## 6.0.1

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/inline-dialog@8.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/icon@13.2.1

## 6.0.0

- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/inline-dialog@8.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/inline-dialog@8.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0

## 5.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/inline-dialog@7.1.2
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/icon@12.1.2

## 5.1.1

- [patch] Update changelogs to remove duplicate
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/inline-dialog@7.1.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 5.1.0

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/inline-dialog@7.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/button@8.1.0

## 5.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies
  [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/icon@12.0.1
  - @atlaskit/inline-dialog@7.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 5.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/icon@12.0.0
  - @atlaskit/inline-dialog@7.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 4.0.2

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/inline-dialog@6.0.2
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 4.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 3.2.2

- [patch] Re-releasing due to potentially broken babel release
  [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 3.2.1

- [patch] added truncating logic for text in inline message
  [0b59d44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0b59d44)

## 3.2.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3
  [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 3.1.3

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 3.1.2

- [patch] Packages Flow types for elements components
  [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 3.1.1

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website,
  \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 3.1.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 3.0.6

- [patch] updated icons for error, info and udpated size of icon for confirmation
  [824c40d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/824c40d)

## 3.0.5

- [patch] migrate inline-message from ak to mk-2
  [2323022](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2323022)

## 3.0.4 (2017-10-26)

- bug fix; fix to rebuild stories
  ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 3.0.3 (2017-10-22)

- bug fix; update styled component dependency and react peerDep
  ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))

## 3.0.2 (2017-10-15)

- bug fix; update dependencies for react 16 compatibility
  ([fc47c94](https://bitbucket.org/atlassian/atlaskit/commits/fc47c94))

## 3.0.1 (2017-09-21)

- bug fix; removed unnecessary horizontal spacing on inline-messages (issues closed: ak-2603)
  ([d608d79](https://bitbucket.org/atlassian/atlaskit/commits/d608d79))

## 3.0.0 (2017-08-24)

- feature; remove util-shared-styles
  ([d0331cf](https://bitbucket.org/atlassian/atlaskit/commits/d0331cf))
- breaking; Update inline message to include dark mode theming
  ([dfc37f8](https://bitbucket.org/atlassian/atlaskit/commits/dfc37f8))
- breaking; update inline message to include dark mode theming (issues closed: #ak-3237)
  ([dfc37f8](https://bitbucket.org/atlassian/atlaskit/commits/dfc37f8))

## 2.5.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily
  ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 2.5.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps
  ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 2.2.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts
  ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))
- feature; added ES module builds to dist and add jsnext:main to most ADG packages
  ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 2.1.1 (2017-06-20)

- fix; bump inline-message dependencies to latest
  ([f705804](https://bitbucket.org/atlassian/atlaskit/commits/f705804))

## 2.1.0 (2017-06-08)

- fix; add prop-types as a dependency to avoid React 15.x warnings
  ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- feature; refactor inline-message to styled-components
  ([5144fc5](https://bitbucket.org/atlassian/atlaskit/commits/5144fc5))

## 2.0.0 (2017-05-11)

- fix; update dependencies ([6b6f84e](https://bitbucket.org/atlassian/atlaskit/commits/6b6f84e))
- bumps util-shared-styles and inline-dialog dependencies to latest versions
  ([b02a77d](https://bitbucket.org/atlassian/atlaskit/commits/b02a77d))
- breaking; Introduces react-dom as a peer dependency (to satisfy inline-dialogs peer dep)
- ISSUES CLOSED: AK-2361

## 1.2.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license.
  ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 1.2.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and
  ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 1.2.0 (2017-04-20)

- feature; removed explicit style! imports, set style-loader in webpack config
  ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 1.1.3 (2017-03-23)

- fix; Empty commit to release the component
  ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.1.1 (2017-03-21)

- fix; maintainers for all the packages were added
  ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.1.0 (2017-03-03)

- feature; allow positioning of dialog for inline messages
  ([bdaa4d6](https://bitbucket.org/atlassian/atlaskit/commits/bdaa4d6))

## 1.0.2 (2017-02-09)

- fix; avoiding binding render to this
  ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.0.1 (2017-02-06)

- fix; Updates packages to use scoped ak packages
  ([f16660f](https://bitbucket.org/atlassian/atlaskit/commits/f16660f))
