# @atlaskit/editor-plugin-guideline

## 1.1.8

### Patch Changes

- Updated dependencies

## 1.1.7

### Patch Changes

- Updated dependencies

## 1.1.6

### Patch Changes

- Updated dependencies

## 1.1.5

### Patch Changes

- Updated dependencies

## 1.1.4

### Patch Changes

- Updated dependencies

## 1.1.3

### Patch Changes

- Updated dependencies

## 1.1.2

### Patch Changes

- [#97698](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/97698)
  [`1c7b378c0d3b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1c7b378c0d3b) -
  [HOT-108999] We had an incident where the cursor jumps back a character in table headers for any
  language triggering composition on an empty line.This was fixed in a patch bump of
  prosemirror-view. https://github.com/ProseMirror/prosemirror-view/compare/1.33.4...1.33.5

## 1.1.1

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [#91934](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/91934)
  [`b76a78c6a199`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b76a78c6a199) -
  bumped editor-prosemirror version to 4.0.0

### Patch Changes

- Updated dependencies

## 1.0.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116)
  [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) -
  Upgrade Typescript from `4.9.5` to `5.4.2`

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386)
  [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) -
  This changeset exists to bump all editor plugins that currently don't have a major version. This
  is to address an issue with Jira plugin consumption.

### Patch Changes

- Updated dependencies

## 0.5.4

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572)
  [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) -
  Upgrading @atlaskit/editor-prosemirror dependency

## 0.5.3

### Patch Changes

- Updated dependencies

## 0.5.2

### Patch Changes

- Updated dependencies

## 0.5.1

### Patch Changes

- Updated dependencies

## 0.5.0

### Minor Changes

- [#39325](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39325)
  [`ad3c5c21079`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad3c5c21079) - Updating
  all plugins with minor version to correct issue with semver.

### Patch Changes

- Updated dependencies

## 0.4.2

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

## 0.4.1

### Patch Changes

- [#39177](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39177)
  [`24e27147cbd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/24e27147cbd) - Added
  atlaskit docs to all existing plugins.

## 0.4.0

### Minor Changes

- [#38980](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38980)
  [`7f45581d141`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f45581d141) - ED-19630
  fixed guideline alignment issue.

### Patch Changes

- Updated dependencies

## 0.3.13

### Patch Changes

- [#38672](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38672)
  [`51e6a0128eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/51e6a0128eb) - ED-18969
  Implemented relative guideline

## 0.3.12

### Patch Changes

- Updated dependencies

## 0.3.11

### Patch Changes

- [#38341](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38341)
  [`c46821ab461`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c46821ab461) - Update
  guideline colour to color.border.disabled to provide more contrast against table borders
- Updated dependencies

## 0.3.10

### Patch Changes

- [#38130](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38130)
  [`8b9fec4c803`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b9fec4c803) - [ux]
  improve guidelines styles left position
- Updated dependencies

## 0.3.9

### Patch Changes

- [#38063](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38063)
  [`75fe8860154`](https://bitbucket.org/atlassian/atlassian-frontend/commits/75fe8860154) - Update
  styles of guidelines so they align correctly

## 0.3.8

### Patch Changes

- [#32787](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/32787)
  [`936c30f8dc9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/936c30f8dc9) - support
  new image resize experience under feature flag
- Updated dependencies

## 0.3.7

### Patch Changes

- [#37785](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37785)
  [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) -
  [ED-19233] Import prosemirror libraries from internal facade package

## 0.3.6

### Patch Changes

- [#37398](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37398)
  [`3d065399b07`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3d065399b07) - ED-18969
  refactor guideline plugin interface.

## 0.3.5

### Patch Changes

- [#37348](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37348)
  [`e8885f55db6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e8885f55db6) - ED-18969
  implement relative guides support

## 0.3.4

### Patch Changes

- [#36241](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36241)
  [`5f5ba16de66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f5ba16de66) -
  [ED-13910] Fix prosemirror types

## 0.3.3

### Patch Changes

- [#36310](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36310)
  [`e118dc7562b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e118dc7562b) - ED-18897
  guideline interface to use css tokens.

## 0.3.2

### Patch Changes

- [#35782](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35782)
  [`73b5128036b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/73b5128036b) -
  [ED-17082] Mark package as a singleton one
- Updated dependencies

## 0.3.1

### Patch Changes

- [#34938](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34938)
  [`7cd4abcdc0d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7cd4abcdc0d) - Fix
  workaround in `editor-plugin-width`. This involved removing `WidthEmitter` in `editor-core`,
  removing `containerWidth` from `WidthPluginState`. This change also introduces `usePluginHook` for
  an `EditorPlugin` - this enables a react hook to be mounted for plugins (in all appearances).
- Updated dependencies

## 0.3.0

### Minor Changes

- [#34887](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34887)
  [`d7aa08972c6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7aa08972c6) - add
  style handler for the editor guideline plugin
- [`1dadcae5b09`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1dadcae5b09) -
  COLLAB-2623 Updated API to newest interface and added utils to create default gridlines

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [#34644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34644)
  [`d8f19b90c43`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8f19b90c43) -
  COLLAB-2622 Update editor-plugin-guideline to support position config.

### Patch Changes

- [`2625e4baea0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2625e4baea0) -
  COLLAB-2622 Setup React components for future works.
- Updated dependencies
