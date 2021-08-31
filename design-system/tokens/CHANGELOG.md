# @atlaskit/tokens

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
