# @atlaskit/global-search

## 13.0.8

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 13.0.7

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 13.0.6

### Patch Changes

- Updated dependencies

## 13.0.5

### Patch Changes

- Updated dependencies

## 13.0.4

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 13.0.3

### Patch Changes

- [`d03bff2147`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d03bff2147) - updated translations

## 13.0.2

### Patch Changes

- Updated dependencies

## 13.0.1

### Patch Changes

- [`0c532edf6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c532edf6e) - Use the 'lodash' package instead of single-function 'lodash.\*' packages

## 13.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 12.3.6

### Patch Changes

- [`cc14956821`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc14956821) - Update all the theme imports to a path thats tree shakable

## 12.3.5

### Patch Changes

- [`baaad91b65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/baaad91b65) - Updated to use the latest and more performant version of `@atlaskit/avatar`
- Updated dependencies

## 12.3.4

### Patch Changes

- [patch][f45c19a96e](https://bitbucket.org/atlassian/atlassian-frontend/commits/f45c19a96e):

  Remove unused dependencies

## 12.3.3

### Patch Changes

- Updated dependencies [4c6b8024c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c6b8024c8):
- Updated dependencies [a1bc1e6637](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1bc1e6637):
- Updated dependencies [9e87af4685](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e87af4685):
- Updated dependencies [5ecbbaadb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ecbbaadb3):
- Updated dependencies [5399d36ca2](https://bitbucket.org/atlassian/atlassian-frontend/commits/5399d36ca2):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies [3b92b89113](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b92b89113):
- Updated dependencies [c1992227dc](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1992227dc):
  - @atlaskit/global-navigation@9.0.0
  - @atlaskit/navigation-next@8.0.0
  - @atlaskit/dropdown-menu@9.0.0
  - @atlaskit/flag@12.3.8
  - @atlaskit/feedback-collector@5.0.0
  - @atlaskit/icon@20.0.2
  - @atlaskit/drawer@5.3.3
  - @atlaskit/checkbox@10.1.8

## 12.3.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/analytics@7.0.1
  - @atlaskit/avatar@17.1.7
  - @atlaskit/badge@13.1.5
  - @atlaskit/button@13.3.7
  - @atlaskit/checkbox@10.1.7
  - @atlaskit/drawer@5.3.2
  - @atlaskit/dropdown-menu@8.2.4
  - @atlaskit/feedback-collector@4.0.24
  - @atlaskit/flag@12.3.7
  - @atlaskit/global-navigation@8.0.7
  - @atlaskit/icon-file-type@5.0.2
  - @atlaskit/icon-object@5.0.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/item@11.0.1
  - @atlaskit/logo@12.3.2
  - @atlaskit/modal-dialog@10.5.2
  - @atlaskit/navigation-next@7.3.7
  - @atlaskit/page@11.0.12
  - @atlaskit/theme@9.5.1
  - @atlaskit/analytics-gas-types@4.0.13
  - @atlaskit/util-service-support@5.0.1
  - @atlaskit/quick-search@7.8.5

## 12.3.1

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [91149b1e92](https://bitbucket.org/atlassian/atlassian-frontend/commits/91149b1e92):
- Updated dependencies [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/analytics@7.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/item@11.0.0
  - @atlaskit/global-navigation@8.0.6
  - @atlaskit/avatar@17.1.6
  - @atlaskit/quick-search@7.8.4
  - @atlaskit/dropdown-menu@8.2.3
  - @atlaskit/navigation-next@7.3.5
  - @atlaskit/flag@12.3.6
  - @atlaskit/logo@12.3.1
  - @atlaskit/modal-dialog@10.5.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/checkbox@10.1.6
  - @atlaskit/drawer@5.3.1
  - @atlaskit/feedback-collector@4.0.23
  - @atlaskit/page@11.0.11

## 12.3.0

### Minor Changes

- [minor][236de4c57e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/236de4c57e):

  Changing redirect to Confluence Advanced Search

## 12.2.6

- Updated dependencies [42a92cad4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42a92cad4e):
  - @atlaskit/util-service-support@5.0.0

## 12.2.5

- Updated dependencies [ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):
  - @atlaskit/i18n-tools@0.6.0
  - @atlaskit/util-service-support@4.1.0

## 12.2.4

- Updated dependencies [4778521db3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4778521db3):
  - @atlaskit/feedback-collector@4.0.19
  - @atlaskit/global-navigation@8.0.4
  - @atlaskit/navigation-next@7.0.0

## 12.2.3

- Updated dependencies [f9b5e24662](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9b5e24662):
  - @atlaskit/navigation-next@6.8.3
  - @atlaskit/icon-file-type@5.0.0
  - @atlaskit/icon-object@5.0.0
  - @atlaskit/icon@19.0.8

## 12.2.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 12.2.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 12.2.0

### Minor Changes

- [minor][bff5be0d46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bff5be0d46):

  Quick search autocomplete analytics instrumentation

## 12.1.2

- Updated dependencies [97bab7fd28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bab7fd28):
  - @atlaskit/button@13.3.1
  - @atlaskit/feedback-collector@4.0.17
  - @atlaskit/global-navigation@8.0.1
  - @atlaskit/modal-dialog@10.3.1
  - @atlaskit/checkbox@10.0.0
  - @atlaskit/docs@8.1.7

## 12.1.1

### Patch Changes

- [patch][9447579b2e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9447579b2e):

  Fixed withFeedbackButton warning message

## 12.1.0

### Minor Changes

- [minor][7289e02eaa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7289e02eaa):

  Adds a new boolean parameter to show the new people profile url

## 12.0.3

### Patch Changes

- [patch][14e5462b37](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/14e5462b37):

  remove use of deprecated field text area component

## 12.0.2

### Patch Changes

- [patch][6aa50ae773](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6aa50ae773):

  remove use of deprecated FieldBase component in quick search

## 12.0.1

- Updated dependencies [f0305e1b06](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0305e1b06):
  - @atlaskit/feedback-collector@4.0.14
  - @atlaskit/navigation-next@6.6.3
  - @atlaskit/global-navigation@8.0.0

## 12.0.0

### Major Changes

- [major][d20d909c2e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d20d909c2e):

  required user id so that the recents api is not called for anonymous users

## 11.4.4

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/drawer@5.0.10
  - @atlaskit/dropdown-menu@8.1.1
  - @atlaskit/global-navigation@7.7.1
  - @atlaskit/item@10.1.5
  - @atlaskit/modal-dialog@10.2.1
  - @atlaskit/navigation-next@6.6.2
  - @atlaskit/quick-search@7.7.1
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 11.4.3

- Updated dependencies [6410edd029](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6410edd029):
  - @atlaskit/badge@13.0.0
  - @atlaskit/global-navigation@7.6.5
  - @atlaskit/navigation-next@6.6.1

## 11.4.2

### Patch Changes

- [patch][a05133283c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a05133283c):

  Add missing dependency in package.json

## 11.4.1

### Patch Changes

- [patch][4638a2e06a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4638a2e06a):

  Fixed QuickSearchContainer so it doesn't end up with a new session id on update if not a child of SearchSessionProvider

## 11.4.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 11.3.4

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 11.3.3

### Patch Changes

- [patch][0d7d459f1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7d459f1a):

  Fixes type errors which were incompatible with TS 3.6

## 11.3.2

### Patch Changes

- [patch][c0a65fcf70](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0a65fcf70):

  Create spaceballs experiment

## 11.3.1

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 11.3.0

### Minor Changes

- [minor][2ebd907504](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2ebd907504):

  Simple experiment with faster search is now default behaviour and can no longer be toggled

## 11.2.5

### Patch Changes

- [patch][abee1a5f4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abee1a5f4f):

  Bumping internal dependency (memoize-one) to latest version (5.1.0). memoize-one@5.1.0 has full typescript support so it is recommended that typescript consumers use it also.

## 11.2.4

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

  Analytics-next has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No behavioural changes.

  **Breaking changes**

  - `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
  - `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

  **Breaking changes to TypeScript annotations**

  - `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source code
  - Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match source code
  - Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match source code
  - Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
  - Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
  - Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
  - Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
  - Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
  - Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 11.2.3

### Patch Changes

- [patch][b1082f1172](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1082f1172):

  include issue key matches in faster search results

## 11.2.2

### Patch Changes

- [patch][b49435cead](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b49435cead):

  Fix minor bug with faster search analytics

## 11.2.1

### Patch Changes

- [patch][f96e55e2ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f96e55e2ec):

  show project name for jira board results

## 11.2.0

### Minor Changes

- [minor][f0887d7b06](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0887d7b06):

  Faster search now works for Jira

## 11.1.2

### Patch Changes

- [patch][705280759d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/705280759d):

  Support pre-fetching in Jira

## 11.1.1

### Patch Changes

- [patch][a047bbaff3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a047bbaff3):

  Fixed a minor bug with Jira prefetching

## 11.1.0

### Minor Changes

- [minor][f874437a5c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f874437a5c):

  Remove feature flag to get jira recent items from the aggregator

## 11.0.2

### Patch Changes

- [patch][3aae2cb8c7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3aae2cb8c7):

  Move @types/seedrandom from dependencies to devDependencies.

## 11.0.1

### Patch Changes

- [patch][a601885d40](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a601885d40):

  Bump global-search to fix an issue with current master branch getting out of sync between bitbucket and npm.

## 11.0.0

### Major Changes

- [major][5ea608f95d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ea608f95d):

  Enables faster search by default. Modified date is now part of simple extensions

## 10.7.0

### Minor Changes

- [minor][339c4517c0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/339c4517c0):

  Front end support for xpsearch-nav-searcher

## 10.6.8

### Patch Changes

- [patch][3c4273bb14](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c4273bb14):

  minor fix to analytics event

## 10.6.7

### Patch Changes

- [patch][4b11eb641c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b11eb641c):

  fix bugs with error state

## 10.6.6

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 10.6.5

### Patch Changes

- [patch][c9fb04b37b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c9fb04b37b):

  Reduced the number of results we get from simple experiments

## 10.6.4

### Patch Changes

- [patch][87510283c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87510283c3):

  Include new analytics event when the space filter is shown

## 10.6.3

### Patch Changes

- [patch][8123915fe4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8123915fe4):

  Added back analytic information to request for quick search

## 10.6.2

- Updated dependencies [75c64ee36a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75c64ee36a):
  - @atlaskit/quick-search@7.6.6
  - @atlaskit/drawer@5.0.0

## 10.6.1

### Patch Changes

- [patch][8fcbe23ec6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fcbe23ec6):

  Updated types for analytics-next and buttons to make them easier to consume

## 10.6.0

### Minor Changes

- [minor][38eb4d4da6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38eb4d4da6):

  Made quick search more robust against malformed Confluence responses

## 10.5.1

### Patch Changes

- [patch][d3374c9f71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3374c9f71):

  updated quick search translation string

## 10.5.0

### Minor Changes

- [minor][dd3a518fe9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd3a518fe9):

  Send filtered spaces to advanced search

## 10.4.2

### Patch Changes

- [patch][78c4a2b655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/78c4a2b655):

  Fixed a minor dep import so its compatible with all recent versions of atlaskit/avatar

## 10.4.1

### Patch Changes

- [patch][dd9ca0710e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd9ca0710e):

  Removed incorrect jsnext:main field from package.json

## 10.4.0

### Minor Changes

- [minor][96ff4ffc6d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/96ff4ffc6d):

  Fixed space filter showing on intermediate pre query screen

## 10.3.4

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 10.3.3

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 10.3.2

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 10.3.1

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 10.3.0

### Minor Changes

- [minor][0598e7ce48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0598e7ce48):

  Feedback collector with search bug fix

## 10.2.4

### Patch Changes

- [patch][5427f7028a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5427f7028a):

  Fixing problem with subtext colours not matching between pages and people in the Quick Search complex experiment.

## 10.2.3

### Patch Changes

- [patch][554c44e342](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/554c44e342):

  fix incorrect message id for i18n string

## 10.2.2

### Patch Changes

- [patch][e80b86a298](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e80b86a298):

  Adding last modified date to the simple extensions to Quick Search

## 10.2.1

### Patch Changes

- [patch][8f711664af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f711664af):

  Added analytics for current space filter component

## 10.2.0

### Minor Changes

- [minor][8d013cf28c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d013cf28c):

  added more filters button next to confluence current space filter

## 10.1.1

- Updated dependencies [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/button@13.0.10
  - @atlaskit/feedback-collector@4.0.8
  - @atlaskit/modal-dialog@10.0.8
  - @atlaskit/navigation@35.1.9
  - @atlaskit/checkbox@9.0.0

## 10.1.0

### Minor Changes

- [minor][c11db2f5dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c11db2f5dc):

  Modified caching behaviour for Confluence search so that it now has a 15 minute timeout

## 10.0.1

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/button@13.0.9
  - @atlaskit/checkbox@8.0.5
  - @atlaskit/drawer@4.2.1
  - @atlaskit/dropdown-menu@8.0.8
  - @atlaskit/feedback-collector@4.0.7
  - @atlaskit/flag@12.0.10
  - @atlaskit/modal-dialog@10.0.7
  - @atlaskit/navigation@35.1.8
  - @atlaskit/quick-search@7.5.1
  - @atlaskit/icon@19.0.0

## 10.0.0

### Major Changes

- [major][1e1fd28bb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e1fd28bb3):

  Exposed new API for consumers of global search to better control the lifecycle of the search session id

## 9.2.0

### Minor Changes

- [minor][e6f5e7a694](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6f5e7a694):

  added current space filter for confluence

## 9.1.1

### Patch Changes

- [patch][af96d6cbb8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af96d6cbb8):

  Removed generic result map and replaced with jira result map

## 9.1.0

### Minor Changes

- [minor][a0ae6daeb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0ae6daeb6):

  Removed urijs dependency

## 9.0.0

### Major Changes

- [major][e84f336455](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e84f336455):

  Removed support for Atlassian Home, it is no longer a valid context or product

## 8.16.0

### Minor Changes

- [minor][cb424f9560](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cb424f9560):

  - global-search is integrated with autocomplete service

## 8.15.8

### Patch Changes

- [patch][465b8bae74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/465b8bae74):

  Jira results now have project name rather than issue type

## 8.15.7

### Patch Changes

- [patch][e7db01700d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7db01700d):

  Updating empty state screen for Jira global-search

## 8.15.6

### Patch Changes

- [patch][bf44848631](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bf44848631):

  fix analytics typo

## 8.15.5

### Patch Changes

- [patch][2a32f09bc6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a32f09bc6):

  add analytics to show more button

## 8.15.4

### Patch Changes

- [patch][9aa576a05d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9aa576a05d):

  added show more button and the ability to extend search results

## 8.15.3

### Patch Changes

- [patch][da0ae1c7ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da0ae1c7ca):

  Do not pre-fetch users, only confluence content

## 8.15.2

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/button@13.0.8
  - @atlaskit/drawer@4.1.3
  - @atlaskit/dropdown-menu@8.0.4
  - @atlaskit/feedback-collector@4.0.5
  - @atlaskit/flag@12.0.4
  - @atlaskit/modal-dialog@10.0.4
  - @atlaskit/navigation@35.1.5
  - @atlaskit/quick-search@7.4.1
  - @atlaskit/icon@18.0.0

## 8.15.1

### Patch Changes

- [patch][76c559f29e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76c559f29e):

  fix keyboard nav for confluence

## 8.15.0

### Minor Changes

- [minor][1dc1136437](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1dc1136437):

  Include experiment data in feedback collector info

## 8.14.0

### Minor Changes

- [minor][4499ffab87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4499ffab87):

  Added support for showing a lozenge next to the search result groups

## 8.13.2

### Patch Changes

- [patch][265fc0afdd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/265fc0afdd):

  fix view all issues link

## 8.13.1

### Patch Changes

- [patch][772a871c39](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/772a871c39):

  fix all issues link

## 8.13.0

### Minor Changes

- [minor][ad12f5342d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ad12f5342d):

  Internal refactor

## 8.12.0

### Minor Changes

- [minor][1451fc1901](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1451fc1901):

  Lots of internal factoring. No changes to external API yet.

## 8.11.1

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 8.11.0

- [patch][7c572538d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c572538d3):

  Always attach searchSessionId in post query

- [minor][f5ffb0a08a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f5ffb0a08a):

  - Fix prefetching logic in global search and improved faster search experience

- [patch][92381960e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92381960e9):

  - Updated types to support modal-dialog typescript conversion

- Updated dependencies [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
  - @atlaskit/feedback-collector@4.0.3
  - @atlaskit/icon@17.1.2
  - @atlaskit/icon-file-type@4.0.1
  - @atlaskit/icon-object@4.0.1
  - @atlaskit/modal-dialog@10.0.0

## 8.10.2

- [patch][4b4ee6dc9f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b4ee6dc9f):

  - Fix containerId, renaming it to searchContainerId

## 8.10.1

- Updated dependencies [3af5a7e685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3af5a7e685):
  - @atlaskit/navigation@35.1.3
  - @atlaskit/page@11.0.0

## 8.10.0

- [minor][eb4f4fadff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb4f4fadff):

  - Support new ModelContext API

## 8.9.0

- [minor][2e2e0cf0c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e2e0cf0c4):

  - Actually made URS work

## 8.8.4

- [patch][24dce138ce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24dce138ce):

  - fix prequery limit with grape

## 8.8.3

- Updated dependencies [238b65171f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/238b65171f):
  - @atlaskit/feedback-collector@4.0.2
  - @atlaskit/flag@12.0.0

## 8.8.2

- [patch][409dbf30b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/409dbf30b4):

  - add support for grape in jira

## 8.8.1

- [patch][26501fa352](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/26501fa352):

  - Fix typo in URS scopes

## 8.8.0

- [minor][ef46265bcf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef46265bcf):

  - Added support to make bootstrapping calls through URS instead of directory

## 8.7.0

- [minor][a0940ca7ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0940ca7ca):

  - Remove jira session id feature flags & fix bug where session ids are not attached to pre-fetched results

## 8.6.2

- Updated dependencies [4b07b57640](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b07b57640):
  - @atlaskit/button@13.0.2
  - @atlaskit/feedback-collector@4.0.1
  - @atlaskit/icon@17.0.2
  - @atlaskit/navigation@35.1.1
  - @atlaskit/page@10.0.2
  - @atlaskit/logo@12.0.0

## 8.6.1

- [patch][71f75b2699](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/71f75b2699):

  - Fixed bug with recent item duplication on search

## 8.6.0

- [minor][1bcb87f888](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcb87f888):

  - Removing old feature flags from global search

## 8.5.0

- [minor][7b604091c7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7b604091c7):

  - Added support for project affinity for jira in global search

## 8.4.0

- [minor][438313ec7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/438313ec7a):

  - Improved performance with a number of small changes to reduce re-rendering

## 8.3.1

- [patch][40c934a6dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40c934a6dd):

  - added faster search analytics

## 8.3.0

- [minor][4d5fb33572](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d5fb33572):

  - Jira new design for advanced search

## 8.2.3

- [patch][1e01ef79e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e01ef79e2):

  - Put queryVersion into the request for searches

## 8.2.2

- [patch][ebc992e51d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebc992e51d):

  - Adds referral context identifiers to more analytics events.

## 8.2.1

- [patch][4051c8b935](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4051c8b935):

  - Add support for experiments to change the number of search results shown

## 8.2.0

- [minor][a8a4ab0c5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a8a4ab0c5b):

  - Added support for faster search by pre-loading some search results from Confluence's recently view pages

## 8.1.0

- [minor][5a49043dac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5a49043dac):

  - Enable strictPropertyInitialization in tsconfig.base

## 8.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 7.0.5

- [patch][d3cad2622e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3cad2622e):

  - Removes babel-runtime in favour of @babel/runtime

## 7.0.4

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 7.0.3

- [patch][3f48f041b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f48f041b0):

  - Fix bug where pre-fetching is attempted even if the cloud id isn't present

## 7.0.2

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/button@12.0.3
  - @atlaskit/drawer@3.0.7
  - @atlaskit/dropdown-menu@7.0.6
  - @atlaskit/feedback-collector@3.0.5
  - @atlaskit/field-text-area@5.0.4
  - @atlaskit/flag@10.0.6
  - @atlaskit/icon@16.0.9
  - @atlaskit/icon-file-type@3.0.8
  - @atlaskit/icon-object@3.0.8
  - @atlaskit/logo@10.0.4
  - @atlaskit/modal-dialog@8.0.7
  - @atlaskit/navigation@34.0.4
  - @atlaskit/quick-search@6.1.1
  - @atlaskit/theme@8.1.7

## 7.0.1

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 7.0.0

- [major][3b02028b52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b02028b52):

  - New feedback component for @atlaskit/global-search - breaking feedback component API change

## 6.2.6

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/avatar@15.0.3
  - @atlaskit/drawer@3.0.6
  - @atlaskit/dropdown-menu@7.0.4
  - @atlaskit/field-text-area@5.0.3
  - @atlaskit/flag@10.0.5
  - @atlaskit/icon@16.0.8
  - @atlaskit/icon-file-type@3.0.7
  - @atlaskit/icon-object@3.0.7
  - @atlaskit/logo@10.0.3
  - @atlaskit/modal-dialog@8.0.6
  - @atlaskit/navigation@34.0.3
  - @atlaskit/page@9.0.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 6.2.5

- [patch][8a95ba85f2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a95ba85f2):

  - remove boards from jira advanced search options if instance does not have software

## 6.2.4

- [patch][f86b087b7c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f86b087b7c):

  - Adding container ID to analytics to relevant analytics, including referral context params

## 6.2.3

- [patch][47bb7e05e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/47bb7e05e4):

  - Add new API to allow pre-fetching of global search pre-query results before the component is opened

## 6.2.2

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 6.2.1

- [patch][203d4c22bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/203d4c22bd):

  - Fix Confluence dead end screen by fixing text and removing People search button

## 6.2.0

- [minor][347d237b8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/347d237b8e):

  - Enable noImplicitAny for @atlaskit/global-search

## 6.1.1

- [patch][befe3607e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/befe3607e3):

  - Attach experimentId to searchResults shown metric

## 6.1.0

- [minor][3d5e64b87b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d5e64b87b):

  - retrieve prequery results from Xpsearch

## 6.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 6.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 5.16.4

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/icon-file-type@3.0.4
  - @atlaskit/icon-object@3.0.4
  - @atlaskit/analytics-gas-types@3.2.5
  - @atlaskit/util-service-support@3.1.1
  - @atlaskit/quick-search@5.4.1
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/analytics@5.0.0
  - @atlaskit/avatar@15.0.0
  - @atlaskit/drawer@3.0.0
  - @atlaskit/dropdown-menu@7.0.0
  - @atlaskit/field-text-area@5.0.0
  - @atlaskit/flag@10.0.0
  - @atlaskit/logo@10.0.0
  - @atlaskit/modal-dialog@8.0.0
  - @atlaskit/navigation@34.0.0
  - @atlaskit/page@9.0.0
  - @atlaskit/theme@8.0.0

## 5.16.3

- [patch][ea6c801333](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea6c801333):

  - added searchSessionId to advanced search handler

## 5.16.2

- [patch][83e94783d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83e94783d0):

  - fix onclick to advanced search

## 5.16.1

- [patch][707e08ecf8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/707e08ecf8):

  - fix typo in api name

## 5.16.0

- [minor][7be03e992f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7be03e992f):

  - Add support to register callback for category selection change on advanced search

## 5.15.4

- [patch][b3e90635b8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3e90635b8):

  - fix global search keyboard nav

## 5.15.3

- [patch][13fb3ea95c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/13fb3ea95c):

  - add rendering time to analytics

## 5.15.2

- [patch][cfb2fa498f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfb2fa498f):

  - Add measurements for experiment api latency

## 5.15.1

- [patch][b21df8f941](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b21df8f941):

  - Support new experiment api

## 5.15.0

- [minor][a6a76aa7cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6a76aa7cd):

  - Adds ability to send search terms for jira quick search

## 5.14.1

- [patch][f9e27f2b99](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9e27f2b99):

  - Modified CPUS response objects to match API correctly

## 5.14.0

- [minor][df2b5b7235](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df2b5b7235):

  - Disable people search on the pre-query screen temporarily for performance reasons.

## 5.13.7

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/avatar@14.1.8
  - @atlaskit/button@10.1.2
  - @atlaskit/drawer@2.7.1
  - @atlaskit/dropdown-menu@6.1.26
  - @atlaskit/flag@9.1.9
  - @atlaskit/modal-dialog@7.2.1
  - @atlaskit/navigation@33.3.9
  - @atlaskit/quick-search@5.2.5
  - @atlaskit/icon@16.0.0

## 5.13.6

- [patch][d6bd32b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6bd32b):

  - Updated global-search translations

## 5.13.5

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics@4.0.7
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/avatar@14.1.7
  - @atlaskit/button@10.1.1
  - @atlaskit/drawer@2.6.1
  - @atlaskit/dropdown-menu@6.1.25
  - @atlaskit/field-text-area@4.0.14
  - @atlaskit/flag@9.1.8
  - @atlaskit/icon@15.0.2
  - @atlaskit/icon-file-type@3.0.2
  - @atlaskit/icon-object@3.0.2
  - @atlaskit/logo@9.2.6
  - @atlaskit/modal-dialog@7.1.1
  - @atlaskit/navigation@33.3.8
  - @atlaskit/page@8.0.12
  - @atlaskit/theme@7.0.1
  - @atlaskit/analytics-gas-types@3.2.3
  - @atlaskit/util-service-support@3.0.5
  - @atlaskit/quick-search@5.2.4
  - @atlaskit/docs@6.0.0

## 5.13.4

- [patch][e6d6651](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6d6651):

  - fix jira recent results ordering; filters should be after projects

## 5.13.3

- [patch][d498de7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d498de7):

  - Include type of result for boards and filters in jira search

- [patch][c6131a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6131a6):

  - Added result type for boards and filters in global search result subtext

## 5.13.2

- [patch][38debc1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38debc1):

  - trigger analytics on advanced search dropdown item clicked, disable jira people search

## 5.13.1

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/drawer@2.5.4
  - @atlaskit/dropdown-menu@6.1.24
  - @atlaskit/field-text-area@4.0.13
  - @atlaskit/flag@9.1.7
  - @atlaskit/icon@15.0.1
  - @atlaskit/icon-file-type@3.0.1
  - @atlaskit/icon-object@3.0.1
  - @atlaskit/logo@9.2.5
  - @atlaskit/modal-dialog@7.0.14
  - @atlaskit/navigation@33.3.7
  - @atlaskit/quick-search@5.2.1
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6

## 5.13.0

- [minor][347a474](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/347a474):

  - Added icon on selected to quick search results

## 5.12.12

- [patch][f84ab96](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f84ab96):

  - Add extra padding to the before pre-query advanced search component.

## 5.12.11

- [patch][f0bfc56](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0bfc56):

  - Change adv search shortcut icon to Return instead of ShiftReturn for both Confluence and Jira

## 5.12.10

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/avatar@14.1.5
  - @atlaskit/button@10.0.1
  - @atlaskit/dropdown-menu@6.1.23
  - @atlaskit/flag@9.1.6
  - @atlaskit/modal-dialog@7.0.13
  - @atlaskit/navigation@33.3.6
  - @atlaskit/quick-search@5.1.2
  - @atlaskit/icon-file-type@3.0.0
  - @atlaskit/icon-object@3.0.0
  - @atlaskit/icon@15.0.0

## 5.12.9

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/avatar@14.1.4
  - @atlaskit/drawer@2.5.2
  - @atlaskit/dropdown-menu@6.1.22
  - @atlaskit/field-text-area@4.0.12
  - @atlaskit/flag@9.1.5
  - @atlaskit/icon@14.6.1
  - @atlaskit/icon-file-type@2.0.1
  - @atlaskit/icon-object@2.0.1
  - @atlaskit/logo@9.2.4
  - @atlaskit/modal-dialog@7.0.12
  - @atlaskit/navigation@33.3.5
  - @atlaskit/page@8.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 5.12.8

- [patch][124cdc1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/124cdc1):

  - fix keyboard navigation

## 5.12.7

- [patch][225c0aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/225c0aa):

  - Auto-highlight of exact issue matches is case-sensitive

## 5.12.6

- [patch][9c3e374](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c3e374):

  - Update the order of advanced search links and container headings

## 5.12.5

- [patch][82842ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/82842ad):

  - Hide the 'shift+enter' on jira quick search pre-query screen

## 5.12.4

- [patch][a1e1821](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1e1821):

  - Title case for "Software project", "Service Desk project", "Ops project"

## 5.12.3

- [patch][6c50eb1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c50eb1):

  - Pre-highlight exact matches of Jira issues and remove the split button

## 5.12.2

- Updated dependencies [80304f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80304f0):
  - @atlaskit/icon@14.4.0
  - @atlaskit/icon-file-type@2.0.0
  - @atlaskit/icon-object@2.0.0

## 5.12.1

- [patch][e93ffe0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e93ffe0):

  - Change container result item to accept a react node as the subtext

## 5.12.0

- [minor][6506916](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6506916):

  - Refactor how i18n is handled internally

## 5.11.3

- Updated dependencies [2da04ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2da04ed):
  - @atlaskit/navigation@33.3.1
  - @atlaskit/quick-search@5.0.0

## 5.11.2

- [patch] Fix duplicate keyboard selection for results [d0674c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0674c1)

## 5.11.1

- [patch] Filter out unsupported groups from jira recent items resource [f429535](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f429535)

## 5.11.0

- [minor] Adds a check for the Jira version of global search to ensure the user has browse user permission before showing people results. [ce58d96](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce58d96)

## 5.10.4

- [patch] Change dependency on all icon package to be caret [9961f6d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9961f6d)
- [patch] Updated dependencies [e7bb74d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7bb74d)
  - @atlaskit/icon-file-type@1.0.4
  - @atlaskit/icon-object@1.0.4
  - @atlaskit/icon@14.0.3

## 5.10.3

- [patch] Fix navigation issues when clicking the advanced search button in JIra [3b321ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b321ab)

## 5.10.2

- [patch] Updated dependencies [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)
  - @atlaskit/analytics-next@3.0.10
  - @atlaskit/analytics@4.0.6
  - @atlaskit/avatar@14.1.2
  - @atlaskit/button@9.0.15
  - @atlaskit/dropdown-menu@6.1.19
  - @atlaskit/field-text-area@4.0.10
  - @atlaskit/flag@9.1.1
  - @atlaskit/icon-file-type@1.0.3
  - @atlaskit/icon-object@1.0.3
  - @atlaskit/icon@14.0.2
  - @atlaskit/logo@9.2.3
  - @atlaskit/modal-dialog@7.0.3
  - @atlaskit/navigation@33.2.1
  - @atlaskit/page@8.0.8
  - @atlaskit/theme@6.1.1

## 5.10.1

- [patch] remove hyphen from qs and convert values to camel case [ec5a8c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec5a8c3)

## 5.10.0

- [minor] Add link to advanced issue search at the top of the jira pre query screen. [f0f66b7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0f66b7)

## 5.9.9

- [patch] Adds small amount of padding between the Jira advanced search footer and the result list [5e8fe66](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e8fe66)

## 5.9.8

- [patch] add session id, object id, container id and content type as query params to jira results [e4c4eff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e4c4eff)

## 5.9.7

- [patch] remove extra comma in no results screen [ceb1fbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceb1fbb)

## 5.9.6

- [patch] Update icon-file-type [a3b51ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3b51ef)
- [patch] Updated dependencies [272208b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/272208b)
  - @atlaskit/icon-file-type@1.0.2
  - @atlaskit/icon-object@1.0.2

## 5.9.5

- [patch] fix higlight problem due to duplicate react keys [beeba8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/beeba8a)

## 5.9.4

- [patch] icon-file-type and icon-object publish glyphs, svgs, and es5 instead of just dist [0823d35](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0823d35)

## 5.9.3

- [patch] Exposure event gets trigger on initial load instead when search results return [b89cda9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b89cda9)

## 5.9.2

- [patch] Trim search input [488257d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/488257d)

## 5.9.1

- [patch] Updated dependencies [709b239](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/709b239)
- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/icon@14.0.0
  - @atlaskit/icon-file-type@1.0.0
  - @atlaskit/icon-object@1.0.0
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/button@9.0.13
  - @atlaskit/dropdown-menu@6.1.17
  - @atlaskit/flag@9.0.11
  - @atlaskit/modal-dialog@7.0.2
  - @atlaskit/navigation@33.1.11
  - @atlaskit/quick-search@4.2.9

## 5.9.0

- [minor] Feature to use quicknav for people search [9f1d252](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f1d252)

## 5.8.4

- [patch] fix jira quick search analytics [1e8a048](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e8a048)

## 5.8.3

- [patch] Add logger to global quick search [aeb0219](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aeb0219)

## 5.8.2

- [patch] Parse Jira recent response with optional attributes [f6f81ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6f81ca)

## 5.8.1

- [patch] Add support for Jira default icons for boards, filters and issues [deb791d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/deb791d)

## 5.8.0

- [minor] Use CPUS for people search [7cb2b57](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cb2b57)

## 5.7.6

- [patch] ED-5150 Editor i18n: Main toolbar [ef76f1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef76f1f)

## 5.7.5

- [patch] pass search session id and referrer id to backend [e7d5a30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7d5a30)

## 5.7.4

- [patch] dynamic import Modal dialog based on the product [4367651](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4367651)

## 5.7.3

- [patch] remove ak modal dialog dependency [e66a9d9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e66a9d9)

## 5.7.2

- [patch] fix jira response parser [1502daa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1502daa)

## 5.7.1

- [patch] remove forward slash that breaks jira requests [08d26e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08d26e0)

## 5.7.0

- [minor] alpha jira quick search [090b5f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/090b5f7)

## 5.6.0

- [minor] Update product icons to come from logo [7b446f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7b446f0)

## 5.5.12

- [patch] add more analytics attribute (abTest related attributes, query attributes to search result analytics) [317bc68](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/317bc68)

## 5.5.11

- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)

## 5.5.10

- [patch] Updated dependencies [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/icon@13.8.1
  - @atlaskit/flag@9.0.10
  - @atlaskit/modal-dialog@7.0.0

## 5.5.9

- [patch] Add experiment exposure event to track which search sessions should be attributed to what search experiment [dfe8371](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dfe8371)

## 5.5.8

- [patch] Ensure SPA transitions are happening for Confluence pages. [0909b85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0909b85)

## 5.5.7

- [patch] Fixes import in relative import in global search. [0147e49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0147e49)

## 5.5.6

- [patch] Update response handlers for People search [f2992c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f2992c6)

## 5.5.5

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/quick-search@4.2.7
  - @atlaskit/navigation@33.1.5
  - @atlaskit/modal-dialog@6.0.9
  - @atlaskit/icon@13.2.5
  - @atlaskit/flag@9.0.5
  - @atlaskit/field-text-area@4.0.6
  - @atlaskit/button@9.0.6
  - @atlaskit/avatar@14.0.8
  - @atlaskit/docs@5.0.6

## 5.5.4

- [patch] Use UserSearch instead of AccountCentricUserSearch for People searches. [5731f20](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5731f20)

## 5.5.3

- [patch] refactor QuickSearchContainer and extract generic component [25bd0e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25bd0e2)

## 5.5.2

- [patch] Adds experiment attribution [742b49d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/742b49d)

## 5.5.1

- [patch] Fixes duplicate screen event firing on mount [517283a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/517283a)

## 5.5.0

- [minor] Refactor and analytics fixes, adds support for aggregator [459c7fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/459c7fe)

## 5.4.3

- [patch] fix pre and post query screen events [5976aef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5976aef)

## 5.4.2

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/quick-search@4.2.6
  - @atlaskit/navigation@33.1.3
  - @atlaskit/page@8.0.3
  - @atlaskit/modal-dialog@6.0.6
  - @atlaskit/field-text-area@4.0.4
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/flag@9.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/analytics@4.0.4
  - @atlaskit/icon@13.2.4
  - @atlaskit/avatar@14.0.6

## 5.4.1

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/navigation@33.1.2
  - @atlaskit/quick-search@4.2.4
  - @atlaskit/page@8.0.2
  - @atlaskit/flag@9.0.3
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/field-text-area@4.0.3
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/util-service-support@3.0.1
  - @atlaskit/analytics-gas-types@3.1.2
  - @atlaskit/analytics@4.0.3
  - @atlaskit/avatar@14.0.5
  - @atlaskit/modal-dialog@6.0.5

## 5.4.0

- [minor] Internal refactoring of result components. [28ac980](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28ac980)

## 5.3.7

- [patch] add missing attributes to analytics [2a0346a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a0346a)
- [patch] Updated dependencies [2a0346a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a0346a)
  - @atlaskit/quick-search@4.2.3

## 5.3.6

- [patch] fix keyboard navigation [2dbff95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2dbff95)
- [patch] Updated dependencies [2dbff95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2dbff95)
  - @atlaskit/quick-search@4.2.2

## 5.3.5

- [patch] Fix disappearing query problem when typing slowly [fc654d7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc654d7)

## 5.3.4

- [patch] Fix flashing no results screen when typing. [d02e61a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02e61a)

## 5.3.3

- [patch] Updated dependencies [9fbaafd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9fbaafd)
  - @atlaskit/quick-search@4.2.1

## 5.3.2

- [patch] minor refactor for passing screen counters [b5fc99c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5fc99c)

## 5.3.1

- [patch] fix keyboard navigation [5382e88](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5382e88)

## 5.3.0

- [minor] Add i18n support for all supported languages. [68982c0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/68982c0)

## 5.2.0

- [minor] Rewrite internal keyboard handling implementation. [0ebfc9a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ebfc9a)
- [minor] Updated dependencies [0ebfc9a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ebfc9a)
  - @atlaskit/quick-search@4.2.0

## 5.1.1

- [patch] fix infinite loop bug [e2e53e0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e2e53e0)

## 5.1.0

- [minor] Allow sending of search queries in analytics events [e5f14e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e5f14e9)
- [minor] Global search component now accepts a boolean to send search terms in analytics events [3b871bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b871bb)
- [minor] Updated dependencies [e5f14e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e5f14e9)
  - @atlaskit/analytics-gas-types@3.1.0

## 5.0.4

- [patch] Passes the keyboard event from quick search to the submit event handler to ensure global search redirects with the complete search query. [2d6668f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d6668f)
- [none] Updated dependencies [2d6668f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d6668f)
  - @atlaskit/quick-search@4.1.0

## 5.0.3

- [patch] fix analytics bugs [30be100](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30be100)

## 5.0.2

- [patch] Wording update [43ebe0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/43ebe0e)

## 5.0.1

- [patch] Add extra analytics event for highlight and selection of a search result [12e79bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12e79bf)
- [patch] Updated dependencies [12e79bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12e79bf)
  - @atlaskit/quick-search@4.0.1

## 5.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/quick-search@4.0.0
  - @atlaskit/field-text-area@4.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/page@8.0.0
  - @atlaskit/flag@9.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/util-service-support@3.0.0
  - @atlaskit/analytics-gas-types@3.0.0
  - @atlaskit/analytics@4.0.0
  - @atlaskit/navigation@33.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/quick-search@4.0.0
  - @atlaskit/navigation@33.0.0
  - @atlaskit/page@8.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/field-text-area@4.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/flag@9.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/util-service-support@3.0.0
  - @atlaskit/analytics-gas-types@3.0.0
  - @atlaskit/analytics@4.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar@14.0.0

## 4.7.0

- [minor] Add support for i18n. No translations available yet. [bf66767](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bf66767)

## 4.6.3

- [patch] Move tests under src and club unit, integration, visual regression [39c427d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/39c427d)
- [none] Updated dependencies [39c427d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/39c427d)
  - @atlaskit/quick-search@3.0.2

## 4.6.2

- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/button@8.2.5
  - @atlaskit/quick-search@3.0.1
  - @atlaskit/navigation@32.3.3
  - @atlaskit/modal-dialog@5.2.8
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/quick-search@3.0.1
  - @atlaskit/button@8.2.5
  - @atlaskit/navigation@32.3.3
  - @atlaskit/modal-dialog@5.2.8

## 4.6.1

- [patch] Add dismissed event and fix screen events. [c65736e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c65736e)

## 4.6.0

- [minor] Support sticky header and footer [8b8ace1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b8ace1)
- [minor] Updated dependencies [8bf8e51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8bf8e51)
  - @atlaskit/quick-search@3.0.0
  - @atlaskit/navigation@32.3.2
- [none] Updated dependencies [8b8ace1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b8ace1)
  - @atlaskit/quick-search@3.0.0
  - @atlaskit/navigation@32.3.2

## 4.5.12

- [patch] fixing XPSRCH-915 search results should not disapear between searches [0683d75](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0683d75)

## 4.5.11

- [patch] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0
  - @atlaskit/quick-search@2.3.4
  - @atlaskit/navigation@32.3.1
  - @atlaskit/modal-dialog@5.2.7

## 4.5.10

- [patch] add empty state for no recent activities in global search [2ecbd39](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2ecbd39)

## 4.5.9

- [patch] Replace faker with lightweight internal functions [1c3352a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c3352a)
- [none] Updated dependencies [1c3352a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c3352a)
  - @atlaskit/quick-search@2.3.3

## 4.5.8

- [patch] fixed icon glyph imports after changes in icon package [abf2e65](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abf2e65)

## 4.5.7

- [patch] Decreasing padding on items and fix analytics.' [0f73740](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f73740)
- [none] Updated dependencies [0f73740](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f73740)
  - @atlaskit/quick-search@2.3.2

## 4.5.6

- [patch] Minor bugfixes and UI tweaks. [80899e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80899e1)
- [none] Updated dependencies [80899e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80899e1)
  - @atlaskit/quick-search@2.3.1

## 4.5.5

- [patch] Fix spaceName attribute coming back from the quick nav API [1c91e59](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c91e59)

## 4.5.4

- [patch] Fixes a bug with search analytics attribution. [4aadd7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aadd7a)

## 4.5.3

- [patch] Changing the backend from XPSearch Aggregator to the existing Quick Nav API [9706af3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9706af3)

## 4.5.2

- [patch] Minor polish [4d3eabc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d3eabc)

## 4.5.1

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/modal-dialog@5.2.2
  - @atlaskit/field-text-area@3.1.1
  - @atlaskit/button@8.1.2
  - @atlaskit/page@7.1.1
  - @atlaskit/theme@4.0.4
  - @atlaskit/flag@8.1.1
  - @atlaskit/navigation@32.1.1
  - @atlaskit/icon@12.1.2

## 4.5.0

- [minor] Add advanced search links to Confluence [4c0be2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c0be2d)

- [minor] Updated dependencies [745b283](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/745b283)
  - @atlaskit/quick-search@2.2.0

## 4.4.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/quick-search@2.1.1
  - @atlaskit/util-service-support@2.0.11
  - @atlaskit/analytics-gas-types@2.1.3
  - @atlaskit/theme@4.0.3
  - @atlaskit/modal-dialog@5.1.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/analytics-next@2.1.8
  - @atlaskit/button@8.1.1
  - @atlaskit/avatar@11.1.1
  - @atlaskit/docs@4.1.1
  - @atlaskit/analytics@3.0.5

## 4.4.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/navigation@32.1.0
  - @atlaskit/quick-search@2.1.0
  - @atlaskit/page@7.1.0
  - @atlaskit/modal-dialog@5.1.0
  - @atlaskit/avatar@11.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/util-service-support@2.0.10
  - @atlaskit/analytics-gas-types@2.1.2
  - @atlaskit/theme@4.0.2
  - @atlaskit/field-text-area@3.0.3
  - @atlaskit/analytics-next@2.1.7
  - @atlaskit/analytics@3.0.4
  - @atlaskit/flag@8.1.0
  - @atlaskit/button@8.1.0

## 4.3.0

- [minor] Show more recent results [25d5dd8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d5dd8)

## 4.2.0

- [minor] Support for feedback button [0538c52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0538c52)

## 4.1.0

- [minor] Minor UI tweaks. [800f2bb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/800f2bb)

## 4.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/quick-search@2.0.0
  - @atlaskit/navigation@32.0.0
  - @atlaskit/page@7.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/util-service-support@2.0.8
  - @atlaskit/analytics@3.0.2
  - @atlaskit/avatar@11.0.0

## 3.3.4

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/page@6.0.4
  - @atlaskit/navigation@31.0.5
  - @atlaskit/quick-search@1.7.2

## 3.3.3

- [patch] Update people results link path in global search [be04163](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be04163)

## 3.3.2

- [patch] Remove SVG react warnings. [89ce7d7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89ce7d7)

## 3.3.1

- [patch] Updated dependencies [586f868](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/586f868)
  - @atlaskit/quick-search@1.7.1

## 3.3.0

- [minor] Consistent avatar sizes [0f80c65](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f80c65)

## 3.2.1

- [patch][f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)

## 3.2.0

- [minor] Updated dependencies [65392e5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65392e5)
  - @atlaskit/quick-search@1.6.0

## 3.1.2

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/quick-search@1.4.2
  - @atlaskit/page@6.0.3
  - @atlaskit/navigation@31.0.4
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4
  - @atlaskit/util-service-support@2.0.7
  - @atlaskit/analytics@3.0.1

## 3.0.4

- [patch] Link to people search includes query [6d2e946](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d2e946)

## 3.0.2

- [patch] Rename EmptyState component to NoResults [cb73105](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cb73105)

## 3.0.1

- [patch] Simplify tests [d2437e9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2437e9)

## 3.0.0

- [major] Building blocks to support Confluence mode. "context" is a required prop now. [a5f1cef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a5f1cef)

## 2.1.1

- [patch] Bumping dependency on avatar [ca55e9c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca55e9c)

## 2.1.0

- [minor] Remove dependency on navigation. [0ae3355](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ae3355)

## 2.0.1

- [patch] Added missing dependencies and added lint rule to catch them all [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 2.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 1.7.0

- [minor] Show empty state when no results were found at all [398901a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/398901a)

## 1.5.0

- [minor] Show error state when searches fail [4fbbb29](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4fbbb29)

## 1.4.0

- [minor] Improve rendering of Jira issues [7f28452](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f28452)

## 1.3.1

- [patch] Clean up CSS for examples [1b7ffce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b7ffce)

## 1.3.0

- [minor] Adds search attribution analytics for confluence search results. [2d73f50](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d73f50)

## 1.2.0

- [minor] Remove environment prop and replace with explicit service url overrides. [b5bd020](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5bd020)

## 1.1.1

- [patch] Support rendering of Jira results [0381f03](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0381f03)

## 1.1.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 1.0.1

- [patch] Update atlaskit/theme version [679e68a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/679e68a)

## 1.0.0

- [major] First release of global-search [7fcd54e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fcd54e)
