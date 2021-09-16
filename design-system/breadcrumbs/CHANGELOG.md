# @atlaskit/breadcrumbs

## 11.3.4

### Patch Changes

- Updated dependencies

## 11.3.3

### Patch Changes

- Updated dependencies

## 11.3.2

### Patch Changes

- Updated dependencies

## 11.3.1

### Patch Changes

- Updated dependencies

## 11.3.0

### Minor Changes

- [`c37fc2898ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c37fc2898ff) - [ux] Colors now sourced from tokens.

### Patch Changes

- [`0d0ecc6e790`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d0ecc6e790) - Corrects eslint supressions.
- [`9a84a3ceb82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a84a3ceb82) - Internal code changes.
- Updated dependencies

## 11.2.6

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 11.2.5

### Patch Changes

- [`d797e84b724`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d797e84b724) - SPFE-561: Update the `react-loosely-lazy` dependency. The previous version was using a broken ESM build.
- Updated dependencies

## 11.2.4

### Patch Changes

- [`cecc3efb15d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cecc3efb15d) - Added the design-system tech stacks to the package.json and fixed linting errors, also disabled some linting rules to prevent breaking changes

## 11.2.3

### Patch Changes

- [`139a522574f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/139a522574f) - Change selector for checking if breadcrumbs where clicked with click-area-helper

## 11.2.2

### Patch Changes

- [`5d7f119c55d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d7f119c55d) - Fix bread crumb issue

## 11.2.1

### Patch Changes

- [`5e221ab3244`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e221ab3244) - Added the `design-system` tech stacks to the `package.json`
- [`910c5ba2052`](https://bitbucket.org/atlassian/atlassian-frontend/commits/910c5ba2052) - Breadcrumbs component now correctly forwards ref.

## 11.2.0

### Minor Changes

- [`b5bbdf4acb3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5bbdf4acb3) - [ux] Added an 'ellipsisLabel' prop to the Breadcrumbs component. This text is passed to the aria-label attribute on the ellipsis button (conditionally rendered when there are many items).

### Patch Changes

- Updated dependencies

## 11.1.0

### Minor Changes

- [`81020d0b345`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81020d0b345) - [ux] Wrapped breadcrumbs into nav tag; added label props that is used as aria-label of nav wrapper.

## 11.0.3

### Patch Changes

- [`b7c722cb270`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7c722cb270) - The `react-loosely-lazy` dependency has been upgraded to `v0.4.4`.
- Updated dependencies

## 11.0.2

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.

## 11.0.1

### Patch Changes

- [`a0c2212596a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a0c2212596a) - Adds a build time flag that lets consumers drop tooltips from their SSR bundles

## 11.0.0

### Major Changes

- [`3f80f8a2e4b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f80f8a2e4b) - In this version we made breadcrumbs dramatically faster, lighter and easier to use 🤩

  - BreadcrumbsStateless has been merged into the default export
  - Performance improvements
  - Faster internal analytics

  **Migrating from BreadcrumbsStateless**

  When needing to control breadcrumbs you can 1:1 replace the component with the default export from breadcrumbs.

  ```diff
  -import { BreadcrumbsStateless } from '@atlaskit/breadcrumbs';
  +import Breadcrumbs from '@atlaskit/breadcrumbs';

  -<BreadcrumbsStateless isExpanded />
  +<Breadcrumbs isExpanded />
  ```

  When `isExpanded` is provided, the component will act controlled, otherwise uncontrolled.

  **Upgrading with the codemod**

  There exists a codemod to help you upgrade. Make sure to be on the latest version of breadcrumbs before running.

  ```
  yarn upgrade @atlaskit/breadcrumbs@latest
  ```

  Then you can use our cli tool to run the codemod:

  ```
  npx @atlaskit/codemod-cli /path/to/target/directory --parser [tsx | flow | babel]
  ```

  And then follow the prompts to select the breadcrumbs codemod.

## 10.1.0

