import { EditorPresetBuilder } from '@atlaskit/editor-common/preset/builder';
import { accessibilityUtilsPlugin } from '@atlaskit/editor-plugin-accessibility-utils/accessibilityUtilsPlugin';
import { alignmentPlugin } from '@atlaskit/editor-plugin-alignment/alignmentPlugin';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPlugin';
import { annotationPlugin } from '@atlaskit/editor-plugin-annotation/annotationPlugin';
import { avatarGroupPlugin } from '@atlaskit/editor-plugin-avatar-group/avatarGroupPlugin';
import { basePlugin } from '@atlaskit/editor-plugin-base/basePlugin';
import { batchAttributeUpdatesPlugin } from '@atlaskit/editor-plugin-batch-attribute-updates/batchAttributeUpdatesPlugin';
import { betterTypeHistoryPlugin } from '@atlaskit/editor-plugin-better-type-history/betterTypeHistoryPlugin';
import { blockControlsPlugin } from '@atlaskit/editor-plugin-block-controls/blockControlsPlugin';
import { blockMenuPlugin } from '@atlaskit/editor-plugin-block-menu/blockMenuPlugin';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type/blockTypePlugin';
import { borderPlugin } from '@atlaskit/editor-plugin-border/borderPlugin';
import { breakoutPlugin } from '@atlaskit/editor-plugin-breakout/breakoutPlugin';
import { captionPlugin } from '@atlaskit/editor-plugin-caption/captionPlugin';
import { cardPlugin } from '@atlaskit/editor-plugin-card/cardPlugin';
import { clearMarksOnEmptyDocPlugin } from '@atlaskit/editor-plugin-clear-marks-on-empty-doc/clearMarksOnEmptyDocPlugin';
import { clipboardPlugin } from '@atlaskit/editor-plugin-clipboard/clipboardPlugin';
import { codeBlockAdvancedPlugin } from '@atlaskit/editor-plugin-code-block-advanced/codeBlockAdvancedPlugin';
import { codeBlockPlugin } from '@atlaskit/editor-plugin-code-block/codeBlockPlugin';
import { collabEditPlugin } from '@atlaskit/editor-plugin-collab-edit/collabEditPlugin';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition/compositionPlugin';
import { connectivityPlugin } from '@atlaskit/editor-plugin-connectivity/connectivityPlugin';
import { contentFormatPlugin } from '@atlaskit/editor-plugin-content-format/contentFormatPlugin';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion/contentInsertionPlugin';
import { contextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier/contextIdentifierPlugin';
import { contextPanelPlugin } from '@atlaskit/editor-plugin-context-panel/contextPanelPlugin';
import { copyButtonPlugin } from '@atlaskit/editor-plugin-copy-button/copyButtonPlugin';
import { customAutoformatPlugin } from '@atlaskit/editor-plugin-custom-autoformat/customAutoformatPlugin';
import { dataConsumerPlugin } from '@atlaskit/editor-plugin-data-consumer/dataConsumerPlugin';
import { datePlugin } from '@atlaskit/editor-plugin-date/datePlugin';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations/decorationsPlugin';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled/editorDisabledPlugin';
import { editorViewModeEffectsPlugin } from '@atlaskit/editor-plugin-editor-viewmode-effects/editorViewmodeEffectsPlugin';
import { editorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePlugin';
import { emojiPlugin } from '@atlaskit/editor-plugin-emoji/emojiPlugin';
import { expandPlugin } from '@atlaskit/editor-plugin-expand/plugin';
import { extensionPlugin } from '@atlaskit/editor-plugin-extension/extensionPlugin';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags/featureFlagsPlugin';
import { findReplacePlugin } from '@atlaskit/editor-plugin-find-replace/findReplacePlugin';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar/floatingToolbarPlugin';
import { focusPlugin } from '@atlaskit/editor-plugin-focus/focusPlugin';
import { fragmentPlugin } from '@atlaskit/editor-plugin-fragment/fragmentPlugin';
import { gridPlugin } from '@atlaskit/editor-plugin-grid/gridPlugin';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline/guidelinePlugin';
import { helpDialogPlugin } from '@atlaskit/editor-plugin-help-dialog/helpDialogPlugin';
import { highlightPlugin } from '@atlaskit/editor-plugin-highlight/highlightPlugin';
import { historyPlugin } from '@atlaskit/editor-plugin-history/historyPlugin';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink/hyperlinkPlugin';
import { indentationPlugin } from '@atlaskit/editor-plugin-indentation/indentationPlugin';
import { insertBlockPlugin } from '@atlaskit/editor-plugin-insert-block/insert-block-plugin';
import { interactionPlugin } from '@atlaskit/editor-plugin-interaction/interaction-plugin';
import { interactivityPlugin } from '@atlaskit/editor-plugin-interactivity';
import { layoutPlugin } from '@atlaskit/editor-plugin-layout/layout-plugin';
import { limitedModePlugin } from '@atlaskit/editor-plugin-limited-mode/limited-mode-plugin';
import { listPlugin } from '@atlaskit/editor-plugin-list/list-plugin';
import { localIdPlugin } from '@atlaskit/editor-plugin-local-id/local-id-plugin';
import { loomPlugin } from '@atlaskit/editor-plugin-loom/loom-plugin';
import { mediaInsertPlugin } from '@atlaskit/editor-plugin-media-insert/media-insert-plugin';
import { mediaPlugin } from '@atlaskit/editor-plugin-media/media-plugin';
import { mentionsPlugin } from '@atlaskit/editor-plugin-mentions/mentions-plugin';
import { metricsPlugin } from '@atlaskit/editor-plugin-metrics/metrics-plugin';
import { panelPlugin } from '@atlaskit/editor-plugin-panel/panel-plugin';
import { pasteOptionsToolbarPlugin } from '@atlaskit/editor-plugin-paste-options-toolbar/paste-options-toolbar-plugin';
import { pastePlugin } from '@atlaskit/editor-plugin-paste/paste-plugin';
import { placeholderTextPlugin } from '@atlaskit/editor-plugin-placeholder-text/placeholder-text-plugin';
import { placeholderPlugin } from '@atlaskit/editor-plugin-placeholder/placeholder-plugin';
import { primaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar/primary-toolbar-plugin';
import { quickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert/quick-insert-plugin';
import { rulePlugin } from '@atlaskit/editor-plugin-rule/rule-plugin';
import { scrollIntoViewPlugin } from '@atlaskit/editor-plugin-scroll-into-view/scroll-into-view-plugin';
import { selectionExtensionPlugin } from '@atlaskit/editor-plugin-selection-extension/selection-extension-plugin';
import { selectionMarkerPlugin } from '@atlaskit/editor-plugin-selection-marker/selection-marker-plugin';
import { selectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar/selection-toolbar-plugin';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection/selection-plugin';
import { showDiffPlugin } from '@atlaskit/editor-plugin-show-diff/show-diff-plugin';
import { statusPlugin } from '@atlaskit/editor-plugin-status/status-plugin';
import { submitEditorPlugin } from '@atlaskit/editor-plugin-submit-editor/submit-editor-plugin';
import { syncedBlockPlugin } from '@atlaskit/editor-plugin-synced-block/synced-block-plugin';
import { tablePlugin } from '@atlaskit/editor-plugin-table/table-plugin';
import { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugin-tasks-and-decisions/tasks-and-decisions-plugin';
import { textColorPlugin } from '@atlaskit/editor-plugin-text-color/text-color-plugin';
import { textFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting/text-formatting-plugin';
import { toolbarListsIndentationPlugin } from '@atlaskit/editor-plugin-toolbar-lists-indentation/toolbar-lists-indentation-plugin';
import { toolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin';
import { trackChangesPlugin } from '@atlaskit/editor-plugin-track-changes/track-changes-plugin';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead/type-ahead-plugin';
import { ufoPlugin } from '@atlaskit/editor-plugin-ufo/ufo-plugin';
import { uiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin';
import { undoRedoPlugin } from '@atlaskit/editor-plugin-undo-redo/undo-redo-plugin';
import { unsupportedContentPlugin } from '@atlaskit/editor-plugin-unsupported-content/unsupported-content-plugin';
import { userIntentPlugin } from '@atlaskit/editor-plugin-user-intent/user-intent-plugin';
import { userPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences/user-preferences-plugin';
import { widthPlugin } from '@atlaskit/editor-plugin-width/width-plugin';
import { UNSAFE_expValNoExposure } from '@atlaskit/platform-feature-experiments/unsafe-exp-val-no-exposure';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { agentManagedExtensionPlugin } from '@atlassian/editor-plugin-agent-managed-extension/agentManagedExtensionPlugin';

import { agentManagedExtensionPluginOptions } from './pluginOptions/agentManagedExtensionPluginOptions';
import { analyticsPluginOptions } from './pluginOptions/analyticsPluginOptions';
import { annotationPluginOptions } from './pluginOptions/annotationPluginOptions';
import { avatarGroupPluginOptions } from './pluginOptions/avatarGroupPluginOptions';
import { basePluginOptions } from './pluginOptions/basePluginOptions';
import { blockMenuPluginOptions } from './pluginOptions/blockMenuPluginOptions';
import { blockTypePluginOptions } from './pluginOptions/blockTypePluginOptions';
import { breakoutPluginOptions } from './pluginOptions/breakoutPluginOptions';
import { cardPluginOptions } from './pluginOptions/cardPluginOptions';
import { codeBlockAdvancedPluginOptions } from './pluginOptions/codeBlockAdvancedPluginOptions';
import { codeBlockPluginOptions } from './pluginOptions/codeBlockPluginOptions';
import { collabEditPluginOptions } from './pluginOptions/collabEditPluginOptions';
import { contentFormatPluginOptions } from './pluginOptions/contentFormatPluginOptions';
import { contextIdentifierPluginOptions } from './pluginOptions/contextIdentifierPluginOptions';
import { contextPanelPluginOptions } from './pluginOptions/contextPanelPluginOptions';
import { customAutoformatPluginOptions } from './pluginOptions/customAutoformatPluginOptions';
import { datePluginOptions } from './pluginOptions/datePluginOptions';
import { editorDisabledPluginOptions } from './pluginOptions/editorDisabledPluginOptions';
import { editorViewModePluginOptions } from './pluginOptions/editorViewModePluginOptions';
import { emojiPluginOptions } from './pluginOptions/emojiPluginOptions';
import { expandPluginOptions } from './pluginOptions/expandPluginOptions';
import { extensionPluginOptions } from './pluginOptions/extensionPluginOptions';
import { featureFlagsPluginOptions } from './pluginOptions/featureFlagsPluginOptions';
import { findReplacePluginOptions } from './pluginOptions/findReplacePluginOptions';
import { gridPluginOptions } from './pluginOptions/gridPluginOptions';
import { helpDialogPluginOptions } from './pluginOptions/helpDialogPluginOptions';
import { hyperlinkPluginOptions } from './pluginOptions/hyperlinkPluginOptions';
import { insertBlockPluginOptions } from './pluginOptions/insertBlockPluginOptions';
import { layoutPluginOptions } from './pluginOptions/layoutPluginOptions';
import { limitedModePluginOptions } from './pluginOptions/limitedModePluginOptions';
import { loomPluginOptions } from './pluginOptions/loomPluginOptions';
import { mediaPluginOptions } from './pluginOptions/mediaPluginOptions/mediaPluginOptions';
import { mentionsPluginOptions } from './pluginOptions/mentionsPluginOptions';
import { metricsPluginOptions } from './pluginOptions/metricsPluginOptions';
import { panelPluginOptions } from './pluginOptions/panelPluginOptions';
import { pastePluginOptions } from './pluginOptions/pastePluginOptions';
import { placeholderPluginOptions } from './pluginOptions/placeholderPluginOptions/placeholderPluginOptions';
import { placeholderTextPluginOptions } from './pluginOptions/placeholderTextPluginOptions';
import { primaryToolbarPluginOptions } from './pluginOptions/primaryToolbarPluginOptions';
import { quickInsertPluginOptions } from './pluginOptions/quickInsertPluginOptions';
import { selectionExtensionPluginOptions } from './pluginOptions/selectionExtensionPluginOptions';
import { selectionMarkerPluginOptions } from './pluginOptions/selectionMarkerPluginOptions';
import { selectionPluginOptions } from './pluginOptions/selectionPluginOptions';
import { selectionToolbarPluginOptions } from './pluginOptions/selectionToolbarPluginOptions';
import { showDiffPluginOptions } from './pluginOptions/showDiffPluginOptions';
import { statusPluginOptions } from './pluginOptions/statusPluginOptions';
import { submitEditorPluginOptions } from './pluginOptions/submitEditorPluginOptions';
import { syncedBlockPluginOptions } from './pluginOptions/syncedBlockPluginOptions';
import { tablePluginOptions } from './pluginOptions/tablePluginOptions';
import { tasksAndDecisionsPluginOptions } from './pluginOptions/tasksAndDecisionsPluginOptions';
import { textColorPluginOptions } from './pluginOptions/textColorPluginOptions';
import { textFormattingPluginOptions } from './pluginOptions/textFormattingPluginOptions';
import { toolbarListsIndentationPluginOptions } from './pluginOptions/toolbarListsIndentationPluginOptions';
import { toolbarPluginOptions } from './pluginOptions/toolbarPluginOptions';
import { trackChangesPluginOptions } from './pluginOptions/trackChangesPluginOptions';
import { typeAheadPluginOptions } from './pluginOptions/typeAheadPluginOptions';
import { userPreferencesPluginOptions } from './pluginOptions/userPreferencesPluginOptions';
import type {
	AllPublicPluginOptions,
	ConfluenceFullPageBasePresetBuilder,
	ConfluenceFullPageBasePresetOptions,
} from './types';

/**
 * Creates the public Confluence full page base editor preset.
 *
 * This preset includes all public @atlaskit/editor-plugin-* plugins used in the
 * Confluence full page editor. Private plugins (AI, referentiality, etc.) are
 * NOT included — they are added on top of this preset in editor-presets-confluence.
 *
 * @example
 * ```ts
 * import { confluenceFullPageBasePreset } from '@atlaskit/editor-presets/confluence-full-page-base';
 *
 * const preset = confluenceFullPageBasePreset(options);
 * ```
 */
export function confluenceFullPageBasePreset(
	props: ConfluenceFullPageBasePresetOptions,
): ConfluenceFullPageBasePresetBuilder {
	const { intl, providers, enabledOptionalPlugins } = props;
	// We remove all `never` properties from the ConfluenceFullPageBasePresetOptions.pluginOptions,
	// we need to return them back.
	const pluginOptions = props.pluginOptions as AllPublicPluginOptions;

	return new EditorPresetBuilder()
		.maybeAdd(
			[limitedModePlugin, limitedModePluginOptions({ options: pluginOptions.limitedMode })],
			!pluginOptions.limitedMode.killSwitchEnabled,
		)
		.add([featureFlagsPlugin, featureFlagsPluginOptions({ options: pluginOptions.featureFlags })])
		.add([analyticsPlugin, analyticsPluginOptions({ options: pluginOptions.analytics })])
		.add(betterTypeHistoryPlugin)
		.add([pastePlugin, pastePluginOptions({ options: pluginOptions.paste, providers })])
		.add(clipboardPlugin)
		.add(focusPlugin)
		.add(compositionPlugin)
		.add([
			contextIdentifierPlugin,
			contextIdentifierPluginOptions({ options: pluginOptions.contextIdentifier, providers }),
		])
		.add([basePlugin, basePluginOptions()])
		.maybeAdd(
			[
				userPreferencesPlugin,
				userPreferencesPluginOptions({ providers, options: pluginOptions.userPreferencesPlugin }),
			],
			enabledOptionalPlugins.userPreferences,
		)
		.add(decorationsPlugin)
		.add([typeAheadPlugin, typeAheadPluginOptions({ options: pluginOptions.typeAhead })])
		.add(historyPlugin)
		.add([
			primaryToolbarPlugin,
			primaryToolbarPluginOptions({ options: pluginOptions.primaryToolbar }),
		])
		.add(uiControlRegistryPlugin)
		.maybeAdd(
			[toolbarPlugin, toolbarPluginOptions({ options: pluginOptions.toolbar })],
			Boolean(enabledOptionalPlugins.toolbar),
		)
		.add([blockMenuPlugin, blockMenuPluginOptions({ options: pluginOptions.blockMenu })])
		.add(undoRedoPlugin)
		.add([blockTypePlugin, blockTypePluginOptions({ options: pluginOptions.blockType })])
		.add(clearMarksOnEmptyDocPlugin)
		.add([
			selectionToolbarPlugin,
			selectionToolbarPluginOptions({ options: pluginOptions.selectionToolbar, providers }),
		])
		.add([hyperlinkPlugin, hyperlinkPluginOptions({ options: pluginOptions.hyperlink })])
		.add([
			textFormattingPlugin,
			textFormattingPluginOptions({ options: pluginOptions.textFormatting }),
		])
		.add(widthPlugin)
		.add([quickInsertPlugin, quickInsertPluginOptions({ options: pluginOptions.quickInsert })])
		.add([
			placeholderPlugin,
			placeholderPluginOptions({ intl, options: pluginOptions.placeholder }),
		])
		.add(unsupportedContentPlugin)
		.add([
			editorDisabledPlugin,
			editorDisabledPluginOptions({ options: pluginOptions.editorDisabled }),
		])
		.add([submitEditorPlugin, submitEditorPluginOptions({ options: pluginOptions.submitEditor })])
		.add(copyButtonPlugin)
		.maybeAdd(floatingToolbarPlugin, enabledOptionalPlugins.floatingToolbar ?? true)
		.maybeAdd(interactionPlugin, Boolean(enabledOptionalPlugins.interaction))
		.add([selectionPlugin, selectionPluginOptions({ options: pluginOptions.selection })])
		.add([codeBlockPlugin, codeBlockPluginOptions({ providers })])
		.add(ufoPlugin)
		.add(dataConsumerPlugin)
		.add(accessibilityUtilsPlugin)
		.add(contentInsertionPlugin)
		.add(batchAttributeUpdatesPlugin)
		.add([breakoutPlugin, breakoutPluginOptions({ options: pluginOptions.breakout })])
		.add(alignmentPlugin)
		.add([textColorPlugin, textColorPluginOptions({ options: pluginOptions.textColor })])
		.add(listPlugin)
		.add(rulePlugin)
		.add([expandPlugin, expandPluginOptions({ options: pluginOptions.expand })])
		.add(guidelinePlugin)
		.add([gridPlugin, gridPluginOptions({ options: pluginOptions.grid })])
		.add([
			annotationPlugin,
			annotationPluginOptions({ options: pluginOptions.annotation, providers }),
		])
		.add([mediaPlugin, mediaPluginOptions({ intl, options: pluginOptions.media, providers })])
		.add(mediaInsertPlugin)
		.add(captionPlugin)
		.add([mentionsPlugin, mentionsPluginOptions({ options: pluginOptions.mentions, providers })])
		.add([emojiPlugin, emojiPluginOptions({ options: pluginOptions.emoji, providers })])
		.add([tablePlugin, tablePluginOptions({ options: pluginOptions.table })])
		.add([
			tasksAndDecisionsPlugin,
			tasksAndDecisionsPluginOptions({ options: pluginOptions.tasksAndDecisions, providers }),
		])
		.add([
			helpDialogPlugin,
			helpDialogPluginOptions({
				options: {
					imageUploadProviderExists: false,
					aiEnabled: false,
				},
			}),
		])
		.add([
			collabEditPlugin,
			collabEditPluginOptions({ options: pluginOptions.collabEdit, providers }),
		])
		.add([panelPlugin, panelPluginOptions({ options: pluginOptions.panel })])
		.add([contextPanelPlugin, contextPanelPluginOptions({ options: pluginOptions.contextPanel })])
		.add([extensionPlugin, extensionPluginOptions({ options: pluginOptions.extension })])
		.maybeAdd(
			[
				agentManagedExtensionPlugin,
				agentManagedExtensionPluginOptions({ options: pluginOptions.agentManagedExtension }),
			],
			UNSAFE_expValNoExposure('agent-managed_blocks_mvp', 'isEnabled', false),
		)
		.add([datePlugin, datePluginOptions({ options: pluginOptions.date })])
		.add([
			placeholderTextPlugin,
			placeholderTextPluginOptions({ options: pluginOptions.placeholderText }),
		])
		.add([layoutPlugin, layoutPluginOptions({ options: pluginOptions.layout })])
		.add([cardPlugin, cardPluginOptions({ options: pluginOptions.card, providers })])
		.add([
			customAutoformatPlugin,
			customAutoformatPluginOptions({ options: pluginOptions.customAutoformat, providers }),
		])
		.add([statusPlugin, statusPluginOptions({ options: pluginOptions.status })])
		.maybeAdd(
			[syncedBlockPlugin, syncedBlockPluginOptions({ options: pluginOptions.syncedBlock })],
			!!pluginOptions.syncedBlock,
		)
		.add(indentationPlugin)
		.add(scrollIntoViewPlugin)
		.add([
			toolbarListsIndentationPlugin,
			toolbarListsIndentationPluginOptions({ options: pluginOptions.toolbarListsIndentation }),
		])
		.add([insertBlockPlugin, insertBlockPluginOptions({ options: pluginOptions.insertBlock })])
		.add([avatarGroupPlugin, avatarGroupPluginOptions({ options: pluginOptions.avatarGroup })])
		.maybeAdd(
			[findReplacePlugin, findReplacePluginOptions({ options: pluginOptions.findReplace })],
			enabledOptionalPlugins.findReplace,
		)
		.add(borderPlugin)
		.add(fragmentPlugin)
		.add([
			pasteOptionsToolbarPlugin,
			{
				usePopupBasedPasteActionsMenu: false,
			},
		])
		.maybeAdd(
			[loomPlugin, loomPluginOptions({ options: pluginOptions.loom })],
			enabledOptionalPlugins.loom,
		)
		.add([
			editorViewModePlugin,
			editorViewModePluginOptions({ options: pluginOptions.editorViewMode }),
		])
		.add(editorViewModeEffectsPlugin)
		.add([
			selectionMarkerPlugin,
			selectionMarkerPluginOptions({ options: pluginOptions.selectionMarker }),
		])
		.add([
			blockControlsPlugin,
			{
				rightSideControlsEnabled:
					fg('confluence_remix_button_right_side_block_fg') &&
					expValEqualsNoExposure('cc-maui-experiment', 'isEnabled', true),
			},
		])
		.add(highlightPlugin)
		.maybeAdd(connectivityPlugin, enabledOptionalPlugins.connectivity)
		.maybeAdd(
			[metricsPlugin, metricsPluginOptions({ options: pluginOptions.metrics })],
			enabledOptionalPlugins.metrics,
		)
		.add(interactivityPlugin)
		.add([
			contentFormatPlugin,
			contentFormatPluginOptions({ options: pluginOptions.contentFormat }),
		])
		.maybeAdd(
			[
				codeBlockAdvancedPlugin,
				codeBlockAdvancedPluginOptions({ options: pluginOptions.codeBlockAdvanced }),
			],
			enabledOptionalPlugins.codeBlockAdvanced,
		)
		.maybeAdd(
			[
				selectionExtensionPlugin,
				selectionExtensionPluginOptions({ options: pluginOptions.selectionExtension }),
			],
			enabledOptionalPlugins.selectionExtension,
		)
		.add(userIntentPlugin)
		.maybeAdd(
			[showDiffPlugin, showDiffPluginOptions({ options: pluginOptions.showDiff })],
			enabledOptionalPlugins.showDiff,
		)
		.maybeAdd(
			[trackChangesPlugin, trackChangesPluginOptions({ options: pluginOptions.trackChanges })],
			enabledOptionalPlugins.trackChanges,
		)
		.maybeAdd(localIdPlugin, enabledOptionalPlugins.localId);
}
