# @atlaskit/link

## 3.2.13

### Patch Changes

- Updated dependencies

## 3.2.12

### Patch Changes

- Updated dependencies

## 3.2.11

### Patch Changes

- Updated dependencies

## 3.2.10

### Patch Changes

- Updated dependencies

## 3.2.9

### Patch Changes

- Updated dependencies

## 3.2.8

### Patch Changes

- [`39e543109ec09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e543109ec09) -
  add type info to forwardRef components
- Updated dependencies

## 3.2.7

### Patch Changes

- Updated dependencies

## 3.2.6

### Patch Changes

- Updated dependencies

## 3.2.5

### Patch Changes

- [#197573](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/197573)
  [`625d873ae37d7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/625d873ae37d7) -
  Align external link icon with text baseline in small text sizes using verticalAlign: 'baseline'.

## 3.2.4

### Patch Changes

- Updated dependencies

## 3.2.3

### Patch Changes

- Updated dependencies

## 3.2.2

### Patch Changes

- Updated dependencies

## 3.2.1

### Patch Changes

- Updated dependencies

## 3.2.0

### Minor Changes

- [#157071](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157071)
  [`a149a0b1559ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a149a0b1559ec) -
  We are testing the migration to the ADS Link component behind a feature flag. If this fix is
  successful it will be available in a later release.

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#130861](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130861)
  [`d9382f9b1d1a6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d9382f9b1d1a6) -
  Explicit typography tokens for link components. No UI change expected.

## 3.0.2

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 3.0.1

### Patch Changes

- [#119262](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/119262)
  [`f5d20f9d90df2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f5d20f9d90df2) -
  [ux] `color` and `text-decoration` style specificity have been increased to reduce the probability
  of global `<a>` tag styles interfering with link styles.

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

## 2.2.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

### Patch Changes

- Updated dependencies

## 2.1.2

### Patch Changes

- [#109895](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109895)
  [`bcff15cd1958c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bcff15cd1958c) -
  Update dependencies and refactor internals.

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

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

- [#181101](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/181101)
  [`b7ebb0f06c1a5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b7ebb0f06c1a5) -
  Migrated from `@emotion/react` to `@compiled/react` in order to improve performance, align with
  the rest of the Atlaskit techstack, and support React 18 Streaming SSR. Please note, in order to
  use this version of `@atlaskit/link`, you will need to ensure that your bundler is configured to
  handle `.css` imports correctly. Most bundlers come with built-in support for `.css` imports, so
  you may not need to do anything. If you are using a different bundler, please refer to the
  documentation for that bundler to understand how to handle `.css` imports. For more information on
  the migration, please refer to
  [RFC-73 Migrating our components to Compiled CSS-in-JS](https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953).

## 1.2.7

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 1.2.6

### Patch Changes

- Updated dependencies

## 1.2.5

### Patch Changes

- [#147531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147531)
  [`8ae1e110621b7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8ae1e110621b7) -
  Internal changes to feature flag used to toggle new icons

## 1.2.4

### Patch Changes

- [#138899](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138899)
  [`681abcfc0d92a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/681abcfc0d92a) -
  Add style textDecoration: 'underline', when link is focused.

## 1.2.3

### Patch Changes

- [#137980](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137980)
  [`1125392e09989`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1125392e09989) -
  Updated the icon, which displays when links open in new windows to use new iconography behind a
  feature flag. Also adjusted the alignment and size of the icon.

## 1.2.2

### Patch Changes

- [#137759](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137759)
  [`6baf3b623943c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6baf3b623943c) -
  Updated the icon, which displays when links open in new windows to use new iconography. Also
  adjusted the alignment and size of the icon.

## 1.2.1

### Patch Changes

- [#126471](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126471)
  [`072422c87cc97`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/072422c87cc97) -
  [ux] Visited inverse links no longer support visited styles due to color contrast limitations.

## 1.2.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#127699](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127699)
  [`b2f6eae3ec0b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b2f6eae3ec0b0) -
  Add new "inverse" appearance option, which can be used to make links easier to see on bolder
  backgrounds.

## 1.0.3

### Patch Changes

- [#120336](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/120336)
  [`62381baf0d2e1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/62381baf0d2e1) -
  Update 'opens new window' for anchor and link with a nicer AT announcement

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [#118234](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/118234)
  [`4eac6a5f04a14`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4eac6a5f04a14) -
  Changed styling to use Emotion instead of Compiled.

## 1.0.0

### Major Changes

- [#115948](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115948)
  [`1798755846b6d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1798755846b6d) -
  Released to open beta.

### Patch Changes

- Updated dependencies

## 0.5.3

### Patch Changes

- Updated dependencies

## 0.5.2

### Patch Changes

- [#114203](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114203)
  [`fb57afa892329`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fb57afa892329) -
  [ux] The `isUnderlined` prop has been removed and replaced with `appearance="subtle"` which
  provides a link with no underline and subtle color.
- Updated dependencies

## 0.5.1

### Patch Changes

- Updated dependencies

## 0.5.0

### Minor Changes

- [#110670](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110670)
  [`c733254a2dd6e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c733254a2dd6e) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

### Patch Changes

- Updated dependencies

## 0.4.1

### Patch Changes

- [#110867](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110867)
  [`dc7e72da70ef7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dc7e72da70ef7) -
  Migrating instances of `UNSAFE_ANCHOR` primitive imports to the new safe import `Anchor`, in
  preparation of Anchor open beta and removal of the unsafe export from `@atlaskit/primitives`

## 0.4.0

### Minor Changes

- [#109193](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109193)
  [`10fa90a1b55a0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10fa90a1b55a0) -
  Add support for React 18 in non-strict mode.

## 0.3.2

### Patch Changes

- Updated dependencies

## 0.3.1

### Patch Changes

- [#107116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107116)
  [`9a038f5d3834`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9a038f5d3834) -
  Upgrade dependency @compiled/react to latest version

## 0.3.0

### Minor Changes

- [#100782](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100782)
  [`af80293d3647`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/af80293d3647) -
  Fixes bug with types that allowed link to pass XCSS props to the underlying anchor primitive.

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#93436](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93436)
  [`80bbd923f7d4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/80bbd923f7d4) -
  Fixes a bug with main link entrypoint

## 0.1.0

### Minor Changes

- [#85745](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/85745)
  [`0e9c8c15ef86`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0e9c8c15ef86) -
  Initial link component.

### Patch Changes

- Updated dependencies
