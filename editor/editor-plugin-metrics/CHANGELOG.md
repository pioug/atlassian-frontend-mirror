# @atlaskit/editor-plugin-metrics

## 8.0.0

### Patch Changes

- Updated dependencies

## 7.1.7

### Patch Changes

- Updated dependencies

## 7.1.6

### Patch Changes

- Updated dependencies

## 7.1.5

### Patch Changes

- [`e3779b75fdeca`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e3779b75fdeca) -
  EDITOR-1643 Promote syncBlock and bodiedSyncBlock to full schema
- Updated dependencies

## 7.1.4

### Patch Changes

- Updated dependencies

## 7.1.3

### Patch Changes

- [`a05464ea42678`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a05464ea42678) -
  EDITOR-2791 bump adf-schema
- Updated dependencies

## 7.1.2

### Patch Changes

- [`21fe79119fe74`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/21fe79119fe74) -
  EDITOR-2447 Bump adf-schema to 51.3.2
- Updated dependencies

## 7.1.1

### Patch Changes

- [`c28cd65d12c24`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c28cd65d12c24) -
  EDITOR-2447 Bump adf-schema to 51.3.1
- Updated dependencies

## 7.1.0

### Minor Changes

- [`5167552fe1a93`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5167552fe1a93) -
  [EDITOR-2339] Bump @atlaskit/adf-schema to 51.3.0

### Patch Changes

- Updated dependencies

## 7.0.1

### Patch Changes

- Updated dependencies

## 7.0.0

### Patch Changes

- Updated dependencies

## 6.3.0

### Minor Changes

- [`687c1b8fa7801`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/687c1b8fa7801) -
  EDITOR-1566 bump adf-schema + update validator

### Patch Changes

- Updated dependencies

## 6.2.0

### Minor Changes

- [`b367661ba720e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b367661ba720e) -
  EDITOR-1562 bump adf-schema for afm

### Patch Changes

- Updated dependencies

## 6.1.0

### Minor Changes

- [`64ec65231b4cf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/64ec65231b4cf) -
  EDITOR-1568 bump adf-schema for afm

### Patch Changes

- Updated dependencies

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.0.10

### Patch Changes

- [`a2cd8c46a3e94`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a2cd8c46a3e94) -
  EDITOR-1442 Bump adf-schema
- Updated dependencies

## 4.0.9

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 4.0.8

### Patch Changes

- [`57b19274b9fdd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/57b19274b9fdd) -
  EDITOR-1373 Bump adf-schema version
- Updated dependencies

## 4.0.7

### Patch Changes

- Updated dependencies

## 4.0.6

### Patch Changes

- Updated dependencies

## 4.0.5

### Patch Changes

- [#195649](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/195649)
  [`231bb33e06dfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/231bb33e06dfe) -
  EDITOR-1131 Bump adf-schema version to 50.2.0
- Updated dependencies

## 4.0.4

### Patch Changes

