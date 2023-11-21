# @atlaskit/editor-plugin-analytics

## 0.3.2

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417) [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971 Upgrade adf-schema package to ^34.0.0

## 0.3.1

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379) [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763 Upgrade ADF schema version to 33.2.3 for MBE nodes.
- Updated dependencies

## 0.3.0

### Minor Changes

- [#42373](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42373) [`f607a815ffc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f607a815ffc) - Decoupled deprecated analytics plugin imports from remaining plugins except for collab-edit, macro, find-replace, extension.

## 0.2.6

### Patch Changes

- [#39749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39749) [`e6b69f455c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b69f455c3) - Connect yarn changeset to packages, upgrade adf-schema

## 0.2.5

### Patch Changes

- Updated dependencies

## 0.2.4

### Patch Changes

- [#39984](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39984) [`37c62369dae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/37c62369dae) - NO-ISSUE Import doc builder types from editor-common

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- [#39481](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39481) [`aeb5c9a01e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aeb5c9a01e8) - Delete adf-schema from AFE and rely on npm package for adf-schema
- [`4b4dcfe0bba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b4dcfe0bba) - Delete adf-schema, use published version

## 0.2.1

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

- Updated dependencies

## 0.2.0

### Minor Changes

- [#39325](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39325) [`ad3c5c21079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad3c5c21079) - Updating all plugins with minor version to correct issue with semver.

### Patch Changes

- Updated dependencies

## 0.1.7

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

## 0.1.6

### Patch Changes

- [#39177](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39177) [`24e27147cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24e27147cbd) - Added atlaskit docs to all existing plugins.

## 0.1.5

### Patch Changes

- [#38976](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38976) [`33cb07de05f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/33cb07de05f) - change adf-schema to fixed versioning

## 0.1.4

### Patch Changes

- Updated dependencies

## 0.1.3

### Patch Changes

- Updated dependencies

## 0.1.2

### Patch Changes

- Updated dependencies

## 0.1.1

### Patch Changes

- [#37785](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37785) [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) - [ED-19233] Import prosemirror libraries from internal facade package

## 0.1.0

### Minor Changes

- [#36748](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36748) [`91c4edcea5a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/91c4edcea5a) - The analytics plugin (`editor-plugin-analytics`) now creates the `createAnalyticsEvent` if none is supplied and shares it with other plugins internally.

## 0.0.5

### Patch Changes

- [#36241](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36241) [`5f5ba16de66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f5ba16de66) - [ED-13910] Fix prosemirror types

## 0.0.4

### Patch Changes

- Updated dependencies

## 0.0.3

### Patch Changes

- [#35782](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35782) [`73b5128036b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73b5128036b) - [ED-17082] Mark package as a singleton one
- Updated dependencies

## 0.0.2

### Patch Changes

- [#35005](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35005) [`f07a1e036a9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f07a1e036a9) - Refactoring editor-core to prepare for extracting card plugin.
- Updated dependencies
