# @atlaskit/locale

## 3.0.3

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- [#164146](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/164146)
  [`cb9fe0058ed87`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cb9fe0058ed87) -
  Updates package.json direct dependencies to align with actual usage.

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

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

## 2.8.3

### Patch Changes

- [#111041](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111041)
  [`333c6c17ffbbc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/333c6c17ffbbc) -
  Update dependencies.

## 2.8.2

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 2.8.1

### Patch Changes

- Updated dependencies

## 2.8.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 2.7.0

### Minor Changes

- [#93674](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93674)
  [`ca69fae2d873`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ca69fae2d873) -
  Add support for React 18 in non-strict mode.

## 2.6.5

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 2.6.4

### Patch Changes

- [#69022](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69022)
  [`395c74147990`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/395c74147990) -
  Migrate packages to use declarative entry points

## 2.6.3

### Patch Changes

- [#60029](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60029)
  [`b9826ea49c47`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b9826ea49c47) -
  Update dependencies that were impacted by HOT-106483 to latest.

## 2.6.2

### Patch Changes

- [#43918](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43918)
  [`d100ca42f46`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d100ca42f46) - Push
  model consumption configuration done for these packages

## 2.6.1

### Patch Changes

- Updated dependencies

## 2.6.0

### Minor Changes

- [#40135](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40135)
  [`b12fd55deaa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b12fd55deaa) - Expose
  selected locale

## 2.5.4

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json

## 2.5.3

### Patch Changes

- [#38651](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38651)
  [`60f2d9bdf8b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/60f2d9bdf8b) - [ux] Add
  `lang` attribute to text box for more context for assistive technology users.

## 2.5.2

### Patch Changes

- [#37600](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37600)
  [`fc22bf58d47`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc22bf58d47) - id prop
  added to LocaleSelect to provide better association abilities.

## 2.5.1

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 2.5.0

### Minor Changes

- [#33630](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33630)
  [`13d26e2043a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/13d26e2043a) - Add
  getDaysLong function to get non-truncated weekday names.

## 2.4.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 2.4.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 2.3.6

### Patch Changes

- Updated dependencies

## 2.3.5

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 2.3.4

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 2.3.3

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 2.3.2

### Patch Changes

- Updated dependencies

## 2.3.1

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [#8178](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8178)
  [`ec026e28730`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec026e28730) -
  `#getDaysShort` function now accepts new `#weekStartDay` parameter that controls which day of the
  week should be used at the start. This parameter accepts the following values:

  - `0` sunday (default value)
  - `1` monday
  - `2` tuesday
  - `3` wednesday
  - `4` thursday
  - `5` friday
  - `6` saturday

## 2.2.0

### Minor Changes

- [#8029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8029)
  [`689cf039197`](https://bitbucket.org/atlassian/atlassian-frontend/commits/689cf039197) -
  `#getDaysShort` function now accepts new `#weekStartDay` parameter that controls which day of the
  week should be used at the start. This parameter accepts the following values:

  - `0` sunday (default value)
  - `1` monday
  - `2` tuesday
  - `3` wednesday
  - `4` thursday
  - `5` friday
  - `6` saturday

## 2.1.3

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 2.1.2

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 2.1.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 2.1.0

### Minor Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`f3416b3fb4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3416b3fb4) -
  LocalizationProvider implements formatToParts method

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 1.0.6

### Patch Changes

- [patch][296a8b114b](https://bitbucket.org/atlassian/atlassian-frontend/commits/296a8b114b):

  FIXED: Intl.DateTimeFormat returns March instead of April in Safari- Updated dependencies
  [91a1eb05db](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a1eb05db):

  - @atlaskit/textfield@3.1.7

## 1.0.5

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/field-base@14.0.1
  - @atlaskit/select@11.0.7
  - @atlaskit/textfield@3.1.6

## 1.0.4

### Patch Changes

- Updated dependencies
  [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/field-base@14.0.0
  - @atlaskit/docs@8.3.1
  - @atlaskit/select@11.0.6
  - @atlaskit/textfield@3.1.5

## 1.0.3

### Patch Changes

- [patch][3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  Make PopupSelect correctly pass props. Forcing update of @atlaskit/select for all other packages-
  Updated dependencies
  [3a20e9a596](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3a20e9a596):

  - @atlaskit/select@11.0.2

## 1.0.2

### Patch Changes

- [patch][30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):

  @atlaskit/select has been converted to Typescript. Typescript consumers will now get static type
  safety. Flow types are no longer provided. No API or behavioural changes.

## 1.0.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 1.0.0

### Major Changes

- [major][d02e7d6018](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02e7d6018):

  Initial release of @atlaskit/locale

  This is a new package, providing utility functions that are an abstraction on top of
  [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)
