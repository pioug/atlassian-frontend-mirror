# @atlaskit/native-embeds-common

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
