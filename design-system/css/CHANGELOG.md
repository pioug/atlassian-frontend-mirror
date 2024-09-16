# @atlaskit/css

## 0.5.0

### Minor Changes

- [#138792](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138792)
  [`59c6812e1be91`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/59c6812e1be91) -
  Update the @atlaskit/css schema to include:

  - `border` and `font` shorthand token values
  - Background and color `-hovered` and `-pressed` tokens are available in the non-psuedo-states for
    patterns like `<div css={[isHovered && hoveredStyles]} />`
  - Adds more commonly used media queries

### Patch Changes

- Updated dependencies

## 0.4.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [#108386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108386)
  [`8f3fa9e80b93c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f3fa9e80b93c) -
  Updated xl breakpoint to be 1768px instead of 1760px (110.5rem instead of 110rem) to match updated
  design guidance.

## 0.2.0

### Minor Changes

- [#111878](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111878)
  [`223959ef57c80`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/223959ef57c80) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

## 0.1.1

### Patch Changes

- [#107116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/107116)
  [`9a038f5d3834`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9a038f5d3834) -
  Upgrade dependency @compiled/react to latest version

## 0.1.0

### Minor Changes

- [#90242](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/90242)
  [`aff0087405c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/aff0087405c1) -
  Add support for React 18 in non-strict mode.

## 0.0.6

### Patch Changes

- [#89540](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/89540)
  [`1748b673d90d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1748b673d90d) -
  DSP-17890 Add media query types to createStrictAPI, just be aware that cascading media queries are
  not guaranteed to work with Compiled, refer to
  https://compiledcssinjs.com/docs/atomic-css#selector-specificity

## 0.0.5

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 0.0.4

### Patch Changes

- [#80571](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80571)
  [`fafdb1dcce96`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fafdb1dcce96) -
  Fix bugs in strict CSS typedef.
- [#79686](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/79686)
  [`7dc7cf06a8b9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7dc7cf06a8b9) -
  Bump @compiled/react to v0.17.0

## 0.0.3

### Patch Changes

- [#62648](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62648)
  [`1902f30344b5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1902f30344b5) -
  Add a `StrictXCSSProp` to clarify the loose vs. strict implementation.

## 0.0.2

### Patch Changes

- [#63504](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63504)
  [`a48de33c8536`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a48de33c8536) -
  Uses codegen'd token schema type definition from the tokens package
- Updated dependencies

## 0.0.1

### Patch Changes

- [#58767](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58767)
  [`6a6dbc5197e8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6a6dbc5197e8) -
  Initial commit.
