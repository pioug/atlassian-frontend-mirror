# @atlaskit/ds-explorations

## 2.2.6

### Patch Changes

- [`27f6081edf2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27f6081edf2) - Regenerates codegen hashes to surface changes to tokens

## 2.2.5

### Patch Changes

- [`7c1c449eb96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c1c449eb96) - Updated space token descriptions.

## 2.2.4

### Patch Changes

- [`267a88221e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/267a88221e8) - Internal change to update codegen.

## 2.2.3

### Patch Changes

- [`55be182b904`](https://bitbucket.org/atlassian/atlassian-frontend/commits/55be182b904) - Regenerates codegen'd artifacts as a result of introducting new design tokens.
- Updated dependencies

## 2.2.2

### Patch Changes

- [`79e94411a9c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79e94411a9c) - Bump to account for regeneration of tokens artifacts.
- Updated dependencies

## 2.2.1

### Patch Changes

- [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies

## 2.2.0

### Minor Changes

- [`78a3f27cc3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/78a3f27cc3a) - Regenerate style maps based on token updates.

### Patch Changes

- Updated dependencies

## 2.1.2

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 2.1.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 2.1.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 2.0.13

### Patch Changes

- [`1aa8720a4ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1aa8720a4ff) - Internal refactor.

## 2.0.12

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils

## 2.0.11

### Patch Changes

- [`a02eed2974e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a02eed2974e) - Move codegen into @atlassian scope to publish it to private registry

## 2.0.10

### Patch Changes

- [`9fb52345e8d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fb52345e8d) - Update some examples to use Inline and Stack from `@atlaskit/primitives`.

## 2.0.9

### Patch Changes

- [`261420360ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/261420360ec) - Upgrades component types to support React 18.

## 2.0.8

### Patch Changes

- [`6ce08fbcba2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ce08fbcba2) - [ux] Fixed a bug where the `<Box>` `justifyContent` prop was mistakenly applying `alignItems` for `start` and `end` values

## 2.0.7

### Patch Changes

- [`66493433ce9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/66493433ce9) - Removes temporary, internal-only unsafe exports as they now live in @atlaskit/primitives/responsive.

## 2.0.6

### Patch Changes

- [`4b219ed17bf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b219ed17bf) - Breakpoint constants added to be used in responsive spikes initially

## 2.0.5

### Patch Changes

- [`a70970a5aab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a70970a5aab) - Mark Box, Inline, and Stack as deprecated, planned for future removal.

## 2.0.4

### Patch Changes

- [`7f5f23dcb68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f5f23dcb68) - Introduce shape tokens to some packages.

## 2.0.3

### Patch Changes

- [`069494fbea6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/069494fbea6) - Internal change. There is no behaviour or visual change.
- Updated dependencies

## 2.0.2

### Patch Changes

- [`cf16d8f8bcc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf16d8f8bcc) - Removes usage of tokens which have been removed from the codebase
- Updated dependencies

## 2.0.1

### Patch Changes

- [`290b1f069bd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/290b1f069bd) - Regenerate codegen styles

## 2.0.0

### Major Changes

- [`544c409d79f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/544c409d79f) - **Breaking Change**

  ### `Text`

  fontSize, fontWeight, and lineHeight APIs have changed due to typography tokens being introduced. The new values for fontSize and lineHeight follow a scale whereas fontWeight accepts keyword values.

  ### `Box`

  `padding`, `paddingBlock`, and `paddingInline` prop values now follow the pattern `space.x` instead of `scale.x` to align with spacing tokens.

  ### `Inline` and `Stack`

  `gap` prop values now follow the pattern `space.x` instead of `scale.x` to align with spacing tokens.

## 1.7.0

### Minor Changes

- [`642298a54dc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/642298a54dc) - Box - Allow `display` prop to take `inline-block`.

## 1.6.4

### Patch Changes

- [`1e46e236f6f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e46e236f6f) - This changeset exists because a PR touches these packages in a way that doesn't require a release

## 1.6.3

### Patch Changes

- [`00c057bdd71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00c057bdd71) - Removes spacing-raw & typography-raw entrypoints in favor of tokens-raw
- Updated dependencies

## 1.6.2

### Patch Changes

- Updated dependencies

## 1.6.1

### Patch Changes

- [`f7b2dbd6eba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7b2dbd6eba) - Add fontWeight 600 to Text. Add justifyContent spaceBetween to Inline. Add overflow hidden, position fixed, and start/end flex values to Box. Add shadow and layer props to Box.

## 1.6.0

### Minor Changes

- [`9f9498aafb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f9498aafb1) - [ux] Box API introduces `hidden` for `overflow` prop.

## 1.5.0

### Minor Changes

- [`c146611a18c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c146611a18c) - [ux] Migrate progress-indicator package to use spacing primitives to control spacing in both component and examples. Spacing values have been slightly updated depending on indicator size and spacing properties

## 1.4.0

### Minor Changes

- [`7f886c0aa18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f886c0aa18) - The `Inline` component now allows children to be justified 'space-between'.

## 1.3.2

### Patch Changes

- [`f824dcfff6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f824dcfff6e) - Internal changes to satisfy various lint warnings & errors

## 1.3.1

### Patch Changes

- [`04f01205c6b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04f01205c6b) - Applies rem instead of pixels as spacing tokens fallbacks. This should have no visual or behavioural change.

## 1.3.0

### Minor Changes

- [`7d6e345cd63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d6e345cd63) - Bump to account for bump in `@atlaskit/tokens`.

## 1.2.2

### Patch Changes

- [`1dec7b39f7b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1dec7b39f7b) - - Children are only iterated over when divider prop is passed. There should be no behaviour change.
  - Add `user-select: none;` to divider.

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [`e6fb7598867`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6fb7598867) - Exposes additional public entrypoints for `Inline` and `Stack`.
  Loosens the types of `children` for the `Inline`, `Stack` and `Box` as it was causing unexpected friction.

## 1.1.0

### Minor Changes

- [`93d75a4e289`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93d75a4e289) - Adding id prop for Text component so that element can be updated with id attribute. It's a way for an element to be uniquely identifiable for a range of reasons. For example: URL anchors, reference target for integrations and accessible label references.

## 1.0.0

### Major Changes

- [`30c6ec5a76f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30c6ec5a76f) - **Breaking Change**

  The package has been moved to a v1 state. It is no less or more stable (see readme for more information) however this update is to ensure that the consumption of minor versions for the package in downstream dependencies is correctly resolved.

  This update also includes changes to the way the `Text` component behaves with `Box`:

  - Text will now remove redundant DOM elements if it detects that it is already in the context of a `Text` element. This will only occur if the Text element that is a candidate for removal does not apply any custom property.
  - Text will also try to apply a color that is accessible if no user choice has been provided and the background of the surface causes an accessibility failure.

### Minor Changes

- [`664d3fe6586`](https://bitbucket.org/atlassian/atlassian-frontend/commits/664d3fe6586) - Use spacing tokens for all spacing-related props. Remove old SPACING_SCALE and GlobalSpacingToken.

### Patch Changes

- [`f5ae2702e35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5ae2702e35) - Box component now infers HTML attribute props from `as` prop.
- [`7c6009de2f1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c6009de2f1) - [ux] Updates the visual appearance to match the legacy light mode palette.

## 0.1.5

### Patch Changes

- [`7014fd08976`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7014fd08976) - [ux] Inline gap prop now internally sets column-gap; Stack gap prop now internally sets row-gap
- [`ba660f4f76f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba660f4f76f) - Add `start` and `end` values to Stack and Inline flex properties.
- [`3ee63238f49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ee63238f49) - Update internals of Box, Text, Inline and Stack to handle `children` more accurately.
  Also update scope of `use-primitives` to suggest Box and Text more selectively.
- [`9dec0fe6946`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dec0fe6946) - Add overflow prop to Box.
- [`7a9e73ec430`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a9e73ec430) - [ux] Internal changes to how styles are represented in SectionMessage. Some minor visual changes to the color and spacing of SectionMessage. No changes to the SectionMessage API.

## 0.1.4

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 0.1.3

### Patch Changes

- [`d6328e5e1ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6328e5e1ec) - Removes the default values for `<Text />`.

## 0.1.2

### Patch Changes

- [`37246e87cfc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37246e87cfc) - Adds position static to Box.
  Changes lozenge to use position static instead of relative.
- [`09c2fef4837`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09c2fef4837) - Introduces a `className` to `Box`.
- [`862d3b09b49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/862d3b09b49) - Add `shouldTruncate` prop to Text to enable truncating text with an ellipsis. Defaults to false.
- [`def8e951547`](https://bitbucket.org/atlassian/atlassian-frontend/commits/def8e951547) - Drop href from Text. Reduce `as` options available for Text to account only for the most basic HTML elements that typically contain text.
- [`22198a90b65`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22198a90b65) - Add textTransform prop, verticalAlign prop, and fontWeight '700' option to Text component. Changed fontSize prop options to include 'px' unit. Add default 'border-box' box-sizing to Text. Export BoxProps, TextProps, and SPACING_SCALE.

## 0.1.1

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 0.1.0

### Minor Changes

- [`57b94585c64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/57b94585c64) - Breaking change to the color props which now require a fallback. Generated colors now also include additional background color types.
- [`57c59a5c2d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c59a5c2d2) - Initial implementation of UNSAFE_Box

### Patch Changes

- [`72c111790cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/72c111790cf) - [ux] Refine implementation of Text primitive
- [`c28d7c86875`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c28d7c86875) - Add base interface to primitives in ds-explorations.
- [`e11b4abd515`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e11b4abd515) - Adds initial implementation of Inline and Stack. Adds "block" option to Box `display` prop. Removes "baseline" option from Box `justifyContent` prop. Removes `gap` prop from Box.
- [`0dbb4833163`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0dbb4833163) - Exports primitives components. Adds basic line-height values to Text.
- [`ea36ea17c4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ea36ea17c4e) - Text now supports text-align and it's used for Badge to retain existing visuals

## 0.0.3

### Patch Changes

- [`40151c42d7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/40151c42d7d) - Update background, text and icon disabled colors to use alpha base tokens

## 0.0.2

### Patch Changes

- [`232b2b765b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/232b2b765b9) - Internal changes to the way styles are created for the `Box` and `Text` components. Both components now use a wrapper over the `af/codegen`'s expected API to generate styles and types from the tokens package.
- [`29b8b26ee79`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29b8b26ee79) - Updates Box, Text to include partial implementations to spike and experiment with different usages.

## 0.0.1

### Patch Changes

- [`f7edb043597`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7edb043597) - Initial release, no API exposed.
