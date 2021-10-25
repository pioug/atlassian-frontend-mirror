# @atlaskit/onboarding

## 10.2.6

### Patch Changes

- [`b85e7ce12cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b85e7ce12cd) - Internal upgrade of memoize-one to 6.0.0

## 10.2.5

### Patch Changes

- [`34282240102`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34282240102) - Adds explicit type to button usages components.

## 10.2.4

### Patch Changes

- [`d77725f926f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d77725f926f) - Replaced usage of `styled-components` with `@emotion/core`.
- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Internal changes to remove `@atlaskit/theme/math` usage.
- Updated dependencies

## 10.2.3

### Patch Changes

- [`115c009e2ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/115c009e2ef) - Refactor to use new modal dialog API.
- Updated dependencies

## 10.2.2

### Patch Changes

- Updated dependencies

## 10.2.1

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 10.2.0

### Minor Changes

- [`1b1cb960767`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b1cb960767) - The `headingAfterElement` prop has been added to the spotlight component which can be used to add a supplementary action.

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.

## 10.1.9

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 10.1.8

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 10.1.7

### Patch Changes

- Updated dependencies

## 10.1.6

### Patch Changes

- [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo analytics-next file restructure to allow external ts definitions to continue working

## 10.1.5

### Patch Changes

- Updated dependencies

## 10.1.4

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 10.1.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 10.1.2

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 10.1.1

### Patch Changes

- Updated dependencies

## 10.1.0

### Minor Changes

- [`5d6c324306`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d6c324306) - Expose useSpotlight hook which returns #isTargetRendered function. We can use this function to check whether target is rendered or not.

### Patch Changes

- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 10.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 9.2.0

### Minor Changes

- [`2c8d296246`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c8d296246) - Adds support for the `subtle` button appearance in the Spotlight dialog theme to align more closely with ADG guidelines. Also visually re-orders action items so that the primary item in the actions list appears on the right hand side, but still recieves focus first.

## 9.1.10

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 9.1.9

### Patch Changes

- [`4560b65a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4560b65a4f) - upgrade react-transition-group to latest

## 9.1.8

### Patch Changes

- Updated dependencies

## 9.1.7

### Patch Changes

