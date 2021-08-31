# @atlaskit/avatar

## 20.4.2

### Patch Changes

- Updated dependencies

## 20.4.1

### Patch Changes

- [`0a759df738f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a759df738f) - When Avatar is not interactive and no `name` prop is provided, `role` and an empty `aria-label` attributes are not rendered anymore. Screen readers consider these images as decorative now and doesn't announce them as "Unlabeled image".
- [`016d19b8038`](https://bitbucket.org/atlassian/atlassian-frontend/commits/016d19b8038) - [ux] When avatars are disabled they no longer will appear as interactive.
- Updated dependencies

## 20.4.0

### Minor Changes

- [`cb101fd1d29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb101fd1d29) - [ux] Colors are now sourced through tokens.

### Patch Changes

- Updated dependencies

## 20.3.3

### Patch Changes

- [`0d0ecc6e790`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d0ecc6e790) - Corrects eslint supressions.
- Updated dependencies

## 20.3.2

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 20.3.1

### Patch Changes

- [`34992526ab4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34992526ab4) - Removes duplicate dependency (@atlaskit/tooltip) from dependency array.

## 20.3.0

### Minor Changes

- [`8f84c89cad5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f84c89cad5) - [ux] The styles of overflow button of avatar group has been aligned with default button styles. Also, contrast issue of the button has been fixed.

### Patch Changes

- [`af5707375f7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af5707375f7) - Internal code changes.
- [`cfcefd986eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfcefd986eb) - Adds jsdoc description to exported components.
- [`4e8f13c9b8a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e8f13c9b8a) - Renames internal props to match naming convention.
- [`1974621bc4d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1974621bc4d) - Add eslint rule disable for enforcing filename and extension
- [`9e335c673bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e335c673bb) - Rename no-type-suffix eslint rule to type-name-no-type-suffix-nor-props, and add restriction for nameing types props.
- [`1512054d655`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1512054d655) - Fixed no-type-suffix eslint errors
- [`ebd98351a30`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ebd98351a30) - Corrects internal jsdoc declarations.
- [`70679cfeb04`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70679cfeb04) - Fixed eslint errors by using css object notation
- [`7ea77bc9fbe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ea77bc9fbe) - Internal changes.
- Updated dependencies

## 20.2.2

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.
- Updated dependencies

## 20.2.1

### Patch Changes

- [`e177a840b13`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e177a840b13) - Fix flickering of cached avatar images on mount

## 20.2.0

### Minor Changes

- [`1a8fcbf9878`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a8fcbf9878) - [ux] Avatar and AvatarItem now accept a label prop which allows the components to be accessible when viewed in a screen reader. The isDisabled prop now correctly generates the appropriate markup (was a span, now a disabled button) for screen reader users.

### Patch Changes

- [`8308fe23b9b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8308fe23b9b) - Removing incorrect cursor styles from non-interactive AvatarItems
- Updated dependencies

## 20.1.1

### Patch Changes

- [`fe59fc62a58`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe59fc62a58) - Increased the contrast for the fallback icon of the Avatar package so that it passes WCAG AA contrast requirements.

## 20.1.0

### Minor Changes

- [`4f9e6e2db5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f9e6e2db5) - These packages now have defined entry points -- this means that you cannot access internal files in the packages that are not meant to be public. Sub-components in these packages have been explicitly defined, aiding tree-shaking and reducing bundle size.

### Patch Changes

- Updated dependencies

## 20.0.8

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 20.0.7

### Patch Changes

