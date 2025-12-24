# @atlaskit/editor-plugin-user-intent

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.0.6

### Patch Changes

- [`55920a92e882a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/55920a92e882a) -
  tsignores added for help-center local consumpton removed
- Updated dependencies

## 4.0.5

### Patch Changes

- [`4d676bbdb3ce6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4d676bbdb3ce6) -
  ts-ignore added temporarily to unblock local consumption for help-center, will be removed once
  project refs are setup
- Updated dependencies

## 4.0.4

### Patch Changes

- [`28ba94dae8f9a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/28ba94dae8f9a) -
  [ux] EDITOR-2458 Replace usage of \_\_suppressAllToolbars with userIntentPlugin
- Updated dependencies

## 4.0.3

### Patch Changes

- [`9582f030b2f51`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9582f030b2f51) -
  re-release @atlaskit/editor-plugin-user-intent to see if it fixes

## 4.0.2

### Patch Changes

- [`4f5569bde5e64`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4f5569bde5e64) -
  Add new 'dragHandleSelected' user intent, use this to control table toolbar when drag handle is
  selected
- Updated dependencies

## 4.0.1

### Patch Changes

- [`2e7d46c6f07a7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2e7d46c6f07a7) -
  [EDITOR-1517] Drag handles flicker during inline streaming
- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [`a8630c1107c3d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a8630c1107c3d) -
  [ED-28781] Hide inline text toolbar when other popups are open
- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs

## 1.1.0

### Minor Changes

- [#189314](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189314)
  [`22c6251496010`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22c6251496010) -
  Exported missing types that were already being inferred from existing exports

## 1.0.0

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

## 0.1.4

### Patch Changes

- Updated dependencies

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [#141095](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/141095)
  [`9ab13f7eb4d0c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9ab13f7eb4d0c) -
  Add new pm plugin and package
