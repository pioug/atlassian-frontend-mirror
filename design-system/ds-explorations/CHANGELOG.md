# @atlaskit/ds-explorations

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
