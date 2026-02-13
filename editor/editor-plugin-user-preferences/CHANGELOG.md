# @atlaskit/editor-plugin-user-preferences

## 5.0.8

### Patch Changes

- Updated dependencies

## 5.0.7

### Patch Changes

- Updated dependencies

## 5.0.6

### Patch Changes

- Updated dependencies

## 5.0.5

### Patch Changes

- Updated dependencies

## 5.0.4

### Patch Changes

- Updated dependencies

## 5.0.3

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- Updated dependencies

## 5.0.1

### Patch Changes

- Updated dependencies

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.0.6

### Patch Changes

- Updated dependencies

## 4.0.5

### Patch Changes

- Updated dependencies

## 4.0.4

### Patch Changes

- [`55920a92e882a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/55920a92e882a) -
  tsignores added for help-center local consumpton removed
- Updated dependencies

## 4.0.3

### Patch Changes

- Updated dependencies

## 4.0.2

### Patch Changes

- [`4d676bbdb3ce6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4d676bbdb3ce6) -
  ts-ignore added temporarily to unblock local consumption for help-center, will be removed once
  project refs are setup
- Updated dependencies

## 4.0.1

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.2.5

### Patch Changes

- [`04ed1e34ba001`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/04ed1e34ba001) -
  Return initialUserPreferences from config when userPreferencesProvider is unavailable
- Updated dependencies

## 1.2.4

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 1.2.3

### Patch Changes

- [`4bc05c9f87780`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4bc05c9f87780) -
  [ux] Fix toolbar blink CLS regression

## 1.2.2

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#189314](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189314)
  [`22c6251496010`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/22c6251496010) -
  Exported missing types that were already being inferred from existing exports

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#180076](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/180076)
  [`f4353390abf4e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f4353390abf4e) -
  ED-27284 restore page active wather

### Patch Changes

- Updated dependencies

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

## 0.3.0

### Minor Changes

- [#177157](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/177157)
  [`6bcf8912217df`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6bcf8912217df) -
  ED-27284 additional integration with user preference plugin

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

- [#158546](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/158546)
  [`b7fe4e6f226f3`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/b7fe4e6f226f3) -
  ED-27284 use user preferences plugin in editor preset.

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [#159043](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/159043)
  [`686cfbea13d47`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/686cfbea13d47) -
  ED-28050 [Performance] Disable unnecessary docking preference request on PageVisibilityWatcher
- Updated dependencies

## 0.1.0

### Minor Changes

- [#150264](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/150264)
  [`f714a99eb7641`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f714a99eb7641) -
  ED-27284 add user-preferences plugin

### Patch Changes

- Updated dependencies
