# @atlaskit/mobile-header

## 6.1.9

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116) [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) - Upgrade Typescript from `4.9.5` to `5.4.2`

## 6.1.8

### Patch Changes

- [#67949](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67949) [`4ceb213f9313`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4ceb213f9313) - Migrate packages to use declarative entry points
- Updated dependencies

## 6.1.7

### Patch Changes

- [#61588](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61588) [`c2563e7fb1f5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c2563e7fb1f5) - Remove reliance on logic from the deprecated `@atlaskit/theme` package. Theming is still available via the `@atlaskit/tokens` package.

## 6.1.6

### Patch Changes

- Updated dependencies

## 6.1.5

### Patch Changes

- Updated dependencies

## 6.1.4

### Patch Changes

- [#39787](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39787) [`6900f89eb0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6900f89eb0e) - Internal changes to use space tokens. There is no expected visual or behaviour change.

## 6.1.3

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162) [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete version.json

## 6.1.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 6.1.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 6.1.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 6.0.1

### Patch Changes

- [#28238](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28238) [`005b25fd40d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/005b25fd40d) - Moved `@emotion/styled` to dependency to ensure correct version (v11) is resolved.

## 6.0.0

### Major Changes

- [#27334](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/27334) [`16f5b6bdaee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/16f5b6bdaee) - Peer Dependencies have changed due to the migration from styled-components to @emotion v11.

## 5.0.12

### Patch Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710) [`522a27e6119`](https://bitbucket.org/atlassian/atlassian-frontend/commits/522a27e6119) - Remove `isOpen` prop from @atlaskit/banner, it is now open by default.
- Updated dependencies

## 5.0.11

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874) [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 5.0.10

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492) [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 5.0.9

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650) [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4
- Updated dependencies

## 5.0.8

### Patch Changes

- Updated dependencies

## 5.0.7

### Patch Changes

- [#13136](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13136) [`524b20aff9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/524b20aff9a) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs
- [`3c0349f272a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c0349f272a) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs
- [`591d34f966f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/591d34f966f) - Update package.jsons to remove unused dependencies. Also excludes tests from some build tsconfigs

## 5.0.6

### Patch Changes

- Updated dependencies

## 5.0.5

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857) [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 5.0.4

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497) [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 5.0.3

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885) [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 5.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335) [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 4.0.3

### Patch Changes

- [patch][beb497e1e0](https://bitbucket.org/atlassian/atlassian-frontend/commits/beb497e1e0):

  Change imports to comply with Atlassian conventions

## 4.0.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/banner@10.1.5
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/navigation@36.0.1
  - @atlaskit/theme@9.5.1

## 4.0.1

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/navigation@36.0.0
  - @atlaskit/docs@8.3.1
  - @atlaskit/banner@10.1.4
  - @atlaskit/button@13.3.6

## 4.0.0

### Major Changes

- [major][82a9f69a64](https://bitbucket.org/atlassian/atlassian-frontend/commits/82a9f69a64):

  refactored mobile-header component to use typescript (from flow)

### Patch Changes

- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
  - @atlaskit/docs@8.3.0

## 3.2.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 3.2.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 3.1.3

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 3.1.2

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/banner@10.0.4
  - @atlaskit/button@13.0.9
  - @atlaskit/navigation@35.1.8
  - @atlaskit/icon@19.0.0

## 3.1.1

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/navigation@35.1.5
  - @atlaskit/icon@18.0.0

## 3.1.0

### Minor Changes

- [minor][92a9ce6f80](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92a9ce6f80):

  - Added property `topOffset` to handle cases such as when we need to display banner above the mobile header

## 3.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 2.1.2

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/navigation@34.0.4
  - @atlaskit/theme@8.1.7

## 2.1.1

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/icon@16.0.8
  - @atlaskit/navigation@34.0.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 2.1.0

- [minor][1b1adaea63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b1adaea63):

  - Support using a custom menu button via new customMenu prop

## 2.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/navigation@34.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 2.0.0

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

## 1.1.6

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/navigation@33.3.9
  - @atlaskit/icon@16.0.0

## 1.1.5

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/icon@15.0.2
  - @atlaskit/navigation@33.3.8
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 1.1.4

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/icon@15.0.1
  - @atlaskit/navigation@33.3.7
  - @atlaskit/theme@7.0.0

## 1.1.3

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/navigation@33.3.6
  - @atlaskit/icon@15.0.0

## 1.1.2

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/navigation@33.3.5
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 1.1.1

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 1.1.0

- [minor] changing pageHeading type so can internationalize it easier [6e688a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e688a9)

## 1.0.1

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/navigation@33.1.11
  - @atlaskit/icon@14.0.0

## 1.0.0

- [patch] updated examples [edff5c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/edff5c9)
- [major] Changed layout from position sticky to fixed and adjusted color contrast. [1648676](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1648676)
- [patch] Added dark theme and addressed PR comments/tasks. [de18390](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de18390)
- [major] add mobile header component to atlaskit [93a318a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93a318a)
