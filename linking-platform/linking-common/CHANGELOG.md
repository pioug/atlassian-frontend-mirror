# @atlaskit/linking-common

## 2.4.0

### Minor Changes

- [`2ce1ea6f723`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ce1ea6f723) - The change here adds the new `Skeleton` component which can be used with or without a shimmering effect

## 2.3.1

### Patch Changes

- [`aeaf58d2384`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aeaf58d2384) - Change adds a new prop on Smart Card `embedIframeUrlType` which allows a user of a Smart Card with the `embed` appearance to specify whether the Smart Card embed should use `href` or `interactiveHref` in the JSON-LD response.

## 2.3.0

### Minor Changes

- [`86f9123aa19`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86f9123aa19) - Add allow response statuses option on request

## 2.2.2

### Patch Changes

- [`0af4a6b6426`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0af4a6b6426) - Dependency update json-ld-types@3.4.0

## 2.2.1

### Patch Changes

- [`a132b532d6a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a132b532d6a) - Support common URL protocols:

  - gopher
  - integrity
  - file
  - smb
  - dynamicsnav

## 2.2.0

### Minor Changes

- [`5c43e7c2924`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c43e7c2924) - - make envKey and baseUrlOverride properties public in CardClient
  - move request API and environment config and getter to linking-common

## 2.1.0

### Minor Changes

- [`7581526cc61`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7581526cc61) - Remove `disableLinkPickerPopupPositioningFix` feature flag

## 2.0.0

### Major Changes

- [`17dae33474e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17dae33474e) - Remove embedModalSize as part of embed preview modal feature flag cleanup

## 1.22.0

### Minor Changes

- [`08de765c04b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08de765c04b) - Adds user agent utilities.

## 1.21.1

### Patch Changes

- Updated dependencies

## 1.21.0

### Minor Changes

- [`00899283bb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00899283bb1) - Add enableResolveMetadataForLinkAnalytics ff

## 1.20.0

### Minor Changes

- [`42be2053e92`](https://bitbucket.org/atlassian/atlassian-frontend/commits/42be2053e92) - Add ResolveRateLimitError to ServerErrorTypes

## 1.19.0

### Minor Changes

- [`d5a9fd04c02`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d5a9fd04c02) - Analytics to track dwell time and focus on smart links embedded iframes

## 1.18.0

### Minor Changes

- [`c3528743169`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3528743169) - Introduce enableLinkPickerForgeTabs feature flag

## 1.17.0

### Minor Changes

- [`10410539ac9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/10410539ac9) - Url utils added (normalizeURL and isSafeUrl). Available to export

## 1.16.3

### Patch Changes

- [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds for this package now pass through a tokens babel plugin, removing runtime invocations of the tokens() function and improving performance.

## 1.16.2

### Patch Changes

- Updated dependencies

## 1.16.1

### Patch Changes

- Updated dependencies

## 1.16.0

### Minor Changes

- [`3cbd9b63e96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cbd9b63e96) - [ux] Added search for 1P tabs

## 1.15.0

### Minor Changes

- [`1f55d430d9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f55d430d9a) - [ux] A new flag 'showAuthTooltip' is added that indicates if an authentication tooltip should show up on a hover over unauthorized smart links.

## 1.14.0

### Minor Changes

- [`1070e536838`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1070e536838) - [ux] Hover Preview: Add experiment for actionable element

## 1.13.0

### Minor Changes

- [`9dd3377f9bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd3377f9bb) - [ux] This adds support for the new Flexible UI Block Card, added behind a feature flag "useFlexibleBlockCard"

## 1.12.2

### Patch Changes

- Updated dependencies

## 1.12.1

### Patch Changes

- [`efa366b6ed6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efa366b6ed6) - Upgrade json-ld-types from 3.1.0 to 3.2.0

## 1.12.0

### Minor Changes

- [`6533e448c53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6533e448c53) - [ux] Embed: Update unauthorised view text messages and use provider image if available

## 1.11.0

### Minor Changes

- [`c64e78c6e45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c64e78c6e45) - Updates LinkingPlatformFeatureFlags type with disableLinkPickerPopupPositioningFix ff

## 1.10.1

### Patch Changes

- [`5066a68a6f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5066a68a6f5) - [ux] fix promiseDebounce to ensure usage of the latest debounced value

## 1.10.0

### Minor Changes

- [`99035cb130b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99035cb130b) - introduce useLinkPickerScrollingTabs feature flag

## 1.9.2

### Patch Changes

- [`6af519d2a17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6af519d2a17) - Upgrade json-ld-types from 3.0.2 to 3.1.0

## 1.9.1

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 1.9.0

### Minor Changes

- [`86c47a3f711`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86c47a3f711) - Added search ratelimit error

## 1.8.0

### Minor Changes

- [`61acd5bc2d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61acd5bc2d0) - Added more search errors

## 1.7.0

### Minor Changes

- [`826112611c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/826112611c2) - Update embed preview feature flag type to generic string

## 1.6.0

### Minor Changes

- [`d2439a3c65d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2439a3c65d) - [ux] Embed Preview Modal: Add experiment modal with new UX and resize functionality (behind feature flag)

## 1.5.2

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 1.5.1

### Patch Changes

- [`9b79278f983`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b79278f983) - Fix promise debounce to support rejects

## 1.5.0

### Minor Changes

- [`3b5e61f9b3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b5e61f9b3b) - [ux] Adds in TAB UI support for Link Picker

## 1.4.0

### Minor Changes

- [`e15410365b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e15410365b2) - - export types/functions in linking common to be used in smart card

  - add flag to card action to override re-using previous 'resolved' state

  - add prop to cardState which reflects the metadata state, can be pending, resolved or errored

  - modified reducer and dispatchers to handle these new props

## 1.3.0

### Minor Changes

- [`0fa3ac70ed0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0fa3ac70ed0) - Restores backwards compatibility that was broken in 1.2.x

## 1.2.1

### Patch Changes

- [`5db7cbdb520`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5db7cbdb520) - XPC3P-23 Add types for search dialog

## 1.2.0

### Minor Changes

- [`cd5e63258cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd5e63258cd) - Moved extractors to linking-common/extractors

## 1.1.3

### Patch Changes

- [`b2032a5f6e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2032a5f6e3) - Add FF support to <LinkProvider />

  ```
  import { SmartCardProvider, useFeatureFlag } from '@atlaskit/link-provider';

  const MyComponent = () => {
    const showHoverPreview = useFeatureFlag('showHoverPreview')

    return (
      <>
        {showHoverPreview}
      </>
    )
  }

  <SmartCardProvider featureFlags={{showHoverPreview: true}}>
    <MyComponent />
  </SmartCardProvider>
  ```

## 1.1.2

### Patch Changes

- [`f538640e3a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f538640e3a5) - fix: Previously the .reload() action would not propagate changes through to the smart-card state in some scenarios. This has been amended by making it an explicit Redux action.

## 1.1.1

### Patch Changes

- [`50b81e07a35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50b81e07a35) - Version of package 'json-ld-types' was upgraded to 2.4.2

## 1.1.0

### Minor Changes

- [`f69424339b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f69424339b2) - Expose common types and helpers from linking-common rather than from link-picker

## 1.0.2

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 1.0.1

### Patch Changes

- [`84d7a6b11a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/84d7a6b11a4) - Create @atlaskit/linking-common
