# @atlaskit/editor-shared-styles

## 2.2.2

### Patch Changes

- Updated dependencies

## 2.2.1

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 2.2.0

### Minor Changes

- [`73d9a2fa116`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73d9a2fa116) - ED-15568 Restore table's FloatingContextualMenu, extract utils/UI components

## 2.1.5

### Patch Changes

- [`a6df7e823d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a6df7e823d8) - [ux] Fixed trello card overflow issue in table cells & fixed merged table cells selection / hover state
- Updated dependencies

## 2.1.4

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 2.1.3

### Patch Changes

- [`450a17a332a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/450a17a332a) - [ux] ED-14654: Lower z-index values on editor elements so they do not stick out of the editor and interfere with consuming products
- [`30c74c32783`](https://bitbucket.org/atlassian/atlassian-frontend/commits/30c74c32783) - [ux] ED-15234: reverts ED-14654 because causing header zindex issues

## 2.1.2

### Patch Changes

- [`17480b66f3e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17480b66f3e) - [ux][ed-9943] Fix to have the TypeAhead component appear above the main editor toolbar.
- [`d8b3bc73330`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8b3bc73330) - [ED-14507] Deprecate the allowDynamicTextSizing editor prop and remove all code related to it. This feature has been unused since 2020.

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [`02bfb564e45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02bfb564e45) - [ux] Instrumented `@atlaskit/editor-shared-styles` and partial `@atlaskit/editor-core` with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).
  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

- [`5ab00fca118`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5ab00fca118) - Instrumented `@atlaskit/editor-shared-styles` with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).
  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

## 2.0.1

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 2.0.0

### Major Changes

- [`e22509504e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e22509504e8) - ED-14255 migrate editor-shared-style to emotion

### Patch Changes

- [`9712e78abb0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9712e78abb0) - ED-14255 moved some usages of editor-shared-styles to emotion

## 1.6.0

### Minor Changes

- [`1a07c1caf61`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1a07c1caf61) - CETI-93 - Fixed custom panel icon sizing and alignment when icon render as image

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [`c2c0160f566`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2c0160f566) - Bump editor-shared-styles to pick up relativeFontSizeToBase16

## 1.4.1

### Patch Changes

- [`5c835144ef0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c835144ef0) - [ME-741][me-743] Remove PX references in editor packages and modify code block font size.
- Updated dependencies

## 1.4.0

### Minor Changes

- [`e2fb7440936`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2fb7440936) - ED-12430: Fix issue with Editor showing double scrollbar when context panel is visible.Update context panel to have same height as editor content area when using position absolute styles

## 1.3.0

### Minor Changes

- [`511a91ad376`](https://bitbucket.org/atlassian/atlassian-frontend/commits/511a91ad376) - [ux] ED-12128: Update Context Panel to use set width of 320px and remove 'width' prop.
  Remove 'width' prop from the Context Panel component as we no longer allow dynamic panel width to enforce consistency.

  All references to this component can safely remove the 'wdith' prop as it is no longer part of the component props.

- [`007103b93e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/007103b93e6) - [ux] ED-11993 Change behaviour of context panel so it will not push content if there is enough space to slide out without overlapping.
  Config panel will keep existing behaviour to push content if there isn't enough space to show without overlapping content. Also add width css transition to context panel content to mimic "slide in" animation.

  Add new shared const of `akEditorFullWidthLayoutLineLength` which indicates the line length of a full-width editor

## 1.2.1

### Patch Changes

- [`7d24194b639`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d24194b639) - EDM-1717: Fix Safari danger styles for inline smart links

## 1.2.0

### Minor Changes

- [`0615a2be97`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0615a2be97) - ED-10441: share overflow-shadow helper

## 1.1.7

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 1.1.6

### Patch Changes

- [`d6c23f1886`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6c23f1886) - Added dark mode support to table cell background colors

## 1.1.5

### Patch Changes

- [`7895bfa4f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7895bfa4f3) - [ux] ED-10562 Update selection styles for unsupported content

  Use background colour instead of blanket styling
  Fix an issue on Safari where text inside unsupported content appeared selected when node was selected

## 1.1.4

### Patch Changes

- [`34674fa4cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34674fa4cd) - [ux] ED-10780 removed the threshold that enabled responsive changes

## 1.1.3

### Patch Changes

- [`a2634b5390`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a2634b5390) - [ux] ED-10780 reduced the threshold for responcive toolbar oayout;fixed problem with italic button not working when it is in collapse menu.

## 1.1.2

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [`fbc358206c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fbc358206c) - ED-9125 ED-8837 Export values for selected border and selected box shadow, and util to disable browser text selection
- [`4f217f1d92`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f217f1d92) - ED-10168 Add new package @atlaskit/editor-shared-styles

### Patch Changes

- [`b9812b8b35`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9812b8b35) - ED-10004 improved editor toolbar responsiveness
