# @atlaskit/ds-explorations

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
