# @atlaskit/inline-dialog

## 13.1.1

### Patch Changes

- Updated dependencies

## 13.1.0

### Minor Changes

- [`5a049f800d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a049f800d3) - Integrates the new tokens package to add support for our new theming solution. This change is fully backwards compatible with our existing theming solution
- [`caec2cee6e0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/caec2cee6e0) - Removes `styled-components` dependency from the package. Also uses ThemeV2 API now. There should be no visual or UX change.

### Patch Changes

- Updated dependencies

## 13.0.11

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 13.0.10

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.

## 13.0.9

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 13.0.8

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 13.0.7

### Patch Changes

- Updated dependencies

## 13.0.6

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 13.0.5

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 13.0.4

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 13.0.3

### Patch Changes

- Updated dependencies

## 13.0.2

### Patch Changes

- [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme and package information has been updated to point to the new design system website.

## 13.0.1

### Patch Changes

- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 13.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 12.1.14

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 12.1.13

### Patch Changes

- Updated dependencies

## 12.1.12

### Patch Changes

- [patch][3a09573b4e](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a09573b4e):

  Change imports to comply with Atlassian conventions- Updated dependencies [cf8577f5d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf8577f5d6):

- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
- Updated dependencies [ca494abcd5](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca494abcd5):
  - @atlaskit/popper@3.1.12
  - @atlaskit/button@13.3.11
  - @atlaskit/datetime-picker@9.4.0
  - @atlaskit/icon@20.1.1
  - @atlaskit/select@11.0.10
  - @atlaskit/webdriver-runner@0.3.4

## 12.1.11

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/button@13.3.9
  - @atlaskit/datetime-picker@9.2.8
  - @atlaskit/select@11.0.9

## 12.1.10

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/datetime-picker@9.2.7
  - @atlaskit/select@11.0.8

## 12.1.9

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/datetime-picker@9.2.5
  - @atlaskit/icon@20.0.1
  - @atlaskit/popper@3.1.11
  - @atlaskit/select@11.0.7
  - @atlaskit/single-select@9.0.1
  - @atlaskit/theme@9.5.1

## 12.1.8

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/single-select@9.0.0
  - @atlaskit/datetime-picker@9.2.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/select@11.0.6

## 12.1.7

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result- Updated dependencies [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5
  - @atlaskit/popper@3.1.9
  - @atlaskit/select@11.0.4

## 12.1.6

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Updates react-popper dependency to a safe version.- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/select@11.0.3
  - @atlaskit/datetime-picker@9.2.3
  - @atlaskit/popper@3.1.8

## 12.1.5

- Updated dependencies [30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):
  - @atlaskit/select@11.0.0
  - @atlaskit/button@13.3.4
  - @atlaskit/datetime-picker@9.2.1

## 12.1.4

### Patch Changes

- [patch][a568ade043](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a568ade043):

  Inline-dialog now correctly removes handlers when closed

## 12.1.3

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 12.1.2

- Updated dependencies [d1444cc6ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d1444cc6ef):
  - @atlaskit/datetime-picker@9.0.0

## 12.1.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 12.1.0

### Minor Changes

- [minor][91b7a1415b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/91b7a1415b):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help products to write better integration and end to end tests.

## 12.0.15

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 12.0.14

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 12.0.13

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 12.0.12

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 12.0.11

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

## 12.0.10

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 12.0.9

### Patch Changes

- [patch][f34776be97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f34776be97):

  Type definition files are now referenced in package.json

## 12.0.8

- Updated dependencies [ebfeb03eb7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebfeb03eb7):
  - @atlaskit/datetime-picker@8.0.11
  - @atlaskit/popper@3.0.0

## 12.0.7

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 12.0.6

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

## 12.0.5

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/datetime-picker@8.0.9
  - @atlaskit/select@10.0.0

## 12.0.4

- Updated dependencies [19d9d0f13f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/19d9d0f13f):
  - @atlaskit/datetime-picker@8.0.8

## 12.0.3

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/datetime-picker@8.0.7
  - @atlaskit/select@9.1.8
  - @atlaskit/single-select@8.0.6
  - @atlaskit/icon@19.0.0

## 12.0.2

### Patch Changes

- [patch][93bcf314c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93bcf314c6):

  Added missing tslib dep

## 12.0.1

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/datetime-picker@8.0.5
  - @atlaskit/select@9.1.5
  - @atlaskit/single-select@8.0.4
  - @atlaskit/icon@18.0.0

## 12.0.0

### Major Changes

- [major][181209d135](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/181209d135):

  - @atlaskit/inline-dialog has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 11.0.1

- [patch][21854842b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21854842b5):

  - Clean couple of TODO's that were already done

## 11.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 10.0.5

- Updated dependencies [8b5f052003](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b5f052003):
  - @atlaskit/datetime-picker@7.0.5
  - @atlaskit/popper@1.0.0

## 10.0.4

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/datetime-picker@7.0.4
  - @atlaskit/icon@16.0.9
  - @atlaskit/popper@0.4.3
  - @atlaskit/select@8.1.1
  - @atlaskit/single-select@7.0.3
  - @atlaskit/theme@8.1.7

## 10.0.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/datetime-picker@7.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/popper@0.4.2
  - @atlaskit/select@8.0.5
  - @atlaskit/single-select@7.0.2
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 10.0.2

- [patch][da6ef8b69a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da6ef8b69a):

  - Using new z-index values from theme

## 10.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/datetime-picker@7.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/popper@0.4.1
  - @atlaskit/select@8.0.3
  - @atlaskit/single-select@7.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 10.0.0

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

## 9.0.15

- Updated dependencies [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/datetime-picker@6.5.1
  - @atlaskit/select@7.0.0

## 9.0.14

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/datetime-picker@6.3.25
  - @atlaskit/select@6.1.19
  - @atlaskit/single-select@6.0.12
  - @atlaskit/icon@16.0.0

## 9.0.13

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/datetime-picker@6.3.21
  - @atlaskit/icon@15.0.2
  - @atlaskit/popper@0.3.6
  - @atlaskit/select@6.1.13
  - @atlaskit/single-select@6.0.11
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 9.0.12

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/datetime-picker@6.3.20
  - @atlaskit/icon@15.0.1
  - @atlaskit/popper@0.3.3
  - @atlaskit/select@6.1.10
  - @atlaskit/single-select@6.0.10
  - @atlaskit/theme@7.0.0

## 9.0.11

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/datetime-picker@6.3.19
  - @atlaskit/select@6.1.9
  - @atlaskit/single-select@6.0.9
  - @atlaskit/icon@15.0.0

## 9.0.10

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/datetime-picker@6.3.18
  - @atlaskit/icon@14.6.1
  - @atlaskit/popper@0.3.2
  - @atlaskit/select@6.1.8
  - @atlaskit/single-select@6.0.8
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 9.0.9

- [patch][d296df8" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d296df8"
  d):

  - Inline-dialog now has useCapture: true for the outside click event listeners to avoid closing when clicking on child content that might disappear, such as a select or dropdown-menu

## 9.0.8

- [patch] Updated dependencies [1a752e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a752e6)
  - @atlaskit/datetime-picker@6.3.13
  - @atlaskit/popper@0.3.0

## 9.0.7

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 9.0.6

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/datetime-picker@6.3.11
  - @atlaskit/select@6.0.2
  - @atlaskit/single-select@6.0.6
  - @atlaskit/icon@14.0.0

## 9.0.5

- [patch] Updated dependencies [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)
  - @atlaskit/datetime-picker@6.3.10
  - @atlaskit/select@6.0.0

## 9.0.4

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 9.0.2

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/single-select@6.0.4
  - @atlaskit/select@5.0.9
  - @atlaskit/icon@13.2.5
  - @atlaskit/datetime-picker@6.3.2
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 9.0.1

- [patch] Added z-index back and fixed onClose [d9a0c62](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9a0c62)
- [none] Updated dependencies [d9a0c62](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9a0c62)

## 9.0.0

- [major] Inline-dialog now uses @atlaskit/popper, and as such some props are no longer required. The "position" prop now matches the "placements" from react-popper to avoid confusion. [1d9e75a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9e75a)

* [none] Updated dependencies [1d9e75a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9e75a)
  - @atlaskit/datetime-picker@6.3.1
  - @atlaskit/popper@0.2.0
* [none] Updated dependencies [a3109d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3109d3)
  - @atlaskit/popper@0.2.0
  - @atlaskit/datetime-picker@6.3.1
* [none] Updated dependencies [87d45d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d45d3)
  - @atlaskit/datetime-picker@6.3.1
  - @atlaskit/popper@0.2.0
* [patch] Updated dependencies [a08b0c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a08b0c2)
  - @atlaskit/popper@0.2.0
  - @atlaskit/datetime-picker@6.3.1

## 8.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/select@5.0.8
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/layer@5.0.4
  - @atlaskit/datetime-picker@6.1.1
  - @atlaskit/icon@13.2.4

## 8.0.3

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/select@5.0.7
  - @atlaskit/icon@13.2.2
  - @atlaskit/single-select@6.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/layer@5.0.3
  - @atlaskit/datetime-picker@6.0.3

## 8.0.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/select@5.0.6
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/layer@5.0.2
  - @atlaskit/datetime-picker@6.0.2
  - @atlaskit/icon@13.2.1

## 8.0.1

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/select@5.0.2
  - @atlaskit/single-select@6.0.1
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1
  - @atlaskit/datetime-picker@6.0.1

## 8.0.0

- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/select@5.0.0
  - @atlaskit/single-select@6.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/datetime-picker@6.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/select@5.0.0
  - @atlaskit/single-select@6.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/datetime-picker@6.0.0
  - @atlaskit/icon@13.0.0

## 7.1.3

- [patch] Fix \$FlowFixMe and release packages [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/select@4.3.1
  - @atlaskit/single-select@5.2.1
  - @atlaskit/button@8.2.2
  - @atlaskit/icon@12.3.1

## 7.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/select@4.2.3
  - @atlaskit/single-select@5.1.2
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/layer@4.0.3
  - @atlaskit/datetime-picker@5.2.1
  - @atlaskit/icon@12.1.2

## 7.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/single-select@5.1.1
  - @atlaskit/select@4.2.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1
  - @atlaskit/layer@4.0.2

## 7.1.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/single-select@5.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/layer@4.0.1
  - @atlaskit/button@8.1.0

## 7.0.2

- [patch] Fix InlineDialog closing on Select option click. Added Select prop onClickPreventDefault which is enabled by default [11accbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11accbd)
- [patch] Updated dependencies [11accbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11accbd)
  - @atlaskit/select@4.1.0

## 7.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/icon@12.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 7.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/icon@12.0.0
  - @atlaskit/single-select@5.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/layer@4.0.0

## 6.0.2

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/single-select@4.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4
  - @atlaskit/layer@3.1.1

## 6.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 5.3.2

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 5.3.1

- [patch] Removed focus ring from inline-dialogs focused via the mouse [a17adde](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a17adde)

## 5.3.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 5.2.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 5.2.1

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 5.2.0

- [minor] Updated inline-dialog to include boundaries element prop, updated Layer to have dynamic boolean escapeWithReference property, updated modal-dialog Content component with overflow-x:hidden' [cb72752](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cb72752)

## 5.1.2

- [patch] Revert name of stateless export to InlineEditStateless [fffacd6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fffacd6)

## 5.1.1

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 5.1.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 5.0.7

- [patch] moved react-dom to peer dependency [214dd1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/214dd1f)

## 5.0.6

- [patch] migrated inline dialog from ak to mk2 [9feaa91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9feaa91)

## 5.0.5 (2017-11-24)

- bug fix; prevent inline-dialog from closing when event is prevented and prevent default for c (issues closed: ak-3870) ([8ae0c3b](https://bitbucket.org/atlassian/atlaskit/commits/8ae0c3b))

## 5.0.4 (2017-10-26)

- bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 5.0.3 (2017-10-22)

- bug fix; update styled component dependency and react peerDep ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))

## 5.0.2 (2017-10-03)

- bug fix; refactored how inline-dialog handles max-width in order to better support scrollable ([20b62a6](https://bitbucket.org/atlassian/atlaskit/commits/20b62a6))

## 5.0.1 (2017-08-21)

- bug fix; fix PropTypes warning ([040d579](https://bitbucket.org/atlassian/atlaskit/commits/040d579))

## 5.0.0 (2017-08-11)

- bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
- bug fix; inline-dialog: fix vertical padding ([49d8c5d](https://bitbucket.org/atlassian/atlaskit/commits/49d8c5d))
- bug fix; inline-dialog: updates from design review ([ff38fa2](https://bitbucket.org/atlassian/atlaskit/commits/ff38fa2))
- breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))

## 4.0.0 (2017-08-11)

- bug fix; inline-dialog: fix vertical padding ([49d8c5d](https://bitbucket.org/atlassian/atlaskit/commits/49d8c5d))
- bug fix; inline-dialog: updates from design review ([ff38fa2](https://bitbucket.org/atlassian/atlaskit/commits/ff38fa2))
- breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))

## 3.6.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.6.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.3.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))
- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.2.1 (2017-07-13)

- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

## 3.2.0 (2017-05-16)

- feature; bumping util-shared-styles in inline-dialog ([429e23a](https://bitbucket.org/atlassian/atlaskit/commits/429e23a))

## 3.1.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 3.1.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 3.1.0 (2017-04-18)

- feature; allow inline dialog to be closed via document click ([bdc7dc5](https://bitbucket.org/atlassian/atlaskit/commits/bdc7dc5))
- breaking; added ReactDOM as a peerDependency
- ISSUES CLOSED: AK-2069

## 2.0.0 (2017-03-31)

- refactor the inline-dialog component to use styled-components ([85294ec](https://bitbucket.org/atlassian/atlaskit/commits/85294ec))
- feature; Allow an array of positions to be passed to the shouldFlip property ([1a2a3f6](https://bitbucket.org/atlassian/atlaskit/commits/1a2a3f6))
- breaking; added peerDependency "styled-components”
- ISSUES CLOSED: AK-1988, AK-1996

## 1.1.0 (2017-03-28)

- feature; add onContentClick property to inline-dialog ([ff7404e](https://bitbucket.org/atlassian/atlaskit/commits/ff7404e))
- feature; add onContentFocus and onContentBlur properties to inline-dialog ([9cc1663](https://bitbucket.org/atlassian/atlaskit/commits/9cc1663))

## 1.0.7 (2017-03-23)

- fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.0.5 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.4 (2017-02-20)

- fix; use correctly scoped package names in npm docs ([91dbd2f](https://bitbucket.org/atlassian/atlaskit/commits/91dbd2f))

## 1.0.3 (2017-02-09)

- fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.0.2 (2017-02-07)

- fix; allow inline dialog trigger to take full width ([38325fc](https://bitbucket.org/atlassian/atlaskit/commits/38325fc))

## 1.0.1 (2017-02-06)

- fix; Updates package to use scoped ak packages ([38fca7c](https://bitbucket.org/atlassian/atlaskit/commits/38fca7c))
