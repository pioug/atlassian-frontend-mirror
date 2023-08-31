# @atlaskit/editor-plugin-list

## 1.2.1

### Patch Changes

- [`6acf9830b36`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6acf9830b36) - Update feature flags plugin
  (@atlaskit/editor-plugin-feature-flags) to use a named export
  rather than default export to match other plugins.

  ```ts
  // Before
  import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';

  // After
  import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
  ```

- Updated dependencies

## 1.2.0

### Minor Changes

- [`ad3c5c21079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad3c5c21079) - Updating all plugins with minor version to correct issue with semver.

### Patch Changes

- Updated dependencies

## 1.1.3

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

## 1.1.2

### Patch Changes

- [`67971a65d80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/67971a65d80) - use fixed version for adf-schema

## 1.1.1

### Patch Changes

- [`24e27147cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24e27147cbd) - Added atlaskit docs to all existing plugins.

## 1.1.0

### Minor Changes

- [`4795a87a349`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4795a87a349) - Migrating some actions of `editor-plugin-list` to commands. Adding sharedState for `editor-plugin-text-formatting`.

## 1.0.0

### Major Changes

- [`8e9c21af71d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e9c21af71d) - Extracting list plugin code from editor-core to @atlaskit/editor-plugin-list.

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [`5d6ec9ac49c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d6ec9ac49c) - ED-19330 - decouple list plugin from editor-core
