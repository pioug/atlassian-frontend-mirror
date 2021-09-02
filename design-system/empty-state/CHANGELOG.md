# @atlaskit/empty-state

## 7.2.1

### Patch Changes

- [`7465c0f0e1d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7465c0f0e1d) - Fix to account for the size/width fallback behaviour. Previously if a user provided a value for the the `width` property it would always be ignored, this is no longer the case.

## 7.2.0

### Minor Changes

- [`20ea31c9fdf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/20ea31c9fdf) - **Deprecation Warning**
  The `size` prop and `Sizes` type have been flagged as deprecated. Both are better described as a width and so internally have been renamed.
  The `size` prop will continue to work in the shortrun before it's formally removed in the component's next major release.

  Housekeeping:

  - Component now uses the new entrypoint format.
  - Prop descriptions have been updated to better describe component behaviors.
  - Small bug fix related to additional props being spread in to some of the component's internals.

### Patch Changes

- Updated dependencies

## 7.1.8

### Patch Changes

- [`331c29990c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/331c29990c9) - Removes `styled-components` as a peer dependency in favour of a direct dependency on `emotion`.
- Updated dependencies

## 7.1.7

### Patch Changes

- Updated dependencies

## 7.1.6

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 7.1.5

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 7.1.4

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 7.1.3

### Patch Changes

- Updated dependencies

## 7.1.2

### Patch Changes

- Updated dependencies

## 7.1.1

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 7.1.0

### Minor Changes

- [`22aa614abb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22aa614abb) - Introduce optional renderImage prop which will be displayed if no imageUrl is provided

### Patch Changes

- [`3414523d6f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3414523d6f) - Rearange buttons order to align with design guidelines
- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 7.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 6.0.12

### Patch Changes

- Updated dependencies

## 6.0.11

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 6.0.10

### Patch Changes

- Updated dependencies

## 6.0.9

### Patch Changes

- [patch][f4374a322a](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4374a322a):

  Change imports to comply with Atlassian conventions- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
  - @atlaskit/button@13.3.11

## 6.0.8

### Patch Changes

- [patch][c5182f1c53](https://bitbucket.org/atlassian/atlassian-frontend/commits/c5182f1c53):

  Widens the accepted Types for description to include any react node- Updated dependencies [dae900bf82](https://bitbucket.org/atlassian/atlassian-frontend/commits/dae900bf82):

- Updated dependencies [8c9e4f1ec6](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c9e4f1ec6):
  - @atlaskit/build-utils@2.6.4
  - @atlaskit/docs@8.5.0

## 6.0.7

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/button@13.3.7
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1

## 6.0.6

### Patch Changes

- [patch][6c9c2d5487](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c9c2d5487):

  Fixes empty state image not having appropriate accessibility attributes.- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):

- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
  - @atlaskit/theme@9.3.0

## 6.0.5

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 6.0.4

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 6.0.3

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 6.0.2

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 6.0.1

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 6.0.0

### Major Changes

- [major][433311c16a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/433311c16a):

  @atlaskit/empty-state has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 5.0.3

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 5.0.2

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 5.0.1

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
  - @atlaskit/button@13.0.4
  - @atlaskit/spinner@12.0.0

## 5.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 4.0.4

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/spinner@10.0.7
  - @atlaskit/theme@8.1.7

## 4.0.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 4.0.2

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

## 4.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 4.0.0

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

## 3.1.4

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 3.1.3

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/spinner@9.0.12
  - @atlaskit/theme@7.0.0

## 3.1.2

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 3.1.1

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 3.1.0

- [minor] Adds new imageWidth and imageHeight props, useful for fixing the image dimensions while it's loading so the page doesn't bounce around. Changes the root element to use max-width instead of width so it shrinks down in smaller containers. [3209be4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3209be4)

## 3.0.9

- [patch] Pulling the shared styles from @atlaskit/theme and removed dependency on util-shraed-styles [7d51a09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d51a09)

## 3.0.8

- [patch] Moved the atlaskit button, spinner, theme and util-shared-styles to dependencies from peer dependdency [a2d1132](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d1132)

## 3.0.7

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 3.0.5

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/spinner@9.0.6
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 3.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5

## 3.0.3

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/docs@5.0.2

## 3.0.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/spinner@9.0.3

## 3.0.1

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/button@9.0.2
  - @atlaskit/spinner@9.0.2
  - @atlaskit/docs@5.0.1

## 3.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0

## 2.1.3

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/button@8.2.3

## 2.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/spinner@7.0.2

## 2.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/spinner@7.0.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 2.1.0

- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/button@8.1.0

## 2.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/spinner@6.0.1
  - @atlaskit/docs@4.0.1

## 2.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0

## 1.1.2

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/docs@3.0.4

## 1.1.0

- [patch] Remove null as we allowed void values [7ab743b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7ab743b)
- [patch] Update empty state and button to have consistent types [f0da143](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0da143)
- [minor] Update Empty state to use ButtonGroup from @atlaskit/button [e4a8dcf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e4a8dcf)

## 1.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 0.3.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 0.2.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 0.2.1

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 0.2.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 0.1.3

- [patch] Color of the description changed to N800 [ebf65be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebf65be)

## 0.1.0

- [patch] Updates dependency on docs/ to ^1.0.1 [36c7ef8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36c7ef8)
- [minor] Initial release [afbb1e5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/afbb1e5)
