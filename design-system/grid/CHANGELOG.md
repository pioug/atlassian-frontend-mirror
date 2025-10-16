# @atlaskit/grid

## 0.18.13

### Patch Changes

- Updated dependencies

## 0.18.12

### Patch Changes

- Updated dependencies

## 0.18.11

### Patch Changes

- Updated dependencies

## 0.18.10

### Patch Changes

- [`f0662cd7a143e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0662cd7a143e) -
  Internal changes to how borders are applied.
- Updated dependencies

## 0.18.9

### Patch Changes

- Updated dependencies

## 0.18.8

### Patch Changes

- [`74c2f420ee49b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/74c2f420ee49b) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 0.18.7

### Patch Changes

- Updated dependencies

## 0.18.6

### Patch Changes

- [`3b5b4a919aaaf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3b5b4a919aaaf) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 0.18.5

### Patch Changes

- Updated dependencies

## 0.18.4

### Patch Changes

- Updated dependencies

## 0.18.3

### Patch Changes

- Updated dependencies

## 0.18.2

### Patch Changes

- Updated dependencies

## 0.18.1

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 0.18.0

### Minor Changes

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

## 0.17.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

### Patch Changes

- Updated dependencies

## 0.16.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 0.15.3

### Patch Changes

- [#108119](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108119)
  [`a1b3eebdf2de0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a1b3eebdf2de0) -
  Update dev depdencies and remove unused internal exports.

## 0.15.2

### Patch Changes

- Updated dependencies

## 0.15.1

### Patch Changes

- Updated dependencies

## 0.15.0

### Minor Changes

