# @atlaskit/editor-plugin-base

## 1.0.1

### Patch Changes

- Updated dependencies

## 1.0.0

### Major Changes

- [#72386](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72386) [`0c52b0be40c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0c52b0be40c1) - This changeset exists to bump all editor plugins that currently don't have a major version. This is to address an issue with Jira plugin consumption.

### Patch Changes

- Updated dependencies

## 0.3.7

### Patch Changes

- [#68572](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68572) [`15d407fe5143`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/15d407fe5143) - Upgrading @atlaskit/editor-prosemirror dependency

## 0.3.6

### Patch Changes

- [#70152](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70152) [`53ed3673df28`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/53ed3673df28) - Updating adf-schema version to 35.5.1

## 0.3.5

### Patch Changes

- [#68640](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/68640) [`6a3ea210641a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6a3ea210641a) - Create new context identifier plugin which contains the provider.
- Updated dependencies

## 0.3.4

### Patch Changes

- [#67690](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/67690) [`2f7dc1629e1c`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/2f7dc1629e1c) - Cleanup feature flag for scrolling optimisation.

## 0.3.3

### Patch Changes

- Updated dependencies

## 0.3.2

### Patch Changes

- [#63346](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63346) [`7ab6b24559c0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7ab6b24559c0) - Minor performance optimisation for scroll gutter.
- [#65031](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65031) [`a00094111b5a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a00094111b5a) - ED-21609 Update adf-schema to 35.3.0
- Updated dependencies

## 0.3.1

### Patch Changes

- [#64064](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64064) [`77394053290a`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/77394053290a) - Comment change to trigger builds

## 0.3.0

### Minor Changes

- [#63522](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/63522) [`906d43c5bb6d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/906d43c5bb6d) - Remove hack for chrome 88 selection bug

## 0.2.13

### Patch Changes

- [#62165](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/62165) [`b44ac0968d79`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b44ac0968d79) - [ED-21562] Bump @atlaskit/adf-schema to 35.2.0 for border mark update

## 0.2.12

### Patch Changes

- [#60228](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60228) [`63507f58b595`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/63507f58b595) - Fix browserFreeze events collecting/reporting

## 0.2.11

### Patch Changes

- [#60808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60808) [`f509a21be124`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f509a21be124) - ED-21506: @atlaskit/adf-schema upgraded to 35.1.1 to support renderer for MBE

## 0.2.10

### Patch Changes

- [#58246](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58246) [`a381b2599716`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a381b2599716) - ED-21371 Update adf-schema to 35.1.0

## 0.2.9

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147) [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) - Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 0.2.8

### Patch Changes

- [#58763](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58763) [`0fdbd64522bf`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/0fdbd64522bf) - update ADF schema

## 0.2.7

### Patch Changes

- [#56790](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/56790) [`ff577a7969d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff577a7969d4) - ED-21266: Updated @atlaskit/adf-schema to 34.0.1

## 0.2.6

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

## 0.2.5

### Patch Changes

- [#43417](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43417) [`3f3c17f0273`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3f3c17f0273) - ED-20971 Upgrade adf-schema package to ^34.0.0

## 0.2.4

### Patch Changes

- [#43379](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43379) [`482c025520d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/482c025520d) - ED-20763 Upgrade ADF schema version to 33.2.3 for MBE nodes.
- Updated dependencies

## 0.2.3

### Patch Changes

- [#41047](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41047) [`8f0b00d165f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f0b00d165f) - [ED-20003] Extract TypeAhead from editor-core to its own package @atlaskit/editor-plugin-type-ahead

## 0.2.2

### Patch Changes

- [#40750](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40750) [`fc19a7b9edd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc19a7b9edd) - [ED-19875] Extraction of Editor Core's Selection Plugin into independent package '@atlaskit/editor-plugin-selection'.
- Updated dependencies

## 0.2.1

### Patch Changes

- [#39749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39749) [`e6b69f455c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6b69f455c3) - Connect yarn changeset to packages, upgrade adf-schema

## 0.2.0

### Minor Changes

- [#40718](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40718) [`c1d4b48bdd9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1d4b48bdd9) - WHAT: This change removes plugin exports from editor-core that were used only for the mobile bridge.

  This includes:

  - All plugin keys
  - Plugin commands
  - Plugin types

  The full list is:

  - EditorFeatureFlags (available via '@atlaskit/editor-common/types' as `FeatureFlags`)
  - EmojiResource (available via '@atlaskit/emoji/resource' as `EmojiResource`)
  - mediaPlugin
  - insertMediaSingleNode
  - CustomMediaPicker
  - mediaPluginKey
  - textColorPluginKey
  - TextColorPluginState
  - changeColor
  - CodeBlockPlugin
  - PanelPlugin
  - subscribeToToolbarAndPickerUpdates
  - subscribeTypeAheadUpdates
  - TextFormattingInputMethodToolbar
  - TextFormattingInputMethodBasic
  - createTable
  - insertTaskDecisionCommand
  - TaskDecisionInputMethod
  - EventDispatcher
  - statusPluginKey
  - StatusState
  - StatusType
  - DatePluginState
  - insertDate
  - openDatePicker
  - deleteDate
  - dateToDateType
  - datePluginKey
  - commitStatusPicker
  - setStatusPickerAt
  - updateStatus
  - updateStatusWithAnalytics
  - removeStatus
  - typeAheadPluginKey
  - TypeAheadPluginState
  - setKeyboardHeight
  - setMobilePaddingTop
  - setIsExpanded
  - dedupe (available via '@atlaskit/editor-common/utils' as `dedupe`)
  - GapCursorSelection (available via '@atlaskit/editor-common/selection' as `GapCursorSelection`)
  - GapCursorSide (available via '@atlaskit/editor-common/selection' as `Side`)
  - HistoryPluginState
  - MentionPluginState
  - InsertBlockInputMethodToolbar
  - selectionPluginKey
  - SelectionData
  - SelectionDataState
  - insertExpand
  - createTypeAheadTools
  - AbstractMentionResource (available via '@atlaskit/mention/resource' as `AbstractMentionResource`)
  - PresenceResource (available via '@atlaskit/mention/resource' as `PresenceResource`)
  - ReactEditorView
  - BaseReactEditorView
  - getDefaultPresetOptionsFromEditorProps
  - lightModeStatusColorPalette
  - darkModeStatusColorPalette
  - PaletteColor
  - DEFAULT_BORDER_COLOR

  WHY: We have been extracting plugins out of `editor-core` and as we move them out we need to remove these exports as the new architecture does not support plugin keys or commands.

  This major bump will remove all remaining commands and keys in one go - some of these features will be accessible in a safe manner in the future via the `ComposableEditor` and the appropriate plugins.

  HOW: Should be no consumers using these methods currently (only mobile bridge which has been updated).

  If there are any issues please reach out to the #help-editor for information on how to update appropriately.

## 0.1.0

### Minor Changes

- [#40580](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/40580) [`f8e7203eec6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f8e7203eec6) - ED-19618 Extract base plugin from editor-core

### Patch Changes

- Updated dependencies
