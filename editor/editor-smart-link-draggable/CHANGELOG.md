# @atlaskit/editor-smart-link-draggable

## 1.1.3

### Patch Changes

- Updated dependencies

## 1.1.2

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [`cd097a2111788`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cd097a2111788) -
  Republish packages depending on `@atlaskit/react-compiler-gating` so their published dependency
  reference is updated to the renamed `@atlaskit/react-compiler-gating` scope.

  The earlier rename of `@atlassian/react-compiler-gating` to `@atlaskit/react-compiler-gating` only
  bumped the renamed package itself, so dependent packages were never republished and their
  published versions still referenced the old `@atlassian/react-compiler-gating` name, which is not
  available in the public npm registry. This minor bump republishes all affected packages with the
  corrected dependency.

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- [`ee28cf33718b0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ee28cf33718b0) -
  Add @atlaskit/react-compiler-gating as a runtime dependency to enable React Compiler platform
  gating.
- Updated dependencies

## 1.0.0

### Major Changes

- [`f2dc9097319f0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f2dc9097319f0) - ###
  Dropped support for _legacy_ Typescript 4 types. **Typescript 5 is now the new minimum**.

  Removes the `typesVersions` property and `dist/types-ts4.5` directory from the dist.

  Types are now exclusively via the `"types": "dist/types/index.d.ts"` property.

  ```diff
  - "typesVersions": {
  -    ">=4.5 <4.9": {
  -        "*": [
  -            "dist/types-ts4.5/*",
  -            "dist/types-ts4.5/index.d.ts"
  -        ]
  -    }
  - },
  ```

### Patch Changes

- Updated dependencies

## 0.5.1

### Patch Changes

- [`9e45c7ac76c9a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9e45c7ac76c9a) -
  Enrol editor core packages into the React Compiler with platform gating via
  isReactCompilerActivePlatform

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
