# @atlaskit/editor-plugin-connectivity

## 2.0.7

### Patch Changes

- Updated dependencies

## 2.0.6

### Patch Changes

- Updated dependencies

## 2.0.5

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- [#137691](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137691)
  [`c43af6142d901`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c43af6142d901) -
  EDITOR-567 - Revamp mocking for comments used in editor and renderer

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

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

## 1.3.0

### Minor Changes

- [#112636](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112636)
  [`086f93529b809`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/086f93529b809) -
  Add a `setMode` command so that the default mode can be overriden by products if they want to
  align the connectivity to their collaborative provider state.

## 1.2.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 1.1.4

### Patch Changes

- [#100007](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100007)
  [`df71270061d0f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/df71270061d0f) -
  updated example to enable more buttons on media floating toolbar

## 1.1.3

### Patch Changes

- Updated dependencies

## 1.1.2

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#176529](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/176529)
  [`5c207d4755be8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5c207d4755be8) -
  [ux] Disabled extensions in typeahead list when editor is in offline mode

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#168257](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168257)
  [`af1677146b18a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/af1677146b18a) -
  Create new connectivity plugin which can be used to detect the current network status.
