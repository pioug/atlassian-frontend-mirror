# @atlaskit/app-provider

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
