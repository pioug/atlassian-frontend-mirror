# @atlaskit/theme

## 12.6.6

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116) [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) - Upgrade Typescript from `4.9.5` to `5.4.2`

## 12.6.5

### Patch Changes

- [#80085](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80085) [`7febfed958dd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7febfed958dd) - Update usage of `React.FC` to explicity include `children`

## 12.6.4

### Patch Changes

- [#72130](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72130) [`b037e5451037`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b037e5451037) - Update new button text color fallback for default theme (non-token) to match that of old button current text color

## 12.6.3

### Patch Changes

- [#71146](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71146) [`13f5d2d5911d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/13f5d2d5911d) - Minor internal codemod tweaks
- Updated dependencies

## 12.6.2

### Patch Changes

- [#39749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39749) [`e6b69f455c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b69f455c3) - Connect yarn changeset to packages, upgrade adf-schema

## 12.6.1

### Patch Changes

- [#39407](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39407) [`c6db573350d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6db573350d) - The themed() and AtlaskitThemeProvider legacy theming API's are now marked as deprecated and eslint rules have been modified to disallow new usage of them.

## 12.6.0

### Minor Changes

- [#39442](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39442) [`ebefd4048ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ebefd4048ff) - Set tooltip zindex to 9999

## 12.5.6

### Patch Changes

- [#38731](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38731) [`9af31f3c1ae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9af31f3c1ae) - Delete version.json

## 12.5.5

### Patch Changes

- [#37240](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37240) [`69648c31426`](https://bitbucket.org/atlassian/atlassian-frontend/commits/69648c31426) - correct border.focused fallback to B200 to meet contrast requirement

## 12.5.4

### Patch Changes

- [#32935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32935) [`b1bdec7cce2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1bdec7cce2) - Internal change to enforce token usage for spacing properties. There is no expected visual or behaviour change.

## 12.5.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 12.5.2

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 12.5.1

### Patch Changes

- [#33339](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33339) [`5e717fd317d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e717fd317d) - [ux] correct light mode fallback color of deprecated placeholder util

## 12.5.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 12.4.2

### Patch Changes

- [#32791](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32791) [`e77500e9f1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e77500e9f1e) - Migrates unit tests from enzyme to RTL.

## 12.4.1

### Patch Changes

- [#32211](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32211) [`3993abb044c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3993abb044c) - Adds deprecation jsdoc warnings to typography mixins. Please use `@atlaskit/heading` if these mixins are currently being relied upon.

## 12.4.0

### Minor Changes

- [#32240](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32240) [`5e26db5a6a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5e26db5a6a1) - Deprecate `gridSize` in favor of space tokens. More information about the new spacing scale and tokens can be found at https://atlassian.design/foundations/spacing/#scale

## 12.3.0

### Minor Changes

- [#31206](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31206) [`261420360ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/261420360ec) - Upgrades component types to support React 18.

## 12.2.9

### Patch Changes

- [#30125](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30125) [`7f5f23dcb68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f5f23dcb68) - Introduce shape tokens to some packages.

## 12.2.8

### Patch Changes

- [#29693](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29693) [`1439e7f646c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1439e7f646c) - Add theme into push model consumption

## 12.2.7

### Patch Changes

- Updated dependencies

## 12.2.6

### Patch Changes

- [#28064](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28064) [`b0f6dd0bc35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0f6dd0bc35) - Updated to use typography tokens. There is no expected behaviour or visual change.

## 12.2.5

### Patch Changes

- Updated dependencies

## 12.2.4

### Patch Changes

- Updated dependencies

## 12.2.3

### Patch Changes

- Updated dependencies

## 12.2.2

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303) [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op change to introduce spacing tokens to design system components.

## 12.2.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874) [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 12.2.0

### Minor Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004) [`8264d59a847`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8264d59a847) - Updates `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

## 12.1.10

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492) [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 12.1.9

### Patch Changes

- [#22029](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22029) [`c8145459eb5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8145459eb5) - [ux] Updating skeleton token in @atlakist/menu, @atlaskit/theme
- Updated dependencies

## 12.1.8

### Patch Changes

- Updated dependencies

## 12.1.7

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650) [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 12.1.6

### Patch Changes

- Updated dependencies

## 12.1.5

### Patch Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618) [`62edf20ab1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62edf20ab1e) - Migrates all usage of brand tokens to either selected or information tokens. This change is purely for semantic reasons, there are no visual or behavioural changes.
- Updated dependencies

## 12.1.4

### Patch Changes

- Updated dependencies

## 12.1.3

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752) [`58884c2f6c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58884c2f6c1) - Internal code change turning on a new linting rule.
- [`f9ee7954a18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9ee7954a18) - Adds deprecation messages to `visuallyHidden` and `focusRing` exports.
- Updated dependencies

## 12.1.2

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when auto-fixing by correctly formatting token ids.
- Updated dependencies

## 12.1.1

### Patch Changes

- Updated dependencies

## 12.1.0

### Minor Changes

- [#17576](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17576) [`85d6182cad7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/85d6182cad7) - **Note**: It is a re-release of the wrongly `patched` version `12.0.2` that should have been a `minor` release.

  [ux] Instrumented theme with the new theming package, @atlaskit/tokens.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).
  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

## 12.0.2

### Minor Changes

_WRONG RELEASE TYPE - DON'T USE_

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998) [`420621d097e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/420621d097e) - [ux] Instrumented theme with the new theming package, @atlaskit/tokens.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).
  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds for this package now pass through a tokens babel plugin, removing runtime invocations of the tokens() function and improving bundle size.
- Updated dependencies

## 12.0.1

### Patch Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777) [`b99deb544f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b99deb544f9) - Patches an unsafe selector used by Theme in older browsers.
- Updated dependencies

## 12.0.0

### Major Changes

- [#14319](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14319) [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - **Breaking Changes:**

  - Package no longer has a peer dependency on `styled-components`. `styled-components` was used exclusively in
    `AtlaskitThemeProvider` and `Reset`. `Reset` has been removed (see below), while `AtlaskitThemeProvider` has been re-worked
    to remove the need for the dependency. To maintain compatibility we've provided a codemod to migrate usage.
  - `math` has been formally removed from the package. The usage of this package was already discouraged but for
    any remaining usages there is a codemod to migrate your code.
  - `Reset` has been removed. We want to lean more on the `@atlaskit/css-reset` as a canonical approach to resetting.
  - `Appearance` has been removed, this HOC component had no usage
  - `FLATTENED` has been removed, this constant had no usage

  **Housekeeping**:

  - Package no longer uses `exenv`
  - `Context` has been removed from the package; this component wasn't ever exported
  - Documentation and examples have been updated

  **Upgrading with codemod**

  You first need to have the latest version of `@atlaskit/theme` installed before you can run the codemod

  ```bash
  yarn upgrade @atlaskit/theme@^12.0.0
  ```

  Then you can use our cli tool to run the codemod.

  ```bash
  npx @atlaskit/codemod-cli /path/to/target/directory --parser [tsx | flow | babel]
  ```

  This will automatically migrate `math` and the `AtlaskitThemeProvider` to the updated usage.

### Patch Changes

- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Fixes a bug where the AKThemeProvider could add multiple style elements on the same page if multiple instances of the component were supplied.
- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - The `AtlaskitThemeProvider` has been reworked to be a functional component internally using hooks.
- [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - Add codemod for replacing `@atlaskit/theme/math` functions with simple binary JS expressions.
- Updated dependencies

## 11.5.2

### Patch Changes

- [#14203](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14203) [`3316bd1f594`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3316bd1f594) - The h300 function in @atlaskit/theme/typography now returns a constant string literal for the textTransform field now. This should make it compatible with React's style prop type definitions, by extension, Emotion.

## 11.5.1

### Patch Changes

- Updated dependencies

## 11.5.0

### Minor Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864) [`a8634047ae4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a8634047ae4) - Internal color change to use tokens.

## 11.4.2

### Patch Changes

- Updated dependencies

## 11.4.1

### Patch Changes

- Updated dependencies

## 11.4.0

### Minor Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837) [`950a744a150`](https://bitbucket.org/atlassian/atlassian-frontend/commits/950a744a150) - [ux] Typography colors now use tokens.

### Patch Changes

- Updated dependencies

## 11.3.0

### Minor Changes

- [#12251](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12251) [`e6b210c7e2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b210c7e2e) - Removes styled-components from common entrypoints "typography" and "constants" in favour of using a syntax that is compatible between both emotion and styled-components.

## 11.2.1

### Patch Changes

- [#10569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10569) [`adf3cbfbd47`](https://bitbucket.org/atlassian/atlassian-frontend/commits/adf3cbfbd47) - [ux] Fix Reset text color

## 11.2.0

### Minor Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230) [`20c3881896c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/20c3881896c) - Exposes `useGlobalTheme` from components entrypoint

### Patch Changes

- [`0d348445e23`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d348445e23) - AKThemeProvider now correctly refreshes the ThemeProvider context when the mode changes.

## 11.1.0

### Minor Changes

- [#9756](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9756) [`bc02e5ad605`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc02e5ad605) - Theme now exposes an additional custom hook for consumption of the theme that behave the same as the `Consumer` component. `useTheme` is returned in addition to the `Provider` and `Consumer` in the `createTheme` function.

  For ease of consumption of the global theme, a pre-configured usage of `useTheme` hook has been also been exported
  as `useGlobalTheme`.

## 11.0.3

### Patch Changes

- [#9083](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9083) [`bb0886583a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bb0886583a0) - Adding new Layers type for optimised layer name to z-index conversion

## 11.0.2

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857) [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 11.0.1

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497) [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 11.0.0

### Major Changes

- [#5344](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5344) [`42803d6708`](https://bitbucket.org/atlassian/atlassian-frontend/commits/42803d6708) - Remove references to deep import paths in TS declaration files.

  Released as a major to force dependents with deep import paths to no longer be able to reference newer versions of theme

## 10.0.5

### Patch Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749) [`e45be534ce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e45be534ce) - [ux] Unwinding anchor style change in AltaskitThemeProvider. Restoring color: !important to button to deal with specificity wars
- [`642a8a7735`](https://bitbucket.org/atlassian/atlassian-frontend/commits/642a8a7735) - [ux] `AtlaskitThemeProvider` (deprecated) applies a colour reset to anchor tags. This was impacting the colouring of `@atlaskit/button`. To go around specificity issues caused by `AtlaskitThemeProvider` in the past `@atlaskit/button` would apply a `!important` to it's `color` values. We have changed `AtlaskitThemeProvider` so that it will no longer impact the `color` values of `@atlaskit/button`

## 10.0.4

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885) [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 10.0.3

### Patch Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823) [`676a1c7aa3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/676a1c7aa3) - regenerate snapshot for vr

## 10.0.2

### Patch Changes

- [#3877](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3877) [`0408cc26ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0408cc26ef) - Declare entry points in af:exports field of package.json

## 10.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428) [`682940909a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/682940909a) - CCCEM-1212 Customize background color in AtlaskitThemeProvider
- [`60dd4ecc69`](https://bitbucket.org/atlassian/atlassian-frontend/commits/60dd4ecc69) - Changed export all to export individual components in index
- [`7b90a82e88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b90a82e88) - Update the elevation to work correctly in Safari and Edge <79 correctly
- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 10.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335) [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 9.5.6

### Patch Changes

- [#2763](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2763) [`9326de67db`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9326de67db) - fix: return default theme mode if mode is other than 'light' or 'dark'

## 9.5.5

### Patch Changes

- [#2891](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2891) [`39faba6e98`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39faba6e98) - Update all the theme imports to something tree-shakable

## 9.5.4

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866) [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 9.5.3

### Patch Changes

- [patch][0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):

  Fixes skeleton color to N20A.- [patch][b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):

  Updates skeleton shimmer to be a pulse. Will introduce shimmer effect for small viewports later.- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
  - @atlaskit/docs@8.5.1
  - @atlaskit/button@13.3.10

## 9.5.2

### Patch Changes

- [patch][1dd42d3002](https://bitbucket.org/atlassian/atlassian-frontend/commits/1dd42d3002):

  Fixes theme providers having unstable references in their value prop.

## 9.5.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/button@13.3.7
  - @atlaskit/lozenge@9.1.4
  - @atlaskit/section-message@4.1.5

## 9.5.0

### Minor Changes

- [minor][82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):

  Adds visually hidden mixin. This can be used with any css-in-js library.

### Patch Changes

- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/button@13.3.5
  - @atlaskit/lozenge@9.1.3
  - @atlaskit/section-message@4.1.3

## 9.4.0

### Minor Changes

- [minor][429925f854](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/429925f854):

  Adds `skeleton` color.
  Import and use like:

  ```js
  import { skeleton } from '@atlaskit/theme';

  skeleton(); // '#F4F5F7'
  ```

## 9.3.0

### Minor Changes

- [minor][f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):

  Corrects the type exports for typography, colors, elevation and layers. If you were doing any dynamic code it may break you. Refer to the [upgrade guide](/packages/core/theme/docs/upgrade-guide) for help upgrading.

### Patch Changes

- [patch][3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):

  Fixes types property in package json to point to the correct location.

## 9.2.8

### Patch Changes

- [patch][ea75c17b3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea75c17b3a):

  internal typescript fixes

## 9.2.7

### Patch Changes

- [patch][c3dc8235f2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3dc8235f2):

  Preventing circular dep within theme

## 9.2.6

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

## 9.2.5

### Patch Changes

- [patch][2119c45dfc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2119c45dfc):

  Add missing Theme/GlobalThemeTokens to constants.d.ts

## 9.2.4

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 9.2.3

### Patch Changes

- [patch][decd6fceea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/decd6fceea):

  ED-5137 added heading anchor link

  Values for heading sizes(h100 - h900) are exported as part of typography. Places need to calculate heights for heading can use those values to calculate.

## 9.2.2

### Patch Changes

- [patch][8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):

  @atlaskit/avatar has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 9.2.1

### Patch Changes

- [patch][94620ae46a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/94620ae46a):

  Updating the temporary ts definition file for Theme.

## 9.2.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 9.1.6

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 9.1.5

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 9.1.4

### Patch Changes

- [patch][9eceb8379f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9eceb8379f):

  Moves typescript declaration files to the root of theme

## 9.1.3

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 9.1.2

### Patch Changes

- [patch][c6ad66d326](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6ad66d326):

  The types property in package.json now points to the correct file"

## 9.1.1

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 9.1.0

- [minor][70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):

  - Checkbox has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 9.0.3

- Updated dependencies [ed41cac6ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed41cac6ac):
  - @atlaskit/lozenge@9.0.0

## 9.0.2

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/section-message@4.0.0

## 9.0.1

- [patch][d5f0e7d767](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5f0e7d767):

  - Adds missing type def to typings for the /component.ts entrypoint

## 9.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 8.1.9

- [patch][e0e3fabf8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e0e3fabf8e):

  - Change button to use theme's multiple entry points. This should reduce the bundle size of button

## 8.1.8

- [patch][453838d3c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/453838d3c5):

  - Removes an import which referes to the old entry point of this component. Bundle size should now be slightly smaller

## 8.1.7

- [patch][9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):

  - Crucial bugfix: Fixes problem where default theme was undefined in production builds. This caused styles to not be applied to components.

## 8.1.6

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/section-message@2.0.2
  - @atlaskit/button@12.0.0

## 8.1.5

- [patch][9ac668e13d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ac668e13d):

  - Release math js as a module

## 8.1.4

- [patch][4368278bb4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4368278bb4):

  - Added components entry point allowing consumers to pull in just what they need out of theme (smaller bundle sizes!)

  ```
  import { N500, N0 } from '@atlaskit/theme/colors';
  import { focusRing } from '@atlaskit/theme/constants';
  import { withTheme } from '@atlaskit/theme/components';
  ```

## 8.1.3

- [patch][b4732a178b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b4732a178b):

  - Fixing incorrect z-index for navigation-next and inline dialog

## 8.1.2

- [patch][0f17bb7c20](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0f17bb7c20):

  - Theme TypeScript annotations are now exported as a module declaration.

## 8.1.1

- [patch][7fe933beaa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7fe933beaa):

  - Adds missing typescript annotations

## 8.1.0

- [minor][a561af5fc6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a561af5fc6):

  - Theme now exports top-level type definition for TS users

## 8.0.2

- [patch][5150860405](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5150860405):

  - Updates Theme.Context prop type definiton

## 8.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/section-message@2.0.1
  - @atlaskit/button@11.0.0

## 8.0.0

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

## 7.0.5

- [patch][b46504d2e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b46504d2e4):

  - Fixed example docs

## 7.0.4

- [patch][1a98f74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a98f74):

  - Added the missing unit to box-shadow for focus ring styles

## 7.0.3

- [patch][899fac7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/899fac7):

  - added the focus ring and no focus ring styles

## 7.0.2

- [patch][ca16fa9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ca16fa9):

  - Add SSR support to media components

## 7.0.1

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/lozenge@6.2.4
  - @atlaskit/section-message@1.0.14
  - @atlaskit/docs@6.0.0

## 7.0.0

- [major][d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):

  - Change API to experimental theming API to namespace component themes into separate contexts and make theming simpler. Update all dependant components.

## 6.2.1

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/section-message@1.0.11
  - @atlaskit/button@10.0.0

## 6.2.0

- [minor] Add smallFontSize as an export to theme [3469f64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3469f64)

## 6.1.1

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 6.1.0

- [minor] Adds new theming API to Avatar and AvatarItem components [79dd93f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79dd93f)

## 6.0.4

- [patch] Added assistive styles from util-shared-styles [dc563c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc563c1)

## 6.0.3

- [patch] fixed font-size and font-weight of h100 in theme to 11px and 700 respectively [9742864](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9742864)

## 6.0.2

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 6.0.0

- [major] Update badge to the new theming API. Rework experimental theming API. [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
- [none] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/lozenge@6.1.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 5.1.3

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/button@9.0.5
  - @atlaskit/lozenge@6.1.4

## 5.1.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/button@9.0.4
  - @atlaskit/lozenge@6.1.3
  - @atlaskit/docs@5.0.2

## 5.1.1

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/button@9.0.3
  - @atlaskit/lozenge@6.1.2

## 5.1.0

- [minor] Add new components (Consumer, Provider, Reset and Theme) and deprecate old APIs. New components are marked as experimenta so they may change. Deprecated components can still be used until experimental APIs are finalised. [cd799a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cd799a5)
- [none] Updated dependencies [cd799a5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cd799a5)

## 5.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/button@9.0.0
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/button@9.0.0
  - @atlaskit/docs@5.0.0

## 4.1.0

- [minor] Added elevations to the Theme package and updated visual styles for the field-range component. [dbd8de7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dbd8de7)
- [none] Updated dependencies [dbd8de7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dbd8de7)

## 4.0.5

- [patch] Align ADG, Website and AK [dd295bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd295bf)
- [none] Updated dependencies [dd295bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd295bf)

## 4.0.4

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/button@8.1.2

## 4.0.3

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 4.0.2

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/docs@4.1.0
  - @atlaskit/button@8.1.0

## 4.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/button@8.0.1
  - @atlaskit/docs@4.0.1

## 4.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/button@8.0.0
  - @atlaskit/docs@4.0.0

## 3.2.2

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/button@7.2.5
  - @atlaskit/docs@3.0.4

## 3.2.1

- [patch] Add Consolas to our font family [62bacf6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/62bacf6)
- [none] Updated dependencies [62bacf6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/62bacf6)

## 3.2.0

- [minor] Add color palette to theme - Jira Porfolio [72ab054](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72ab054)

## 3.1.1

- [patch] releasing all compo that depends on theme [86a82d2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86a82d2)
- [patch] Re-release to fix changes merged with @atlaskit/form [baa3c20](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/baa3c20)

## 3.1.0

- [minor] Added ability to specify an object as the badge appearance. Added an Appearance export to theme so that we can use strings and objects for appearance theming." [6e89615](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e89615)

## 3.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 2.4.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 2.4.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 2.3.4

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 2.3.3

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 2.3.2

- [patch] added a new layer tooltip [2215bc7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2215bc7)

## 2.3.1

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 2.3.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 2.2.4

- [patch] moved theme to new atlaskit repo [a25b940](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a25b940)
- [patch] moved theme to new atlaskit repo [a25b940](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a25b940)

## 2.2.3 (2017-10-27)

- bug fix; triggering storybooks ([87e7247](https://bitbucket.org/atlassian/atlaskit/commits/87e7247))
- bug fix; removed unused dependency on util-shared-styles from the Theme component ([253d8fc](https://bitbucket.org/atlassian/atlaskit/commits/253d8fc))

## 2.2.2 (2017-10-26)

- bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 2.2.1 (2017-10-22)

- bug fix; update styled components dep and react peerDep ([5539ada](https://bitbucket.org/atlassian/atlaskit/commits/5539ada))

## 2.2.0 (2017-09-27)

- feature; export "layers" from theme ([15aebe6](https://bitbucket.org/atlassian/atlaskit/commits/15aebe6))

## 2.1.0 (2017-09-13)

- feature; [@atlaskit](https://github.com/atlaskit)/theme now has a named getTheme() function export ([b727679](https://bitbucket.org/atlassian/atlaskit/commits/b727679))

## 2.0.1 (2017-08-11)

- bug fix; Add placeholder color to theme ([ba023fb](https://bitbucket.org/atlassian/atlaskit/commits/ba023fb))

## 2.0.0

- Initial Release