### Minor Changes

- [`4f9e6e2db5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f9e6e2db5) - These packages now have defined entry points -- this means that you cannot access internal files in the packages that are not meant to be public. Sub-components in these packages have been explicitly defined, aiding tree-shaking and reducing bundle size.

## 10.0.12

### Patch Changes

- [`4f2b2b5750`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f2b2b5750) - Internal change from class to function components

  - converted all the class component in the package to function
  - started to use `usePlatformLeafEventHandler` to replace HOCs from `analytics-next`
  - added more visual regression tests

- [`25e8b332bf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/25e8b332bf) - replaced styled-components to emotion
- [`30360b3d28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30360b3d28) - Internal change from class to function components

## 10.0.11

### Patch Changes

- [`9a403ed9b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a403ed9b2) - Fix slash color and font color in dark mode for breadcrumbs

## 10.0.10

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 10.0.9

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 10.0.8

### Patch Changes

- Updated dependencies

## 10.0.7

### Patch Changes

- [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo analytics-next file restructure to allow external ts definitions to continue working

## 10.0.6

### Patch Changes

- Updated dependencies

## 10.0.5

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 10.0.4

### Patch Changes

- Updated dependencies

## 10.0.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 10.0.2

### Patch Changes

- [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme and package information has been updated to point to the new design system website.

## 10.0.1

### Patch Changes

- [`7d6718c600`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d6718c600) - Fix Breadcrumbs font-weight to 400

## 10.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 9.2.11

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 9.2.10

### Patch Changes

- Updated dependencies

## 9.2.9

### Patch Changes

- [patch][71c1de8ee1](https://bitbucket.org/atlassian/atlassian-frontend/commits/71c1de8ee1):

  Change imports to comply with Atlassian conventions- Updated dependencies [3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):

- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [f6667f2909](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6667f2909):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/tooltip@15.2.6
  - @atlaskit/button@13.3.11
  - @atlaskit/select@11.0.10
  - @atlaskit/logo@12.3.4
  - @atlaskit/webdriver-runner@0.3.4

## 9.2.8

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/logo@12.3.3
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/button@13.3.9
  - @atlaskit/select@11.0.9
  - @atlaskit/tooltip@15.2.5

## 9.2.7

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/select@11.0.8
  - @atlaskit/tooltip@15.2.4

## 9.2.6

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/logo@12.3.2
  - @atlaskit/select@11.0.7
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3

## 9.2.5

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):

- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5
  - @atlaskit/select@11.0.4
  - @atlaskit/tooltip@15.2.1

## 9.2.4

### Patch Changes

- [patch][30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):

  @atlaskit/select has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 9.2.3

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

## 9.2.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 9.2.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 9.2.0

### Minor Changes

- [minor][2bbf7bc470](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2bbf7bc470):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help products to write better integration and end to end tests.

## 9.1.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 9.0.12

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 9.0.11

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 9.0.10

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 9.0.9

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 9.0.8

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

## 9.0.7

### Patch Changes

- [patch][f34776be97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f34776be97):

  Type definition files are now referenced in package.json

## 9.0.6

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 9.0.5

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

## 9.0.4

### Patch Changes

- [patch][29a1f158c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29a1f158c1):

  Use default react import in typescript files.

## 9.0.3

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/button@13.0.11
  - @atlaskit/logo@12.1.1
  - @atlaskit/select@10.0.0

## 9.0.2

### Patch Changes

- [patch][93bcf314c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93bcf314c6):

  Added missing tslib dep

## 9.0.1

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/select@9.1.6
  - @atlaskit/tooltip@15.0.0

## 9.0.0

### Major Changes

- [major][52b15f57d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/52b15f57d3):

  - @atlaskit/breadcrumbs has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 8.0.1

- Updated dependencies [4b07b57640](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b07b57640):
  - @atlaskit/button@13.0.2
  - @atlaskit/select@9.1.1
  - @atlaskit/logo@12.0.0

## 8.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 7.0.4

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/logo@10.0.4
  - @atlaskit/select@8.1.1
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 7.0.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/logo@10.0.3
  - @atlaskit/select@8.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/button@12.0.0

## 7.0.2

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

## 7.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/logo@10.0.1
  - @atlaskit/select@8.0.3
  - @atlaskit/theme@8.0.1
  - @atlaskit/tooltip@13.0.1
  - @atlaskit/button@11.0.0

## 7.0.0

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

## 6.0.15

- Updated dependencies [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/logo@9.2.7
  - @atlaskit/select@7.0.0

## 6.0.14

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/logo@9.2.6
  - @atlaskit/select@6.1.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/docs@6.0.0

## 6.0.13

- [patch][c87112f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c87112f):

  - Breadcrumbs items no longer have unnecessary indent on the first item

## 6.0.12

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/logo@9.2.5
  - @atlaskit/select@6.1.10
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/theme@7.0.0

## 6.0.11

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/logo@9.2.4
  - @atlaskit/select@6.1.8
  - @atlaskit/theme@6.2.1
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/button@10.0.0

## 6.0.10

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 6.0.9

- [patch] Updated dependencies [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)
  - @atlaskit/select@6.0.0

## 6.0.8

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 6.0.6

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/select@5.0.9
  - @atlaskit/icon@13.2.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 6.0.5

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/select@5.0.8
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/icon@13.2.4

## 6.0.4

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/select@5.0.7
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2

## 6.0.3

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/tooltip@12.0.3
  - @atlaskit/select@5.0.6
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/icon@13.2.1

## 6.0.2

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/tooltip@12.0.1
  - @atlaskit/select@5.0.2
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1

## 6.0.1

- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/select@5.0.1
  - @atlaskit/icon@13.1.1

## 6.0.0

- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/select@5.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/select@5.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0

## 5.1.3

- [patch] Update flow type for breadcrumbs item to be Element type [6b40dc6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6b40dc6)

## 5.1.2

- [patch] Remove or update \$FlowFixMe [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/button@8.2.4
  - @atlaskit/icon@12.6.1

## 5.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/select@4.2.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 5.1.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/select@4.2.0
  - @atlaskit/tooltip@10.2.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/button@8.1.0

## 5.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/tooltip@10.0.1
  - @atlaskit/select@4.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 5.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/select@4.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 4.1.3

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/select@3.0.2
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 4.1.2

- [patch] Updated dependencies [d05b9e5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d05b9e5)
  - @atlaskit/select@3.0.0

## 4.1.0

- [minor] Added two new props: `itemsBeforeCollapse` and `itemsAfterCollapse`. With these, you can control how many items are displayed before and after the ellipsis in breadcrumbs' collapsed state. The default for both of these is one, meaning that the base behaviour is unchanged. [58bd739](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58bd739)

## 4.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 3.3.2

- [patch] Makes packages Flow types compatible with version 0.67 [25daac0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25daac0)

## 3.3.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 3.3.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 3.2.2

- [patch] Remove babel-plugin-react-flow-props-to-prop-types [06c1f08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c1f08)

## 3.2.1

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 3.2.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 3.1.10

- [patch] Update types [2fe5453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2fe5453)

## 3.1.8

- [patch] update flow dep, fix flow errors [722ad83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/722ad83)
- [patch] update flow dep, fix flow errors [722ad83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/722ad83)

## 3.1.4

- [patch] Migrated page-header to mk2. Fixed breadcrumbs main entry point [51bf0c7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51bf0c7)
- [patch] add index to breadcrumbs root [32594e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/32594e1)

## 3.1.1 (2017-11-21)

- bug fix; bumping internal dependencies to the latest major version ([f996668](https://bitbucket.org/atlassian/atlaskit/commits/f996668))

## 3.1.0 (2017-11-03)

- feature; breadcrumbsItem supports a custom component (issues closed: ak-3721) ([14fdedf](https://bitbucket.org/atlassian/atlaskit/commits/14fdedf))

## 3.0.3 (2017-10-31)

- bug fix; update button dep ([069d0f4](https://bitbucket.org/atlassian/atlaskit/commits/069d0f4))

## 3.0.2 (2017-10-26)

- bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 3.0.1 (2017-10-22)

- bug fix; update dependencies for react-16 ([077d1ad](https://bitbucket.org/atlassian/atlaskit/commits/077d1ad))

## 3.0.0 (2017-10-20)

- breaking; By default, breadcrumbs will not truncate unless they are of greater width than the container. ([5b9099c](https://bitbucket.org/atlassian/atlaskit/commits/5b9099c))
- breaking; update breadcrumbs to have setable truncationWidth (issues closed: #ak-3451, #ak-3555) ([5b9099c](https://bitbucket.org/atlassian/atlaskit/commits/5b9099c))
- bug fix; make breadcrumb max-width important (issues closed: #ak-3541) ([e804650](https://bitbucket.org/atlassian/atlaskit/commits/e804650))

## 2.5.2 (2017-09-13)

- bug fix; update breadcrumb dependencies ([784b7ee](https://bitbucket.org/atlassian/atlaskit/commits/784b7ee))

## 2.5.1 (2017-08-21)

- bug fix; fix PropTypes warning ([040d579](https://bitbucket.org/atlassian/atlaskit/commits/040d579))

## 2.5.0 (2017-08-17)

- feature; adds an onClick prop to the BreadcrumbsItem component. (issues closed: ak-3259) ([61fee5a](https://bitbucket.org/atlassian/atlaskit/commits/61fee5a))

## 2.4.3 (2017-08-11)

- bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))

## 2.4.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 2.4.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 2.1.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 2.1.0 (2017-07-17)

- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 2.0.2 (2017-05-26)

- fix; fix for empty children have separators ([b01fd7b](https://bitbucket.org/atlassian/atlaskit/commits/b01fd7b))
- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

## 2.0.1 (2017-05-25)

- fix; don't render empty children as breadcrumbs ([f68c36d](https://bitbucket.org/atlassian/atlaskit/commits/f68c36d))

## 2.0.0 (2017-05-25)

- refactored breadcrumbs to use styled-components ([c5c31b6](https://bitbucket.org/atlassian/atlaskit/commits/c5c31b6))
- breaking; Now exports default (Breadcrumbs), BreadcrumbsStateless and BreadcrumbsItem, rather than default, AkBreadcrumbs and AkBreadcrumbsItem

- ISSUES CLOSED: AK-2161, AK-2425

## 1.1.3 (2017-05-15)

- fix; pass target prop to Button ([23f0de7](https://bitbucket.org/atlassian/atlaskit/commits/23f0de7))
- fix; testing releasing more than 5 packages at a time ([e69b832](https://bitbucket.org/atlassian/atlaskit/commits/e69b832))

## 1.1.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 1.1.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 1.1.0 (2017-04-20)

- feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 1.0.8 (2017-04-04)

- fix; adds defensive code to allow testing in mocha/jsdom, re-enables some tests ([a7c1b7a](https://bitbucket.org/atlassian/atlaskit/commits/a7c1b7a))
- fix; fixes breadcrumbs to be able to be testable with mocha and jsdom ([c53d8d0](https://bitbucket.org/atlassian/atlaskit/commits/c53d8d0))

## 1.0.7 (2017-03-23)

- fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.0.5 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.3 (2017-02-23)

- fix; Removes jsdoc from breadcrumbs ([e8f25fc](https://bitbucket.org/atlassian/atlaskit/commits/e8f25fc))

## 1.0.2 (2017-02-09)

- fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.0.1 (2017-02-06)

- fix; Updates package to use ak scoped packages ([f066736](https://bitbucket.org/atlassian/atlaskit/commits/f066736))
