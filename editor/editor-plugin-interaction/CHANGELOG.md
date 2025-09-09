# @atlaskit/editor-plugin-interaction

## 7.0.0

### Patch Changes

- Updated dependencies

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs

## 5.0.0

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

## 3.0.0

### Major Changes

- [#173895](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/173895)
  [`6e123631d7c26`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6e123631d7c26) -
  Clean up platform_editor_interaction_api_refactor

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.1.2

### Patch Changes

- Updated dependencies

## 1.1.1

### Patch Changes

- [#159390](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159390)
  [`cc1d530fb6ed2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cc1d530fb6ed2) -
  [ux] [ED-28074] Fix media selection state and remove css-based targeting
- Updated dependencies

## 1.1.0

### Minor Changes

- [#156585](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/156585)
  [`a63da8fac528b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a63da8fac528b) -
  [ux] [ED-27962] Code block will now trigger interaction state

### Patch Changes

- Updated dependencies

## 1.0.4

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [#140969](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140969)
  [`b4ac22e73d43c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b4ac22e73d43c) -
  [ux] [ED-27253] hide selection states until editor has been interacted with
- Updated dependencies

## 1.0.1

### Patch Changes

- [#140394](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/140394)
  [`aa5fe04b853bf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/aa5fe04b853bf) -
  [ED-27253] Introduce interaction plugin to track first interaction on page
- Updated dependencies