- [`5c1b4d64ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c1b4d64ef) - [ux] There were two browser specific issues in avatar component. 1- Misalignment in firefox (Interactive button avatar is incorrectly aligned) — To fix this we added font-size and font-family to button element. 2- Hover issue in safari (On hover avatar was showing rectangular background) — To fix this we have added border radius to avatar on hover.

## 20.0.6

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 20.0.5

### Patch Changes

- Updated dependencies

## 20.0.4

### Patch Changes

- Updated dependencies

## 20.0.3

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 20.0.2

### Patch Changes

- [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme and package information has been updated to point to the new design system website.

## 20.0.1

### Patch Changes

- [`dfd7418707`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfd7418707) - Added types for function parameters in the Presence, Status and Skeleton avatar sub-components. Without these types we were unable to generate prop tables in the documentation site using `extract-react-types`.

## 20.0.0

### Major Changes

- [`cde426961a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cde426961a) - Changes to Avatar in this release are intended to provide users with more flexible and performant customization options.

  Previously Avatars could only be customized like so:

  ```javascript
  <Avatar component={Button} />
  ```

  This is restrictive in that you're not able to pass custom props or children to button without passing props directly through to Avatar first.

  Now with render props, we can enable that:

  ```jsx
  const initials = 'MCB';

  <Avatar
    render={(props) => (
      <Button {...props}>{initials} // custom initials etc.</Button>
    )}
  />;
  ```

  Since there are significant prop and API changes we provided a codemod to help consumers upgrade their components.

  **Running the codemod cli**

  To run the codemod: **You first need to have the latest avatar installed before you can run the codemod**

  `yarn upgrade @atlaskit/avatar@^19.0.0`

  Once upgraded, use the Atlaskit codemod-cli;

  `npx @atlaskit/codemod-cli --parser [PARSER] --extensions [FILE_EXTENSIONS] [TARGET_PATH]`

  Or run `npx @atlaskit/codemod-cli -h` for more details on usage.
  For Atlassians, refer to [this doc](https://developer.atlassian.com/cloud/framework/atlassian-frontend/codemods/01-atlassian-codemods/) for more details on the codemod CLI.

  **Change summary:**

  - BREAKING: `Avatar`'s `component` prop is now a [renderProp](https://reactjs.org/docs/render-props.html) and has been renamed to `render`
  - BREAKING: `AvatarItem`'s `component` prop is now a [renderProp](https://reactjs.org/docs/render-props.html) and has been renamed to `render`
  - Avatar now forwards its ref
  - AvatarItem now forwards its ref
  - Type `AvatarClickType` has been renamed to `AvatarClickEventHandler`

### Patch Changes

- [`cacf9a3097`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cacf9a3097) - Fixes a regression in AvatarItem where the default padding was 16px instead of 4px.
- [`e99c1c2ac8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e99c1c2ac8) - Removes text decoration from AvatarItems rendered as anchor tags
- [`19b9dc6daf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19b9dc6daf) - Avatar now sends complete contextualised analytics metadata.
- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 19.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 18.0.2

### Patch Changes

- [`1c401b41d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1c401b41d6) - Codemod updated to target the correct avatarItem prop name
- [`e3cb6026bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3cb6026bc) - Updates the v18 codemod to ensure it doesnt format files that are not relevant

## 18.0.1

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 18.0.0

### Major Changes

- [`b1fa2d6d1c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1fa2d6d1c) - Avatar has been refactored to improve performance and be compliant with the lite-mode specification.
  Since there are significant prop and API changes, we will be providing a codemod to help consumers upgrade their components.

  To run the codemod:

  **You first need to have the latest avatar installed before you can run the codemod**

  `yarn upgrade @atlaskit/avatar@^18.0.0`

  **Run the codemod cli**

  `npx @atlaskit/codemod-cli /path/to/target/directory`

  For more information on @atlaskit/codemod-cli please refer to [this doc](https://atlaskit.atlassian.com/docs/guides/atlassian-codemods)

  **Summary**

  - Fixes re-rendering issues
  - Removes all deprecated theme API. This includes previous experimental dark-mode theme support
  - Stop accepting and spreading arbitrary props
  - Removes analytics-next HOCs in favor of hook variant (You may need to update snapshot tests)
  - Removes all usage of HOCs
  - Replaces `styled-components` v3 with `@emotion/core` to improve runtime and bundlesize

  **Avatar API / PROP CHANGES**

  - `enableTooltip` removed. Please use `@atlaskit/tooltip` instead
  - `onClick` method signature has been simplified to `onChange(event, analyticsEvent)`
  - `isHover` removed
  - `isActive` removed
  - `isFocus` removed
  - `isSelected` removed
  - `theme` removed
  - Added prop types to the `component` prop
  - `BORDER_WIDTH` is now a single value rather than an object
  - `withPseudoState`, `getProps`, `getBorderRadius`, `getInnerStyles` have been removed and are therefor no longer available. These methods were for designed for internal use and use within the AvatarGroup component.

  **Avatar Item API / PROP CHANGES**

  - `enableTruncation` renamed to `isTruncationDisabled`
  - `onClick` method signature has been simplified to `onChange(event, analyticsEvent)`
  - `isHover` removed
  - `isActive` removed
  - `isFocus` removed
  - `isSelected` removed
  - `theme` removed
  - Added prop types to the `component` prop

## 17.1.11

### Patch Changes

- Updated dependencies

## 17.1.10

### Patch Changes

- [patch][167a55fd7a](https://bitbucket.org/atlassian/atlassian-frontend/commits/167a55fd7a):

  Change imports to comply with Atlassian conventions- Updated dependencies [3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):

- Updated dependencies [9e4b195732](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e4b195732):
- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/tooltip@15.2.6
  - @atlaskit/toggle@8.1.7
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/webdriver-runner@0.3.4

## 17.1.9

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
  - @atlaskit/field-base@14.0.2
  - @atlaskit/button@13.3.9
  - @atlaskit/section-message@4.1.7
  - @atlaskit/toggle@8.1.6
  - @atlaskit/tooltip@15.2.5

## 17.1.8

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/section-message@4.1.6
  - @atlaskit/toggle@8.1.5
  - @atlaskit/tooltip@15.2.4

## 17.1.7

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/field-base@14.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/section-message@4.1.5
  - @atlaskit/theme@9.5.1
  - @atlaskit/toggle@8.1.4
  - @atlaskit/tooltip@15.2.3

## 17.1.6

### Patch Changes

- [patch][b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):

  Avatar-item will now respect the width of it's parent container- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):

  - @atlaskit/field-base@14.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/tooltip@15.2.2

## 17.1.5

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Corrects bgColor type from never to string- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/tooltip@15.2.0
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/field-base@13.0.16

## 17.1.4

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

## 17.1.3

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 17.1.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 17.1.1

### Patch Changes

- [patch][8dff68dffa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8dff68dffa):

  AvatarItems will only present a pointer cursor if onClick or href has been supplied

## 17.1.0

### Minor Changes

- [minor][79689c9027](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79689c9027):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help products to write better integration and end to end tests.

## 17.0.1

### Patch Changes

- [patch][40bda8f796](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40bda8f796):

  @atlaskit/avatar-group has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 17.0.0

### Major Changes

- [major][8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):

  @atlaskit/avatar has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 16.1.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 16.0.14

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 16.0.13

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 16.0.12

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 16.0.11

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 16.0.10

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

## 16.0.9

### Patch Changes

- [patch][d905cbc0ac](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d905cbc0ac):

  Adding a condition to check if the component are referenced in tests running in CI. It reduces the noise and help reading the CI log.

## 16.0.8

- Updated dependencies [7e9d653278](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e9d653278):
  - @atlaskit/toggle@8.0.0

## 16.0.7

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 16.0.6

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/field-base@13.0.6
  - @atlaskit/section-message@4.0.5
  - @atlaskit/toggle@7.0.3
  - @atlaskit/tooltip@15.0.2
  - @atlaskit/icon@19.0.0

## 16.0.5

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 16.0.4

- Updated dependencies [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/icon@18.0.1
  - @atlaskit/tooltip@15.0.0

## 16.0.3

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/field-base@13.0.4
  - @atlaskit/section-message@4.0.2
  - @atlaskit/toggle@7.0.1
  - @atlaskit/tooltip@14.0.3
  - @atlaskit/icon@18.0.0

## 16.0.2

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/icon@17.1.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 16.0.1

- [patch][21854842b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21854842b5):

  - Clean couple of TODO's that were already done

## 16.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 15.0.5

- [patch][d01ab3961b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d01ab3961b):

  - Bugfix: fixes issue with src image flickering

## 15.0.4

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/field-base@12.0.2
  - @atlaskit/icon@16.0.9
  - @atlaskit/section-message@2.0.3
  - @atlaskit/toggle@6.0.4
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 15.0.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/icon@16.0.8
  - @atlaskit/section-message@2.0.2
  - @atlaskit/theme@8.1.6
  - @atlaskit/toggle@6.0.3
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/button@12.0.0

## 15.0.2

- [patch][ea173a3ee2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea173a3ee2):

  - Internal changes only. Component is now SSR compatible. If server side rendered, Avatar Images will begin to load immediately; before client bundle is ready. If this is undesired, `imageUrl` can be passed in after component is mounted.

## 15.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/section-message@2.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/toggle@6.0.1
  - @atlaskit/tooltip@13.0.1
  - @atlaskit/button@11.0.0

## 15.0.0

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

## 14.1.9

- [patch][92d8e6317c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92d8e6317c):

  - Check if the DOM is available when rendering an AvatarImage so that SSR rendered Avatars will render with the provided image.

## 14.1.8

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/field-base@11.0.14
  - @atlaskit/section-message@1.0.16
  - @atlaskit/toggle@5.0.15
  - @atlaskit/tooltip@12.1.15
  - @atlaskit/icon@16.0.0

## 14.1.7

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/field-base@11.0.13
  - @atlaskit/icon@15.0.2
  - @atlaskit/section-message@1.0.14
  - @atlaskit/theme@7.0.1
  - @atlaskit/toggle@5.0.14
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/docs@6.0.0

## 14.1.6

- [patch][d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):

  - Change API to experimental theming API to namespace component themes into separate contexts and make theming simpler. Update all dependant components.

## 14.1.5

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/field-base@11.0.11
  - @atlaskit/section-message@1.0.12
  - @atlaskit/toggle@5.0.12
  - @atlaskit/tooltip@12.1.11
  - @atlaskit/icon@15.0.0

## 14.1.4

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/section-message@1.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/toggle@5.0.11
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/button@10.0.0

## 14.1.3

- [patch][a981c43](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a981c43):

  - Update Avatar to allow to use a custom icon as status.

## 14.1.2

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 14.1.1

- [patch] Update avatar index exports to fix babel transpilation bug [0208158](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0208158)

## 14.1.0

- [minor] Adds new theming API to Avatar and AvatarItem components [79dd93f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/79dd93f)

## 14.0.11

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/field-base@11.0.8
  - @atlaskit/section-message@1.0.8
  - @atlaskit/toggle@5.0.9
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/icon@14.0.0

## 14.0.10

- [patch] Fix bug where analytics was causing avatar to always have an onClick and render with onClick styles/attributes. [966f1fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/966f1fb)

## 14.0.8

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/toggle@5.0.6
  - @atlaskit/section-message@1.0.5
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-base@11.0.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 14.0.7

- [patch] updated the custom component proxy to be class instead of function to fix the errors related to innerRef [06690a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06690a6)
- [none] Updated dependencies [06690a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06690a6)

## 14.0.6

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/field-base@11.0.3
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/toggle@5.0.5
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/section-message@1.0.4
  - @atlaskit/icon@13.2.4

## 14.0.5

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/toggle@5.0.4
  - @atlaskit/section-message@1.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/field-base@11.0.2

## 14.0.4

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/tooltip@12.0.3
  - @atlaskit/field-base@11.0.1
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/toggle@5.0.3
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/section-message@1.0.2
  - @atlaskit/icon@13.2.1

## 14.0.3

- [patch] Update docs, change dev deps [25d6e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d6e48)
- [none] Updated dependencies [25d6e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d6e48)

## 14.0.2

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/tooltip@12.0.1
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/toggle@5.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1

## 14.0.1

- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/icon@13.1.1

## 14.0.0

- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/field-base@11.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/field-base@11.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0

## 13.0.0

- [major] Remove unneeded componentType and functionType type exports [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/button@8.2.5
- [none] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/button@8.2.5

## 12.0.0

- [major] Split avatar-group into its own package [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
- [none] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)

## 11.2.2

- [patch] Remove or update \$FlowFixMe [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/button@8.2.4
  - @atlaskit/icon@12.6.1
  - @atlaskit/dropdown-menu@5.2.1

## 11.2.1

- [patch] Fix \$FlowFixMe and release packages [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/tooltip@10.3.1
  - @atlaskit/button@8.2.2
  - @atlaskit/icon@12.3.1

## 11.2.0

- [minor] Fixes types for Flow 0.74 [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [none] Updated dependencies [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
  - @atlaskit/tooltip@10.3.0
  - @atlaskit/button@8.2.0
  - @atlaskit/icon@12.2.0
  - @atlaskit/dropdown-menu@5.1.0

## 11.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/item@7.0.4
  - @atlaskit/icon@12.1.1
  - @atlaskit/field-base@10.1.1
  - @atlaskit/dropdown-menu@5.0.3
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 11.1.0

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/tooltip@10.2.0
  - @atlaskit/item@7.0.3
  - @atlaskit/dropdown-menu@5.0.2
  - @atlaskit/icon@12.1.0
  - @atlaskit/toggle@4.0.2
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/field-base@10.1.0
  - @atlaskit/button@8.1.0

## 11.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/tooltip@10.0.1
  - @atlaskit/item@7.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/toggle@4.0.1
  - @atlaskit/field-base@10.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1
  - @atlaskit/dropdown-menu@5.0.1

## 11.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/item@7.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/toggle@4.0.0
  - @atlaskit/field-base@10.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/dropdown-menu@5.0.0

## 10.0.7

- [patch] Fix text color for items with href in AvatarGroup [2cbb9ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2cbb9ff)
- [none] Updated dependencies [2cbb9ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2cbb9ff)

## 10.0.6

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/toggle@3.0.2
  - @atlaskit/item@6.0.3
  - @atlaskit/field-base@9.0.3
  - @atlaskit/dropdown-menu@4.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 10.0.4

- [patch] Fix clipping of dropdown items in avatar group for certain browsers [7b82fa6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7b82fa6)

## 10.0.3

- [patch] Fix avatars appearing clickable when no onClick or href prop is provided [e6fec4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6fec4f)

## 10.0.2

- [patch] Fix native tooltips appearing for avatars without a src prop [6a3fb67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a3fb67)

## 10.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 9.2.3

- [patch] Remove dependency on @atlaskit/polyfill as it is not being used. [f0f9307](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0f9307)
- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 9.2.2

- [patch] Makes packages Flow types compatible with version 0.67 [25daac0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25daac0)

## 9.2.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 9.2.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 9.1.0

- [minor] Create skeleton representations of various components [cd628e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cd628e4)

## 9.0.4

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 9.0.2

- [patch] Remove babel-plugin-react-flow-props-to-prop-types [06c1f08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c1f08)

## 9.0.1

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 9.0.0

- [major] onAvatarClick prop on AvatarGroup now has a second argument. This second argument is the item that was clicked on. [23a488e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23a488e)

## 8.4.1

- [patch] Migrate Navigation from Ak repo to ak mk 2 repo, Fixed flow typing inconsistencies in ak mk 2 [bdeef5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdeef5b)

## 8.4.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 8.3.10

- [patch] update flow dep, fix flow errors [722ad83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/722ad83)
- [patch] update flow dep, fix flow errors [722ad83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/722ad83)

## 8.3.6

- [patch] migrating avatar package to new repo [f3f5e51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f3f5e51)

## 8.3.5 (2017-11-30)

- bug fix; release stories with fixed console errors ([3321c2b](https://bitbucket.org/atlassian/atlaskit/commits/3321c2b))

## 8.3.4 (2017-11-28)

- bug fix; fix avatar group having less width than its children (issues closed: ak-3872) ([e88ee42](https://bitbucket.org/atlassian/atlaskit/commits/e88ee42))

## 8.3.3 (2017-11-23)

- bug fix; fix avatar group's more items dropdown not being tabbable (issues closed: ak-3707) ([a0ee45d](https://bitbucket.org/atlassian/atlaskit/commits/a0ee45d))

## 8.3.2 (2017-11-20)

- bug fix; fS-3907 Use Tooltip component in Avatar ([2126336](https://bitbucket.org/atlassian/atlaskit/commits/2126336))

## 8.3.1 (2017-11-16)

- bug fix; avatar flex styles are now explicit to fix Firefox issue (issues closed: ak-3898) ([73ac57d](https://bitbucket.org/atlassian/atlaskit/commits/73ac57d))

## 8.3.0 (2017-11-16)

- feature; added a new prop background in AvatarItem to have custom background (issues closed: ak-3706) ([e93888c](https://bitbucket.org/atlassian/atlaskit/commits/e93888c))

## 8.2.4 (2017-11-15)

- bug fix; fix incorrect border radius on Avatars (issues closed: ak-3897) ([6570495](https://bitbucket.org/atlassian/atlaskit/commits/6570495))

## 8.2.3 (2017-11-15)

- bug fix; explicitly disable tooltip on avatar when rendered in a group dropdown ([593f2e9](https://bitbucket.org/atlassian/atlaskit/commits/593f2e9))

## 8.2.2 (2017-11-15)

- bug fix; improve avatar perf by caching styled components (issues closed: ak-3699) ([0e6fa65](https://bitbucket.org/atlassian/atlaskit/commits/0e6fa65))

## 8.2.1 (2017-11-14)

- bug fix; add additional link target options (issues closed: ak-3886) ([a932aa8](https://bitbucket.org/atlassian/atlaskit/commits/a932aa8))

## 8.2.0 (2017-11-14)

- feature; aK-3883 Expose boundariesElement property on AvatarGroup component ([78001fd](https://bitbucket.org/atlassian/atlaskit/commits/78001fd))

## 8.1.0 (2017-11-13)

- feature; add support for focus presence type (issues closed: ak-3758) ([06b6da3](https://bitbucket.org/atlassian/atlaskit/commits/06b6da3))
- bug fix; AvatarGroup more indicator fixed in Firefox (issues closed: ak-3791) ([6c9464e](https://bitbucket.org/atlassian/atlaskit/commits/6c9464e))

## 8.0.11 (2017-11-02)

- bug fix; added missing dependencies (issues closed: ak-3782) ([4dbc3ef](https://bitbucket.org/atlassian/atlaskit/commits/4dbc3ef))

## 8.0.10 (2017-10-26)

- bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 8.0.9 (2017-10-22)

- bug fix; update dependencies for react-16 ([077d1ad](https://bitbucket.org/atlassian/atlaskit/commits/077d1ad))

## 8.0.8 (2017-10-15)

- bug fix; fix borked styles caused by missing semicolons in CSS (issues closed: ak-3694) ([07e0c54](https://bitbucket.org/atlassian/atlaskit/commits/07e0c54))

## 8.0.7 (2017-10-13)

- bug fix; add polyfill from AK polyfills package (issues closed: ak-3667) ([a841e6d](https://bitbucket.org/atlassian/atlaskit/commits/a841e6d))

## 8.0.6 (2017-10-09)

- bug fix; remove the console error Invalid prop types for border ([de45a14](https://bitbucket.org/atlassian/atlaskit/commits/de45a14))

## 8.0.5 (2017-09-18)

- bug fix; fix avatar isInteractive style ([1296049](https://bitbucket.org/atlassian/atlaskit/commits/1296049))

## 8.0.4 (2017-09-12)

- bug fix; avatars now display in Firefox when used in an Avatar Group ([1db854f](https://bitbucket.org/atlassian/atlaskit/commits/1db854f))

## 8.0.3 (2017-09-11)

- bug fix; limit avatar + more count to maxCount size (issues closed: ak-3472) ([3516192](https://bitbucket.org/atlassian/atlaskit/commits/3516192))

## 8.0.1 (2017-09-05)

- bug fix; update dark theme color palette (issues closed: ak-3172) ([d23e55f](https://bitbucket.org/atlassian/atlaskit/commits/d23e55f))

## 8.0.0 (2017-08-11)

- bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
- breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- feature; dark mode for avatar ([3eb7531](https://bitbucket.org/atlassian/atlaskit/commits/3eb7531))

## 7.0.0 (2017-08-11)

- breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- feature; dark mode for avatar ([3eb7531](https://bitbucket.org/atlassian/atlaskit/commits/3eb7531))

## 6.4.5 (2017-08-04)

- bug fix; moves babel-plugin-react-flow-props-to-prop-types to a devDependency ([6378b88](https://bitbucket.org/atlassian/atlaskit/commits/6378b88))

## 6.4.4 (2017-08-03)

- bug fix; fixes uncaught type error in avatar by consuming latest util-shared-styles (issues closed: ak-3067) ([be705fa](https://bitbucket.org/atlassian/atlaskit/commits/be705fa))

## 6.4.3 (2017-07-28)

- fix; fixes avatars devDeps to include lozenge and button-group ([d9ae05f](https://bitbucket.org/atlassian/atlaskit/commits/d9ae05f))

## 6.4.2 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 6.4.1 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 6.1.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))
- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 5.0.0 (2017-07-12)

- feature; added the xxlarge size to Avatar ([5cfbfb5](https://bitbucket.org/atlassian/atlaskit/commits/5cfbfb5))
- feature; adds AvatarGroup export with 'stack' and 'grid' appearances ([59dac0c](https://bitbucket.org/atlassian/atlaskit/commits/59dac0c))
- feature; adds AvatarItem named export to Avatar ([9939bfd](https://bitbucket.org/atlassian/atlaskit/commits/9939bfd))
- feature; adds name prop to Avatar (replaces label) ([5cfe547](https://bitbucket.org/atlassian/atlaskit/commits/5cfe547))
- feature; adds tooltips for Avatars ([816402a](https://bitbucket.org/atlassian/atlaskit/commits/816402a))
- feature; avatar how handles href, onClick and arbitrary \`component\` prop functionality ([763e00c](https://bitbucket.org/atlassian/atlaskit/commits/763e00c))
- feature; presence prop now accepts a react element in addition to its enumerable values (rep ([dfcc3f7](https://bitbucket.org/atlassian/atlaskit/commits/dfcc3f7))
- feature; replaced presenceBorderColor prop with \`borderColor\` ([0e4c171](https://bitbucket.org/atlassian/atlaskit/commits/0e4c171))

- breaking; Removed presenceBorderColor prop (replaced with \`borderColor\`)
- breaking; \`icon\` prop has been replaced with a more accepting \`presence\` prop
- breaking; Label prop has been replaced with \`name\`

## 4.0.6 (2017-06-27)

- fix; when src is removed after mount show default image ([d3e9e2a](https://bitbucket.org/atlassian/atlaskit/commits/d3e9e2a))

## 4.0.4 (2017-05-26)

- fix; change align-items: middle to align-items: center ([8740b22](https://bitbucket.org/atlassian/atlaskit/commits/8740b22))
- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

## 4.0.3 (2017-05-23)

- fix; update util-shared-styles and util-readme dependencies ([9c0e218](https://bitbucket.org/atlassian/atlaskit/commits/9c0e218))

## 4.0.2 (2017-05-11)

- fix; load avatar from src prop correctly ([d94798e](https://bitbucket.org/atlassian/atlaskit/commits/d94798e))

## 4.0.1 (2017-05-10)

- fix; testing releasing more than 5 packages at a time ([e69b832](https://bitbucket.org/atlassian/atlaskit/commits/e69b832))

## 4.0.0 (2017-05-03)

- feature; optional square avatar appearance ([c43c905](https://bitbucket.org/atlassian/atlaskit/commits/c43c905))
- breaking; Previously you could pass a custom Presence to an Avatar via the Avatar's children. Now, these custom Presence or icon elements should be passed to the new 'icon' prop. This change has been made to avoid overloading the concept of Presence and to make the API clearer.
- ISSUES CLOSED: AK-1645

## 3.0.3 (2017-04-27)

- fix; isolate getPresenceSVG in its own module so we only export a single React Component ([ca8e14b](https://bitbucket.org/atlassian/atlaskit/commits/ca8e14b))
- fix; remove unused constants.js, import correctly from Avatar component for tests ([fcaccb9](https://bitbucket.org/atlassian/atlaskit/commits/fcaccb9))

## 3.0.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 3.0.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 3.0.0 (2017-04-13)

- null refactor avatar to styled-components ([21a371c](https://bitbucket.org/atlassian/atlaskit/commits/21a371c))
- breaking; added peerDependency "styled-components", removed dependency "classnames"
- ISSUES CLOSED: AK-2099

## 2.1.5 (2017-04-04)

- fix; fixes avatar to be able to be tested using mocha and jsdom ([7a0f9fb](https://bitbucket.org/atlassian/atlaskit/commits/7a0f9fb))

## 2.1.4 (2017-03-23)

- fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 2.1.2 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 2.1.0 (2017-03-06)

- feature; adds 'xsmall' size to avatar appearance (16px) ([d8da663](https://bitbucket.org/atlassian/atlaskit/commits/d8da663))

## 2.0.2 (2017-02-16)

- fix; refactor stories to use // rather than http:// ([a0826cf](https://bitbucket.org/atlassian/atlaskit/commits/a0826cf))

## 2.0.1 (2017-02-10)

- fix; Dummy commit to release components to registry ([5bac43b](https://bitbucket.org/atlassian/atlaskit/commits/5bac43b))
