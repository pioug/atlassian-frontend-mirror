# @atlaskit/icon

## 29.0.0

### Major Changes

- [`f0d92beae2f40`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0d92beae2f40) -
  Removes utility icons entrypoints from the '@atlaskit/icon' package. Migrates related packages to
  update their imports.

### Patch Changes

- Updated dependencies

## 28.5.4

### Patch Changes

- Updated dependencies

## 28.5.3

### Patch Changes

- Updated dependencies

## 28.5.2

### Patch Changes

- Updated dependencies

## 28.5.1

### Patch Changes

- Updated dependencies

## 28.5.0

### Minor Changes

- [`ad4aa556627d5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ad4aa556627d5) -
  This release updates icons in `@atlaskit/icon`.

  ### Updated:

  **`@atlaskit/icon/core`**
  - `chart-pie`

## 28.4.0

### Minor Changes

- [`0a012007605a2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0a012007605a2) -
  This release updates icons in `@atlaskit/icon`.

  ### Updated:

  **`@atlaskit/icon/core`**
  - `chart-pie`

## 28.3.0

### Minor Changes

- [`99f4f441fac8c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/99f4f441fac8c) -
  We are testing new design language visual changes to Icon Tile behind a feature flag. If this
  change is successful it will be available in a later release.

  Additionally, backwards-compatible API changes were required to support this:
  - Deprecation of pixel number `size` in favor of new t-shirt sizes
  - Deprecation of `size` "16"
  - Deprecation of `shape`
  - Added `UNSAFE_circleReplacementComponent` prop temporarily to assist `shape` migrations
  - Deprecation of `LEGACY_fallbackComponent`

### Patch Changes

- Updated dependencies

## 28.2.1

### Patch Changes

- [`248faa32d4835`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/248faa32d4835) -
  Internal changes to how borders are applied.

## 28.2.0

### Minor Changes

- [`9ae6dba1e1062`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9ae6dba1e1062) -
  This release updates icons in `@atlaskit/icon`.

  ### Updated:

  **`@atlaskit/icon/core`**
  - `app-switcher-legacy`
  - `app-switcher`
  - `app`
  - `apps`
  - `atlassian-intelligence`
  - `chart-pie`
  - `form`
  - `megaphone`
  - `menu`
  - `notification`
  - `on-call`

## 28.1.2

### Patch Changes

- [`74c2f420ee49b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/74c2f420ee49b) -
  Internal changes to how border radius is applied.

## 28.1.1

### Patch Changes

- [`23bcc5bbc9cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23bcc5bbc9cee) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 28.1.0

### Minor Changes

- [`b3e26b962b5c7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b3e26b962b5c7) -
  Icon's `size` prop now also accepts a function, to determine icon size by the name of the icon.

## 28.0.0

### Major Changes

- [`2705f4174191e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2705f4174191e) -
  Legacy icons will no longer switch to the new icons via the
  `platform-visual-refresh-icons-legacy-facade` feature flag. This change includes removing the icon
  facade and cleaning up the feature flags.

### Patch Changes

- Updated dependencies

## 27.12.0

### Minor Changes

- [`1fa0bae860bbc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1fa0bae860bbc) -
  This release updates icons in `@atlaskit/icon`.

  ### Updated:

  **`@atlaskit/icon/core`**
  - `chart-pie`

## 27.11.0

### Minor Changes

