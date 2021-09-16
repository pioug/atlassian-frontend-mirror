# @atlaskit/dynamic-table

## 14.3.2

### Patch Changes

- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Internal changes to remove `@atlaskit/theme/math` usage.
- Updated dependencies

## 14.3.1

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 14.3.0

### Minor Changes

- [`7da3e890032`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7da3e890032) - [ux] `highlightedRowIndex` now can be a list of numbers (`number[]`), as well as `number`. Also highlighted rows now have B50/B75 colour.
- [`aa66648082f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa66648082f) - Add support for aria attributes on the table

### Patch Changes

- [`bf041942c3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf041942c3a) - Added styles to `HeadCell` to be visible when windows high contrast mode is turned on.

## 14.2.3

### Patch Changes

- [`cbd4258c692`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cbd4258c692) - Update the `rows` prop types to extend HTML table row props

## 14.2.2

### Patch Changes

- Updated dependencies

## 14.2.1

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.

## 14.2.0

### Minor Changes

- [`cd41357bdb0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd41357bdb0) - Added total number of records for paginated data set to be passed as an optional prop

### Patch Changes

- [`952019cfd39`](https://bitbucket.org/atlassian/atlassian-frontend/commits/952019cfd39) - Removed extraneous/unnecessary dependencies for design system components.

## 14.1.5

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 14.1.4

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 14.1.3

### Patch Changes

- Updated dependencies

## 14.1.2

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 14.1.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 14.1.0

### Minor Changes

- [`dff687b37a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dff687b37a) - Expose onKeyPress prop for dynamic-table and use it to show mediaViewer
- [`e9a1942ae0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9a1942ae0) - Set the attribute `data-testid` on the loading spinners. The convention follows the existing \${testId}--loadingSpinner.

### Patch Changes

- [`930e4aea2b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/930e4aea2b) - fix a bug where DynamicTable is used with Suspense

## 14.0.1

### Patch Changes

- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 14.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 13.7.9

### Patch Changes

- [`e8b1104637`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8b1104637) - Previously when sorting the rows weren’t using a stable key - thus they would re-mount unexpectedly! This has been fixed now.
- [`3cac2203ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cac2203ba) - Previously, sorting columns in dynamic table wouldn’t persist the page when table was updated, Now user will be able to apply sorting on dynamic table and page will be remain same even after updating table

## 13.7.8

### Patch Changes

- Updated dependencies

## 13.7.7

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 13.7.6

### Patch Changes

- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies
- [`baaad91b65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/baaad91b65) - Updated to use the latest and more performant version of `@atlaskit/avatar`
- Updated dependencies

## 13.7.5

### Patch Changes

- Updated dependencies

## 13.7.4

### Patch Changes

- [patch][dfc4dba1b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfc4dba1b3):

  Change imports to comply with Atlassian conventions- Updated dependencies [9e4b195732](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e4b195732):

- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [167a55fd7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/167a55fd7a):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
- Updated dependencies [7a2540821c](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a2540821c):
  - @atlaskit/toggle@8.1.7
  - @atlaskit/button@13.3.11
  - @atlaskit/avatar@17.1.10
  - @atlaskit/webdriver-runner@0.3.4
  - @atlaskit/dropdown-menu@9.0.3

## 13.7.3

### Patch Changes

- [patch][109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):

  Deletes internal package @atlaskit/type-helpers and removes all usages. @atlaskit/type-helpers has been superseded by native typescript helper utilities.- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10

## 13.7.2

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/avatar@17.1.9
  - @atlaskit/button@13.3.9
  - @atlaskit/dropdown-menu@9.0.2
  - @atlaskit/spinner@12.1.6
  - @atlaskit/toggle@8.1.6

## 13.7.1

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/avatar@17.1.8
  - @atlaskit/button@13.3.8
  - @atlaskit/dropdown-menu@9.0.1
  - @atlaskit/spinner@12.1.5
  - @atlaskit/toggle@8.1.5

## 13.7.0

### Minor Changes

- [minor][0b09f8a6ca](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b09f8a6ca):

  add focus style using blue outline

### Patch Changes

- Updated dependencies [9e87af4685](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e87af4685):
  - @atlaskit/dropdown-menu@9.0.0

