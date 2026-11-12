# @atlaskit/editor-plugin-numbered-headings

## 4.1.2

### Patch Changes

- [`a398471720bf7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a398471720bf7) -
  Render heading numbers in editor SSR HTML, so headings don't shift when the client editor loads.
  Applies only when the numbering setting is on.
- Updated dependencies

## 4.1.1

### Patch Changes

- [`5b9db653e98c2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5b9db653e98c2) -
  [EDITOR-9767] With numbered headings turned on, Backspace in an empty heading now turns it into a
  paragraph wherever it is (top level, panels, layouts, table cells, expands). Before, the result
  depended on the container: in a panel, for example, the whole panel was deleted. The next
  Backspace works as it does today. Part of the `platform_editor_numbered_headings` experiment.
- Updated dependencies

## 4.1.0

### Minor Changes

- [`b15354550dd8a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b15354550dd8a) -
  The toolbar toggle is now one undoable change, and Cmd/Ctrl+Z and Shift+Z/Y undo and redo it while
  the numbered headings menu has focus. Adds dependencies on @atlaskit/browser-apis,
  @atlaskit/prosemirror-history and bind-event-listener. Behind platform_editor_numbered_headings.

### Patch Changes

- Updated dependencies

## 4.0.0

### Major Changes

- [`1aca24475cb3c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1aca24475cb3c) -
  Numbered headings now requires the external state plugin. It reads the setting from that plugin's
  `numberedHeadings` value, follows its changes, and saves toolbar toggles through it, behind
  platform_editor_numbered_headings.

  Presets that add `numberedHeadingsPlugin` must also add `externalStatePlugin` from
  `@atlaskit/editor-plugin-external-state`.

### Patch Changes

- Updated dependencies

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
