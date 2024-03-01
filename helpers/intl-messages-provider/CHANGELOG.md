# @atlaskit/intl-messages-provider

## 1.0.3

### Patch Changes

- [#75997](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75997) [`6d14ed2a344b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6d14ed2a344b) - [ux] adding intl wrap

## 1.0.2

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147) [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) - Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 1.0.1

### Patch Changes

- [#58762](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58762) [`293ee8482ab4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/293ee8482ab4) - Fixes intl messages preferring to use messages supplied via `defaultMessages` prop instead of the messages inherited from parent provider. This is treated as a bug assuming the preferred behaviour is to use the messages from the parent provider which are more likely to be correctly translated.
