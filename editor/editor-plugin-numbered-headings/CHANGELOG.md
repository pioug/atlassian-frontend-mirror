# @atlaskit/editor-plugin-numbered-headings

## 3.0.1

### Patch Changes

- [`5bed7e76ae587`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5bed7e76ae587) -
  [ux] EDITOR-9766: Vertically centre the numbered headings toggle in the text styles menu.
- [`7efec208f3bb4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7efec208f3bb4) -
  Remove unused runtime dependencies
- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.0.0

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [`d9228c8792b80`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d9228c8792b80) -
  Add numbered headings (POC), behind `platform_editor_numbered_headings`.

  Skip heading-structure scans for text replacements contained within a single textblock; continue
  mapping existing heading decorations as their positions change.
  - `@atlaskit/editor-plugin-numbered-headings`: numbers every heading as a decimal outline (1, 1.1,
    1.1.1) with node decorations, only recomputing on structural changes. Keeps shared state
    internal, adds a toggle to the pinned and inline Text styles menus, and keeps the on/off setting
    in the plugin for the current editor instance. Only the toggle indicates the enabled state; the
    menu row stays neutral.
  - `@atlaskit/editor-common`: add the `@atlaskit/editor-common/numbered-headings` entry point
    (`getHeadingNumbers`, `HEADING_NUMBER_ATTRIBUTE`), plus numbered headings toolbar keys, ranks,
    messages and analytics event.
  - `@atlaskit/editor-core`: render `data-heading-number` as a heading prefix with a trailing full
    stop (for example, `1.` and `1.1.`) in editor content styles.

### Patch Changes

- Updated dependencies
