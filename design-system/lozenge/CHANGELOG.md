# @atlaskit/lozenge

## 11.1.1

### Patch Changes

- Updated dependencies

## 11.1.0

### Minor Changes

- [`d7caf75e732`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7caf75e732) - - [ux] Colors are now sourced through tokens.
  - Deprecate `@atlaskit/lozenge/theme` entry-point.

### Patch Changes

- Updated dependencies

## 11.0.0

### Major Changes

- [`1cd379a2199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1cd379a2199) - - In this version we made `Lozenge` dramatically faster and lighter. 🤩

  - General performance improvements.

  - We are now exporting a new `style` prop which you can use to pass a custom `backgroundColor` and `color`.

  - **BREAKING** We have removed the deprecated `theme` prop. Don't worry if you do use the theming API, you can now use the new `style` prop for custom styling.

  **Before**:

  ```tsx
  import Lozenge from '@atlaskit/lozenge';

  type GetThemeTokensFn<ThemeTokens, ThemeProps> = (
    props: ThemeProps,
  ) => ThemeTokens;

  const lozengeTheme = (
    getTokens: GetThemeTokensFn<ThemeTokens, ThemeProps>,
    themeProps: ThemeProps,
  ): ThemeTokens => {
    const defaultTokens = getTokens(themeProps);

    if (themeProps.appearance === 'removed') {
      return {
        ...defaultTokens,
        textColor: 'grey',
      };
      return defaultTokens;
    }
  };

  <Lozenge appearance="removed" theme={lozengeTheme}>
    removed
  </Lozenge>;
  ```

  **After**:

  ```tsx
  import Badge, { BadgeProps } from '@atlaskit/badge';

  <Lozenge appearance="removed" style={{ color: 'grey' }}>
    removed
  </Lozenge>;
  ```

  - **BREAKING** We have removed the support of `appearance` prop object value. Please use `style` prop for customization.

  **Before**:

  ```tsx
  import Lozenge from '@atlaskit/lozenge';

  <Lozenge appearance={{ backgroundColor: 'blue', textColor: 'white' }}>
    custom
  </Lozenge>;
  ```

  **After**:

  ```tsx
  import Lozenge from '@atlaskit/lozenge';

  <Lozenge style={{ backgroundColor: 'blue', color: 'white' }}>custom</Lozenge>;
  ```

  **Running the codemod cli**

  To run the codemod: **You first need to have the latest version installed**

  ```bash
  yarn upgrade @atlaskit/lozenge@^11.0.0
  ```

  Once upgraded, use `@atlaskit/codemod-cli` via `npx`:

  ```bash
  npx @atlaskit/codemod-cli --parser babel --extensions ts,tsx,js [relativePath]
  ```

  The CLI will show a list of components and versions so select `@atlaskit/lozenge@^11.0.0` and you will automatically be upgraded.

  What will be changed:

  - It will move `backgroundColor` and `textColor` from `appearance` prop (if object is passed as `appearance` prop value) to `style` prop.

  Run `npx @atlaskit/codemod-cli -h` for more details on usage.

  For Atlassians,

  refer to the [documentation](https://developer.atlassian.com/cloud/framework/atlassian-frontend/codemods/01-atlassian-codemods/) for more details on the codemod CLI.

### Patch Changes

- [`0d0ecc6e790`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d0ecc6e790) - Corrects eslint supressions.
- Updated dependencies

## 10.1.4

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 10.1.3

### Patch Changes

- [`9c98e8227f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c98e8227f6) - Internal refactor for style declarations.
- [`42e722938da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/42e722938da) - Converted class components to functional components
- [`8f0e5cbea57`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f0e5cbea57) - Migrated from `@compiled` to `@emotion`
- [`f84de8233f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f84de8233f3) - Add Techstacks rules to package.json
- [`7bb3268f2c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7bb3268f2c8) - Removed version.json and unused dependency - `react-test-renderer`
- [`f78ced42525`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f78ced42525) - Wrapped the root component in `React.memo()` to memorize the rendered lozenge

## 10.1.2

### Patch Changes

- [`69badd52b1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/69badd52b1) - Bumps compiled to v0.6 to surface various fixes

## 10.1.1

### Patch Changes

- [`61d08bb92d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61d08bb92d) - Upgrades @compiled/react to v0.5.2

## 10.1.0

### Minor Changes

- [`05ef83ee27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/05ef83ee27) - Lozenge now uses [`@compiled/react`](https://compiledcssinjs.com) to power its styles.

## 10.0.7

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 10.0.6

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

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

## 9.1.9

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 9.1.8

### Patch Changes

- Updated dependencies

## 9.1.7

### Patch Changes

- [patch][a4d063330a](https://bitbucket.org/atlassian/atlassian-frontend/commits/a4d063330a):

  Change imports to comply with Atlassian conventions- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):

  - @atlaskit/webdriver-runner@0.3.4

## 9.1.6

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/webdriver-runner@0.3.0

## 9.1.5

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0

## 9.1.4

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/theme@9.5.1

## 9.1.3

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):

  - @atlaskit/theme@9.5.0

