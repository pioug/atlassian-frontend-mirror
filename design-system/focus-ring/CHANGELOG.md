# @atlaskit/focus-ring

## 3.0.7

### Patch Changes

- Updated dependencies

## 3.0.6

### Patch Changes

- Updated dependencies

## 3.0.5

### Patch Changes

- [`248faa32d4835`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/248faa32d4835) -
  Internal changes to how borders are applied.

## 3.0.4

### Patch Changes

- [`f0662cd7a143e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0662cd7a143e) -
  Internal changes to how borders are applied.
- Updated dependencies

## 3.0.3

### Patch Changes

- [`23bcc5bbc9cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23bcc5bbc9cee) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 3.0.2

### Patch Changes

- Updated dependencies

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

## 2.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- [#107235](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107235)
  [`845d6a4956e61`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/845d6a4956e61) -
  Update dependencies.

## 2.0.2

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 2.0.1

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [#170214](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/170214)
  [`ed07db7789d4e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ed07db7789d4e) -
  Remove Compiled variant.

## 1.7.0

### Minor Changes

- [#159379](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/159379)
  [`821ffec580412`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/821ffec580412) -
  Adds an experimental Compiled CSS-in-JS entrypoint for our Focus Ring component. This requires
  specific setup that is not documented fully and is not intended for external consumption.

## 1.6.1

### Patch Changes

- Updated dependencies

## 1.6.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [#110670](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110670)
  [`c733254a2dd6e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c733254a2dd6e) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

## 1.4.1

### Patch Changes

- [#111297](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111297)
  [`5f51c15a6d33f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5f51c15a6d33f) -
  Adds a `:focus` style reset to prevent `:focus` styles with lower specificity from leaking
  through.

## 1.4.0

### Minor Changes

- [#96204](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/96204)
  [`a53c45efeac1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a53c45efeac1) -
  Add support for React 18 in non-strict mode.

## 1.3.9

### Patch Changes

- [#83297](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83297)
  [`6b1707c169e0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b1707c169e0) -
  The internal composition of this component has changed. There is no expected change in behaviour.

## 1.3.8

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.3.7

### Patch Changes

- [#72130](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72130)
  [`b037e5451037`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b037e5451037) -
  Update new button text color fallback for default theme (non-token) to match that of old button
  current text color

## 1.3.6

### Patch Changes

- [#39309](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39309)
  [`1e90520801a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e90520801a) - Added
  this package into push model consumption.

## 1.3.5

### Patch Changes

- [#38098](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38098)
  [`63ee052ee1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63ee052ee1b) - Fix
  focus-ring border width token with `border.width.outline`

## 1.3.4

### Patch Changes

- [#37186](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37186)
  [`ce22a54e852`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ce22a54e852) - [ux]
  update focus ring outline border.focused fallback to B200 to meet contrast

## 1.3.3

### Patch Changes

- [#32935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32935)
  [`b1bdec7cce2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1bdec7cce2) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 1.3.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 1.3.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 1.3.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 1.2.6

### Patch Changes

- [#31299](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31299)
  [`c23cf0b085d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c23cf0b085d) - Adds
  display name to component for React devtools debugging.

## 1.2.5

### Patch Changes

- [#30125](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30125)
  [`7f5f23dcb68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f5f23dcb68) -
  Introduce shape tokens to some packages.

## 1.2.4

### Patch Changes

- Updated dependencies

## 1.2.3

### Patch Changes

- Updated dependencies

## 1.2.2

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#26244](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26244)
  [`71bf011db22`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71bf011db22) - Focus
  ring inset styles are now applied via outline - consistent with offset styles.

## 1.1.0

### Minor Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`b5d79ded842`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5d79ded842) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

## 1.0.7

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 1.0.6

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 1.0.5

### Patch Changes

- Updated dependencies

## 1.0.4

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 1.0.3

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`3e1a93c6b67`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e1a93c6b67) - Releases
  FocusRing to v1.

### Minor Changes

- [`63b8679585b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63b8679585b) - Adds an
  additional prop `focus` to the `FocusRing` to allow the component to also be controlled. This prop
  is designed to be used in conjunction with a complementary hook; `useFocusRing`.

## 0.2.7

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Updates
  usage of deprecated token names so they're aligned with the latest naming conventions. No UI or
  visual changes
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - [ux] The
  component has reworked its internal so that it can now better deal with issues where the
  background-color was obscured by the focus-ring box shadow.
- Updated dependencies

## 0.2.6

### Patch Changes

- Updated dependencies

## 0.2.5

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 0.2.4

### Patch Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777)
  [`6c1c909296d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c1c909296d) - [ux]
  When composing elements that define class name they will now be correctly retained.
- Updated dependencies

## 0.2.3

### Patch Changes

- [#15632](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15632)
  [`34282240102`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34282240102) - Adds
  explicit type to button usages components.

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`c765dce3afb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c765dce3afb) - [ux]
  Focus Ring now exposes an additional prop `isInset` to support inset focus states; for example on
  inputs, or textfields.
- [`0dac09c47b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0dac09c47b6) - [ux]
  Colors are now sourced through tokens.

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [#13232](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13232)
  [`9c9296f2959`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c9296f2959) - Fix bug
  where the package was being exported from the wrong file.

## 0.1.0

### Minor Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`5ab09801cfa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ab09801cfa) - [ux]
  Updates focus-ring to use an offset box-shadow for its focus state.
- [`adaa7913de0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/adaa7913de0) - Initial
  release for the package. A Focus Ring can be used to compose focusable elements with a simple
  composable API.

### Patch Changes

- Updated dependencies

## 0.0.4

### Patch Changes

- [#8306](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8306)
  [`229b32842b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/229b32842b5) - Fix
  .npmignore and tsconfig.json for **tests**

## 0.0.3

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 0.0.2

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 0.0.1

### Patch Changes

- [#4967](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4967)
  [`b443b5a60f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b443b5a60f) - Renamed
  template package
