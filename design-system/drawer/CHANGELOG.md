# @atlaskit/drawer

## 7.0.0

### Major Changes

- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - [ux] Breaking changes:

  The following components have been removed from `@atlaskit/drawer`:

  - `DrawerItemTheme`
  - `DrawerSkeletonHeader`
  - `DrawerSkeletonItem`
  - `DrawerItemGroup`
  - `DrawerItem`

  These components wrap the much older, now deprecated package `@atlaskit/item` and had little to no usage. If you really need the functionality
  captured by these components; we'd encourage you to try `@atlaskit/menu`
  which matches and extends all of the functionality of `@atlaskit/item` in
  a more accessible and performant way.

  Housekeeping:

  - Now exposes a `testId` property as a hook for automated testing.
  - Package no longer depends on `styled-components` for styling
  - Package no longer depends on `chromatism`
  - Package no longer depends on `@atlaskit/item`
  - Package no longer depends on `@atlaskit/avatar`

### Patch Changes

- Updated dependencies

## 6.0.10

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 6.0.9

### Patch Changes

- Updated dependencies

## 6.0.8

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.
- Updated dependencies

## 6.0.7

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 6.0.6

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 6.0.5

### Patch Changes

- Updated dependencies

## 6.0.4

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 6.0.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 6.0.2

### Patch Changes

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages

## 6.0.1

### Patch Changes

