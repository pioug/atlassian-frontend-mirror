# @atlaskit/popup

## 1.11.3

### Patch Changes

- [#42594](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42594) [`07781d6d786`](https://bitbucket.org/atlassian/atlassian-frontend/commits/07781d6d786) - Removes feature flag implemented in 1.11.0. Does not implement proposed functionality behind the feature flag.

## 1.11.2

### Patch Changes

- [#41628](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41628) [`b05664f7aba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b05664f7aba) - Use feature flag to toggle if we enable UNSAFE_LAYERING

## 1.11.1

### Patch Changes

- [#41322](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41322) [`f54519b315c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f54519b315c) - This removes the error in console when passing `shouldRenderToParent` prop.

## 1.11.0

### Minor Changes

- [#41251](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41251) [`b0a2a8d78c6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b0a2a8d78c6) - [ux] We are testing removing the `focus-trap` package for a smaller sharper implementation of focus management behind a feature flag. If this fix is successful it will be available in a later release.

## 1.10.2

### Patch Changes

- [#41354](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41354) [`d621fe3e4f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d621fe3e4f8) - fix ReferenceError where frameId is used before it is initialised

## 1.10.1

### Patch Changes

- [#40515](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40515) [`a54578d2ea9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a54578d2ea9) - This removes the feature flag for the `shouldRenderToParent` prop. The prop is available for use.

## 1.10.0

### Minor Changes

- [#39726](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39726) [`f355884a4aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f355884a4aa) - [ux] Support to press escape key and only close the top layer

### Patch Changes

- Updated dependencies

## 1.9.3

### Patch Changes

- [#39278](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39278) [`84442a93613`](https://bitbucket.org/atlassian/atlassian-frontend/commits/84442a93613) - Adds support for surface detection when using design tokens. Enabling children to be styled with the surface color of the popup when using the `utility.elevation.surface.current` design token.
- Updated dependencies

## 1.9.2

### Patch Changes

- [#38011](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38011) [`065da872439`](https://bitbucket.org/atlassian/atlassian-frontend/commits/065da872439) - Css changes for testing the feature flag `platform.design-system-team.render-popup-in-parent_f73ij`.

## 1.9.1

### Patch Changes

- [#37614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37614) [`6a0a3c059ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a0a3c059ba) - Remove unused argument from internal focus management function.

## 1.9.0

### Minor Changes

- [#34797](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34797) [`3920dcfd848`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3920dcfd848) - This removes the feature flag made for upgrading the `focus-trap` dependency and keeps `focus-trap` at it's original version.

## 1.8.3

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754) [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility testing.

## 1.8.2

### Patch Changes

- [#36447](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36447) [`472a62ce219`](https://bitbucket.org/atlassian/atlassian-frontend/commits/472a62ce219) - [ux] Fixes `autoFocus` functionality on upgrade of focus-trap to v7.

## 1.8.1

### Patch Changes

- [#35441](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35441) [`599bfe90ee3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/599bfe90ee3) - Internal change to use shape tokens. There is no expected visual change.

## 1.8.0

### Minor Changes

- [`ac5a05f5929`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac5a05f5929) - We are testing an upgrade to the `focus-trap` dependency behind a feature flag. If this fix is successful it will be available in a later release.

## 1.7.0

### Minor Changes

- [#35092](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35092) [`eca89633804`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eca89633804) - Add a new prop `shouldRenderToParent` to allow render popup into a DOM node within the parent DOM hierarchy instead of React portal.

## 1.6.4

### Patch Changes

- [#35299](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35299) [`e2a6337bb05`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2a6337bb05) - Reverts changes 1.6.3 in @atlaskit/popup, reverts disabling pointer events on iframes when popup is open.

## 1.6.3

### Patch Changes

- [#34314](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34314) [`c394dbc632f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c394dbc632f) - Addresses the problem where the popup fails to close upon clicking on the iframe

## 1.6.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 1.6.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 1.6.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 1.5.5

### Patch Changes

- Updated dependencies

## 1.5.4

### Patch Changes

- Updated dependencies

## 1.5.3

### Patch Changes

- Updated dependencies

## 1.5.2

### Patch Changes

- Updated dependencies

## 1.5.1

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303) [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op change to introduce spacing tokens to design system components.

## 1.5.0

### Minor Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710) [`c520e306869`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c520e306869) - Updates `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

## 1.4.2

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874) [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 1.4.1

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492) [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 1.4.0

### Minor Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381) [`01d80d395bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/01d80d395bc) - pass event to onOpenChange consistently

### Patch Changes

- [`8202e37941b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8202e37941b) - Internal code change turning on new linting rules.
- Updated dependencies

## 1.3.10

### Patch Changes

- [#22614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22614) [`8a5bdb3c844`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a5bdb3c844) - Upgrading internal dependency (bind-event-listener) for improved internal types

## 1.3.9

### Patch Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570) [`dcf8150c49c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dcf8150c49c) - Allow `trigger` props to be applied to any HTML element tag without causing type errors for the `ref` type

## 1.3.8

### Patch Changes

- Updated dependencies

## 1.3.7

### Patch Changes

- [#21242](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21242) [`2e7bbdfd813`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e7bbdfd813) - Upgrading internal dependency 'bind-event-listener' to 2.1.0 for improved types

## 1.3.6

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650) [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 1.3.5

### Patch Changes

- Updated dependencies

## 1.3.4

### Patch Changes

- Updated dependencies

## 1.3.3

### Patch Changes

- Updated dependencies

## 1.3.2

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752) [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when auto-fixing by correctly formatting token ids.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when auto-fixing by correctly formatting token ids.
- Updated dependencies

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#17576](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17576) [`2e42aa0d900`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e42aa0d900) - **Note**: It is a re-release of the wrongly `patched` version `1.1.6` that should have been a `minor` release.

  Expose `fallbackPlacement` modifier from to specify a list of fallback options to try incase there isn't enough space

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#16960](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16960) [`c2dd770a743`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2dd770a743) - Add new prop which controls is outside click should be bound using capture

## 1.1.6

_WRONG RELEASE TYPE - DON'T USE_

### Minor Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998) [`f142150a3e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f142150a3e8) - Expose `fallbackPlacement` modifier from to specify a list of fallback options to try incase there isn't enough space

### Patch Changes

- [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds for this package now pass through a tokens babel plugin, removing runtime invocations of the tokens() function and improving bundle size.
- Updated dependencies

## 1.1.5

### Patch Changes

- Updated dependencies

## 1.1.4

### Patch Changes

- Updated dependencies

## 1.1.3

### Patch Changes

- Updated dependencies

## 1.1.2

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837) [`04cf9c3d28c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04cf9c3d28c) - [ux] Colors now sourced from tokens.

### Patch Changes

- Updated dependencies

## 1.0.8

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880) [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 1.0.7

### Patch Changes

- [#12167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12167) [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates to development dependency `storybook-addon-performance`

## 1.0.6

### Patch Changes

- [#6930](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6930) [`1858f20ac3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1858f20ac3) - Optimised popup performance as part of the lite-mode project. Changes are internal and have no implications for component API or usage.

## 1.0.5

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857) [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 1.0.4

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497) [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 1.0.3

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [#4346](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4346) [`fc8f6e61f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc8f6e61f3) - Fix codemod utilities being exposed through the codemod cli

## 1.0.1

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885) [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 1.0.0

### Major Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823) [`740e011f8d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/740e011f8d) - This first major release of popup brings in major changes from @atlaskit/popper. These changes come with performance, maintainability and behavioral improvements.

  As popup wraps popper's functionality, these changes result in a breaking change for popup as well.

  These changes have ⚙️ codemod support:

  - ⚙️ `offset` is no longer a string, but an array of two integers (i.e. '0px 8px' is now [0, 8])
  - ⚙️ `boundariesElement` has been replaced with two props: `boundary` and `rootBoundary`. The three supported values
    from the boundariesElement prop have been split between the two as follows:

    - `boundariesElement = "scrollParents"` has been renamed: use `boundary = "clippingParents"`.
    - `boundariesElement = "window"` has been renamed: use `rootBoundary = "document"`, and acts in a similar fashion.
    - `boundariesElement = "viewport"` has been moved: use `rootBoundary = "document"`.
    - **✨new** the `boundary` prop now supports custom elements.

  - Components passed into the `content` have a change to render props:

    - ⚙️ `scheduleUpdate`, for async updates, has been renamed to `update`, and now returns a Promise.

  - For more information on the change, see [the popper.js docs](https://popper.js.org/docs/v2/utils/detect-overflow/#boundary)

  **Running the codemod cli**

  To run the codemod: **You first need to have the latest version of popup installed before you can run the codemod**

  `yarn upgrade @atlaskit/popup@^1.0.0`

  Once upgraded, use the Atlaskit codemod-cli;

  `npx @atlaskit/codemod-cli --parser [PARSER] --extensions [FILE_EXTENSIONS] [TARGET_PATH]`

  Or run `npx @atlaskit/codemod-cli -h` for more details on usage.
  For Atlassians, refer to [this doc](https://hello.atlassian.net/wiki/spaces/AF/pages/2627171992/Codemods) for more details on the codemod CLI.

### Patch Changes

- Updated dependencies

## 0.6.1

### Patch Changes

- [#4329](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4329) [`8dd80245bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8dd80245bb) - Remove unnecessary code for IE11.

## 0.6.0

### Minor Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335) [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 0.5.0

### Minor Changes

- [#3289](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3289) [`ebcb467688`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ebcb467688) - Add a new prop `autoFocus` to allow consumers to control whether the Popup takes focus when opened

## 0.4.3

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866) [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 0.4.2

### Patch Changes

- [#2430](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2430) [`649f69b6d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/649f69b6d7) - Patch all packages that are used by confluence that have a broken es2019 dist

## 0.4.1

### Patch Changes

- [#2186](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2186) [`f4d4de67e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4d4de67e4) - Prevent closing of popup when clicked element (which is inside content) is removed from the DOM

## 0.4.0

### Minor Changes

- [#2060](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2060) [`ead13374cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ead13374cf) - **BREAKING:** Removes `tag` prop and unneeded wrapping element around the trigger.

## 0.3.5

### Patch Changes

- [patch][a12ea387f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/a12ea387f1):

  Change imports to comply with Atlassian conventions- Updated dependencies [cf8577f5d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf8577f5d6):

- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [1e7e54c20e](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e7e54c20e):
  - @atlaskit/popper@3.1.12
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/menu@0.4.1

## 0.3.4

### Patch Changes

- Updated dependencies [7e408e4037](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e408e4037):
- Updated dependencies [603413f530](https://bitbucket.org/atlassian/atlassian-frontend/commits/603413f530):
- Updated dependencies [6453c8de48](https://bitbucket.org/atlassian/atlassian-frontend/commits/6453c8de48):
- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies [e4dde0ad13](https://bitbucket.org/atlassian/atlassian-frontend/commits/e4dde0ad13):
- Updated dependencies [41760ea4a6](https://bitbucket.org/atlassian/atlassian-frontend/commits/41760ea4a6):
- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [971e294b1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/971e294b1e):
- Updated dependencies [684ee794d6](https://bitbucket.org/atlassian/atlassian-frontend/commits/684ee794d6):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies [286770886d](https://bitbucket.org/atlassian/atlassian-frontend/commits/286770886d):
- Updated dependencies [2c1b78027c](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c1b78027c):
- Updated dependencies [fb3ca3a3b2](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb3ca3a3b2):
  - @atlaskit/menu@0.4.0
  - @atlaskit/portal@3.1.7
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/button@13.3.10

## 0.3.3

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [7a6e5f6e3d](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a6e5f6e3d):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/menu@0.3.0
  - @atlaskit/button@13.3.9
  - @atlaskit/radio@3.1.11
  - @atlaskit/spinner@12.1.6

## 0.3.2

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/button@13.3.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/menu@0.2.6
  - @atlaskit/popper@3.1.11
  - @atlaskit/portal@3.1.6
  - @atlaskit/radio@3.1.9
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1

## 0.3.1

### Patch Changes

- [patch][afc9384399](https://bitbucket.org/atlassian/atlassian-frontend/commits/afc9384399):

  Adds tag prop, use this for changing (or removing with a `Fragment`) the wrapping element around the trigger.- Updated dependencies [671de2d063](https://bitbucket.org/atlassian/atlassian-frontend/commits/671de2d063):

- Updated dependencies [77ffd08ea0](https://bitbucket.org/atlassian/atlassian-frontend/commits/77ffd08ea0):
- Updated dependencies [0ae6ce5d46](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae6ce5d46):
  - @atlaskit/popper@3.1.10
  - @atlaskit/menu@0.2.5

## 0.3.0

### Minor Changes

- [minor][0946fdd319](https://bitbucket.org/atlassian/atlassian-frontend/commits/0946fdd319):

  - **BREAKING** - Changes `content` prop to expect render props instead of a component.
    This is primarily to stop your components remounting when not having a stable reference.

## 0.2.7

### Patch Changes

- [patch][eb1ecc219a](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb1ecc219a):

  Fix issue where stopping event propagation would still close a popup

## 0.2.6

### Patch Changes

- [patch][f534973bd4](https://bitbucket.org/atlassian/atlassian-frontend/commits/f534973bd4):

  Fix a bug causing the page to scroll to top when a popup is opened- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):

- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5
  - @atlaskit/popper@3.1.9
  - @atlaskit/portal@3.1.4
  - @atlaskit/radio@3.1.6
  - @atlaskit/spinner@12.1.3

## 0.2.5

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Updates react-popper dependency to a safe version.- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/radio@3.1.5
  - @atlaskit/popper@3.1.8

## 0.2.4

### Patch Changes

- [patch][d0415ae306](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0415ae306):

  Popup now uses the correct e200 shadow

## 0.2.3

### Patch Changes

- [patch][542080be8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/542080be8a):

  Bumped react-popper and resolved infinite looping refs issue, and fixed close-on-outside-click for @atlaskit/popup- [patch][995c1f6fd6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/995c1f6fd6):

  Popup close on outside click no longer fires when clicking on content within the popup that re-renders

## 0.2.2

### Patch Changes

- [patch][3cad6b0118](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3cad6b0118):

  Exposed offset prop for popper allowing positioning of popups relative to the trigger. Added example for double pop-up pattern

## 0.2.1

### Patch Changes

- [patch][f86839ca4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f86839ca4e):

  @atlaskit/portal had an issue in IE11 and this is fixed in 3.1.2

## 0.2.0

### Minor Changes

- [minor][6e0bcc75ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e0bcc75ac):

  - Adds the ability to render class components as children of Popup.
  - Removes redundatnt onOpen callback prop for Popup

## 0.1.5

### Patch Changes

- [patch][93fe1d6f0d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93fe1d6f0d):

  Fix issue where popup content is rendered infinitely

## 0.1.4

### Patch Changes

- [patch][c0a6abed47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0a6abed47):

  Add onOpen and re-render unit tests

## 0.1.3

### Patch Changes

- [patch][28e9c65acd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28e9c65acd):

  - Add multiple popups example
  - Add unit tests
  - Add useCloseManager
  - Fix bug that did not call onClose on open popups
  - Move RepositionOnUpdate to a separate file
  - Remove scroll lock and corresponding example
  - Remove requestAnimationFrame usage
  - Replace @emotion/styled with @emotion/core

## 0.1.2

### Patch Changes

- [patch][242dd7a06d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/242dd7a06d):

  Expose additional types

## 0.1.1

### Patch Changes

- [patch][583a9873ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/583a9873ef):

  Provided better description for popup types

## 0.1.0

### Minor Changes

- [minor][f1a3548732](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a3548732):

  Introduce new package for the lightweight inline-dialog to be used in @atlaskit/app-navigation. The package will stay internal for now until more hardening is done, but releasing first minor to unblock navigation work.
