# @atlaskit/eslint-plugin-design-system

## 8.6.0

### Minor Changes

- [`192ba90d75b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/192ba90d75b) - The `ensure-design-token-usage` rules now support auto-fixing negative values to negative space tokens.

### Patch Changes

- Updated dependencies

## 8.5.0

### Minor Changes

- [`4eab52ffd1c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4eab52ffd1c) - Add `@atlaskit/button/unsafe` to 'no-banned-imports' lint rule

## 8.4.5

### Patch Changes

- [`d37dcab0fc4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d37dcab0fc4) - Stop `prefer-primitives` from reporting on React components.

## 8.4.4

### Patch Changes

- [`f7a807adba2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7a807adba2) - Update the `ensure-design-token-usage` rule to disallow setting the 'current surface' CSS variable (--ds-elevation-surface-current) to a hardcoded color.
- Updated dependencies

## 8.4.3

### Patch Changes

- [`96e35ec4b9d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96e35ec4b9d) - Tweak `use-primitives` and `prefer-primitives` logic to stop false positives for component names that contain HTML element names.

## 8.4.2

### Patch Changes

- [`fb85e69cf5e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb85e69cf5e) - Added this package into push model consumption.

## 8.4.1

### Patch Changes

- [`b11339bc8a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b11339bc8a3) - Internal updates for ADS Typography ADG3 theme.
- Updated dependencies

## 8.4.0

### Minor Changes

- [`0128df16060`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0128df16060) - Added new `prefer-primitives` rule that detects use of `<div>` and `<span>` either as HTML tags or via styled components (`styled.div`, `styled('div')`) and suggests using primitive components instead.

## 8.3.0

### Minor Changes

- [`87feea3d8e0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87feea3d8e0) - Add banned import rule for `@atlaskit/primitives/pressable`

## 8.2.2

### Patch Changes

- [`1859bc0b8c7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1859bc0b8c7) - Update the casing on `xcss` to ensure consistency with the API and package consumption.

## 8.2.1

### Patch Changes

- [`52b35a6b571`](https://bitbucket.org/atlassian/atlassian-frontend/commits/52b35a6b571) - - Fixed an issue where the `ensure-design-token-usage` rule may incorrectly report variables that reference tokens as an error.
  - Fixed an issue where the `ensure-design-token-usage` rule may handle expressions that span multiple lines in template literals incorrectly.

## 8.2.0

### Minor Changes

- [`a5c9f63d2a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5c9f63d2a8) - Add improved behavior for suggestions for `use-primitives` rule.

## 8.1.0

### Minor Changes

- [`4f9c29b2f9f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f9c29b2f9f) - Added the `no-nested-styles` rule which disallows usage of nested styles. The `no-nested-styles` rule also disallows media queries that contain min-width or max-width. The Atlassian Design System `media` object should be used instead. Other forms of media queries are still allowed.

## 8.0.2

### Patch Changes

- [`05a00999956`](https://bitbucket.org/atlassian/atlassian-frontend/commits/05a00999956) - `TODO` comments are no longer added when applying a spacing fix from `ensure-design-token-usage`.

## 8.0.1

### Patch Changes

- [`278fb6833be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/278fb6833be) - The `ensure-design-token-usage` rule no longer lints against styles inside `xcss` as it already has type-safety built in for properties that accept tokens.

## 8.0.0

### Major Changes

- [`3919464ef44`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3919464ef44) - Removed `ensure-design-token-usage-spacing`. Use `ensure-design-token-usage` instead. See release notes for v7.0.0 for more info.

  `ensure-design-token-usage` now **errors** against spacing properties by default.

  If the `domains` option is provided it will override any defaults, for example the following will ignore defaults and only error for color:

  ```js
  rules: {
    '@atlaskit/design-system/ensure-design-token-usage': [
      'error',
      {
        domains: ['color'],
        shouldEnforceFallbacks: false
      },
    ],
  },
  ```

  You can use `ensure-design-token-usage/preview` to **warn** about spacing properties until you are ready to set the main rule to error:

  ```js
  rules: {
    '@atlaskit/design-system/ensure-design-token-usage/preview': [
      'warn',
      {
        domains: ['spacing'],
        shouldEnforceFallbacks: false
      },
    ],
    '@atlaskit/design-system/ensure-design-token-usage': [
      'error',
      {
        domains: ['color'],
        shouldEnforceFallbacks: false
      },
    ],
  },
  ```

  In many cases `eslint --fix` will automatically apply migrations from hardcoded values and `gridSize` to space tokens.

