# @atlaskit/editor-plugin-tasks-and-decisions

## 0.2.2

### Patch Changes

- [#43646](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43646) [`d43f8e9402f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d43f8e9402f) - Make feature flags plugin optional in all plugins including:

  - analytics
  - base
  - card
  - code-block
  - expand
  - extension
  - floating-toolbar
  - hyperlink
  - insert-block
  - layout
  - layout
  - list
  - media
  - paste
  - rule
  - table
  - tasks-and-decisions

  We already treat it as optional in the plugins, so this is just ensuring that the plugin is not mandatory to be added to the preset.

## 0.2.1

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417) [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971 Upgrade adf-schema package to ^34.0.0

## 0.2.0

### Minor Changes

- [#43405](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43405) [`150827259db`](https://bitbucket.org/atlassian/atlassian-frontend/commits/150827259db) - Extracting tasks and decisions code from editor-core to new plugin package.

### Patch Changes

- Updated dependencies