## 9.1.2

### Patch Changes

- [patch][557a8e2451](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a8e2451):

  Rebuilds package to fix typescript typing error.

## 9.1.1

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 9.1.0

### Minor Changes

- [minor][10e0798da6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/10e0798da6):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help products to write better integration and end to end tests.

## 9.0.7

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 9.0.6

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 9.0.5

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 9.0.4

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 9.0.3

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 9.0.2

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 9.0.1

### Patch Changes

- [patch][f8778d517a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f8778d517a):

  Remove index.ts from built module

## 9.0.0

- [major][ed41cac6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed41cac6ac):

  - Lozenge has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 8.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 7.0.3

- [patch][73a5c6f3dc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/73a5c6f3dc):

  - Add emotion and remove styled-components

## 7.0.2

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/theme@8.1.7

## 7.0.1

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

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

## 6.2.4

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 6.2.3

- [patch][d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):

  - Change API to experimental theming API to namespace component themes into separate contexts and make theming simpler. Update all dependant components.

## 6.2.2

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 6.2.1

- [patch] Pulling the shared styles from @atlaskit/theme and removed dependency on util-shraed-styles [7d51a09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d51a09)

## 6.2.0

- [minor] Use new theme API. Adds "theme" prop and exports new theme types. [4b36fd6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b36fd6)

## 6.1.8

- [patch] AK-5321 Lozenge with maxWidth should be constrained by container width [969233e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/969233e)

## 6.1.7

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 6.1.5

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/docs@5.0.6

## 6.1.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/theme@5.1.3

## 6.1.3

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/theme@5.1.2
  - @atlaskit/docs@5.0.2

## 6.1.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/theme@5.1.1

## 6.1.1

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/docs@5.0.1

## 6.1.0

- [minor] Improve behavior when using a narrow container [ebf6b97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebf6b97)
- [none] Updated dependencies [ebf6b97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebf6b97)

## 6.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0

## 5.0.4

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/theme@4.0.4

## 5.0.3

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/docs@4.1.1

## 5.0.2

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2

## 5.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 5.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 4.1.1

- [patch] Updae bold color to N800 [0838cb0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0838cb0)
- [patch] Update colors of appearance to new color palette pairings [979aff5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/979aff5)
- [none] Updated dependencies [0838cb0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0838cb0)
- [none] Updated dependencies [979aff5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/979aff5)

## 4.1.0

- [patch] Update appearance enum test [b42eaa5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b42eaa5)
- [patch] Update test [c668ac9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c668ac9)
- [minor] Update Lozenge to accept colors pairing [4638c7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4638c7a)
- [none] Updated dependencies [b42eaa5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b42eaa5)
- [none] Updated dependencies [c668ac9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c668ac9)
- [none] Updated dependencies [4638c7a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4638c7a)

## 4.0.1

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/docs@3.0.4

## 4.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 3.6.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 3.6.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 3.5.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 3.5.1

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 3.5.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 3.4.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.4.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.1.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 3.1.0 (2017-07-17)

- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.0.3 (2017-07-13)

- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

## 3.0.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 3.0.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 2.0.0 (2017-03-27)

- bump major to avoid API conflict with mentions ([1d01253](https://bitbucket.org/atlassian/atlaskit/commits/1d01253))
- updating dependencies ([d293404](https://bitbucket.org/atlassian/atlaskit/commits/d293404))
- breaking; update lozenge major version
- breaking; removed classnames dep and .d.ts file

## 1.0.11 (2017-03-23)

- fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))
- refactor the lozenge component to use styled-components ([eb738ca](https://bitbucket.org/atlassian/atlaskit/commits/eb738ca))
- breaking; now requires peerDep of "styled-components"

## 1.0.9 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.8 (2017-02-28)

- fix; dummy commit to release stories ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 1.0.6 (2017-02-28)

- fix; dummy commit to fix broken stories and missing registry pages ([a31e92a](https://bitbucket.org/atlassian/atlaskit/commits/a31e92a))

## 1.0.6 (2017-02-28)

- fix; dummy commit to release stories for components ([a105c02](https://bitbucket.org/atlassian/atlaskit/commits/a105c02))

## 1.0.5 (2017-02-28)

- fix; removes jsdoc annotations and moves them to usage.md ([2c53fea](https://bitbucket.org/atlassian/atlaskit/commits/2c53fea))

## 1.0.4 (2017-02-20)

- fix; use correctly scoped package names in npm docs ([91dbd2f](https://bitbucket.org/atlassian/atlaskit/commits/91dbd2f))

## 1.0.2 (2017-02-07)

- fix; Updates docs with yarn installation instructions ([aebf31a](https://bitbucket.org/atlassian/atlaskit/commits/aebf31a))
- Add TypeScript declarations for lozenge. ([5993cf8](https://bitbucket.org/atlassian/atlaskit/commits/5993cf8))

## 1.0.1 (2017-02-06)

- fix; Updates package to use scoped ak packages ([b655c30](https://bitbucket.org/atlassian/atlaskit/commits/b655c30))
