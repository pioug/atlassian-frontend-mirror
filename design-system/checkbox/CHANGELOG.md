# @atlaskit/checkbox

## 12.3.2

### Patch Changes

- Updated dependencies

## 12.3.1

### Patch Changes

- [`6e2231d4609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e2231d4609) - Checkbox no longer creates an empty `<span/>` element next to the input if no label is provided.
- Updated dependencies

## 12.3.0

### Minor Changes

- [`fe79d66ea34`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe79d66ea34) - Instruments checkbox with the new tokens api. This will continue to work alongside the existing theming implementation. No visual changes

### Patch Changes

- [`b6b4c4100cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6b4c4100cd) - Updates high contrast css declarations to use system color tokens + generic media query
- [`2d7cc544696`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d7cc544696) - Updates token usage to match the latest token set
- Updated dependencies

## 12.2.2

### Patch Changes

- [`18c128f6b73`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18c128f6b73) - [ux] Fix bug in which modified click events (e.g. Ctrl+Click) would not get passed down to the underlying input element in Firefox.
- Updated dependencies

## 12.2.1

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 12.2.0

### Minor Changes

- [`987e2fc4ddd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/987e2fc4ddd) - Add configuration to eslint rule label-has-associated-control

### Patch Changes

- [`3c67db1a6e9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c67db1a6e9) - Fix for checkbox to account for a change in the @atlaskit/icon API
- Updated dependencies

## 12.1.3

### Patch Changes

