# @atlaskit/dropdown-menu

## 10.1.8

### Patch Changes

- Updated dependencies

## 10.1.7

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 10.1.6

### Patch Changes

- [`28f40bac160`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f40bac160) - Updates targets for modal dialog in VR tests.

## 10.1.5

### Patch Changes

- [`8ec43d970dd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8ec43d970dd) - Removed 'aria-controls' and unused id's from the Dropdown component
- Updated dependencies

## 10.1.4

### Patch Changes

- [`bc6de0e2e19`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc6de0e2e19) - Internal change to use declarative entrypoints instead of the hardcoded ones.

## 10.1.3

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.
- Updated dependencies

## 10.1.2

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 10.1.1

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 10.1.0

### Minor Changes

- [`50c2ca9269`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50c2ca9269) - Export WithToggleInteractionProps type to prevent it from being referenced via deep import path in dependent declaration files

### Patch Changes

- Updated dependencies

## 10.0.6

### Patch Changes

- [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo analytics-next file restructure to allow external ts definitions to continue working

## 10.0.5

### Patch Changes

- Updated dependencies

## 10.0.4

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

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

- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 10.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 9.0.6

### Patch Changes

- [`a8d5ae5d98`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8d5ae5d98) - Fix analytics when dropdown menu gets closed. Now passing dropdown-menu analytics instead of droplist.

## 9.0.5

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 9.0.4

### Patch Changes

- Updated dependencies

## 9.0.3

### Patch Changes

- [patch][7a2540821c](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a2540821c):

  Change imports to comply with Atlassian conventions- Updated dependencies [3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):

- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [167a55fd7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/167a55fd7a):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [a4acc95793](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4acc95793):
- Updated dependencies [a4d063330a](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4d063330a):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/tooltip@15.2.6
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/avatar@17.1.10
  - @atlaskit/droplist@10.0.4
  - @atlaskit/lozenge@9.1.7
  - @atlaskit/webdriver-runner@0.3.4

## 9.0.2

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
  - @atlaskit/droplist@10.0.3
  - @atlaskit/lozenge@9.1.6
  - @atlaskit/tooltip@15.2.5

## 9.0.1

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/avatar@17.1.8
  - @atlaskit/button@13.3.8
  - @atlaskit/droplist@10.0.2
  - @atlaskit/lozenge@9.1.5
  - @atlaskit/tooltip@15.2.4

## 9.0.0

### Major Changes

- [major][9e87af4685](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e87af4685):

  @atlaskit/dropdown-menu has been converted to TypeScript to provide static typing. Flow types are no longer provided. No API or behavioral changes.

### Patch Changes

- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
  - @atlaskit/icon@20.0.2

## 8.2.4

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/avatar@17.1.7
  - @atlaskit/button@13.3.7
  - @atlaskit/droplist@10.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/item@11.0.1
  - @atlaskit/lozenge@9.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3

## 8.2.3

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/droplist@10.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/item@11.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/tooltip@15.2.2

## 8.2.2

### Patch Changes

- Updated dependencies [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):
- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5
  - @atlaskit/lozenge@9.1.3
  - @atlaskit/tooltip@15.2.1

## 8.2.1

### Patch Changes

- Updated dependencies [557a8e2451](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a8e2451):
  - @atlaskit/lozenge@9.1.2

## 8.2.0

### Minor Changes

- [minor][0e2241e904](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e2241e904):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help products to write better integration and end to end tests.

## 8.1.4

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 8.1.3

- Updated dependencies [10e0798da6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10e0798da6):
  - @atlaskit/lozenge@9.1.0

## 8.1.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 8.1.1

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/item@10.1.5
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 8.1.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

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

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 8.0.13

- Updated dependencies [926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):
  - @atlaskit/droplist@9.0.13
  - @atlaskit/analytics-next@6.0.0
  - @atlaskit/avatar@16.0.10
  - @atlaskit/button@13.1.2
  - @atlaskit/tooltip@15.0.9

## 8.0.12

### Patch Changes

- [patch][d905cbc0ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d905cbc0ac):

  Adding a condition to check if the component are referenced in tests running in CI. It reduces the noise and help reading the CI log.

## 8.0.11

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 8.0.10

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 8.0.9

- Updated dependencies [18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):
  - @atlaskit/build-utils@2.2.2
  - @atlaskit/button@13.0.14
  - @atlaskit/lozenge@9.0.2

## 8.0.8

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/button@13.0.9
  - @atlaskit/droplist@9.0.8
  - @atlaskit/item@10.0.5
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/icon@19.0.0

## 8.0.7

### Patch Changes

- [patch][6fe990954c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6fe990954c):

  Adjusted the offset prop for Popper to not use the deprecated format

## 8.0.6

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 8.0.5

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/avatar@16.0.4
  - @atlaskit/droplist@9.0.5
  - @atlaskit/icon@18.0.1
  - @atlaskit/item@10.0.3
  - @atlaskit/tooltip@15.0.0

## 8.0.4

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/button@13.0.8
  - @atlaskit/droplist@9.0.4
  - @atlaskit/item@10.0.2
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/icon@18.0.0

## 8.0.3

- Updated dependencies [f8778d517a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f8778d517a):
  - @atlaskit/lozenge@9.0.1

## 8.0.2

- Updated dependencies [ed41cac6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed41cac6ac):
  - @atlaskit/item@10.0.1
  - @atlaskit/theme@9.0.3
  - @atlaskit/lozenge@9.0.0

## 8.0.1

- [patch][ee788e6434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ee788e6434):

  - Fix analytics for the toggle dropdownMenu event

## 8.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 7.0.7

- Updated dependencies [73a5c6f3dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/73a5c6f3dc):
  - @atlaskit/lozenge@7.0.3

## 7.0.6

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/button@12.0.3
  - @atlaskit/droplist@8.0.5
  - @atlaskit/icon@16.0.9
  - @atlaskit/item@9.0.1
  - @atlaskit/lozenge@7.0.2
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 7.0.5

- [patch][6fd20256f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6fd20256f3):

  - Add positionFixed property to Popper

## 7.0.4

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/avatar@15.0.3
  - @atlaskit/droplist@8.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/theme@8.1.6
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/button@12.0.0

## 7.0.3

- Updated dependencies [98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):
  - @atlaskit/analytics-next@4.0.2
  - @atlaskit/button@11.0.5
  - @atlaskit/droplist@8.0.2
  - @atlaskit/icon@16.0.6
  - @atlaskit/lozenge@7.0.1

## 7.0.2

- [patch][dc114c4ce6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc114c4ce6):

  - Internal changes only. DropdownMenu is now compatible with SSR.

## 7.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/avatar@15.0.1
  - @atlaskit/droplist@8.0.1
  - @atlaskit/icon@16.0.5
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

## 6.1.26

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/avatar@14.1.8
  - @atlaskit/button@10.1.2
  - @atlaskit/droplist@7.0.18
  - @atlaskit/item@8.0.15
  - @atlaskit/tooltip@12.1.15
  - @atlaskit/icon@16.0.0

## 6.1.25

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/avatar@14.1.7
  - @atlaskit/button@10.1.1
  - @atlaskit/droplist@7.0.17
  - @atlaskit/icon@15.0.2
  - @atlaskit/item@8.0.14
  - @atlaskit/lozenge@6.2.4
  - @atlaskit/theme@7.0.1
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/docs@6.0.0

## 6.1.24

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/droplist@7.0.16
  - @atlaskit/icon@15.0.1
  - @atlaskit/item@8.0.13
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/theme@7.0.0
  - @atlaskit/avatar@14.1.6
  - @atlaskit/lozenge@6.2.3

## 6.1.23

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/avatar@14.1.5
  - @atlaskit/button@10.0.1
  - @atlaskit/droplist@7.0.14
  - @atlaskit/item@8.0.12
  - @atlaskit/tooltip@12.1.11
  - @atlaskit/icon@15.0.0

## 6.1.22

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/avatar@14.1.4
  - @atlaskit/droplist@7.0.13
  - @atlaskit/icon@14.6.1
  - @atlaskit/theme@6.2.1
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/button@10.0.0

## 6.1.21

- [patch][1fb2c2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1fb2c2a):

  - Fixed issue where tooltips and modals would initially render in the wrong location

## 6.1.20

- [patch][fe943bb" d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe943bb"
  d):

  - Make sure we check userAgent only if we have a DOM

## 6.1.19

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 6.1.18

- [patch] Fix the dropdown menu height exceeding viewport height when appearance prop is set to ‘tall’ [0deec63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0deec63)

## 6.1.17

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/button@9.0.13
  - @atlaskit/droplist@7.0.10
  - @atlaskit/item@8.0.8
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/icon@14.0.0

## 6.1.16

- [patch] Fixing dropdown-menu analytics [c4098d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c4098d0)

## 6.1.15

- [patch] Updated dependencies [7d51a09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d51a09)
  - @atlaskit/button@9.0.10
  - @atlaskit/lozenge@6.2.1

## 6.1.14

- [patch] Updated dependencies [4b36fd6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b36fd6)
  - @atlaskit/lozenge@6.2.0

## 6.1.13

- [patch] Updated dependencies [969233e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/969233e)
  - @atlaskit/lozenge@6.1.8

## 6.1.12

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 6.1.11

- [patch] Fix initial position glitch when opening dropdown menu [d79e361](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d79e361)

## 6.1.9

- [patch] Fix dropdown menu calls onOpenChange unnecessarily [2868a72](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2868a72)
- [patch] Updated dependencies [2868a72](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2868a72)

## 6.1.8

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/lozenge@6.1.5
  - @atlaskit/item@8.0.5
  - @atlaskit/icon@13.2.5
  - @atlaskit/droplist@7.0.7
  - @atlaskit/button@9.0.6
  - @atlaskit/avatar@14.0.8
  - @atlaskit/docs@5.0.6

## 6.1.7

- [patch] Updated dependencies [8242529](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8242529)
  - @atlaskit/droplist@7.0.6

## 6.1.6

- [patch] Fix scroll to top of container issue when menu is opened via keydown [0a09918](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a09918)
- [patch] Updated dependencies [0a09918](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a09918)

## 6.1.5

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [patch] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/lozenge@6.1.4
  - @atlaskit/item@8.0.4
  - @atlaskit/icon@13.2.4
  - @atlaskit/droplist@7.0.5
  - @atlaskit/avatar@14.0.6

## 6.1.4

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/item@8.0.3
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/lozenge@6.1.3
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/droplist@7.0.4
  - @atlaskit/avatar@14.0.5

## 6.1.3

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [patch] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/tooltip@12.0.3
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/lozenge@6.1.2
  - @atlaskit/item@8.0.2
  - @atlaskit/icon@13.2.1
  - @atlaskit/droplist@7.0.3
  - @atlaskit/avatar@14.0.4

## 6.1.2

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [patch] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/tooltip@12.0.1
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/lozenge@6.1.1
  - @atlaskit/docs@5.0.1
  - @atlaskit/droplist@7.0.2
  - @atlaskit/avatar@14.0.2

## 6.1.1

- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/item@8.0.1
  - @atlaskit/icon@13.1.1
  - @atlaskit/droplist@7.0.1
  - @atlaskit/avatar@14.0.1

## 6.1.0

- [minor] Updated dependencies [ebf6b97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebf6b97)
  - @atlaskit/lozenge@6.1.0

## 6.0.0

- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/item@8.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/droplist@7.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/item@8.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/droplist@7.0.0
  - @atlaskit/avatar@14.0.0

## 5.2.3

- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/button@8.2.5
  - @atlaskit/item@7.0.8
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/button@8.2.5
  - @atlaskit/item@7.0.8

## 5.2.2

- [patch] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0
  - @atlaskit/item@7.0.7

## 5.2.1

- [patch] Remove or update \$FlowFixMe [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/button@8.2.4
  - @atlaskit/icon@12.6.1
  - @atlaskit/droplist@6.2.2
  - @atlaskit/avatar@11.2.2

## 5.2.0

- [minor] Add optional onPositioned prop to inform when the menu has been positioned by the underlying Layer component. [95a4592](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95a4592)
- [minor] Updated dependencies [95a4592](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95a4592)
  - @atlaskit/droplist@6.2.0

## 5.1.0

- [minor] Fixes types for Flow 0.74 [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [none] Updated dependencies [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
  - @atlaskit/tooltip@10.3.0
  - @atlaskit/button@8.2.0
  - @atlaskit/icon@12.2.0
  - @atlaskit/avatar@11.2.0

## 5.0.4

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [patch] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/lozenge@5.0.4
  - @atlaskit/item@7.0.5
  - @atlaskit/icon@12.1.2
  - @atlaskit/droplist@6.1.2

## 5.0.3

- [patch] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/lozenge@5.0.3
  - @atlaskit/item@7.0.4
  - @atlaskit/icon@12.1.1
  - @atlaskit/droplist@6.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/avatar@11.1.1
  - @atlaskit/docs@4.1.1

## 5.0.2

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/tooltip@10.2.0
  - @atlaskit/item@7.0.3
  - @atlaskit/avatar@11.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/lozenge@5.0.2
  - @atlaskit/droplist@6.1.0
  - @atlaskit/button@8.1.0

## 5.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/item@7.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/lozenge@5.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/droplist@6.0.0
  - @atlaskit/avatar@11.0.0

## 4.1.1

- [patch] Updated dependencies [535d585](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/535d585)
  - @atlaskit/droplist@5.1.1

## 4.1.0

- [minor] Add `isMenuFixed` prop to force menu to render with position fixed to allow it to break out of non-visible overflow containers at the cost of detachment from the trigger on scroll. [e710cfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e710cfa)
- [none] Updated dependencies [e710cfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e710cfa)
  - @atlaskit/droplist@5.1.0

## 4.0.5

- [patch] Updated dependencies [0838cb0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0838cb0)
  - @atlaskit/lozenge@4.1.1
- [patch] Updated dependencies [979aff5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/979aff5)
  - @atlaskit/lozenge@4.1.1

## 4.0.4

- [patch] Updated dependencies [b42eaa5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b42eaa5)
  - @atlaskit/lozenge@4.1.0

## 4.0.3

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/item@6.0.3
  - @atlaskit/droplist@5.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4
  - @atlaskit/lozenge@4.0.1

## 4.0.1

- [patch] Fix clipping of dropdown item content due to line height issues [a0392ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0392ec)

## 4.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 3.12.3

- [patch] Update flow typing [bef13c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bef13c9)

## 3.12.2

- [patch] Makes packages Flow types compatible with version 0.67 [25daac0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25daac0)

## 3.12.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 3.12.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 3.11.10

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 3.11.8

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 3.11.7

- [patch] added logic to close dropdown menu when tabbing out of the component [8279a46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8279a46)

## 3.11.6

- [patch] updated item dependency version [23771b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23771b9)

## 3.11.5

- [patch] migrate from ak to mk-2 [34a9cbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/34a9cbb)

## 3.11.4 (2017-11-30)

- bug fix; fix dropdown menu opening on disabled button click (issues closed: ak-3644) ([4d8c35d](https://bitbucket.org/atlassian/atlaskit/commits/4d8c35d))

## 3.11.3 (2017-11-23)

- bug fix; update checkbox/radio dropdown items to work with default item spacing bug fix ([7ac0582](https://bitbucket.org/atlassian/atlaskit/commits/7ac0582))

## 3.11.2 (2017-11-16)

- bug fix; bumping internal dependencies to latest major version ([7b22368](https://bitbucket.org/atlassian/atlaskit/commits/7b22368))

## 3.11.1 (2017-11-02)

- bug fix; added missing dependencies (issues closed: ak-3782) ([4dbc3ef](https://bitbucket.org/atlassian/atlaskit/commits/4dbc3ef))

## 3.11.0 (2017-10-27)

- feature; use shared HOC from item ([f966d9c](https://bitbucket.org/atlassian/atlaskit/commits/f966d9c))

## 3.10.5 (2017-10-26)

- bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 3.10.4 (2017-10-22)

- bug fix; update dependencies for react-16 ([077d1ad](https://bitbucket.org/atlassian/atlaskit/commits/077d1ad))

## 3.10.3 (2017-10-06)

- bug fix; replace React.PropTypes imports with prop-types ([8c17947](https://bitbucket.org/atlassian/atlaskit/commits/8c17947))

## 3.10.2 (2017-09-21)

- bug fix; update item dependency (issues closed: ak-3418) ([4f64804](https://bitbucket.org/atlassian/atlaskit/commits/4f64804))

## 3.10.1 (2017-09-06)

- bug fix; Dropdown menu now closes when a non-link item is clicked (issues closed: ak-3288) ([3bdf62d](https://bitbucket.org/atlassian/atlaskit/commits/3bdf62d))

## 3.10.0 (2017-09-01)

- feature; exposing isOpen and defaultOpen from dropdown ([f89ac1c](https://bitbucket.org/atlassian/atlaskit/commits/f89ac1c))

## 3.9.0 (2017-08-31)

- bug fix; dropdown-menu depenencies bumped to latest (issues closed: ak-3392) ([faea6d3](https://bitbucket.org/atlassian/atlaskit/commits/faea6d3))
- feature; adding the ability to pass a boundariesElement to the Layer component (issues closed: ak-3416) ([f6a215e](https://bitbucket.org/atlassian/atlaskit/commits/f6a215e))

## 3.8.0 (2017-08-25)

- feature; added defaultSelected and isSelected props for DropdownItemRadio and DropdownItemCheckbox (issues closed: ak-3357) ([00080f1](https://bitbucket.org/atlassian/atlaskit/commits/00080f1))

## 3.7.3 (2017-08-24)

- bug fix; dropdownItemRadio and DropdownItemCheckbox now work when custom onClick handler is s (issues closed: ak-3358) ([16bee1b](https://bitbucket.org/atlassian/atlaskit/commits/16bee1b))

## 3.7.2 (2017-08-22)

- bug fix; dropdownItem and DropdownItemGroup now get correct a11y role (issues closed: ak-3325) ([2dbfe85](https://bitbucket.org/atlassian/atlaskit/commits/2dbfe85))
- bug fix; dropdown now only focuses on first item when opened via keyboard (issues closed: ak-3311) ([4381e96](https://bitbucket.org/atlassian/atlaskit/commits/4381e96))

## 3.7.1 (2017-08-21)

- bug fix; fix PropTypes warning ([040d579](https://bitbucket.org/atlassian/atlaskit/commits/040d579))

## 3.7.0 (2017-08-11)

- bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
- feature; implement darkmode for droplist ([35f9281](https://bitbucket.org/atlassian/atlaskit/commits/35f9281))

## 3.6.0 (2017-08-11)

- feature; implement darkmode for droplist ([35f9281](https://bitbucket.org/atlassian/atlaskit/commits/35f9281))

## 3.5.1 (2017-08-10)

- bug fix; handle missing context in dropdown items gracefully (issues closed: ak-2590) ([5a36eea](https://bitbucket.org/atlassian/atlaskit/commits/5a36eea))

## 3.4.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))
- feature; convert dropdown-menu and droplist to declarative API ([f6e0292](https://bitbucket.org/atlassian/atlaskit/commits/f6e0292))

## 3.4.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.1.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))
- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.0.2 (2017-07-17)

- fix; replace "\*" with last version of tooltip "1.2.0" ([89ba989](https://bitbucket.org/atlassian/atlaskit/commits/89ba989))

## 3.0.1 (2017-06-14)

- fix; update internal components to latest dropdown-menu ([ad63284](https://bitbucket.org/atlassian/atlaskit/commits/ad63284))

## 2.0.0 (2017-05-30)

- refactored to meet new component conventions ([64510d9](https://bitbucket.org/atlassian/atlaskit/commits/64510d9))
- removed TypeScript ([d78988e](https://bitbucket.org/atlassian/atlaskit/commits/d78988e))
- breaking; Public API change: named export "StatelessDropdownMenu" is now "DropdownMenuStateless"
- breaking; removed TypeScript ISSUES CLOSED: AK-2384

## 1.10.1 (2017-05-26)

- fix; add missing prop types to dropdown-menu ([79d9570](https://bitbucket.org/atlassian/atlaskit/commits/79d9570))

## 1.10.0 (2017-05-26)

- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- feature; add isLoading to DropdownMenu and StatelessMenu ([88326a1](https://bitbucket.org/atlassian/atlaskit/commits/88326a1))

## 1.9.0 (2017-05-24)

- feature; dropdown-menu onItemActivated callback to accept event arg and update unit tests ([2ebec38](https://bitbucket.org/atlassian/atlaskit/commits/2ebec38))

## 1.8.0 (2017-05-23)

- feature; support setting elemAfter on DropdownMenu's groups ([7471f2d](https://bitbucket.org/atlassian/atlaskit/commits/7471f2d))

## 1.7.0 (2017-05-10)

- feature; add support for tooltips. ([545cd7e](https://bitbucket.org/atlassian/atlaskit/commits/545cd7e))

## 1.6.0 (2017-05-10)

- feature; bumping icons in dropdown-menu ([b29bcdd](https://bitbucket.org/atlassian/atlaskit/commits/b29bcdd))

## 1.5.0 (2017-05-02)

- feature; bump droplist version + shouldAllowMultilineItems property ([6990b4e](https://bitbucket.org/atlassian/atlaskit/commits/6990b4e))

## 1.4.0 (2017-04-20)

- fix; upgrade droplist dependency version ([0dd084d](https://bitbucket.org/atlassian/atlaskit/commits/0dd084d))
- feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))
- temporarily revert changes ([8d22c2d](https://bitbucket.org/atlassian/atlaskit/commits/8d22c2d))

## 1.2.0 (2017-04-18)

- feature; updated avatar dependency versions for comment, dropdown-menu, droplist, and page ([e4d2ae7](https://bitbucket.org/atlassian/atlaskit/commits/e4d2ae7))

## 1.1.13 (2017-04-13)

- fix; dropdown remove max-width limit in fit container mode ([308a5a3](https://bitbucket.org/atlassian/atlaskit/commits/308a5a3))
- fix; update dropdown menu readme story with new readme component ([2e29f3b](https://bitbucket.org/atlassian/atlaskit/commits/2e29f3b))
- feature; add shouldFitContainer option to dropdown-menu ([26dd7ec](https://bitbucket.org/atlassian/atlaskit/commits/26dd7ec))

## 1.1.11 (2017-03-23)

- fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.1.9 (2017-03-21)

- fix; fixed the dropdown's width restriction. Added a story for the dropdown with very lon ([954c04c](https://bitbucket.org/atlassian/atlaskit/commits/954c04c))
- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.1.8 (2017-03-21)

- fix; get rid of the unnecessary dependencies ([b14e5e9](https://bitbucket.org/atlassian/atlaskit/commits/b14e5e9))

## 1.1.7 (2017-03-20)

- fix; add missing dropdown menu typings ([5d90718](https://bitbucket.org/atlassian/atlaskit/commits/5d90718))
- fix; add missing dropdown menu typings ([26def3f](https://bitbucket.org/atlassian/atlaskit/commits/26def3f))

## 1.1.6 (2017-03-08)

- fix; dummy commit to force release ([d45a0c9](https://bitbucket.org/atlassian/atlaskit/commits/d45a0c9))

## 1.1.5 (2017-03-08)

- fix; update menu to the latest version of droplist component and fix relevant issues afte ([0e0a17a](https://bitbucket.org/atlassian/atlaskit/commits/0e0a17a))

## 1.1.3 (2017-02-14)

- fix; update ak-icon to [@atlaskit](https://github.com/atlaskit)/icon and fix dependencies ([5589fbd](https://bitbucket.org/atlassian/atlaskit/commits/5589fbd))
- fix; refactor stories to use // rather than http:// ([a0826cf](https://bitbucket.org/atlassian/atlaskit/commits/a0826cf))
- update item dependency ([7609c1e](https://bitbucket.org/atlassian/atlaskit/commits/7609c1e))

## 1.1.2 (2017-02-09)

- fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.1.1 (2017-02-07)

- fix; updates package to use ak scoped packages ([0bf5e14](https://bitbucket.org/atlassian/atlaskit/commits/0bf5e14))
