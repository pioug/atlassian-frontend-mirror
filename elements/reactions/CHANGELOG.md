# @atlaskit/reactions

## 19.1.5

### Patch Changes

- Updated dependencies

## 19.1.4

### Patch Changes

- [`b90c0237824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90c0237824) - Update package.jsons to remove unused dependencies.
- Updated dependencies

## 19.1.3

### Patch Changes

- Updated dependencies

## 19.1.2

### Patch Changes

- [`4adcd7f3f2b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4adcd7f3f2b) - Fixing small bug related to 19.0.0 change
- Updated dependencies

## 19.1.1

### Patch Changes

- [`b15d1cda72e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b15d1cda72e) - Fixing small bug related to 19.0.0 change

## 19.1.0

### Minor Changes

- [`7de0b9572f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7de0b9572f0) - [ux] Updated reactions so that if there is a reaction with count 0, it will now render as just the emoji with no counter (now an empty string). Previously in this scenario it would show the emoji with the number 0 next to it. This should only affect direct usages of the standalone Reactions components, anyone using ConnectedReactionsView (the standard use case) should see no difference as this component already filters out any reactions with a count of 0.

### Patch Changes

- Updated dependencies

## 19.0.0

### Major Changes

- [`2f55d66e464`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f55d66e464) - [ux] Updated the default emoji set that pops up when adding a new reaction and created a pill shaped outline around the reaction.

  Default emoji set: replaced thumsdown with clap, heart_eyes with hearts, joy with astonished, and cry with thinking.

  Pill shape outline: reactions outlined with a pill shape, there is a smaller gap between the emoji and the emoji count, a smaller set width, and the emoji and emoji count are centered.

### Patch Changes

- Updated dependencies

## 18.2.2

### Patch Changes

- [`87d5fffa13c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87d5fffa13c) - [ux] Fixed an issue where the Reaction trigger resizes and causes flickering
- Updated dependencies

## 18.2.1

### Patch Changes

- Updated dependencies

## 18.2.0

### Minor Changes

- [`7ddbf962bd9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ddbf962bd9) - [ux] Updated and added new translations

### Patch Changes

- Updated dependencies

## 18.1.9

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 18.1.8

### Patch Changes

- [`99abe1f917`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99abe1f917) - Fix SLO of get reactions
- Updated dependencies

## 18.1.7

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 18.1.6

### Patch Changes

- Updated dependencies

## 18.1.5

### Patch Changes

- [`c0533f4b35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0533f4b35) - Upgrade analytics-next to prevent event loss (https://hello.atlassian.net/wiki/spaces/AFP/blog/2020/08/26/828144759/ACTION+REQUIRED+-+upgrade+analytics-next+to+prevent+event+loss)
- Updated dependencies

## 18.1.4

### Patch Changes

- [`bee2157c1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bee2157c1b) - Remove usage of @atlaskit/util-common-test package

## 18.1.3

### Patch Changes

- Updated dependencies

## 18.1.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 18.1.1

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 18.1.0

### Minor Changes