- [`6faa22760b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6faa22760b) - Add modalButtonTheme, spotlightButtonTheme,- Updated dependencies

## 9.1.6

### Patch Changes

- [patch][d150e2d7f6](https://bitbucket.org/atlassian/atlassian-frontend/commits/d150e2d7f6):

  Change imports to comply with Atlassian conventions- Updated dependencies [cf8577f5d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf8577f5d6):

- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [9a534d6a74](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a534d6a74):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/popper@3.1.12
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/modal-dialog@10.5.7
  - @atlaskit/webdriver-runner@0.3.4

## 9.1.5

### Patch Changes

- [patch][0389a42cc5](https://bitbucket.org/atlassian/atlassian-frontend/commits/0389a42cc5):

  Positioning fix for onboarding modals without css reset- Updated dependencies [603413f530](https://bitbucket.org/atlassian/atlassian-frontend/commits/603413f530):

- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies [f5b654c328](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5b654c328):
- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies [89bf723567](https://bitbucket.org/atlassian/atlassian-frontend/commits/89bf723567):
  - @atlaskit/portal@3.1.7
  - @atlaskit/docs@8.5.1
  - @atlaskit/modal-dialog@10.5.6
  - @atlaskit/theme@9.5.3
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10

## 9.1.4

### Patch Changes

- [patch][4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):

  Upgraded react-scrolllock package- [patch][923c738553](https://bitbucket.org/atlassian/atlassian-frontend/commits/923c738553):

  Fixes a rendering bug where a spotlight would not be updated- Updated dependencies [4d3749c9e6](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d3749c9e6):

- Updated dependencies [dae900bf82](https://bitbucket.org/atlassian/atlassian-frontend/commits/dae900bf82):
- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
  - @atlaskit/modal-dialog@10.5.5
  - @atlaskit/build-utils@2.6.4
  - @atlaskit/docs@8.5.0

## 9.1.3

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
  - @atlaskit/modal-dialog@10.5.4

## 9.1.2

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/modal-dialog@10.5.3

## 9.1.1

### Patch Changes

- [patch][728f19e563](https://bitbucket.org/atlassian/atlassian-frontend/commits/728f19e563):

  Fixes a rendering bug where a spotlight would not be updated

## 9.1.0

### Minor Changes

- [minor][aa70b257d3](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa70b257d3):

  Introduce new prop `experimental_shouldShowPrimaryButtonOnRight` which positions the primary button in a onboarding modal-dialog on the right (ADG approved).

## 9.0.10

### Patch Changes

- [patch][b0d1348c83](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0d1348c83):

  Change the type definition for interface to extend ButtonProps- [patch][62dc057049](https://bitbucket.org/atlassian/atlassian-frontend/commits/62dc057049):

  Allowing benefits modal buttons to stack vertically rather than overflow the modal when buttons contain lengthy text.- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):

  - @atlaskit/icon@20.0.2

## 9.0.9

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/modal-dialog@10.5.2
  - @atlaskit/popper@3.1.11
  - @atlaskit/portal@3.1.6
  - @atlaskit/progress-indicator@7.0.13
  - @atlaskit/theme@9.5.1

## 9.0.8

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/modal-dialog@10.5.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/portal@3.1.5

## 9.0.7

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Fixes Action onClick return type to void- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/modal-dialog@10.5.0
  - @atlaskit/progress-indicator@7.0.12
  - @atlaskit/popper@3.1.8

## 9.0.6

### Patch Changes

- [patch][532f7c03fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/532f7c03fd):

  Fixes spotlight taking a while to animate into view.- [patch][864f4891dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/864f4891dc):

  Fixes spotlight target not updating its position when resizing the viewport.- Updated dependencies [768bac6d81](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/768bac6d81):

  - @atlaskit/analytics-next@6.3.2

## 9.0.5

### Patch Changes

- [patch][1ed27f5f85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1ed27f5f85):

  Adds prop types for Header / Footer render props.

## 9.0.4

### Patch Changes

- [patch][f86839ca4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f86839ca4e):

  @atlaskit/portal had an issue in IE11 and this is fixed in 3.1.2

## 9.0.3

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 9.0.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 9.0.1

### Patch Changes

- [patch][2b158873d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b158873d1):

  Add linting rule to prevent unsafe usage of setTimeout within React components.

## 9.0.0

### Major Changes

- [major][a75dfaad67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a75dfaad67):

  @atlaskit/onboarding has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 8.0.17

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 8.0.16

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 8.0.15

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 8.0.14

### Patch Changes

- [patch][abee1a5f4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abee1a5f4f):

  Bumping internal dependency (memoize-one) to latest version (5.1.0). memoize-one@5.1.0 has full typescript support so it is recommended that typescript consumers use it also.

## 8.0.13

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 8.0.12

- Updated dependencies [926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):
  - @atlaskit/progress-indicator@7.0.3
  - @atlaskit/analytics-next@6.0.0
  - @atlaskit/button@13.1.2
  - @atlaskit/modal-dialog@10.1.3

## 8.0.11

### Patch Changes

- [patch][678b2407a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/678b2407a1):

  Fix spotlight highlight issue when the offset parent has "fixed" position.

## 8.0.10

### Patch Changes

- [patch][d905cbc0ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d905cbc0ac):

  Spotlight target highlight is out of position if the the target element or any of its parent has a "fixed" position. Fix the issue by checking for fixed position before setting the position values for target highlight.
  Adding a condition to check if the component are referenced in tests running in CI. It reduces the noise and help reading the CI log.

## 8.0.9

- BROKEN RELEASE. DO NOT USE.

### Patch Changes

- [patch][2e3d9d3e25](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e3d9d3e25):

## 8.0.8

- Updated dependencies [ebfeb03eb7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebfeb03eb7):
  - @atlaskit/popper@3.0.0

## 8.0.7

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 8.0.6

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/modal-dialog@10.0.7
  - @atlaskit/portal@3.0.7
  - @atlaskit/icon@19.0.0

## 8.0.5

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 8.0.4

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/modal-dialog@10.0.4
  - @atlaskit/portal@3.0.3
  - @atlaskit/icon@18.0.0

## 8.0.3

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 8.0.2

- [patch][c3ab82ed42](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3ab82ed42):

  - Bump react-focus-lock to latest 1.19.1, it will fix a bug with document.activeElement

- Updated dependencies [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
- Updated dependencies [dacfb81ca1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dacfb81ca1):
  - @atlaskit/icon@17.1.2
  - @atlaskit/portal@3.0.0
  - @atlaskit/modal-dialog@10.0.0

## 8.0.1

- [patch][21854842b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21854842b5):

  - Clean couple of TODO's that were already done

## 8.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 7.0.5

- Updated dependencies [5b6b4d6a0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b6b4d6a0f):
- Updated dependencies [8b5f052003](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b5f052003):
  - @atlaskit/modal-dialog@8.0.9
  - @atlaskit/portal@1.0.0
  - @atlaskit/popper@1.0.0

## 7.0.4

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/modal-dialog@8.0.7
  - @atlaskit/popper@0.4.3
  - @atlaskit/progress-indicator@6.0.4
  - @atlaskit/theme@8.1.7

## 7.0.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/modal-dialog@8.0.6
  - @atlaskit/popper@0.4.2
  - @atlaskit/portal@0.3.1
  - @atlaskit/progress-indicator@6.0.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 7.0.2

- Updated dependencies [ce4e1b4780](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce4e1b4780):
  - @atlaskit/modal-dialog@8.0.4
  - @atlaskit/portal@0.3.0

## 7.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/modal-dialog@8.0.2
  - @atlaskit/popper@0.4.1
  - @atlaskit/portal@0.2.1
  - @atlaskit/progress-indicator@6.0.1
  - @atlaskit/theme@8.0.1
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

## 6.2.0

- [minor][eb81a2de65](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eb81a2de65):

  - Spotlight footer and header props will now only accept React components

## 6.1.17

- [patch][d669123bbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d669123bbd):

  - Enable auto focus by rendering components only after the portal has been attached to DOM.

- Updated dependencies [27cacd44ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27cacd44ab):
  - @atlaskit/modal-dialog@7.2.2
  - @atlaskit/portal@0.1.0

## 6.1.16

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/modal-dialog@7.2.1
  - @atlaskit/portal@0.0.18
  - @atlaskit/icon@16.0.0

## 6.1.15

- [patch][6855bec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6855bec):

  - Updated internal use of ModalDialog to use new composition API

## 6.1.14

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/icon@15.0.2
  - @atlaskit/modal-dialog@7.1.1
  - @atlaskit/popper@0.3.6
  - @atlaskit/portal@0.0.17
  - @atlaskit/progress-indicator@5.0.11
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 6.1.13

- [patch][e59562a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e59562a):

  - Fix for visual bug in SpotlightCard component

## 6.1.12

- [patch][d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):

  - Change API to experimental theming API to namespace component themes into separate contexts and make theming simpler. Update all dependant components.

## 6.1.11

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/modal-dialog@7.0.13
  - @atlaskit/portal@0.0.16
  - @atlaskit/icon@15.0.0

## 6.1.10

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/modal-dialog@7.0.12
  - @atlaskit/popper@0.3.2
  - @atlaskit/portal@0.0.15
  - @atlaskit/progress-indicator@5.0.9
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 6.1.9

- [patch][e151c1a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e151c1a):

  - Removes dependency on @atlaskit/layer-manager

  As of component versions:

  - \`@atlaskit/modal-dialog@7.0.0\`
  - \`@atlaskit/tooltip@12.0.2\`
  - \`@atlaskit/flag@9.0.6\`
  - \`@atlaskit/onboarding@6.0.0\`

  No component requires \`LayerManager\` to layer correctly.

  You can safely remove this dependency and stop rendering \`LayerManager\` in your apps.

## 6.1.8

- Updated dependencies [1fb2c2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1fb2c2a):
  - @atlaskit/modal-dialog@7.0.9
  - @atlaskit/portal@0.0.14

## 6.1.7

- Updated dependencies [3f5a4dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f5a4dd):
  - @atlaskit/modal-dialog@7.0.8
  - @atlaskit/portal@0.0.13

## 6.1.6

- [patch][a637f5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a637f5e):

  - Refine and fix some flow type errors found by fixing @atlaskit/analytics-next HOCs to allow flow to type check properly

## 6.1.5

- [patch][b332c91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b332c91):

  - upgrades verison of react-scrolllock to SSR safe version

## 6.1.4

- [patch][9f91ea0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f91ea0):

  - Adds visual regression test for ie11

## 6.1.3

- [patch][4872a19](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4872a19):

  - actions prop officially accepts Node type for text. Adds optional key to action type.

  Previously if you were using the actions prop like:

  ```jsx
  <Spotlight
    actions={[
      {
        text: <FormattedMessage defaultMessage="Next" />,
      },
      {
        text: <FormattedMessage defaultMessage="Skip" />,
      },
    ]}
  >
    Look at this feature
  </Spotlight>
  ```

  React would complain about duplicate keys. Now you can pass in
  a key for the action like:

  ```jsx
  <Spotlight
    actions={[
      {
        text: <FormattedMessage defaultMessage="Next" />,
        key: 'next',
      },
      {
        text: <FormattedMessage defaultMessage="Skip" />,
        key: 'skip',
      },
    ]}
  >
    Look at this feature
  </Spotlight>
  ```

## 6.1.2

- [patch][2482922" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2482922"
  d):

  - Remove unecessary alt text for modal image to avoid redundancy for screenreaders

## 6.1.1

- [patch][0c7a57d" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c7a57d"
  d):

  - Fixes layering of blanket and spotlight components in IE11 and Edge

## 6.1.0

- [minor] Creates new SpotlightCard component. Internal refactor of Spotlight components. Spotlight state managed through context rather than local variable. [f9ba552](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9ba552)

## 6.0.4

- [patch] Updated dependencies [aaab348](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aaab348)
  - @atlaskit/modal-dialog@7.0.4
  - @atlaskit/portal@0.0.12

## 6.0.3

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 6.0.2

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/layer-manager@5.0.13
  - @atlaskit/modal-dialog@7.0.2
  - @atlaskit/portal@0.0.10
  - @atlaskit/icon@14.0.0

## 6.0.1

- [patch] Updated dependencies [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/icon@13.8.1
  - @atlaskit/layer-manager@5.0.12
  - @atlaskit/modal-dialog@7.0.0

## 6.0.0

- [major] Add SpotlightTransition and require it wraps Spotlight to get both transitions and conditional rendering with proper transitions on unmount. [d9d2f0d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9d2f0d)
- [patch] Upgrades Spotlight component to use @atlaskit/portal package [89be4f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89be4f1)
- [none] Updated dependencies [89be4f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89be4f1)
  - @atlaskit/portal@0.0.8
  - @atlaskit/layer-manager@5.0.11

## 5.1.9

- [patch] Updated dependencies [9c66d4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c66d4d)
  - @atlaskit/layer-manager@5.0.10
  - @atlaskit/webdriver-runner@0.1.0

## 5.1.8

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 5.1.6

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/modal-dialog@6.0.9
  - @atlaskit/layer-manager@5.0.6
  - @atlaskit/icon@13.2.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 5.1.5

- [patch] Updated dependencies [8242529](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8242529)
  - @atlaskit/layer@5.0.5

## 5.1.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/modal-dialog@6.0.6
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/layer@5.0.4
  - @atlaskit/layer-manager@5.0.5
  - @atlaskit/icon@13.2.4

## 5.1.3

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/layer-manager@5.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/layer@5.0.3
  - @atlaskit/modal-dialog@6.0.5

## 5.1.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/modal-dialog@6.0.4
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/layer@5.0.2
  - @atlaskit/layer-manager@5.0.3
  - @atlaskit/icon@13.2.1

## 5.1.1

- [patch] onboarding spotlight: fix margin affecting target position [0e33c70](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e33c70)
- [none] Updated dependencies [0e33c70](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e33c70)

## 5.1.0

- [minor] round corners for onboarding modal image [785e99a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/785e99a)
- [none] Updated dependencies [785e99a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/785e99a)

## 5.0.1

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/modal-dialog@6.0.1
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1

## 5.0.0

- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/icon@13.0.0

## 4.1.7

- [patch] Remove or update \$FlowFixMe [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/button@8.2.4
  - @atlaskit/icon@12.6.1
  - @atlaskit/modal-dialog@5.2.6

## 4.1.6

- [patch] Fixes positioning issue when target is relatively positioned [11e8465](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11e8465)
- [none] Updated dependencies [11e8465](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11e8465)

## 4.1.5

- [patch] Fix \$FlowFixMe and release packages [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/modal-dialog@5.2.5
  - @atlaskit/button@8.2.2
  - @atlaskit/icon@12.3.1

## 4.1.4

- [patch] Replaces implementation of ScrollLock with [react-scrolllock](https://github.com/jossmac/react-scrolllock). Deprecates ScrollLock export in @atlaskit/layer-manager. [497d50d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/497d50d)
- [none] Updated dependencies [497d50d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/497d50d)
  - @atlaskit/layer-manager@4.3.1
  - @atlaskit/layer@4.1.1
  - @atlaskit/modal-dialog@5.2.4

## 4.1.3

- [patch] Adds autoFocus prop to FocusLock. Fixes scrolling bug in onboarding. [c9d606b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c9d606b)
- [none] Updated dependencies [c9d606b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c9d606b)
  - @atlaskit/layer-manager@4.3.0
- Fixes scrolling problem when multiple spotlights are off-screen.

## 4.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/modal-dialog@5.2.2
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/layer@4.0.3
  - @atlaskit/layer-manager@4.2.1
  - @atlaskit/icon@12.1.2

## 4.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/layer-manager@4.1.1
  - @atlaskit/modal-dialog@5.1.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1
  - @atlaskit/layer@4.0.2

## 4.1.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/modal-dialog@5.1.0
  - @atlaskit/layer-manager@4.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/layer@4.0.1
  - @atlaskit/button@8.1.0

## 4.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/layer-manager@4.0.1
  - @atlaskit/modal-dialog@5.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 4.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/layer-manager@4.0.0
  - @atlaskit/modal-dialog@5.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/layer@4.0.0

## 3.1.3

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/modal-dialog@4.0.5
  - @atlaskit/layer-manager@3.0.4
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4
  - @atlaskit/layer@3.1.1

## 3.1.0

- [minor] support new property "targetNode" on spotlight component [48397b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48397b6)

## 3.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 2.4.2

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 2.4.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 2.3.4

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 2.3.2

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 2.3.0

- [minor] Replace scrollBy and add websdriver test [66e7a56](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66e7a56)

## 2.2.2

- [patch] Migrate Navigation from Ak repo to ak mk 2 repo, Fixed flow typing inconsistencies in ak mk 2 [bdeef5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdeef5b)

## 2.2.1

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 2.2.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 2.1.0

- [minor] add subtle-link button appearance theme to spotlight [24d1fa2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24d1fa2)

## 2.0.8

- [patch] Update dependencies [623f8ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623f8ca)

## 2.0.7

- [patch] more robust implementation of FocusLock [64dd1d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64dd1d8)

## 2.0.6

- [patch] Refactor autoscroll logic in withScrollMeasurement HOC [2e90a74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e90a74)

## 2.0.4

- [patch] Fix version ranges on button/layer-manager [7e7a211](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e7a211)
- [patch] update flow dep, fix flow errors [722ad83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/722ad83)
- [patch] Update Onboarding's Button usage to implement theming method. [5e6da46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e6da46)

## 2.0.2

- [patch] Fix target regression from migration [fa6f973](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f973)
- [patch] Updated docs to reflect the addition of the blanketIsTinted prop to SpotLightManager [11bb25f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11bb25f)

## 1.0.0-beta (2017-09-19)

- feature; initial release
