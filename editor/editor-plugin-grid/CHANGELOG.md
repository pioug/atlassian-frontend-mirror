# @atlaskit/editor-plugin-grid

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [`ad3c5c21079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad3c5c21079) - Updating all plugins with minor version to correct issue with semver.

### Patch Changes

- Updated dependencies

## 0.1.7

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

## 0.1.6

### Patch Changes

- [`24e27147cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24e27147cbd) - Added atlaskit docs to all existing plugins.

## 0.1.5

### Patch Changes

- Updated dependencies

## 0.1.4

### Patch Changes

- [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) - [ED-19233] Import prosemirror libraries from internal facade package

## 0.1.3

### Patch Changes

- [`5f5ba16de66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f5ba16de66) - [ED-13910] Fix prosemirror types

## 0.1.2

### Patch Changes

- [`73b5128036b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73b5128036b) - [ED-17082] Mark package as a singleton one
- Updated dependencies

## 0.1.1

### Patch Changes

- [`7cd4abcdc0d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7cd4abcdc0d) - Fix workaround in `editor-plugin-width`. This involved removing `WidthEmitter` in `editor-core`, removing `containerWidth` from `WidthPluginState`. This change also introduces `usePluginHook` for an `EditorPlugin` - this enables a react hook to be mounted for plugins (in all appearances).
- Updated dependencies