## 13.6.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/avatar@17.1.7
  - @atlaskit/button@13.3.7
  - @atlaskit/dropdown-menu@8.2.4
  - @atlaskit/pagination@12.0.19
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/toggle@8.1.4
  - @atlaskit/type-helpers@4.2.3

## 13.6.1

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result- Updated dependencies [6dccb16bfc](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dccb16bfc):

- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/toggle@8.1.3
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5
  - @atlaskit/pagination@12.0.17
  - @atlaskit/spinner@12.1.3
  - @atlaskit/dropdown-menu@8.2.2

## 13.6.0

### Minor Changes

- [minor][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Moving to react-beautiful-dnd 12.x internally. No API changes

### Patch Changes

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/avatar@17.1.5

## 13.5.1

### Patch Changes

- [patch][d222c2b987](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d222c2b987):

  Theme has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided.

  ### Breaking

  ** getTokens props changes **
  When defining the value function passed into a ThemeProvider, the getTokens parameter cannot be called without props; if no props are provided an empty object `{}` must be passed in:

  ```javascript
  <CustomTheme.Provider
    value={t => ({ ...t(), backgroundColor: '#333'})}
  >
  ```

  becomes:

  ```javascript
  <CustomTheme.Provider
    value={t => ({ ...t({}), backgroundColor: '#333'})}
  >
  ```

  ** Color palette changes **
  Color palettes have been moved into their own file.
  Users will need to update imports from this:

  ```javascript
  import { colors } from '@atlaskit/theme';

  colors.colorPalette('8');
  ```

  to this:

  ```javascript
  import { colorPalette } from '@atlaskit/theme';

  colorPalette.colorPalette('8');
  ```

  or for multi entry-point users:

  ```javascript
  import * as colors from '@atlaskit/theme/colors';

  colors.colorPalette('8');
  ```

  to this:

  ```javascript
  import * as colorPalettes from '@atlaskit/theme/color-palette';

  colorPalettes.colorPalette('8');
  ```

## 13.5.0

### Minor Changes

- [minor][19e5d77c84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/19e5d77c84):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help products to write better integration and end to end tests.

## 13.4.0

### Minor Changes

- [minor][97a4a48f58](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97a4a48f58):

  - use more obvious hover background color for highlighted row
  - add onClick into RowType typing and add examples of its usage

## 13.3.3

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 13.3.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 13.3.1

### Patch Changes

- [patch][8a244b1dfd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a244b1dfd):

  DynamicTable Stateful now sends analytics events via the onSort prop

## 13.3.0

### Minor Changes

- [minor][565e5c71db](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/565e5c71db):

  Add ability to highlight a row in the table based on the index (0 based index) of the current visible page.

## 13.2.1

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/dropdown-menu@8.1.1
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 13.2.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 13.1.13

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 13.1.12

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 13.1.11

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 13.1.10

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 13.1.9

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

## 13.1.8

### Patch Changes

- [patch][60e3ba3eed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60e3ba3eed):

  Made table headers accessible and sortable with keyboard

## 13.1.7

- Updated dependencies [7e9d653278](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e9d653278):
  - @atlaskit/avatar@16.0.8
  - @atlaskit/toggle@8.0.0

## 13.1.6

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 13.1.5

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 13.1.4

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 13.1.3

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

## 13.1.2

### Patch Changes

- [patch][29a1f158c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29a1f158c1):

  Use default react import in typescript files.

## 13.1.1

### Patch Changes

- [patch][93bcf314c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93bcf314c6):

  Added missing tslib dep

## 13.1.0

- [minor][647118a5ce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/647118a5ce):

  - Added onPageRowUpdate function prop to dynamic table to be passed the currently shown table items and moved validateSortKey from the deprecated componentWillMount and componentWillRecieveProps to getDerivedStateFromProps

## 13.0.2

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 13.0.1

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
- Updated dependencies [8c65f23d32](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c65f23d32):
  - @atlaskit/button@13.0.4
  - @atlaskit/spinner@12.0.0
  - @atlaskit/pagination@12.0.0

## 13.0.0

- [major][3d95467c4b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d95467c4b):

  - Dynamic table has been internally converted to TypeScript.
  - Drops Flow support.
  - TypeScript consumers will get static type safety.
  - No longer falls back to cell.content for ordering when cell.key is not provided. When cell.key is not provided, it will now preserve original ordering, while still respecting sort order (i.e. ASC and DESC).
  - No other API or behavioural changes.

## 12.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 11.0.4

- [patch][08321f585d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08321f585d):

  - Internal changes only. Makes DynamicTable compatible with SSR.

## 11.0.3

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/button@12.0.3
  - @atlaskit/dropdown-menu@7.0.6
  - @atlaskit/pagination@10.0.4
  - @atlaskit/spinner@10.0.7
  - @atlaskit/toggle@6.0.4
  - @atlaskit/theme@8.1.7

## 11.0.2

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/avatar@15.0.3
  - @atlaskit/dropdown-menu@7.0.4
  - @atlaskit/pagination@10.0.3
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/toggle@6.0.3
  - @atlaskit/button@12.0.0

## 11.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/avatar@15.0.1
  - @atlaskit/dropdown-menu@7.0.1
  - @atlaskit/pagination@10.0.1
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/toggle@6.0.1
  - @atlaskit/button@11.0.0

## 11.0.0

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

## 10.0.23

- [patch][d026472527](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d026472527):

  - Sorting behaviour fixed for integers. New behaviour groups datatypes with integers first, then strings, then other values, and sorting is performed within those groups.
  - Fixed sorting for strings; lowercase, uppercase and accented characters will be treated as equivalent.

## 10.0.22

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/avatar@14.1.7
  - @atlaskit/button@10.1.1
  - @atlaskit/dropdown-menu@6.1.25
  - @atlaskit/pagination@9.0.1
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/toggle@5.0.14
  - @atlaskit/docs@6.0.0

## 10.0.21

- Updated dependencies [1a09599](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a09599):
  - @atlaskit/pagination@9.0.0

## 10.0.20

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/dropdown-menu@6.1.24
  - @atlaskit/pagination@8.0.8
  - @atlaskit/spinner@9.0.12
  - @atlaskit/toggle@5.0.13
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6

## 10.0.19

- [patch][492b8ea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/492b8ea):

  - Added `colspan` to cell type. Added example using `colspan`.

## 10.0.18

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/avatar@14.1.4
  - @atlaskit/dropdown-menu@6.1.22
  - @atlaskit/pagination@8.0.6
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/toggle@5.0.11
  - @atlaskit/button@10.0.0

## 10.0.17

- [patch][abd3a39](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abd3a39):

  - Bump react-beautiful-dnd dependency to v10.0.2

## 10.0.16

- [patch][85b3592](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85b3592):

  - Passes analytics event through onSetPage prop when pagination component is clicked on

## 10.0.15

- [patch] Fixing blank state for datetime-picker in Firefox. [0e6d838](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e6d838)

## 10.0.14

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 10.0.13

- [patch] Added space of 3x gridSize between table and pagination component [83a3471](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83a3471)
- [patch] Updated dependencies [8276156](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8276156)
  - @atlaskit/pagination@8.0.0

## 10.0.12

- [patch] Pulling the shared styles from @atlaskit/theme and removed dependency on util-shraed-styles [7d51a09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d51a09)

## 10.0.11

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 10.0.9

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/toggle@5.0.6
  - @atlaskit/spinner@9.0.6
  - @atlaskit/dropdown-menu@6.1.8
  - @atlaskit/button@9.0.6
  - @atlaskit/avatar@14.0.8
  - @atlaskit/docs@5.0.6

## 10.0.8

- [patch] Bumping react-beautiful-dnd to version 9. Making use of use onBeforeDragStart for dynamic table [9cbd494](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cbd494)
- [none] Updated dependencies [9cbd494](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cbd494)

## 10.0.7

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/toggle@5.0.5
  - @atlaskit/pagination@7.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/dropdown-menu@6.1.5
  - @atlaskit/avatar@14.0.6

## 10.0.6

- [patch] Bumping react-beautiful-dnd to 8.0.7 to fix timing issue with onDragStart [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)

## 10.0.5

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/toggle@5.0.4
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/pagination@7.0.3
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/dropdown-menu@6.1.4
  - @atlaskit/avatar@14.0.5

## 10.0.4

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/toggle@5.0.3
  - @atlaskit/pagination@7.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/spinner@9.0.3
  - @atlaskit/dropdown-menu@6.1.3
  - @atlaskit/avatar@14.0.4

## 10.0.3

- [patch] Upgrading react-beautiful-dnd to 8.0.1 [87cd977](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87cd977)
- [patch] Upgrading react-beautiful-dnd to 8.0.0 [22efc08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22efc08)
- [none] Updated dependencies [87cd977](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87cd977)
- [none] Updated dependencies [22efc08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22efc08)

## 10.0.2

- [patch] Upgrading react-beautiful-dnd to 8.0.5 [6052132](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6052132)
- [none] Updated dependencies [6052132](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6052132)

## 10.0.1

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/toggle@5.0.1
  - @atlaskit/pagination@7.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/spinner@9.0.2
  - @atlaskit/docs@5.0.1
  - @atlaskit/dropdown-menu@6.1.2
  - @atlaskit/avatar@14.0.2

## 10.0.0

- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/pagination@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/dropdown-menu@6.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/pagination@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/dropdown-menu@6.0.0
  - @atlaskit/avatar@14.0.0

## 9.2.6

- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/button@8.2.5
  - @atlaskit/dropdown-menu@5.2.3
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/button@8.2.5
  - @atlaskit/dropdown-menu@5.2.3

## 9.2.5

- [patch] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0
  - @atlaskit/dropdown-menu@5.2.2

## 9.2.4

- [patch] Remove or update \$FlowFixMe [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/button@8.2.4
  - @atlaskit/dropdown-menu@5.2.1
  - @atlaskit/avatar@11.2.2

## 9.2.3

- [patch] Button should be a dev dependency [50ca31b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ca31b)
- [none] Updated dependencies [50ca31b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ca31b)

## 9.2.2

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/button@8.2.3

## 9.2.1

- [patch] Upgrading react-beautiful-dnd dependency to ^7.1.3 [024b7fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/024b7fb)
- [none] Updated dependencies [024b7fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/024b7fb)

## 9.2.0

- [minor] Fixes types for Flow 0.74 [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [none] Updated dependencies [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
  - @atlaskit/button@8.2.0
  - @atlaskit/spinner@7.1.0
  - @atlaskit/dropdown-menu@5.1.0
  - @atlaskit/avatar@11.2.0

## 9.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/button@8.1.2
  - @atlaskit/toggle@4.0.3
  - @atlaskit/theme@4.0.4
  - @atlaskit/spinner@7.0.2
  - @atlaskit/pagination@6.0.5
  - @atlaskit/dropdown-menu@5.0.4

## 9.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/spinner@7.0.1
  - @atlaskit/dropdown-menu@5.0.3
  - @atlaskit/button@8.1.1
  - @atlaskit/pagination@6.0.4
  - @atlaskit/avatar@11.1.1
  - @atlaskit/docs@4.1.1

## 9.1.0

- [minor] Update examples [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/dropdown-menu@5.0.2
  - @atlaskit/avatar@11.1.0
  - @atlaskit/toggle@4.0.2
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/pagination@6.0.3
  - @atlaskit/button@8.1.0

## 9.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/toggle@4.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/spinner@6.0.1
  - @atlaskit/pagination@6.0.1
  - @atlaskit/docs@4.0.1
  - @atlaskit/dropdown-menu@5.0.1
  - @atlaskit/avatar@11.0.1

## 9.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/toggle@4.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/pagination@6.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/dropdown-menu@5.0.0
  - @atlaskit/avatar@11.0.0

## 8.1.0

- [minor] Add paginationi18n prop to dynamic-table which passes this to the i18n of its pagination component [08054b1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08054b1)

## 8.0.3

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/toggle@3.0.2
  - @atlaskit/dropdown-menu@4.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/pagination@5.0.1
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4

## 8.0.1

- [patch] Remove unused dependencies [3cfb3fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3cfb3fe)

## 8.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 7.2.2

- [patch] Combines stateless and stateful components into one. Deletes stateless export. Renames pagination props. [a4b6c86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4b6c86)

## 7.2.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 7.2.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 7.1.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 7.1.1

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 7.1.0

- [minor] Added possibility to drag and drop rows in dynamic table. [e69e6f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e69e6f4)

## 7.0.1

- [patch] package bump to resolve discrepencies with npm [be745da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be745da)

## 6.2.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 6.1.5

- [patch] Fix manual bump bug from migration [fefd96c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fefd96c)

## 7.0.0

- There were no major changes in this release.

## 6.1.4

- [patch] fix examples so that name is truly sortable, resolve prop error, fix rowCellType key prop type [e5981fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e5981fb)

## 6.1.3

- [patch] Migrate dynamic-table to ak-mk-2 repo [8402863](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8402863)

## 6.1.2 (2017-12-07)

- bug fix; add story to demonstrate toggling pagination (issues closed: ak-3052) ([3f66ce8](https://bitbucket.org/atlassian/atlaskit/commits/3f66ce8))

## 6.1.1 (2017-11-15)

- bug fix; bumping internal dependencies to the latest major versions ([dd59c0a](https://bitbucket.org/atlassian/atlaskit/commits/dd59c0a))

## 6.1.0 (2017-11-13)

- feature; add a loading state to the dynamic table ([08974ae](https://bitbucket.org/atlassian/atlaskit/commits/08974ae))

## 6.0.2 (2017-10-26)

- bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 6.0.1 (2017-10-22)

- bug fix; update dependencies for react-16 ([077d1ad](https://bitbucket.org/atlassian/atlaskit/commits/077d1ad))

## 6.0.0 (2017-08-11)

- bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
- breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))

## 5.0.0 (2017-08-11)

- breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))

## 4.5.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 4.5.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 4.2.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 4.2.0 (2017-07-17)

- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 4.1.0 (2017-07-12)

- fix; removes rowIndex prop from body render method ([9394455](https://bitbucket.org/atlassian/atlaskit/commits/9394455))

## 4.0.1 (2017-07-10)

- fix; fixes '0' being displayed when rows prop is empty array ([8ce1453](https://bitbucket.org/atlassian/atlaskit/commits/8ce1453))
- fix; fixes react console error by adding key prop to TableRow in render method of Body ([c2e08cb](https://bitbucket.org/atlassian/atlaskit/commits/c2e08cb))
- feature; updates pagination dependency to 3.1.0 to get ellipsis when there are lots of pages ([391db73](https://bitbucket.org/atlassian/atlaskit/commits/391db73))

## 4.0.0 (2017-07-03)

- fix; updates dynamic-table to always display table header ([ee35148](https://bitbucket.org/atlassian/atlaskit/commits/ee35148))
- fix; updates dynamic-table to have headerless emptyView ([aa87745](https://bitbucket.org/atlassian/atlaskit/commits/aa87745))
- fix; updates tests to check against Component not string ([a91743b](https://bitbucket.org/atlassian/atlaskit/commits/a91743b))
- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- updates description for dynamic-table stories ([bde2081](https://bitbucket.org/atlassian/atlaskit/commits/bde2081))
- breaking; Table will now render the Header by default, even if no rows are displayed

## 3.0.0 (2017-05-24)

- refactor dynamic-table as part of styled-components refactor ([3f52aff](https://bitbucket.org/atlassian/atlaskit/commits/3f52aff))
- breaking; DynamicTable export renamed to DynamicTableStateless, for consistency with other packages.
- ISSUES CLOSED: #AK-2385

## 2.1.5 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 2.1.4 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 2.1.3 (2017-03-23)

- fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 2.1.1 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 2.1.0 (2017-03-08)

- feature; use createError helper function from util-common package ([3466262](https://bitbucket.org/atlassian/atlaskit/commits/3466262))

## 2.0.1 (2017-03-08)

- fix; import DynamicTable from its own package ([61f6e86](https://bitbucket.org/atlassian/atlaskit/commits/61f6e86))

## 1.0.0 (2017-03-07)

- fix; pR suggestions ([aee611e](https://bitbucket.org/atlassian/atlaskit/commits/aee611e))
- feature; dynamicTable component ([9861b3e](https://bitbucket.org/atlassian/atlaskit/commits/9861b3e))
