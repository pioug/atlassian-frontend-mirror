# @atlaskit/editor-plugin-engagement-platform

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

## 3.1.4

### Patch Changes

- Updated dependencies

## 3.1.3

### Patch Changes

- Updated dependencies

## 3.1.2

### Patch Changes

- Updated dependencies

## 3.1.1

### Patch Changes

- Updated dependencies

## 3.1.0

### Minor Changes

- [#139139](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/139139)
  [`7f6b665d778dd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7f6b665d778dd) -
  [https://product-fabric.atlassian.net/browse/ED-27499](ED-27499) - the new
  `@atlassian/confluence-presets` package with Confluence `full-page` preset is created

### Patch Changes

- Updated dependencies

## 3.0.3

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

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

## 2.3.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 2.2.7

### Patch Changes

- Updated dependencies

## 2.2.6

### Patch Changes

- Updated dependencies

## 2.2.5

### Patch Changes

- Updated dependencies

## 2.2.4

### Patch Changes

- [#177988](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/177988)
  [`8f78c40775b7c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8f78c40775b7c) -
  ED-25810 - refactors editor plugins to engineering standards

## 2.2.3

### Patch Changes

- Updated dependencies

## 2.2.2

### Patch Changes

- Updated dependencies

## 2.2.1

### Patch Changes

- [#157867](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/157867)
  [`8398a1f0013fc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8398a1f0013fc) -
  [ux] ED-25331-add-spotlight-to-inline-comment-button
- Updated dependencies

## 2.2.0

### Minor Changes

- [#154829](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/154829)
  [`0646280e9ab18`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0646280e9ab18) -
  [EDF-1176](https://product-fabric.atlassian.net/browse/EDF-1176) - add pulse EP effect to AI
  button in Editor floating toolbar

### Patch Changes

- Updated dependencies

## 2.1.2

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18

## 2.1.1

### Patch Changes

- Updated dependencies

## 2.1.0

### Minor Changes

- [#151455](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/151455)
  [`1c6e93e3f7c13`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c6e93e3f7c13) -
  ED-25240 minor type adjustment, make it non-breaking change due to no consumer affected

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [#150384](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/150384)
  [`704af5d7d4a1a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/704af5d7d4a1a) -
  [EDF-1668](https://product-fabric.atlassian.net/browse/EDF-1668) - add external message API
  support into editor-plugin-engagement-platform
