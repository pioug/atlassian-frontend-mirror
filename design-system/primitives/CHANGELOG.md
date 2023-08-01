# @atlaskit/primitives

## 1.0.8

### Patch Changes

- [`8986cf1ed16`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8986cf1ed16) - Reverts a change that allowed className to be applied to Box.

## 1.0.7

### Patch Changes

- [`6070ef412be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6070ef412be) - Box now accepts any HTML element for its `as` prop. Fixed issue where types may be incorrect depending on element used for the `as` prop.

## 1.0.6

### Patch Changes

- [`aa8ec75ace3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa8ec75ace3) - Simplify types for `Show` and `Hide` components. There should be no difference in behavior.

## 1.0.5

### Patch Changes

- [`3fadbb8bf73`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fadbb8bf73) - Internal changes.

## 1.0.4

### Patch Changes

- [`74f7af9882b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/74f7af9882b) - [ux] correct fallback color of token color.border.focused to meet contrast requirement

## 1.0.3

### Patch Changes

- [`298df94426c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/298df94426c) - Regenerates codegen'd artifacts as a result of introducting new brand background design tokens.
- Updated dependencies

## 1.0.2

### Patch Changes

- [`45ff2cd234f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45ff2cd234f) - Fixes missing type in `Flex` component, adds `Grid` component.

## 1.0.1

### Patch Changes

- [`cac98ccfb7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cac98ccfb7d) - Introduces Flex component as common component for Stack, Inline.

## 1.0.0

### Major Changes

- [`fec62731e2e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fec62731e2e) - This package is now in open beta and is no longer considered experimental. We will be making iterative improvements until GA. While the API is likely to be stable, we reserve the right to make changes if required. This version contains no changes whatsoever.

  P.S. The reason for the change is to aid package deduplication in the product.

## 0.16.0

### Minor Changes

- [`fe3ef707163`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe3ef707163) - Initial Pressable primitive (not ready for production)

## 0.15.3

### Patch Changes

- [`27f6081edf2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27f6081edf2) - Regenerates codegen hashes to surface changes to tokens

## 0.15.2

### Patch Changes

- [`ab4938b0c32`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab4938b0c32) - Remove runtime dev warning for invalid token aliases.

## 0.15.1

### Patch Changes

- [`7c1c449eb96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c1c449eb96) - Updated space token descriptions.

## 0.15.0

### Minor Changes

- [`8b04f3e78bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b04f3e78bd) - Adds basic `<Show>` and `<Hide>` responsive primitive components to make consistent, composable UIs without writing a dozen lines for just one `display: none` css rule.

  Additionally:

  - Adds some further examples, tests, and VRs.
  - Tweaks some internals around building these reusable media query maps.

## 0.14.3

### Patch Changes

- [`4c026f170d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c026f170d6) - Remove warnings for non-token values passed to xCSS in non-development environments.

## 0.14.2

### Patch Changes

- [`267a88221e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/267a88221e8) - Internal change to update codegen.

## 0.14.1

### Patch Changes

- [`d79b6172a93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d79b6172a93) - Add documentation for responsive xcss.

## 0.14.0

### Minor Changes

- [`5af07899f5b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5af07899f5b) - Loosens types to better reflect `xcss` API.

## 0.13.0

### Minor Changes

- [`455677dbd4c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/455677dbd4c) - - Documents the responsive media helpers into an Alpha state.
  - BREAKING: Removes the `xxl` breakpoint from all media queries (should be unused).
  - Adds a new `media` export without `media.below` intentionally omitted. Should be unused externally, but used internally and still available via the existing `UNSAFE_media` export.
  - Changes the underlying media queries to be a bit safer against unexpected overlap. This changes the breakpoints ever-so-slightly, but given browsers round fractional rems, it's impractical that this will have any unintended impact—if anything, it may fix a bug.

## 0.12.6

### Patch Changes

- [`3be327cdd6a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3be327cdd6a) - Allow styles to be applied to Inline through xcss.

## 0.12.5

### Patch Changes