- [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates to development dependency `storybook-addon-performance`

## 12.1.2

### Patch Changes

- [`37324ccc750`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37324ccc750) - Fix styling error causing rendering errors in iOS Safari, and focus rings in Firefox

## 12.1.1

### Patch Changes

- [`a99925b1634`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a99925b1634) - Added styles for edge high contrast modes (black on white and white on black)
- Updated dependencies

## 12.1.0

### Minor Changes

- [`02a0cdbd98b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02a0cdbd98b) - Added aria-invalid to checkbox input which corresponds the isInvalid prop

## 12.0.2

### Patch Changes

- [`e0278312c57`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0278312c57) - Checkbox now uses the new `SVG` component from @atlaskit/icon.
- Updated dependencies

## 12.0.1

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.
- [`08c1f789a45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08c1f789a45) - [ux] Fixes flickering when transitioning to and from indeterminate states

## 12.0.0

### Major Changes

In this version, we made `Checkbox` dramatically faster and more lightweight 😍

### Changes

In `12.0.0` we improved the performance of `Checkbox` by making it more similar to a native checkbox and removing performance-heavy API.

### Overrides

`overrides` is an API that allowed extreme customisation flexibility. Previously you could customise the css and attributes of 6 internal components or replace the component entirely.

```
<Checkbox
  overrides={{
    IconWrapper: {
      cssFn: defaultStyles => {
        ...defaultStyles,
        transition: 'all 0.3 cubic-bezier',
      },
      component: SomeCustomComponent,
      attributes: { 'data-custom': true }
    }
  }}
/>
```

This proved to be a significant performance problem even if you weren't using the API. It also exposes internal structure as external API which prevents us from changing the structure and improving the component. We found that not many consumers were using `overrides` so we decided to benefit all consumers of `Checkbox` we have removed `overrides` from the package. If you are using `overrides` and we haven't already been in contact with you, contact the design system team for assistance in migrating away from it.

### Theming

`theme` is another API that allows you to customise the appearance of `Checkbox`. Theming could previously be used to customise the various colours, spacing and sizes used in `Checkbox`. Much like `overrides` there was minimal usage of this API and it was identified to have a negative performance impact regardless of whether it was used.

We decided to also remove this API to benefit all consumers of `Checkbox`. If you would like to continue customising checkbox there are now two ways of doing this. `Checkbox` now spreads any `HTMLInputAttribute` onto the checkbox input. Therefore you can put a `className` on the checkbox input and target the svg that is actually being shown, in the exact same way that we target the svg based off checkbox styles. For example,

```
import React from 'react';
import { css } from '@emotion/core';
import { Checkbox } from '@atlaskit/checkbox;

export default function CustomStyleExample() {
  return (
    <Checkbox
      label="Custom style checkbox"
      css={css`
        & + svg {
          margin-left: -2px;
        }
      `}
    />
  )
}
```

You can also customise the size of the `Checkbox` with the size prop.

```
import React from 'react';

import { Checkbox } from '@atlaskit/Checkbox';

export default function LargeSizeExample() {
  return (
    <Checkbox
      defaultChecked
      value="Large checkbox"
      label="Large checkbox"
      name="checkbox-basic"
      size="large"
      testId="large"
    />
  );
}

```

Note that `Checkbox` still supports the light mode / dark mode global token. Along with this change we have removed the exports `ComponentTokens` and `ThemeFn` from `Checkbox` as they can no longer be used with the removal of `theme`.

### Other changes

- Previously all interaction styles were generated in JS using events, causing unnecessary and slow rerenders for actions like hovering and focusing. Now all styles for the `Checkbox` are applied using css selectors.
- To generate less dom elements we have removed the dependency on `@atlaskit/icon` and instead changed to an `svg` that can be customised to be the default checkbox or the indeterminate checkbox. This `svg` is styled from the input element with the sibling selector.
- The disabled state of `Checkbox` previously had no border. This was not intentional and now `Checkbox` has a 2px border when it is disabled, this is consistent with all other states of `Checkbox`.
- `CheckboxProps` now extends `HTMLInputAttribute` which means you can pass any input attribute as a prop onto `Checkbox`.
- Changed the `inputRef` prop to be `ref` which returns the `ref` of the checkbox input using `forwardRef`. This new `ref` prop will accept the type of the old `inputRef` prop, `(input?: HTMLInputElement) => any`, as well as if `ref` is created with `createRef`.
- Removed the prop `isFullWidth` as it did not do anything.
- Updated the entry point to only export `Checkbox` and `CheckboxProps`. `Checkbox` can now be a named or default import. As the old entry point allowed access to every export at the base level these exports have now been removed; `ComponentTokens`, `ThemeFn`, `CheckboxWithoutAnalytics`, `CheckboxIcon` as well as all exported types.
- Changed indeterminate checkboxes to set `aria-checked` to be `mixed`.

### Automatic upgrading

There is a codemod that assists you in upgrading most of the changes from above.

- Removes `isFullWidth`, `theme` and `overrides` prop.
- Shifts over usages of `inputRef` to `ref`
- Removes imports of `ComponentTokens` and `ThemeFn`.
- Changes imports of `CheckboxProps` to be at the base level.
- Changes imports of `CheckboxWithoutAnalytics` to import `Checkbox` at the base level.

```
# You first need to have the latest `Checkbox` installed before you can run the codemod
yarn upgrade @atlaskit/checkbox@^12.0.0

# Run the codemod cli
# Pass in a parser for your codebase
npx @atlaskit/codemod-cli /path/to/target/directory --parser [tsx | flow | babel]
```

### Patch Changes

- [`c7604cdf02`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c7604cdf02) - In `12.0.0` the `checkbox` input accidentally changed vertical alignment from `top` to `center`. This had a visual impact when you had a checkbox label the spanned multiple lines. This changes the vertical alignment of the `checkbox` input back to `top`.
- [`6cb7f0c5e5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6cb7f0c5e5) - Patch fix to make the svg not shrink and give Checkbox a display name.

## 11.0.8

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 11.0.7

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 11.0.6

### Patch Changes

- Updated dependencies

## 11.0.5

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 11.0.4

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 11.0.3

### Patch Changes

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- [`e99262c6f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e99262c6f0) - All form elements now have a default font explicitly set

## 11.0.2

### Patch Changes

- [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme and package information has been updated to point to the new design system website.

## 11.0.1

### Patch Changes

- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 11.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 10.1.14

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 10.1.13

### Patch Changes

- [`54d82b49f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d82b49f0) - Remove unused dependencies

## 10.1.12

### Patch Changes

- Updated dependencies

## 10.1.11

### Patch Changes

- [patch][68ff159118](https://bitbucket.org/atlassian/atlassian-frontend/commits/68ff159118):

  Change imports to comply with Atlassian conventions- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [0059d26429](https://bitbucket.org/atlassian/atlassian-frontend/commits/0059d26429):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/form@7.2.1
  - @atlaskit/webdriver-runner@0.3.4

## 10.1.10

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
  - @atlaskit/button@13.3.9
  - @atlaskit/form@7.1.5
  - @atlaskit/section-message@4.1.7

## 10.1.9

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/form@7.1.4
  - @atlaskit/section-message@4.1.6

## 10.1.8

### Patch Changes

- [patch][c1992227dc](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1992227dc):

  Bump to lodash.merge to 4.6.2- Updated dependencies [eaad41d56c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eaad41d56c):

- Updated dependencies [c12ba5eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/c12ba5eb3e):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
  - @atlaskit/form@7.1.3
  - @atlaskit/icon@20.0.2

## 10.1.7

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/form@7.1.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/section-message@4.1.5
  - @atlaskit/theme@9.5.1

## 10.1.6

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/form@7.1.1
  - @atlaskit/section-message@4.1.4
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6

## 10.1.5

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result- [patch][6a8bc6f866](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a8bc6f866):

  Fixes an issue where focus rings and borders were not appearing as expected on some checkboxes- Updated dependencies [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5
  - @atlaskit/section-message@4.1.3

## 10.1.4

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Form has been converted to Typescript. TypeScript consumers will now get static type safety. Flow types are no longer provided. No API changes.- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  fixes disabled checkbox not having correct cursor when hovering over icons- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/form@7.0.0

## 10.1.3

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

## 10.1.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 10.1.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 10.1.0

### Minor Changes

- [minor][f22f6e1e4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f22f6e1e4f):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help products to write better integration and end to end tests.

## 10.0.0

### Major Changes

- [major][97bab7fd28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bab7fd28):

  `@atlaskit/checkbox` **10.x** includes the following changes:

  - Replaced previous theme implementation with new `@atlaskit/theme` v2 implementation
    - Please read more about this implementation in the [theming guide](https://atlaskit.atlassian.com/packages/core/theme/docs/theming-guide)
  - Added `overrides` prop which enables targeted customisations of key components in the @atlaskit/checkbox package.
    - Please read more about this implementation in the [overrides guide](https://atlaskit.atlassian.com/packages/core/theme/docs/overrides-guide)

  ### Breaking Changes

  **HiddenCheckbox and spread props**

  Passing props to the `<Checkbox/>` component for them to be spread onto the underlying `<HiddenCheckbox/>` component is now **no longer possible**.
  `@atlaskit/checkbox` still supports passing props down to the `<HiddenCheckbox/>` component, however we've opted to make this behaviour more explicit.

  Whereas previously you would do this:

  ```js
  <Checkbox
    ...supportedCheckboxProps
    'data-testid'='test-checkbox'
  />
  ```

  Now you would leverage the overrides prop to pass these props down to the `<HiddenCheckbox/>` component like so:

  ```js
  <Checkbox
    ...supportedCheckboxProps
    overrides={{
      HiddenCheckbox:{
        attributesFn: () => ({ 'data-testid': 'test-checkbox' })
      }
    }}
  />
  ```

## 9.0.9

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 9.0.8

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 9.0.7

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 9.0.6

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 9.0.5

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

## 9.0.4

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

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

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 9.0.0

### Major Changes

- [major][87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):

  Replaced `styled-components` with `emotion 10` as part of Atlaskit-wide conversion process.

  **No changes to styling or API**; only a breaking change if checkbox is being styled using the styled-components `styled` function or via the styled-components theming library.

## 8.0.5

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/form@6.1.1
  - @atlaskit/section-message@4.0.5
  - @atlaskit/icon@19.0.0

## 8.0.4

### Patch Changes

- [patch][9c404c7c44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c404c7c44):

  Using updated icons

## 8.0.3

### Patch Changes

- [patch][9c80ef7539](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c80ef7539):

  The update to node 10 reveals that unknown type is breaking the extract react types. I had to replace unknown type by any

## 8.0.2

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/form@6.0.5
  - @atlaskit/section-message@4.0.2
  - @atlaskit/icon@18.0.0

## 8.0.1

### Patch Changes

- [patch][c67483c207](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c67483c207):

  Fixed a scrollbar bug with checkboxes

## 8.0.0

- [major][70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):

  - Checkbox has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 7.0.1

- Updated dependencies [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/form@6.0.2
  - @atlaskit/icon@17.1.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 7.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 6.0.4

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/form@5.2.7
  - @atlaskit/icon@16.0.9
  - @atlaskit/section-message@2.0.3
  - @atlaskit/theme@8.1.7

## 6.0.3

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/form@5.2.5
  - @atlaskit/icon@16.0.8
  - @atlaskit/section-message@2.0.2
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 6.0.2

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

## 6.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/form@5.2.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/section-message@2.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 6.0.0

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

## 5.0.14

- [patch][c0ad531a70](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c0ad531a70):

  - Added test to make use props are passed down to hidden input

## 5.0.13

- [patch][3ae465b6f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3ae465b6f0):

  - fix for checkbox logging error on mount

## 5.0.12

- [patch][b0153ee6c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0153ee6c9):

  - Enabled the isRequired validation on checkbox and added the asterisk after the checkbox label to signify the required field

## 5.0.11

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/section-message@1.0.16
  - @atlaskit/icon@16.0.0

## 5.0.10

- [patch][fad28be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fad28be):

  - Fixing invalid type for checkbox id prop

## 5.0.9

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/icon@15.0.2
  - @atlaskit/section-message@1.0.14
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 5.0.8

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/icon@15.0.1
  - @atlaskit/section-message@1.0.13
  - @atlaskit/theme@7.0.0

## 5.0.7

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/section-message@1.0.12
  - @atlaskit/icon@15.0.0

## 5.0.6

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/icon@14.6.1
  - @atlaskit/section-message@1.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 5.0.5

- [patch] Upgrade guide & minor flow type fixes [0be287d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0be287d)

## 5.0.4

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 5.0.3

- [patch] Fixed bug where checkbox would use state isChecked value when passing false to isChecked as props [eaf8d16](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eaf8d16)

## 5.0.2

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/icon@14.0.0

## 5.0.1

- [patch] Checkbox now only fires onChange once [c78e59e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c78e59e)

## 5.0.0

- [major] Checkbox refactored to remove the need for CheckboxStateless [80e1925](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80e1925)

  `@atlaskit/checkbox` 5.x is part of an ongoing body of work to normalize atlaskit form components.
  There are a few breaking changes you need to be aware of in upgrading from 4.x to 5.x.

  **Exports**

  `@atlaskit/checkbox` no longer specifies the Checkbox component as the default export.
  Moreover the following changes have been made to exports from the `@atlaskit/checkbox` package.

  ### Checkbox

  Checkbox is now a named export of the `@atlaskit/checkbox`package. Please import it as below.

  ```
  import { Checkbox } from @atlaskit/checkbox;
  ```

  The Checkbox component is now a conditionally controlled component, the `isChecked` prop is exposed for users to control the checked state of the component.
  This was the sole reason for having the `CheckboxStateless` component in pre 5.x, and as a result leveraging this pattern allows us to do away with the `CheckboxStateless` component.

  To let the component take care of checked state, leave the `isChecked` prop unset, or explicitly set it to undefined.

  Additionally, one can control the initial checked state of a component by setting the `defaultChecked` (boolean) prop.
  This is used as the initial value of the internal `isChecked` property in state. This value will be overridden by additional user interactions with the component.

  ### CheckboxStateless - deprecated

  This component has been deprecated in favor of the conditionally controlled component pattern specified above.\*\*

  ### CheckboxGroup - deprecated:

  `@atlaskit/checkbox` no longer exports a CheckboxGroup component. It has been removed for the following reasons:

  - It was really a thin wrapper enforcing very basic styling opinions over its children (display: flex, flex: column).
  - The existing styling blocks the horizontal display of checkbox group children.

  **Prop Changes**

  - `<Checkbox/>` - `initiallyChecked` renamed to `defaultChecked`
  - `<Checkbox/>` - `label` prop now accepts type Node instead of type string.
  - `<Checkbox/>` - `isChecked` is now an optional boolean prop on the Checkbox component.

## 4.0.6

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 4.0.4

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/icon@13.2.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 4.0.3

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/icon@13.2.4

## 4.0.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2

## 4.0.1

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/icon@13.2.1

## 4.0.0

- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0

## 3.1.3

- [patch] Button should be a dev dependency [50ca31b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ca31b)
- [none] Updated dependencies [50ca31b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ca31b)

## 3.1.2

- [patch] Fix \$FlowFixMe and release packages [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/button@8.2.2
  - @atlaskit/icon@12.3.1

## 3.1.1

- [patch] update to active box color of checkbox to b50 to inline with ADG3 guideline [21073ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21073ca)
- [none] Updated dependencies [21073ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/21073ca)

## 3.1.0

- [minor] Fixes types for Flow 0.74 [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [none] Updated dependencies [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
  - @atlaskit/button@8.2.0
  - @atlaskit/icon@12.2.0

## 3.0.6

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/icon@12.1.2

## 3.0.5

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/icon@12.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 3.0.4

- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/button@8.1.0

## 3.0.3

- [patch] ref prop on checkbox stateless component is now reference to class [05b4ffd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05b4ffd)
- [none] Updated dependencies [05b4ffd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05b4ffd)

## 3.0.2

- [patch] Fix for flow [33f632f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/33f632f)
- [patch] Update onChange function to pass type for name and value [f3e768c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f3e768c)
- [none] Updated dependencies [33f632f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/33f632f)
- [none] Updated dependencies [f3e768c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f3e768c)

## 3.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/icon@12.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 3.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/icon@12.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 2.1.0

- [minor] Updated the appearance for checkbox and radio items [ece7426](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ece7426)
- [none] Updated dependencies [ece7426](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ece7426)

## 2.0.2

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 2.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 1.4.0

- [minor] Add indeterminate prop to stateless checkbox [3fc6c5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3fc6c5e)

## 1.3.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 1.3.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 1.2.3

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 1.2.2

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 1.2.1

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 1.2.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 1.1.8

- [patch] update flow dep, fix flow errors [722ad83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/722ad83)

## 1.1.7

- [patch] Updates dependency on button to 6.0.0 [2b02ebc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b02ebc)
- [patch] Moved to new repo & build system. Cleaned up docs & examples & added Flow [9b55672](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b55672)

## 1.1.6 (2017-11-24)

### Bug Fixes

- **component:** fixed typo in Checkbox defaultProps ([4388a11](https://bitbucket.org/atlassian/atlaskit/commits/4388a11))

## 1.1.5 (2017-11-22)

### Bug Fixes

- **component:** checkbox and radio should not highlight when parent element is focused ([5c900ff](https://bitbucket.org/atlassian/atlaskit/commits/5c900ff))
- **component:** removed focus styling from radio and checkbox svg as they will never be focused ([ec68128](https://bitbucket.org/atlassian/atlaskit/commits/ec68128))

## 1.1.4 (2017-11-15)

### Bug Fixes

- **component:** bumping internal dependencies to latest major version ([91833c3](https://bitbucket.org/atlassian/atlaskit/commits/91833c3))

## 1.1.3 (2017-10-27)

### Bug Fixes

- **stories:** rebuild stories ([7aa7337](https://bitbucket.org/atlassian/atlaskit/commits/7aa7337))

## 1.1.2 (2017-10-22)

### Bug Fixes

- **package:** update dependencies for react-16 ([077d1ad](https://bitbucket.org/atlassian/atlaskit/commits/077d1ad))

## 1.1.1 (2017-10-10)

### Bug Fixes

- **package:** removed internal label from keywords ([b76b4f2](https://bitbucket.org/atlassian/atlaskit/commits/b76b4f2))

# 1.1.0 (2017-09-27)

### Bug Fixes

- **component:** change margin of icon ([4459e96](https://bitbucket.org/atlassian/atlaskit/commits/4459e96))

### Features

- **component:** dark mode checkbox ([554c978](https://bitbucket.org/atlassian/atlaskit/commits/554c978))

# 1.0.0 (2017-09-13)

### Features

- **component:** create checkbox component ([5ce7055](https://bitbucket.org/atlassian/atlaskit/commits/5ce7055))
