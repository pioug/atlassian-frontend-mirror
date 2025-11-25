# @atlaskit/editor-plugin-guideline

## 6.0.3

### Patch Changes

- [`4d676bbdb3ce6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4d676bbdb3ce6) -
  ts-ignore added temporarily to unblock local consumption for help-center, will be removed once
  project refs are setup
- Updated dependencies

## 6.0.2

### Patch Changes

- Updated dependencies

## 6.0.1

### Patch Changes

- Updated dependencies

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.2

### Patch Changes

- [`6fb79942fc3a5`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6fb79942fc3a5) -
  Internal changes to how borders are applied.
- Updated dependencies

## 5.0.1

### Patch Changes

- Updated dependencies

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.0.0

### Patch Changes

- [`0fda385059db0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0fda385059db0) -
  PR to cleanup platform_editor_usesharedpluginstatewithselector for `collab-edit`,
  `floating-toolbar`, `grid` and `guideline`
- Updated dependencies

## 3.0.5

### Patch Changes

- Updated dependencies

## 3.0.4

### Patch Changes

- [`265c1bf0cefa4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/265c1bf0cefa4) -
  Sorted type and interface props to improve Atlaskit docs
- Updated dependencies

## 3.0.3

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- Updated dependencies

## 3.0.1

### Patch Changes

- [#182839](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/182839)
  [`81f1c3383bdab`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/81f1c3383bdab) -
  refactor: use useSharedPluginStateWithSelector instead of useSharedPluginStateSelector

## 3.0.0

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

## 2.0.11

### Patch Changes

- Updated dependencies

## 2.0.10

### Patch Changes

- Updated dependencies

## 2.0.9

### Patch Changes

- Updated dependencies

## 2.0.8

### Patch Changes

- Updated dependencies

## 2.0.7

### Patch Changes

- [#148126](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148126)
  [`2839a051cf613`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/2839a051cf613) -
  Migrate to useSharedPluginStateSelector for grid, guideline, help-dialog, highlight and hyperlink
  plugins

## 2.0.6

### Patch Changes

- Updated dependencies

## 2.0.5

### Patch Changes

- Updated dependencies

## 2.0.4

### Patch Changes

- Updated dependencies

## 2.0.3

### Patch Changes

- Updated dependencies

## 2.0.2

### Patch Changes

- Updated dependencies

## 2.0.1

### Patch Changes

- [#120533](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/120533)
  [`f1bec731e278f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1bec731e278f) -
  Adds a `sideEffects` field to ensure this package does not have Compiled styles tree-shaken in the
  future to avoid an accidental regression.

  This is related to
  https://community.developer.atlassian.com/t/rfc-73-migrating-our-components-to-compiled-css-in-js/85953

## 2.0.0

### Major Changes

- [#117363](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/117363)
  [`10a0f7f6c2027`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/10a0f7f6c2027) -
  This package's `peerDependencies` have been adjusted for `react` and/or `react-dom` to reflect the
  status of only supporting React 18 going forward. No explicit breaking change to React support has
  been made in this release, but this is to signify going forward, breaking changes for React 16 or
  React 17 may come via non-major semver releases.

  Please refer this community post for more details:
  https://community.developer.atlassian.com/t/rfc-78-dropping-support-for-react-16-and-rendering-in-a-react-18-concurrent-root-in-jira-and-confluence/87026

### Patch Changes

- Updated dependencies

## 1.4.1

### Patch Changes

- Updated dependencies

## 1.4.0

### Minor Changes

- [#105322](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/105322)
  [`8876083532adc`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8876083532adc) -
  Bumped editor-prosemirror version to 7.0.0

### Patch Changes

- Updated dependencies

## 1.3.1

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [#109060](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/109060)
  [`4660ec858a305`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4660ec858a305) -
  Update `React` from v16 to v18

### Patch Changes

- Updated dependencies

## 1.2.22

### Patch Changes

- Updated dependencies

## 1.2.21

### Patch Changes

- Updated dependencies

## 1.2.20

### Patch Changes

- Updated dependencies

## 1.2.19

### Patch Changes

- Updated dependencies

## 1.2.18

### Patch Changes

- Updated dependencies

## 1.2.17

### Patch Changes

- [#169604](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/169604)
  [`11e14d646fe74`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/11e14d646fe74) -
  ED-25811: refactors plugins to meet folder standards
- Updated dependencies

## 1.2.16

### Patch Changes

- Updated dependencies

## 1.2.15

### Patch Changes

- [#155735](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/155735)
  [`1beeeda29023a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/1beeeda29023a) -
  Upgrades editor packages to react 18

## 1.2.14

### Patch Changes

- Updated dependencies

## 1.2.13

### Patch Changes

- Updated dependencies

## 1.2.12

### Patch Changes

- Updated dependencies

## 1.2.11

### Patch Changes

- Updated dependencies

## 1.2.10

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

- [#139334](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/139334)
  [`30793649657c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/30793649657c0) -
  [HOT-111629] We had an incident where the last character disappears when hitting the enter key on
  windows OS for Korean characters. Bumping to prosemirror-view@1.34.2 for the fix.

## 1.2.5

### Patch Changes

- Updated dependencies

## 1.2.4

### Patch Changes

- [#138118](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/138118)
  [`5e4d9eb1aefe4`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/5e4d9eb1aefe4) -
  NOISSUE: Upgrades editor React peer dependencies to v18
- Updated dependencies

## 1.2.3

### Patch Changes

- Updated dependencies

## 1.2.2

### Patch Changes

- Updated dependencies

## 1.2.1

### Patch Changes

- Updated dependencies

## 1.2.0

### Minor Changes

- [#124209](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/124209)
  [`8aa1792f12ed3`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8aa1792f12ed3) -
  bump @atlaskit/editor-prosemirror to 5.0.0, bump @atlaskit/adf-schema to 40.1.0

### Patch Changes

- Updated dependencies

## 1.1.9

### Patch Changes

- Updated dependencies

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
