# @atlaskit/editor-plugin-extension

## 1.0.3

### Patch Changes

- [#74716](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/74716) [`e4dcc12c4f8d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e4dcc12c4f8d) - ED-22048 Disable MBE partial selection to fix unwanted extensionFrame deletion.
- Updated dependencies

## 1.0.2

### Patch Changes

- [#72671](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72671) [`c446a8ca183b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c446a8ca183b) - ED-21912 Adding support for left arrow navigation from within MBE tabs.
- Updated dependencies

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386) [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) - This changeset exists to bump all editor plugins that currently don't have a major version. This is to address an issue with Jira plugin consumption.

### Patch Changes

- Updated dependencies

## 0.7.4

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572) [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) - Upgrading @atlaskit/editor-prosemirror dependency
- [#70460](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70460) [`2f37600156ae`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f37600156ae) - The internal composition of a component in this package has changed. There is no expected change in behaviour.

## 0.7.3

### Patch Changes

- [#71136](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/71136) [`c803fea1e6a4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c803fea1e6a4) - Move all plugin translations to editor-common
- Updated dependencies

## 0.7.2

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152) [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) - Updating adf-schema version to 35.5.1

## 0.7.1

### Patch Changes

- [#70741](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70741) [`7c1487568202`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7c1487568202) - ED-21973: Fix for MBE side panel config params update

## 0.7.0

### Minor Changes

- [#68640](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68640) [`e173cb423c75`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e173cb423c75) - Migrate extension plugin to useSharedPluginState from WithPluginState. Adds new dependency on BasePlugin.

### Patch Changes

- Updated dependencies

## 0.6.3

### Patch Changes

- [#68264](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68264) [`daa71f6aa162`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/daa71f6aa162) - [ux] ED-21883: Updated MultiBodied Extension related CSS and selections
- Updated dependencies

## 0.6.2

### Patch Changes

- [#68501](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68501) [`c813e900fdde`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c813e900fdde) - ED-21735: Added extension config panel support for MBE

## 0.6.1

### Patch Changes

- Updated dependencies

## 0.6.0

### Minor Changes

- [#67100](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67100) [`55cdf07c41cb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/55cdf07c41cb) - Allow create label formatting for custom fields from extension

### Patch Changes

- Updated dependencies

## 0.5.2

### Patch Changes

- [#66759](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/66759) [`906578f1ea5d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/906578f1ea5d) - [ux] ED-21787: Migrating few CSS entries to space and color tokens

## 0.5.1

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238) [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) - [ED-21835] Change EditorAPI type to always union with undefined

## 0.5.0

### Minor Changes

- [#65712](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65712) [`963b53c64eee`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/963b53c64eee) - Extract code for extension plugin from editor-core to @atlaskit/editor-plugin-extension

### Patch Changes

- Updated dependencies

## 0.4.2

### Patch Changes

- Updated dependencies

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
