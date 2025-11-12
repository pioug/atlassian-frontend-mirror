# @atlaskit/editor-element-browser

## 4.0.6

### Patch Changes

- Updated dependencies

## 4.0.5

### Patch Changes

- Updated dependencies

## 4.0.4

### Patch Changes

- Updated dependencies

## 4.0.3

### Patch Changes

- Updated dependencies

## 4.0.2

### Patch Changes

- [`e55075670711e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e55075670711e) -
  Renamed Atlassian Intelligence in the element browser menu to Rovo
- Updated dependencies

## 4.0.1

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- [`6fb79942fc3a5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6fb79942fc3a5) -
  Internal changes to how borders are applied.
- Updated dependencies

## 3.0.1

### Patch Changes

- [`f0662cd7a143e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f0662cd7a143e) -
  Internal changes to how borders are applied.
- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [`255837cfba315`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/255837cfba315) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.0.4

### Patch Changes

- [`0fdcb6f2f96fd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0fdcb6f2f96fd) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 1.0.3

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [#197413](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/197413)
  [`c30bdee7ca9ce`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c30bdee7ca9ce) -
  Migrated usage of renamed/deprecated icons
- Updated dependencies

## 1.0.1

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

## 0.1.27

### Patch Changes

- Updated dependencies

## 0.1.26

### Patch Changes

- Updated dependencies

## 0.1.25

### Patch Changes

- Updated dependencies

## 0.1.24

### Patch Changes

- Updated dependencies

## 0.1.23

### Patch Changes

- Updated dependencies

## 0.1.22

### Patch Changes

- Updated dependencies

## 0.1.21

### Patch Changes

- Updated dependencies

## 0.1.20

### Patch Changes

- Updated dependencies

## 0.1.19

### Patch Changes

- Updated dependencies

## 0.1.18

### Patch Changes

- Updated dependencies

## 0.1.17

### Patch Changes

- Updated dependencies

## 0.1.16

### Patch Changes

- Updated dependencies

## 0.1.15

### Patch Changes

- Updated dependencies

## 0.1.14

### Patch Changes

- [#142352](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/142352)
  [`05903fde6d94d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/05903fde6d94d) -
  Internal change to use Compiled variant of `@atlaskit/primitives`.
- Updated dependencies

## 0.1.13

### Patch Changes

- Updated dependencies

## 0.1.12

### Patch Changes

- Updated dependencies

## 0.1.11

### Patch Changes

- Updated dependencies

## 0.1.10

### Patch Changes

- Updated dependencies

## 0.1.9

### Patch Changes

- Updated dependencies

## 0.1.8

### Patch Changes

- Updated dependencies

## 0.1.7

### Patch Changes

- [#122087](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/122087)
  [`c16a791049de0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c16a791049de0) -
  Update dependencies (add: @atlaskit/button, @atlaskit/heading, @atlaskit/lozenge, @atlaskit/menu,
  @atlaskit/textfield, @atlaskit/tooltip, @emotion/react; remove: @atlaskit/css, @compiled/react)

## 0.1.6

### Patch Changes

- [#121985](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121985)
  [`3fec8781d53c1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3fec8781d53c1) -
  Add missing @atlaskit/icon, @atlaskit/icon-lab dependency

## 0.1.5

### Patch Changes

- [#121509](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121509)
  [`1cb9d8787b00b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1cb9d8787b00b) -
  [ED-26763] Update isSelected prop for ListButtonItem so the first item appeared as selected
- [#121795](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121795)
  [`accdfeecd6a86`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/accdfeecd6a86) -
  Add missing @atlaskit/icon, @atlaskit/icon-lab dependency
- [#121677](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121677)
  [`dbce46badc11a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/dbce46badc11a) -
  [ux] Updates suggestions category for the QuickInsert and removes it from the Right rail
- Updated dependencies

## 0.1.4

### Patch Changes

- [#121049](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/121049)
  [`0c8ca53dace33`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0c8ca53dace33) -
  [ux] Uses ViewAllButtonItem from the editor-element-browser package instead of custom Pressable
  button

## 0.1.3

### Patch Changes

- [#120431](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120431)
  [`17173ce340cdc`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/17173ce340cdc) -
  [ED-26763] Support inserting selected item by Enter

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [#116567](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116567)
  [`583a5c6a5c1de`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/583a5c6a5c1de) -
  [ux] Add search function
- Updated dependencies

## 0.1.0

### Minor Changes

- [#116138](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/116138)
  [`b50c5d5d65ae2`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b50c5d5d65ae2) -
  Bump to the latest version of @compiled/react

### Patch Changes

- Updated dependencies

## 0.0.3

### Patch Changes

- [#115686](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/115686)
  [`3bc33ee6062f6`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3bc33ee6062f6) -
  Removes unused categories and iconModern and maps items to new IA

## 0.0.2

### Patch Changes

- [#114119](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/114119)
  [`32771ea219498`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/32771ea219498) -
  [ux] Opens right rail from the QuickInsert menu via context panel plugin's action
