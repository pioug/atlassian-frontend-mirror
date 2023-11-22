# @atlaskit/editor-plugin-extension

## 0.4.1

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

## 0.4.0

### Minor Changes

- [#43164](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43164) [`3aeedf55e29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3aeedf55e29) - [ED-20068] Move editSelectedExtension to ExtensionPluginActions

## 0.3.0

### Minor Changes

- [#43042](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43042) [`fd547efa4e5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd547efa4e5) - Remove `macro` editor plugin and migrate functionality into extension plugin.

## 0.2.5

### Patch Changes

- [#42995](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42995) [`a527682dee6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a527682dee6) - add in missing dependencies for imported types

## 0.2.4

### Patch Changes

- [#42929](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42929) [`096057c8169`](https://bitbucket.org/atlassian/atlassian-frontend/commits/096057c8169) - add dependency to editor-plugin-analytics

## 0.2.3

### Patch Changes

- [#42869](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42869) [`e49e90d2093`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e49e90d2093) - Decoupling internal analytics plugin from extensions and macro plugins.

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#39743](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39743) [`da629b62ef9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da629b62ef9) - ED-19617 Refactor actions to remove createExtenstionAPI and call it instead during initialisation
