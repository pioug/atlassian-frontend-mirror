# @atlaskit/editor-plugin-text-formatting

## 1.2.3

### Patch Changes

- [#80679](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/80679) [`104eb9443b7e`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/104eb9443b7e) - ED-22553 Updating adf-schema version to 35.6.0

## 1.2.2

### Patch Changes

- [#78224](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/78224) [`6b4c9dd4ad34`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6b4c9dd4ad34) - ED-22219: adf-schema updated to 35.5.2
- Updated dependencies

## 1.2.1

### Patch Changes

- [#75482](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75482) [`18b5a6fb910a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/18b5a6fb910a) - # MAJOR CHANGE to `@atlaskit/prosemirror-input-rules` package.

  ## WHY?

  Removing editor-common dependencies from prosemirror-input-rules package.

  This makes it easier for editor updates because it simplifies our dependency graph.

  ## WHAT and HOW?

  These are no longer available via `@atlaskit/prosemirror-input-rules` but are available from `@atlaskit/editor-common/types`:

  - InputRuleWrapper
  - InputRuleHandler
  - OnHandlerApply
  - createRule

  These have changed from a `SafePlugin` to a `SafePluginSpec`. In order to update your code you need to instantiate a `SafePlugin` (ie. `new SafePlugin(createPlugin( ... ))`).

  `SafePlugin` exists in `@atlaskit/editor-common/safe-plugin`.

  - createPlugin
  - createInputRulePlugin

- Updated dependencies

## 1.2.0

### Minor Changes

- [#75020](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75020) [`56d9ebc6e467`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/56d9ebc6e467) - [ux] ECA11Y-206: Separators fix

## 1.1.0

### Minor Changes

- [#73123](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73123) [`9fd7b5a5e323`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9fd7b5a5e323) - ECA11Y-206: added role group and aria labels

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386) [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) - This changeset exists to bump all editor plugins that currently don't have a major version. This is to address an issue with Jira plugin consumption.

### Patch Changes

- Updated dependencies

## 0.4.26

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572) [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) - Upgrading @atlaskit/editor-prosemirror dependency

## 0.4.25

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152) [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) - Updating adf-schema version to 35.5.1

## 0.4.24

### Patch Changes

- Updated dependencies

## 0.4.23

### Patch Changes

- [#67557](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67557) [`124d0c6d5286`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/124d0c6d5286) - Migrating block-type, text-color, and text-formatting to use useSharedPluginState rather than WithPluginState. Removing unused option on default preset. Adding formattingIsPresent prop to TextFormattingState.
- Updated dependencies

## 0.4.22

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031) [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) - ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 0.4.21

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165) [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) - [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

## 0.4.20

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808) [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) - ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE

## 0.4.19

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246) [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) - ED-21371 Update adf-schema to 35.1.0

## 0.4.18

### Patch Changes

- Updated dependencies

## 0.4.17

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147) [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) - Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 0.4.16

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763) [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) - update ADF schema

## 0.4.15

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790) [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) - ED-21266: Updated @atlaskit/adf-schema to 34.0.1

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