- [#191913](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/191913)
  [`6d1e56695e91d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6d1e56695e91d) -
  EDITOR-1131 Bump adf-schema package to 50.0.0
- Updated dependencies

## 4.0.3

### Patch Changes

- [#185723](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/185723)
  [`751aeb4580469`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/751aeb4580469) -
  ED-28315 clean up fg platform_editor_controls_patch_13

## 4.0.2

### Patch Changes

- [#187144](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/187144)
  [`a16147d8fbdfe`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a16147d8fbdfe) -
  Bump @atlaskit/adf-schema to v49.0.5
- Updated dependencies

## 4.0.1

### Patch Changes

- Updated dependencies

## 4.0.0

### Major Changes

- [#181024](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/181024)
  [`8e80c487ca307`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/8e80c487ca307) - ##
  Make `@atlaskit/editor-common` a peer dependency

  **WHAT:** `@atlaskit/editor-common` has been moved from `dependencies` to `peerDependencies` in
  all editor plugin packages.

  **WHY:** This change ensures that only a single version of `@atlaskit/editor-common` is used in
  consuming applications, preventing issues caused by multiple versions of singleton libraries (such
  as context mismatches or duplicated state). This is especially important for packages that rely on
  shared context or singletons.

  **HOW TO ADJUST:**
  - Consumers must now explicitly install `@atlaskit/editor-common` in their own project if they use
    any of these editor plugins.
  - Ensure the version you install matches the version required by the plugins.
  - You can use the
    [`check-peer-dependencies`](https://www.npmjs.com/package/check-peer-dependencies) package to
    verify that all required peer dependencies are installed and compatible.
  - Example install command:
    ```
    npm install @atlaskit/editor-common
    ```
    or
    ```
    yarn add @atlaskit/editor-common
    ```

  **Note:** This is a breaking change. If `@atlaskit/editor-common` is not installed at the
  application level, you may see errors or unexpected behavior.

### Patch Changes

- Updated dependencies

## 3.6.0

### Minor Changes

- [#177157](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/177157)
  [`6bcf8912217df`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6bcf8912217df) -
  ED-27284 additional integration with user preference plugin

### Patch Changes

- Updated dependencies

## 3.5.3

### Patch Changes

- Updated dependencies

## 3.5.2

### Patch Changes

- Updated dependencies

## 3.5.1

### Patch Changes

- Updated dependencies

## 3.5.0

### Minor Changes

- [#168315](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/168315)
  [`9b42791b3f3c2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9b42791b3f3c2) -
  ED-28215 Add toolbar docking preference to activitySession ended event

### Patch Changes

- Updated dependencies

## 3.4.8

### Patch Changes

- Updated dependencies

## 3.4.7

### Patch Changes

- Updated dependencies

## 3.4.6

### Patch Changes

- Updated dependencies

## 3.4.5

### Patch Changes

- [#139089](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139089)
  [`69dcdc0c4a543`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/69dcdc0c4a543) -
  ED-26588 Start activity session and persist active session when type ahead and element broswer is
  open
- Updated dependencies

## 3.4.4

### Patch Changes

- Updated dependencies

## 3.4.3

### Patch Changes

- [#125435](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/125435)
  [`3a6c9fa4e395a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3a6c9fa4e395a) -
  Fix scrolling when activitySession event is fired
- Updated dependencies

## 3.4.2

### Patch Changes

- Updated dependencies

## 3.4.1

### Patch Changes

- [#122391](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122391)
  [`09f8f912e177c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/09f8f912e177c) -
  ED-26931 Update totalActiveTime to be in seconds and contentChanged to take in absolute value

## 3.4.0

### Minor Changes

- [#120928](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120928)
  [`01cb5ca9596cf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/01cb5ca9596cf) -
  [ED-26316] Refactor checkTrActionType functions to be in it's own file to help with readability,
  add check for safe insert count and update it in analytics event fired

### Patch Changes

- Updated dependencies

## 3.3.1

### Patch Changes

- Updated dependencies

## 3.3.0

### Minor Changes

- [#120472](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120472)
  [`73c800ab5f2fc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/73c800ab5f2fc) -
  ED-26766 update adf-schema from 47.2.1 to 47.6.0 and adf-schema-json from 1.27.0 to 1.31.0

### Patch Changes

- Updated dependencies

## 3.2.3

### Patch Changes

- [#118316](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/118316)
  [`642dc2d7b337a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/642dc2d7b337a) -
  ED-26237 Update ease of use metrics to check nodeAttribute changes
- Updated dependencies

## 3.2.2

### Patch Changes

- Updated dependencies

## 3.2.1

### Patch Changes

- [#114961](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114961)
  [`f31ba30a89a05`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f31ba30a89a05) -
  ED-26301 Add logic to exclude transactions that shouldn't increment totalActionCount

## 3.2.0

### Minor Changes

- [#108974](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/108974)
  [`2ed04755a098e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2ed04755a098e) -
  ED-26233 Start activity session in metrics plugin when user starts dragging nodes and opens
  element browser

### Patch Changes

- Updated dependencies

## 3.1.1

### Patch Changes

- [#112186](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/112186)
  [`9462d8ca2405a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9462d8ca2405a) -
  Bump adf-schema to 47.2.1

## 3.1.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 2.0.0

### Major Changes

- [#105399](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105399)
  [`ed98e34b5912b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ed98e34b5912b) -
  ED-26234 Fire analytics at end of editor session

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#100173](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/100173)
  [`ab687f83ea47e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ab687f83ea47e) -
  ED-26142 Set up metrics plugin for measuring efficiency and effectiveness in editor

## 1.0.0
