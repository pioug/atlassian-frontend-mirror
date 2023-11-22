# @atlaskit/editor-plugin-base

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
