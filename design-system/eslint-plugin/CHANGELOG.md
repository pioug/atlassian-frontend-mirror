# @atlaskit/eslint-plugin-design-system

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
