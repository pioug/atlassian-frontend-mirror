# @atlaskit/tokens

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
