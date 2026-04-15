# @atlaskit/editor-smart-link-draggable

## 0.5.0

### Minor Changes

- [`e643f1adf62c9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e643f1adf62c9) -
  Add isChangeboardTarget prop to SmartLinkDraggable. When true, renders
  data-spotlight-target="smart-link-draggable-changeboard" on the inline card wrapper element,
  enabling consumers to anchor to a specific smart link in the editor DOM.

## 0.4.3

### Patch Changes

- Updated dependencies

## 0.4.2

### Patch Changes

- Updated dependencies

## 0.4.1

### Patch Changes

- Updated dependencies

## 0.4.0

### Minor Changes

- [`58bf406b50581`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/58bf406b50581) -
  Remove SmartLinkDraggableChangeboardPopover - changeboarding now handled via Post Office

## 0.3.1

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [`2b758d3bf02a5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2b758d3bf02a5) -
  Fix inline smart link drag registration so cards can be dragged into the content tree without
  breaking in-editor drag and drop.

## 0.2.2

### Patch Changes

- [`4ed1779bfe87a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4ed1779bfe87a) -
  Add ak-postbuild script to include GIF assets in package distribution
- Updated dependencies

## 0.2.1

### Patch Changes

- [`2116707c51d9b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2116707c51d9b) -
  [ux] Add SmartLinkDraggable wrapping to BlockCard and EmbedCard. Add stopEvent to prevent
  ProseMirror from intercepting drag events on smart-element-link. Remove double feature gating in
  inlineCard.

## 0.2.0

### Minor Changes

- [`8b0c77d86d97f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8b0c77d86d97f) - -
  Created SmartLinkDraggableChangeboardPopover component
  - Define i18n message text in editor-common
  - Added skeleton code to SmartLinkDraggableInner component to easily incorportate new
    changeboarding

### Patch Changes

- Updated dependencies

## 0.1.4

### Patch Changes

- [`3d428e4d1167c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3d428e4d1167c) -
  [ux] All inline smart card branches are wrapped with draggable (from pragmatic-drag-and-drop). The
  draggable logic has been improved to have better native support.
- Updated dependencies

## 0.1.3

### Patch Changes

- [`c7f3222502ba2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c7f3222502ba2) -
  [ux] Fix inline cards rendering without titles by replacing Box wrapper with a plain <span> to
  avoid CSS insertion-order conflicts.

## 0.1.2

### Patch Changes

- [`37535da8b722e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/37535da8b722e) -
  Fix typo in export name: SMART_LINK_APPERANCE → SMART_LINK_APPEARANCE

## 0.1.1

### Patch Changes

- [`1d6c102310afb`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1d6c102310afb) -
  [ux] Use editor-smart-link-draggable package ti implement React-based drag preview, and design
  system compliance. Updated editor-plugin-card to reference the new package.
