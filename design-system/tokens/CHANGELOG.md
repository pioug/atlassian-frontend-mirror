# @atlaskit/tokens

## 0.11.0

### Minor Changes

- [`65222c75362`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65222c75362) - - Adds experimental typography tokens for font size, font weight, font family, and line height. These are not intended for public consumption yet.
  - Adds a new init entry point for easily importing all theme CSS files (currently light, dark, spacing, and typography).
  - Spacing and typography tokens are now added to the `:root` rather than requiring a `data-theme` attribute.
  - Removes 'spacing' from the default theme.

## 0.10.35

### Patch Changes

- [`44c1c98c87a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/44c1c98c87a) - Export CSSTokenMap

## 0.10.34

### Patch Changes

- [`10f2fea8f3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/10f2fea8f3d) - Updated JSDoc descriptions for token() and setGlobalTheme()

## 0.10.33

### Patch Changes

- [`7a7d1aedac0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a7d1aedac0) - Change pixels to rems for spacing tokens.

## 0.10.32

### Patch Changes

- [`c8bd8ee1920`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8bd8ee1920) - Adds new shadow tokens, elevation.shadow.overflow.spread and elevation.shadow.overflow.perimeter, that can be applied in combination to replicate the overflow shadow when elevation.shadow.overflow is not technically feasible to implement.

## 0.10.31

### Patch Changes

- [`e35fc41dc33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e35fc41dc33) - Internal change to use updated primtive spacing prop values. No expected behaviour change.
- [`92ee7c98d1a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/92ee7c98d1a) - Fixes a number of neutral palette colors which were being generated without their alphas in the legacy palette.
- [`7e491389968`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e491389968) - Adds experimental spacing tokens, currently for internal use only. These are not ready for widespread consumption yet and a lint rule will raise issues if you try to use them.

## 0.10.30

### Patch Changes

- [`d9173fbdc13`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9173fbdc13) - Added some more experimental spacing tokens for internal testing and validation. These are not intended for public consumption yet.

## 0.10.29

### Patch Changes

- [`41dad8915d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41dad8915d7) - **✨ Color modes**

  Color modes are now attached to the DOM with the data-theme attr:

  ```html
  <html data-theme="dark" data-color-mode="auto"></html>
  ```

  **✨ Multi-theme**

  We now allow multiple active themes:

  ```html
  <html data-theme="dark spacing"></html>
  ```

  **✨ System preferences**

  We also output `@media (prefers-color-scheme: dark)` media selectors for color themes

  ```css
  @media (prefers-color-scheme: dark) {
    html[data-color-mode='auto'] {
      ...;
    }
  }
  ```

  This allows Product themes to be toggled by the OS-level setting.

  **✨ Setting theme state**

  `setGlobalTheme` now allows you to set auto color scheme via an additional boolean arg

  ```js
  setGlobalTheme(themeState, true); // data-color-mode="auto"
  ```

  ✨ Source of truth for themes

  All theme configuration now exists in a single object as a source of truth

  ```ts
  const themeConfig: Record<Themes, ThemeConfig> = {
    'atlassian-light': {
      id: 'light',
      displayName: 'Light Theme',
      palette: 'defaultPalette',
      attributes: {
        type: 'color',
        mode: 'light',
      },
    },
    ...
  };
  ```

## 0.10.28

### Patch Changes

- [`52ee11d5b3c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/52ee11d5b3c) - Adds an additional entrypoint for the `@atlaskit/tokens` package to support tooling.

## 0.10.27

### Patch Changes

- [`56b107f0989`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56b107f0989) - Adds experimental spacing tokens, currently for internal use only. These are not ready for widespread consumption yet and a lint rule will raise issues if you try to use them.

## 0.10.26

### Patch Changes

- [`92faa09c2d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/92faa09c2d4) - Rename base tokens to pascal case

## 0.10.25

### Patch Changes

- [`2e2ac6d3091`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e2ac6d3091) - Add new entrypoint `@atlaskit/tokens/tokens-raw` which provides access to raw token data. This enables the Atlassian Design Tokens Figma plugin to import required token information:wq

## 0.10.24

### Patch Changes

