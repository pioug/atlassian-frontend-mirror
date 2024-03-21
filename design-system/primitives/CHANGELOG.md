# @atlaskit/primitives

## 5.1.2

### Patch Changes

- [#80174](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80174) [`2a4fd6ccba31`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2a4fd6ccba31) - Add forwardRef to text component

## 5.1.1

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116) [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) - Upgrade Typescript from `4.9.5` to `5.4.2`
- Updated dependencies

## 5.1.0

### Minor Changes

- [#78900](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78900) [`6ea786dd8082`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6ea786dd8082) - Add UNSAFE_small fontsize token.

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- Updated dependencies

## 5.0.0

### Major Changes

- [#81744](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81744) [`30e3d8c81030`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30e3d8c81030) - Replaced `Text`'s `variant` prop with a `size` prop. The `size` prop takes three values: `"small"`, `"medium"` (default), and `"large"`.

  Migration guide:

  - `variant="body.small"` -> `size="small"`
  - `variant="body"` -> `size="medium"` (Note: Since medium is the default, the size prop can be omitted here)
  - `variant="body.large"` -> `size="large"`

## 4.1.1

### Patch Changes

- [#81644](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/81644) [`8ab7a816dca7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8ab7a816dca7) - Revert input border change from the previous version

## 4.1.0

### Minor Changes

- [#80528](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80528) [`8877e9b57d55`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8877e9b57d55) - Added `size` prop which will replace `variant` prop in the next major version.

## 4.0.2

### Patch Changes

- [#80805](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80805) [`427c2dd9e0d6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/427c2dd9e0d6) - Update input border color token and width to meet 3:1 color contrast
- Updated dependencies

## 4.0.1

### Patch Changes

- [#79770](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/79770) [`542e29efe0ad`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/542e29efe0ad) - Update imports from @atlaskit/tokens
- Updated dependencies

## 4.0.0

### Major Changes

- [#77148](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77148) [`473df43e816b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/473df43e816b) - Removed `ui` variant from Text component. The `body` variant should be used for all non-heading typography.

### Patch Changes

- Updated dependencies

## 3.2.0

### Minor Changes

- [#77488](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77488) [`9e119dcbfd60`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9e119dcbfd60) - The `xcss` prop on select components have had its type expanded to support styles being passed from Compiled CSS-in-JS. This is still experimental and something we'll be iterating on.

## 3.1.0

### Minor Changes

- [#76431](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76431) [`c6819de73d02`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6819de73d02) - Default text color + allow color inheritance if explicitly defined

## 3.0.0

### Major Changes

- [#58240](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58240) [`a45d2049a22c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a45d2049a22c) - The "Link" primitive has been renamed to "Anchor" to avoid confusion with the upcoming "Link" component. Since Link is still in Alpha this should not cause any upgrade friction.

### Minor Changes

- [#58240](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58240) [`75b2ade8b254`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/75b2ade8b254) - Both the Pressable and Anchor primitives now support analytics tracking by default.
- [#58240](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58240) [`39f3c929f0c4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/39f3c929f0c4) - Add Pressable and Anchor primitives (in Alpha) to root export as `UNSAFE_PRESSABLE` and `UNSAFE_LINK`.

### Patch Changes

- [#58240](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58240) [`4951390bc0ae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4951390bc0ae) - [ux] Adds a default underline style to the Anchor primitive (Alpha)

## 2.1.0

### Minor Changes

- [#74930](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74930) [`707a8fee2aee`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/707a8fee2aee) - Both the Pressable and Anchor primitives (in Alpha) now support analytics tracking in the same fashion as `@atlaskit/button`. An additional prop `componentName` allows analytics to be configured if a parent component name is desired to be tracked rather than the primitive names. For the time being this tracking is opt-in via use of the `componentName` prop. This will be made default behavior in an upcoming release once tracking is removed in the new Buttons, and `@atlaskit/button` is bumped to use the latest version of `@atlaskit/primitives`
- [#75221](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75221) [`c15d58bff276`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c15d58bff276) - `Text` inherits color by default if `color` prop is not provided.
  Removed auto-collapsing behaviour of `Text`

## 2.0.3

### Patch Changes

- [#74836](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74836) [`3963062ac997`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3963062ac997) - Codegen to add in new font family tokens. Not exposed in any components.
- Updated dependencies

## 2.0.2

### Patch Changes

- [#72557](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72557) [`0c78c9c18cb7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c78c9c18cb7) - Fix font family not preferencing apple system fonts on macOS

## 2.0.1

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [#68009](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68009) [`1168354ed6ef`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1168354ed6ef) - We now ensure the specificity of our `xcss`-based overrides are consistent across all primitives so `xcss` will always override props.

  This resulted in a breaking change wtih Grid. For example, `<Grid templateAreas="…" xcss({ gridTemplateAreas: "…" })>` will result in different styles resolution before and after this version. This applies to `templateAreas`, `templateColumns`, and `templateRows`). From static analysis, we found only one known usage of this and it has been resolved.

## 1.20.0

### Minor Changes

- [#68163](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68163) [`67d09e3f972d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/67d09e3f972d) - `weight` property added to `Text` to allow overriding text variant default font weight.
- [#69343](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/69343) [`77249f536425`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77249f536425) - `Text` color prop defaults to `color.text` if not provided.

### Patch Changes

- Updated dependencies

## 1.19.0

### Minor Changes

- [#66702](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66702) [`5b6bbaf2d5fc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5b6bbaf2d5fc) - Added `maxLines` prop to `Text` component, allowing truncation at a certain number of lines. This prop replaces `shouldTruncate` prop.

### Patch Changes

- [#67698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67698) [`175c07b58c52`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/175c07b58c52) - Export tokensMap object

## 1.18.0

### Minor Changes

- [#67463](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67463) [`adf1c3ebf0fd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/adf1c3ebf0fd) - Fixed an issue with `Text` where text could render incorrectly if a typography token theme was not present on a page.

### Patch Changes

- Updated dependencies

## 1.17.0

### Minor Changes

- [#65770](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65770) [`1e2db2714522`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1e2db2714522) - The `shouldTruncate` prop on `Text` is now only available for `body` variants and cannot be used with `ui` variants.

## 1.16.0

### Minor Changes

- [#63526](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63526) [`e8835feffae9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e8835feffae9) - Internal change to improve token sorting logic for typography tokens. Typography tokens are now marked as active though they are still in development and not recommend for use without prior approval from ADS.

### Patch Changes

- Updated dependencies

## 1.15.2

### Patch Changes

- [#61090](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61090) [`2e34d3535125`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2e34d3535125) - - Fixed issue where using negative space tokens in `xcss` wouldn't apply.
  - Allow negative space tokens for position properties in `xcss` (i.e. top, bottom, left, right, and inset-\*).

## 1.15.1

### Patch Changes

- [#57241](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57241) [`cae2e80ae968`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cae2e80ae968) - Migrate webdriver tests for @atlassian/product-search-dialog

## 1.15.0

### Minor Changes

- [#60570](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60570) [`d74bd13bec9c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d74bd13bec9c) - Restrict usage of data-testid to primitives (`testId` should be used instead). This prop is currently silently ignored so this is just to follow the principle of least surprise when using primitives.

### Patch Changes

- Updated dependencies

## 1.14.0

### Minor Changes

- [#58048](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58048) [`cc9e9495e995`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cc9e9495e995) - Export `media.only` and `media.below` for Compiled CSS-in-JS support.

## 1.13.1

### Patch Changes

- [#58444](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58444) [`c0499565188d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c0499565188d) - Update package.json documentation metadata.

## 1.13.0

### Minor Changes

- [#57795](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57795) [`d2c06815d043`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d2c06815d043) - - Inline: Allow `role` prop to be passed through. `role` already existed in the type, but was not actually applied to the component.
  - Stack: Allow `role` prop to be passed through. `role` already existed in the type, but was not actually applied to the component.
  - Flex: Allow `role` prop to be passed through. `role` already existed in the type, but was not actually applied to the component.
  - Text: Omit `xcss` from prop types. `<Text xcss={yourStyles}></Text>` will now throw a type error. `xcss` was previously non-functional in `Text`. So, this should not cause any behavior change.
  - xcss: Export XCSS type from main entry point. It is now possible to `import { xcss, type XCSS } from '@atlaskit/primitives'`.

## 1.12.0

### Minor Changes

- [#43616](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43616) [`6a89d1fcf6b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a89d1fcf6b) - Add missing tokenised XCSS properties for borderBlockColor, borderBlockWidth, borderInlineColor, borderInlineWidth

## 1.11.1

### Patch Changes

- [#43455](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43455) [`16586bd07a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/16586bd07a0) - Updated `font.body.small` line height to 16px (1rem).

## 1.11.0

### Minor Changes

- [#43366](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43366) [`f1d3719ea48`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f1d3719ea48) - Tokenised values are now accepted in all border-radius, border-width, border-color, and opacity CSS properties in XCSS.

## 1.10.1

### Patch Changes

- [#43018](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43018) [`3cb6a290654`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cb6a290654) - Text component now has `margin: 0` to ensure no margins are inherited (for example from the CSS reset).

## 1.10.0

### Minor Changes

- [#42931](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42931) [`5778f757885`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5778f757885) - Added export for Text component. This component is currently in closed beta and is not intended for general use at this stage.

## 1.9.0

### Minor Changes

- [#42494](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42494) [`8cc2926465e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2926465e) - Removed the ability to use the `style` prop on primitives such as Inline, Stack, and Flex. This prop previously had no effect on these components and is now only allowed on Box.

## 1.8.0

### Minor Changes

- [#42305](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42305) [`4c9d4a7be34`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c9d4a7be34) - - Link primitive will now throw an error if a router link configuration object is passed to the `href` prop when there is not a router link component set in the AppProvider

### Patch Changes

- [#42305](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42305) [`4c9d4a7be34`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c9d4a7be34) - - Fixes a bug where Link primitive was not passing through router link configuration objects
- Updated dependencies

## 1.7.0

### Minor Changes

- [#42130](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42130) [`a64dc3026de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a64dc3026de) - Create the new Link primitive (Unsafe to use, still in Alpha)

## 1.6.8

### Patch Changes

- [#42012](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42012) [`0a52fc9129e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a52fc9129e) - Internal change to the `media` export to ensure compatibility with [Compiled](https://github.com/atlassian-labs/compiled). No change to public API.

## 1.6.7

### Patch Changes

- [#41516](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41516) [`350e4081d89`](https://bitbucket.org/atlassian/atlassian-frontend/commits/350e4081d89) - [ux] Regenerates codegen artifacts as a result of changes to color palettes and token values
- Updated dependencies

## 1.6.6

### Patch Changes

- [#41440](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41440) [`5c01cb4e16d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c01cb4e16d) - Add surface color context to Box. Refine Text API.

## 1.6.5

### Patch Changes

- [#41563](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41563) [`50de1ccacd7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50de1ccacd7) - Additional documentation details for alignment props on Inline and Stack.

## 1.6.4

### Patch Changes

- [#40324](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40324) [`8d123310957`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d123310957) - Minor internal changes. There is no expected behaviour change

## 1.6.3

### Patch Changes

- [#40299](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40299) [`b1882fdd842`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1882fdd842) - Change typography token naming to be more verbose.

## 1.6.2

### Patch Changes

- [#40254](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40254) [`c296560ae7e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c296560ae7e) - Removes unused experimental component.

## 1.6.1

### Patch Changes

- [#40041](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40041) [`83cd2ae7c5a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83cd2ae7c5a) - Regenerates codegen artifacts as a result of introducting new visited link token.
- Updated dependencies

## 1.6.0

### Minor Changes

- [#40104](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40104) [`9cd356f858a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9cd356f858a) - Negative space tokens can now be applied to margin properties via `xcss`.

## 1.5.0

### Minor Changes

- [#39556](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39556) [`fa6c592fdb2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6c592fdb2) - Introduce `Heading` into package in immediate alpha state. This is more or less a port of `@atlaskit/heading`. Component is not yet stable and implementation is likely to change.
- [#39412](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39412) [`c2e55a9b782`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2e55a9b782) - Adds surface detection support to the Box primitive:

  - Enable a `Box` background colour to be set to the `utility.elevation.surface.current` token.
  - Internally set the current surface CSS variable value when the background color of a Box is set to a surface token (e.g. `elevation.surface.raised`).

## 1.4.4

### Patch Changes

- [#39431](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39431) [`4e58672502e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e58672502e) - Create text component.

## 1.4.3

### Patch Changes

- [#39787](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39787) [`6900f89eb0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6900f89eb0e) - Internal changes to use space tokens. There is no expected visual or behaviour change.

## 1.4.2

### Patch Changes

- [#39808](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39808) [`89ce462b216`](https://bitbucket.org/atlassian/atlassian-frontend/commits/89ce462b216) - Fix for margin properties not being mapped to values correctly.

## 1.4.1

### Patch Changes

- [#39578](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39578) [`da792e55f6f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da792e55f6f) - - Bleed now uses negative space tokens under the hood.
  - Fixed an issue where the wrong token would apply for space.025 in Bleed's `block` prop.
  - Fallback values for Bleed `block` and `inline` props now use rem instead of px - this is only applied if space tokens are not available on the page. Space tokens already use rem under the hood.
- Updated dependencies

## 1.4.0

### Minor Changes

- [#39471](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39471) [`9ac38d5c3e9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9ac38d5c3e9) - All margin and padding properties now support autocomplete and token values in xcss.

## 1.3.1

### Patch Changes

- [#39430](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39430) [`88e4ac397ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88e4ac397ea) - Regenerates codegen artifacts as a result of introducting new accent interaction tokens.
- Updated dependencies

## 1.3.0

### Minor Changes

- [#39264](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39264) [`abfe7585461`](https://bitbucket.org/atlassian/atlassian-frontend/commits/abfe7585461) - Improved type safety for Box.

## 1.2.3

### Patch Changes

- [#38772](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38772) [`dfd014c15b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfd014c15b3) - [ux] Pressable primitive: Adds missing cursor style `not-allowed` for disabled buttons

## 1.2.2

### Patch Changes

- [#39350](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39350) [`9a3fd8455fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a3fd8455fb) - Stack `alignBlock` prop now accepts `'stretch'` which is also the default value for the `alignBlock` prop.

## 1.2.1

### Patch Changes

- [#38530](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38530) [`9a88d718e48`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a88d718e48) - This package is now onboarded onto the product push model.

## 1.2.0

### Minor Changes

- [#38293](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38293) [`37e0d67942b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37e0d67942b) - - Add missing `xcss` type export for `TextColor`
  - Fixes a bug where the `xcss` function did not accept `color.link` or `color.link.pressed` token values for text color

## 1.1.0

### Minor Changes

- [#37917](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37917) [`0116391a81e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0116391a81e) - - Support `xcss` in `Pressable`
  - Remove dependency on `@atlaskit/focus-ring`

## 1.0.11

### Patch Changes

- [#38239](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38239) [`30fb9fe0ff4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30fb9fe0ff4) - Mark Pressable exports as unsafe (for internal use only)

## 1.0.10

### Patch Changes

- [#38000](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38000) [`ac645224013`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac645224013) - Removes generic for `xcss` fn. Adds support for other `AtTypes`.

## 1.0.9

### Patch Changes

- [#37947](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37947) [`1859bc0b8c7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1859bc0b8c7) - Update the casing on `xcss` to ensure consistency with the API and package consumption.

## 1.0.8

### Patch Changes

- [#37805](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37805) [`8986cf1ed16`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8986cf1ed16) - Reverts a change that allowed className to be applied to Box.

## 1.0.7

### Patch Changes

- [#37419](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37419) [`6070ef412be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6070ef412be) - Box now accepts any HTML element for its `as` prop. Fixed issue where types may be incorrect depending on element used for the `as` prop.

## 1.0.6

### Patch Changes

- [#37400](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37400) [`aa8ec75ace3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa8ec75ace3) - Simplify types for `Show` and `Hide` components. There should be no difference in behavior.

## 1.0.5

### Patch Changes

- [#37278](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37278) [`3fadbb8bf73`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fadbb8bf73) - Internal changes.

## 1.0.4

### Patch Changes

- [#37182](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37182) [`74f7af9882b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/74f7af9882b) - [ux] correct fallback color of token color.border.focused to meet contrast requirement

## 1.0.3

### Patch Changes

- [#36967](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36967) [`298df94426c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/298df94426c) - Regenerates codegen'd artifacts as a result of introducting new brand background design tokens.
- Updated dependencies

## 1.0.2

### Patch Changes

- [#36605](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36605) [`45ff2cd234f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45ff2cd234f) - Fixes missing type in `Flex` component, adds `Grid` component.

## 1.0.1

### Patch Changes

- [#36261](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36261) [`cac98ccfb7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cac98ccfb7d) - Introduces Flex component as common component for Stack, Inline.

## 1.0.0

### Major Changes

- [#36313](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36313) [`fec62731e2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fec62731e2e) - This package is now in open beta and is no longer considered experimental. We will be making iterative improvements until GA. While the API is likely to be stable, we reserve the right to make changes if required. This version contains no changes whatsoever.

  P.S. The reason for the change is to aid package deduplication in the product.

## 0.16.0

### Minor Changes

- [#34769](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34769) [`fe3ef707163`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe3ef707163) - Initial Pressable primitive (not ready for production)

## 0.15.3

### Patch Changes

- [#36279](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36279) [`27f6081edf2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27f6081edf2) - Regenerates codegen hashes to surface changes to tokens

## 0.15.2

### Patch Changes

- [#36230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36230) [`ab4938b0c32`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab4938b0c32) - Remove runtime dev warning for invalid token aliases.

## 0.15.1

### Patch Changes

- [#36218](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36218) [`7c1c449eb96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c1c449eb96) - Updated space token descriptions.

## 0.15.0

### Minor Changes

- [#36050](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36050) [`8b04f3e78bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b04f3e78bd) - Adds basic `<Show>` and `<Hide>` responsive primitive components to make consistent, composable UIs without writing a dozen lines for just one `display: none` css rule.

  Additionally:

  - Adds some further examples, tests, and VRs.
  - Tweaks some internals around building these reusable media query maps.

## 0.14.3

### Patch Changes

- [#36141](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36141) [`4c026f170d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c026f170d6) - Remove warnings for non-token values passed to xcss in non-development environments.

## 0.14.2

### Patch Changes

- [#36072](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36072) [`267a88221e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/267a88221e8) - Internal change to update codegen.

## 0.14.1

### Patch Changes

- [#35133](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35133) [`d79b6172a93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d79b6172a93) - Add documentation for responsive xcss.

## 0.14.0

### Minor Changes

- [#35712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35712) [`5af07899f5b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5af07899f5b) - Loosens types to better reflect `xcss` API.

## 0.13.0

### Minor Changes

- [#35149](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35149) [`455677dbd4c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/455677dbd4c) - - Documents the responsive media helpers into an Alpha state.
  - BREAKING: Removes the `xxl` breakpoint from all media queries (should be unused).
  - Adds a new `media` export without `media.below` intentionally omitted. Should be unused externally, but used internally and still available via the existing `UNSAFE_media` export.
  - Changes the underlying media queries to be a bit safer against unexpected overlap. This changes the breakpoints ever-so-slightly, but given browsers round fractional rems, it's impractical that this will have any unintended impact—if anything, it may fix a bug.

## 0.12.6

### Patch Changes

- [#35592](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35592) [`3be327cdd6a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3be327cdd6a) - Allow styles to be applied to Inline through xcss.

## 0.12.5

### Patch Changes

- [#35526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35526) [`55be182b904`](https://bitbucket.org/atlassian/atlassian-frontend/commits/55be182b904) - Regenerates codegen'd artifacts as a result of introducting new design tokens.
- Updated dependencies

## 0.12.4

### Patch Changes

- [#35270](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35270) [`b2706220d22`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2706220d22) - Adds an experimental `UNSAFE_useMediaQuery` hook to utilize our media query breakpoints in JavaScript. This is not SSR-safe and will return `null` or perhaps incorrectly depending on your SSR environment.

## 0.12.3

### Patch Changes

- [#35385](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35385) [`79e94411a9c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79e94411a9c) - Bump to account for regeneration of tokens artifacts.
- Updated dependencies

## 0.12.2

### Patch Changes

- [#33287](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33287) [`e278a3b0ea9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e278a3b0ea9) - Allow loose auto completion and less strict types for some xcss properties.

## 0.12.1

### Patch Changes

- [#35248](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35248) [`3f273cdd54f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f273cdd54f) - Allow for an Inline list item.

## 0.12.0

### Minor Changes

- [#35158](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35158) [`407853b7b26`](https://bitbucket.org/atlassian/atlassian-frontend/commits/407853b7b26) - Inline now has a new default value for the `alignBlock` prop: `start` - the previous default, `stretch`, is now an option that can be set explicitly as well.

## 0.11.0

### Minor Changes

- [#33833](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33833) [`8bd6dc6027f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8bd6dc6027f) - Box backgroundColor prop now accepts full token names, abbreviated forms will no longer work. xcss now accepts full token names, abbreviated forms will no longer work.

## 0.10.1

### Patch Changes

- [#34922](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34922) [`b6302963111`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6302963111) - Change border.radius.normal to be 3px instead of 4px.
  `display: grid` is now accepted for `xcss`.

## 0.10.0

### Minor Changes

- [#34913](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34913) [`313d71fce9c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/313d71fce9c) - Allow media queries at predefined breakpoints to be applied through xcss.

## 0.9.5

### Patch Changes

- [#34443](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34443) [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies

## 0.9.4

### Patch Changes

- [#34217](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34217) [`b19d5c53b64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b19d5c53b64) - Internal changest to the primitives package related to token generated styles.
- [`4c4dcc3d571`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c4dcc3d571) - Updates primitives internal style map.
- Updated dependencies

## 0.9.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8
- [#33693](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33693) [`e06d56c5a3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e06d56c5a3d) - Adds type hinting for `fill` CSS property.

## 0.9.2

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 0.9.1

### Patch Changes

- [#33120](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33120) [`5a9e73494eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a9e73494eb) - Updates to internal documentation.

## 0.9.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 0.8.9

### Patch Changes

- [#33127](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33127) [`da1727baf77`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da1727baf77) - Allow non tokenised values to be passed through for tokenisable properties like `padding`. Adds type hinting for zIndex CSS property.

## 0.8.8

### Patch Changes

- [#33092](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33092) [`5a134a5128a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a134a5128a) - Adds type hinting for boxShadow CSS property. Fixes bug with token to CSS custom property transformation for gap, rowGap, columnGap.

## 0.8.7

### Patch Changes

- [#32798](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32798) [`bad2da77917`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bad2da77917) - The Box primitive now accepts more elements for the 'as' prop

## 0.8.6

### Patch Changes

- [#33022](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33022) [`b5b26f3d947`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5b26f3d947) - Bugfix: 'padding' prop no longer takes (incorrect) precedence over any other padding props.

## 0.8.5

### Patch Changes

- [#32786](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32786) [`0969a35c1b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0969a35c1b0) - Allow type hinting for nested styles inside pseudo-selectors.

## 0.8.4

### Patch Changes

- [#32594](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32594) [`7127e85932a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7127e85932a) - Update codegen to explicitly list spacing prop values as string unions for compatibility with extract-react-types.

## 0.8.3

### Patch Changes

- [#32600](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32600) [`64e7c72773e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/64e7c72773e) - Update type to allow typehints for CSS color property.

## 0.8.2

### Patch Changes

- [#32543](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32543) [`983b1e61003`](https://bitbucket.org/atlassian/atlassian-frontend/commits/983b1e61003) - Fix Primitives pages being shown in prod despite being marked as alpha.

## 0.8.1

### Patch Changes

- [#32424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32424) [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils

## 0.8.0

### Minor Changes

- [#32281](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32281) [`ac4c8695d3f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac4c8695d3f) - Constrain CSS values of flex-direction to account for accessibility considerations.
- [#32296](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32296) [`4d19bdd2218`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d19bdd2218) - **Inline**:

  - `space` prop now accepts values in the form `space.XXX`. For example: `space="space.100"`.
  - `rowSpace` prop now accepts values in the form `space.XXX`. For example: `rowSpace="space.100"`.

  **Stack**:

  - `space` prop now accepts values in the form `space.XXX`. For example: `space="space.100"`.

## 0.7.1

### Patch Changes

- [#32311](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32311) [`a02eed2974e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a02eed2974e) - Move codegen into @atlassian scope to publish it to private registry

## 0.7.0

### Minor Changes

- [#31841](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31841) [`7e17a8b8934`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e17a8b8934) - Box:

  - Add xcss prop to enable token powered styling.

## 0.6.0

### Minor Changes

- [#31885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31885) [`4d60ec345a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d60ec345a5) - Remove internal/exploratory responsive props available in BaseBox.

## 0.5.0

### Minor Changes

- [#31818](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31818) [`e379d04c74a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e379d04c74a) - Expose a new form of `xcss` that is parameterised so it can be statically bound to the intended usage context.

## 0.4.2

### Patch Changes

- [#31711](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31711) [`fa26963628c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa26963628c) - Removes `customStyles` in favour of `xcss`.

## 0.4.1

### Patch Changes

- [#31691](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31691) [`8e03331eb8b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e03331eb8b) - Introduce 'as' prop to Inline and Stack so the resulting element can be controlled.

## 0.4.0

### Minor Changes

- [#31378](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31378) [`003c381e37d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/003c381e37d) - Apply `width: 100%` to Inline and Stack when `grow` prop is set to `fill`.

## 0.3.3

### Patch Changes

- [#31206](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31206) [`261420360ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/261420360ec) - Upgrades component types to support React 18.

## 0.3.2

### Patch Changes

- [#31242](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31242) [`e7b64da97a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7b64da97a1) - Add `rowSpace` prop to override the `space` prop's spacing between rows.

## 0.3.1

### Patch Changes

- [#31127](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31127) [`114d6a73f72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/114d6a73f72) - Cleanup the experimental responsive box utilizing our responsive helpers.

## 0.3.0

### Minor Changes

- [#30894](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30894) [`7c280fead96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c280fead96) - Add new responsive helpers, breakpoints config, and types into `@atlaskit/primitives/responsive`. Exports are treated as `UNSAFE_` and experimental until modified as they're being worked on in parallel to our Alpha Grid.

## 0.2.2

### Patch Changes

- [#30708](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30708) [`bf90d854748`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf90d854748) - Internal representation of Box primitive now supports some responsive styles

## 0.2.1

### Patch Changes

- [#30440](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30440) [`5b886634089`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b886634089) - [ux] Change Box to be the default export from `@atlaskit/primitives/box`. Fix the negative value of `margin-inline` in Inline `separator` not being applied properly.

## 0.2.0

### Minor Changes

- [#29774](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29774) [`228cce759e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/228cce759e8) - Create Box component.

## 0.1.1

### Patch Changes

- [#30055](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30055) [`fe50d8cb56c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe50d8cb56c) - Internal change to add shape tokens to primitives.
- Updated dependencies

## 0.1.0

### Minor Changes

- [#29608](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29608) [`eeb8baa5d74`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eeb8baa5d74) - - Create `Stack` component
  - Create `Inline` component

## 0.0.2

### Patch Changes

- [#29387](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29387) [`069494fbea6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/069494fbea6) - Internal change. There is no behaviour or visual change.
- Updated dependencies

## 0.0.1

### Patch Changes

- [#29450](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29450) [`87074bc6cb3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87074bc6cb3) - Initial release of package scaffold.