- [`55be182b904`](https://bitbucket.org/atlassian/atlassian-frontend/commits/55be182b904) - Regenerates codegen'd artifacts as a result of introducting new design tokens.
- Updated dependencies

## 0.12.4

### Patch Changes

- [`b2706220d22`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2706220d22) - Adds an experimental `UNSAFE_useMediaQuery` hook to utilize our media query breakpoints in JavaScript. This is not SSR-safe and will return `null` or perhaps incorrectly depending on your SSR environment.

## 0.12.3

### Patch Changes

- [`79e94411a9c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79e94411a9c) - Bump to account for regeneration of tokens artifacts.
- Updated dependencies

## 0.12.2

### Patch Changes

- [`e278a3b0ea9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e278a3b0ea9) - Allow loose auto completion and less strict types for some xcss properties.

## 0.12.1

### Patch Changes

- [`3f273cdd54f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f273cdd54f) - Allow for an Inline list item.

## 0.12.0

### Minor Changes

- [`407853b7b26`](https://bitbucket.org/atlassian/atlassian-frontend/commits/407853b7b26) - Inline now has a new default value for the `alignBlock` prop: `start` - the previous default, `stretch`, is now an option that can be set explicitly as well.

## 0.11.0

### Minor Changes

- [`8bd6dc6027f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8bd6dc6027f) - Box backgroundColor prop now accepts full token names, abbreviated forms will no longer work. xCSS now accepts full token names, abbreviated forms will no longer work.

## 0.10.1

### Patch Changes

- [`b6302963111`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6302963111) - Change border.radius.normal to be 3px instead of 4px.
  `display: grid` is now accepted for `xcss`.

## 0.10.0

### Minor Changes

- [`313d71fce9c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/313d71fce9c) - Allow media queries at predefined breakpoints to be applied through xCSS.

## 0.9.5

### Patch Changes

- [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies

## 0.9.4

### Patch Changes

- [`b19d5c53b64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b19d5c53b64) - Internal changest to the primitives package related to token generated styles.
- [`4c4dcc3d571`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c4dcc3d571) - Updates primitives internal style map.
- Updated dependencies

## 0.9.3

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8
- [`e06d56c5a3d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e06d56c5a3d) - Adds type hinting for `fill` CSS property.

## 0.9.2

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 0.9.1

### Patch Changes

- [`5a9e73494eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a9e73494eb) - Updates to internal documentation.

## 0.9.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 0.8.9

### Patch Changes

- [`da1727baf77`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da1727baf77) - Allow non tokenised values to be passed through for tokenisable properties like `padding`. Adds type hinting for zIndex CSS property.

## 0.8.8

### Patch Changes

- [`5a134a5128a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a134a5128a) - Adds type hinting for boxShadow CSS property. Fixes bug with token to CSS custom property transformation for gap, rowGap, columnGap.

## 0.8.7

### Patch Changes

- [`bad2da77917`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bad2da77917) - The Box primitive now accepts more elements for the 'as' prop

## 0.8.6

### Patch Changes

- [`b5b26f3d947`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5b26f3d947) - Bugfix: 'padding' prop no longer takes (incorrect) precedence over any other padding props.

## 0.8.5

### Patch Changes

- [`0969a35c1b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0969a35c1b0) - Allow type hinting for nested styles inside pseudo-selectors.

## 0.8.4

### Patch Changes

- [`7127e85932a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7127e85932a) - Update codegen to explicitly list spacing prop values as string unions for compatibility with extract-react-types.

## 0.8.3

### Patch Changes

- [`64e7c72773e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/64e7c72773e) - Update type to allow typehints for CSS color property.

## 0.8.2

### Patch Changes

- [`983b1e61003`](https://bitbucket.org/atlassian/atlassian-frontend/commits/983b1e61003) - Fix Primitives pages being shown in prod despite being marked as alpha.

## 0.8.1

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils

## 0.8.0

### Minor Changes

- [`ac4c8695d3f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac4c8695d3f) - Constrain CSS values of flex-direction to account for accessibility considerations.
- [`4d19bdd2218`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d19bdd2218) - **Inline**:

  - `space` prop now accepts values in the form `space.XXX`. For example: `space="space.100"`.
  - `rowSpace` prop now accepts values in the form `space.XXX`. For example: `rowSpace="space.100"`.

  **Stack**:

  - `space` prop now accepts values in the form `space.XXX`. For example: `space="space.100"`.

## 0.7.1

### Patch Changes

- [`a02eed2974e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a02eed2974e) - Move codegen into @atlassian scope to publish it to private registry

## 0.7.0

### Minor Changes

- [`7e17a8b8934`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7e17a8b8934) - Box:

  - Add xcss prop to enable token powered styling.

## 0.6.0

### Minor Changes

- [`4d60ec345a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d60ec345a5) - Remove internal/exploratory responsive props available in BaseBox.

## 0.5.0

### Minor Changes

- [`e379d04c74a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e379d04c74a) - Expose a new form of `xcss` that is parameterised so it can be statically bound to the intended usage context.

## 0.4.2

### Patch Changes

- [`fa26963628c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa26963628c) - Removes `customStyles` in favour of `xcss`.

## 0.4.1

### Patch Changes

- [`8e03331eb8b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e03331eb8b) - Introduce 'as' prop to Inline and Stack so the resulting element can be controlled.

## 0.4.0

### Minor Changes

- [`003c381e37d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/003c381e37d) - Apply `width: 100%` to Inline and Stack when `grow` prop is set to `fill`.

## 0.3.3

### Patch Changes

- [`261420360ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/261420360ec) - Upgrades component types to support React 18.

## 0.3.2

### Patch Changes

- [`e7b64da97a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7b64da97a1) - Add `rowSpace` prop to override the `space` prop's spacing between rows.

## 0.3.1

### Patch Changes

- [`114d6a73f72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/114d6a73f72) - Cleanup the experimental responsive box utilizing our responsive helpers.

## 0.3.0

### Minor Changes

- [`7c280fead96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c280fead96) - Add new responsive helpers, breakpoints config, and types into `@atlaskit/primitives/responsive`. Exports are treated as `UNSAFE_` and experimental until modified as they're being worked on in parallel to our Alpha Grid.

## 0.2.2

### Patch Changes

- [`bf90d854748`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bf90d854748) - Internal representation of Box primitive now supports some responsive styles

## 0.2.1

### Patch Changes

- [`5b886634089`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b886634089) - [ux] Change Box to be the default export from `@atlaskit/primitives/box`. Fix the negative value of `margin-inline` in Inline `separator` not being applied properly.

## 0.2.0

### Minor Changes

- [`228cce759e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/228cce759e8) - Create Box component.

## 0.1.1

### Patch Changes

- [`fe50d8cb56c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fe50d8cb56c) - Internal change to add shape tokens to primitives.
- Updated dependencies

## 0.1.0

### Minor Changes

- [`eeb8baa5d74`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eeb8baa5d74) - - Create `Stack` component
  - Create `Inline` component

## 0.0.2

### Patch Changes

- [`069494fbea6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/069494fbea6) - Internal change. There is no behaviour or visual change.
- Updated dependencies

## 0.0.1

### Patch Changes

- [`87074bc6cb3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87074bc6cb3) - Initial release of package scaffold.