- [`619d2c2eaed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/619d2c2eaed) - Fixed typo in `elevation.surface.overlay` description

## 0.10.23

### Patch Changes

- [`264f928f021`](https://bitbucket.org/atlassian/atlassian-frontend/commits/264f928f021) - Fix ignored entrypoint to allow correct access to babel-plugin

## 0.10.22

### Patch Changes

- [`8e324bc208f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e324bc208f) - Source files for tokens chrome extension has been moved out and into its own pacakge

## 0.10.21

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 0.10.20

### Patch Changes

- [`9f6aa1d7cdc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f6aa1d7cdc) - Introduces new interaction states to a number of existing elevation tokens:

  - elevation.surface.hovered
  - elevation.surface.pressed
  - elevation.surface.raised.hovered
  - elevation.surface.raised.pressed
  - elevation.surface.overlay.hovered
  - elevation.surface.overlay.pressed

## 0.10.19

### Patch Changes

- [`efe09ca1159`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efe09ca1159) - Adds new opacity tokens, opacity.disabled and opacity.loading, that can be applied to elements to indicate loading and disabled states.

## 0.10.18

### Patch Changes

- [`7101fb6a895`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7101fb6a895) - Updates `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

## 0.10.17

### Patch Changes

- [`e6dc2779c94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6dc2779c94) - Adds support for two new themes "Atlassian-legacy-light" & "Atlassian-legacy-dark". These are compatibility themes, utilising colors from the legacy color palette.

## 0.10.16

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 0.10.15

### Patch Changes

- [`50299267c2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50299267c2e) - Refactors style-dictionary to support multiple palettes.

  - Adds legacy-palette containing colours from `@atlaskit/theme`.
  - Palettes are processed as their own 'themes' (functionally) and now have their own configuration via style-dictionary.
  - formatters + transformers were renamed and moved to match best practices
  - Types were updated to allow multi-palette values (base tokens)

## 0.10.14

### Patch Changes

- [`e3377246ebc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3377246ebc) - Moves the following `deprecated` tokens to the `sunset` phase. Please ensure that all `sunset` tokens are removed from your application, they will be completely removed in the next major version:

  - 'color.interaction.inverse.hovered' => 'color.background.inverse.subtle.hovered'
  - 'color.interaction.inverse.pressed' => 'color.background.inverse.subtle.pressed'

  If you have configured the design token eslint rules, running `eslint --fix` will resolve these changes automatically.

## 0.10.13

### Patch Changes

- [`39a56a3c4e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39a56a3c4e7) - Update disabled tokens to use alpha base tokens:

  - `color.text.disabled`
  - `color.icon.disabled`
  - `color.background.disabled`

## 0.10.12

### Patch Changes

- [`83c253f28bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83c253f28bd) - [ux] - Correct 'color.interaction.hovered' and 'color.interaction.pressed' token values, which were mistakenly mapped inversely in light and dark mode. The token values have now been swapped.

  - Deprecate 'color.interaction.inverse.hovered' which has been replaced with 'color.background.inverse.subtle.hovered'.
  - Deprecate 'color.interaction.inverse.pressed' which has been replaced with 'color.background.inverse.subtle.pressed'.

## 0.10.11

### Patch Changes

- [`d9d18df130f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9d18df130f) - [ux] Tweaked the values of the DN500 and DN500A base tokens to improve color contrast when paired with text:

  - DN500 has changed from `#5C6C7A` to `#596773`
  - DN500A has changed from `#A9C5DF7A` to `#9BB4CA80`

  This changes the values in dark mode for the following tokens:

  _(active)_:

  - `color.text.disabled`
  - `color.icon.disabled`
  - `color.background.accent.gray.subtle`

  _(deprecated)_:

  - `color.overlay.pressed`

## 0.10.10

### Patch Changes

- [`dc05530d2a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc05530d2a0) - Internal refactor to the way the documentation is built.

## 0.10.9

### Patch Changes

- Updated dependencies

## 0.10.8

### Patch Changes

- [`3c1eda5c3d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c1eda5c3d0) - [Tokens] added new color.border.bold token

## 0.10.7

### Patch Changes

- [`cb8723a7974`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb8723a7974) - Introduces a new set of neutral accent tokens:

  - `color.background.accent.gray.bolder`
  - `color.background.accent.gray.subtle`
  - `color.background.accent.gray.subtler`
  - `color.background.accent.gray.subtlest`
  - `color.border.accent.gray`
  - `color.icon.accent.gray`
  - `color.text.accent.gray`
  - `color.text.accent.gray.bolder`

## 0.10.6

### Patch Changes

- [`04fc3d5c658`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04fc3d5c658) - Run token transform earlier by hooking into Program visitor

## 0.10.5

### Patch Changes

- [`1124fa435ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1124fa435ed) - Moves the following `deprecated` tokens to the `sunset` phase. Please ensure that all `sunset` tokens are removed from your application, they will be completely removed in the next major version:

  - `color.background.brand.hovered` => `color.background.selected.hovered`
  - `color.background.brand.pressed` => `color.background.selected.pressed`
  - `color.background.brand` => `color.background.selected`
  - `color.background.inverse` => `color.background.inverse.subtle`
  - `color.background.selected.hover` => `color.background.selected.hovered`
  - `color.background.selected.resting` => `color.background.selected`
  - `color.background.subtleBrand.hover` => `color.background.selected.hovered`
  - `color.background.subtleBrand.pressed` => `color.background.selected.pressed`
  - `color.background.subtleBrand.resting` => `color.background.selected`

  If you have configured the design token eslint rules, running `eslint --fix` will resolve these changes automatically.

## 0.10.4

### Patch Changes

- [`7b9be57869b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b9be57869b) - ED-14905 made fallback token name work for production

## 0.10.3

### Patch Changes

- [`acbd8d5576a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/acbd8d5576a) - Added a color-contrast test for our color pairs in the Tokens package.

## 0.10.2

### Patch Changes

- [`5b8212f08b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b8212f08b0) - The current theme can now be accessed and monitored for changes using new exports.

  - `useThemeObserver` React hook
  - `ThemeMutationObserver` Mutation Observer

## 0.10.1

### Patch Changes

- [`7267d0aad7c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7267d0aad7c) - Update group name metadata for light and dark neutral palette tokens

## 0.10.0

### Minor Changes

- [`aa06bcc3c48`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa06bcc3c48) - Removes the :root selector from the light theme, which allows the light theme to be turned off once the css is mounted. This is to support our migration efforts, but we will ultimately reintroduce this behaviour once tokens are the default experience

## 0.9.5

### Patch Changes

- [`4942487a9f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4942487a9f6) - Fixes internal representation of CSS entrypoints for themes. This is an internal change only and does not effect public APIs.

## 0.9.4

### Patch Changes

- [`1dad88929cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1dad88929cd) - Adds the `@af/codegen` package that is designed to be used in concert with packages that utilise built assets in their source. Initial release adds an integrity header to assets from `@atlaskit/tokens`.

## 0.9.3

### Patch Changes

- [`ae9eab2df7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae9eab2df7d) - Fixing blanket selected and danger tokens that were 80% instead of 8% opacity

## 0.9.2

### Patch Changes

- [`c1de986e861`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1de986e861) - Added new entrypoint `@atlaskit/tokens/palettes-raw` for raw palette token data (used in documentation)

## 0.9.1

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 0.9.0

### Minor Changes

- [`54180abbf55`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54180abbf55) - [ux] Add a new `color.border.inverse` token. Use for borders on bold backgrounds

## 0.8.3

### Patch Changes

- [`530455156a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/530455156a8) - Deprecating color.background.inverse in favour of the new color.background.inverse.subtle token instead. Also introduced color.background.inverse.subtle.hovered and color.background.inverse.subtle.pressed tokens to supplement it.

## 0.8.2

### Patch Changes

- [`b170565a618`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b170565a618) - [ux] Update to input token colors: `color.background.input`, `color.background.input.hovered`, `color.background.input.pressed`.

## 0.8.1

### Patch Changes

- [`a66253fc6a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a66253fc6a5) - Export token ID utility functions with new entrypoint `@atlaskit/tokens/token-ids`

## 0.8.0

### Minor Changes

- [`1fb52fef1a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1fb52fef1a8) - [ux] New Skeleton color tokens `color.skeleton.subtle` and `color.skeleton.subtlest`. Use for skeleton loading states

### Patch Changes

- [`ac9343c3ed4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac9343c3ed4) - Replaces usage of deprecated design tokens. No visual or functional changes
- [`308db322b04`](https://bitbucket.org/atlassian/atlassian-frontend/commits/308db322b04) - The following tokens have been moved from the `deprecated` to `deleted` state in their lifecycles. These tokens will continue to exist, however tooling will begin to error wherever they're used. If you haven't already, please run `yarn eslint --fix` or similar to automate your migration.

  - `color.background.blanket` => `color.blanket`
  - `color.background.boldBrand.resting` => `color.background.brand.bold`
  - `color.background.boldBrand.hover` => `color.background.brand.bold.hovered`
  - `color.background.boldBrand.pressed` => `color.background.brand.bold.pressed`
  - `color.background.boldDanger.resting` => `color.background.danger.bold`
  - `color.background.boldDanger.hover` => `color.background.danger.bold.hovered`
  - `color.background.boldDanger.pressed` => `color.background.danger.bold.pressed`
  - `color.background.boldDiscovery.resting` => `color.background.discovery.bold`
  - `color.background.boldDiscovery.hover` => `color.background.discovery.bold.hovered`
  - `color.background.boldDiscovery.pressed` => `color.background.discovery.bold.pressed`
  - `color.background.boldNeutral.resting` => `color.background.neutral.bold`
  - `color.background.boldNeutral.hover` => `color.background.neutral.bold.hovered`
  - `color.background.boldNeutral.pressed` => `color.background.neutral.bold.pressed`
  - `color.background.boldSuccess.resting` => `color.background.success.bold`
  - `color.background.boldSuccess.hover` => `color.background.success.bold.hovered`
  - `color.background.boldSuccess.pressed` => `color.background.success.bold.pressed`
  - `color.background.boldWarning.resting` => `color.background.warning.bold`
  - `color.background.boldWarning.hover` => `color.background.warning.bold.hovered`
  - `color.background.boldWarning.pressed` => `color.background.warning.bold.pressed`
  - `color.background.default` => `elevation.surface`
  - `color.background.card` => `elevation.surface.raised`
  - `color.background.overlay` => `elevation.surface.overlay`
  - `color.background.selected.resting` => `color.background.selected`
  - `color.background.selected.hover` => `color.background.selected.hovered`
  - `color.background.subtleBorderedNeutral.resting` => `color.background.input`
  - `color.background.subtleBorderedNeutral.pressed` => `color.background.input.pressed`
  - `color.background.subtleBrand.resting` => `color.background.brand`
  - `color.background.subtleBrand.hover` => `color.background.brand.hovered`
  - `color.background.subtleBrand.pressed` => `color.background.brand.pressed`
  - `color.background.subtleDanger.resting` => `color.background.danger`
  - `color.background.subtleDanger.hover` => `color.background.danger.hovered`
  - `color.background.subtleDanger.pressed` => `color.background.danger.pressed`
  - `color.background.subtleDiscovery.resting` => `color.background.discovery`
  - `color.background.subtleDiscovery.hover` => `color.background.discovery.hovered`
  - `color.background.subtleDiscovery.pressed` => `color.background.discovery.pressed`
  - `color.background.subtleNeutral.resting` => `color.background.neutral`
  - `color.background.subtleNeutral.hover` => `color.background.neutral.hovered`
  - `color.background.subtleNeutral.pressed` => `color.background.neutral.pressed`
  - `color.background.subtleSuccess.resting` => `color.background.success`
  - `color.background.subtleSuccess.hover` => `color.background.success.hovered`
  - `color.background.subtleSuccess.pressed` => `color.background.success.pressed`
  - `color.background.subtleWarning.resting` => `color.background.warning`
  - `color.background.subtleWarning.hover` => `color.background.warning.hovered`
  - `color.background.subtleWarning.pressed` => `color.background.warning.pressed`
  - `color.background.sunken` => `elevation.surface.sunken`
  - `color.background.transparentNeutral.hover` => `color.background.neutral.subtle.hovered`
  - `color.background.transparentNeutral.pressed` => `color.background.neutral.subtle.pressed`
  - `color.text.highEmphasis` => `color.text`
  - `color.text.mediumEmphasis` => `color.text.subtle`
  - `color.text.lowEmphasis` => `color.text.subtlest`
  - `color.text.link.resting` => `color.link`
  - `color.text.link.pressed` => `color.link.pressed`
  - `color.text.onBold` => `color.text.inverse`
  - `color.text.onBoldWarning` => `color.text.inverse.warning`
  - `color.border.focus` => `color.border.focused`
  - `color.border.neutral` => `color.border`
  - `color.iconBorder.brand` => `color.icon.brand` or `color.border.brand`
  - `color.iconBorder.danger` => `color.icon.danger` or `color.border.danger`
  - `color.iconBorder.warning` => `color.icon.warning` or `color.border.warning`
  - `color.iconBorder.success` => `color.icon.success` or `color.border.success`
  - `color.iconBorder.discovery` => `color.icon.discovery` or `color.border.discovery`
  - `color.overlay.hover` => `color.interaction.hovered`
  - `color.overlay.pressed` => `color.interaction.pressed`
  - `color.shadow.card` => `elevation.shadow.raised`
  - `color.shadow.overlay` => `elevation.shadow.overlay`

## 0.7.3

### Patch Changes

- [`ba0ddcf976e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba0ddcf976e) - Adding new token for `elevation.shadow.overflow`

## 0.7.2

### Patch Changes

- [`2229ec7c745`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2229ec7c745) - elevation.sunken no longer uses a transparent color

## 0.7.1

### Patch Changes

- [`5d35c6b1c5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d35c6b1c5f) - Adding new tokens for `color.blanket.selected` and `color.blanket.danger`

## 0.7.0

### Minor Changes

- [`220aa7f8aab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/220aa7f8aab) - [ux] Dark Mode token colours changed for the background of elements in a selected state (color.background.brand)

### Patch Changes

- [`c2ec60d6a1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2ec60d6a1b) - [ux] Updating existing 16 background accent colors

  - Rename default to subtler (Light:200 / Dark:900)
  - Rename bold renamed to subtle (Light:400 / Dark:700)
  - Update this ⤴ base token for dark mode from 700 to 800 (so it is now Light:400 / Dark:800)

  16 new accent background colors:

  - color.background.accent.[color].subtlest (Light: 100 / Dark:1000)
  - color.background.accent.[color].bolder (Light: 700 / Dark: 400)

  8 new text accent colors:

  - color.text.accent.[color].bolder (Light:900 / Dark:200)

- [`7b6b994bef5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b6b994bef5) - Correct shorthand hex code conversion in Figma synchronisation script
- [`91a3f179e8c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a3f179e8c) - Prefix warnings to deprecated tokens in the Figma synchronizer script

## 0.6.3

### Patch Changes

- [`39f4b3b6b48`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39f4b3b6b48) - Added new base dark mode token DN-100 and modified elevation.surface.token to use it rather than the alpha.

## 0.6.2

### Patch Changes

- [`899fd622557`](https://bitbucket.org/atlassian/atlassian-frontend/commits/899fd622557) - Re-introduces the selected and selected.bold tokens:

  - `color.text.selected`
  - `color.icon.selected`
  - `color.border.selected`
  - `color.background.selected`
  - `color.background.selected.hovered`
  - `color.background.selected.pressed`
  - `color.background.selected.bold`
  - `color.background.selected.bold.hovered`
  - `color.background.selected.bold.pressed`

  The following tokens are _deprecated_:

  - `color.background.brand`
  - `color.background.brand.hovered`
  - `color.background.brand.pressed`

  **IMPORTANT (Manual verification required):**

  Please ensure all usages of the following tokens are replaced with their `selected` counterpart, wherever a brand token is used to represent a selected state.

  - `color.background.brand.[default|hovered|pressed]` => `color.background.selected.[default|hovered|pressed]`
  - `color.background.brand.bold.[default|hovered|pressed]` => `color.background.selected.bold.[default|hovered|pressed]`
  - `color.text.brand` => `color.text.selected`
  - `color.icon.brand` => `color.icon.selected`
  - `color.border.brand` => `color.border.selected`

## 0.6.1

### Patch Changes

- [`3ed3071ee35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ed3071ee35) - Updates elevation.surface.sunken base token in darkmode to DN-100A
- Updated dependencies

## 0.6.0

### Minor Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Various improvements & changes to the tokens build scripts. These changes affect how various artifacts are generated, particularly relating to Figma
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Adds new tokens which represent the latest taxonomy changes.
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Introduces the new accent token set from the latest version of the taxonomy

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The `token()` function no longer throws and instead omits an error in the case where the provided token doesn't exist or is not found.

## 0.5.0

### Minor Changes

- [`03a2ceaaabd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/03a2ceaaabd) - Rename mapper entrypoint now outputs migration meta data in array format rather than object.

## 0.4.2

### Patch Changes

- [`068c9a0b770`](https://bitbucket.org/atlassian/atlassian-frontend/commits/068c9a0b770) - Adds official entrypoint for theme css files

## 0.4.1

### Patch Changes

- [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 0.4.0

### Minor Changes

- [`b46c0681c29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b46c0681c29) - Adds "MISSING_TOKEN" for instances where a suitable token does not exist
- [`d5e751f7236`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d5e751f7236) - Tweaks new palette colors to reflect feedback from the pilot program
- [`2c855cf3bf4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c855cf3bf4) - New internal config change allows this package to be run pre-build by ts-node, allowing access to the babel plugin by repo build tooling

  Removes token-default-values entrypoint

- [`81a0d9b5692`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81a0d9b5692) - Pulled tokens babel plugin in and updated the entrypoint from `@atlaskit/babel-plugin-tokens` to `@atlaskit/tokens/babel-plugin`
- [`4ec42b57298`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ec42b57298) - Updates the figma synchroniser to remove theme prefixes from tokens names, incorperate the isPalette flag into the group attribute and space separate interaction states. These changes improve the findability of tokens in figma

### Patch Changes

- [`a1ad2de440a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1ad2de440a) - Fixes internal types being coerced to implicit any.
- [`286e1d43477`](https://bitbucket.org/atlassian/atlassian-frontend/commits/286e1d43477) - Updated internal token representation to include state/lifecycle metadata
- [`ed086330194`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed086330194) - Internal file restructure for style-dictionary to group it’s inputs /src/tokens and outputs /src/artifacts in dedicated directories
- [`9b1703048e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b1703048e3) - Updates build tooling in preparation for the new taxonomy.

## 0.3.0

### Minor Changes

- [`092e10c6184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/092e10c6184) - CSS variables generated by the tokens package now have a prefix "ds-" to differentiate them from other CSS variables in an application

## 0.2.1

### Patch Changes

- [`5c1cf4723e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c1cf4723e4) - typescript-token-name formatter now outputs token names with an indexable Record type
- [`2f9faec5201`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f9faec5201) - Tokens now provided with descriptions for when they should be used

## 0.2.0

### Minor Changes

- [`18b502b7083`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18b502b7083) - Added a new export, token-default-values, which maps token names to their value in the default theme (currently the "atlassian-light" theme).

## 0.1.1

### Patch Changes

- [`6f3632e65d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6f3632e65d4) - Updates README with MVP instructions for usage.
- [`c1498cb226e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1498cb226e) - Removes previous rename map
- [`0936217160c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0936217160c) - Add bold accent tokens:

  - `color.accent.boldBlue`
  - `color.accent.boldRed`
  - `color.accent.boldGreen`
  - `color.accent.boldOrange`
  - `color.accent.boldTeal`
  - `color.accent.boldPurple`

- [`6d72bea69a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d72bea69a0) - Descriptions and other token metadata is now stored in the "default" theme.
- [`addf9436414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/addf9436414) - [ux] Introduced a restricted util token for use during the initial token migration. This token is for internal use only and will be removed in a future version of `@atlaskit/tokens`.

## 0.1.0

### Minor Changes

- [`642f26d0f0c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/642f26d0f0c) - Adds rename-mapping as an entry point for @atlaskit/tokens. rename-mapping is an object mapping old token names to their new replacements

### Patch Changes

- [`c784665d01d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c784665d01d) - Removes `color.border.overlay` token and replaces it with a third shadow inside `shadow.overlay`.
- [`76b718b72e1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76b718b72e1) - [ux] Fixes incorrect values in the palette and token definitions.
- [`855d6afb3d3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/855d6afb3d3) - Parsing of alpha hex in the Figma synchronizer is fixed.
- [`8d0cb37bfe0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d0cb37bfe0) - Updates: `text.link.pressed` values to `B800/B300`
  Removes: `text.link.hover`
  Combines: `border.disabled` and `background.disabled` → `background.disabled`
  Updates: `background.disabled` token value to `N/DN200A`
  Renames: All accents from `color.accent.blueSubtle` → `color.accent.subtleBlue`
  Renames: `background.selected` to `background.selected.resting`
  Adds: `background.selected.hover`, `background.selected.pressed`
- [`53749f08286`](https://bitbucket.org/atlassian/atlassian-frontend/commits/53749f08286) - Adds tokens:

  - `color.overlay.hover`
  - `color.overlay.pressed`

## 0.0.18

### Patch Changes

- [`2bda3783615`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2bda3783615) - License information added to package.json

## 0.0.17

### Patch Changes

- [`0d0ecc6e790`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d0ecc6e790) - Corrects eslint supressions.

## 0.0.16

### Patch Changes

- [`8418348bf66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8418348bf66) - Revert focus ring token from a shadow to border

## 0.0.15

### Patch Changes

- [`e11b3e4e1ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e11b3e4e1ee) - Restructures tokens into the following format {group}{property}{variant}{state}

## 0.0.14

### Patch Changes

- [`1926dba3536`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1926dba3536) - Adds, removes & renames tokens

  Adds:

  - `color.backgroundSelect`

  Renames:

  - `color.borderTextHighlighted` to `color.bordertextSelected`
  - `elevation.base` to `evelation.backgroundDefault`
  - `elevation.flatSecondary` to `elevation.backgroundSunken`
  - `elevation.backgroundCard` to `color.backgroundCard`
  - `elevation.backgroundOverlay` to `color.backgroundOverlay`
  - `elevation.borderOverlay` to `color.borderOverlay`
  - `elevation.shadowCard` to `shadow.card`
  - `elevation.shadowOverlay` to `shadow.overlay`

  Removes:

  - `elevation.boarderFlatPrimary`

  Updates:

  - `elevation.shadowOverlay` value to `DN100`
  - `color.textWarning` in light mode to `O800`
  - `color.iconBorderWarning` in light mode to `O600`

## 0.0.13

### Patch Changes

- [`769ea83469c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/769ea83469c) - Moves tokens and eslint-plugin-design-system to the public namespace.

## 0.0.12

### Patch Changes

- [`6cde35b66d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6cde35b66d9) - Updates the figma synchronizer with the ability to rename tokens

## 0.0.11

### Patch Changes

- [`170b971ce50`](https://bitbucket.org/atlassian/atlassian-frontend/commits/170b971ce50) - Exposes token names as an entrypoint.

## 0.0.10

### Patch Changes

- [`eb05da78cd0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb05da78cd0) - Figma sync now can set spread property for effect styles.

## 0.0.9

### Patch Changes

- [`76836669a4c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76836669a4c) - Global theme CSS custom properties are now scoped to the html element.

## 0.0.8

### Patch Changes

- [`be2a49c8e04`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be2a49c8e04) - Focus ring token is now a shadow.

## 0.0.7

### Patch Changes

- [`f06c9466af2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f06c9466af2) - Color palette has been updated with new values.

## 0.0.6

### Patch Changes

- [`5fccc343a1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fccc343a1b) - Subtle accent colors added to token set.

## 0.0.5

### Patch Changes

- [`2106cf48ddb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2106cf48ddb) - Adds token "getter" to allow users to fetch and use tokens in their components

## 0.0.4

### Patch Changes

- [`202cf0733de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/202cf0733de) - Tokens are now built using style dictionary with three outputs:

  1. CSS
  1. Figma synchronizers
  1. Token name map

## 0.0.3

### Patch Changes

- [`931f6fc633a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/931f6fc633a) - Updates token schema shape.

## 0.0.2

### Patch Changes

- [`9eaba799050`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9eaba799050) - Adds theme tokens and script to add tokens to figma.

## 0.0.1

### Patch Changes

- [`73aaa81802a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73aaa81802a) - Initial setup & release
