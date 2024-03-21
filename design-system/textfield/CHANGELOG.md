# @atlaskit/textfield

## 6.1.3

### Patch Changes

- [#83130](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83130) [`4efd62cdc533`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4efd62cdc533) - SHPLVIII-481: Assign name to default export components to fix quick-fix imports

## 6.1.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116) [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) - Upgrade Typescript from `4.9.5` to `5.4.2`

## 6.1.1

### Patch Changes

- [#81644](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81644) [`8ab7a816dca7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8ab7a816dca7) - Revert input border change from the previous version

## 6.1.0

### Minor Changes

- [#80805](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80805) [`427c2dd9e0d6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/427c2dd9e0d6) - [ux] Update input border width from 2px to 1px with darker color to meet 3:1 color contrast

### Patch Changes

- Updated dependencies

## 6.0.1

### Patch Changes

- [#74756](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74756) [`8e66f751df96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8e66f751df96) - Use feature flag to roll out border width update from 2px to 1px

## 6.0.0

### Major Changes

- [#42569](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42569) [`df6d526f3c8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df6d526f3c8) - Removed all remaining legacy theming logic from the TextField component.

## 5.6.8

### Patch Changes

- [#40987](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40987) [`3039d60a810`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3039d60a810) - Make spread props present in types explicit.

## 5.6.7

### Patch Changes

- [#39787](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39787) [`6900f89eb0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6900f89eb0e) - Internal changes to use space tokens. There is no expected visual or behaviour change.

## 5.6.6

### Patch Changes

- [#37613](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37613) [`29941aaea33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29941aaea33) - update focused fallback color to meet contrast requirement

## 5.6.5

### Patch Changes

- [#39128](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39128) [`3c114ea4257`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c114ea4257) - Update type definitions to conform to inherited changes from `@types/react@16.14.15`.

## 5.6.4

### Patch Changes

- [#38201](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38201) [`356d6ebed05`](https://bitbucket.org/atlassian/atlassian-frontend/commits/356d6ebed05) - This package is now onboarded onto the product push model.

## 5.6.3

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754) [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility testing.

## 5.6.2

### Patch Changes

- [#36661](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36661) [`a01cf0168b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a01cf0168b8) - update border width with border spacing token

## 5.6.1

### Patch Changes

- [#36066](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36066) [`3a8d6f61240`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a8d6f61240) - [ux] Adds `text-overflow: ellipsis` to placeholder text.

## 5.6.0

### Minor Changes

- [#35766](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35766) [`a90730ddb33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a90730ddb33) - Disallow use of unused prop `disabled`. Disabled textfields should use
  `isDisabled`. This change includes a codemod for transitioning existing code
  over to the proper usage.

## 5.5.2

### Patch Changes

- [#35111](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35111) [`8f436f0c301`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f436f0c301) - extend border contrast feature flag to support confluence

## 5.5.1

### Patch Changes

- [#34881](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34881) [`774ed69ecef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/774ed69ecef) - Internal changes to use space tokens for spacing values. There is no visual change.

## 5.5.0

### Minor Changes

- [#33167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33167) [`c9c3a3f43af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9c3a3f43af) - [ux] reduce border width to 1px and update fallback color of border

## 5.4.3

### Patch Changes

- [#34051](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34051) [`49b08bfdf5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49b08bfdf5f) - Migrated use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 5.4.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 5.4.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 5.4.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 5.3.7

### Patch Changes

- [#33004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33004) [`e028bee17df`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e028bee17df) - [ux] fix(style): update fallback color of placeholder to meet contrast requirement

## 5.3.6

### Patch Changes

- Updated dependencies

## 5.3.5

### Patch Changes

- Updated dependencies

## 5.3.4

### Patch Changes

- Updated dependencies

## 5.3.3

### Patch Changes

- Updated dependencies

## 5.3.2

### Patch Changes

- Updated dependencies

## 5.3.1

### Patch Changes

- [#26303](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26303) [`9827dcb82b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9827dcb82b8) - No-op change to introduce spacing tokens to design system components.

## 5.3.0

### Minor Changes

- [#24968](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24968) [`b8841384da6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b8841384da6) - Disabled background and border styles should not be applied to components that have either no background or transparent background to begin with. Textfield and textarea variants that do not have backgrounds (sublte or none) have no backgrounds or borders applied when disabled. As such, any comopnents that consume these will also be affected.

## 5.2.2

### Patch Changes

- [#25314](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25314) [`bedbdec0e82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bedbdec0e82) - Update hover state appearance of subtle Textarea, Textfield and Select components to match the hover states of their default counterparts.

## 5.2.1

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874) [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 5.2.0

### Minor Changes

- [#24004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24004) [`acf974e717c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/acf974e717c) - Updates `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

### Patch Changes

- Updated dependencies

## 5.1.13

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492) [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 5.1.12

### Patch Changes

- [#21570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/21570) [`7c14ea36248`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c14ea36248) - [ux] Updated input tokens within `@atlaskit/textfield`.

## 5.1.11

### Patch Changes

- Updated dependencies

## 5.1.10

### Patch Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650) [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 5.1.9

### Patch Changes

- Updated dependencies

## 5.1.8

### Patch Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618) [`62edf20ab1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62edf20ab1e) - Migrates all usage of brand tokens to either selected or information tokens. This change is purely for semantic reasons, there are no visual or behavioural changes.
- Updated dependencies

## 5.1.7

### Patch Changes

- Updated dependencies

## 5.1.6

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752) [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when auto-fixing by correctly formatting token ids.
- Updated dependencies

## 5.1.5

### Patch Changes

- Updated dependencies

## 5.1.4

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998) [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds for this package now pass through a tokens babel plugin, removing runtime invocations of the tokens() function and improving bundle size.
- Updated dependencies

## 5.1.3

### Patch Changes

- Updated dependencies

## 5.1.2

### Patch Changes

- Updated dependencies

## 5.1.1

### Patch Changes

- Updated dependencies

## 5.1.0

### Minor Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302) [`78ba9e045b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78ba9e045b8) - Internal refactor to align to the design system techstack.
- [`4d34d35270e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d34d35270e) - Instrumented text field with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).
  These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

### Patch Changes

- [`af4bca32ad4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af4bca32ad4) - Internal changes to supress eslint rules.
- [`ac656b4875e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac656b4875e) - Internal style refactor with no visual change.
- Updated dependencies

## 5.0.5

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880) [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 5.0.4

### Patch Changes

- [#12328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12328) [`a7d1415e5e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a7d1415e5e6) - [ux] add high contrast mode supporting for Textfield
- Updated dependencies

## 5.0.3

### Patch Changes

- [#11649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11649) [`6f0bbf09744`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6f0bbf09744) - [ux] Fix disabled TextField text contrast on Safari/WebKit browsers

## 5.0.2

### Patch Changes

- [#12167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12167) [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates to development dependency `storybook-addon-performance`

## 5.0.1

### Patch Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644) [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.

## 5.0.0

### Major Changes

- [#7170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7170) [`9d0f54a809`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d0f54a809)

  **Summary**

  The goal of this major for TextField is to improve the component's performance, by both reducing static structure and avoiding unnecessary function calls.

  **Changes**

  In this version we improved the performance of `TextField` by making it more similar to a native input field and removing the slow theme prop.

  **Theming**

  The `theme` prop allows you to customize the appearance of `TextField`.
  Theming was previously used to customize the container div and input element styling in `TextField`.
  We found that there was minimal usage of this API and it was identified to have a negative performance impact regardless of whether it was used.

  We decided to remove this API to benefit all consumers of `TextField`.
  If you would like to continue customizing TextField we have added data attributes (`data-ds--text-field--container` and `data-ds--text-field--input`) to both container div and input element of `TextField`.
  Therefore consumers can use this if they want to override style of respective element in `TextField`. For example,

  ```jsx
  import React from 'react';
  import { css } from '@emotion/core';
  import { TextField } from '@atlaskit/textfield';

  export default function CustomStyleExample() {
    return (
      <TextField
        css={{
          padding: 5,
          border: '2px solid orange',
          '& > [data-ds--text-field--input]': {
            fontSize: 20,
            border: '2px solid green',
          },
        }}
      />
    );
  }
  ```

  You can also override CSS using `className` and data-attributes in `TextField`.

  ```jsx
  // component
  import React from 'react';
  import { TextField } from '@atlaskit/textfield';
  import './styles.css';

  export default () => {
    return (
        <TextField
          width="large"
          className='myClass'
        />
    );
  };

  // styles.css
  .myClass [data-ds--text-field--container] {
    border: 2px solid orange;
    padding: 5px;
  }
  .myClass [data-ds--text-field--input] {
    border: 2px solid green;
    font-size: 20px;
  };

  ```

  Note that `TextField` still supports the light mode / dark mode global token.
  Along with this change we have removed the exports `ThemeProps`, `ThemeTokens` and `Theme` from `TextField` as they can no longer be used with the removal of `theme`.

  ### Other changes

  - Previously all interaction styles were generated in JavaScript using events, causing unnecessary and slow re-renders for actions like hovering and focusing. Now all styles for the `TextField` are applied using CSS selectors.
  - Updated the entry point to only export `TextField` and `TextFieldProps`. These exports `ThemeProps`, `ThemeTokens` and `Theme` have now been removed.

  ### Automatic upgrading

  There is a codemod that assists you in upgrading most of the changes from above.
  However, a manual step is still required to override styles via data attributes.

  - Removes `theme` and `overrides` prop.
  - Removes imports of `ThemeProps`, `ThemeTokens` and `Theme`.

  ```

  # You first need to have the latest `TextField` installed before you can run the codemod
  `yarn upgrade @atlaskit/textfield@^5.0.0`

  # Run the codemod cli
  # Pass in a parser for your codebase
  npx @atlaskit/codemod-cli /path/to/target/directory --parser [tsx | flow | babel]
  ```

## 4.0.10

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857) [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 4.0.9

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497) [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 4.0.8

### Patch Changes

- Updated dependencies

## 4.0.7

### Patch Changes

- [#5164](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5164) [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo analytics-next file restructure to allow external ts definitions to continue working

## 4.0.6

### Patch Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749) [`6529a49064`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6529a49064) - Removed IE11 and outdated browser-prefixed styles targeting the placeholder attribute
- Updated dependencies

## 4.0.5

### Patch Changes

- [#4707](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4707) [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 4.0.4

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885) [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 4.0.3

### Patch Changes

- [#4393](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4393) [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 4.0.2

### Patch Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823) [`e99262c6f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e99262c6f0) - All form elements now have a default font explicitly set

## 4.0.1

### Patch Changes

- [#3293](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3293) [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme and package information has been updated to point to the new design system website.

## 4.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335) [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 3.1.13

### Patch Changes

- [#2763](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2763) [`088c636cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/088c636cbd) - Updated disabled state border-color to match the ADG spec. It now appears as if there is no border on a disabled textfield.

## 3.1.12

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866) [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 3.1.11

### Patch Changes

- Updated dependencies

## 3.1.10

### Patch Changes

- [#1868](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/1868) [`83f4f94df3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83f4f94df3) - Change imports to comply with Atlassian conventions- Updated dependencies

## 3.1.9

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
  - @atlaskit/avatar@17.1.9
  - @atlaskit/button@13.3.9
  - @atlaskit/form@7.1.5

## 3.1.8

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/avatar@17.1.8
  - @atlaskit/button@13.3.8
  - @atlaskit/form@7.1.4

## 3.1.7

### Patch Changes

- [patch][91a1eb05db](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a1eb05db):

  Textfield now exports its props as TextFieldProps- Updated dependencies [eaad41d56c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eaad41d56c):

- Updated dependencies [c12ba5eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/c12ba5eb3e):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
  - @atlaskit/form@7.1.3
  - @atlaskit/icon@20.0.2

## 3.1.6

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/avatar@17.1.7
  - @atlaskit/button@13.3.7
  - @atlaskit/form@7.1.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/theme@9.5.1

## 3.1.5

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
- Updated dependencies [b9dc265bc9](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9dc265bc9):
  - @atlaskit/icon@20.0.0
  - @atlaskit/avatar@17.1.6
  - @atlaskit/form@7.1.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6

## 3.1.4

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Form has been converted to Typescript. TypeScript consumers will now get static type safety. Flow types are no longer provided. No API changes.- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Added name prop to component prop types.- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/form@7.0.0
  - @atlaskit/avatar@17.1.5

## 3.1.3

### Patch Changes

- [patch][557a8e2451](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/557a8e2451):

  Rebuilds package to fix typescript typing error.

## 3.1.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 3.1.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 3.1.0

### Minor Changes

- [minor][9638c553c0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9638c553c0):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help products to write better integration and end to end tests.

## 3.0.7

### Patch Changes

- [patch][d5def52d98](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5def52d98):

  Refactored textfield styles to better support border-box being set globally.

## 3.0.6

- Updated dependencies [8d0f37c23e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d0f37c23e):
  - @atlaskit/avatar@17.0.0
  - @atlaskit/theme@9.2.2

## 3.0.5

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 3.0.4

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 3.0.3

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 3.0.2

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 3.0.1

- Updated dependencies [926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):
  - @atlaskit/analytics-next@6.0.0
  - @atlaskit/avatar@16.0.10
  - @atlaskit/button@13.1.2

## 3.0.0

### Major Changes

- [major][84887b940c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84887b940c):

  - Converting from flow to typescript 🎉
  - Correctly typing the current prop spreading onto the internal `<input>` element
  - Removing `isHovered` and `isFocused` from public API as they previously did not do anything

## 2.0.5

### Patch Changes

- [patch][2fe6e8fbdf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2fe6e8fbdf):

  Removed unused dependencies from package.json for textfield: @emotion/core was unused.

## 2.0.4

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 2.0.3

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/avatar@16.0.6
  - @atlaskit/button@13.0.9
  - @atlaskit/form@6.1.1
  - @atlaskit/icon@19.0.0

## 2.0.2

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 2.0.1

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/avatar@16.0.3
  - @atlaskit/button@13.0.8
  - @atlaskit/form@6.0.5
  - @atlaskit/icon@18.0.0

## 2.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 1.0.0

- [major][6cdf11238d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cdf11238d):

  - This major release indicates that this package is no longer under dev preview but is ready for use

## 0.4.5

- [patch][7157a95389](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7157a95389):

  - Internal changes only. Textfield is compatible with SSR.

## 0.4.4

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/avatar@15.0.4
  - @atlaskit/button@12.0.3
  - @atlaskit/form@5.2.7
  - @atlaskit/icon@16.0.9
  - @atlaskit/theme@8.1.7

## 0.4.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/avatar@15.0.3
  - @atlaskit/form@5.2.5
  - @atlaskit/icon@16.0.8
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 0.4.2

- [patch][a28eb04426](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a28eb04426):

  - Migrates package from emotion 9 to emotion 10. No behaviour or API changes.

## 0.4.1

- [patch][e0797c2937](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e0797c2937):

  - Support object refs e.g. React.createRef()

## 0.4.0

- [minor][8eff47cacb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8eff47cacb):

  - Allow element before and/or after input

## 0.3.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/form@5.2.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 0.3.0

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

## 0.2.0

- [minor][e9b824bf86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9b824bf86):

  - **Breaking**: Changes to the `theme` prop. The type of this prop remains as `(ThemeTokens, ThemeProps) => ThemeTokens`.
    - The shape of `ThemeTokens` has changed. `container` and `input` keys are now required. The value of these keys are style objects.
    - More information has been added to ThemeProps.

  ```diff
  type ThemeTokens = {
  - backgroundColor: string
  - backgroundColorFocus: string
  - backgroundColorHover: string
  - borderColor: string
  - borderColorFocus: string
  - textColor: string
  - disabledTextColor: string
  - placeholderTextColor: string
  + container: Object,
  + input: Object
  }

  type ThemeProps = {
    appearance: ThemeAppearance,
    mode: 'dark' | 'light',
  +  isDisabled: boolean,
  +  isFocused: boolean,
  +  isHovered: boolean,
  +  isInvalid: boolean,
  +  isMonospaced: boolean,
  +  isCompact: boolean,
  +  width?: string | number,
  };
  ```

## 0.1.6

- [patch][3d8322bd71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d8322bd71):

  - Trival refactor: update a variable name

## 0.1.5

- [patch][2e5dd50](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e5dd50):

  - Update validation example to be compatible with the new Forms API

- Updated dependencies [647a46f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/647a46f):
  - @atlaskit/form@5.0.0

## 0.1.4

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/form@4.0.21
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 0.1.3

- [patch][63f969d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/63f969d):

  - Fixed height of compact textfields to correctly be 32px instead of 28px

## 0.1.2

- [patch][480a57c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/480a57c):

  - Convert to use new theme API.

## 0.1.1

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/form@4.0.18
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 0.1.0

- [minor][62109bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/62109bd):

  - Refactor of field-text to remove field-base and normalise along api patterns established in other form components.
