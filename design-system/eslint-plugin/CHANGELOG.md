# @atlaskit/eslint-plugin-design-system

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
