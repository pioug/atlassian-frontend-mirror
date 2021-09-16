# @atlaskit/panel

## 0.4.7

### Patch Changes

- Updated dependencies

## 0.4.6

### Patch Changes

- Updated dependencies

## 0.4.5

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 0.4.4

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 0.4.3

### Patch Changes

- Updated dependencies

## 0.4.2

### Patch Changes

- Updated dependencies

## 0.4.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 0.4.0

### Minor Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 0.3.5

### Patch Changes

- [patch][1532773dab](https://bitbucket.org/atlassian/atlassian-frontend/commits/1532773dab):

  Remove 'export \*' for improved tree shaking- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/button@13.3.10

## 0.3.4

### Patch Changes

- [patch][7375ea9ec4](https://bitbucket.org/atlassian/atlassian-frontend/commits/7375ea9ec4):

  Change imports to comply with Atlassian conventions

## 0.3.3

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/page@11.0.12
  - @atlaskit/theme@9.5.1

## 0.3.2

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/page@11.0.11

## 0.3.1

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result- Updated dependencies [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5
  - @atlaskit/page@11.0.10

## 0.3.0

### Minor Changes

- [minor][178bf178a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/178bf178a6):

  Added new PanelStateless component

## 0.2.6

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 0.2.5

### Patch Changes

- [patch][e7cfc5d77a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7cfc5d77a):

  Dependency '@atlaskit/size-detector' is unused in package.json.

## 0.2.4

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 0.2.3

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/icon@19.0.0

## 0.2.2

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/icon@18.0.0

## 0.2.1

- Updated dependencies [3af5a7e685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3af5a7e685):
  - @atlaskit/page@11.0.0

## 0.2.0

- [minor][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 0.1.3

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/theme@8.1.7

## 0.1.2

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/icon@16.0.8
  - @atlaskit/page@9.0.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 0.1.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/page@9.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 0.1.0

- [minor][76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):

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

## 0.0.13

- Updated dependencies [0de1251ad1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0de1251ad1):
  - @atlaskit/size-detector@6.0.0

## 0.0.12

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/icon@16.0.0

## 0.0.11

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/icon@15.0.2
  - @atlaskit/page@8.0.12
  - @atlaskit/size-detector@5.0.9
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 0.0.10

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/icon@15.0.1
  - @atlaskit/theme@7.0.0

## 0.0.9

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/icon@15.0.0

## 0.0.8

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/page@8.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 0.0.7

- [patch][21f5216](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21f5216):

  - Remove enzyme-to-json as it is used in our jestFrameworkSetup.js

## 0.0.6

- [patch] Fix button-toggle vertical positioning in IE 11 [92932e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92932e6)

## 0.0.5

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 0.0.4

- [patch] Add vertical spacing styles [03fd7f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/03fd7f9)

## 0.0.3

- [patch] Update README title and description [43b712e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/43b712e)

## 0.0.2

- [patch] Fix version for icon [0fd4b44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0fd4b44)
