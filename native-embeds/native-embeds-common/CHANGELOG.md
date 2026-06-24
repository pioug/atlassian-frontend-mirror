# @atlaskit/native-embeds-common

## 2.0.1

### Patch Changes

- Updated dependencies

## 2.0.0

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

## 1.5.0

### Minor Changes

- [`e7c06cfc71b06`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e7c06cfc71b06) -
  MAUI-590 execute remix update

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [`ffe37ecd72b10`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ffe37ecd72b10) -
  MAUI-478: Add border options to Infographic, Chart and Visualization native embed toolbar behind
  the cc-maui-experiment experiment gate.

  Users can now toggle "Add border" / "No border" from the native embed toolbar when the MAUI
  experiment is enabled. The border state is persisted as a `showBorder` macro parameter on the node
  and reflected in the embed frame.

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [`ebab8f80bfc40`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ebab8f80bfc40) -
  Autofix: add explicit package exports (barrel removal)

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [`6909e71070730`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6909e71070730) -
  Show an AI generating overlay (rainbow loading bar) on the targeted native embed while Rovo is
  processing an inline-edit prompt. Behind the `cc-maui-phase-2-loading` feature gate.

  Two-stage commit pattern so the overlay only appears once the user has actually submitted a prompt
  — not when the AI modal first opens:
  - The toolbar handler for "Ask Rovo" (`maui:onAskRovoClick`) **stages** the embed `localId` via
    the new `stageInlineRovoStreaming` action. The toolbar handler factory now propagates the
    selected node's `localId` to manifest handlers via
    `EditorToolbarHandlerContext.selectedNodeLocalId` so MAUI can stage the correct target before
    opening the AI modal.
  - `RovoPromptScreenWithLogic.onSubmit` **commits** the staged id via `commitInlineRovoStreaming`.
    This is what triggers the consumer-visible loading overlay.
  - `RovoPromptScreenWithLogic.onComplete` / `handleAbort` dispatches `endInlineRovoStreaming` to
    clear it.

  The native-embeds extension subscribes to the AI plugin's new `inlineRovoStreamingTargetId`
  shared-state field and renders the overlay when its own `localId` matches.

  The overlay component (`AIGeneratingOverlay`) is colocated inside `native-embeds-core` rather than
  extracted to a shared package. Hosting it in `@atlaskit/editor-common` (the natural shared spot)
  would create a TS6202 circular project reference because `editor-common` already depends on
  `@atlaskit/media-card`. A new leaf-level package would force workspace registrations across every
  product `package.json`, plus tsconfig project-reference updates and lockfile churn — large
  unrelated review surface for a 130-line component. When the parallel media inline-edit branch
  lands (PR #357140), the two implementations should be consolidated into a shared package below
  both consumers in the dependency graph.

  Includes reducer + consumer unit tests covering both gate-on and gate-off paths.

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- [`9e964a88958bd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9e964a88958bd) -
  Fix resize overlay placeholder height and aspect ratio calculation to use the stored `aspectRatio`
  node parameter (set from originalWidth/originalHeight during card-to-native-embed conversion)
  rather than relying solely on live DOM measurements. This ensures resize handles and the overlay
  placeholder reflect the correct proportions from the very first selection, before a resize has
  occurred. Applies to both `EmbedResizeOverlay` and `ResizableNativeEmbedLegacy`.

  Add `aspectRatio` to `NativeEmbedParameters` macroParams type so that `getParameters` and
  `setParameters` correctly serialize and deserialize the stored width-to-height ratio. This enables
  native embed containers to derive their height from the original embed dimensions without
  requiring a resize interaction.

  Fix native embed containers incorrectly defaulting to a 1:1 or 1200/600 aspect ratio on initial
  render when `aspectRatio` (originalWidth/originalHeight) is stored in the node parameters. The
  container now derives the correct height from the stored `aspectRatio` on the very first render,
  before any resize interaction occurs.

- Updated dependencies

## 1.1.0

### Minor Changes

- [`7fe1914f87802`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7fe1914f87802) -
  MAUI-463: Add expand (fullscreen preview) button to native embed editor floating toolbar. Removes
  expand button from embed header for MAUI embeds (Infographic, Chart, Visualization) since it is
  now in the editor toolbar.

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [`4b920b03625a1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4b920b03625a1) -
  Removed `react-intl-next` alias and replaced all usages with `react-intl` directly.

  What changed: The `react-intl-next` npm alias (which resolved to `react-intl@^5`) has been
  removed. All imports now reference `react-intl` directly, and `peerDependencies` have been updated
  to `"^5.25.1 || ^6.0.0 || ^7.0.0"`.

  How consumer should update their code: Ensure `react-intl` is installed at a version satisfying
  `^5.25.1 || ^6.0.0 || ^7.0.0`. If your application was using `react-intl-next` as an npm alias, it
  can be safely removed. Replace any remaining `react-intl-next` imports with `react-intl`.

### Patch Changes

- Updated dependencies

## 0.2.4

### Patch Changes

- [`89e32bffb1383`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/89e32bffb1383) -
  [ux] Add support to consume the editor AI plugin summarise functionality in other editor plugins.
- Updated dependencies

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [`6c3e67fec342f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6c3e67fec342f) -
  Add BUILTIN_TOOLBAR_KEYS.COPY for copying native-embed nodes. COPY_LINK is now a deprecated alias
  for COPY. Add onCopyClick handler alongside deprecated onCopyLinkClick alias.

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [`71180287b9fed`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/71180287b9fed) -
  pen inline prompt when ask rovo is clicked on a maui app and send the context to the api
- Updated dependencies
