# @atlaskit/editor-plugin-interaction

## 23.0.0

### Patch Changes

- Updated dependencies

## 22.0.0

### Patch Changes

- Updated dependencies

## 21.0.0

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

## 20.0.0

### Patch Changes

- Updated dependencies

## 19.1.0

### Minor Changes

- [`a94a013546f69`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a94a013546f69) -
  Autofix: add explicit package exports (barrel removal)

## 19.0.0

### Patch Changes

- Updated dependencies

## 18.0.0

### Patch Changes

- Updated dependencies

## 17.0.0

### Patch Changes

- Updated dependencies

## 16.0.2

### Patch Changes

- [`7b7c52dff5d7d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7b7c52dff5d7d) -
  Fix eslint violations for type import syntax

## 16.0.1

### Patch Changes

- [`14803a836f641`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/14803a836f641) -
  Update README.md and 0-intro.tsx

## 16.0.0

### Patch Changes

- Updated dependencies

## 15.0.0

### Patch Changes

- Updated dependencies

## 14.0.0

### Patch Changes

- Updated dependencies

## 13.0.0

### Patch Changes

- Updated dependencies

## 12.0.0

### Patch Changes

- Updated dependencies

## 11.0.0

### Patch Changes

- Updated dependencies

## 10.0.2

### Patch Changes

- [`55920a92e882a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/55920a92e882a) -
  tsignores added for help-center local consumpton removed
- Updated dependencies

## 10.0.1

### Patch Changes

- [`4d676bbdb3ce6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4d676bbdb3ce6) -
  ts-ignore added temporarily to unblock local consumption for help-center, will be removed once
  project refs are setup
- Updated dependencies

## 10.0.0

### Patch Changes

- Updated dependencies

## 9.0.0

### Patch Changes

- Updated dependencies

## 8.0.0

### Patch Changes

- Updated dependencies

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
