# @atlaskit/icon-lab

## 2.1.1

### Patch Changes

- [#103999](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/103999)
  [`9f62ecec4d422`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f62ecec4d422) -
  Update dependencies.

## 2.1.0

### Minor Changes

- [#100878](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100878)
  [`46c4545aa5d77`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/46c4545aa5d77) -
  This release updates icons in `@atlaskit/icon-lab`.

  **`@atlaskit/icon-lab/core`**

  - 'initiative'
  - 'qr-code'

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [#171994](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/171994)
  [`be58e4bb2e387`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/be58e4bb2e387) -
  This release renames the UNSAFE migration map entrypoint. Also includes re-building the icons due
  to UNSAFE types and entrypoints being renamed in the `@atlaskit/icon` package.

  ### Renamed entrypoints:

  - `@atlaskit/icon-lab/UNSAFE_migration-map` → `@atlaskit/icon-lab/migration-map`

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#168599](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/168599)
  [`48b86e5124c23`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/48b86e5124c23) -
  This release adds a supplementary set of icons to `@atlaskit/icon-lab`.

  ### Added:

  **`@atlaskit/icon-lab/core`**

  - `assets-data-manager`
  - `assets-schema`
  - `initiative`
  - `qr-code`

  ### Updated:

  **`@atlaskit/icon-lab/core`**

  - `vulnerability`

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#162725](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/162725)
  [`b2449424247a3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b2449424247a3) -
  New deprecation endpoint to identify icons that have been deprecated. Used with the
  `no-deprecated-imports` lint rule to assist with displaying errors and auto-fixing those icons
  with a defined replacement.

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [#166026](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/166026)
  [`962b5e77810fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/962b5e77810fb) -
  Adds side-effect config to support Compiled css extraction in third-party apps

## 1.0.1

### Patch Changes

- [#149469](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/149469)
  [`c75edf6df890b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c75edf6df890b) -
  Re-generated icons to explicitly set either `NewCoreIconProps` or `NewUtilityIconProps`.
- Updated dependencies

## 1.0.0

### Major Changes

- [#147410](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147410)
  [`7300bd8281c70`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7300bd8281c70) -
  This release adds a supplementary set of icons to `@atlaskit/icon-lab` and removes a few icons.

  ### Added:

  **`@atlaskit/icon-lab/core`**

  - `book-open`
  - `lozenge`
  - `vulnerability`

  ### Renamed:

  - `status → lozenge`

  ### Removed entrypoints:

  **`@atlaskit/icon-lab/core`**

  - `highlight`

### Patch Changes

- [#147477](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/147477)
  [`2d3fe080da9cf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2d3fe080da9cf) -
  Re-generated icon-lab icons after dependencies were updated
- Updated dependencies

## 0.2.0

### Minor Changes

- [#140548](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/140548)
  [`c66b92f724af1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c66b92f724af1) - ###
  Summary:

  - Fixes issue where icons with arrows sometimes rendered incorrectly.
  - Adds `status` icon.

  ### Added:

  **`@atlaskit/icon-lab/core`**

  - `status`

  ### Updated:

  **`@atlaskit/icon-lab/core`**

  - `highlight`: now feature smaller icon with room for a color indicator underneath.
  - Icons containing arrows have corrected paths

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [#137821](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137821)
  [`bcca6c1789a37`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bcca6c1789a37) - ###
  Summary

  This release renames `@atlassian/icon-lab` to `@atlaskit/icon-lab` and adds a supplementary set of
  icons to `@atlaskit/icon-lab`.

  ### Added:

  **`@atlaskit/icon-lab/core`**

  - `coins`
  - `cross-octagon`
  - `editions`
  - `field-text`
  - `highlight`
  - `paint-brush`
  - `paint-roller`
  - `speedometer`
  - `takeout-container`
  - `ticket`
  - `vehicle-train`
  - `wallet`
  - `wrench`

  ### Renamed:

  **`@atlaskit/icon-lab/core`**

  - `roadmaps-code → roadmaps-plan`

  ### Removed entrypoints:

  **`@atlaskit/icon-lab/core`**

  - `flag-filled`
  - `headphones`
  - `library`
  - `pulse`
