# @atlaskit/editor-plugin-focus

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- [`55920a92e882a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/55920a92e882a) -
  tsignores added for help-center local consumpton removed
- Updated dependencies

## 5.0.1

### Patch Changes

- [`4d676bbdb3ce6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4d676bbdb3ce6) -
  ts-ignore added temporarily to unblock local consumption for help-center, will be removed once
  project refs are setup
- Updated dependencies

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.0.0

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

## 1.5.8

### Patch Changes

- Updated dependencies

## 1.5.7

### Patch Changes

- Updated dependencies

## 1.5.6

### Patch Changes

- Updated dependencies

## 1.5.5

### Patch Changes

- Updated dependencies

## 1.5.4

### Patch Changes

- Updated dependencies

## 1.5.3

### Patch Changes

- Updated dependencies

## 1.5.2

### Patch Changes

- Updated dependencies

## 1.5.1

### Patch Changes

- Updated dependencies

## 1.5.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 1.4.11

### Patch Changes

- Updated dependencies

## 1.4.10

### Patch Changes

- Updated dependencies

## 1.4.9

### Patch Changes

- Updated dependencies

## 1.4.8

### Patch Changes

- Updated dependencies

## 1.4.7

### Patch Changes

- Updated dependencies

## 1.4.6

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18

## 1.4.5

### Patch Changes

- Updated dependencies

## 1.4.4

### Patch Changes

- Updated dependencies

## 1.4.3

### Patch Changes

- Updated dependencies

## 1.4.2

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#141343](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/141343)
  [`3893ae8e037fb`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/3893ae8e037fb) -
  Rearranging plugins to meet folder structure linting guidelines.

## 1.3.5

### Patch Changes

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 1.3.4

### Patch Changes

- Updated dependencies

## 1.3.3

### Patch Changes

- [#137614](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/137614)
  [`f7efc61f35951`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f7efc61f35951) -
  Add export for plugin type from paste options toolbar. Slightly re-arrange plugins to meet linting
  rule.
- Updated dependencies

## 1.3.2

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 1.2.9

### Patch Changes

- Updated dependencies

## 1.2.8

### Patch Changes

- Updated dependencies

## 1.2.7

### Patch Changes

- Updated dependencies

## 1.2.6

### Patch Changes

- Updated dependencies

## 1.2.5

### Patch Changes

- Updated dependencies

## 1.2.4

### Patch Changes

- Updated dependencies

## 1.2.3

### Patch Changes

- Updated dependencies

## 1.2.2

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#76136](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76136)
  [`a70e3bdbac29`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a70e3bdbac29) -
  [ux] Introduces the selection marker plugin. This is used to highlight the text in the editor as
  the editor itself is blurred. This helps provide a visual queue of the selection while working
  elsewhere in the UI.

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386)
  [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) -
  This changeset exists to bump all editor plugins that currently don't have a major version. This
  is to address an issue with Jira plugin consumption.

## 0.2.4

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- Updated dependencies

## 0.2.1

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#39325](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39325)
  [`ad3c5c21079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad3c5c21079) - Updating
  all plugins with minor version to correct issue with semver.

## 0.1.5

### Patch Changes

- [#39010](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39010)
  [`8467bdcdf4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8467bdcdf4f) - Removing
  `dependencies` prop from PluginInjectionAPI and changing signature of `NextEditorPlugin`.

  Previously a `NextEditorPlugin` would be consumed as so:

  ```ts
  const plugin: NextEditorPlugin< ... > = (config, api) => {
    // Can use api like so:
    api.dependencies.core.actions.execute( ... )
    return { ... }
  }
  ```

  Now these have become named parameters like so and the `pluginInjectionAPI` is used without the
  `dependencies` prop:

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

- [#39177](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39177)
  [`24e27147cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24e27147cbd) - Added
  atlaskit docs to all existing plugins.

## 0.1.3

### Patch Changes

- [#38577](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38577)
  [`f12aff135b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f12aff135b6) - Extract
  Composition Plugin

## 0.1.2

### Patch Changes

- [#38526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38526)
  [`4714a80b9d5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4714a80b9d5) -
  [ED-19488] Fix media Clipboard wrapper to paste images when Editor hasFocus
- Updated dependencies

## 0.1.1

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [#38424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38424)
  [`7a438d76a8a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a438d76a8a) -
  [ED-16733] Extract Focus plugin to its own plugin
