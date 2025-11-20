# @atlaskit/app-provider

## 3.2.6

### Patch Changes

- Updated dependencies

## 3.2.5

### Patch Changes

- Updated dependencies

## 3.2.4

### Patch Changes

- Updated dependencies

## 3.2.3

### Patch Changes

- Updated dependencies

## 3.2.2

### Patch Changes

- [`39e543109ec09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e543109ec09) -
  add type info to forwardRef components

## 3.2.1

### Patch Changes

- [`28e3bab9e4314`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/28e3bab9e4314) -
  Migrated old shape tokens to new tokens. No visual change.

## 3.2.0

### Minor Changes

- [`0f3043fe00379`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0f3043fe00379) -
  Adds subtree theming implementation behind feature gate. Exports `ThemeProvider` as first-class
  API.

## 3.1.0

### Minor Changes

- [`33a9e5805e0c7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/33a9e5805e0c7) -
  Adds fallback logic for requesting the colorMode from the `useColorMode()` hook. Also fixes
  `useTheme()` so that `colorMode` isn't returned when its fallback logic is used

## 3.0.0

### Major Changes

- [`97bac34e4e575`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/97bac34e4e575) -
  [ux] Refreshed typography theme enabled by default.

### Patch Changes

- Updated dependencies

## 2.3.0

### Minor Changes

- [#190373](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190373)
  [`73d6aa20aadb3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73d6aa20aadb3) -
  Default typography theme changed to modernized behind feature flag
  `platform-default-typography-refreshed`. If testing is successful the change will be available in
  a later release.

## 2.2.1

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [#157071](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/157071)
  [`a149a0b1559ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a149a0b1559ec) -
  We are testing the migration to the ADS Link component behind a feature flag. If this fix is
  successful it will be available in a later release.

## 2.1.0

### Minor Changes

- [#130763](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130763)
  [`42fdfd64b606b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/42fdfd64b606b) -
  useTheme now falls back to reading theme state from the DOM for cases where the
  AppProvider/ThemeProvider is not in use. This allows us to replace all usage of `useThemeObserver`
  with `useTheme` in other Design System packages without issue.

### Patch Changes

- Updated dependencies

## 2.0.0

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

## 1.8.1

### Patch Changes

- Updated dependencies

## 1.8.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.7.0

### Minor Changes

- [#105257](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105257)
  [`16af4057ef04e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/16af4057ef04e) -
  Fixes a race condition with setting the theme. This change is no longer behind a feature flag.

## 1.6.1

### Patch Changes

- [#103996](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103996)
  [`e97a60e120280`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e97a60e120280) -
  Update dependencies and remove unused internal exports.

## 1.6.0

### Minor Changes

- [#98648](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98648)
  [`940af9dafa883`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/940af9dafa883) -
  [ux] Default typography theme changed to modernized behind feature flag
  `platform-default-typography-modernized`. If testing is successful the change will be available in
  a later release.

## 1.5.0

### Minor Changes

- [#101755](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101755)
  [`07ee1368bd69d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/07ee1368bd69d) -
  Fixes a race condition with setting the theme. This change is behind a feature flag.

### Patch Changes

- Updated dependencies

## 1.4.3

### Patch Changes

- [#168743](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168743)
  [`90605435312ea`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/90605435312ea) -
  Remove react-router-dom from devDependencies as it is incompatible with React 18.
- Updated dependencies

## 1.4.2

### Patch Changes

- [#165531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/165531)
  [`57f451bda8919`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/57f451bda8919) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 1.3.3

### Patch Changes

- [#110702](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110702)
  [`b8c2eefeb195b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b8c2eefeb195b) -
  Router link component configurations no longer require `children`, so labels can be supplied
  through aria attributes if required

## 1.3.2

### Patch Changes

- [#89307](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89307)
  [`5e4a7780400d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4a7780400d) -
  Adding new functionality to allow easier migration of theming.

## 1.3.1

### Patch Changes

- [#94316](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/94316)
  [`35fd5ed8e1d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/35fd5ed8e1d7) -
  Upgrading internal dependency `bind-event-listener` to `@^3.0.0`

## 1.3.0

### Minor Changes

- [#88515](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/88515)
  [`ef20ec7145b7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ef20ec7145b7) -
  Add type export for `RouterLinkComponent` to enable router link configuration

## 1.2.0

### Minor Changes

- [#87603](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87603)
  [`07a08e440f76`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/07a08e440f76) -
  Add support for React 18 in non-strict mode.

## 1.1.0

### Minor Changes

- [#87244](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/87244)
  [`7d9d0320d3da`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7d9d0320d3da) -
  Add option to disable theming features with `UNSAFE_isThemingDisabled`

## 1.0.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.0.0

### Major Changes

- [#69683](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69683)
  [`203c0f3c8b03`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/203c0f3c8b03) -
  Stable v1 release of app provider

## 0.4.0

### Minor Changes

- [#42305](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42305)
  [`4c9d4a7be34`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c9d4a7be34) - - Router
  link components are now required to forward refs
  - The `useRouterLink()` hook now supports generic router link configuration:
    `useRouterLink<YourLinkConfigObject>()`

### Patch Changes

- [#42305](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42305)
  [`4c9d4a7be34`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c9d4a7be34) - - Fixes
  a bug with router link component generic `href` prop typings where non-object types were allowed

## 0.3.1

### Patch Changes

- [#42130](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42130)
  [`b9b8b2c1e0a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9b8b2c1e0a) - Removed
  unused dev dependencies `@atlaskit/primitives` and `@atlaskit/dropdown-menu`

## 0.3.0

### Minor Changes

- [#42091](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42091)
  [`4ec3142822b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ec3142822b) - Add the
  `routerLinkComponent` prop to support router link configuration within the Design System.

## 0.2.0

### Minor Changes

- [#41931](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41931)
  [`5df5614a6b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5df5614a6b5) -
  defaultTheme now applies default sub-themes when ommited.

## 0.1.0

### Minor Changes

- [#41035](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41035)
  [`e7344823cff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7344823cff) - Created
  the AppProvider component with support for theming.

## 0.0.1

- Scaffold AppProvider component.
