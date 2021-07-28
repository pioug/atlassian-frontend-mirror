# @atlaskit/flag

## 14.4.0

### Minor Changes

- [`230e1862182`](https://bitbucket.org/atlassian/atlassian-frontend/commits/230e1862182) - Fix a11y eslint error in Flag component

### Patch Changes

- Updated dependencies

## 14.3.4

### Patch Changes

- [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 14.3.3

### Patch Changes

- [`bc7669cb402`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc7669cb402) - [ux] Fixed flag labels to be more accurately describe their elements.

## 14.3.2

### Patch Changes

- [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates to development dependency `storybook-addon-performance`

## 14.3.1

### Patch Changes

- [`1964787a3ce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1964787a3ce) - [ux] fixes issue where flags wrapped in another component would fail to autodismiss after 8 seconds in FlagGroup
- Updated dependencies

## 14.3.0

### Minor Changes

- [`c139588c86d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c139588c86d) - Remove aria-expanded attribute from Flag close buttons

## 14.2.4

### Patch Changes

- Updated dependencies

## 14.2.3

### Patch Changes

- [`57f551bad1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/57f551bad1f) - Flag group children types now can have falsy children.

## 14.2.2

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.
- [`b11ea3f327e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b11ea3f327e) - [ux] Fix text not being able to be selected.
- Updated dependencies

## 14.2.1

### Patch Changes

- [`952019cfd39`](https://bitbucket.org/atlassian/atlassian-frontend/commits/952019cfd39) - Removed extraneous/unnecessary dependencies for design system components.

## 14.2.0

### Minor Changes

- [`6a9e722703e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a9e722703e) - You can now place an `onDismissed` prop on a Flag. This was removed as part of a major version upgrade and was previously a "private prop". It has been added back as there is a need for a Flag to know when it is being dimissed.

## 14.1.0

### Minor Changes

- [`f92b240fc3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f92b240fc3) - Add an optional id attribute to FlagGroup via props

## 14.0.8

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 14.0.7

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 14.0.6

### Patch Changes

- Updated dependencies

## 14.0.5

### Patch Changes

- [`83e32fa998`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83e32fa998) - Now uses `useAnalyticsEventHandler` in @atlaskit/analytics-next rather than its own version of the hook
- [`93b04d1161`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93b04d1161) - Fixed focus ring cut off issue on flag
- Updated dependencies

## 14.0.4

### Patch Changes

- [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 14.0.3

### Patch Changes

- [`c740579074`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c740579074) - The h2 for Flag Groups no longer causes scrollbars to be triggered when a flag displays.

## 14.0.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 14.0.1

### Patch Changes

- [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme and package information has been updated to point to the new design system website.

## 14.0.0

### Major Changes

- [`807cd28fc0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/807cd28fc0) - In this version we made flag dramatically faster, lighter and easier to use 🤩

  ### Changes

  In `13.0.0` we bring significant performance improvements as well as improving the experience of using flag.

  - Flag no longer has a `peerDependency` on `styled-components@3`. Internally flag is now using `@emotion/core` for styling
  - Change Flag and FlagGroup to use our standardized and performant `@atlaskit/motion` instead of `react-transition-group`. Along with this change exit animations are now 2x quicker than the entering animation as per the standardized animation practices in `motion`.
  - Add a `FlagProvider` wrapper for single page applications that allows you to show flags in a flag group imperatively by calling a function, `showFlags` that is stored in the context. Check the docs for more details
  - Removed the private props `isDismissAllowed` and `onDismissed` from `FlagProps`, in favour of accessing them from context that FlagGroup creates.
  - Made types more specific, `onDismissed` on `FlagGroup` is now defined as `(id: number | string, analyticsEvent: UIAnalyticsEvent) => void`

### Patch Changes

- [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all the theme imports to be tree-shakable

## 13.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 12.4.5

### Patch Changes

- [`eec3c9944e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eec3c9944e) - Export FlagProps type

## 12.4.4

### Patch Changes

- [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 12.4.3

### Patch Changes

- [`4560b65a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4560b65a4f) - upgrade react-transition-group to latest

## 12.4.2

### Patch Changes

- [`98f462e2aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98f462e2aa) - Bumping use the latest version of @atlaskit/spinner
- Updated dependencies

## 12.4.1

### Patch Changes

- Updated dependencies

## 12.4.0

### Minor Changes

- [`958b2bf6f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/958b2bf6f8) - FIX: Screen reader text won't be rendered when there is no flag
  FIX: FlagGroup screen reader text defaults to `h2` tag now. Was previously h1.
  NEW: Customize screen reader text and the tag that renders the text

### Patch Changes

- Updated dependencies

## 12.3.11

### Patch Changes

- [patch][bf7a09790f](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf7a09790f):

  Change imports to comply with Atlassian conventions- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/webdriver-runner@0.3.4

## 12.3.10

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
  - @atlaskit/field-radio-group@7.0.2
  - @atlaskit/button@13.3.9
  - @atlaskit/spinner@12.1.6

## 12.3.9

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/button@13.3.8
  - @atlaskit/spinner@12.1.5

## 12.3.8

### Patch Changes

- [patch][5ecbbaadb3](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ecbbaadb3):

  Fixes flag icon being slightly off center.- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):

  - @atlaskit/icon@20.0.2

## 12.3.7

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/field-radio-group@7.0.1
  - @atlaskit/icon@20.0.1
  - @atlaskit/portal@3.1.6
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1

## 12.3.6

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/field-radio-group@7.0.0
  - @atlaskit/icon@20.0.0
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/portal@3.1.5

## 12.3.5

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result- Updated dependencies [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/icon@19.1.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5
  - @atlaskit/portal@3.1.4
  - @atlaskit/spinner@12.1.3

## 12.3.4

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

## 12.3.3

### Patch Changes

- [patch][f86839ca4e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f86839ca4e):

  @atlaskit/portal had an issue in IE11 and this is fixed in 3.1.2

## 12.3.2

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 12.3.1

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 12.3.0

### Minor Changes

- [minor][33d2e11038](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/33d2e11038):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help products to write better integration and end to end tests.

## 12.2.2

### Patch Changes

- [patch][2b158873d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b158873d1):

  Add linting rule to prevent unsafe usage of setTimeout within React components.

## 12.2.1

### Patch Changes

- [patch][67a3a1ee02](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67a3a1ee02):

  Converts prop types to interfaces

## 12.2.0

### Minor Changes

- [minor][c6efb2f5b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c6efb2f5b6):

  Prefix the legacy lifecycle methods with UNSAFE\_\* to avoid warning in React 16.9+

  More information about the deprecation of lifecycles methods can be found here:
  https://reactjs.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes

## 12.1.0

### Minor Changes

- [minor][3e0267e5dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e0267e5dd):

  FlagGroup is centered on mobile

## 12.0.20

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 12.0.19

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 12.0.18

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 12.0.17

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 12.0.16

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

## 12.0.15

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 12.0.14

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 12.0.13

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 12.0.12

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 12.0.11

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

## 12.0.10

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/field-radio-group@6.0.4
  - @atlaskit/portal@3.0.7
  - @atlaskit/icon@19.0.0

## 12.0.9

### Patch Changes

- [patch][76b4718f7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76b4718f7d):

  Fixing mounting and unmounting animations

## 12.0.8

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 12.0.7

### Patch Changes

- [patch][93bcf314c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93bcf314c6):

  Added missing tslib dep

## 12.0.6

### Patch Changes

- [patch][9c80ef7539](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c80ef7539):

  The update to node 10 reveals that unknown type is breaking the extract react types. I had to replace unknown type by any

## 12.0.5

### Patch Changes

- [patch][ff649e1001](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff649e1001):

  Widens type of title prop from string to ReactNode. This gives flexibility to pass i18n components as flag titles.

## 12.0.4

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/field-radio-group@6.0.2
  - @atlaskit/portal@3.0.3
  - @atlaskit/icon@18.0.0

## 12.0.3

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 12.0.2

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
- Updated dependencies [dacfb81ca1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dacfb81ca1):
  - @atlaskit/button@13.0.4
  - @atlaskit/spinner@12.0.0
  - @atlaskit/portal@3.0.0

## 12.0.1

- [patch][cdba81d4f2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba81d4f2):

  - export the correct types so typescript usage works correctly

## 12.0.0

- [major][238b65171f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/238b65171f):

  - @atlaskit/flag has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 11.0.1

- [patch][dccab11ef4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dccab11ef4):

  - Fixed incorrect flag appearing after dismiss a previous one

## 11.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 10.0.7

- Updated dependencies [5b6b4d6a0f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b6b4d6a0f):
  - @atlaskit/portal@1.0.0

## 10.0.6

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/field-radio-group@5.0.3
  - @atlaskit/icon@16.0.9
  - @atlaskit/spinner@10.0.7
  - @atlaskit/theme@8.1.7

## 10.0.5

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/field-radio-group@5.0.2
  - @atlaskit/icon@16.0.8
  - @atlaskit/portal@0.3.1
  - @atlaskit/spinner@10.0.5
  - @atlaskit/theme@8.1.6
  - @atlaskit/button@12.0.0

## 10.0.4

- [patch][23672bbd2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23672bbd2d):

  - Improvement: Align the flag actions with title and text for normal appearance flags

## 10.0.3

- Updated dependencies [ce4e1b4780](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce4e1b4780):
  - @atlaskit/portal@0.3.0

## 10.0.2

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

## 10.0.1

- Updated dependencies [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/analytics-next@4.0.1
  - @atlaskit/field-radio-group@5.0.1
  - @atlaskit/icon@16.0.5
  - @atlaskit/portal@0.2.1
  - @atlaskit/spinner@10.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/button@11.0.0

## 10.0.0

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

## 9.1.10

- Updated dependencies [27cacd44ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27cacd44ab):
  - @atlaskit/portal@0.1.0

## 9.1.9

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/field-radio-group@4.0.15
  - @atlaskit/portal@0.0.18
  - @atlaskit/icon@16.0.0

## 9.1.8

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/button@10.1.1
  - @atlaskit/field-radio-group@4.0.14
  - @atlaskit/icon@15.0.2
  - @atlaskit/portal@0.0.17
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 9.1.7

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/field-radio-group@4.0.13
  - @atlaskit/icon@15.0.1
  - @atlaskit/spinner@9.0.12
  - @atlaskit/theme@7.0.0

## 9.1.6

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/field-radio-group@4.0.12
  - @atlaskit/portal@0.0.16
  - @atlaskit/icon@15.0.0

## 9.1.5

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/analytics-next@3.1.1
  - @atlaskit/field-radio-group@4.0.11
  - @atlaskit/icon@14.6.1
  - @atlaskit/portal@0.0.15
  - @atlaskit/spinner@9.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/button@10.0.0

## 9.1.4

- Updated dependencies [1fb2c2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1fb2c2a):
  - @atlaskit/portal@0.0.14

## 9.1.3

- Updated dependencies [3f5a4dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f5a4dd):
  - @atlaskit/portal@0.0.13

## 9.1.2

- [patch] Updated dependencies [aaab348](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aaab348)
  - @atlaskit/portal@0.0.12

## 9.1.1

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 9.1.0

- [minor] Now the flag actions accept href and target [65af057](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65af057)
- [patch] Updated the flag actions to accept the href and target as props [43ac1ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/43ac1ec)

## 9.0.13

- [patch] Updated the flag to use atlaskit button [d2084ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2084ad)

## 9.0.12

- [patch] Updated the flag actions use gridSize and fontSize properly [3e7da11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e7da11)

## 9.0.11

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/field-radio-group@4.0.8
  - @atlaskit/portal@0.0.10
  - @atlaskit/icon@14.0.0

## 9.0.10

- [patch] Updated dependencies [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/icon@13.8.1
  - @atlaskit/portal@0.0.9

## 9.0.9

- [patch] Updated dependencies [d9d2f0d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9d2f0d)
- [none] Updated dependencies [89be4f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89be4f1)
  - @atlaskit/portal@0.0.8
  - @atlaskit/layer-manager@5.0.11

## 9.0.8

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 9.0.6

- [patch] Updated flags to use atlaskit portal instead of Layer manger [b9e6757](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9e6757)
- [none] Updated dependencies [b9e6757](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9e6757)

## 9.0.5

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/spinner@9.0.6
  - @atlaskit/layer-manager@5.0.6
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-radio-group@4.0.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 9.0.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/field-radio-group@4.0.4
  - @atlaskit/layer-manager@5.0.5
  - @atlaskit/icon@13.2.4

## 9.0.3

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/layer-manager@5.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/field-radio-group@4.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2

## 9.0.2

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/spinner@9.0.3
  - @atlaskit/field-radio-group@4.0.2
  - @atlaskit/layer-manager@5.0.3
  - @atlaskit/icon@13.2.1

## 9.0.1

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/spinner@9.0.2
  - @atlaskit/docs@5.0.1
  - @atlaskit/field-radio-group@4.0.1

## 9.0.0

- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/icon@13.0.0

## 8.2.0

- [minor] Reduce autodismiss flag duration from 15 seconds to 8 seconds [5f6ec84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f6ec84)

## 8.1.5

- [patch] Remove or update \$FlowFixMe [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/button@8.2.4
  - @atlaskit/field-radio-group@3.1.3
  - @atlaskit/icon@12.6.1

## 8.1.4

- [patch] Button should be a dev dependency [50ca31b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ca31b)
- [none] Updated dependencies [50ca31b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ca31b)

## 8.1.3

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/button@8.2.3

## 8.1.2

- [patch] Fix \$FlowFixMe and release packages [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/button@8.2.2
  - @atlaskit/spinner@7.1.1
  - @atlaskit/field-radio-group@3.1.2
  - @atlaskit/icon@12.3.1

## 8.1.1

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/spinner@7.0.2
  - @atlaskit/field-radio-group@3.0.4
  - @atlaskit/layer-manager@4.2.1
  - @atlaskit/icon@12.1.2

## 8.1.0

- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/layer-manager@4.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/field-radio-group@3.0.2
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/button@8.1.0

## 8.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/layer-manager@4.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/field-radio-group@3.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/spinner@6.0.1
  - @atlaskit/docs@4.0.1

## 8.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/layer-manager@4.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/field-radio-group@3.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0

## 7.0.3

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/layer-manager@3.0.4
  - @atlaskit/field-radio-group@2.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/docs@3.0.4

## 7.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 6.5.3

- [patch] Export the AppearanceTypes type [d38fc10](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d38fc10)

## 6.5.2

- [patch] Makes packages Flow types compatible with version 0.67 [25daac0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25daac0)

## 6.5.1

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 6.5.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 6.4.6

- [patch] adds aria-expanded value to expander button in flag [7de4577](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7de4577)

## 6.4.5

- [patch] updates Flag to closer match ADG spec [5392b60](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5392b60)

## 6.4.4

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 6.4.2

- [patch] Remove babel-plugin-react-flow-props-to-prop-types [06c1f08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c1f08)

## 6.4.1

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 6.4.0

- [minor] Update buttonIcon size depending if CrossIcon or ChevronIcon [16bf4e5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/16bf4e5)

## 6.3.0

- [minor] Update the expand button to medium size [05d8bd5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05d8bd5)

## 6.2.2

- [patch] Migrate Navigation from Ak repo to ak mk 2 repo, Fixed flow typing inconsistencies in ak mk 2 [bdeef5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdeef5b)

## 6.2.1

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 6.2.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 6.1.9

- [patch] migrated flag to mk2 [630489e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/630489e)

## 6.1.8 (2017-11-22)

- bug fix; long messages in Flags start to wrap, not overflow content. ([b69c45f](https://bitbucket.org/atlassian/atlaskit/commits/b69c45f))

## 6.1.7 (2017-11-15)

- bug fix; fix flags within page components appearing behind navigation (issues closed: ak-1823) ([08e397e](https://bitbucket.org/atlassian/atlaskit/commits/08e397e))

## 6.1.6 (2017-11-13)

- bug fix; update flag's react-transition-group dependency from v1 to v2 (issues closed: ak-3755) ([32f3af3](https://bitbucket.org/atlassian/atlaskit/commits/32f3af3))

## 6.1.5 (2017-11-02)

- bug fix; added missing dependencies (issues closed: ak-3782) ([4dbc3ef](https://bitbucket.org/atlassian/atlaskit/commits/4dbc3ef))

## 6.1.4 (2017-10-26)

- bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 6.1.3 (2017-10-22)

- bug fix; update styled component dependency and react peerDep ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))

## 6.1.2 (2017-10-15)

- bug fix; update dependencies for react 16 compatibility ([fc47c94](https://bitbucket.org/atlassian/atlaskit/commits/fc47c94))

## 6.1.1 (2017-10-12)

- bug fix; bumps version of Page (issues closed: ak-3680) ([8713649](https://bitbucket.org/atlassian/atlaskit/commits/8713649))

## 6.1.0 (2017-08-17)

- feature; adding new AutoDismissFlag component (issues closed: ak-2974 ak-1503) ([9aa91c0](https://bitbucket.org/atlassian/atlaskit/commits/9aa91c0))

## 6.0.0 (2017-08-16)

- breaking; The Flag.id prop has been changed from optional to required. ([91f8dc4](https://bitbucket.org/atlassian/atlaskit/commits/91f8dc4))
- breaking; FlagGroup no longer illegally reads Flag.props.key ([91f8dc4](https://bitbucket.org/atlassian/atlaskit/commits/91f8dc4))

## 5.0.1 (2017-08-15)

- bug fix; flag transitions between appearances smoothly, hides expand icon if not needed (issues closed: ak-2973 ak-3155) ([0766202](https://bitbucket.org/atlassian/atlaskit/commits/0766202))

## 5.0.0 (2017-08-11)

- bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
- breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))

## 4.0.0 (2017-08-11)

- breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))

## 3.4.4 (2017-08-04)

- bug fix; moves babel-plugin-react-flow-props-to-prop-types to a devDependency ([6378b88](https://bitbucket.org/atlassian/atlaskit/commits/6378b88))

## 3.4.3 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.4.2 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.1.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 3.1.0 (2017-07-17)

- fix; replace incorrect component description in Flag storybook ([2c42255](https://bitbucket.org/atlassian/atlaskit/commits/2c42255))
- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.0.0 (2017-07-06)

- fix; add TransitionGroup to FlagGroup to handle lifecycle animations ([6dbb237](https://bitbucket.org/atlassian/atlaskit/commits/6dbb237))
- breaking; Removed shouldDismiss prop from Flag. Just set a FlagGroup's children declaratively and animation will be handled automatically with TransitionGroup (you don't need to wait until the flag has animated out before updating your state).
- ISSUES CLOSED: AK-2558

## 2.2.1 (2017-06-19)

- fix; bump Flag icon dependency to 7.x ([35bb4fa](https://bitbucket.org/atlassian/atlaskit/commits/35bb4fa))

## 2.2.0 (2017-06-05)

- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- feature; added new optional bold flags, controlled by the Flag.appearance prop ([b78dca7](https://bitbucket.org/atlassian/atlaskit/commits/b78dca7))

## 2.1.2 (2017-05-12)

- fix; flag dismiss button focus style and spacing now correct ([c0130be](https://bitbucket.org/atlassian/atlaskit/commits/c0130be))

## 2.1.1 (2017-05-11)

- fix; bump modal-dialog dep, and change to a devDep ([d16f887](https://bitbucket.org/atlassian/atlaskit/commits/d16f887))

## 2.1.0 (2017-05-06)

- feature; allow flags to be dismissed programatically via shouldDismiss prop ([445dcb4](https://bitbucket.org/atlassian/atlaskit/commits/445dcb4))

## 2.0.4 (2017-05-02)

- fix; change to dependency on util-shared-styles to correct version ([a052c60](https://bitbucket.org/atlassian/atlaskit/commits/a052c60))

## 2.0.3 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 2.0.2 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 2.0.1 (2017-04-13)

- fix; update flag stories to use new readme component ([1c56c84](https://bitbucket.org/atlassian/atlaskit/commits/1c56c84))

## 2.0.0 (2017-04-04)

- refactor the flag component to use styled-components ([615208f](https://bitbucket.org/atlassian/atlaskit/commits/615208f))
- breaking; added peerDependency "styled-components”, removed dependency “classnames”
- ISSUES CLOSED: AK-2028

## 1.0.9 (2017-03-23)

- fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.0.6 (2017-03-21)

- fix; accept JSX in description prop ([c986abf](https://bitbucket.org/atlassian/atlaskit/commits/c986abf))
- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.5 (2017-02-27)

- fix; update flag's icon dependency to latest ([e60c12a](https://bitbucket.org/atlassian/atlaskit/commits/e60c12a))

## 1.0.4 (2017-02-20)

- fix; use correctly scoped package names in npm docs ([91dbd2f](https://bitbucket.org/atlassian/atlaskit/commits/91dbd2f))

## 1.0.3 (2017-02-10)

- fix; Dummy commit to release components to registry ([5bac43b](https://bitbucket.org/atlassian/atlaskit/commits/5bac43b))
