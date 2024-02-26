# @atlaskit/editor-plugin-block-type

## 3.0.26

### Patch Changes

- [#76093](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/76093) [`fc113e0c416f`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/fc113e0c416f) - ED-22243 handling of backspace for mediaGroup node nested in panel
- Updated dependencies

## 3.0.25

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

## 3.0.24

### Patch Changes

- Updated dependencies

## 3.0.23

### Patch Changes

- Updated dependencies

## 3.0.22

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572) [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) - Upgrading @atlaskit/editor-prosemirror dependency

## 3.0.21

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152) [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) - Updating adf-schema version to 35.5.1

## 3.0.20

### Patch Changes

- [#68217](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68217) [`bfd8d2ded4aa`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/bfd8d2ded4aa) - [ux] correctly delete the decision list inside panel having only one decision item.

## 3.0.19

### Patch Changes

- Updated dependencies

## 3.0.18

### Patch Changes

- [#67857](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67857) [`9f1035441959`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9f1035441959) - [ED-21835] Change EditorAPI type to always union with undefined
- Updated dependencies

## 3.0.17

### Patch Changes

- [#67557](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67557) [`124d0c6d5286`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/124d0c6d5286) - Migrating block-type, text-color, and text-formatting to use useSharedPluginState rather than WithPluginState. Removing unused option on default preset. Adding formattingIsPresent prop to TextFormattingState.
- Updated dependencies

## 3.0.16

### Patch Changes

- [#67238](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67238) [`40533849b2ec`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/40533849b2ec) - [ED-21835] Change EditorAPI type to always union with undefined

## 3.0.15

### Patch Changes

- [#65802](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65802) [`438ead060875`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/438ead060875) - Ensure all editor plugins are marked as singletons

## 3.0.14

### Patch Changes

- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031) [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) - ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 3.0.13

### Patch Changes

- [#61923](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/61923) [`04e38cfe9e90`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/04e38cfe9e90) - Remove legacy theming logic from all Editor plugin packages. Theming is still available via the @atlaskit/tokens package.

## 3.0.12

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165) [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) - [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

## 3.0.11

### Patch Changes

- [#60534](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60534) [`191a38f1ea23`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/191a38f1ea23) - ED-20966 Use blockQuoteWithList PMNode when 'allow-list-in-blockquote' FF is enabled
- Updated dependencies

## 3.0.10

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808) [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) - ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE

## 3.0.9

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246) [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) - ED-21371 Update adf-schema to 35.1.0

## 3.0.8

### Patch Changes

- Updated dependencies

## 3.0.7

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147) [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) - Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 3.0.6

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763) [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) - update ADF schema

## 3.0.5

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790) [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) - ED-21266: Updated @atlaskit/adf-schema to 34.0.1

## 3.0.4

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417) [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971 Upgrade adf-schema package to ^34.0.0

## 3.0.3

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379) [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763 Upgrade ADF schema version to 33.2.3 for MBE nodes.
- Updated dependencies

## 3.0.1

### Patch Changes

- Updated dependencies

## 3.0.0

### Major Changes

- [#42090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42090) [`dfea93d39c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfea93d39c9) - Replacing setBlockType action on `editor-plugin-block-type` with setTextLevel
  command.

  WHAT/WHY?: setBlockType is only for headings/text so the naming is not clear,
  it is also an action which makes it difficult to use by external consumers.

  This replacement can be easily used by external consumers (ie. for custom toolbars)
  and also has more type safety (for setBlockType the name parameter is any string but
  setTextLevel only accepts valid values including "normal", "heading1",
  "heading2" etc.)

  HOW?: This API at this stage should be unused by consumers to the best of our
  knowledge. However if you are using it you should change as so:

  Before:

  ```ts
  api?.blockType.actions.setBlockType(blockType, inputMethod)(state, dispatch);
  ```

  ```ts
  api?.core.actions.execute(
    api?.blockType.commands.setTextLevel(blockType, inputMethod),
  );
  ```

## 2.0.0

### Major Changes

- [#40850](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40850) [`e7cead0f099`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7cead0f099) - Move shared messages to editor-common

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- [#39749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39749) [`e6b69f455c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b69f455c3) - Connect yarn changeset to packages, upgrade adf-schema

## 1.0.2

### Patch Changes

- Updated dependencies

## 1.0.1

### Patch Changes

- Updated dependencies
