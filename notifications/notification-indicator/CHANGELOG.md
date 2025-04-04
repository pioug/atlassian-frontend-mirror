# @atlaskit/notification-indicator

## 10.0.0

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

## 9.5.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 9.4.1

### Patch Changes

- Updated dependencies

## 9.4.0

### Minor Changes

- [#150749](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150749)
  [`9921483ef0acd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9921483ef0acd) -
  Add support for React 18.

## 9.3.0

### Minor Changes

- [#131276](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131276)
  [`d1e9aa7522cac`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d1e9aa7522cac) -
  Typography migration (https://product-fabric.atlassian.net/browse/PYX-881) for Notifications
  packages

## 9.2.4

### Patch Changes

- Updated dependencies

## 9.2.3

### Patch Changes

- [#93634](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93634)
  [`e0491b746c0f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e0491b746c0f) -
  Remove Confluence default notification empty state experiment code

## 9.2.2

### Patch Changes

- Updated dependencies

## 9.2.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 9.2.0

### Minor Changes

- [#71629](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71629)
  [`a726ec5c77b8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a726ec5c77b8) -
  [ux] Add prop for a Confluence experiment where we display the notification indicator with an
  empty badge if they have no notifications"

## 9.1.5

### Patch Changes

- [#40509](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40509)
  [`cd4be3557be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd4be3557be) - Enrol
  @atlaskit/notification-indicator to push-model in JFE

## 9.1.4

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162)
  [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete
  version.json

## 9.1.3

### Patch Changes

- [#38184](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38184)
  [`ddc9497fb17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ddc9497fb17) - check if
  document exists before using, for confluence SSR to work

## 9.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 9.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 9.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 9.0.4

### Patch Changes

- Updated dependencies

## 9.0.3

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 9.0.2

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492)
  [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade
  Typescript from `4.2.4` to `4.3.5`.

## 9.0.1

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650)
  [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade
  to TypeScript 4.2.4

## 9.0.0

### Major Changes

- [#17459](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17459)
  [`8be1ff8ac9b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8be1ff8ac9b) - Removed
  V3 Notifications Api feature flag. By default, V3 Notifications Api will be used.

### Patch Changes

- Updated dependencies

## 8.1.0

### Minor Changes

- [#16208](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16208)
  [`0308a114d5c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0308a114d5c) - Changing
  endpoints to use V3 Notifications API

### Patch Changes

- Updated dependencies

## 8.0.6

### Patch Changes

- Updated dependencies

## 8.0.5

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857)
  [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile
  packages using babel rather than tsc

## 8.0.4

### Patch Changes

- [#6039](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6039)
  [`952f126a12`](https://bitbucket.org/atlassian/atlassian-frontend/commits/952f126a12) - Explicit
  declaration of default entrypoint

## 8.0.3

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 8.0.2

### Patch Changes

- Updated dependencies

## 8.0.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 8.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 7.0.11

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/badge@13.1.5
  - @atlaskit/notification-log-client@4.0.10

## 7.0.10

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 7.0.9

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 7.0.8

### Patch Changes

- [patch][6410edd029](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6410edd029):

  Deprecated props, `value` and `onValueUpdated` have been removed from the Badge component. Please
  use the children prop instead.

## 7.0.7

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 7.0.6

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 7.0.5

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

  Analytics-next has been converted to Typescript. Typescript consumers will now get static type
  safety. Flow types are no longer provided. No behavioural changes.

  **Breaking changes**

  - `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
  - `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

  **Breaking changes to TypeScript annotations**

  - `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide
    props as a generic type.
  - `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide
    props as a generic type.
  - Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source
    code
  - Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match
    source code
  - Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match
    source code
  - Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
  - Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
  - Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
  - Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
  - Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
  - Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 7.0.4

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 7.0.3

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 7.0.2

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root Please see this
    [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this
    [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points)
    for further details

## 7.0.1

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props
  as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps
  of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 7.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 6.0.1

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 6.0.0

- [major][987ab01f30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/987ab01f30):

  - The appearance prop only accepts appearance types supported by the badge component, i.e.
    'primary', 'added', 'default' etc.

- Updated dependencies
  [c95557e3ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c95557e3ff):
  - @atlaskit/badge@11.0.0

## 5.1.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 5.1.0

- [minor][de0c7c3258](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de0c7c3258):

  - Enable noImplicitAny for home/notification-indicator

## 5.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 4.1.3

- Updated dependencies
  [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/notification-log-client@3.1.2
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/badge@10.0.0

## 4.1.2

- [patch][4c9a6d2187](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c9a6d2187):

  - Correcting attribute name in analytics event

## 4.1.1

- [patch][a4b0717](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4b0717):

  - Updated analytics events triggered by the notification-indicator

## 4.1.0

- [minor][9cfee26](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cfee26):

  - Add data-test-selector to various components to help open and close the Notification Drawer
    programmatically. This would support test automation

## 4.0.6

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/badge@9.2.2
  - @atlaskit/notification-log-client@3.1.1
  - @atlaskit/docs@6.0.0

## 4.0.5

- [patch] Ensure onCountUpdated is not called when the old and new count is zero
  [1d43367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d43367)

## 4.0.4

- [patch] Adding currentCount query parameter to notification log calls
  [2fe6260](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2fe6260)

## 4.0.3

- [patch] Updated dependencies
  [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/badge@9.1.1
  - @atlaskit/notification-log-client@3.0.2

## 4.0.2

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/badge@9.0.4

## 4.0.1

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/badge@9.0.3
  - @atlaskit/notification-log-client@3.0.1
  - @atlaskit/docs@5.0.2

## 4.0.0

- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/badge@9.0.0
  - @atlaskit/notification-log-client@3.0.0
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/notification-log-client@3.0.0
  - @atlaskit/badge@9.0.0
  - @atlaskit/docs@5.0.0

## 3.2.0

- [minor] Update NotificationIndicator with new features that will be used to reduce backend calls
  [803ed1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/803ed1f)
- [minor] Updated dependencies
  [803ed1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/803ed1f)

## 3.0.5

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/notification-log-client@2.0.8

## 3.0.4

- [patch] Update changelogs to remove duplicate
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/notification-log-client@2.0.7
  - @atlaskit/badge@8.0.3
  - @atlaskit/docs@4.1.1

## 3.0.3

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/docs@4.1.0
  - @atlaskit/notification-log-client@2.0.6
  - @atlaskit/badge@8.0.2

## 3.0.2

- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/badge@8.0.0
  - @atlaskit/notification-log-client@2.0.5
  - @atlaskit/docs@4.0.0

## 3.0.1

- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/badge@7.1.2
  - @atlaskit/notification-log-client@2.0.4
  - @atlaskit/docs@3.0.4

## 3.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 2.0.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 2.0.1

- [patch] notification-indicator and notification-log-client now compile into es5 compliant code for
  both es5 and es2015 packages to maintain compatibility with old toolings
  [1783e37](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1783e37)

## 2.0.0

- [major] Added notification-log-client and notification-indicator into Atlaskit. Please refer to
  docs and examples for their usages.
  [ac98216](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ac98216)