## 7.0.3

### Patch Changes

- [`81c15e86b18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81c15e86b18) - Improved autofix for 50% border radius to shape token.

## 7.0.2

### Patch Changes

- [`50cf866a219`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50cf866a219) - bump semver

## 7.0.1

### Patch Changes

- [`8c955333863`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c955333863) - Fix ensure-design-token-usage to declare that is has suggestions, unblocking ESLint 7+ usage.

## 7.0.0

### Major Changes

- [`177c8c14160`](https://bitbucket.org/atlassian/atlassian-frontend/commits/177c8c14160) - Merged the `ensure-design-token-usage` and `ensure-design-token-usage-spacing` rules into a single rule: `ensure-design-token-usage`. This rule enforces color and space tokens and will be extended to enforce domains such as typography and shape in the future. The rule accepts a `domains` option which allows you to specify which domains to lint, currently defaulting to 'color' and 'space'. This rule defaults to `error`.

  To update to this version:

  - If you are using the `ensure-design-token-usage` rule, add the `domains` property with a value of `['color']`:

    ```js
    rules: {
      '@atlaskit/design-system/ensure-design-token-usage': [
        'error',
        {
          domains: ['color'],
          shouldEnforceFallbacks: false
        },
      ],
    },
    ```

  - If you are using the `ensure-design-token-usage-spacing` rule, remove any references to it and add `'spacing'` to the domains array above.

    ```js
    rules: {
      '@atlaskit/design-system/ensure-design-token-usage': [
        'error',
        {
          domains: ['color', 'spacing'],
          shouldEnforceFallbacks: false
        },
      ],
    },
    ```

  - If you are not using either of these rules, no changes are required.

  Added a new rule `ensure-design-token-usage/preview` which is a direct clone of `ensure-design-token-usage`, but defaults to `warn`. Through this rule you can specify domains to enforce tokens for, but with a warning rather than a blocking error. This is intended to ease the introduction of certain tokens into a codebase.

## 6.2.1

### Patch Changes

- [`0f48aae95e4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0f48aae95e4) - Patch for incorrect behavior in upstream library.

## 6.2.0

### Minor Changes

- [`373b6b701ca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/373b6b701ca) - Linters will now error when deprecated theme color mixins are imported

## 6.1.0

### Minor Changes

- [`99d5309f42b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99d5309f42b) - The ensure-design-token-usage-spacing rule will now lint against inline style objects

## 6.0.1

### Patch Changes

- [`fa18829653d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa18829653d) - Updated spacing rule to ignore gridSize functions that accept arguments as these are custom and not part of the Design System.

## 6.0.0

### Major Changes

- [`c8174712a85`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8174712a85) - New rule consistent-css-prop-usage available as part of the recommended preset. For detailed docs please see: https://atlassian.design/components/eslint-plugin-design-system/usage#consistent-css-prop-usage

## 5.5.0

### Minor Changes

- [`35a57c481af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/35a57c481af) - Improved import matching for no-deprecated-apis rule to match substrings of import paths.

## 5.4.2

### Patch Changes

