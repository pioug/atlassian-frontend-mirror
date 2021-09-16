# @atlaskit/page-header

## 10.2.2

### Patch Changes

- Updated dependencies

## 10.2.1

### Patch Changes

- [`b3893a2357b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3893a2357b) - Fixes a styling issue that arose in v10.2.0 relating to the lineHeight of the page header's title.

## 10.2.0

### Minor Changes

- [`6b76b1ceab3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b76b1ceab3) - This change removes the dependency `styled components`. It has been refactored to use `@emotion/core` instead. Some examples have also been updated. There should be no UI or UX change.

### Patch Changes

- [`cd34d8ca8ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd34d8ca8ea) - Internal wiring up to the tokens techstack, no code changes.

## 10.1.3

### Patch Changes

- [`c5785203506`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c5785203506) - Updated homepage in package.json

## 10.1.2

### Patch Changes

- [`ec0abf56583`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec0abf56583) - Fixes internal test snapshots.
- Updated dependencies

## 10.1.1

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 10.1.0

### Minor Changes

- [`169a082e5b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/169a082e5b4) - Added id prop to the `PageHeader` component. Now header text can be used as label of other component via aria-labelledby attribute

## 10.0.11

### Patch Changes

- [`44e6c77d533`](https://bitbucket.org/atlassian/atlassian-frontend/commits/44e6c77d533) - Renames exports in page header examples to be more descriptive. For example, Example is renamed to PageHeaderDefaultExample.

## 10.0.10

### Patch Changes

- [`ac373538cdd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac373538cdd) - Page header migrated from atlaskit to atlassian.design. Documentation and examples added along with updated snapshot test.

## 10.0.9

### Patch Changes

- [`8450e34990c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8450e34990c) - [ux] Conditionally render ActionsWrapper for PageHeader's actions when provided.

## 10.0.8

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.

## 10.0.7

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 10.0.6

### Patch Changes

- [`be0acecf54`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be0acecf54) - [ux] page-header is a non interactive element and it was getting focus ring while clicking on it. Now focus ring has been removed to fix this issue.

## 10.0.5

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

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

- [`f9fe8ed609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9fe8ed609) - Added tabIndex and innerRef to underlying heading so it can be focused

## 10.0.1

### Patch Changes

- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 10.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 9.0.20

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 9.0.19

### Patch Changes

- [patch][45dcd1ca21](https://bitbucket.org/atlassian/atlassian-frontend/commits/45dcd1ca21):

  Change imports to comply with Atlassian conventions- Updated dependencies [443bb984ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/443bb984ab):

- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [71c1de8ee1](https://bitbucket.org/atlassian/atlassian-frontend/commits/71c1de8ee1):
- Updated dependencies [ffe88383f4](https://bitbucket.org/atlassian/atlassian-frontend/commits/ffe88383f4):
- Updated dependencies [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
  - @atlaskit/page@11.0.13
  - @atlaskit/button@13.3.11
  - @atlaskit/select@11.0.10
  - @atlaskit/breadcrumbs@9.2.9
  - @atlaskit/inline-edit@10.0.31

## 9.0.18

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/breadcrumbs@9.2.6
  - @atlaskit/button@13.3.7
  - @atlaskit/inline-edit@10.0.27
  - @atlaskit/page@11.0.12
  - @atlaskit/select@11.0.7
  - @atlaskit/textfield@3.1.6
  - @atlaskit/theme@9.5.1

## 9.0.17

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):

- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/theme@9.5.0
  - @atlaskit/breadcrumbs@9.2.5
  - @atlaskit/button@13.3.5
  - @atlaskit/page@11.0.10
  - @atlaskit/select@11.0.4

## 9.0.16

- Updated dependencies [30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):
  - @atlaskit/inline-edit@10.0.24
  - @atlaskit/select@11.0.0
  - @atlaskit/breadcrumbs@9.2.4
  - @atlaskit/button@13.3.4

## 9.0.15

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

## 9.0.14

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 9.0.13

### Patch Changes

- [patch][0b09089d27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0b09089d27):

  Text alignment of action items will now only be applied to direct children

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

- Updated dependencies [84887b940c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84887b940c):
  - @atlaskit/inline-edit@10.0.13
  - @atlaskit/textfield@3.0.0

## 9.0.7

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 9.0.6

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 9.0.5

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 9.0.4

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/breadcrumbs@9.0.3
  - @atlaskit/button@13.0.11
  - @atlaskit/inline-edit@10.0.5
  - @atlaskit/select@10.0.0

## 9.0.3

### Patch Changes

- [patch][93bcf314c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93bcf314c6):

  Added missing tslib dep

## 9.0.2

### Patch Changes

- [patch][3ce8deb182](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ce8deb182):

  Page-header now supports a flex parent around the actions

## 9.0.1

- Updated dependencies [52b15f57d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/52b15f57d3):
  - @atlaskit/breadcrumbs@9.0.0

## 9.0.0

- [major][afb88684ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/afb88684ad):

  - @atlaskit/page-header has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 8.0.1

- Updated dependencies [3af5a7e685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3af5a7e685):
  - @atlaskit/page@11.0.0

## 8.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 7.0.6

- Updated dependencies [6cdf11238d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cdf11238d):
  - @atlaskit/inline-edit@9.0.5
  - @atlaskit/textfield@1.0.0

## 7.0.5

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/breadcrumbs@7.0.4
  - @atlaskit/button@12.0.3
  - @atlaskit/inline-edit@9.0.1
  - @atlaskit/select@8.1.1
  - @atlaskit/textfield@0.4.4
  - @atlaskit/theme@8.1.7

## 7.0.4

- Updated dependencies [71e2d2cb3c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/71e2d2cb3c):
  - @atlaskit/inline-edit@9.0.0

## 7.0.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/breadcrumbs@7.0.3
  - @atlaskit/inline-edit@8.0.2
  - @atlaskit/page@9.0.3
  - @atlaskit/select@8.0.5
  - @atlaskit/textfield@0.4.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 7.0.2

- Updated dependencies [8eff47cacb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8eff47cacb):
  - @atlaskit/textfield@0.4.0

## 7.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/breadcrumbs@7.0.1
  - @atlaskit/inline-edit@8.0.1
  - @atlaskit/page@9.0.1
  - @atlaskit/select@8.0.3
  - @atlaskit/textfield@0.3.1
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

## 6.1.4

- Updated dependencies [e9b824bf86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9b824bf86):
  - @atlaskit/textfield@0.2.0

## 6.1.3

- [patch][4b0fb4e85f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b0fb4e85f):

  - Allow items in Page Header actions to wrap on small screens.

## 6.1.2

- Updated dependencies [06713e0a0c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06713e0a0c):
  - @atlaskit/breadcrumbs@6.0.15
  - @atlaskit/select@7.0.0

## 6.1.1

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/breadcrumbs@6.0.14
  - @atlaskit/button@10.1.1
  - @atlaskit/inline-edit@7.1.7
  - @atlaskit/page@8.0.12
  - @atlaskit/select@6.1.13
  - @atlaskit/textfield@0.1.4
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 6.1.0

- [minor][6cfa757](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cfa757):

  - PageHeader without truncation now wraps actions below the heading to avoid the heading becoming too narrow

## 6.0.9

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/breadcrumbs@6.0.12
  - @atlaskit/button@10.0.4
  - @atlaskit/field-text@7.0.16
  - @atlaskit/inline-edit@7.1.6
  - @atlaskit/input@4.0.8
  - @atlaskit/single-select@6.0.10
  - @atlaskit/theme@7.0.0

## 6.0.8

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/breadcrumbs@6.0.11
  - @atlaskit/field-text@7.0.15
  - @atlaskit/inline-edit@7.1.4
  - @atlaskit/page@8.0.11
  - @atlaskit/single-select@6.0.8
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 6.0.7

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 6.0.6

- [patch] Pulling the shared styles from @atlaskit/theme and removed dependency on util-shraed-styles [7d51a09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d51a09)

## 6.0.5

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 6.0.3

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/page@8.0.3
  - @atlaskit/input@4.0.3
  - @atlaskit/inline-edit@7.0.4
  - @atlaskit/field-text@7.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/breadcrumbs@6.0.5

## 6.0.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/page@8.0.2
  - @atlaskit/single-select@6.0.3
  - @atlaskit/inline-edit@7.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/input@4.0.2
  - @atlaskit/field-text@7.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/breadcrumbs@6.0.4

## 6.0.1

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/input@4.0.1
  - @atlaskit/inline-edit@7.0.2
  - @atlaskit/field-text@7.0.2
  - @atlaskit/page@8.0.1
  - @atlaskit/button@9.0.3
  - @atlaskit/breadcrumbs@6.0.3

## 6.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/single-select@6.0.0
  - @atlaskit/input@4.0.0
  - @atlaskit/inline-edit@7.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/page@8.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/breadcrumbs@6.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/page@8.0.0
  - @atlaskit/single-select@6.0.0
  - @atlaskit/input@4.0.0
  - @atlaskit/inline-edit@7.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/breadcrumbs@6.0.0

## 5.1.4

- [patch] Remove or update \$FlowFixMe [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/inline-edit@6.1.4
  - @atlaskit/field-text@6.1.1
  - @atlaskit/button@8.2.4
  - @atlaskit/breadcrumbs@5.1.2

## 5.1.3

- [patch] Fix \$FlowFixMe and release packages [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/single-select@5.2.1
  - @atlaskit/button@8.2.2

## 5.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/single-select@5.1.2
  - @atlaskit/input@3.0.2
  - @atlaskit/inline-edit@6.1.3
  - @atlaskit/field-text@6.0.4
  - @atlaskit/button@8.1.2
  - @atlaskit/page@7.1.1

## 5.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/single-select@5.1.1
  - @atlaskit/inline-edit@6.1.2
  - @atlaskit/button@8.1.1
  - @atlaskit/breadcrumbs@5.1.1
  - @atlaskit/docs@4.1.1

## 5.1.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/single-select@5.1.0
  - @atlaskit/page@7.1.0
  - @atlaskit/breadcrumbs@5.1.0
  - @atlaskit/inline-edit@6.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/field-text@6.0.2
  - @atlaskit/button@8.1.0

## 5.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/page@7.0.1
  - @atlaskit/inline-edit@6.0.1
  - @atlaskit/field-text@6.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/docs@4.0.1
  - @atlaskit/breadcrumbs@5.0.1

## 5.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/page@7.0.0
  - @atlaskit/single-select@5.0.0
  - @atlaskit/inline-edit@6.0.0
  - @atlaskit/input@3.0.0
  - @atlaskit/field-text@6.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/breadcrumbs@5.0.0

## 4.0.3

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/page@6.0.4

## 4.0.2

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/page@6.0.3
  - @atlaskit/single-select@4.0.3
  - @atlaskit/inline-edit@5.0.2
  - @atlaskit/input@2.0.2
  - @atlaskit/field-text@5.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/breadcrumbs@4.1.3
  - @atlaskit/docs@3.0.4

## 4.0.1

- [patch] Fixed alignment of title for page-header [a9f95f6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a9f95f6)

## 4.0.0

- [major] Titles no longer truncate by default. Use the truncateTitle prop instead. [6879ef0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6879ef0)

## 3.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 2.4.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 2.4.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 2.3.0

- [minor] Add disableTitleStyles prop to enable the composition of components that may be affected by the default heading styles. This is a stop-gap measure until we can make a breaking change to update the API to inherently facilitate this. [0866a89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0866a89)

## 2.2.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 2.2.1

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 2.2.0

- [minor] Update readme and docs [7a53047](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7a53047)

## 2.1.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 2.0.7

- [patch] Update dependencies [623f8ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623f8ca)

## 2.0.1

- [patch] Migrated page-header to mk2. Fixed breadcrumbs main entry point [51bf0c7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51bf0c7)
- [patch] Migrated page-header to mk2. Fixed breadcrumbs main entry point [51bf0c7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/51bf0c7)