- [#197413](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/197413)
  [`c30bdee7ca9ce`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c30bdee7ca9ce) -
  This release deprecates icons in `@atlaskit/icon`.

  ### Deprecated:

  **`@atlaskit/icon/core`**
  - `chart-matrix`
  - `chart-trend`
  - `spreadsheet`

### Patch Changes

- [#197413](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/197413)
  [`c30bdee7ca9ce`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c30bdee7ca9ce) -
  Migrated usage of renamed/deprecated icons

## 27.10.0

### Minor Changes

- [#197573](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/197573)
  [`9abe8b207a748`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9abe8b207a748) -
  This release updates icons in `@atlaskit/icon`.

  ### Updated:

  **`@atlaskit/icon/core`**
  - `chart-bar`
  - `chart-pie`
  - `check-mark`
  - `headphones`

- [#197573](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/197573)
  [`9abe8b207a748`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9abe8b207a748) -
  This release adds icons in `@atlaskit/icon`.

  ### Added:

  **`@atlaskit/icon/core`**
  - `check-circle-unchecked`

## 27.9.2

### Patch Changes

- [#196046](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/196046)
  [`ae7d1b0c33757`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ae7d1b0c33757) -
  Removed core and utility keywords from the icon metadata

## 27.9.1

### Patch Changes

- Updated dependencies

## 27.9.0

### Minor Changes

- [#194121](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/194121)
  [`7ae4095151c9a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7ae4095151c9a) -
  This release adds icons in `@atlaskit/icon`.

  ### Added:

  **`@atlaskit/icon/core`**
  - `chart-bubble`
  - `chart-trend-down`
  - `chart-trend-up`
  - `table`

## 27.8.1

### Patch Changes

- [#193863](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193863)
  [`ddb17aca8f0c7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ddb17aca8f0c7) -
  Disabling icon facade where old icons displayed new icons in prepartion for removal
- [#193214](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193214)
  [`c661806a65543`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c661806a65543) -
  Internal changes to how border radius and border width values are applied. No visual change.
- Updated dependencies

## 27.8.0

### Minor Changes

- [#193177](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193177)
  [`5b373c4d14e0c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5b373c4d14e0c) -
  Deprecated custom icon and custom SVG

## 27.7.0

### Minor Changes

- [#190687](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/190687)
  [`2b0322c52ee19`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2b0322c52ee19) -
  This release adds and updates icons in `@atlaskit/icon`.

  ### Added:

  **`@atlaskit/icon/core`**
  - `rovo-chat`

  ### Updated:

  **`@atlaskit/icon/core`**
  - `ai-chat`

## 27.6.1

### Patch Changes

- [#189756](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189756)
  [`87618db7faf04`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/87618db7faf04) -
  Updated usage of deprecated migration icons
- Updated dependencies

## 27.6.0

### Minor Changes

- [#189716](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189716)
  [`b5788cebd1812`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b5788cebd1812) -
  Legacy icons have been deprecated and will be removed in a future release

## 27.5.1

### Patch Changes

- [#188952](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188952)
  [`1a88e6e2601ae`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1a88e6e2601ae) -
  Migrated usage of renamed/deprecated icons

## 27.5.0

### Minor Changes

- [#188295](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188295)
  [`301478c2f2125`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/301478c2f2125) -
  This release updates icons in `@atlaskit/icon`.

  ### Updated:

  **`@atlaskit/icon/core`**
  - `ai-chat`
  - `collapse-horizontal`
  - `collapse-vertical`
  - `expand-horizontal`
  - `expand-vertical`

### Patch Changes

- Updated dependencies

## 27.4.0

### Minor Changes

- [#188287](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/188287)
  [`ecadaec5669f6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ecadaec5669f6) -
  Updated migration mapping for several icon entrypoints.

  **`@atlaskit/icon/core/migration`**
  - `close--cross → cross`
  - `close--editor-close → cross--editor-close`
  - `error → status-error--error`
  - `information--editor-info → status-information--editor-info`
  - `information--editor-panel → status-information--editor-panel`
  - `information--info → status-information--info`
  - `success--check-circle → status-success--check-circle`
  - `success--editor-success → status-success--editor-success`
  - `warning--editor-warning → status-warning--editor-warning`
  - `warning → status-warning--warning`

## 27.3.0

### Minor Changes

- [#175869](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/175869)
  [`e7f822af7edc1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e7f822af7edc1) -
  Updated usages of deprecated icons with replacement icons

## 27.2.1

### Patch Changes

- [#179122](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/179122)
  [`a03a08e15f9a2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a03a08e15f9a2) -
  [ux] As the icon component is in its General Release, this release removes the previous `Beta`
  label from Atlassian.design.

## 27.2.0

### Minor Changes

- [#176032](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/176032)
  [`0a172a0fd7cd6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0a172a0fd7cd6) -
  Updated migration mapping for several icon entrypoints.

  ### Added:

  **`@atlaskit/icon/core/migration`**
  - `cross--editor-close`
  - `cross`

### Patch Changes

- Updated dependencies

## 27.1.0

### Minor Changes

- [#173492](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173492)
  [`26fefb696ee7e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/26fefb696ee7e) -
  This release deprecates all `@atlaskit/icon/utility` entry-points. If you require 12px icons
  please use the `@atlaskit/icon/core` entry-point instead with size prop set to 'small'.
  Furthermore, this release also adds, updates and deprecates other icons in `@atlaskit/icon/core`.

  ### Added:

  **`@atlaskit/icon/core`**
  - `cross`
  - `focus-area`
  - `status-discovery`
  - `status-error`
  - `status-information`
  - `status-success`
  - `status-warning`

  ### Updated:

  **`@atlaskit/icon/core`**
  - `cash`
  - `close`
  - `flask`
  - `lightbulb`
  - `magic-wand`
  - `paint-palette`
  - `pen`
  - `status-verified`

  ### Deprecated:

  **`@atlaskit/icon/core`**
  - `capture`
  - `close`
  - `discovery`
  - `error`
  - `information`
  - `success`
  - `warning`

  ### Deprecated:

  **`@atlaskit/icon/utility`**
  - `add`
  - `arrow-down`
  - `arrow-left`
  - `arrow-right`
  - `arrow-up`
  - `check-circle`
  - `check-mark`
  - `chevron-double-left`
  - `chevron-double-right`
  - `chevron-down`
  - `chevron-left`
  - `chevron-right`
  - `chevron-up`
  - `cross`
  - `cross-circle`
  - `drag-handle-horizontal`
  - `drag-handle-vertical`
  - `error`
  - `information`
  - `link-external`
  - `lock-locked`
  - `lock-unlocked`
  - `show-more-horizontal`
  - `show-more-vertical`
  - `star-starred`
  - `star-unstarred`
  - `success`
  - `warning`

## 27.0.0

### Major Changes

- [#171534](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/171534)
  [`7a6465c5735e5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7a6465c5735e5) -
  This release removes icons in `@atlaskit/icon`.

  ### Removed:

  **`@atlaskit/icon/core`**
  - `align-center`
  - `align-left`
  - `align-right`
  - `border-weight-medium`
  - `border-weight-thick`
  - `border-weight-thin`
  - `child-issues`
  - `content-align-center`
  - `content-align-left`
  - `content-align-right`
  - `drag-handle`
  - `drawer-left`
  - `drawer-right`
  - `issue`
  - `issues`
  - `sidebar-left`
  - `sidebar-right`
  - `summarize`

### Patch Changes

- Updated dependencies

## 26.4.1

### Patch Changes

- Updated dependencies

## 26.4.0

### Minor Changes

- [#161328](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161328)
  [`76f53eb3bc586`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/76f53eb3bc586) -
  This release updates and deprecates icons in `@atlaskit/icon`.

  ### Updated:

  **`@atlaskit/icon/core`**
  - `image`

  ### Deprecated:

  **`@atlaskit/icon/core`**
  - `child-issues`
  - `drawer-left`
  - `drawer-right`
  - `summarize`

### Patch Changes

- Updated dependencies

## 26.3.0

### Minor Changes

- [#160927](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160927)
  [`70494296070b5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/70494296070b5) -
  This release adds icons in `@atlaskit/icon`.

  ### Added:

  **`@atlaskit/icon/core`**
  - `panel-left`
  - `panel-right`

## 26.2.0

### Minor Changes

- [#160457](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160457)
  [`9b2c186eb964f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9b2c186eb964f) -
  This release updates icons in `@atlaskit/icon`.

  ### Updated:

  **`@atlaskit/icon/core`**
  - `attachment`
  - `check-circle`
  - `chevron-right`
  - `clock`
  - `defect`
  - `devices`
  - `exclamation-square`
  - `list-checklist`
  - `minus-square`
  - `pen`
  - `pin-filled`
  - `pin`
  - `plus-square`
  - `priority-blocker`
  - `priority-critical`
  - `priority-high`
  - `priority-highest`
  - `priority-low`
  - `priority-lowest`
  - `priority-major`
  - `priority-medium`
  - `priority-minor`
  - `priority-trivial`
  - `problem`
  - `story`
  - `subtasks`
  - `tools`
  - `work-item`
  - `work-items`

## 26.1.1

### Patch Changes

- [#158890](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/158890)
  [`a8e4b409426ca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a8e4b409426ca) -
  Added guidance for chevron icons to inform makers to use 12px variant to maintain uniformity

## 26.1.0

### Minor Changes

- [#149822](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/149822)
  [`5f950e40b46c5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5f950e40b46c5) -
  New icons now support a `size` prop with `medium` and `small` options. This replaces utility
  icons, which will soon be deprecated. See the
  [migration guide](https://atlassian.design/components/icon/migration-guide) for more information.

### Patch Changes

- Updated dependencies

## 26.0.0

### Major Changes

- [#137001](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/137001)
  [`37c3ccf696abd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/37c3ccf696abd) -
  Migrate @atlaskit/icon to @compiled css

### Patch Changes

- Updated dependencies

## 25.8.0

### Minor Changes

- [#148166](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148166)
  [`06a7435a03c28`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/06a7435a03c28) -
  This release updates icons in `@atlaskit/icon`.

  ### Updated:

  **`@atlaskit/icon/core`**
  - `refresh`
  - `shapes`

## 25.7.0

### Minor Changes

- [#150689](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150689)
  [`35118f49ae5c3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/35118f49ae5c3) -
  This release adds icons in `@atlaskit/icon`.

  ### Added:

  **`@atlaskit/icon/core`**
  - `child-work-items`

## 25.6.0

### Minor Changes

- [#138291](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/138291)
  [`12b2a21a4da5a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/12b2a21a4da5a) -
  This release updates and deprecates icons in `@atlaskit/icon`.

  ### Updated:

  **`@atlaskit/icon/core`**
  - `api`
  - `data-number`
  - `data-string`
  - `emoji-remove`
  - `eye-open-strikethrough`
  - `field-checkbox-group`
  - `field-radio-group`
  - `list-bulleted`
  - `list-checklist`
  - `list-numbered`
  - `notification-muted`
  - `pin-filled`
  - `pin`
  - `retry`
  - `shield-strikethrough`
  - `summarize`
  - `tag`
  - `text-heading`
  - `text-strikethrough`
  - `text`
  - `video-skip-backward-fifteen`
  - `video-skip-backward-ten`
  - `video-skip-forward-fifteen`
  - `video-skip-forward-ten`
  - `video`

## 25.5.0

### Minor Changes

- [#135884](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/135884)
  [`20a4ca43b3a13`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/20a4ca43b3a13) -
  This release adds icons in `@atlaskit/icon`.

  ### Added:

  **`@atlaskit/icon/core`**
  - `ai-generative-text-summary`

## 25.4.0

### Minor Changes

- [#134572](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/134572)
  [`9ae8e789e419b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9ae8e789e419b) -
  Icons are now shipped using paths instead of strokes and no longer require SVG filter overrides
  when using disabled tokens for color.

## 25.3.1

### Patch Changes

- [#130237](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/130237)
  [`2648b1745d092`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2648b1745d092) -
  Added status information in icon metadata
- Updated dependencies

## 25.3.0

### Minor Changes

- [#132827](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132827)
  [`b69d7b27b4b5f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b69d7b27b4b5f) -
  This release updates icons in `@atlaskit/icon`.

  ### Updated:

  **`@atlaskit/icon/core`**
  - `assets`

## 25.2.0

### Minor Changes

- [#132394](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/132394)
  [`8c4b7d72f9c69`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8c4b7d72f9c69) -
  This release updates and deprecates icons in `@atlaskit/icon`.

  ### Updated:

  **`@atlaskit/icon/core`**
  - `text-underline`

  ### Deprecated:

  **`@atlaskit/icon/core`**
  - `border-weight-medium`
  - `border-weight-thick`
  - `border-weight-thin`
  - `content-align-center`
  - `content-align-left`
  - `content-align-right`
  - `drag-handle`
  - `align-center`
  - `align-left`
  - `align-right`

  ### Deprecated:

  **`@atlaskit/icon/utility`**
  - `drag-handle`

### Patch Changes

- Updated dependencies

## 25.1.0

### Minor Changes

- [#131966](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/131966)
  [`bb527c6817e2b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bb527c6817e2b) -
  This release adds icons in `@atlaskit/icon`.

  ### Added:

  **`@atlaskit/icon/core`**
  - `accessibility`
  - `drawer-left`
  - `drawer-right`
  - `work-item`
  - `work-items`

## 25.0.2

### Patch Changes

- [#127093](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/127093)
  [`1378ea7a99ce1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1378ea7a99ce1) -
  Upgrades `jscodeshift` to handle generics properly.
- Updated dependencies

## 25.0.1

### Patch Changes

- [#129972](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/129972)
  [`b2d69a39e6687`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b2d69a39e6687) -
  Update `@compiled/react` dependency for improved type checking support.
- Updated dependencies

## 25.0.0

### Major Changes

- [#124742](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/124742)
  [`ca9cea0dadcce`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ca9cea0dadcce) -
  Icons have been updated to use paths instead of strokes. This results in some very minor
  anti-aliasing differences, imperceptable to the eye, yet may cuase VR tests to break.

## 24.1.1

### Patch Changes

- [#123148](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/123148)
  [`cc1e03ba8571e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cc1e03ba8571e) -
  Removes 'Experimental' tag from the description of icons.

## 24.1.0

### Minor Changes

- [#117980](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/117980)
  [`445574ca2bf8c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/445574ca2bf8c) -
  This release updates icons in `@atlaskit/icon`.

  ### Updated:

  **`@atlaskit/icon/core`**
  - `drag-handle-horizontal`
  - `drag-handle-vertical`
  - `drag-handle`
  - `text-strikethrough`

  **`@atlaskit/icon/utility`**
  - `drag-handle-horizontal`
  - `drag-handle-vertical`
  - `drag-handle`

## 24.0.0

### Major Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

### Patch Changes

- Updated dependencies

## 23.11.0

### Minor Changes

- [#114599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114599)
  [`bea386785f6f4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bea386785f6f4) -
  This release adds, updates and deprecates icons in `@atlaskit/icon`.

  ### Added:

  **`@atlaskit/icon/core`**
  - `drag-handle-horizontal`
  - `drag-handle-vertical`

  **`@atlaskit/icon/utility`**
  - `drag-handle-horizontal`
  - `drag-handle-vertical`

  ### Updated:

  **`@atlaskit/icon/core`**
  - `refresh`
  - `text-strikethrough`

  ### Deprecated:

  **`@atlaskit/icon/core`**
  - `content-align-center`
  - `content-align-left`
  - `content-align-right`
  - `border-weight-medium`
  - `border-weight-thick`
  - `border-weight-thin`
  - `align-center`
  - `align-left`
  - `align-right`

## 23.10.1

### Patch Changes

- [#116447](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116447)
  [`d0c45e793a17d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d0c45e793a17d) -
  Remove old codemod.

## 23.10.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

## 23.9.1

### Patch Changes

- [#113917](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113917)
  [`70dbe7ccc0f8e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/70dbe7ccc0f8e) -
  Rebuilt assets with original mask IDs in tact in order to prevent clashes.

## 23.9.0

### Minor Changes

- [#113397](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113397)
  [`50304c1a4bc84`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/50304c1a4bc84) -
  This release adds a `svgs/core` and `svgs/utility` entry point to allow use of the svgs for the
  new icons.

## 23.8.1

### Patch Changes

- [#113648](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113648)
  [`b99bce6a11fd5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b99bce6a11fd5) -
  Update dependencies.

## 23.8.0

### Minor Changes

- [#111393](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/111393)
  [`cbcdf9cbfacf7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cbcdf9cbfacf7) -
  This release adds and updates icons in `@atlaskit/icon`.

  ### Added:

  **`@atlaskit/icon/core`**
  - `align-image-center`
  - `align-image-left`
  - `align-image-right`
  - `align-text-center`
  - `align-text-left`
  - `align-text-right`
  - `stroke-weight-extra-large`
  - `stroke-weight-large`
  - `stroke-weight-medium`
  - `stroke-weight-small`

  ### Updated:

  **`@atlaskit/icon/core`**
  - `text-strikethrough`

## 23.7.1

### Patch Changes

- [#108179](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108179)
  [`327beb94a2e5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/327beb94a2e5a) -
  Remove unused internal exports and update dependencies.

## 23.7.0

### Minor Changes

- [#108250](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108250)
  [`2ff8982b58a26`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2ff8982b58a26) -
  [ux] This adds and modifies icons in `@atlaskit/icons` and `@atlaskit/icon-lab`

  ### Added:

  **`@atlaskit/icon/core`**
  - `exclamation-square`
  - `information-circle`
  - `text-heading`
  - `text-strikethrough`
  - `text-underline`

    ### Updated:

  **`@atlaskit/icon/core`**
  - `cloud-arrow-up`
  - `error`
  - `field-radio-group`
  - `minus`
  - `operations`
  - `problem`
  - `thumbs-down`
  - `thumbs-up`
  - `volume-high`
  - `volume-low`
  - `volume-muted`
  - `warning`

  **`@atlaskit/icon/glyph`**
  - `issue-raise` - now has replacement icon, `core/plus-square` and migration component

## 23.6.1

### Patch Changes

- Updated dependencies

## 23.6.0

### Minor Changes

- [#109954](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109954)
  [`898a668695f25`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/898a668695f25) -
  Exposes IconTileProps type to consumers

## 23.5.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 23.4.1

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 23.4.0

### Minor Changes

- [#102935](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/102935)
  [`cce3e57461cd7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cce3e57461cd7) -
  This release updates icons in `@atlaskit/icon`.

  ### Updated:

  **`@atlaskit/icon/core`**
  - `field-radio-group`

## 23.3.1

### Patch Changes

- Updated dependencies

## 23.3.0

### Minor Changes

- [#101112](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/101112)
  [`13f29ccf9c9db`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/13f29ccf9c9db) -
  This release adds icons in `@atlaskit/icon`.

  ### Added:

  **`@atlaskit/icon/utility`**
  - `chevron-double-left`
  - `chevron-double-right`

## 23.2.0

### Minor Changes

- [#100878](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100878)
  [`435ae22dc9289`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/435ae22dc9289) -
  This release updates icons in `@atlaskit/icon`.

  **`@atlaskit/icon/core`**
  - 'discovery'
  - 'field-radio-group'
  - 'mention'
  - 'story'
  - 'video-skip-backward-fifteen'
  - 'video-skip-backward-ten'
  - 'video-skip-forward-fifteen'
  - 'video-skip-forward-ten'

## 23.1.1

### Patch Changes

- [#179351](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/179351)
  [`96a92733114df`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/96a92733114df) -
  Upgraded dev dependency '@emotion/babel-preset-css-prop' from '^10.0.7' to '^11.11.0'
- Updated dependencies

## 23.1.0

### Minor Changes

- [#175583](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/175583)
  [`75911cb003bd5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/75911cb003bd5) -
  Add new property to migration map to indicate if an replacement icon is visually different to the
  original.

## 23.0.1

### Patch Changes

- [#168321](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168321)
  [`01cada6d7a4d7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/01cada6d7a4d7) -
  Fix bug where new icon types had an additional prop isFacadeDisabled that was not used

## 23.0.0

### Major Changes

- [#171994](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171994)
  [`be58e4bb2e387`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/be58e4bb2e387) -
  This release renames UNSAFE types and entrypoints. It also includes rebuilding the icons and
  removing deprecated entrypoints.

  ### Renamed entrypoints:
  - `@atlaskit/icon/UNSAFE_base-new` → `@atlaskit/icon/base-new`
  - `@atlaskit/icon/UNSAFE_migration-map` → `@atlaskit/icon/migration-map`

  ### Removed entrypoints:

  **`@atlaskit/icon/core`**
  - `bulleted-list`
  - `collapse`
  - `expand`

  **`@atlaskit/icon/core/migration`**
  - `bulleted-list--bullet-list`
  - `bulleted-list--editor-bullet-list`
  - `collapse--editor-collapse`
  - `expand--editor-expand`
  - `expand--editor-image-resize`
  - `expand--image-resize`

## 22.28.0

### Minor Changes

- [#169436](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169436)
  [`e52faf54c03cd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e52faf54c03cd) -
  Adds `testId` to Icon Tile. Fixes bug where icon tiles could render incorrectly when placed inside
  headings.

## 22.27.0

### Minor Changes

- [#168743](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168743)
  [`b27dba8a5f3cd`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b27dba8a5f3cd) -
  Update types to improve compatibility with React 18.

### Patch Changes

- Updated dependencies

## 22.26.0

### Minor Changes

- [#168599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168599)
  [`48b86e5124c23`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/48b86e5124c23) -
  This release adds a supplementary set of icons to `@atlaskit/icon`.

  ### Added:

  **`@atlaskit/icon/core`**
  - `shield-strikethrough`
  - `video-skip-backward-fifteen`
  - `video-skip-forward-fifteen`

  ### Updated:

  **`@atlaskit/icon/core`**
  - `field-radio-group`
  - `sidebar-collapse`
  - `sidebar-expand`
  - `video-skip-backward-ten`
  - `video-skip-forward-ten`

## 22.25.0

### Minor Changes

- [#162725](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162725)
  [`b2449424247a3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b2449424247a3) -
  New deprecation endpoint to identify icons that have been deprecated. Used with the
  `no-deprecated-imports` lint rule to assist with displaying errors and auto-fixing those icons
  with a defined replacement.

## 22.24.3

### Patch Changes

- [#166026](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166026)
  [`962b5e77810fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/962b5e77810fb) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 22.24.2

### Patch Changes

- [#160518](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/160518)
  [`a59ea189efe8c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a59ea189efe8c) -
  Fix bug with core icons: `send`, `scale` and `status-verified`

## 22.24.1

### Patch Changes

- [#157955](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157955)
  [`ea8ebc84a9079`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ea8ebc84a9079) -
  Updated migration mapping for several icon entrypoints.

  **`@atlaskit/icon/core/migration`**
  - `content-wrap-left--editor-media-wrap-left`
  - `content-wrap-right--editor-media-wrap-right`
  - `discovery--editor-note`
  - `file--document-filled`
  - `file--document`
  - `files--documents`
  - `minus--editor-divider`

  Updated legacy icons to map to new icons via the icon facade:
  - document → file
  - document-filled → file
  - documents → files
  - editor/divider → minus
  - editor/media-wrap-left → content-wrap-left
  - editor/media-wrap-right → content-wrap-right
  - editor/note → discovery

## 22.24.0

### Minor Changes

- [#155379](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155379)
  [`d703fb68d3059`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d703fb68d3059) -
  Run build-glyphs in icon packages.
- [#155379](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155379)
  [`d703fb68d3059`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d703fb68d3059) -
  Add static imports for icon metadata.

## 22.23.0

### Minor Changes

- [#154636](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154636)
  [`6bd3aebdb9761`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6bd3aebdb9761) -
  Run build-glyphs in icon packages.

## 22.22.0

### Minor Changes

- [#149700](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149700)
  [`86fe5879e0d2d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/86fe5879e0d2d) -
  Default `color` prop for icons in experimental `core` and `utility` entrypoints has changed from
  `color.icon` to `currentColor`.

## 22.21.0

### Minor Changes

- [#149469](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149469)
  [`c75edf6df890b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c75edf6df890b) -
  Adds `spacing` option for utility icons.

### Patch Changes

- [#149525](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149525)
  [`f2680ef0aa0dc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f2680ef0aa0dc) -
  Removed deprecate tag from spacing prop on icon

## 22.20.2

### Patch Changes

- [#147531](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147531)
  [`8ae1e110621b7`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8ae1e110621b7) -
  Internal changes to feature flag used to toggle new icons

## 22.20.1

### Patch Changes

- [#147485](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147485)
  [`d4cfb478a5f36`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d4cfb478a5f36) -
  Re-generated glyph icons after dependencies were updated

## 22.20.0

### Minor Changes

- [#147410](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147410)
  [`7300bd8281c70`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7300bd8281c70) -
  This release adds a supplementary set of icons to `@atlaskit/icon`.

  ### Added:

  **`@atlaskit/icon/core`**
  - `api`
  - `arrow-down-left`
  - `arrow-down-right`
  - `arrow-up-left`
  - `assets`
  - `border`
  - `border-weight-medium`
  - `border-weight-thick`
  - `border-weight-thin`
  - `border`
  - `calendar-plus`
  - `card`
  - `chat-widget`
  - `clipboard`
  - `curly-brackets`
  - `data-number`
  - `data-string`
  - `emoji-casual`
  - `emoji-neutral`
  - `emoji-remove`
  - `field-alert`
  - `field-checkbox-group`
  - `field-dropdown`
  - `field-radio-group`
  - `form`
  - `glasses`
  - `image-fullscreen`
  - `image-inline`
  - `image-scaled`
  - `markdown`
  - `person-remove`
  - `person-warning`
  - `project-status`
  - `radio-checked`
  - `radio-unchecked`
  - `screen-plus`
  - `sidebar-left`
  - `sidebar-right`
  - `smart-link-card`
  - `smart-link-embed`
  - `smart-link-inline`
  - `smart-link-list`
  - `smart-link`
  - `status-verified`
  - `summarize`
  - `support`
  - `table-cell-clear`
  - `table-cell-merge`
  - `table-cell-split`
  - `table-column-add-left`
  - `table-column-add-right`
  - `table-column-delete`
  - `table-column-move-left`
  - `table-column-move-right`
  - `table-columns-distribute`
  - `table-row-add-above`
  - `table-row-add-below`
  - `table-row-delete`
  - `table-row-move-down`
  - `table-row-move-up`
  - `task-in-progress`
  - `task-to-do`
  - `text-shorten`
  - `text-wrap`
  - `translate`
  - `video-skip-backward-ten`
  - `video-skip-forward-ten`
  - `video-stop-overlay`
  - `video-stop`

  ### Updated:

  **`@atlaskit/icon/core`**
  - `edit`
  - `link-broken`
  - `link-external`
  - `thumbs-down`
  - `thumbs-up`

### Patch Changes

- [#147477](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147477)
  [`18de563a8433b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/18de563a8433b) -
  Re-generated icons after dependencies were updated

## 22.19.0

### Minor Changes

- [`318191402c2ad`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/318191402c2ad) -
  Add LEGACY_fallbackComponent prop to Icon Tile

## 22.18.1

### Patch Changes

- Updated dependencies

## 22.18.0

### Minor Changes

- [#140548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140548)
  [`c66b92f724af1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c66b92f724af1) - ###
  Summary:
  - Fixes issue where icons with arrows sometimes rendered incorrectly.
  - Adds and updates some icons used in Editor.

  ### Added:

  **`@atlaskit/icon/core`**
  - `highlight`
  - `layout-one-column`

  ### Updated:

  **`@atlaskit/icon/core`**
  - `text-style`: now feature smaller text with room for a color indicator underneath.
  - Icons containing arrows have corrected paths

### Patch Changes

- [#140615](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140615)
  [`5415fdcac6ff6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5415fdcac6ff6) -
  Updates to internal feature flag logic

## 22.17.0

### Minor Changes

- [#139873](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139873)
  [`141a2cdfda71c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/141a2cdfda71c) -
  Add support to opt out of icon facade via the `isFacadeDisabled` prop.

## 22.16.1

### Patch Changes

- [#137821](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137821)
  [`bcca6c1789a37`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bcca6c1789a37) -
  Rename of `@atlassian/icon-lab` to `@atlaskit/icon-lab`

## 22.16.0

### Minor Changes

- [#137781](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137781)
  [`21bfb50836bad`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/21bfb50836bad) -
  Added a new icon to the utility migration icon set: 'cross--editor-close'

## 22.15.2

### Patch Changes

- [#135696](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135696)
  [`81ef1300efc63`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/81ef1300efc63) -
  This release tests changes to the default color value for new icons in `/core` and `/utility`
  entrypoints behind a feature flag. These changes will roll out in an upcoming major release.

## 22.15.1

### Patch Changes

- [#135508](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/135508)
  [`7a69ad1e19510`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7a69ad1e19510) -
  Reverts the removal of several icon entrypoints from `@atlaskit/icon/core` and
  `@atlaskit/icon/utility`:

  ### Core icons (from `@atlaskit/icon/core`):
  - `bulleted-list`
  - `expand`
  - `collapse`

  ### Core migration icons (from `@atlaskit/icon/core/migration`):
  - `app-switcher--switcher`
  - `bulleted-list--bullet-list`
  - `bulleted-list--editor-bullet-list`
  - `collapse`
  - `collapse--editor-collapse`
  - `expand--editor-expand	`
  - `expand--editor-image-resize`
  - `expand--image-resize`
  - `maximize--media-services-actual-size`
  - `minimize--media-services-fit-to-page`
  - `minimize--vid-full-screen-off`
  - `phone--hipchat-dial-out`

  ### Utility migration icons (from `@atlaskit/icon/core/utility/migration`):
  - `check-circle`
  - `check-circle--editor-success`

  These restored entrypoints match the designs from the previous release.

  Core and Utility icons that were re-named in the previous release were not reverted to their
  previous designs to prevent regressions in experiences that have updated to use the new designs.

## 22.15.0

### Minor Changes

- [#133643](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133643)
  [`1ab5ca9bddc97`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1ab5ca9bddc97) -

  ### Warning:

  **This release erroneously removed a number of entrypoints that should not have been removed in a
  minor release. Please stay on 22.14.2, or roll forward to 22.15.1, which adds back the removed
  entrypoints with the closest equivalent icons from the new set.**

  ### Summary

  This release adds a huge new set of icons to `@atlaskit/icon/core` and `@atlaskit/icon/utility`,
  including replacements for legacy Editor, Jira and Media icons.

  To see how legacy icons from `@atlaskit/icon/glyph` map to these new icons, see the migration map
  in `@atlaskit/icon/migration-map`.

  ### Added:

  **`@atlaskit/icon/core`**
  - `key-result`
  - `people-group`
  - `merge-failure`
  - `merge-success`
  - `text`
  - `sort-descending`
  - `sort-ascending`
  - `minus`
  - `grow-horizontal`
  - `expand-horizontal`
  - `collapse-horizontal`
  - `expand-vertical`
  - `collapse-vertical`
  - `grow-vertical`
  - `shrink-vertical`
  - `refresh`
  - `note`
  - `discovery`
  - `eye-open-strikethrough`
  - `file`
  - `files`
  - `video-pause-overlay`
  - `video-play-overlay`
  - `video-next-overlay`
  - `video-previous-overlay`
  - `notification-muted`
  - `plus-square`
  - `cash`
  - `defect`
  - `devices`
  - `list-checklist`
  - `magic-wand`
  - `pulse`
  - `minus-square`
  - `ticket`
  - `tools`
  - `wallet`
  - `wrench`
  - `on-call`
  - `edit-bulk`
  - `objective`
  - `target`
  - `scales`
  - `data-flow`
  - `theme`
  - `paint-bucket`
  - `paint-roller`
  - `paint-brush`
  - `pen`
  - `projection-screen`
  - `paint-palette`
  - `field`
  - `field-text`
  - `operations`
  - `text-bold`
  - `text-italic`
  - `list-numbered`
  - `text-indent-left`
  - `text-indent-right`
  - `layout-two-columns`
  - `layout-two-columns-sidebar-left`
  - `layout-two-columns-sidebar-right`
  - `layout-three-columns`
  - `layout-three-columns-sidebars`
  - `content-align-left`
  - `content-align-center`
  - `content-align-right`
  - `content-wrap-left`
  - `content-wrap-right`
  - `content-width-narrow`
  - `content-width-wide`
  - `tree`
  - `takeout-food`
  - `basketball`
  - `vehicle-car`

  **`@atlaskit/icon/utility`**
  - `success`
  - `arrow-down`
  - `arrow-left`
  - `arrow-right`
  - `arrow-up`
  - `drag-handle`

  ### Renamed:

  **`@atlaskit/icon/core`**
  - `list-bulleted → bulleted list`
  - `shrink-diagonal → minimize`
  - `grow-diagonal → maximize`
  - `shrink-horizontal → collapse`
  - `maximize → expand`
  - `success → check-circle`

  **`@atlaskit/icon/utility`**
  - `success → check-circle`

  ### Updated:

  **`@atlaskit/icon/core`**
  - `check-circle`
  - `ai-chat`
  - `comment`
  - `comment-add`
  - `person`
  - `person-add`
  - `person-added`
  - `person-offboard`
  - `lock-locked`
  - `lock-unlocked`
  - `check-mark`
  - `checkbox-checked`
  - `issue`
  - `issues`
  - `scorecard`
  - `task`
  - `tasks`
  - `branch`
  - `pull-request`
  - `add`
  - `minimize`
  - `fullscreen-exit`
  - `commit`
  - `office-building`
  - `department`
  - `text-style`
  - `eye-open`
  - `eye-open-filled`
  - `notification`
  - `arrow-up-right`

  **`@atlaskit/icon/utility`**
  - `chevron-right`
  - `chevron-down`
  - `chevron-left`
  - `chevron-up`
  - `lock-locked`
  - `lock-unlocked`
  - `check-circle`
  - `check-mark`

  ### Removed entrypoints:

  **`@atlaskit/icon/core`**
  - `bulleted-list`
  - `expand`
  - `collapse`

  **`@atlaskit/icon/core/migration`**
  - `app-switcher--switcher`
  - `bulleted-list--bullet-list`
  - `bulleted-list--editor-bullet-list`
  - `collapse`
  - `collapse--editor-collapse`
  - `expand--editor-expand	`
  - `expand--editor-image-resize`
  - `expand--image-resize`
  - `maximize--media-services-actual-size`
  - `minimize--media-services-fit-to-page`
  - `minimize--vid-full-screen-off`
  - `phone--hipchat-dial-out`

  **`@atlaskit/icon/core/utility/migration`**
  - `check-circle`
  - `check-circle--editor-success`

## 22.14.2

### Patch Changes

- [#133207](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/133207)
  [`9821517396ff9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9821517396ff9) -
  Upgrade svgo to `3.3.0`

## 22.14.1

### Patch Changes

- [#132551](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/132551)
  [`847dae7fdc9f3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/847dae7fdc9f3) -
  Upgrade svgo to `3.3.1`

## 22.14.0

### Minor Changes

- [#131906](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/131906)
  [`9fd3fdb9e3b02`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9fd3fdb9e3b02) -
  Adding 'data-vc' attribute to icon for instrumenting TTVC (go/ttvc).

## 22.13.0

### Minor Changes

- [#129428](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/129428)
  [`668728e77517f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/668728e77517f) -
  Updated metadata format for /core and /utility icons, tightening types and moving to lowercase
  format.

## 22.12.0

### Minor Changes

- [#127511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/127511)
  [`db30e29344013`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/db30e29344013) -
  Widening range of `react` and `react-dom` peer dependencies from `^16.8.0 || ^17.0.0 || ~18.2.0`
  to the wider range of ``^16.8.0 || ^17.0.0 || ^18.0.0` (where applicable).

  This change has been done to enable usage of `react@18.3` as well as to have a consistent peer
  dependency range for `react` and `react-dom` for `/platform` packages.

### Patch Changes

- Updated dependencies

## 22.11.1

### Patch Changes

- [#128275](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128275)
  [`e1b99e3ce07ca`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e1b99e3ce07ca) -
  Fixed an invalid path in the migration-map entrypoint.

## 22.11.0

### Minor Changes

- [#128427](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/128427)
  [`ade1e717764e2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ade1e717764e2) -
  Updated the `color` prop of alpha icon components to support text design tokens.

## 22.10.0

### Minor Changes

- [#126553](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/126553)
  [`a8d7e60d3b69d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a8d7e60d3b69d) -
  Add new export, `migrationOutcomeDescriptionMap`, containing written migration guidance for use in
  documentation and tooling

## 22.9.0

### Minor Changes

- [#125980](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/125980)
  [`4df9272f5f016`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4df9272f5f016) -
  Adds four new icons to the experimental /core icon set: 'notification', 'menu', 'app-switcher',
  and 'app-switcher-legacy'

## 22.8.0

### Minor Changes

- [#124884](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124884)
  [`3108a1a229e07`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3108a1a229e07) - -
  Icons in `@atlaskit/icon/glyph` can now switch to updated designs behind a feature flag.
  - SVGs in `/svgs`, used by icons in `@atlaskit/icon/glyph`, have been re-optimised with the latest
    version of SVGO; some slight changes to SVG code or subpixel aliasing may occur

## 22.7.0

### Minor Changes

- [#122612](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122612)
  [`0c9d2190a14f2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c9d2190a14f2) -
  Adds a new prop, LEGACY_margin, to the new icon API to allow for spacing adjustments between old
  and new icons API.

### Patch Changes

- [#122977](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/122977)
  [`41748db2c12de`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/41748db2c12de) -
  [ux]ED-24225 add wrap button inside editor-plugin-block

## 22.6.0

### Minor Changes

- [`c1a3f0e0f18e2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c1a3f0e0f18e2) -
  Adds LEGACY_primaryColor to the icon API, to assist with user migration.

## 22.5.1

### Patch Changes

- Updated dependencies

## 22.5.0

### Minor Changes

- [#114987](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114987)
  [`4fdcfc2b65ce0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4fdcfc2b65ce0) - -
  Added experimental new variants of the new icon components with legacy fallbacks built in. These
  are available at `core/migration` and `utility/migration` and are generated based on a new
  migration mapping, available at `@atlaskit/icon/UNSAFE_migration-map`.
  - Updated the `oldName` value in `metadata-core` and `metadata-utility` to contain an array of
    legacy icon IDs, generated from the information in the migration map.

## 22.4.1

### Patch Changes

- [#113646](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/113646)
  [`01c04f5a4e85a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/01c04f5a4e85a) -
  Update experimental new icons to support link tokens as colors
- Updated dependencies

## 22.4.0

### Minor Changes

- [#110670](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/110670)
  [`c733254a2dd6e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c733254a2dd6e) -
  Explicitly set jsxRuntime to classic via pragma comments in order to avoid issues where jsxRuntime
  is implicitly set to automatic.

## 22.3.2

### Patch Changes

- [#93481](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/93481)
  [`c826eb17b113e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c826eb17b113e) -
  Remove examples of the logos that have been deprecated by the '@atlaskit/logo' package.

## 22.3.1

### Patch Changes

- [#104222](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/104222)
  [`cabed929cdde`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cabed929cdde) -
  Fix bug where utility icons incorrectly allowed the 'spacing' prop to be set. Utility icons only
  support 'none' spacing and the prop type has been removed"

## 22.3.0

### Minor Changes

- [#95202](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/95202)
  [`80507e249e92`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/80507e249e92) -
  Adds new experimental icons at the entrypoints @atlaskit/icon/core/\* and
  @atlaskit/icon/utility/\*, as well as a new IconTile component (compatible with global icons).

  These new components are experimental, and subject to change or removal in minor or patch
  releases.

### Patch Changes

- Updated dependencies

## 22.2.0

### Minor Changes

- [#98193](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/98193)
  [`d34711ffc0a5`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d34711ffc0a5) -
  Add support for React 18 in non-strict mode.

## 22.1.1

### Patch Changes

- [#74633](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74633)
  [`fc09be1a0b9e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fc09be1a0b9e) -
  Fix bug where archive, arrow-left, mobile, editor/file-preview and editor/remove-emoji rendered
  with a 1% opacity white rectangle behind the glyph

## 22.1.0

### Minor Changes

- [#74631](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74631)
  [`3e6dcb8e92d6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3e6dcb8e92d6) -
  Adds new `teams` icon

## 22.0.2

### Patch Changes

- [#64934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64934)
  [`532734a858a1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/532734a858a1) -
  Update to internal metadata order, following update of @atlaskit/icon-build-process

## 22.0.1

### Patch Changes

- [#72130](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72130)
  [`b037e5451037`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b037e5451037) -
  Update new button text color fallback for default theme (non-token) to match that of old button
  current text color

## 22.0.0

### Major Changes

- [#41812](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41812)
  [`48b3b440f51`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48b3b440f51) - Removed
  all remaining legacy theming logic from the Icon and ProgressIndicator components.

## 21.12.8

### Patch Changes

- [#42106](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42106)
  [`f4b2c484864`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4b2c484864) - Improve
  typing and prop naming in icon explorer utility.

## 21.12.7

### Patch Changes

- [#38199](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38199)
  [`8a5ce2c105e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a5ce2c105e) - This
  package is now onboarded onto the product push model.Th

## 21.12.6

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754)
  [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use
  `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility
  testing.

## 21.12.5

### Patch Changes

- [#35441](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35441)
  [`599bfe90ee3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/599bfe90ee3) - Internal
  change to use shape tokens. There is no expected visual change.

## 21.12.4

### Patch Changes

- [#33652](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33652)
  [`e7ea6832ad2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7ea6832ad2) - Bans the
  use of React.FC/React.FunctionComponent type in ADS components as part of the React 18 migration
  work. The change is internal only and should not introduce any changes for the component
  consumers.

## 21.12.3

### Patch Changes

- [#32935](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32935)
  [`b1bdec7cce2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b1bdec7cce2) - Internal
  change to enforce token usage for spacing properties. There is no expected visual or behaviour
  change.

## 21.12.2

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793)
  [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure
  legacy types are published for TS 4.5-4.8

## 21.12.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649)
  [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade
  Typescript from `4.5.5` to `4.9.5`

## 21.12.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258)
  [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip
  minor dependency bump

### Patch Changes

- Updated dependencies

## 21.11.5

### Patch Changes

- Updated dependencies

## 21.11.4

### Patch Changes

- Updated dependencies

## 21.11.3

### Patch Changes

- Updated dependencies

## 21.11.2

### Patch Changes

- Updated dependencies

## 21.11.1

### Patch Changes

- [#25860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25860)
  [`88a34a8c2dd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88a34a8c2dd) - Remove
  redundant `role=presentation` on wrapping @atlaskit/icon and @atlaskit/logo spans.
- [`15d704e3090`](https://bitbucket.org/atlassian/atlassian-frontend/commits/15d704e3090) - For an
  SVG icon, do not render a `aria-label` when empty.

## 21.11.0

### Minor Changes

- [#24710](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24710)
  [`a3973745679`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a3973745679) - Updates
  `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behavior change.

## 21.10.8

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874)
  [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade
  Typescript from `4.3.5` to `4.5.5`

## 21.10.7

### Patch Changes

- Updated dependencies

## 21.10.6

### Patch Changes

- Updated dependencies

## 21.10.5

### Patch Changes

- Updated dependencies

## 21.10.4

### Patch Changes

- Updated dependencies

## 21.10.3

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752)
  [`58884c2f6c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58884c2f6c1) - Internal
  code change turning on a new linting rule.

## 21.10.2

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Updates
  usage of deprecated token names so they're aligned with the latest naming conventions. No UI or
  visual changes
- Updated dependencies

## 21.10.1

### Patch Changes

- Updated dependencies

## 21.10.0

### Minor Changes

- [#17576](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17576)
  [`1c835620aa5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1c835620aa5) -
  **Note**: It is a re-release of the wrongly `patched` version `21.9.2` that should have been a
  `minor` release.

  CETI-16 added remove emoji icon so that it appears in mobilekit too

### Patch Changes

- Updated dependencies

## 21.9.3

### Patch Changes

- [#17475](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/17475)
  [`c55c736ecea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c55c736ecea) - Patch
  VULN AFP-3486 AFP-3487 AFP-3488 AFP-3489

## 21.9.2

### Minor Changes

_WRONG RELEASE TYPE - DON'T USE_

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998)
  [`229177bb85d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/229177bb85d) - CETI-16
  added remove emoji icon so that it appears in mobilekit too

### Patch Changes

- [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds
  for this package now pass through a tokens babel plugin, removing runtime invocations of the
  tokens() function and improving bundle size.
- Updated dependencies

## 21.9.1

### Patch Changes

- Updated dependencies

## 21.9.0

### Minor Changes

- [#14319](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14319)
  [`cf853e39278`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cf853e39278) - [ux] add
  single layout support for layout

### Patch Changes

- Updated dependencies

## 21.8.1

### Patch Changes

- Updated dependencies

## 21.8.0

### Minor Changes

- [#13864](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13864)
  [`22b8dd3f590`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22b8dd3f590) -
  Instrumented Icon with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in
  alpha). These changes are intended to be interoperable with the legacy theme implementation.
  Legacy dark mode users should expect no visual or breaking changes.

- [`88ff832bd2b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88ff832bd2b) - Add
  @atlaskit/icon/glyph/editor/file-preview to atlaskit/icon package for media group toolbar

### Patch Changes

- Updated dependencies

## 21.7.4

### Patch Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302)
  [`af4bca32ad4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af4bca32ad4) - Internal
  changes to supress eslint rules.

## 21.7.3

### Patch Changes

- [#12837](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12837)
  [`0d0ecc6e790`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0d0ecc6e790) - Corrects
  eslint supressions.
- [`8279380176b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8279380176b) - Internal
  code changes.
- [`9a84a3ceb82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a84a3ceb82) - Internal
  code changes.
- Updated dependencies

## 21.7.2

### Patch Changes

- [#13102](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13102)
  [`0c0c4315085`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c0c4315085) - [ux]
  Fixed a regression where Icons used static colors in High Contrast Mode when they should actually
  dynamically respond to changes to the `primaryColor` and `secondaryColor` props.

## 21.7.1

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880)
  [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump
  `@atlaskit/theme` to version `^11.3.0`.

## 21.7.0

### Minor Changes

- [#12328](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12328)
  [`662739d8c28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/662739d8c28) - Icon now
  uses internal techstack "design-system: v1" and "styling: emotion".

### Patch Changes

- [`2368dfabe46`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2368dfabe46) - fix Icon
  appearance in windows high contrast mode
- [`54b0730475e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54b0730475e) - Fixed an
  a11y bug associated with the role of the SVGIcon component. The role now correctly adapts to
  whether a user provides a label or not.

## 21.6.1

### Patch Changes

- [#11649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11649)
  [`9f5d6ed95f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f5d6ed95f0) - Added
  aria-hidden to icon wrapper when there is no label provided

## 21.6.0

### Minor Changes

- [#11113](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/11113)
  [`b9c78813d40`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9c78813d40) - Use
  named export of base icon instead of default in icon glyphs

## 21.5.1

### Patch Changes

- [#10522](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10522)
  [`72ef8bafec9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/72ef8bafec9) - Add
  "./glyph" entry point.

## 21.5.0

### Minor Changes

- [#9083](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/9083)
  [`017587eca78`](https://bitbucket.org/atlassian/atlassian-frontend/commits/017587eca78) - Icon now
  exposes an additional component `SVG` which can be used to for custom icon use cases.
- [`4203387aa43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4203387aa43) - Internal
  changes to the way Icon styles are generated. Additional types have also been exposed to match the
  glyph component.

### Patch Changes

- [`469f36d9629`](https://bitbucket.org/atlassian/atlassian-frontend/commits/469f36d9629) - Icon
  build tooling has been updated.
- [`d6580503ce9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6580503ce9) - Internal
  refactor for JSDoc annotated modules.
- [`3de10e7652e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3de10e7652e) -
  Documentation updates and fixes to types for all icon packages.
- [`d98f1bb1169`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d98f1bb1169) - Local
  build tooling improvements.

## 21.4.0

### Minor Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644)
  [`2f1a299688b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f1a299688b) - The
  `sizeOpts` type has been renamed to `Size`, available in both the `./` and `./types` entrypoints.

### Patch Changes

- [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use
  injected package name and version for analytics instead of version.json.
- [`f922302ad53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f922302ad53) - Icons no
  longer ship with the `focusable` attribute in their glyph exports. This attribute was only
  required for IE11 support. This is purely a build change and has no effect on user API.

## 21.3.0

### Minor Changes

- [#8178](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8178)
  [`b9265389fa0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9265389fa0) - Icon now
  exposes a base icon via the `@atlaskit/icon/base` entrypoint. This is used in all generated glyphs
  inside the icon package.
- [`83944ca2cf2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83944ca2cf2) - Icon now
  ships with cjs, esm, and es2019 bundles for components and utils exported in the icon package.
  Glyphs unfortunately aren't included and still only export cjs bundles.
- [`6ef8824baee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ef8824baee) - - Icon
  now uses React.memo() to stop unnecessary re-renders.
  - A bug in the types for icon sizes has been resolved

  This change also includes a number of quality of life fixes as part of lite mode.

  ### Internal changes
  - class components have been changed to functional components
  - styled-components has been removed as a peer dependency
  - @emotion/core has been added a direct dependency, base components now use emotion for styling
  - An internal gradient function `insertDynamicGradientId` has been removed from the runtime
  - Enzyme removed in favour of RTL

  ### Updating tests

  Tests that rely on `enzyme` may have issues with this update. We've mostly seen issues with one of
  the following cases.

  #### Can't find internal react test id

  Because icon is now wrapped in `memo` you won't be able to easily find it. This code will fail:

  ```js
  import BookIcon from '@atlaskit/icon/glyph/book';

  <BookIcon />;

  wrapper.find('BookIcon');
  ```

  As a fix you can add memo to the target:

  ```js
  wrapper.find('Memo(BookIcon)');
  ```

  Even better, use the test id.

  ```js
  <BookIcon testId="book-icon" />;

  wrapper.find('[data-testid="book-icon"]');
  ```

  #### Treating the icon as a button

  Icon hasn't had an `onClick` handler since many major versions. This code will fail:

  ```js
  const Example = () => <Button testId="test-id" iconBefore={<SomeGlyph />} />;

  // in some teat
  wrapper.find(SomeGlyph).click();
  // OR
  wrapper.find('SomeGlyph').click();
  ```

  As a fix you can target the button instead:

  ```jsx
  wrapper.find('[data-testid="test-id"]').click();
  ```

### Patch Changes

- [`0741b1556f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0741b1556f6) - All icon
  glpyhs are now built without inline extends helpers, reducing their bundlesize.
- [`8d6c79b9055`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d6c79b9055) - Typedefs
  of glyphs have been updated to reflect an API change that occured in version 15. For context,
  `onClick` was removed as a functional prop but it was still supported by the types. This may have
  resulted in a confusing developer experience although the fundamental behaviour has been
  consistent since version 15.

## 21.2.4

### Patch Changes

- [#7762](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7762)
  [`37afe4a0fd5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37afe4a0fd5) - [ux]
  Update Dropbox icon and arrow-left icon

## 21.2.3

### Patch Changes

- [#7425](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7425)
  [`b9f0d16300`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9f0d16300) -
  Re-generated icons using a newer version of the build process

## 21.2.2

### Patch Changes

- [#7589](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7589)
  [`c65f28c058`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c65f28c058) - Change
  codemod to return raw source if it is not transforming a file.

  Otherwise it would run prettier which can lead to some invalid syntax outputted in edge cases.
  This is likely due to an issue in either `codemod-cli` or `jscodeshift`.

## 21.2.1

### Patch Changes

- [#7458](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7458)
  [`bc896a20b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc896a20b0) - Add a
  missing codemod for the entrypoint change in 21.2.0

  ***

  **Running the codemod cli**

  To run the codemod: **You first need to have the latest version installed before you can run the
  codemod**

  `yarn upgrade @atlaskit/PACKAGE@^VERSION`

  Once upgraded, use the Atlaskit codemod-cli;

  `npx @atlaskit/codemod-cli --parser [PARSER] --extensions [FILE_EXTENSIONS] [TARGET_PATH]`

  Or run `npx @atlaskit/codemod-cli -h` for more details on usage. For Atlassians, refer to
  [this doc](https://hello.atlassian.net/wiki/spaces/AF/pages/2627171992/Codemods) for more details
  on the codemod CLI.

## 21.2.0

### Minor Changes

- [#7170](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/7170)
  [`fbdf356800`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fbdf356800) - Remove
  undocumented metadata export from main entry point. To import metadata instead do it from the
  /metadata entrypoint.

## 21.1.4

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497)
  [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export
  types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules
  compiler option. This requires version 3.8 of Typescript, read more about how we handle Typescript
  versions here: https://atlaskit.atlassian.com/get-started Also add `typescript` to
  `devDependencies` to denote version that the package was built with.

## 21.1.3

### Patch Changes

- Updated dependencies

## 21.1.2

### Patch Changes

- [#4649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4649)
  [`d6ff4c7dce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6ff4c7dce) - Removes
  unused (and incorrect) es2019 key in package.json

## 21.1.1

### Patch Changes

- [#4682](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4682)
  [`f51e6ff443`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f51e6ff443) - License
  updated to Apache 2.0 (previously under the ADG license)

## 21.1.0

### Minor Changes

- [#4424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4424)
  [`2f414dd083`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2f414dd083) - The new
  ArchiveIcon is now available to use via `import ArchiveIcon from '@atlaskit/icon/glyph/archive';`

## 21.0.3

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885)
  [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded
  to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib
  upgrade to prevent duplicates of tslib being bundled.

## 21.0.2

### Patch Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823)
  [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the
  'lodash' package instead of single-function 'lodash.\*' packages

## 21.0.1

### Patch Changes

- [#3428](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3428)
  [`db053b24d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db053b24d8) - Update all
  the theme imports to be tree-shakable

## 21.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335)
  [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially
  dropping IE11 support, from this version onwards there are no warranties of the package working in
  IE11. For more information see:
  https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 20.1.2

### Patch Changes

- [#1868](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/1868)
  [`eae51ceead`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eae51ceead) - Add mobile
  icon- Updated dependencies

## 20.1.1

### Patch Changes

- [patch][449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):

  Add a clear icon for datepicker, timepicker and datetimepicker- Updated dependencies
  [dfc4dba1b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfc4dba1b3):

- Updated dependencies
  [3940bd71f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/3940bd71f1):
- Updated dependencies
  [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies
  [f6667f2909](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6667f2909):
- Updated dependencies
  [9a534d6a74](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a534d6a74):
- Updated dependencies
  [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
  - @atlaskit/dynamic-table@13.7.4
  - @atlaskit/tooltip@15.2.6
  - @atlaskit/button@13.3.11
  - @atlaskit/logo@12.3.4
  - @atlaskit/modal-dialog@10.5.7

## 20.1.0

### Minor Changes

- [minor][fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):

  Adds test id to icon.-
  [minor][fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):

  Refactors icon to be a functional component.

### Patch Changes

- [patch][fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):

  Corrects accessibility behavior for wrapping span. It now will now:
  - conditionally set the `aria-label` if `label` is defined
  - conditionally set the `role` to either `img` if `label` is defined, or `presentation` if it is
    not defined- Updated dependencies
    [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies
  [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies
  [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon-file-type@5.0.3
  - @atlaskit/icon-object@5.0.3
  - @atlaskit/icon-priority@5.0.3
  - @atlaskit/logo@12.3.3
  - @atlaskit/button@13.3.9
  - @atlaskit/dynamic-table@13.7.2
  - @atlaskit/modal-dialog@10.5.4
  - @atlaskit/section-message@4.1.7
  - @atlaskit/textfield@3.1.9
  - @atlaskit/tooltip@15.2.5

## 20.0.2

### Patch Changes

- [patch][0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):

  The build on develop produces changes to the metadata file that needed to be tracked / released
  for consumer.- Updated dependencies
  [0b09f8a6ca](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b09f8a6ca):

- Updated dependencies
  [91a1eb05db](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a1eb05db):
  - @atlaskit/dynamic-table@13.7.0
  - @atlaskit/textfield@3.1.7

## 20.0.1

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies
  [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):
  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/button@13.3.7
  - @atlaskit/dynamic-table@13.6.2
  - @atlaskit/icon-file-type@5.0.2
  - @atlaskit/icon-object@5.0.2
  - @atlaskit/icon-priority@5.0.2
  - @atlaskit/logo@12.3.2
  - @atlaskit/modal-dialog@10.5.2
  - @atlaskit/section-message@4.1.5
  - @atlaskit/textfield@3.1.6
  - @atlaskit/theme@9.5.1
  - @atlaskit/tooltip@15.2.3

## 20.0.0

### Major Changes

- [major][c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):

  BREAKING CHANGE: As part of AFP-1404, we are dropping flow support. It means that those packages
  are not typed. Consumer will need to manually add their types to the component.Background ticket:
  https://product-fabric.atlassian.net/browse/AFP-1397Plan:
  https://product-fabric.atlassian.net/wiki/spaces/AFP/pages/1052870901/Drop+Flow+Support+Plan

### Patch Changes

- @atlaskit/logo@12.3.1
- @atlaskit/modal-dialog@10.5.1
- @atlaskit/section-message@4.1.4
- @atlaskit/docs@8.3.1
- @atlaskit/button@13.3.6
- @atlaskit/textfield@3.1.5
- @atlaskit/tooltip@15.2.2

## 19.1.0

### Minor Changes

- [minor][28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

  Added person-with-circle, person-with-cross, person-with-tick icons

### Patch Changes

- Updated dependencies
  [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies
  [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
  - @atlaskit/theme@9.5.0
  - @atlaskit/button@13.3.5
  - @atlaskit/dynamic-table@13.6.1
  - @atlaskit/section-message@4.1.3
  - @atlaskit/tooltip@15.2.1

## 19.0.11

### Patch Changes

- [patch][c1d4898af5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1d4898af5):

  Added Stopwatch and Sprint icons

- Updated dependencies
  [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies
  [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
  - @atlaskit/theme@9.3.0

## 19.0.10

### Patch Changes

- [patch][6d37081dc8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d37081dc8):

  Upgrade prettier from 1.18 to 1.19

## 19.0.9

### Patch Changes

- [patch][f081cdac54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f081cdac54):

  Upgrade prettier from 1.14 to 1.18

## 19.0.8

### Patch Changes

- [patch][f9b5e24662](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9b5e24662):

  @atlaskit/icon-file-type and @atlaskit/icon-object have been converted to TypeScript to provide
  static typing. Flow types are no longer provided. No API or bahavioural changes.

## 19.0.7

### Patch Changes

- [patch][3c7bee089a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c7bee089a):

  @atlaskit/icon-priority has been converted to TypeScript to provide static typing. Flow types are
  no longer provided. No API or bahavioural changes.

## 19.0.6

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving
  non-relative imports as relative imports

## 19.0.5

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 19.0.4

### Patch Changes

- [patch][708028db86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/708028db86):

  Change all the imports to theme in Core to use multi entry points

## 19.0.3

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 19.0.2

- Updated dependencies
  [84887b940c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84887b940c):
  - @atlaskit/modal-dialog@10.1.2
  - @atlaskit/textfield@3.0.0

## 19.0.1

### Patch Changes

- [patch][a1a4c19100](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a1a4c19100):

  include bundled cjs files

## 19.0.0

### Major Changes

- [major][06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):

  @atlaskit/icon has been converted to TypeScript to provide static typing. Flow types are no longer
  provided. No API or bahavioural changes.

## 18.0.5

### Patch Changes

- [patch][56eae512a3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56eae512a3):

  Updated the icon for Premium and cleaned up reduced-ui-pack sprite

## 18.0.4

### Patch Changes

- [patch][4615439434](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4615439434):

  index.ts will now be ignored when publishing to npm

## 18.0.3

### Patch Changes

- [patch][93bcf314c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93bcf314c6):

  Added missing tslib dep

## 18.0.2

### Patch Changes

- [patch][0d7be7e6fc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0d7be7e6fc):

  All icons are breaking since the Typescript conversion. Revert PR 5769#

## 18.0.1

- Updated dependencies
  [67f06f58dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67f06f58dd):
  - @atlaskit/icon-file-type@4.0.3
  - @atlaskit/icon-object@4.0.3
  - @atlaskit/icon-priority@4.0.3
  - @atlaskit/tooltip@15.0.0

## 18.0.0

### Major Changes

- [major][cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/icon has been converted to TypeScript to provide static typing. Flow types are no
    longer provided. No API or bahavioural changes.

## 17.2.0

- [minor][70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):
  - Checkbox has been converted to Typescript. Typescript consumers will now get static type safety.
    Flow types are no longer provided. No API or behavioural changes.

## 17.1.3

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):
  - This is just a safety release in case anything strange happened in in the previous one. See Pull
    Request #5942 for details

## 17.1.2

- Updated dependencies
  [06c5cccf9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c5cccf9d):
  - @atlaskit/icon-file-type@4.0.1
  - @atlaskit/icon-object@4.0.1
  - @atlaskit/icon-priority@4.0.1
  - @atlaskit/modal-dialog@10.0.0

## 17.1.1

- Updated dependencies
  [6dd86f5b07](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6dd86f5b07):
  - @atlaskit/field-text@9.0.1
  - @atlaskit/theme@9.0.2
  - @atlaskit/section-message@4.0.0

## 17.1.0

- [minor][8f4f5d914a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f4f5d914a):
  - Updated home-circle icon and replaced home-filled icon with new home icon

## 17.0.2

- Updated dependencies
  [4b07b57640](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b07b57640):
  - @atlaskit/button@13.0.2
  - @atlaskit/logo@12.0.0

## 17.0.1

- Updated dependencies
  [3d95467c4b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3d95467c4b):
  - @atlaskit/dynamic-table@13.0.0

## 17.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):
  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use
    this package, please ensure you use at least this version of react and react-dom.

## 16.0.9

- Updated dependencies
  [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/dynamic-table@11.0.3
  - @atlaskit/field-text@8.0.3
  - @atlaskit/icon-file-type@3.0.8
  - @atlaskit/icon-object@3.0.8
  - @atlaskit/icon-priority@3.0.5
  - @atlaskit/logo@10.0.4
  - @atlaskit/modal-dialog@8.0.7
  - @atlaskit/section-message@2.0.3
  - @atlaskit/tooltip@13.0.4
  - @atlaskit/theme@8.1.7

## 16.0.8

- Updated dependencies
  [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/dynamic-table@11.0.2
  - @atlaskit/field-text@8.0.2
  - @atlaskit/icon-file-type@3.0.7
  - @atlaskit/icon-object@3.0.7
  - @atlaskit/icon-priority@3.0.4
  - @atlaskit/logo@10.0.3
  - @atlaskit/modal-dialog@8.0.6
  - @atlaskit/section-message@2.0.2
  - @atlaskit/theme@8.1.6
  - @atlaskit/tooltip@13.0.3
  - @atlaskit/button@12.0.0

## 16.0.7

- [patch][a143c9758f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a143c9758f):
  - New Icon: Add the PremiumIcon

## 16.0.6

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):
  - Removes duplicate babel-runtime dependency

## 16.0.5

- Updated dependencies
  [9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):
  - @atlaskit/docs@7.0.1
  - @atlaskit/dynamic-table@11.0.1
  - @atlaskit/field-text@8.0.1
  - @atlaskit/icon-file-type@3.0.5
  - @atlaskit/icon-object@3.0.5
  - @atlaskit/icon-priority@3.0.2
  - @atlaskit/logo@10.0.1
  - @atlaskit/modal-dialog@8.0.2
  - @atlaskit/section-message@2.0.1
  - @atlaskit/theme@8.0.1
  - @atlaskit/tooltip@13.0.1
  - @atlaskit/button@11.0.0

## 16.0.4

- Updated dependencies
  [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon-file-type@3.0.4
  - @atlaskit/icon-object@3.0.4
  - @atlaskit/icon-priority@3.0.1
  - @atlaskit/docs@7.0.0
  - @atlaskit/dynamic-table@11.0.0
  - @atlaskit/field-text@8.0.0
  - @atlaskit/logo@10.0.0
  - @atlaskit/modal-dialog@8.0.0
  - @atlaskit/section-message@2.0.0
  - @atlaskit/theme@8.0.0
  - @atlaskit/tooltip@13.0.0

## 16.0.3

- Updated dependencies
  [ecf21be58f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecf21be58f):
  - @atlaskit/icon-priority@3.0.0

## 16.0.2

- Updated dependencies
  [a2653f4453](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2653f4453):
  - @atlaskit/icon-priority@2.0.0

## 16.0.1

- [patch][6b5daa8080](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6b5daa8080):
  - Added the new Status icon

## 16.0.0

- [major][d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - Moved the priority icons to its own package.
  - Check the [Upgrade Guide](https://atlaskit.atlassian.com/packages/core/icon/docs/upgrade-guide)
    for more information.

- Updated dependencies
  [d0333acfba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0333acfba):
  - @atlaskit/icon-priority@1.0.0

## 15.0.3

- [patch][1d1f6d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d1f6d1):
  - Make icon glyphs not import metadata

## 15.0.2

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/dynamic-table@10.0.22
  - @atlaskit/field-text@7.0.18
  - @atlaskit/icon-file-type@3.0.2
  - @atlaskit/icon-object@3.0.2
  - @atlaskit/logo@9.2.6
  - @atlaskit/modal-dialog@7.1.1
  - @atlaskit/section-message@1.0.14
  - @atlaskit/theme@7.0.1
  - @atlaskit/tooltip@12.1.13
  - @atlaskit/docs@6.0.0

## 15.0.1

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/dynamic-table@10.0.20
  - @atlaskit/field-text@7.0.16
  - @atlaskit/icon-file-type@3.0.1
  - @atlaskit/icon-object@3.0.1
  - @atlaskit/logo@9.2.5
  - @atlaskit/modal-dialog@7.0.14
  - @atlaskit/section-message@1.0.13
  - @atlaskit/tooltip@12.1.12
  - @atlaskit/theme@7.0.0

## 15.0.0

- [major][ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - Removed onClick prop as icon is only a presentational placeholder. Please wrap your icon in a
    Button or a Link component and add onClick to that instead.

## 14.6.1

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/dynamic-table@10.0.18
  - @atlaskit/field-text@7.0.15
  - @atlaskit/icon-file-type@2.0.1
  - @atlaskit/icon-object@2.0.1
  - @atlaskit/logo@9.2.4
  - @atlaskit/modal-dialog@7.0.12
  - @atlaskit/section-message@1.0.11
  - @atlaskit/theme@6.2.1
  - @atlaskit/tooltip@12.1.10
  - @atlaskit/button@10.0.0

## 14.6.0

- [minor][29968f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29968f4):
  - Add a menu expand icon

## 14.5.0

- [minor][f5e26e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f5e26e1):
  - Add a retry icon

## 14.4.0

- [patch][29b160f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29b160f):
  - Simplify the icons build process

  Icons no longer need a custom `build` step to be accurate on npm. This has come about by renaming
  the `es5` folder to `cjs`. If you weren't reaching into our package's internals, you shouldn't
  notice.

- [minor][62a7c37](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/62a7c37):
  - Add metadata export

  In trying to align the icons packages, the core `@atlaskit/icon` package now exports `metadata`,
  which includes information about every icon in this package.

- Updated dependencies [b29bec1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b29bec1):
- Updated dependencies [80304f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80304f0):
  - @atlaskit/icon-file-type@2.0.0
  - @atlaskit/icon-object@2.0.0
  - @atlaskit/icon-build-process@0.1.0

## 14.3.0

- [minor][dced9bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dced9bf):
  - Remove StarOutlineIcon as it is not used

## 14.2.1

- [patch][d15caa6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d15caa6):
  - adding editor image alignment icons

## 14.2.0

- [minor][fe3c283](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fe3c283" d):
  - ED-5600: add icons for new table ux

## 14.1.0

- [minor] Add drag-handler [b0a64d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0a64d6)

## 14.0.3

- [patch] Update to use babel-7 for build processes
  [e7bb74d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7bb74d)

## 14.0.2

- [patch] Adds missing implicit @babel/runtime dependency
  [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 14.0.1

- [patch] Change devDependency on sectionMessage to caret dependency
  [91a3ced](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/91a3ced)

## 14.0.0

- [major] Remove product logo icons from icons, recommend using @atlaskit/logo instead
  [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - The following logo exports have been removed:
    - AtlassianIcon
    - BitbucketIcon
    - ConfluenceIcon
    - HipchatIcon
    - JiraCoreIcon
    - JiraServiceDeskIcon
    - JiraSoftwareIcon
    - JiraIcon
    - StatuspageIcon
    - StrideIcon
  - Check the [Upgrade Guide](https://atlaskit.atlassian.com/packages/core/icon/docs/upgrade-guide)
    for more information.
- [patch] Updated dependencies
  [709b239](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/709b239)
  - @atlaskit/icon-file-type@1.0.0
  - @atlaskit/icon-object@1.0.0

## 13.9.0

- [minor] Add like icon [cd71c5f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cd71c5f)

## 13.8.1

- [patch] Updated dependencies
  [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/tooltip@12.0.14
  - @atlaskit/modal-dialog@7.0.0

## 13.8.0

- [minor] Add the questions icon
  [ad96a89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ad96a89)

## 13.7.0

- [minor] Add and edit star icons
  [55e3ec7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/55e3ec7)

## 13.6.1

- [patch] Adds sideEffects: false to allow proper tree shaking
  [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 13.6.0

- [minor] Add static displayName prop to all icons. This results in accurate display names even
  after minifying and uglifying the icon variable names.
  [a75db9d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a75db9d)

## 13.5.0

- [minor] Add the new child-issues icon
  [8d3f8dd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d3f8dd)

## 13.4.0

- [minor] Add the new check circle outline
  [22af4c5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22af4c5)

## 13.3.0

- [minor] Add new icon [d36f760](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d36f760)
- [patch] Add new icon for Roadmap
  [7cf05b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cf05b3)

## 13.2.6

- [patch] Update warning message and fix test for reduced-ui-pack
  [4b166d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b166d8)
- [none] Updated dependencies
  [4b166d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b166d8)

## 13.2.5

- [patch] Updated dependencies
  [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/modal-dialog@6.0.9
  - @atlaskit/field-text@7.0.6
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 13.2.4

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions
  read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies
  [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/modal-dialog@6.0.6
  - @atlaskit/field-text@7.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3

## 13.2.3

- [patch] Added pointer-events: none targeting the `<svg>` element within the Icon component to
  prevent type errors in JS [b755d8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b755d8a)
- [none] Updated dependencies
  [b755d8a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b755d8a)

## 13.2.2

- [patch] Updated dependencies
  [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/field-text@7.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/modal-dialog@6.0.5

## 13.2.1

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies
  [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/tooltip@12.0.3
  - @atlaskit/modal-dialog@6.0.4
  - @atlaskit/field-text@7.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1

## 13.2.0

- [minor] Add Layout Type icons for the Editor. ED-4196
  [259ef37](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/259ef37)
- [none] Updated dependencies
  [259ef37](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/259ef37)

## 13.1.1

- [patch] Updated dependencies
  [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0

## 13.1.0

- [minor] Add a new star large icon
  [5dd7d0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5dd7d0e)
- [none] Updated dependencies
  [5dd7d0e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5dd7d0e)

## 13.0.0

- [major] Updates to React ^16.4.0
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies
  [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies
  [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0

## 12.8.0

- [minor] Add new media viewer icons and replace existing ones
  [623a2a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623a2a0)
- [none] Updated dependencies
  [623a2a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/623a2a0)

## 12.7.0

- [minor] Add chevron large icons
  [086b5d7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/086b5d7)
- [none] Updated dependencies
  [086b5d7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/086b5d7)

## 12.6.2

- [patch] Prevent icons shrinking when they are flex-children
  [a78cd4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a78cd4d)
- [none] Updated dependencies
  [a78cd4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a78cd4d)

## 12.6.1

- [patch] Remove or update \$FlowFixMe
  [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies
  [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/field-text@6.1.1
  - @atlaskit/button@8.2.4
  - @atlaskit/modal-dialog@5.2.6

## 12.6.0

- [minor] Add a new badge id: department and suitcase
  [e46ff5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e46ff5e)
- [none] Updated dependencies
  [e46ff5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e46ff5e)

## 12.5.1

- [patch] Update to select-clear icon to allow for primaryColor and secondaryColor configuration
  [216b20d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/216b20d)
- [none] Updated dependencies
  [216b20d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/216b20d)

## 12.5.0

- [minor] Added select-clear icon
  [91ab036](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/91ab036)
- [none] Updated dependencies
  [91ab036](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/91ab036)

## 12.4.0

- [minor] Add the new app-switcher icon
  [8c0cacd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c0cacd)
- [none] Updated dependencies
  [8c0cacd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8c0cacd)

## 12.3.1

- [patch] Fix \$FlowFixMe and release packages
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies
  [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/tooltip@10.3.1
  - @atlaskit/modal-dialog@5.2.5
  - @atlaskit/button@8.2.2

## 12.3.0

- [minor] Object icons color updated and adding file types icons
  [c49ce0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c49ce0b)
- [none] Updated dependencies
  [c49ce0b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c49ce0b)

## 12.2.0

- [minor] Fixes types for Flow 0.74
  [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [none] Updated dependencies
  [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
  - @atlaskit/tooltip@10.3.0
  - @atlaskit/button@8.2.0

## 12.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies
  [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/modal-dialog@5.2.2
  - @atlaskit/field-text@6.0.4
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4

## 12.1.1

- [patch] Update changelogs to remove duplicate
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies
  [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/modal-dialog@5.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 12.1.0

- [none] Updated dependencies
  [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/modal-dialog@5.1.0
  - @atlaskit/tooltip@10.2.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/field-text@6.0.2
  - @atlaskit/button@8.1.0

## 12.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies
  [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/tooltip@10.0.1
  - @atlaskit/modal-dialog@5.0.1
  - @atlaskit/field-text@6.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 12.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to
  ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies
  [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/modal-dialog@5.0.0
  - @atlaskit/field-text@6.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 11.4.0

- [minor] Update emoji and add no-image
  [620557e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/620557e)
- [none] Updated dependencies
  [620557e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/620557e)

## 11.3.2

- [patch] Update readme to be in line with other atlaskit readmes
  [75f016c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75f016c)
- [none] Updated dependencies
  [75f016c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75f016c)

## 11.3.1

- [patch] Fix unit tests [22337bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22337bd)
- [patch] Update for label with white background
  [a0d7ed7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0d7ed7)
- [patch] Fix whitebackground for label
  [b8eb930](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8eb930)
- [patch] Fix white background for label
  [229a63c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/229a63c)
- [none] Updated dependencies
  [22337bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22337bd)
- [none] Updated dependencies
  [a0d7ed7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0d7ed7)
- [none] Updated dependencies
  [b8eb930](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8eb930)
- [none] Updated dependencies
  [229a63c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/229a63c)

## 11.3.0

- [minor] FS-1580 add new atlassian emoji
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
- [patch] Updated dependencies
  [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/modal-dialog@4.0.5
  - @atlaskit/field-text@5.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 11.2.0

- [minor] Add divider from editor
  [5cbb8a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5cbb8a6)
- [minor] Add divider fabric icon
  [8b794ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b794ed)
- [minor] Add divider icon from fabric
  [c8adb64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8adb64)
- [none] Updated dependencies
  [5cbb8a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5cbb8a6)
- [none] Updated dependencies
  [8b794ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8b794ed)
- [none] Updated dependencies
  [c8adb64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8adb64)

## 11.1.0

- [minor] Add label icon [72baa86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/72baa86)
- [minor] Add a new label icon
  [1afe4fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1afe4fe)

## 11.0.1

- [patch] ED-4228 adding icons for table floating toolbar advance options.
  [b466410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b466410)

## 11.0.0

- [major] Bump to React 16.3.
  [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 10.13.0

- [minor] Add indeterminate checkbox icon
  [27f4e40](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27f4e40)

## 10.12.2

- [patch] add horizontal rule toolbar item
  [48c36f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48c36f4)

## 10.12.1

- [patch] Re-releasing due to potentially broken babel release
  [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 10.12.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3
  [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 10.11.0

- [minor] Create skeleton representations of various components
  [cd628e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cd628e4)

## 10.10.1

- [patch] update atlaskit src for internal consumption
  [4601bf0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4601bf0)

## 10.10.0

- [minor] Added 42 new icons for Objects
  [e00ff79](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e00ff79)

## 10.9.3

- [patch] removed role props to make it more accessible
  [88cc276](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/88cc276)

## 10.9.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2
  [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 10.9.1

- [patch] Packages Flow types for elements components
  [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 10.9.0

- [minor] New emoji-add icon
  [b8b1b51](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8b1b51)

## 10.8.0

- [minor] added editor/success icon, updated a few other editor icons
  [911074c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/911074c)

## 10.7.1

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website,
  \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 10.7.0

- [minor] Add React 16 support.
  [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 10.6.0

- [minor] Updated switcher icon
  [2815441](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2815441)

## 10.5.0

- [minor] Move icon and reduced-ui pack to new repo, update build process
  [b3977f3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b3977f3)

## 10.4.0 (2017-12-08)

- feature; added new media layout icons for the editor (issues closed: ak-4012)
  ([ee770f5](https://bitbucket.org/atlassian/atlaskit/commits/ee770f5))

## 10.3.3 (2017-12-05)

- bug fix; fix product icon gradients not appearing with default icon colour
  ([013f52a](https://bitbucket.org/atlassian/atlaskit/commits/013f52a))
- bug fix; fix icon gradients not applying properly in safari in some cases (issues closed: ak-3744)
  ([e35edf8](https://bitbucket.org/atlassian/atlaskit/commits/e35edf8))

## 10.3.2 (2017-11-23)

- bug fix; remove theme package direct references
  ([0f99302](https://bitbucket.org/atlassian/atlaskit/commits/0f99302))

## 10.3.1 (2017-11-20)

- bug fix; fS-3907 Use content attribute instead of description for Tooltip
  ([25c9604](https://bitbucket.org/atlassian/atlaskit/commits/25c9604))
- bug fix; fS-3907 Bump tooltip version in icon, item and util-shared-styles
  ([6d20540](https://bitbucket.org/atlassian/atlaskit/commits/6d20540))

## 10.3.0 (2017-11-16)

- feature; new and updated icons for the editor (issues closed: ak-3720)
  ([2c709e2](https://bitbucket.org/atlassian/atlaskit/commits/2c709e2))

## 10.2.0 (2017-11-15)

- feature; added a new prop for icons to make them more performant.
  ([7dc38f7](https://bitbucket.org/atlassian/atlaskit/commits/7dc38f7))
- feature; icon component performance improved and the glyph can now be passed as a string.
  ([317274c](https://bitbucket.org/atlassian/atlaskit/commits/317274c))

## 10.1.3 (2017-11-09)

- bug fix; add missing color props
  ([f186c02](https://bitbucket.org/atlassian/atlaskit/commits/f186c02))

## 10.1.2 (2017-10-26)

- bug fix; fix to rebuild stories
  ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 10.1.1 (2017-10-22)

- bug fix; update styled component dependency and react peerDep
  ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))

## 10.1.0 (2017-10-10)

- feature; added 8 new icons, updated 4 others (issues closed: ak-3590)
  ([0cff900](https://bitbucket.org/atlassian/atlaskit/commits/0cff900))

## 10.0.0 (2017-09-25)

- breaking; Removing the "editor/expand" icon. Use the appropriate chevron-up/chevron-down icons
  instead. ([dc2f175](https://bitbucket.org/atlassian/atlaskit/commits/dc2f175))
- breaking; removing the "expand" icon in preference to using the chevron ones instead (issues
  closed: ak-2157) ([dc2f175](https://bitbucket.org/atlassian/atlaskit/commits/dc2f175))

## 9.0.1 (2017-09-15)

- bug fix; removed glitched path from the People icon (issues closed: ak-3524)
  ([bb1da8a](https://bitbucket.org/atlassian/atlaskit/commits/bb1da8a))

## 9.0.0 (2017-09-11)

- breaking; The company/product icons (AtlassianIcon, BitbucketIcon, ConfluenceIcon, HipchatIcon,
  JiraIcon) have ([8a502b1](https://bitbucket.org/atlassian/atlaskit/commits/8a502b1))
- breaking; new company and product icons added
  ([8a502b1](https://bitbucket.org/atlassian/atlaskit/commits/8a502b1))

## 8.1.0 (2017-08-28)

- feature; added switcher icon back
  ([de848a6](https://bitbucket.org/atlassian/atlaskit/commits/de848a6))

## 8.0.1 (2017-08-21)

- bug fix; fix PropTypes warning
  ([040d579](https://bitbucket.org/atlassian/atlaskit/commits/040d579))

## 8.0.0 (2017-08-17)

- bug fix; fixing the devDep for icon on itself
  ([b3db177](https://bitbucket.org/atlassian/atlaskit/commits/b3db177))
- bug fix; fixed icon build script
  ([10aea52](https://bitbucket.org/atlassian/atlaskit/commits/10aea52))
- feature; updated stories for icons and updated the build step for reduced-ui-pack icons
  ([0ad9eea](https://bitbucket.org/atlassian/atlaskit/commits/0ad9eea))
- breaking; Some icons have been deleted, and some are now 2-colours
  ([733dbd3](https://bitbucket.org/atlassian/atlaskit/commits/733dbd3))
- breaking; icon audit and improvement
  ([733dbd3](https://bitbucket.org/atlassian/atlaskit/commits/733dbd3))

## 7.1.0 (2017-08-11)

- bug fix; make theme import absolute
  ([5ef8926](https://bitbucket.org/atlassian/atlaskit/commits/5ef8926))
- feature; support dark mode ([6701273](https://bitbucket.org/atlassian/atlaskit/commits/6701273))

## 7.0.2 (2017-07-24)

- fix; use class transform in loose mode in babel to improve load performance in apps
  ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))
- fix; icons no longer grow massively in Webkit or when font size bumped
  ([adfb57e](https://bitbucket.org/atlassian/atlaskit/commits/adfb57e))

## 7.0.1 (2017-06-28)

- fix; changed icon wrapper display from inline-flex to inline-block
  ([64dc3de](https://bitbucket.org/atlassian/atlaskit/commits/64dc3de))

## 7.0.0 (2017-06-08)

- fix; refactored icon module and build process
  ([a68abba](https://bitbucket.org/atlassian/atlaskit/commits/a68abba))
- breaking; Module no longer exports named exports. Import a specific icon like so: import
  AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
- ISSUES CLOSED: AK-2388

## 6.6.0 (2017-05-31)

- fix; add prop-types as a dependency to avoid React 15.x warnings
  ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- feature; added log-in icon to [@atlaskit](https://github.com/atlaskit)/icon and
  [@atlaskit](https://github.com/atlaskit)/reduced-ui-pack
  ([aa72586](https://bitbucket.org/atlassian/atlaskit/commits/aa72586))

## 6.5.4 (2017-05-12)

- fix; add package name and version to the hashing of classnames in
  [@atlaskit](https://github.com/atlaskit)/icon to preve
  ([a28bfe5](https://bitbucket.org/atlassian/atlaskit/commits/a28bfe5))

## 6.5.3 (2017-05-10)

- fix; do not import whole icon in media-card
  ([cc5ec63](https://bitbucket.org/atlassian/atlaskit/commits/cc5ec63))

## 6.5.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license.
  ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 6.4.0 (2017-04-26)

- fix; fixed bug in the new ExampleWithCode story type
  ([f30a4d3](https://bitbucket.org/atlassian/atlaskit/commits/f30a4d3))
- fix; checkbox icon now correctly a 2-colour icon again
  ([470642e](https://bitbucket.org/atlassian/atlaskit/commits/470642e))
- fix; icon SVG files updated. Fills made to be transparent for 2-color icons, and some ico
  ([264bb97](https://bitbucket.org/atlassian/atlaskit/commits/264bb97))
- fix; update legal copy and fix broken links for component README on npm. New contribution and
  ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))
- feature; Adds switcher icon ([220cc33](https://bitbucket.org/atlassian/atlaskit/commits/220cc33))
- feature; icons now have a primaryColor and secondaryColor prop
  ([9768e00](https://bitbucket.org/atlassian/atlaskit/commits/9768e00))

## 6.3.2 (2017-04-24)

- fix; fixing improper PropType for a prop 'glyph'
  ([cff41c5](https://bitbucket.org/atlassian/atlaskit/commits/cff41c5))

## 6.3.1 (2017-04-20)

- fix; fixes regressions where styles werent being loaded causing sizing to be broken
  ([1de6d0c](https://bitbucket.org/atlassian/atlaskit/commits/1de6d0c))

## 6.3.0 (2017-04-20)

- feature; removed explicit style! imports, set style-loader in webpack config
  ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 6.1.0 (2017-04-19)

- feature; refactoring Icon to reduce bundle size and code complexity
  ([43c61f5](https://bitbucket.org/atlassian/atlaskit/commits/43c61f5))

## 6.0.1 (2017-04-18)

- fix; update icon stories to use new readme component
  ([1cdfa6d](https://bitbucket.org/atlassian/atlaskit/commits/1cdfa6d))
- feature; add media services scale large and small icons
  ([3bd9d86](https://bitbucket.org/atlassian/atlaskit/commits/3bd9d86))

## 5.0.0 (2017-03-28)

- fix; remove icon baseline alignment story
  ([876c682](https://bitbucket.org/atlassian/atlaskit/commits/876c682))
- fix; use new 24px artboard size in 'too big' story
  ([404e6e0](https://bitbucket.org/atlassian/atlaskit/commits/404e6e0))
- feature; bulk icon update ([76367b5](https://bitbucket.org/atlassian/atlaskit/commits/76367b5))
- feature; update default icon sizes
  ([90850bd](https://bitbucket.org/atlassian/atlaskit/commits/90850bd))
- breaking; default SVG artboard sizes are now 24px, with some icons such as editor on the 16px
  artboard.
- breaking; icons are no longer guaranteed to baseline-align with sibling content. use flexbox to
  control alignment.
- ISSUES CLOSED: AK-1924
- breaking; This icon released contains a large amount of breaking naming changes due to deletions
  and renames. Please update to this new major version and ensure your application is using the
  correct icon exports via linting.
- ISSUES CLOSED: AK-1924

## 3.0.3 (2017-03-23)

- fix; Empty commit to release the component
  ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))
- feature; icon sizes changed to be on grid
  ([f6748ea](https://bitbucket.org/atlassian/atlaskit/commits/f6748ea))
- breaking; Icon sizes changed. This does not change the default sizes, only the ones when there is
  a size prop specified.
- ISSUES CLOSED: AK-1515

## 3.0.1 (2017-03-21)

- fix; maintainers for all the packages were added
  ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 3.0.0 (2017-03-03)

- feature; move service desk icons out of the servicedesk directory
  ([f959e6b](https://bitbucket.org/atlassian/atlaskit/commits/f959e6b))
- breaking; Service desk icons now live in the root icons directory
- ISSUES CLOSED: AK-1858

## 2.5.5 (2017-02-28)

- fix; dummy commit to release stories
  ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 2.5.3 (2017-02-28)

- fix; dummy commit to fix broken stories and missing registry pages
  ([a31e92a](https://bitbucket.org/atlassian/atlaskit/commits/a31e92a))

## 2.5.3 (2017-02-28)

- fix; dummy commit to release stories for components
  ([a105c02](https://bitbucket.org/atlassian/atlaskit/commits/a105c02))

## 2.5.2 (2017-02-28)

- fix; removes jsdoc annotations from icons and removes scripts used to generate Icons.md
  ([e5302a0](https://bitbucket.org/atlassian/atlaskit/commits/e5302a0))

## 2.5.1 (2017-02-27)

- fix; update flag's icon dependency to latest
  ([32885ce](https://bitbucket.org/atlassian/atlaskit/commits/32885ce))

## 2.4.3 (2017-02-20)

- fix; change directory icon specific names to generic icon names
  ([13bb38a](https://bitbucket.org/atlassian/atlaskit/commits/13bb38a))

## 2.4.1 (2017-02-20)

- fix; fix fill color typo in jira/addon icon
  ([8900095](https://bitbucket.org/atlassian/atlaskit/commits/8900095))
- fix; copy in-code comment about reduced-ui-pack to readme
  ([24e2c37](https://bitbucket.org/atlassian/atlaskit/commits/24e2c37))
- fix; use correctly scoped package names in npm docs
  ([91dbd2f](https://bitbucket.org/atlassian/atlaskit/commits/91dbd2f))
- feature; add icons for directory privacy levels
  ([fb5f89b](https://bitbucket.org/atlassian/atlaskit/commits/fb5f89b))

## 2.4.0 (2017-02-16)

- feature; Force icons version bump to get mediakit icons
  ([64bf24e](https://bitbucket.org/atlassian/atlaskit/commits/64bf24e))

## 2.3.3 (2017-02-07)

- fix; Rearrange tsconfig.json organisation to allow per-package configuration.
  ([6c6992d](https://bitbucket.org/atlassian/atlaskit/commits/6c6992d))

## 2.3.1 (2017-02-06)

- fix; Updates packages to use scoped ak packages
  ([26285cb](https://bitbucket.org/atlassian/atlaskit/commits/26285cb))
- fix; Fixes invite team icon for icons
  ([3b66fd7](https://bitbucket.org/atlassian/atlaskit/commits/3b66fd7))