- [`121f9ae5c38`](https://bitbucket.org/atlassian/atlassian-frontend/commits/121f9ae5c38) - Internal dependency bump.

## 5.4.1

### Patch Changes

- [`432d4ce47ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/432d4ce47ee) - Account for additional border properties in spacing rule.

## 5.4.0

### Minor Changes

- [`eb75c962cfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb75c962cfb) - `gridSize` imports from `@atlaskit/theme` are now deprecated in favor of applying space tokens via `@atlaskit/tokens`.

### Patch Changes

- [`019af32072d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/019af32072d) - Add shape token handling to the `ensure-design-token-usage-spacing` rule.
- [`7b017c0be76`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b017c0be76) - Internal tweaks to spacing rule fixers.
- Updated dependencies

## 5.3.2

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 5.3.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 5.3.0

### Minor Changes

- [`51a48a1bb1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/51a48a1bb1b) - Update docs to accept a `severity` property so the purpose of `recommended` is no longer double. "all" preset now respects this preference - before it was always "error". This makes the presets more aligned with the underlying implementations."

## 5.2.0

### Minor Changes

- [`11e5168f1c2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11e5168f1c2) - Internal refactor of ensure-design-token-usage which also addresses some false positives

## 5.1.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 5.0.3

### Patch Changes

- [`7c55a69a5ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c55a69a5ec) - Fix issue where 'auto' may still be reported as an error in object styles.

## 5.0.2

### Patch Changes

- [`a5f1c4fa284`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a5f1c4fa284) - Update links in the `use-primitives` rule to point to the right docs URL.

## 5.0.1

### Patch Changes

- [`31ebca384fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31ebca384fa) - Improved behaviour of `ensure-design-token-usage-spacing` rule to not report on or replace 0, auto, and calc within spacing properties.

## 5.0.0

### Major Changes

- [`b910bbe6130`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b910bbe6130) - The following rules are now included in the recommended preset as errors:

  - ensure-design-token-usage
  - no-deprecated-apis
  - no-deprecated-imports
  - no-unsafe-design-token-usage

  The following rules are now included in the recommended preset as warnings:

  - no-deprecated-design-token-usage

### Minor Changes

- [`b689e24847d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b689e24847d) - All lint rule violations in IDEs now point to their corresponding documentation on https://atlassian.design.

## 4.20.0

### Minor Changes

- [`fa50be73bfe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa50be73bfe) - [ux] Spacing rule now also looks at and attempts to parse additional properties.

## 4.19.1

### Patch Changes

- [`0047d204889`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0047d204889) - Docs are now generated from source.

## 4.19.0

### Minor Changes

- [`ecbb3354125`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ecbb3354125) - This package now uses codegen to generate the rules index and presets. There is no change to the public api with this release.
- [`e00ab4b87d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e00ab4b87d9) - The README and website documentation now contain a generated table with all available rules in the plugin.

## 4.18.0

### Minor Changes

- [`c858ddc70ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c858ddc70ff) - Add deprecated-imports entries to config that the rule no-deprecated-imports can read from.

## 4.17.1

### Patch Changes

- [`fd4bdeabac4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd4bdeabac4) - ensure-design-token-usage: Fixes various false positives including linting of variable declarations, type definitions, switch cases and if statements

## 4.17.0

### Minor Changes

- [`c80505045f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c80505045f0) - Added new rule to encourage use of @atlaskit/primitives components where relavant. Currently disabled by default, so there should be no expected change to consumers.

## 4.16.5

### Patch Changes

- [`c82e6ef389c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c82e6ef389c) - Fix bug when replacing shorthand css property values with tokens, values without corresponding token won't be replaced. Also, allow styled2 alias to be matched in object styles for the spacing rule, given Jira frontend uses that alias extensively

## 4.16.4

### Patch Changes

- [`358730833d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/358730833d8) - Add overrides in @atlaskit/drawer to deprecated config

## 4.16.3

### Patch Changes

- [`ed34264c827`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ed34264c827) - Fix errors on tagged template literals for eslint rule ensure-design-token-usage-spacing and handle edgecases ensuring seamless fallback on errors

## 4.16.2

### Patch Changes

- [`3db6efeac0d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3db6efeac0d) - Improves internal configuration of spacing tokens rule.

## 4.16.1

### Patch Changes

- [`29648ace573`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29648ace573) - Additional selector for ObjectExpression improves coverage of eslint rule.

## 4.16.0

### Minor Changes

- [`efadee8e999`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efadee8e999) - Update no-deprecated-apis ESlint rule to accept configurations

## 4.15.6

### Patch Changes

- [`6a43a780a85`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a43a780a85) - Enhance token replacement capabilities of ensure-design-tokens-usage-spacing rule in tagged template literal strings

## 4.15.5

### Patch Changes

- [`dda18b361da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dda18b361da) - Bump version of `eslint-codemod-utils`.

## 4.15.4

### Patch Changes

- [`ada57c0423d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ada57c0423d) - Add lint rule to prevent use of `margin` CSS property.

## 4.15.3

### Patch Changes

- [`965e9c7f5d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/965e9c7f5d7) - Fix spacing token autofix in tagged template literal styles, enabling replacement of expression to equivalent spacing tokens

## 4.15.2

### Patch Changes

- [`cf16d8f8bcc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf16d8f8bcc) - Removes usage of tokens which have been removed from the codebase
- Updated dependencies

## 4.15.1

### Patch Changes

- [`18aeca8c199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18aeca8c199) - Internal change to update token references. There is no expected behaviour or visual change.

## 4.15.0

### Minor Changes

- [`17b3c102180`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17b3c102180) - ensure-design-token-usage-spacing only lints on spacing properties by default, with typography properties enabled via config

## 4.14.1

### Patch Changes

- [`03697c65399`](https://bitbucket.org/atlassian/atlassian-frontend/commits/03697c65399) - Improved handling of font-family properties.

## 4.14.0

### Minor Changes

- [`be1ec01a101`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be1ec01a101) - Added another valid callee `getTokenValue()` which is used for getting the current computed CSS value for the resulting CSS Custom Property, hard-coded colors that wrapped in `getTokenValue()` call won't fail.

## 4.13.10

### Patch Changes

- [`00c057bdd71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00c057bdd71) - Removes spacing-raw & typography-raw entrypoints in favor of tokens-raw
- Updated dependencies

## 4.13.9

### Patch Changes

- Updated dependencies

## 4.13.8

### Patch Changes

- [`f4c5d7db7aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4c5d7db7aa) - Updates fix for `ensure-design-token-usage-spacing` to ensure fixes are not applied erroneously.

## 4.13.7

### Patch Changes

- [`41ac6cadd32`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41ac6cadd32) - Adds support to the ensure-design-token-usage-spacing rule for replacing typography values with tokens

## 4.13.6

### Patch Changes

- [`0518a6ab41d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0518a6ab41d) - Changes behavior of `ensure-design-token-usage-spacing` to fallback to px instead of rems when a fix is applied.

## 4.13.5

### Patch Changes

- [`fd903efd5f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd903efd5f8) - Dependency bump of `eslint-codemod-utils`.

## 4.13.4

### Patch Changes

- Updated dependencies

## 4.13.3

### Patch Changes

- [`4793b01cfcc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4793b01cfcc) - Add an optional `customTokens` configuration option for no-unsafe-design-token-usage

## 4.13.2

### Patch Changes

- [`1a7a2c87797`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a7a2c87797) - @atlaskit/eslint-plugin-design-system now maps values to rem based tokens

## 4.13.1

### Patch Changes

- [`cc76eda3bc0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cc76eda3bc0) - Add support for template literals in ensure-design-token-usage-spacing

## 4.13.0

### Minor Changes

- [`9693f6e7816`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9693f6e7816) - [ux] Adds a new case to the no-unsafe-design-token-usage rule to lint against uses of 'experimental' tokens and automatically replace them with their replacement (either a token or a fallback) via a fixer.

## 4.12.4

### Patch Changes

- [`bc989043572`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc989043572) - Internal changes to apply spacing tokens. This should be a no-op change.

## 4.12.3

### Patch Changes

- [`9de88fa1e1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9de88fa1e1e) - Internal changes to include spacing tokens in component implementations.

## 4.12.2

### Patch Changes

- [`c6b748ff03a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6b748ff03a) - Small tweak to the ensure-design-token-usage-spacing rule to ensure we aren't over-eager in auto-fixing code with highly experimental tokens.

## 4.12.1

### Patch Changes

- [`e86c57a4a60`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e86c57a4a60) - Improves the `no-raw-spacing-values` rule to include an autofixer. Spacing values that can be resolved to a token will be.

## 4.12.0

### Minor Changes

- [`109c705cd9c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c705cd9c) - [ux] Adds a new case to the no-unsafe-design-token-usage rule to lint against uses of 'experimental' tokens and automatically replace them with their replacement (either a token or a fallback) via a fixer.

## 4.11.2

### Patch Changes

- [`3ee63238f49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ee63238f49) - Update internals of Box, Text, Inline and Stack to handle `children` more accurately.
  Also update scope of `use-primitives` to suggest Box and Text more selectively.

## 4.11.1

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 4.11.0

### Minor Changes

- [`268f92124e2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/268f92124e2) - Bolster isException logic to support descendants of excepted functions and to be case-agnostic

## 4.10.1

### Patch Changes

- [`d76851b2f42`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d76851b2f42) - Improved NaN handling and output
- [`0544fe823d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0544fe823d1) - Updates to account for nested unary selectors.
- [`1ed3db0c9be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1ed3db0c9be) - Improvements to lint rule and accounting for edge cases

## 4.10.0

### Minor Changes

- [`bb808f9a186`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bb808f9a186) - Add exceptions option to ensure-design-token-usage rule

## 4.9.0

### Minor Changes

- [`9701bf4a8b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9701bf4a8b3) - Fix false positives for variable names and object property keys

## 4.8.2

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 4.8.1

### Patch Changes

- [`805d0fde0fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/805d0fde0fa) - Bump eslint-codemod-utils to 1.4.0, no real changes as no new imports are exercised

## 4.8.0

### Minor Changes

- [`725f5fde8d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/725f5fde8d9) - Adds a rule to restrict usage of deprecated attribute `type` for inline-message

## 4.7.2

### Patch Changes

- [`9f64ab9d5ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f64ab9d5ea) - Improvements / added robustness to edge cases previously unhandled.
- [`8e848e3a4a6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e848e3a4a6) - Internal updates to a number of rules. Introduced a custom formatter for the rule 'no-raw-spacing-values'.
- [`31494c13aaa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31494c13aaa) - Type fixes to the internals of a number of rules.

## 4.7.1

### Patch Changes

- [`37ac5652977`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37ac5652977) - Mark `isOpen` and `innerRef` props on @atlaskit/banner as deprecated.

## 4.7.0

### Minor Changes

- [`740057653f9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/740057653f9) - Adds additional rule to restrict usage of banned imports from the design system.

## 4.6.0

### Minor Changes

- [`f561f58bc7a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f561f58bc7a) - Introduces a new rule `icon-label` to validate accessible usage of the icon components label prop when used with other design system components.

## 4.5.0

### Minor Changes

- [`b7235858f48`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7235858f48) - Add new paths to the no-deprecated-imports rule for deprecated @atlaskit/logo exports.

## 4.4.6

### Patch Changes

- Updated dependencies

## 4.4.5

### Patch Changes

- [`344784eec9e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/344784eec9e) - Fix linting error message for focusRing import

## 4.4.4

### Patch Changes

- [`55a212b8b01`](https://bitbucket.org/atlassian/atlassian-frontend/commits/55a212b8b01) - Adds an additional rule for DS users to opt into to using 'noop' as a common reference rather than rewriting anonymous functions.

## 4.4.3

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 4.4.2

### Patch Changes

- [`b3e5a62a9e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3e5a62a9e3) - Adds `static` techstack to package, enforcing stricter style linting. In this case the package already satisfied this requirement so there have been no changes to styles.
- Updated dependencies

## 4.4.1

### Patch Changes

- [`236e6040fb9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/236e6040fb9) - Fixes a bug in the rule `ensure-design-token-usage` where some color value types were not being detected as hardcoded color usage. This affected Styled Components and Emotion CSS prop syntaxes.

  These color types have been fixed:

  - rgb
  - rgba
  - hsl
  - hsla
  - lch
  - lab
  - color()

## 4.4.0

### Minor Changes

- [`1065b5b1bbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1065b5b1bbb) - Fixed bug where deleted '[default]' tokens were not being detected by lint tooling

### Patch Changes

- Updated dependencies

## 4.3.0

### Minor Changes

- [`2dbc546f748`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2dbc546f748) - Fixes a bug where token paths including [default] were not being detected by the linter

### Patch Changes

- Updated dependencies

## 4.2.1

### Patch Changes

- [`63a22b17621`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63a22b17621) - Fixes a bug where use of qualified type annotations would throw an error.

## 4.2.0

### Minor Changes

- [`afc248d2ded`](https://bitbucket.org/atlassian/atlassian-frontend/commits/afc248d2ded) - Adds a new rule, `use-visually-hidden` to complement the `@atlaskit/visually-hidden` component.
- [`0c0a8b5dff4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c0a8b5dff4) - Adds an additional rule 'no-deprecated-api-usage'. This rule targets APIs/props in the Design System that we intend to remove completely. This rule should be used by all product repos as it will provide an early warning of expected deprecations.
- [`93d6f8856f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93d6f8856f2) - @atlaskit/icon-priority has been deprecated due to low usage. It will be deleted after 21 April 2022. If you rely on these icons, @atlaskit/icon-priority will still be available as a deprecated package on NPM, but we recommend self-hosting and managing.

## 4.1.1

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - The no-unsafe-design-token-usage eslint rule now respects the new token naming conventions when auto-fixing by correctly formatting token ids.
- Updated dependencies

## 4.1.0

### Minor Changes

- [`52fbe80eeb5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/52fbe80eeb5) - Moved logic for detecting deprecated tokens out of no-unsafe-design-token-usage and moves it into a new rule: no-deprecated-token-usage. This rule is solely reponsible for catching usage of deprecated tokens. In most cases this allows consumers to set this rule to "warn", allowing iterative migration to new token names rather than in a big bang.

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- [`7da1a30902a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7da1a30902a) - Adds missing meta to `ensure-design-token-usage` rule.

## 4.0.0

### Major Changes

- [`a2f953f3814`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2f953f3814) - Previously the `ensure-design-token-usage` eslint rule contained all checks relating to token use. This has now been split up into two separate rules:

  `ensure-design-token-usage` now covers:

  - `legacyElevation` — warns about old usages of the elevation mixins or styles, which instead should use the `card` or `overlay` tokens.
  - `hardCodedColor` — warns about use of hard-coded colors such as `color: colors.B100`, which instead should be wrapped in a `token()` call. This covers the majority of cases in existing codebases when first adopting tokens.

  `no-unsafe-design-token-usage` (new) covers the remaining rules:

  - `directTokenUsage` — warns against using the CSS Custom Property name that is output in the browser by the `token()` call.
    Eg. directly using `var(--ds-accent-subtleBlue)` is bad.
  - `staticToken` — warns when tokens aren't used inline. Inlining the token usages helps with static analysis, which unlocks future improvements.
    Eg. pulling the token out into a const like `css={ color: token(primaryButtonText) }` is bad.
  - `invalidToken` — warns when using a token that doesn't exist (not one that's been renamed, see the next point).
  - `tokenRenamed` — warns when using a token that's been renamed in a subsequent release.
  - `tokenFallbackEnforced` — warns if a fallback for the token call is not provided.
    Eg. call with the fallback like this `token('color.background.disabled', N10)` instead of `token('color.background.disabled')`.
  - `tokenFallbackRestricted` — the opposite of `tokenFallbackEnforced`.
    Eg. do not pass in a fallback like this `token('color.background.disabled', N10)` and instead only include the token `token('color.background.disabled')`.

  Upgrading — some instances of `\\eslint-disable` may need to be changed to the new rule. If you have failing lint rules after only bumping this package then switch those ignores to use `no-unsafe-design-token-usage` instead.

### Patch Changes

- [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds for this package now pass through a tokens babel plugin, removing runtime invocations of the tokens() function and improving bundle size.
- [`26719f5b7b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/26719f5b7b0) - Update @atlaskit tokens dependency from a devDependency to a regular dependency
- [`a66711cd58c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a66711cd58c) - Remove `@atlaskit/tokens` from peer dependency.
- Updated dependencies

## 3.2.0

### Minor Changes

- [`2af46de94ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2af46de94ba) - Adds additional rule to design system eslint plugin; no-deprecated-imports.

## 3.1.0

### Minor Changes

- [`784f2560e9b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/784f2560e9b) - Includes additional rule in the recommended ruleset to restrict imports on older deprecated components.

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [`b6a55ffa092`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6a55ffa092) - Introduces fixes for various edge-cases and false positives:

  - Objects that are not considered "style blocks" are now ignored. Style blocks are considered as objects assigned to variables with names containing either "style", "css", or "theme" and type annotations including "CSSProperties" or "CSSObject".
  - Hexadecimal colors using the `0x` notation are now ignored

  Increasing the linting surface-area:

  - Colors used in shorthand css property values will now be linted against. (ie `border: solid 1px red`)
  - Strings passed directly into JSX attributes (props) are now linted (ie `<Button color="red" />`)

  General improvements:

  - Color names will now only match against "whole" words. Meaning strings that inadvertently include color names like the "tan" in "standard" will no longer fail.

  - Template literal styles are now linted against property values only. Meaning css property names that include colors like `white-space: nowrap` used in template literals will no longer error

  - Increased test coverage

- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [`ac7a0fd6558`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac7a0fd6558) - You can now configure whether fallbacks are enforced or restricted when using tokens. Fallbacks are now restricted by default.

### Patch Changes

- Updated dependencies

## 1.0.0

### Minor Changes

- [`6cc9dc02de1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6cc9dc02de1) - Adds token renaming rule (with autofix) to ensure-design-token-usage

### Patch Changes

- Updated dependencies

## 0.0.6

### Patch Changes

- [`297928490b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/297928490b8) - Fixes false negative reports for named legacy colors.
- [`c9d8cc07750`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9d8cc07750) - Converts internal code to TypeScript.
- [`8eea79b8ebc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8eea79b8ebc) - Update the function of checking if a node is a legacy elevation.
- [`7da605ccafe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7da605ccafe) - Adds suggestions for incorrect usages of color and tokens
- [`f875eb3f5cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f875eb3f5cf) - Will only error against hardcoded colors (Identifiers) that are assigned to an object property
- Updated dependencies

## 0.0.5

### Patch Changes

- [`e11b3e4e1ee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e11b3e4e1ee) - Restructures tokens into the following format {group}{property}{variant}{state}
- Updated dependencies

## 0.0.4

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

- Updated dependencies

## 0.0.3

### Patch Changes

- [`ade8d954aa5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ade8d954aa5) - Out of the box configs have been removed until stable release.
- [`f2a0a48903d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f2a0a48903d) - Errors no longer show up on import declarations.
- [`b71d3cd3d2f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b71d3cd3d2f) - Internal artefacts no longer make their way to npm.

## 0.0.2

### Patch Changes

- [`769ea83469c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/769ea83469c) - Moves tokens and eslint-plugin-design-system to the public namespace.
- Updated dependencies

## 0.0.1

### Patch Changes

- [`c5ae5c84d47`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c5ae5c84d47) - Initial commit.
- Updated dependencies
