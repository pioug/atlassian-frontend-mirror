import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { accessibilityUtilsPlugin } from '@atlaskit/editor-plugin-accessibility-utils';
import { alignmentPlugin } from '@atlaskit/editor-plugin-alignment';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { annotationPlugin } from '@atlaskit/editor-plugin-annotation';
import { avatarGroupPlugin } from '@atlaskit/editor-plugin-avatar-group';
import { basePlugin } from '@atlaskit/editor-plugin-base';
import { batchAttributeUpdatesPlugin } from '@atlaskit/editor-plugin-batch-attribute-updates';
import { betterTypeHistoryPlugin } from '@atlaskit/editor-plugin-better-type-history';
import { blockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import { blockMenuPlugin } from '@atlaskit/editor-plugin-block-menu';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import { borderPlugin } from '@atlaskit/editor-plugin-border';
import { breakoutPlugin } from '@atlaskit/editor-plugin-breakout';
import { captionPlugin } from '@atlaskit/editor-plugin-caption';
import { cardPlugin } from '@atlaskit/editor-plugin-card';
import { clearMarksOnEmptyDocPlugin } from '@atlaskit/editor-plugin-clear-marks-on-empty-doc';
import { clipboardPlugin } from '@atlaskit/editor-plugin-clipboard';
import { codeBidiWarningPlugin } from '@atlaskit/editor-plugin-code-bidi-warning';
import { codeBlockPlugin } from '@atlaskit/editor-plugin-code-block';
import { codeBlockAdvancedPlugin } from '@atlaskit/editor-plugin-code-block-advanced';
import { collabEditPlugin } from '@atlaskit/editor-plugin-collab-edit';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import { connectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
import { contentFormatPlugin } from '@atlaskit/editor-plugin-content-format';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { contextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier';
import { contextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import { copyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';
import { customAutoformatPlugin } from '@atlaskit/editor-plugin-custom-autoformat';
import { dataConsumerPlugin } from '@atlaskit/editor-plugin-data-consumer';
import { datePlugin } from '@atlaskit/editor-plugin-date';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import { editorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import { editorViewModeEffectsPlugin } from '@atlaskit/editor-plugin-editor-viewmode-effects';
import { emojiPlugin } from '@atlaskit/editor-plugin-emoji';
import { expandPlugin } from '@atlaskit/editor-plugin-expand';
import { extensionPlugin } from '@atlaskit/editor-plugin-extension';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { findReplacePlugin } from '@atlaskit/editor-plugin-find-replace';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import { focusPlugin } from '@atlaskit/editor-plugin-focus';
import { fragmentPlugin } from '@atlaskit/editor-plugin-fragment';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { helpDialogPlugin } from '@atlaskit/editor-plugin-help-dialog';
import { highlightPlugin } from '@atlaskit/editor-plugin-highlight';
import { historyPlugin } from '@atlaskit/editor-plugin-history';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import { indentationPlugin } from '@atlaskit/editor-plugin-indentation';
import { insertBlockPlugin } from '@atlaskit/editor-plugin-insert-block';
import { interactionPlugin } from '@atlaskit/editor-plugin-interaction';
import { layoutPlugin } from '@atlaskit/editor-plugin-layout';
import { limitedModePlugin } from '@atlaskit/editor-plugin-limited-mode';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import { localIdPlugin } from '@atlaskit/editor-plugin-local-id';
import { loomPlugin } from '@atlaskit/editor-plugin-loom';
import { mediaPlugin } from '@atlaskit/editor-plugin-media';
import { mediaInsertPlugin } from '@atlaskit/editor-plugin-media-insert';
import { mentionsPlugin } from '@atlaskit/editor-plugin-mentions';
import { metricsPlugin } from '@atlaskit/editor-plugin-metrics';
import { panelPlugin } from '@atlaskit/editor-plugin-panel';
import { pastePlugin } from '@atlaskit/editor-plugin-paste';
import { pasteOptionsToolbarPlugin } from '@atlaskit/editor-plugin-paste-options-toolbar';
import { placeholderPlugin } from '@atlaskit/editor-plugin-placeholder';
import { placeholderTextPlugin } from '@atlaskit/editor-plugin-placeholder-text';
import { primaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import { quickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import { rulePlugin } from '@atlaskit/editor-plugin-rule';
import { scrollIntoViewPlugin } from '@atlaskit/editor-plugin-scroll-into-view';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { selectionExtensionPlugin } from '@atlaskit/editor-plugin-selection-extension';
import { selectionMarkerPlugin } from '@atlaskit/editor-plugin-selection-marker';
import { selectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';
import { showDiffPlugin } from '@atlaskit/editor-plugin-show-diff';
import { statusPlugin } from '@atlaskit/editor-plugin-status';
import { submitEditorPlugin } from '@atlaskit/editor-plugin-submit-editor';
import { syncedBlockPlugin } from '@atlaskit/editor-plugin-synced-block';
import { tablePlugin } from '@atlaskit/editor-plugin-table';
import { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugin-tasks-and-decisions';
import { textColorPlugin } from '@atlaskit/editor-plugin-text-color';
import { textFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import { toolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import { toolbarListsIndentationPlugin } from '@atlaskit/editor-plugin-toolbar-lists-indentation';
import { trackChangesPlugin } from '@atlaskit/editor-plugin-track-changes';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { ufoPlugin } from '@atlaskit/editor-plugin-ufo';
import { uiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry';
import { undoRedoPlugin } from '@atlaskit/editor-plugin-undo-redo';
import { unsupportedContentPlugin } from '@atlaskit/editor-plugin-unsupported-content';
import { userIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import { userPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { analyticsPluginOptions } from './pluginOptions/analyticsPluginOptions';
import { annotationPluginOptions } from './pluginOptions/annotationPluginOptions';
import { avatarGroupPluginOptions } from './pluginOptions/avatarGroupPluginOptions';
import { basePluginOptions } from './pluginOptions/basePluginOptions';
import { blockMenuPluginOptions } from './pluginOptions/blockMenuPluginOptions';
import { blockTypePluginOptions } from './pluginOptions/blockTypePluginOptions';
import { breakoutPluginOptions } from './pluginOptions/breakoutPluginOptions';
import { cardPluginOptions } from './pluginOptions/cardPluginOptions';
import { codeBidiWarningPluginOptions } from './pluginOptions/codeBidiWarningPluginOptions';
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
		.add([basePlugin, basePluginOptions({ options: pluginOptions.base })])
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
		.maybeAdd(
			[toolbarPlugin, toolbarPluginOptions({ options: pluginOptions.toolbar })],
			Boolean(enabledOptionalPlugins.toolbar),
		)
		.maybeAdd(
			[blockMenuPlugin, blockMenuPluginOptions({ options: pluginOptions.blockMenu })],
			editorExperiment('platform_editor_block_menu', true),
		)
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
		.add([codeBlockPlugin, codeBlockPluginOptions({ options: pluginOptions.codeBlock })])
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
			!!pluginOptions.syncedBlock && editorExperiment('platform_synced_block', true),
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
			uiControlRegistryPlugin,
			expValEqualsNoExposure('platform_editor_paste_actions_menu', 'isEnabled', true),
		)
		.maybeAdd(
			[
				codeBidiWarningPlugin,
				codeBidiWarningPluginOptions({ options: pluginOptions.codeBidiWarning }),
			],
			!expValEquals('platform_editor_remove_bidi_char_warning', 'isEnabled', true),
		)
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
		.maybeAdd(
			[contentFormatPlugin, contentFormatPluginOptions({ options: pluginOptions.contentFormat })],
			expValEquals('confluence_compact_text_format', 'isEnabled', true),
		)
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
