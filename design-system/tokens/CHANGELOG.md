# @atlaskit/tokens

## 1.11.3

### Patch Changes

- [`1b40a9ff426`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b40a9ff426) - update border.input.color to DarkNeutral600

## 1.11.2

### Patch Changes

- [`5f3a4279435`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f3a4279435) - Fixes invalid default values assigned to shadow tokens in the token-default-values.tsx artifact
- [`694b79161b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/694b79161b8) - Corrects Lime chart tokens in the dark mode theme so they use the correct base tokens

## 1.11.1

### Patch Changes

- [`7053f18ecc5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7053f18ecc5) - Added suggest metadata to shape tokens to aid future migration suggestions.
- [`ba43427b3e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba43427b3e8) - Internal changes to account for introduction of shape/radius tokens.

## 1.11.0

### Minor Changes

- [`c96e003db64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c96e003db64) - Following on from 1.7.0, shape tokens are no longer being enabled behind a feature flag. Only space tokens will be enabled by default when the feature flag is active.

## 1.10.2

### Patch Changes

- [`7c1c449eb96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c1c449eb96) - Updated space token descriptions.

## 1.10.1

### Patch Changes

- [`7fb8fb4fbbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7fb8fb4fbbb) - - Fixed an issue where `getCSSCustomProperty` would return the incorrect CSS variable names for space tokens.
  - Updated space token descriptions.

## 1.10.0

### Minor Changes

- [`31426322355`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31426322355) - - Add a new getAllThemeStyles() function that can be used for generating theme CSS files at build time.
  - Add an optional callback parameter to setGlobalTheme() that overrides the default theme loading functionality with the callback.

## 1.9.1

### Patch Changes

- [`7ab8146e433`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ab8146e433) - Re-introduce entry point for token-default-values

## 1.9.0

### Minor Changes

- [`06fb6792d1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/06fb6792d1f) - Subtle adjustments to some color design tokens to improve the dark theme. These changes were previously being tested behind a feature flag.

## 1.8.1

### Patch Changes

- [`8f436f0c301`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f436f0c301) - extend border contrast feature flag to support confluence

## 1.8.0

### Minor Changes

- [`e200f2340ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e200f2340ed) - Introduces new lime token set.

  - `color.text.accent.lime` - Use for lime text on subtlest and subtler lime accent backgrounds when there is no meaning tied to the color.
  - `color.text.accent.lime.bolder` - Use for lime text on subtle lime accent backgrounds when there is no meaning tied to the color.
  - `color.background.accent.lime.subtlest` - Use for lime backgrounds when there is no meaning tied to the color. Reserved for when you only want a hint of color.
  - `color.background.accent.lime.subtler` - Use for lime backgrounds when there is no meaning tied to the color, such as colored tags.
  - `color.background.accent.lime.subtle` - Use for vibrant lime backgrounds when there is no meaning tied to the color, such as colored tags.
  - `color.background.accent.lime.bolder` - Use for lime backgrounds when there is no meaning tied to the color, and the background needs to pass min 3:1 contrast requirements.
  - `color.icon.accent.lime` - Use for lime icons on non-bold backgrounds when there is no meaning tied to the color, such as file type icons.
  - `color.border.accent.lime` - Use for lime borders on non-bold backgrounds when there is no meaning tied to the color.
  - `color.chart.lime` - For data visualisation only.
  - `color.chart.lime.hovered` - Hovered state of color.chart.lime
  - `color.chart.lime.bolder` - For data visualisation only.
  - `color.chart.lime.bolder.hovered` - Hovered state of color.chart.lime.bolder
  - `color.chart.lime.boldest` - For data visualisation only.
  - `color.chart.lime.boldest.hovered` - Hovered state of color.chart.lime.boldest

## 1.7.0

### Minor Changes

