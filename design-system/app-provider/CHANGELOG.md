# @atlaskit/app-provider

## 1.0.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116) [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) - Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.0.0

### Major Changes

- [#69683](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69683) [`203c0f3c8b03`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/203c0f3c8b03) - Stable v1 release of app provider

## 0.4.0

### Minor Changes

- [#42305](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42305) [`4c9d4a7be34`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c9d4a7be34) - - Router link components are now required to forward refs
  - The `useRouterLink()` hook now supports generic router link configuration: `useRouterLink<YourLinkConfigObject>()`

### Patch Changes

- [#42305](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42305) [`4c9d4a7be34`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c9d4a7be34) - - Fixes a bug with router link component generic `href` prop typings where non-object types were allowed

## 0.3.1

### Patch Changes

- [#42130](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42130) [`b9b8b2c1e0a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9b8b2c1e0a) - Removed unused dev dependencies `@atlaskit/primitives` and `@atlaskit/dropdown-menu`

## 0.3.0

### Minor Changes

- [#42091](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42091) [`4ec3142822b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ec3142822b) - Add the `routerLinkComponent` prop to support router link configuration within the Design System.

## 0.2.0

### Minor Changes

- [#41931](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41931) [`5df5614a6b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5df5614a6b5) - defaultTheme now applies default sub-themes when ommited.

## 0.1.0

### Minor Changes

- [#41035](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41035) [`e7344823cff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7344823cff) - Created the AppProvider component with support for theming.

## 0.0.1

- Scaffold AppProvider component.
