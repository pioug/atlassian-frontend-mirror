# @atlaskit/editor-plugin-feature-flags

## 0.2.0

### Minor Changes

- [`ad3c5c21079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad3c5c21079) - Updating all plugins with minor version to correct issue with semver.

## 0.1.9

### Patch Changes

- [`8467bdcdf4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8467bdcdf4f) - Removing `dependencies` prop from PluginInjectionAPI and changing
  signature of `NextEditorPlugin`.

  Previously a `NextEditorPlugin` would be consumed as so:

  ```ts
  const plugin: NextEditorPlugin< ... > = (config, api) => {
    // Can use api like so:
    api.dependencies.core.actions.execute( ... )
    return { ... }
  }
  ```

  Now these have become named parameters like so and the `pluginInjectionAPI` is used
  without the `dependencies` prop:

  ```ts
  const plugin: NextEditorPlugin< ... > = ({ config, api }) => {
    // Can use api like so:
    api.core.actions.execute( ... )
    return { ... }
  }
  ```

- Updated dependencies

## 0.1.8

### Patch Changes

- [`24e27147cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24e27147cbd) - Added atlaskit docs to all existing plugins.

## 0.1.7

### Patch Changes

- Updated dependencies

## 0.1.6

### Patch Changes

- [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) - [ED-19233] Import prosemirror libraries from internal facade package

## 0.1.5

### Patch Changes

- [`9b75434a668`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b75434a668) - Fixing import order in editor-core and feature flags plugin.

## 0.1.4

### Patch Changes

- [`5f5ba16de66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f5ba16de66) - [ED-13910] Fix prosemirror types

## 0.1.3

### Patch Changes

- [`73b5128036b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73b5128036b) - [ED-17082] Mark package as a singleton one
- Updated dependencies

## 0.1.2

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 0.1.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 0.1.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 0.0.4

### Patch Changes

- Updated dependencies

## 0.0.3

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 0.0.2

### Patch Changes

- [`1b4642c6b8c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b4642c6b8c) - [ED-17287] Update feature flag usage for base plugin
- [`7d13224adfc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d13224adfc) - [ED-16731] Initial migration for Feature Flags plugin
- Updated dependencies