- [`85b5f222844`](https://bitbucket.org/atlassian/atlassian-frontend/commits/85b5f222844) - We are testing shape and space tokens behind a feature flag. These tokens will be enabled by default whenever `setGlobalTheme` is called. If this test is successful it will be available in a later release.

## 1.6.0

### Minor Changes

- [`191bbd4a3c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/191bbd4a3c2) - Public changes to types for `setGlobalTheme` to match API - previously themes could be incorrectly applied ie the light theme could theoretically take the space theme as a valid value. No behavior changes. Internally the shape theme has been moved from experimental status. These tokens are now active however they remain disabled by default.

### Patch Changes

- [`98edc7e8b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98edc7e8b62) - Patch for tokens metadata and descriptions.

## 1.5.2

### Patch Changes

- [`8be4cc2372f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8be4cc2372f) - update border color to Neutral500

## 1.5.1

### Patch Changes

- [`e7ea6832ad2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7ea6832ad2) - Bans the use of React.FC/React.FunctionComponent type in ADS components as part of the React 18 migration work. The change is internal only and should not introduce any changes for the component consumers.

## 1.5.0

### Minor Changes

- [`43d186af89c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/43d186af89c) - [ux] Updates spacing, typography metadata to apply rems or pixels depending on the target platform.

### Patch Changes

- [`019af32072d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/019af32072d) - Add shape token handling to the `ensure-design-token-usage-spacing` rule.

## 1.4.4

### Patch Changes

- [`33f10b7eb36`](https://bitbucket.org/atlassian/atlassian-frontend/commits/33f10b7eb36) - Removing unused dependencies and dev dependencies

## 1.4.3

### Patch Changes

- [`32e364bed0b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/32e364bed0b) - We are testing color tweaks to the dark theme behind a feature flag.

## 1.4.2

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 1.4.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 1.4.0

### Minor Changes

- [`36158b8bcb9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/36158b8bcb9) - [ux] update color.border.input to meet 3:1 contrast

## 1.3.2

### Patch Changes

- [`bae41641c82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bae41641c82) - Enable the dark theme tweaks for Confluence behind a feature flag.

## 1.3.1

### Patch Changes

- [`e55ef3fcfac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e55ef3fcfac) - Fixes an issue where the dark theme tweaks (currently behind a feature flag) were not being displayed in some cases due to a race condition.

## 1.3.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 1.2.19

### Patch Changes

- [`1a1dc6a0370`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a1dc6a0370) - Upgrade `@babel` scoped packages to `^7.20.0`

## 1.2.18

### Patch Changes

- [`ea8c1af425d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea8c1af425d) - Fixes a bug in `setGlobalTheme()` that caused both the light and dark themes to load when auto theme switching was disabled — only one of the themes should be loaded in this case. It also fixes a bug in `getThemeStyles()`, where the default color themes were loaded instead of the specified theme.

## 1.2.17

### Patch Changes

- [`6cf7fc4647d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6cf7fc4647d) - Adds color-scheme css property to color themes to ensure the correct scheme is used at all times. Previously this was only part of the css-reset however in instances where that is not used this property will always be applied

## 1.2.16

### Patch Changes

- [`1ddf6dd6387`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ddf6dd6387) - Adds a beta contrast checking tool to token examples utilising a new "token pairing" algorithm to find recommended pairs of foreground and background tokens. There is no change to API or bundle size.

## 1.2.15

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils

## 1.2.14

### Patch Changes

- [`e0460d5d989`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0460d5d989) - Usages of `process` are now guarded by a `typeof` check.
- [`2efaed356e0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2efaed356e0) - Modified `color.text.accent.gray.bolder` token value for the dark theme.

## 1.2.13

### Patch Changes

- [`a02eed2974e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a02eed2974e) - Move codegen into @atlassian scope to publish it to private registry

## 1.2.12

### Patch Changes

- [`ec8f1ac379a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec8f1ac379a) - Tweaks to dark theme tokens (`background.selected` and `background.selected.pressed`) behind a feature flag.

## 1.2.11

### Patch Changes

- [`8ec4434b4c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8ec4434b4c2) - The return type for `useThemeObserver` now omits `auto` as a possible option for `colorMode`. From the perspective of observers `auto` does not exist because `colorMode` is precalculated at runtime.

## 1.2.10

### Patch Changes

- [`80a0a472d01`](https://bitbucket.org/atlassian/atlassian-frontend/commits/80a0a472d01) - Onboard `@atlaskit/tokens` on push model consumption

## 1.2.9

### Patch Changes

- [`aef90f8953b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aef90f8953b) - Tweaks to a subset of dark theme tokens behind a feature flag.

## 1.2.8

### Patch Changes

- [`de4f079569a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de4f079569a) - The tokens babel-plugin will no longer run on files in node_module directories. This is to avoid attempting to transform legacy tokens from older transitive dependencies.

## 1.2.7

### Patch Changes

- [`23b381db41c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/23b381db41c) - Upgrades component types to support React 18.

## 1.2.6

### Patch Changes

- [`cfe48bb7ece`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cfe48bb7ece) - Internal change only. Replace usages of Inline/Stack with stable version from `@atlaskit/primitives`.

## 1.2.5

### Patch Changes

- [`d1adc718599`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d1adc718599) - Added token-order entry-point, exported ActiveTokens type.

## 1.2.4

### Patch Changes

- [`2717641f696`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2717641f696) - The getTokenValue helper now strips leading or trailing spaces if they exist.

## 1.2.3

### Patch Changes

- [`e2b8df300f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2b8df300f2) - Pull responsive helpers from `@atlaskit/primitives/responsive` instead of `@atlaskit/grid` as they've been moved.

## 1.2.2

### Patch Changes

- [`67a01afe12b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/67a01afe12b) - Add internal and experimental token for border.width.0

## 1.2.1

### Patch Changes

- [`7f5f23dcb68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f5f23dcb68) - Introduce shape tokens to some packages.

## 1.2.0

### Minor Changes

- [`64d30817221`](https://bitbucket.org/atlassian/atlassian-frontend/commits/64d30817221) - Introduce experimental 'shape' tokens for use with border properties.

## 1.1.0

### Minor Changes

- [`4b9aea55b97`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b9aea55b97) - Removed various unused experimental spacing tokens in favor of the `space.X` token format.

  Removed:

  - `spacing.scale`
  - `spacing.scaleLinear`
  - `spacing.size`
  - `spacing.gap`
  - `spacing.inset`
  - `spacing.ecl`
  - `spacing.ccc`

## 1.0.0

### Major Changes

- [`512be9e1854`](https://bitbucket.org/atlassian/atlassian-frontend/commits/512be9e1854) - This PR introduces the 1.0 stable version of `@atlaskit/tokens`. With the changes introduced here, the tokens package _will be considered stable and feature-complete moving forward_.

  #### 💥 Breaking change: Theme lazy-loading

  Previously, themes were exposed as static CSS files via custom entry-points. This worked quite well but had a couple of obvious drawbacks.

  1.  CSS files depend on webpack/css-loading mechanisms (`style-loader`/`css-loader`) which aren't available in all environments.

  2.  Configuration and ordering of themes happened entirely in products, which becomes increasingly harder to maintain as new themes & functionality are introduced

  We have moved this to a lazy-loaded JS solution. Themes are now codegen'd into Javascript modules, wrapped in a template literal string, then lazy-loaded and mounted to the head of the document when required at runtime.

  **Benefits include:**

  - More control over the ordering and composition of themes

  - Automatic lazy-loading of new themes when `setGlobalTheme` is called by the client

  - Simplified bundler configuration

  - Improved portability

  - Integrates with a new SSR solution for theme loading

  **Changes:**

  If you set themes using `setGlobalTheme` in your app, you can now remove manual imports of theme CSS files from your app. The themes will be automatically added when `setGlobalTheme` is called.

  ```diff
  -import("atlassian-light.css") from '@atlaskit/tokens/css'
  -import("atlassian-legacy-dark.css") from '@atlaskit/tokens/css'
  -setGlobalTheme("light", true)
  +setGlobalTheme({light: "light", dark: "legacy-dark", colorMode: 'auto'})
  ```

  If your app supports server-side rendering, further work is required to ensure themes are loaded on the page before first paint. See below for details on the new SSR utilities.

  #### 💥 Breaking change: Removal of deprecated & deleted tokens

  [As per our versioning strategy](https://hello.atlassian.net/wiki/spaces/DST/pages/1818362892?search_id=660dc077-8ecb-4142-be48-1e610e372315), MAJOR versions is when we remove all deprecated and sunset tokens. This provides significant bundle size improvements to token CSS files.

  If you have been using our lint rules `@atlaskit/design-system/no-unsafe-design-token-usage` and `@atlaskit/design-system/no-deprecated-design-token-usage`, these tokens should already be triggering eslint errors from the version they were deprecated.

  Please run `yarn eslint --fix` or similar to automate your migration before upgrading to `1.0.0`.

  _Please see below for a full list of removed tokens and their replacements._

  Note: MISSING_TOKEN is also being removed. This was a utility token to support early migration efforts; as tokens are now visible to end-users, please ensure all usages are removed from your app.

  #### 💥 Breaking change: `setGlobalTheme` & `ThemeObserver` & `useThemeObserver`

  **ThemeState configuration object**

  `setGlobalTheme`, `ThemeMutationObserver` & `useThemeObserver` now input and output theme preferences as a `themeState` object rather than a space-separated string. This enables:

  - Stronger type safety

  - Explicit definition of themes to render in light and dark mode.

  - Improved extensibility options for new types of themes, such as spacing and typography.

  `themeState` has the following default values, which set the standard Atlassian color themes, and enables automatic color mode switching based on the user's system preference:

  ```js
  {
    colorMode: 'auto',
    dark: 'dark',
    light: 'light',
    spacing: undefined,
    typography: undefined,
  };
  ```

  Any usages of `setGlobalTheme` need` to be updated to the new object syntax:

  ```diff
  -setGlobalTheme('light');
  +setGlobalTheme({ light: 'light', colorMode: 'light' ...});
  ```

  **Changes to colorMode**

  Previously, the current color mode (i.e. "light" or "dark" mode) was inferred from the color theme passed into `setGlobalTheme`. A second parameter, `shouldMatchSystem`, set `data-color-mode` to `'auto'` and matched the current theme to operating system settings:

  ```js
  setGlobalTheme('legacy-dark'); // a "dark" theme, so color mode is set to 'dark'
  setGlobalTheme('light', true); // color mode is 'light' or 'dark' depending on system theme
  ```

  Now, the current color mode, as well as which themes to render in each color mode, can be configured via the `themeState` object:

  ```js
  setGlobalTheme({
    dark: 'dark' // in dark mode, use the 'dark' theme
    light: 'light' // in light mode, use the 'light' theme
    colorMode: 'auto', // Set the color mode automatically based on system preference
  });
  ```

  If your app previously set the second parameter, `shouldMatchSystem`, this feature is now enabled by default.

  ```diff
  // Automatic theme switching
  -setGlobalTheme('light', true)
  +setGlobalTheme({light: 'light', dark: 'dark', 'auto'})
  // OR, since setGlobalTheme has default values
  +setGlobalTheme({})

  // Light theme
  -setGlobalTheme('light')
  +setGlobalTheme({light: 'light', colorMode: 'light'})
  // OR
  +setGlobalTheme({colorMode: 'light'})

  // Dark theme
  -setGlobalTheme('dark')
  +setGlobalTheme({dark: 'dark', colorMode: 'dark'})
  // OR
  +setGlobalTheme({colorMode: 'dark'})
  ```

  **Color mode switching is enabled by default**

  As noted above, automatic theme switching is now enabled by default. To disable automatic theme switching, set `colorMode` to either `'light'` or `'dark'`.

  #### 🔀 Breaking behavioural change: `data-theme` & `data-color-mode`

  The way this state is reflected on the DOM has been updated to match the changes above:

  ```diff
  -<html data-theme="light" data-color-mode="light">
  +<html data-theme="light:light dark:dark spacing:compact" data-color-mode="light">
  ```

  Theme state on the DOM is primarily to store data in a place that can be accessed from anywhere in the app, and secondly to activate CSS selectors.

  Two new utilities, `themeStringToObject` and `themeObjectToString`, allow conversion from string to object syntax if necessary.

  #### 🔀 Breaking change: System-level theme switching

  Token auto theme switching now uses a Javascript-based solution, rather than embedding media queries in theme CSS files. If `colorMode` is set to `'auto'`, media query event listeners will trigger when the system theme changes, and update `data-color-mode` to `'light'` or `'dark'` automatically.

  This provides several benefits:

  - Significant (~50%) improvements to bundle size for token CSS files compared to the pre-release version of `@atlaskit/tokens`.

  - Simpler logic for switching an experience based on the current theme:

    - Previously, experiences using theme observers had to check a combination of the `data-color-mode` attribute use media queries to to correctly match the currently rendered color mode in light, dark and 'auto' color modes. Now, the `data-color-mode` attribute always matches the currently rendered color mode, and media queries are no longer required.

  As a result of this change, the `data-color-mode` attribute no longer supports the value `'auto'`. If your experience checked for this value, this logic can now be removed, as `data-color-mode` will always reflect the currently rendered theme.

  #### ✨ New: server-side rendering utility functions

  Three new utility functions provide the logic required to load and display the correct themes in your server-rendered output, preventing a flash of incorrectly themed content on first paint. Each accepts the same themeState object representing the user's stored theme preference:

  - `getThemeStyles` provides the contents of `<style>` tags to attach to the head of your server-side rendered document

  - `getThemeHtmlAttributes` provides data-attributes to set on the root of your document.

  - `getSSRAutoScript` provides a script to detect the system theme and configure the color mode before first paint.

  For more information on these utilities, check the [@atlaskit/tokens API documentation](https://atlassian.design/components/tokens/code) on atlassian.design.

  #### 🐞 Fixes

  **Observer fixes:**

  `useThemeObserver` & `ThemeMutationObserver` now listen to changes on data-theme instead of data-color-mode.

  Previously changes between two themes that both have a light color mode would not trigger an event since `data-color-mode` would not be updated. With this fix, the event fires on every call to `setGlobalTheme` regardless if there is a change to the theme or not.

  **Automatic theme switching changes:**

  Previously, the order of themes determined which one rendered. If you had multiple 'light' themes in your app, the order of the CSS files in the DOM determined which one rendered in "auto" mode.

  Now, the theme that renders when the system is in 'light' and 'dark' mode is deterministic, and explicitly configured via the `themeState` object.

  #### 🚮 Removed tokens

  The following tokens have been moved from the `deprecated` & `deleted` to removed state in their lifecycles. These tokens will no longer exist and will not be functional moving forward, tooling will begin to error wherever they're used.

  - `color.text.highEmphasis` => `color.text`
  - `color.text.link.pressed` => `color.link.pressed`
  - `color.text.link.resting` => `color.link`
  - `color.text.lowEmphasis` => `color.text.subtlest`
  - `color.text.mediumEmphasis` => `color.text.subtle`
  - `color.text.onBold` => `color.text.inverse`
  - `color.text.onBoldWarning` => `color.text.warning.inverse`
  - `color.border.focus` => `color.border.focused`
  - `color.border.neutral` => `color.border`
  - `color.background.accent.blue` => `color.background.accent.blue.subtler`
  - `color.background.accent.blue.bold` => `color.background.accent.blue.subtle`
  - `color.background.accent.red` => `color.background.accent.red.subtler`
  - `color.background.accent.red.bold` => `color.background.accent.red.subtle`
  - `color.background.accent.orange` => `color.background.accent.orange.subtler`
  - `color.background.accent.orange.bold` => `color.background.accent.orange.subtle`
  - `color.background.accent.yellow` => `color.background.accent.yellow.subtler`
  - `color.background.accent.yellow.bold` => `color.background.accent.yellow.subtle`
  - `color.background.accent.green` => `color.background.accent.green.subtler`
  - `color.background.accent.green.bold` => `color.background.accent.green.subtle`
  - `color.background.accent.teal` => `color.background.accent.teal.subtler`
  - `color.background.accent.teal.bold` => `color.background.accent.teal.subtle`
  - `color.background.accent.purple` => `color.background.accent.purple.subtler`
  - `color.background.accent.purple.bold` => `color.background.accent.purple.subtle`
  - `color.background.accent.magenta` => `color.background.accent.magenta.subtler`
  - `color.background.accent.magenta.bold` => `color.background.accent.magenta.subtle`
  - `color.background.inverse` => `color.background.inverse.subtle`
  - `color.background.brand` => `color.background.selected`
  - `color.background.brand.hovered` => `color.background.selected.hovered`
  - `color.background.brand.pressed` => `color.background.selected.pressed`
  - `color.background.selected.resting` => `color.background.selected`
  - `color.background.selected.hover` => `color.background.selected.hovered`
  - `color.background.blanket` => `color.blanket`
  - `color.background.boldBrand.hover` => `color.background.brand.bold.hovered`
  - `color.background.boldBrand.pressed` => `color.background.brand.bold.pressed`
  - `color.background.boldBrand.resting` => `color.background.brand.bold`
  - `color.background.boldDanger.hover` => `color.background.danger.bold.hovered`
  - `color.background.boldDanger.pressed` => `color.background.danger.bold.pressed`
  - `color.background.boldDanger.resting` => `color.background.danger.bold`
  - `color.background.boldDiscovery.hover` => `color.background.discovery.bold.hovered`
  - `color.background.boldDiscovery.pressed` => `color.background.discovery.bold.pressed`
  - `color.background.boldDiscovery.resting` => `color.background.discovery.bold`
  - `color.background.boldNeutral.hover` => `color.background.neutral.bold.hovered`
  - `color.background.boldNeutral.pressed` => `color.background.neutral.bold.pressed`
  - `color.background.boldNeutral.resting` => `color.background.neutral.bold`
  - `color.background.boldSuccess.hover` => `color.background.success.bold.hovered`
  - `color.background.boldSuccess.pressed` => `color.background.success.bold.pressed`
  - `color.background.boldSuccess.resting` => `color.background.success.bold`
  - `color.background.boldWarning.hover` => `color.background.warning.bold.hovered`
  - `color.background.boldWarning.pressed` => `color.background.warning.bold.pressed`
  - `color.background.boldWarning.resting` => `color.background.warning.bold`
  - `color.background.card` => `elevation.surface.raised`
  - `color.background.default` => `elevation.surface`
  - `color.background.overlay` => `elevation.surface.overlay`
  - `color.background.subtleBorderedNeutral.pressed` => `color.background.input.pressed`
  - `color.background.subtleBorderedNeutral.resting` => `color.background.input`
  - `color.background.subtleBrand.hover` => `color.background.selected.hovered`
  - `color.background.subtleBrand.pressed` => `color.background.selected.pressed`
  - `color.background.subtleBrand.resting` => `color.background.selected`
  - `color.background.subtleDanger.hover` => `color.background.danger.hovered`
  - `color.background.subtleDanger.pressed` => `color.background.danger.pressed`
  - `color.background.subtleDanger.resting` => `color.background.danger`
  - `color.background.subtleDiscovery.hover` => `color.background.discovery.hovered`
  - `color.background.subtleDiscovery.pressed` => `color.background.discovery.pressed`
  - `color.background.subtleDiscovery.resting` => `color.background.discovery`
  - `color.background.subtleNeutral.hover` => `color.background.neutral.hovered`
  - `color.background.subtleNeutral.pressed` => `color.background.neutral.pressed`
  - `color.background.subtleNeutral.resting` => `color.background.neutral`
  - `color.background.subtleSuccess.hover` => `color.background.success.hovered`
  - `color.background.subtleSuccess.pressed` => `color.background.success.pressed`
  - `color.background.subtleSuccess.resting` => `color.background.success`
  - `color.background.subtleWarning.hover` => `color.background.warning.hovered`
  - `color.background.subtleWarning.pressed` => `color.background.warning.pressed`
  - `color.background.subtleWarning.resting` => `color.background.warning`
  - `color.background.sunken` => `elevation.surface.sunken`
  - `color.background.transparentNeutral.hover` => `color.background.neutral.subtle.hovered`
  - `color.background.transparentNeutral.pressed` => `color.background.neutral.subtle.pressed`
  - `color.interaction.inverse.hovered` => `color.background.inverse.subtle.hovered`
  - `color.interaction.inverse.pressed` => `color.background.inverse.subtle.pressed`
  - `color.accent.boldBlue` => `color.background.accent.blue.bolder`
  - `color.accent.boldGreen` => `color.background.accent.green.bolder`
  - `color.accent.boldOrange` => `color.background.accent.orange.bolder`
  - `color.accent.boldPurple` => `color.background.accent.purple.bolder`
  - `color.accent.boldRed` => `color.background.accent.red.bolder`
  - `color.accent.boldTeal` => `color.background.accent.teal.bolder`
  - `color.accent.subtleBlue` => `color.background.accent.blue.subtler`
  - `color.accent.subtleGreen` => `color.background.accent.green.subtler`
  - `color.accent.subtleMagenta` => `color.background.accent.magenta.subtler`
  - `color.accent.subtleOrange` => `color.background.accent.orange.subtler`
  - `color.accent.subtlePurple` => `color.background.accent.purple.subtler`
  - `color.accent.subtleRed` => `color.background.accent.red.subtler`
  - `color.accent.subtleTeal` => `color.background.accent.teal.subtler`
  - `color.iconBorder.brand` => `color.icon.brand`
  - `color.iconBorder.danger` => `color.icon.danger`
  - `color.iconBorder.discovery` => `color.icon.discovery`
  - `color.iconBorder.success` => `color.icon.success`
  - `color.iconBorder.warning` => `color.icon.warning`
  - `color.overlay.hover` => `color.interaction.hovered`
  - `color.overlay.pressed` => `color.interaction.pressed`
  - `shadow.card` => `elevation.shadow.raised`
  - `shadow.overlay` => `elevation.shadow.overlay`
  - `utility.UNSAFE_util.transparent` => `utility.UNSAFE.transparent`
  - `utility.UNSAFE_util.MISSING_TOKEN` => No replacement

## 0.13.5

### Patch Changes

- [`1f558943507`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f558943507) - Correct Figma entrypoints to use raw json

## 0.13.4

### Patch Changes

- [`48c9ecca2c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48c9ecca2c4) - - `@atlaskit/tokens/figma-sync` entrypoint added to sync design tokens to the ADS Figma library (not intended for external use).
  - Tokens are now sorted by a predefined order across artifact output, ensuring consistency across experiences.

## 0.13.3

### Patch Changes

- [`0438a9318a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0438a9318a1) - Tweaked the values of the `Neutral500` and `Neutral500` base tokens and updated `text.accent.gray.bolder` to improve color contrast:

  - Adjust `Neutral500` from `#8993A5` to `#8590A2` so that it passes 3:1 contrast against sunken surfaces in light mode
  - Adjust `Neutral500A` from `#091E42 @ 48%` to `#091E42 @ 49%` to match color of `Neutral500` on default surfaces
  - Update `text.accent.gray.bolder` to use `Neutral1100` so gray tags pass contrast requirements

- [`765c27c301e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/765c27c301e) - Adds new chart tokens for data visualisation and charts.

  27 generic chart tokens and hovered state tokens:

  - `color.chart.[color].bold`
  - `color.chart.[color].bolder`
  - `color.chart.[color].boldest`

  12 semantic chart tokens and hovered state tokens:

  - `color.chart.brand`
  - `color.chart.neutral`
  - `color.chart.success`
  - `color.chart.success.bold`
  - `color.chart.danger`
  - `color.chart.danger.bold`
  - `color.chart.warning`
  - `color.chart.warning.bold`
  - `color.chart.information`
  - `color.chart.information.bold`
  - `color.chart.discovery`
  - `color.chart.discovery.bold`

  8 categorical chart tokens and hovered state tokens:

  - `color.chart.categorical.1`
  - `color.chart.categorical.2`
  - `color.chart.categorical.3`
  - `color.chart.categorical.4`
  - `color.chart.categorical.5`
  - `color.chart.categorical.6`
  - `color.chart.categorical.7`
  - `color.chart.categorical.8`

## 0.13.2

### Patch Changes

- [`716af1d3387`](https://bitbucket.org/atlassian/atlassian-frontend/commits/716af1d3387) - Bump @atlaskit/heading from 1.0.0 to 1.0.1 to avoid resolving to poison dependency version

## 0.13.1

### Patch Changes

- [`a5eed85fe2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5eed85fe2e) - Added a new `getTokenValue()` API - it accepts a dot-separated token name and a fallback value, and returns the current computed CSS value for the resulting CSS Custom Property. This should be used when the CSS cascade isn't available, eg. `<canvas>` elements, JS charting libraries, etc.

## 0.13.0

### Minor Changes

- [`00c057bdd71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00c057bdd71) - Removes spacing-raw & typography-raw entrypoints in favor of tokens-raw

## 0.12.0

### Minor Changes

- [`5892d12b125`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5892d12b125) - Refactors token artifact generation via style-dictionary. The tokens package no longer outputs redundant files on a per theme basis and instead consolidates schema-focused outputs into individual files where possible.

## 0.11.6

### Patch Changes

- [`3d46e550157`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d46e550157) - Fixes a bug with the tokens-babel-plugin where it was transforming token functions which were imported from modules other than the @atlaskit/tokens package.

## 0.11.5

### Patch Changes

- [`bcef9745338`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bcef9745338) - useThemeObserver now exclusively watches `data-theme` instead of `data-color-mode` to ensure all changes to the theme attr trigger an event. Previously, if a theme moved from light theme, which had a mode="light", to another theme such as legacy-light with the same mode, no event will be triggered.

## 0.11.4

### Patch Changes

- [`39c4b520ef3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/39c4b520ef3) - - Adds `typography-raw` entry point for easy access.

## 0.11.3

### Patch Changes

- [`f824dcfff6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f824dcfff6e) - Internal changes to satisfy various lint warnings & errors

## 0.11.2

### Patch Changes

- [`81e34736aa0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81e34736aa0) - [ux] Introduces additional token set `space.*`. These tokens match the behavior of `spacing.scale.*`. Also introduces two additional base tokens, `Space800` and `Space1000`.

## 0.11.1

### Patch Changes

- [`9307ebb86d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9307ebb86d8) - Revert addition of init entry point in favor of an upcoming solution.

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

- [`1dad88929cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1dad88929cd) - Adds the `@atlassian/codegen` package that is designed to be used in concert with packages that utilise built assets in their source. Initial release adds an integrity header to assets from `@atlaskit/tokens`.

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
