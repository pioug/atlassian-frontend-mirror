# @atlaskit/editor-plugin-decorations

## 0.2.6

### Patch Changes

- [#42604](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42604) [`182627d0f5e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/182627d0f5e) - Extracted panel plugin from editor-core as @atlaskit/editor-plugin-panel

## 0.2.5

### Patch Changes

- [#42505](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42505) [`48e5f1efdde`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48e5f1efdde) - Extract layout plugin into new package @atlaskit/editor-plugin-layout.

## 0.2.4

### Patch Changes

- [#42477](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42477) [`8f5175dc714`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f5175dc714) - Decouple layout plugin from editor-core

## 0.2.3

### Patch Changes

- [#41648](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41648) [`20f43769aa7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/20f43769aa7) - [ED-19746] Extract mentions plugin from editor-core to its own package: @atlaskit/editor-plugin-mentions

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#39325](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39325) [`ad3c5c21079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad3c5c21079) - Updating all plugins with minor version to correct issue with semver.

## 0.1.5

### Patch Changes

- [#39010](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39010) [`8467bdcdf4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8467bdcdf4f) - Removing `dependencies` prop from PluginInjectionAPI and changing
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

## 0.1.4

### Patch Changes

- [#39177](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39177) [`24e27147cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24e27147cbd) - Added atlaskit docs to all existing plugins.

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- [#37785](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37785) [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) - [ED-19233] Import prosemirror libraries from internal facade package

## 0.1.1

### Patch Changes

- [#35782](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35782) [`73b5128036b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73b5128036b) - [ED-17082] Mark package as a singleton one
- Updated dependencies
