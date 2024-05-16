# @atlaskit/editor-plugin-focus

## 1.2.3

### Patch Changes

-   Updated dependencies

## 1.2.2

### Patch Changes

-   [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
    [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
    [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
    language triggering composition on an empty line.This was fixed in a patch bump of
    prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.2.1

### Patch Changes

-   Updated dependencies

## 1.2.0

### Minor Changes

-   [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
    [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
    bumped editor-prosemirror version to 4.0.0

### Patch Changes

-   Updated dependencies

## 1.1.0

### Minor Changes

-   [#76136](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76136)
    [`a70e3bdbac29`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a70e3bdbac29) -
    [ux] Introduces the selection marker plugin. This is used to highlight the text in the editor as
    the editor itself is blurred. This helps provide a visual queue of the selection while working
    elsewhere in the UI.

### Patch Changes

-   Updated dependencies

## 1.0.1

### Patch Changes

-   Updated dependencies

## 1.0.0

### Major Changes

-   [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386)
    [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) -
    This changeset exists to bump all editor plugins that currently don't have a major version. This
    is to address an issue with Jira plugin consumption.

## 0.2.4

### Patch Changes

-   [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
    [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
    Upgrading @atlaskit/editor-prosemirror dependency

## 0.2.3

### Patch Changes

-   Updated dependencies

## 0.2.2

### Patch Changes

-   Updated dependencies

## 0.2.1

### Patch Changes

-   Updated dependencies

## 0.2.0

### Minor Changes

-   [#39325](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39325)
    [`ad3c5c21079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad3c5c21079) -
    Updating all plugins with minor version to correct issue with semver.

## 0.1.5

### Patch Changes

-   [#39010](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39010)
    [`8467bdcdf4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8467bdcdf4f) -
    Removing `dependencies` prop from PluginInjectionAPI and changing signature of
    `NextEditorPlugin`.

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

-   Updated dependencies

## 0.1.4

### Patch Changes

-   [#39177](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39177)
    [`24e27147cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24e27147cbd) - Added
    atlaskit docs to all existing plugins.

## 0.1.3

### Patch Changes

-   [#38577](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38577)
    [`f12aff135b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f12aff135b6) -
    Extract Composition Plugin

## 0.1.2

### Patch Changes

-   [#38526](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38526)
    [`4714a80b9d5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4714a80b9d5) -
    [ED-19488] Fix media Clipboard wrapper to paste images when Editor hasFocus
-   Updated dependencies

## 0.1.1

### Patch Changes

-   Updated dependencies

## 0.1.0

### Minor Changes

-   [#38424](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38424)
    [`7a438d76a8a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a438d76a8a) -
    [ED-16733] Extract Focus plugin to its own plugin
