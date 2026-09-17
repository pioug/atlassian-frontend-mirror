# @atlaskit/editor-plugin-block-collapse

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.1.1

### Patch Changes

- [`031f2b4eddd7b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/031f2b4eddd7b) -
  Fix code blocks remaining visible in collapsed heading sections under
  platform_editor_collapsible_headings by overriding CodeMirror display priority. Simplify collapse
  reconciliation by deriving section content from document positions instead of maintaining mutable
  content flags, and separate decoration creation from section traversal.

  Preserve collapsed heading state when unchanged content is rebuilt with a fresh schema instance
  under platform_renderer_collapsible_headings.

- Updated dependencies

## 3.1.0

### Minor Changes

- [`00fc2f11bb42e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/00fc2f11bb42e) -
  [ux] Support dragging and changing the format of complete collapsed heading sections under
  `platform_editor_collapsible_headings`.

### Patch Changes

- [`834dc6bee730b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/834dc6bee730b) -
  [ux] Keep collapsed heading controls visible under `platform_editor_collapsible_headings` when
  another editor node is active.
- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.2.0

### Minor Changes

- [`5d007e10ca06f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5d007e10ca06f) -
  Add collapsible heading behavior, tooltip messaging, and controls behind the
  `platform_editor_collapsible_headings` experiment.

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [`0841b102bfe4a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0841b102bfe4a) -
  Add a PM-state-backed multi-location left block-controls surface and register the display-only
  heading collapse button behind `platform_editor_block_control_migration` and
  `platform_editor_collapsible_headings`.

### Patch Changes

- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.0.0

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [`f733dfcc089c7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f733dfcc089c7) -
  Enable React 19 compatibility for additional Editor packages.

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [`e8deaf0aa0506`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e8deaf0aa0506) -
  Add the block collapse editor plugin package scaffold.
