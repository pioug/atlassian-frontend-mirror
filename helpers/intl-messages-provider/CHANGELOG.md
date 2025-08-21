# @atlaskit/intl-messages-provider

## 2.0.1

### Patch Changes

- [`bc7821de4d118`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bc7821de4d118) -
  Sorted type and interface props to improve Atlaskit docs

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

## 1.1.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

## 1.0.6

### Patch Changes

- [#143972](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/143972)
  [`8f44cd0d818f7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f44cd0d818f7) -
  Update react and react dom dependencies

## 1.0.5

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.0.4

### Patch Changes

- [#78714](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78714)
  [`454e72b7bf53`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/454e72b7bf53) -
  [ux] using the intl wrap correctly

  This changeset exists because a PR touches these packages in a way that doesn't require a release

## 1.0.3

### Patch Changes

- [#75997](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75997)
  [`6d14ed2a344b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6d14ed2a344b) -
  [ux] adding intl wrap

## 1.0.2

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147)
  [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) -
  Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 1.0.1

### Patch Changes

- [#58762](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58762)
  [`293ee8482ab4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/293ee8482ab4) -
  Fixes intl messages preferring to use messages supplied via `defaultMessages` prop instead of the
  messages inherited from parent provider. This is treated as a bug assuming the preferred behaviour
  is to use the messages from the parent provider which are more likely to be correctly translated.
