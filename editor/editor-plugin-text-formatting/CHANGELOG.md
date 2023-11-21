# @atlaskit/editor-plugin-text-formatting

## 0.4.14

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417) [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971 Upgrade adf-schema package to ^34.0.0

## 0.4.13

### Patch Changes

- Updated dependencies

## 0.4.12

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379) [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763 Upgrade ADF schema version to 33.2.3 for MBE nodes.
- Updated dependencies

## 0.4.11

### Patch Changes

- [#42770](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42770) [`c7a6a824958`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c7a6a824958) - Extract code-block plugin from editor-core as `@atlaskit/editor-plugin-code-block`.

## 0.4.10

### Patch Changes

- [#42570](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42570) [`d7ff4d590d7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ff4d590d7) - ED-20023: Adding check for undefined item in dropdown menu

## 0.4.9

### Patch Changes

- Updated dependencies

## 0.4.8

### Patch Changes

- [#41634](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41634) [`e7cd20932b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7cd20932b9) - on windows, toggles mark when the capslock is on

## 0.4.7

### Patch Changes

- [#39749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39749) [`e6b69f455c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b69f455c3) - Connect yarn changeset to packages, upgrade adf-schema

## 0.4.6

### Patch Changes

- Updated dependencies

## 0.4.5

### Patch Changes

- [#39984](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39984) [`37c62369dae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37c62369dae) - NO-ISSUE Import doc builder types from editor-common

## 0.4.4

### Patch Changes

- Updated dependencies

## 0.4.3

### Patch Changes

- [#39481](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39481) [`aeb5c9a01e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aeb5c9a01e8) - Delete adf-schema from AFE and rely on npm package for adf-schema
- [`4b4dcfe0bba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b4dcfe0bba) - Delete adf-schema, use published version

## 0.4.2

### Patch Changes

- [#39628](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39628) [`1b66c23221e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b66c23221e) - Fix missing analytics parameter in media plugin.

## 0.4.1

### Patch Changes

- [#39304](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39304) [`6acf9830b36`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6acf9830b36) - Update feature flags plugin
  (@atlaskit/editor-plugin-feature-flags) to use a named export
  rather than default export to match other plugins.

  ```ts
  // Before
  import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';

  // After
  import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
  ```

## 0.4.0

### Minor Changes

- [#39325](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39325) [`ad3c5c21079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad3c5c21079) - Updating all plugins with minor version to correct issue with semver.

### Patch Changes

- Updated dependencies

## 0.3.2

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

## 0.3.1

### Patch Changes

- [#39177](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39177) [`24e27147cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24e27147cbd) - Added atlaskit docs to all existing plugins.

## 0.3.0

### Minor Changes

- [#39023](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39023) [`4795a87a349`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4795a87a349) - Migrating some actions of `editor-plugin-list` to commands. Adding sharedState for `editor-plugin-text-formatting`.

## 0.2.5

### Patch Changes

- [#38976](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38976) [`33cb07de05f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/33cb07de05f) - change adf-schema to fixed versioning

## 0.2.4

### Patch Changes

- [#38808](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38808) [`967f4819f58`](https://bitbucket.org/atlassian/atlassian-frontend/commits/967f4819f58) - Introduce core plugin that is always injected into the pluginInjectionApi. This has a new action `execute` that replaces the existing `executeCommand` that was called from the `pluginInjectionApi`.
- Updated dependencies

## 0.2.3

### Patch Changes

- [#38577](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38577) [`f12aff135b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f12aff135b6) - Extract Composition Plugin

## 0.2.2

### Patch Changes

- [#38495](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38495) [`24fc3925d73`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24fc3925d73) - Add a new hook called `usePreset` accesed via `@atlaskit/editor-core/use-preset`. This hook can be used to safely access state and commands from outside the editor using `EditorContext`.
- Updated dependencies

## 0.2.1

### Patch Changes

- [#38679](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38679) [`5365e42ef97`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5365e42ef97) - cleaned up more of the \* as keymaps imports to enable better tree-shaking

## 0.2.0

### Minor Changes

- [#38497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38497) [`43c51e0a282`](https://bitbucket.org/atlassian/atlassian-frontend/commits/43c51e0a282) - [ED-19431] Migrate all text-formatting plugin actions over to plugin commands

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [#38544](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38544) [`f3728ec49ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3728ec49ab) - NO-ISSUE Switched analytics plugin to prod dependency to avoid type issues in CI