- [`940cde5773`](https://bitbucket.org/atlassian/atlassian-frontend/commits/940cde5773) - - The Reactions popup menu has been moved from the now-deprecated `@atlaskit/layer` to `@atlaskit/popper`.
  - (bugfix) The full emoji picker now repositions to stay in the window boundaries.

### Patch Changes

- Updated dependencies

## 18.0.1

### Patch Changes

- [`d03bff2147`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d03bff2147) - updated translations

## 18.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 17.3.4

### Patch Changes

- [`fc83c36503`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc83c36503) - Update translation files via Traduki build

## 17.3.3

### Patch Changes

- [`4560b65a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4560b65a4f) - upgrade react-transition-group to latest

## 17.3.2

### Patch Changes

- [patch][778b27a380](https://bitbucket.org/atlassian/atlassian-frontend/commits/778b27a380):

  Fix tooltip bug- Updated dependencies [3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):

- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
  - @atlaskit/tooltip@15.2.6
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/editor-test-helpers@11.1.1

## 17.3.1

### Patch Changes

- Updated dependencies [4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):
- Updated dependencies [8126e7648c](https://bitbucket.org/atlassian/atlassian-frontend/commits/8126e7648c):
- Updated dependencies [4bec09aa74](https://bitbucket.org/atlassian/atlassian-frontend/commits/4bec09aa74):
- Updated dependencies [d63888b5e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/d63888b5e5):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
- Updated dependencies [bdf25b1c4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/bdf25b1c4c):
- Updated dependencies [645918eda6](https://bitbucket.org/atlassian/atlassian-frontend/commits/645918eda6):
- Updated dependencies [fad8a16962](https://bitbucket.org/atlassian/atlassian-frontend/commits/fad8a16962):
  - @atlaskit/layer@8.0.2
  - @atlaskit/emoji@62.7.1
  - @atlaskit/editor-test-helpers@11.0.0
  - @atlaskit/docs@8.5.0

## 17.3.0

### Minor Changes

- [minor][a7d82e32f9](https://bitbucket.org/atlassian/atlassian-frontend/commits/a7d82e32f9):

  added SLI analytics when a reaction is added to an object to measure success/failure of service requests- [minor][000cba629f](https://bitbucket.org/atlassian/atlassian-frontend/commits/000cba629f):

  added SLI analytics when reactions are fetched for a container to measure success/failure of service requests

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [0732eedea7](https://bitbucket.org/atlassian/atlassian-frontend/commits/0732eedea7):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [5e3aab8e77](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e3aab8e77):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/util-data-test@13.1.2
  - @atlaskit/editor-test-helpers@10.6.1
  - @atlaskit/button@13.3.9
  - @atlaskit/tooltip@15.2.5

## 17.2.8

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/layer@8.0.1
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3
  - @atlaskit/editor-test-helpers@10.5.1
  - @atlaskit/analytics-gas-types@4.0.13
  - @atlaskit/analytics-namespaced-context@4.1.11
  - @atlaskit/analytics-viewer@0.3.9
  - @atlaskit/elements-test-helpers@0.6.7
  - @atlaskit/emoji@62.6.3
  - @atlaskit/util-data-test@13.1.1
  - @atlaskit/util-service-support@5.0.1

## 17.2.7

### Patch Changes

- Updated dependencies [3b19e30129](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b19e30129):
- Updated dependencies [fe4eaf06fc](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe4eaf06fc):
- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/editor-test-helpers@10.5.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/layer@8.0.0
  - @atlaskit/emoji@62.6.2
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/tooltip@15.2.2

## 17.2.6

### Patch Changes

- [patch][ce21161796](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce21161796):

  Fix some types that were being transpiled to 'any'

## 17.2.5

- Updated dependencies [42a92cad4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42a92cad4e):
  - @atlaskit/emoji@62.5.5
  - @atlaskit/util-data-test@13.0.1
  - @atlaskit/util-service-support@5.0.0

## 17.2.4

- Updated dependencies [bd94b1d552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd94b1d552):
- Updated dependencies [ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):
  - @atlaskit/emoji@62.5.4
  - @atlaskit/util-data-test@13.0.0
  - @atlaskit/i18n-tools@0.6.0
  - @atlaskit/util-service-support@4.1.0
  - @atlaskit/editor-test-helpers@10.1.2
  - @atlaskit/analytics-namespaced-context@4.1.10

## 17.2.3

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 17.2.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 17.2.1

- Updated dependencies [80adfefba2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80adfefba2):
  - @atlaskit/emoji@62.5.1
  - @atlaskit/editor-test-helpers@10.0.0

## 17.2.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 17.1.10

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 17.1.9

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 17.1.8

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

## 17.1.7

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 17.1.6

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 17.1.5

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 17.1.4

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

## 17.1.3

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/editor-test-helpers@9.5.2
  - @atlaskit/emoji@62.2.1
  - @atlaskit/icon@19.0.0

## 17.1.2

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/icon@18.0.1
  - @atlaskit/emoji@62.1.7
  - @atlaskit/tooltip@15.0.0

## 17.1.1

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/editor-test-helpers@9.3.9
  - @atlaskit/emoji@62.1.6
  - @atlaskit/icon@18.0.0

## 17.1.0

- [minor][21f5217343](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21f5217343):

  - consume emoji new entrypoints in AK

## 17.0.1

- [patch][5e00c40c32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e00c40c32):

  - Remove the Reactions component's white background

## 17.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 16.1.10

- Updated dependencies [a1192ef860](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1192ef860):
  - @atlaskit/emoji@61.0.0
  - @atlaskit/editor-test-helpers@8.0.8
  - @atlaskit/util-data-test@11.1.9

## 16.1.9

- Updated dependencies [e7292ab444](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7292ab444):
  - @atlaskit/emoji@60.0.0
  - @atlaskit/editor-test-helpers@8.0.7
  - @atlaskit/util-data-test@11.1.8

## 16.1.8

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 16.1.7

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/emoji@59.2.3
  - @atlaskit/theme@8.1.7

## 16.1.6

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 16.1.5

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/theme@8.1.6
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/emoji@59.2.1
  - @atlaskit/button@12.0.0

## 16.1.4

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 16.1.3

- Updated dependencies [c2c36de22b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2c36de22b):
  - @atlaskit/emoji@59.0.0
  - @atlaskit/editor-test-helpers@8.0.3
  - @atlaskit/util-data-test@11.1.5

## 16.1.2

- Updated dependencies [b0210d7ccc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0210d7ccc):
  - @atlaskit/elements-test-helpers@0.5.0
  - @atlaskit/emoji@58.2.0

## 16.1.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 16.1.0

- [minor][b684722884](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b684722884):

  - improvement of SSR tests and examples for Fabric Elements

## 16.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 15.6.3

- Updated dependencies [7261577953](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7261577953):
  - @atlaskit/emoji@57.0.1
  - @atlaskit/elements-test-helpers@0.3.0

## 15.6.2

- Updated dependencies [7ab3e93996](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab3e93996):
  - @atlaskit/editor-test-helpers@7.0.6
  - @atlaskit/emoji@57.0.0
  - @atlaskit/util-data-test@10.2.5

## 15.6.1

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/analytics-gas-types@3.2.5
  - @atlaskit/analytics-namespaced-context@2.2.1
  - @atlaskit/emoji@56.2.1
  - @atlaskit/util-data-test@10.2.3
  - @atlaskit/util-service-support@3.1.1
  - @atlaskit/analytics-viewer@0.1.7
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/layer@6.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/tooltip@13.0.0

## 15.6.0

- [minor][aa6176aad1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aa6176aad1):

  - added SSR tests to reactions

## 15.5.1

- Updated dependencies [4aee5f3cec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4aee5f3cec):
  - @atlaskit/emoji@56.0.0
  - @atlaskit/editor-test-helpers@7.0.2
  - @atlaskit/util-data-test@10.2.2

## 15.5.0

- [minor][9ab9e467d2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ab9e467d2):

  - Bump version of typestyle for ssr compatibility

## 15.4.2

- Updated dependencies [4af5bd2a58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4af5bd2a58):
  - @atlaskit/emoji@55.0.1
  - @atlaskit/editor-test-helpers@7.0.0

## 15.4.1

- Updated dependencies [fc6164c8c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc6164c8c2):
  - @atlaskit/emoji@55.0.0
  - @atlaskit/editor-test-helpers@6.3.22
  - @atlaskit/util-data-test@10.2.1

## 15.4.0

- [minor][68ef17af8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/68ef17af8b):

  - Enable noImplicitAny for reactions, fix type issues.

## 15.3.4

- Updated dependencies [69c8d0c19c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c8d0c19c):
  - @atlaskit/editor-test-helpers@6.3.17
  - @atlaskit/emoji@54.0.0
  - @atlaskit/util-data-test@10.0.36

## 15.3.3

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/tooltip@12.1.15
  - @atlaskit/editor-test-helpers@6.3.13
  - @atlaskit/emoji@53.0.1
  - @atlaskit/icon@16.0.0

## 15.3.2

- Updated dependencies [85d5d168fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85d5d168fd):
  - @atlaskit/emoji@53.0.0
  - @atlaskit/editor-test-helpers@6.3.12
  - @atlaskit/util-data-test@10.0.34

## 15.3.1

- Updated dependencies [dadef80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dadef80):
  - @atlaskit/emoji@52.0.0
  - @atlaskit/editor-test-helpers@6.3.11
  - @atlaskit/util-data-test@10.0.33

## 15.3.0

- [minor][e60d7aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e60d7aa):

  - updated i18n translations

## 15.2.2

- Updated dependencies [cbb8cb5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbb8cb5):
  - @atlaskit/editor-test-helpers@6.3.7
  - @atlaskit/emoji@51.0.0
  - @atlaskit/util-data-test@10.0.31

## 15.2.1

- Updated dependencies [72d37fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72d37fb):
  - @atlaskit/emoji@50.0.0
  - @atlaskit/util-data-test@10.0.30

## 15.2.0

- [minor][277edda](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/277edda):

  - replaced enzyme-react-intl with @atlaskit/editor-test-helpers

## 15.1.0

- [minor][1296324](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1296324):

  - added i18n support to reactions

- [minor][ccf385a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ccf385a):

  - added i18n translations

## 15.0.11

- Updated dependencies [b3738ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3738ea):
  - @atlaskit/emoji@49.0.0
  - @atlaskit/util-data-test@10.0.28

## 15.0.10

- Updated dependencies [80f765b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80f765b):
  - @atlaskit/emoji@48.0.0
  - @atlaskit/util-data-test@10.0.26

## 15.0.9

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/icon@15.0.2
  - @atlaskit/layer@5.0.10
  - @atlaskit/theme@7.0.1
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/analytics-gas-types@3.2.3
  - @atlaskit/analytics-namespaced-context@2.1.5
  - @atlaskit/emoji@47.0.7
  - @atlaskit/util-data-test@10.0.25
  - @atlaskit/util-service-support@3.0.5
  - @atlaskit/docs@6.0.0

## 15.0.8

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/icon@15.0.1
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/emoji@47.0.6
  - @atlaskit/theme@7.0.0

## 15.0.7

- [patch][3061b52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3061b52):

  - AK-5723 - adjust files in package.json to ensure correct publishing of dist/package.json

## 15.0.6

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/tooltip@12.1.11
  - @atlaskit/emoji@47.0.2
  - @atlaskit/icon@15.0.0

## 15.0.5

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/theme@6.2.1
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/emoji@47.0.1
  - @atlaskit/button@10.0.0
  - @atlaskit/analytics-next-types@3.1.2

## 15.0.4

- Updated dependencies [7e8b4b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8b4b9):
  - @atlaskit/emoji@47.0.0
  - @atlaskit/util-data-test@10.0.21

## 15.0.3

- Updated dependencies [2c21466](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c21466):
  - @atlaskit/emoji@46.0.0
  - @atlaskit/util-data-test@10.0.20

## 15.0.2

- [patch][36c362f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36c362f):

  - FS-3174 - Fix usage of gridSize() and borderRadius()

## 15.0.1

- [patch] Updated dependencies [b1ce691](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1ce691)
  - @atlaskit/emoji@45.0.0
  - @atlaskit/util-data-test@10.0.16

## 15.0.0

- [major] Fix reactions. Remove context and receive store as a prop. [b1de9c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1de9c8)

## 14.0.5

- [patch] Updated dependencies [2afa60d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2afa60d)
  - @atlaskit/emoji@44.0.0
  - @atlaskit/util-data-test@10.0.14

## 14.0.4

- [patch] Fix malformed operational analytics event [306cf0a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/306cf0a)

## 14.0.3

- [patch] Updated dependencies [8b2c4d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b2c4d3)
- [patch] Updated dependencies [3302d51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3302d51)
  - @atlaskit/emoji@43.0.0
  - @atlaskit/util-data-test@10.0.12

## 14.0.2

- [patch] Fix letter case 'actionSubjectID' => 'actionSubjectId' [3757992](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3757992)

## 14.0.1

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/emoji@42.0.1
  - @atlaskit/icon@14.0.0

## 14.0.0

- [major] Reactions state management revisited [7e8d079](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e8d079)

## 13.1.3

- [patch] Updated dependencies [927ae63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/927ae63)
  - @atlaskit/util-data-test@10.0.10
  - @atlaskit/emoji@42.0.0

## 13.1.2

- [patch] use new tsconfig for typechecking [09df171](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09df171)

## 13.1.1

- [patch] Updated dependencies [6e1d642](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e1d642)
  - @atlaskit/emoji@41.0.0
  - @atlaskit/util-data-test@10.0.9

## 13.1.0

- [minor] FS-2830 add new analytics to @atlaskit/reactions [e432c15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e432c15)

## 13.0.11

- [patch] FS-2941 Stop using Request object and upgrade fetch-mock [dff332a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dff332a)

## 13.0.10

- [patch] Change tsconfig of reactions [ecca4b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4b6)

## 13.0.9

- [patch] Updated dependencies [7545979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7545979)
  - @atlaskit/emoji@40.0.0
  - @atlaskit/util-data-test@10.0.8

## 13.0.8

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/util-data-test@10.0.7
  - @atlaskit/emoji@39.1.1

## 13.0.7

- [patch] Updated dependencies [dd91bcf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd91bcf)
  - @atlaskit/emoji@39.1.0

## 13.0.6

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/emoji@39.0.4
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/icon@13.2.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 13.0.5

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/util-data-test@10.0.4
  - @atlaskit/emoji@39.0.1
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/layer@5.0.4
  - @atlaskit/icon@13.2.4

## 13.0.4

- [patch] Bumping to latest version of emoji (major bump) [a95ee92](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a95ee92)

* [none] Updated dependencies [597e0bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/597e0bd)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/emoji@39.0.0
* [none] Updated dependencies [61df453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/61df453)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/emoji@39.0.0
* [none] Updated dependencies [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/emoji@39.0.0
* [none] Updated dependencies [c8eb097](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8eb097)
  - @atlaskit/util-data-test@10.0.3
  - @atlaskit/emoji@39.0.0
* [none] Updated dependencies [d02746f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d02746f)
  - @atlaskit/emoji@39.0.0
  - @atlaskit/util-data-test@10.0.3

## 13.0.3

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/util-data-test@10.0.2
  - @atlaskit/emoji@38.0.5
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/docs@5.0.2
  - @atlaskit/layer@5.0.3

## 13.0.2

- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/emoji@38.0.1
  - @atlaskit/icon@13.1.1

## 13.0.1

- [patch] Ensure reactions wrap if insufficient horizontal space [bb7129d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bb7129d)

## 13.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/emoji@38.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/emoji@38.0.0
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/icon@13.0.0

## 12.2.2

- [patch] Move the tests under src and club the tests under unit, integration and visual regression [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
- [none] Updated dependencies [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
  - @atlaskit/util-data-test@9.1.18
  - @atlaskit/emoji@37.0.1

## 12.2.1

- [patch] Updated dependencies [f897c79](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f897c79)
  - @atlaskit/util-data-test@9.1.17
  - @atlaskit/emoji@37.0.0
- [none] Updated dependencies [cacf096](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacf096)
  - @atlaskit/emoji@37.0.0
  - @atlaskit/util-data-test@9.1.17

## 12.2.0

- [minor] FS-1907 adding reaction sends itemCreationDate of object to service [ddcc42f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ddcc42f)

## 12.1.5

- [patch] Updated dependencies [8d5053e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d5053e)
  - @atlaskit/emoji@36.0.1
  - @atlaskit/util-data-test@9.1.15

## 12.1.4

- [patch] Updated dependencies [0cf2f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cf2f52)
  - @atlaskit/emoji@36.0.0
  - @atlaskit/util-data-test@9.1.14

## 12.1.3

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/emoji@35.1.1
  - @atlaskit/util-data-test@9.1.13
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/layer@4.0.3
  - @atlaskit/icon@12.1.2

## 12.1.2

- [patch] FS-1993 fix reactions flaky test [54c5a7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/54c5a7a)

## 12.1.1

- [patch] FS-1889 make reactions resource immutable [deba783](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/deba783)

## 12.1.0

- [none] Updated dependencies [7217164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7217164)
  - @atlaskit/util-data-test@9.1.11
  - @atlaskit/emoji@35.1.0

## 12.0.12

- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/emoji@35.0.7
  - @atlaskit/util-data-test@9.1.10
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/layer@4.0.0

## 12.0.11

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/emoji@35.0.6
  - @atlaskit/util-data-test@9.1.9

## 12.0.10

- [patch][f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)
- [none] Updated dependencies [f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)

## 12.0.9

- [patch] FS-1959 use @atlaskit/tooltip for reactions tooltip [ec12b0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ec12b0e)

## 12.0.8

- [patch] FS-1975 place picker after reactions [4a6e1c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4a6e1c5)

## 12.0.7

- [none] Updated dependencies [febc44d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/febc44d)
  - @atlaskit/util-data-test@9.1.4
  - @atlaskit/emoji@35.0.0
- [none] Updated dependencies [714ab32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/714ab32)
  - @atlaskit/util-data-test@9.1.4
  - @atlaskit/emoji@35.0.0
- [patch] Updated dependencies [84f6f91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84f6f91)
  - @atlaskit/emoji@35.0.0
  - @atlaskit/util-data-test@9.1.4
- [patch] Updated dependencies [9041d71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9041d71)
  - @atlaskit/emoji@35.0.0
  - @atlaskit/util-data-test@9.1.4

## 12.0.6

- [patch] FS-1921 Don't refresh reactions when getting detailed response if requests [1764815](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1764815)

## 12.0.5

- [none] Updated dependencies [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/emoji@34.2.0
- [none] Updated dependencies [74f84c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74f84c6)
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/emoji@34.2.0
- [none] Updated dependencies [92cdf83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92cdf83)
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/emoji@34.2.0
- [none] Updated dependencies [4151cc5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4151cc5)
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/emoji@34.2.0
- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/emoji@34.2.0
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/icon@11.3.0
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4
  - @atlaskit/layer@3.1.1
- [patch] Updated dependencies [89146bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89146bf)
  - @atlaskit/emoji@34.2.0
  - @atlaskit/util-data-test@9.1.3

## 12.0.4

- [patch] FS-1890 Remove sinon dependency from reactions [b6ee84e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b6ee84e)
- [patch] FS-1890 Migrate Reactions to Jest [8e0e31e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e0e31e)

## 12.0.0

- [major] FS-1023 Error handling for reactions [2202edc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2202edc)
- [minor] FS-1023 - Handle error and show tooltip in case of error [f9f1040](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9f1040)

## 11.0.9

- [patch] FS-1645 update reaction animations [c01d36d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c01d36d)

## 11.0.7

- [patch] FS-1882 update reaction button to match mobile [acc8118](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acc8118)

## 11.0.6

- [patch] FS-1876 update default reactions emoji [114cee6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/114cee6)

## 11.0.4

- [patch] FS-1644 reactions ui changes [70ccf94](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70ccf94)

## 11.0.3

- [patch] FS-1868 always add new reactions to the end of the list [70fdbeb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70fdbeb)

## 11.0.1

- [patch] Added missing dependencies and added lint rule to catch them all [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 11.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 10.8.15

- [patch] Remove import from es6 promise at src level [e27f2ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e27f2ac)

## 10.8.0

- [minor] Moved Reactions to MK2 repo [d0cecbf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0cecbf)

## 10.7.1 (2017-12-14)

- bug fix; fix TS errors in reactions ([21c92b6](https://bitbucket.org/atlassian/atlaskit/commits/21c92b6))

## 10.7.0 (2017-11-28)

- bug fix; fS-1521 Remove util-data-test ([eb88f40](https://bitbucket.org/atlassian/atlaskit/commits/eb88f40))
- feature; fS-1521 Compatibility with react 16 ([4bd5c13](https://bitbucket.org/atlassian/atlaskit/commits/4bd5c13))
- bug fix; fS-1521 Bring back border radius ([f73ae4a](https://bitbucket.org/atlassian/atlaskit/commits/f73ae4a))
- bug fix; aK-3962 Remove react-transition-group from reactions ([da2b92d](https://bitbucket.org/atlassian/atlaskit/commits/da2b92d))
- feature; fS-994 Change reactions tooltips to be the chunky black ADG3 tooltips ([b574b07](https://bitbucket.org/atlassian/atlaskit/commits/b574b07))
- bug fix; fS-1521 Upgrade reaction component's dependencies to latest versions ([cae82c6](https://bitbucket.org/atlassian/atlaskit/commits/cae82c6))
- bug fix; fS-1521 Update emoji dependency ([405ab1a](https://bitbucket.org/atlassian/atlaskit/commits/405ab1a))

## 10.6.3 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 10.6.2 (2017-06-01)

- fix; fS-1015 Reactions randomly reorder themselves + other bugfixes ([f50a254](https://bitbucket.org/atlassian/atlaskit/commits/f50a254))

## 10.6.1 (2017-05-30)

- fix; fS-957 Make reactions wrap to newline ([2ad5cfd](https://bitbucket.org/atlassian/atlaskit/commits/2ad5cfd))

## 10.6.0 (2017-05-26)

- fix; fS-992 Emoji picker is too big for issue detail modal ([fb9ca62](https://bitbucket.org/atlassian/atlaskit/commits/fb9ca62))
- fix; fS-992 Remove popup component ([6aa5ee2](https://bitbucket.org/atlassian/atlaskit/commits/6aa5ee2))
- feature; fS-985 expose analyticService ([fbe4f67](https://bitbucket.org/atlassian/atlaskit/commits/fbe4f67))

## 10.5.1 (2017-05-22)

- fix; fS-963 Bump emoji version and fix css ([d168d44](https://bitbucket.org/atlassian/atlaskit/commits/d168d44))

## 10.3.0 (2017-05-19)

- fix; fS-963 Fix css ([f9f634a](https://bitbucket.org/atlassian/atlaskit/commits/f9f634a))
- fix; fS-963 Fix optimistic add/delete ([9ebe60b](https://bitbucket.org/atlassian/atlaskit/commits/9ebe60b))
- fix; fS-963 Fix PR feedbacks ([88199b4](https://bitbucket.org/atlassian/atlaskit/commits/88199b4))
- fix; fS-963 Fix reactions reappearing after deletion because of detailledreaction call ([85776d8](https://bitbucket.org/atlassian/atlaskit/commits/85776d8))
- fix; fS-963 fix test ([13232c4](https://bitbucket.org/atlassian/atlaskit/commits/13232c4))
- fix; fS-963 fix test & bump emoji ([443d8ff](https://bitbucket.org/atlassian/atlaskit/commits/443d8ff))
- fix; fS-963 Fix tests ([f10c4c6](https://bitbucket.org/atlassian/atlaskit/commits/f10c4c6))
- feature; fS-965 Update reactions design ([0451638](https://bitbucket.org/atlassian/atlaskit/commits/0451638))

## 10.2.2 (2017-05-11)

- fix; add containerAri where needed to match service contract ([bb2adca](https://bitbucket.org/atlassian/atlaskit/commits/bb2adca))
- fix; fix typescript error ([81249fb](https://bitbucket.org/atlassian/atlaskit/commits/81249fb))

## 10.2.1 (2017-05-03)

- fix; harden code to run in NodeJS environment. ([cc78477](https://bitbucket.org/atlassian/atlaskit/commits/cc78477))

## 10.2.0 (2017-05-02)

- fix; fixes a bug where long names where not being truncated ([e1ec953](https://bitbucket.org/atlassian/atlaskit/commits/e1ec953))
- feature; adding support to optionally set the text of the trigger-button ([6b5dc09](https://bitbucket.org/atlassian/atlaskit/commits/6b5dc09))

## 10.1.0 (2017-05-01)

- feature; adding support for detailed reactions ([81c6873](https://bitbucket.org/atlassian/atlaskit/commits/81c6873))
- feature; fS-767 Add analytics to reaction component ([1b5208f](https://bitbucket.org/atlassian/atlaskit/commits/1b5208f))

## 10.0.0 (2017-04-28)

- feature; adds the ablity to enable/disable all emojis ([ccacd6f](https://bitbucket.org/atlassian/atlaskit/commits/ccacd6f))
- breaking; By default the reaction picker will only allow a predefined set of emojis.

## 9.0.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 9.0.0 (2017-04-26)

- fix; fixes emoji-size in reactions and using string rather than emojiid ([87a6af9](https://bitbucket.org/atlassian/atlaskit/commits/87a6af9))
- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))
- feature; adding containerAri ([e88190a](https://bitbucket.org/atlassian/atlaskit/commits/e88190a))
- breaking; containerAri is now a required prop for ResourcedReactionPicker and ResourcedReactions. It's also required as first argument in toggleReaction, addReaction and deleteReaction

## 5.0.0 (2017-04-19)

- feature; upgrade to latest emoji component and emoji id spec ([ae59982](https://bitbucket.org/atlassian/atlaskit/commits/ae59982))
- breaking; Emoji representation has changes due to upgrading of emoji component. ISSUES CLOSED: FS-887

## 4.0.1 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 4.0.0 (2017-03-09)

- feature; bump emoji dependency to ensure getting all needed exports. ([62f2487](https://bitbucket.org/atlassian/atlaskit/commits/62f2487))
- feature; upgrade to latest asynchronous Emoji ([78ce481](https://bitbucket.org/atlassian/atlaskit/commits/78ce481))
- breaking; Latest Emoji upgrade and some events are breaking changes.

## 3.0.0 (2017-03-09)

- feature; adding resourced components that takes a ReactionProvivder-promise ([b503bd9](https://bitbucket.org/atlassian/atlaskit/commits/b503bd9))
- breaking; Renamed ReactionsService to ReactionsResource, The Reactions-component now takes a "reactionsProvider" instead of "reactionsService"

## 2.0.1 (2017-02-27)

- empty commit to make components release themselves ([5511fbe](https://bitbucket.org/atlassian/atlaskit/commits/5511fbe))

## 1.0.0 (2017-02-17)

- Fix the build and the readme story ([1915b49](https://bitbucket.org/atlassian/atlaskit/commits/1915b49))
- Fix type error in reactions-service ([09080e3](https://bitbucket.org/atlassian/atlaskit/commits/09080e3))
- Trying to fix failing CI ([2fc74cc](https://bitbucket.org/atlassian/atlaskit/commits/2fc74cc))
- Added autopoll support and logic for ignorning outdated updates ([bc7724f](https://bitbucket.org/atlassian/atlaskit/commits/bc7724f))
- Reactions Picker ([70e015a](https://bitbucket.org/atlassian/atlaskit/commits/70e015a))
