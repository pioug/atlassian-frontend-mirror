# @atlaskit/atlassian-context

## 0.6.0

### Minor Changes

- [`47ed1d1af01bf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/47ed1d1af01bf) -
  Make getUrlForDomainInContext() and isolatedCloudDomain() ssr compatible

## 0.5.0

### Minor Changes

- [`e7d738f5d0004`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e7d738f5d0004) -
  Update isFedrampModerate and isIsolatedCloud functions to work with SSR

## 0.4.0

### Minor Changes

- [#192348](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/192348)
  [`7d7f464d11b3e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7d7f464d11b3e) -
  Adds new function that returns the id of the current IC if applicable

## 0.3.2

### Patch Changes

- [#190969](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190969)
  [`078bcb2c4c623`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/078bcb2c4c623) -
  Updates docs to indicate temporary incompatibility with SSR

## 0.3.1

### Patch Changes

- [#179854](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/179854)
  [`3f28c3b3a8d2d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3f28c3b3a8d2d) -
  Short-circuit in parseAtlCtxCookies on SSR to prevent log spam

## 0.3.0

### Minor Changes

- [#176643](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/176643)
  [`e72cff125ffff`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e72cff125ffff) -
  Add support for isolation cloud and fedramp-moderate awareness and url resolution.

## 0.2.0

### Minor Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

## 0.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

## 0.0.2

### Patch Changes

- [#145252](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/145252)
  [`552019a32c458`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/552019a32c458) -
  Upgrade to react 18
