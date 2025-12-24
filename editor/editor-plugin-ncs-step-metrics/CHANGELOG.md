# @atlaskit/editor-plugin-ncs-step-metrics

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.0.0

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

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#161613](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/161613)
  [`081ebfcee0d82`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/081ebfcee0d82) -
  [EDITOR-752] Add ncsSessionStepMetrics analytics event

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [#159232](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159232)
  [`3edd7f2ef67fa`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3edd7f2ef67fa) -
  [EDITOR-752] Add updateSessionMetrics to collab plugin, this will track and store the steps in a
  single collab session

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#160537](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/160537)
  [`03914db0a566d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/03914db0a566d) -
  [EDITOR-813] Create editor-plugin-ncs-step-metrics