- [`60dd4ecc69`](https://bitbucket.org/atlassian/atlassian-frontend/commits/60dd4ecc69) - Changed export all to export individual components in index
- Updated dependencies

## 6.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 5.3.10

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 5.3.9

### Patch Changes

- [`4560b65a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4560b65a4f) - upgrade react-transition-group to latest

## 5.3.8

### Patch Changes

- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies
- [`baaad91b65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/baaad91b65) - Updated to use the latest and more performant version of `@atlaskit/avatar`
- Updated dependencies

## 5.3.7

### Patch Changes

- Updated dependencies

## 5.3.6

### Patch Changes

- [patch][2bfc59f090](https://bitbucket.org/atlassian/atlassian-frontend/commits/2bfc59f090):

  Change imports to comply with Atlassian conventions- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [167a55fd7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/167a55fd7a):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [6d744d3ff1](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d744d3ff1):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
- Updated dependencies [7a2540821c](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a2540821c):
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/avatar@17.1.10
  - @atlaskit/blanket@10.0.18
  - @atlaskit/webdriver-runner@0.3.4
  - @atlaskit/dropdown-menu@9.0.3

## 5.3.5

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [8b9598a760](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b9598a760):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/item@11.0.2
  - @atlaskit/avatar@17.1.9
  - @atlaskit/button@13.3.9
  - @atlaskit/dropdown-menu@9.0.2
  - @atlaskit/section-message@4.1.7

## 5.3.4

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/avatar@17.1.8
  - @atlaskit/button@13.3.8
  - @atlaskit/dropdown-menu@9.0.1
  - @atlaskit/section-message@4.1.6

## 5.3.3

### Patch Changes

- [patch][3b92b89113](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b92b89113):

  onEntered callback now fires when enter animation is complete- Updated dependencies [9e87af4685](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e87af4685):

- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
  - @atlaskit/dropdown-menu@9.0.0
  - @atlaskit/icon@20.0.2

## 5.3.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/avatar@17.1.7
  - @atlaskit/blanket@10.0.17
  - @atlaskit/button@13.3.7
  - @atlaskit/dropdown-menu@8.2.4
  - @atlaskit/icon@20.0.1
  - @atlaskit/item@11.0.1
  - @atlaskit/portal@3.1.6
  - @atlaskit/section-message@4.1.5
  - @atlaskit/theme@9.5.1
  - @atlaskit/quick-search@7.8.5

## 5.3.1

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/icon@20.0.0
  - @atlaskit/item@11.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/quick-search@7.8.4
  - @atlaskit/dropdown-menu@8.2.3
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/portal@3.1.5

## 5.3.0

### Minor Changes

- [minor][99849f50b2](https://bitbucket.org/atlassian/atlassian-frontend/commits/99849f50b2):

  Implementing the overrides API on the Drawer component

### Patch Changes

- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
  - @atlaskit/docs@8.3.0

## 5.2.0

### Minor Changes

- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Allowing support for using with new react-beautiful-dnd 12.x API

### Patch Changes

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/quick-search@7.8.2
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/avatar@17.1.5
  - @atlaskit/item@10.2.0

## 5.1.0

### Minor Changes

- [minor][d438b16fbc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d438b16fbc):

  Added an onOpenComplete callback to the @atlaskit/drawer that is called when the drawer finishes opening.

### Patch Changes

- Updated dependencies [c1d4898af5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1d4898af5):
- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
  - @atlaskit/icon@19.0.11
  - @atlaskit/theme@9.3.0
  - @atlaskit/portal@3.1.3

## 5.0.14

### Patch Changes

- [patch][f86839ca4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f86839ca4e):

  @atlaskit/portal had an issue in IE11 and this is fixed in 3.1.2

## 5.0.13

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 5.0.12

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 5.0.11

### Patch Changes

- [patch][ab418242f6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab418242f6):

  Removes @atlaskit/docs package from dependencies

## 5.0.10

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/dropdown-menu@8.1.1
  - @atlaskit/item@10.1.5
  - @atlaskit/quick-search@7.7.1
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 5.0.9

### Patch Changes

- [patch][baf6c19b23](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/baf6c19b23):

  Remove //@ts-ignore unintentionally rendered with the other content

## 5.0.8

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 5.0.7

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 5.0.6

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 5.0.5

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 5.0.4

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

## 5.0.3

### Patch Changes

- [patch][d905cbc0ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d905cbc0ac):

  Adding a condition to check if the component are referenced in tests running in CI. It reduces the noise and help reading the CI log.

## 5.0.2

### Patch Changes

- [patch][2c0216ff0a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2c0216ff0a):

  Remove react-dom from dependencies to devDependencies

## 5.0.1

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 5.0.0

### Major Changes

- [major][75c64ee36a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75c64ee36a):

  @atlaskit/drawer has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 4.2.2

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 4.2.1

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/button@13.0.9
  - @atlaskit/dropdown-menu@8.0.8
  - @atlaskit/item@10.0.5
  - @atlaskit/portal@3.0.7
  - @atlaskit/section-message@4.0.5
  - @atlaskit/quick-search@7.5.1
  - @atlaskit/icon@19.0.0

## 4.2.0

### Minor Changes

- [minor][72adb807b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72adb807b9):

  Exports DrawerItem as part of the drawer package. Exposes props to control focus lock behaviour.

## 4.1.6

### Patch Changes

- [patch][12e4a436a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12e4a436a2):

  - Added focus lock to Drawer

## 4.1.5

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 4.1.4

### Patch Changes

- [patch][20aca56bcc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/20aca56bcc):

  The portal rendered by a drawer no longer renders if the drawer is not open

## 4.1.3

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/button@13.0.8
  - @atlaskit/dropdown-menu@8.0.4
  - @atlaskit/item@10.0.2
  - @atlaskit/portal@3.0.3
  - @atlaskit/section-message@4.0.2
  - @atlaskit/quick-search@7.4.1
  - @atlaskit/icon@18.0.0

## 4.1.2

- Updated dependencies [dacfb81ca1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dacfb81ca1):
  - @atlaskit/portal@3.0.0

## 4.1.1

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/avatar@16.0.2
  - @atlaskit/icon@17.1.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 4.1.0

- [minor][3301793aae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3301793aae):

  - Add DrawerSkeletonHeader, DrawerSkeletonItem and DrawerItemGroup components to drawer

## 4.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 3.0.10

- Updated dependencies [5b6b4d6a0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b6b4d6a0f):
  - @atlaskit/portal@1.0.0

## 3.0.9

- Updated dependencies [38dab947e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/38dab947e6):
  - @atlaskit/blanket@9.0.0

## 3.0.8

- [patch][371becf9e2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/371becf9e2):

  - Internal changes only. Drawer is compatible with SSR.

## 3.0.7

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/blanket@8.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/dropdown-menu@7.0.6
  - @atlaskit/icon@16.0.9
  - @atlaskit/item@9.0.1
  - @atlaskit/section-message@2.0.3
  - @atlaskit/quick-search@6.1.1
  - @atlaskit/theme@8.1.7

## 3.0.6

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/blanket@8.0.2
  - @atlaskit/dropdown-menu@7.0.4
  - @atlaskit/icon@16.0.8
  - @atlaskit/portal@0.3.1
  - @atlaskit/section-message@2.0.2
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 3.0.5

- [patch][42d931a2fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42d931a2fd):

  - Move visual-regression to devDependncies

## 3.0.4

- [patch][a28eb04426](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a28eb04426):

  - Migrates package from emotion 9 to emotion 10. No behaviour or API changes.

## 3.0.3

- [patch][211463f820](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/211463f820):

  - Bugfix: fixes z-index problem causing drawer to appear underneath navigation.

- Updated dependencies [ce4e1b4780](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce4e1b4780):
  - @atlaskit/portal@0.3.0

## 3.0.2

- [patch][37ee906cf7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/37ee906cf7):

  - Internal changes only. Drawer uses @atlaskit/portal and is now SSR compatible.

## 3.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/blanket@8.0.1
  - @atlaskit/dropdown-menu@7.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/section-message@2.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0
  - @atlaskit/quick-search@6.0.0

## 3.0.0

- [major][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):

  - Drop ES5 from all the flow modules

  ### Dropping CJS support in all @atlaskit packages

  As a breaking change, all @atlaskit packages will be dropping cjs distributions and will only distribute esm. This means all distributed code will be transpiled, but will still contain `import` and
  `export` declarations.

  The major reason for doing this is to allow us to support multiple entry points in packages, e.g:

  ```js
  import colors from `@atlaskit/theme/colors`;
  ```

  Previously this was sort of possible for consumers by doing something like:

  ```js
  import colors from `@atlaskit/theme/dist/esm/colors`;
  ```

  This has a couple of issues. 1, it treats the file system as API making internal refactors harder, we have to worry about how consumers might be using things that aren't _actually_ supposed to be used. 2. We are unable to do this _internally_ in @atlaskit packages. This leads to lots of packages bundling all of theme, just to use a single color, especially in situations where tree shaking fails.

  To support being able to use multiple entrypoints internally, we unfortunately cannot have multiple distributions as they would need to have very different imports from of their own internal dependencies.

  ES Modules are widely supported by all modern bundlers and can be worked around in node environments.

  We may choose to revisit this solution in the future if we find any unintended condequences, but we see this as a pretty sane path forward which should lead to some major bundle size decreases, saner API's and simpler package architecture.

  Please reach out to #fabric-build (if in Atlassian) or create an issue in [Design System Support](https://ecosystem.atlassian.net/secure/CreateIssue.jspa?pid=24670) (for external) if you have any questions or queries about this.

## 2.7.1

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/dropdown-menu@6.1.26
  - @atlaskit/item@8.0.15
  - @atlaskit/section-message@1.0.16
  - @atlaskit/quick-search@5.2.5
  - @atlaskit/icon@16.0.0

## 2.7.0

- [minor][9cfee26](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cfee26):

  - Add data-test-selector to various components to help open and close the Notification Drawer programmatically. This would support test automation

## 2.6.1

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/blanket@7.0.12
  - @atlaskit/button@10.1.1
  - @atlaskit/dropdown-menu@6.1.25
  - @atlaskit/icon@15.0.2
  - @atlaskit/item@8.0.14
  - @atlaskit/section-message@1.0.14
  - @atlaskit/theme@7.0.1
  - @atlaskit/quick-search@5.2.4
  - @atlaskit/docs@6.0.0

## 2.6.0

- [minor][53bf8be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/53bf8be):

  - Support onCloseComplete

## 2.5.4

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/blanket@7.0.11
  - @atlaskit/button@10.0.4
  - @atlaskit/dropdown-menu@6.1.24
  - @atlaskit/icon@15.0.1
  - @atlaskit/item@8.0.13
  - @atlaskit/section-message@1.0.13
  - @atlaskit/quick-search@5.2.1
  - @atlaskit/theme@7.0.0

## 2.5.3

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/dropdown-menu@6.1.23
  - @atlaskit/section-message@1.0.12
  - @atlaskit/icon@15.0.0

## 2.5.2

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/blanket@7.0.10
  - @atlaskit/dropdown-menu@6.1.22
  - @atlaskit/icon@14.6.1
  - @atlaskit/section-message@1.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 2.5.1

- [patch][f480bab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f480bab):

  - Convert padding to margin to fix a scrolling issue in global-search

## 2.5.0

- [minor][aacb208](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aacb208):

  - Export a new component, DrawerItemTheme, for theming the Drawer with the navigation item theme.

## 2.4.0

- [minor][6746a42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6746a42):

  - Add extended width option and width transitions

## 2.3.1

- [patch][a6e5197](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a6e5197):

  - 1. Add canUseDOM to fix SSR issue in Drawer. 2) Update SSR tests in navigation-next to exclude the examples with Hash, Router or Dom

## 2.3.0

- [patch][a637f5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a637f5e):

  - Refine and fix some flow type errors found by fixing @atlaskit/analytics-next HOCs to allow flow to type check properly

- [minor][670597d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/670597d):

  - Make `width` prop optional and default it to 'narrow'

## 2.2.0

- [minor][90f4995](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90f4995):

  Update drawer width with 'medium' width

## 2.1.3

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 2.1.2

- [patch] Fix fixed-positioned drawer contents from being positioned incorrectly caused by the drawer creating a new stacking context with the transform css property. This was most notable when rendering dropdown-menus inside the drawer. [c80813c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c80813c)

## 2.1.1

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/section-message@1.0.8
  - @atlaskit/icon@14.0.0

## 2.1.0

- [minor] Exposes a new prop shouldUnmountOnExit in @atlaskit/drawer which let's the consumer decide if the contents of the drawer should be retained on unmount. Exposes 4 new props, one for each drawer to let the product decide if the contents of the drawer should be retained on drawerClose [2988998](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2988998)

## 2.0.1

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 2.0.0

- [major] Provides analytics for common component interactions. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [501378a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/501378a)
- [patch] Fix onClose/onKeyDown being called when pressing the esc key while the drawer is closed [a675f7b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a675f7b)

## 1.0.6

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/section-message@1.0.5
  - @atlaskit/icon@13.2.5
  - @atlaskit/button@9.0.6
  - @atlaskit/blanket@7.0.5
  - @atlaskit/docs@5.0.6

## 1.0.5

- [patch] Add variable name displayNames for anonymous function SFC components to improve debugging experience [50d469f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50d469f)

## 1.0.4

- [patch] Fix: fade issue with z-index elements [626244b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/626244b)

## 1.0.3

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/section-message@1.0.4
  - @atlaskit/blanket@7.0.4
  - @atlaskit/icon@13.2.4

## 1.0.2

- [patch] Fixes overflow issue in drawers with long and wide contents [6438477](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6438477)

## 1.0.1

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/blanket@7.0.3
  - @atlaskit/docs@5.0.2

## 1.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/blanket@7.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/blanket@7.0.0
  - @atlaskit/icon@13.0.0

## 0.1.1

- [patch] Button should be a dev dependency [50ca31b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ca31b)
- [none] Updated dependencies [50ca31b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ca31b)

## 0.1.0

- [minor] Extract standalone Drawer component. Remove drawer state from navigation state manager navigation-next. Stop exporting Drawer component in global-navigation [d11307b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d11307b)