- [#162907](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162907)
  [`a42b394d7e66c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a42b394d7e66c) -
  Compiled migration to @compiled/react

### Patch Changes

- Updated dependencies

## 0.14.2

### Patch Changes

- [#166026](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166026)
  [`962b5e77810fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/962b5e77810fb) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 0.14.1

### Patch Changes

- Updated dependencies

## 0.14.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

## 0.13.6

### Patch Changes

- Updated dependencies

## 0.13.5

### Patch Changes

- Updated dependencies

## 0.13.4

### Patch Changes

- [#118735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118735)
  [`ad71dcb74e32d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ad71dcb74e32d) -
  Remove remnants of `extract-react-types`.

## 0.13.3

### Patch Changes

- Updated dependencies

## 0.13.2

### Patch Changes

- Updated dependencies

## 0.13.1

### Patch Changes

- Updated dependencies

## 0.13.0

### Minor Changes

- [#110670](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110670)
  [`c733254a2dd6e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c733254a2dd6e) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 0.12.2

### Patch Changes

- Updated dependencies

## 0.12.1

### Patch Changes

- Updated dependencies

## 0.12.0

### Minor Changes

- [#91576](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91576)
  [`6a97f44d3d0e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6a97f44d3d0e) -
  Add support for React 18 in non-strict mode.

## 0.11.17

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 0.11.16

### Patch Changes

- Updated dependencies

## 0.11.15

### Patch Changes

- Updated dependencies

## 0.11.14

### Patch Changes

- Updated dependencies

## 0.11.13

### Patch Changes

- [#75794](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75794)
  [`ad85a4f7830d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ad85a4f7830d) -
  Add accessibility unit tests for grid

## 0.11.12

### Patch Changes

- Updated dependencies

## 0.11.11

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 0.11.10

### Patch Changes

- [#38000](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38000)
  [`8914885e490`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8914885e490) - Updates
  metadata in grid package.

## 0.11.9

### Patch Changes

- [#37533](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37533)
  [`1ed303de3e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ed303de3e8) - Updated
  dependencies

## 0.11.8

### Patch Changes

- Updated dependencies

## 0.11.7

### Patch Changes

- Updated dependencies

## 0.11.6

### Patch Changes

- Updated dependencies

## 0.11.5

### Patch Changes

- Updated dependencies

## 0.11.4

### Patch Changes

- [#35149](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35149)
  [`37131e3a8ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37131e3a8ea) - Uses the
  Alpha release of our responsive media helpers via either the public `media` export or the internal
  `UNSAFE_media` export.
- Updated dependencies

## 0.11.3

### Patch Changes

- Updated dependencies

## 0.11.2

### Patch Changes

- Updated dependencies

## 0.11.1

### Patch Changes

- Updated dependencies

## 0.11.0

### Minor Changes

- [#34217](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34217)
  [`5c00a3ac8bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c00a3ac8bb) - Grid now
  applies rem based breakpoints.

## 0.10.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 0.10.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 0.10.0

### Minor Changes

- [#33106](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33106)
  [`b699bbebf6b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b699bbebf6b) - [ux] Add
  GridContainer, a component that allows the vertical stacking of independent Grid components while
  keeping the standard grid gap between grids

## 0.9.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 0.8.10

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424)
  [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY
  remove before merging to master; dupe adf-schema via adf-utils

## 0.8.9

### Patch Changes

- Updated dependencies

## 0.8.8

### Patch Changes

- Updated dependencies

## 0.8.7

### Patch Changes

- Updated dependencies

## 0.8.6

### Patch Changes

- Updated dependencies

## 0.8.5

### Patch Changes

- Updated dependencies

## 0.8.4

### Patch Changes

- [#31206](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31206)
  [`261420360ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/261420360ec) - Upgrades
  component types to support React 18.

## 0.8.3

### Patch Changes

- [#31242](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31242)
  [`cfe48bb7ece`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfe48bb7ece) - Internal
  change only. Replace usages of Inline/Stack with stable version from `@atlaskit/primitives`.

## 0.8.2

### Patch Changes

- [#31286](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31286)
  [`49af5b4261e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49af5b4261e) - Consider
  the Grid now in Closed Beta!

## 0.8.1

### Patch Changes

- [#31041](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31041)
  [`842bb999a85`](https://bitbucket.org/atlassian/atlassian-frontend/commits/842bb999a85) - Internal
  change only. Replace usages of Inline/Stack with stable version from `@atlaskit/primitives`.

## 0.8.0

### Minor Changes

- [#30894](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30894)
  [`28a87e4d9a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28a87e4d9a2) - All
  responsive helpers, types, and breakpoints have been migrated to `@atlaskit/primitives/responsive`
  and imported from there. There should be no functionality change, though this is a breaking change
  while we're in Alpha and these are strictly used internally.

### Patch Changes

- Updated dependencies

## 0.7.0

### Minor Changes

- [#30814](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30814)
  [`96d7e8fa14e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96d7e8fa14e) - Add a
  new `xxs` breakpoint and adjust the `xs` breakpoint

## 0.6.0

### Minor Changes

- [#30769](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30769)
  [`3062f11f279`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3062f11f279) - Add the
  ability to hide a GridItem entirely at a breakpoint and document hasInlinePadding.

## 0.5.0

### Minor Changes

- [#30532](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30532)
  [`0ceafd30000`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ceafd30000) - Further
  revisions to the Alpha Grid API and adding a `noInlinePadding` prop.

## 0.4.0

### Minor Changes

- [#30490](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30490)
  [`cbd0b817e56`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cbd0b817e56) - Adds
  `hasInlinePadding` prop that controls whether the grid includes `padding-inline` gutters

## 0.3.0

### Minor Changes

- [#30268](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30268)
  [`bc3d3a45fb6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc3d3a45fb6) - Major
  renaming and API api changes trying to close out our Alpha state

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#29098](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29098)
  [`2d3c5a69c76`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d3c5a69c76) - Change
  from a width flow to a maxWidth restriction with full-width explicitly by default.

## 0.1.0

### Minor Changes

- [#29150](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29150)
  [`b47d1de31c6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b47d1de31c6) - Disables
  nested grid usage until we have clear guidance and working examples in place.

## 0.0.3

### Patch Changes

- [#27891](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27891)
  [`eadbf13d8c0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eadbf13d8c0) - Updated
  usages of `Text`, `Box`, `Stack`, and `Inline` primitives to reflect their updated APIs. There are
  no visual or behaviour changes.

## 0.0.2

### Patch Changes

- [#28708](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28708)
  [`5a67d3086ca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a67d3086ca) - Initial
  alpha release of the component.

## 0.0.1

### Patch Changes

- Initial release.
