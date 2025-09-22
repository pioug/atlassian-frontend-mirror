import { useMemo } from 'react';

import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { createFeatureFlagsFromProps } from '@atlaskit/editor-core';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { alignmentPlugin } from '@atlaskit/editor-plugins/alignment';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { betterTypeHistoryPlugin } from '@atlaskit/editor-plugins/better-type-history';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { breakoutPlugin } from '@atlaskit/editor-plugins/breakout';
import { captionPlugin } from '@atlaskit/editor-plugins/caption';
import { cardPlugin } from '@atlaskit/editor-plugins/card';
import { clearMarksOnEmptyDocPlugin } from '@atlaskit/editor-plugins/clear-marks-on-empty-doc';
import { clipboardPlugin } from '@atlaskit/editor-plugins/clipboard';
import { codeBlockPlugin } from '@atlaskit/editor-plugins/code-block';
import { compositionPlugin } from '@atlaskit/editor-plugins/composition';
import { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';
import { contextIdentifierPlugin } from '@atlaskit/editor-plugins/context-identifier';
import { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';
import { datePlugin } from '@atlaskit/editor-plugins/date';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';
import { emojiPlugin } from '@atlaskit/editor-plugins/emoji';
import { expandPlugin } from '@atlaskit/editor-plugins/expand';
import { extensionPlugin } from '@atlaskit/editor-plugins/extension';
import { featureFlagsPlugin } from '@atlaskit/editor-plugins/feature-flags';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import { focusPlugin } from '@atlaskit/editor-plugins/focus';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { highlightPlugin } from '@atlaskit/editor-plugins/highlight';
import { historyPlugin } from '@atlaskit/editor-plugins/history';
import { indentationPlugin } from '@atlaskit/editor-plugins/indentation';
import { insertBlockPlugin } from '@atlaskit/editor-plugins/insert-block';
import { layoutPlugin } from '@atlaskit/editor-plugins/layout';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { panelPlugin } from '@atlaskit/editor-plugins/panel';
import { pastePlugin } from '@atlaskit/editor-plugins/paste';
import { placeholderPlugin } from '@atlaskit/editor-plugins/placeholder';
import { placeholderTextPlugin } from '@atlaskit/editor-plugins/placeholder-text';
import { primaryToolbarPlugin } from '@atlaskit/editor-plugins/primary-toolbar';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { rulePlugin } from '@atlaskit/editor-plugins/rule';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { selectionToolbarPlugin } from '@atlaskit/editor-plugins/selection-toolbar';
import { statusPlugin } from '@atlaskit/editor-plugins/status';
import { submitEditorPlugin } from '@atlaskit/editor-plugins/submit-editor';
import { tablesPlugin } from '@atlaskit/editor-plugins/table';
import { textColorPlugin } from '@atlaskit/editor-plugins/text-color';
import { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';
import { toolbarListsIndentationPlugin } from '@atlaskit/editor-plugins/toolbar-lists-indentation';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import { undoRedoPlugin } from '@atlaskit/editor-plugins/undo-redo';
import { unsupportedContentPlugin } from '@atlaskit/editor-plugins/unsupported-content';
import { userPreferencesPlugin } from '@atlaskit/editor-plugins/user-preferences';
import { widthPlugin } from '@atlaskit/editor-plugins/width';

import { decoratePlugin } from './decorate-plugin';

// Below are flags hardcoded for the LCM editor. These flags are not available in Switcheroo.
const lcmExclusiveFlags = {
	'lcm-prevent-render-tracking': true, // Used in editor-internal & ReactEditorViewNext to disable render tracking. See - https://product-fabric.atlassian.net/browse/ED-26650
};

const allowedExperiments = { 'macro-interaction-updates': true };

export const useEditorFeatureFlags = () => {
	// IMPORTANT: If you add a new feature flag here, please make sure to add it to the
	// `featureFlagsPluginOptions` function in 'packages/editor/editor-presets-confluence/src/presets/full-page/pluginOptions/featureFlagsPluginOptions.ts`.
	return useMemo(
		() => ({
			/**
			 * This feature flag has completed rollout in Confluence and is to be cleaned up from LD
			 * but cannot yet be cleaned up from editor component as pending rollout in other products first
			 */
			'lp-link-picker': true,
			'table-drag-and-drop': true,
			'table-with-fixed-column-widths-option': true,
			'renderer-tti-tracking': true,
		}),
		[],
	);
};

export function useNestedEditorPreset(): {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	editorApi: any;
	fullPageEditorFeatureFlags: Record<string, boolean | string>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	preset: EditorPresetBuilder<any, any>;
} {
	const isFullPage = true;

	const editorFeatureFlags = useEditorFeatureFlags();

	const fullPageEditorFeatureFlags = useMemo(
		() => ({
			...editorFeatureFlags,
			...allowedExperiments,
			...lcmExclusiveFlags,
		}),
		[editorFeatureFlags],
	);

	const finalPreset = new EditorPresetBuilder()
		// Default preset minus blockType
		.add([featureFlagsPlugin, createFeatureFlagsFromProps(fullPageEditorFeatureFlags) || {}])
		.add([
			analyticsPlugin,
			{
				// renable when we have props passed in for these
				// createAnalyticsEvent: options.createAnalyticsEvent,
				// performanceTracking: options.performanceTracking,
			},
		])
		.add(betterTypeHistoryPlugin)
		.add([pastePlugin, { isFullPage }])
		.add(clipboardPlugin)
		.add(focusPlugin)
		.add([
			userPreferencesPlugin,
			{
				initialUserPreferences: {
					toolbarDockingPosition: 'none',
				},
			},
		])
		.add(compositionPlugin)
		.add([
			contextIdentifierPlugin,
			{
				// renable when we have props passed in for these
				// contextIdentifierProvider: options.contextIdentifierProvider
			},
		])
		.add([basePlugin, {}])
		.add(decorationsPlugin)
		.add([typeAheadPlugin, {}])
		.add(historyPlugin)
		.add([primaryToolbarPlugin, { contextualFormattingEnabled: true }])
		.add(undoRedoPlugin)
		.add(clearMarksOnEmptyDocPlugin)
		.add([
			selectionToolbarPlugin,
			{
				contextualFormattingEnabled: true,
			},
		])
		/* .add([
			hyperlinkPlugin,
			{
				linkPicker,
				// @ts-ignore Temporary solution to check for Live Page editor.
				__livePage: false,
			},
		]) */
		.add([
			decoratePlugin(
				textFormattingPlugin,
				[],
				{},
				// Remove mark exclusion between code and all other text formatting (fontStyle), links, type-ahead (searchQuery) and background/text color (color)
				new Map([['code', (markSpec) => ({ ...markSpec, excludes: undefined })]]),
			),
			{},
		])
		.add(widthPlugin)
		.add([quickInsertPlugin, { enableElementBrowser: true }])
		.add([
			placeholderPlugin,
			{
				placeholder: ' ',
			},
		])
		.add(unsupportedContentPlugin)
		.add(editorDisabledPlugin)
		.add(submitEditorPlugin)
		.add(copyButtonPlugin)
		.add(floatingToolbarPlugin)
		.add([selectionPlugin, { __livePage: false }])
		.add([codeBlockPlugin, {}])
		/* .add([
			contextPanelPlugin,
			{
				objectSideBar: {
					showPanel: showObjectSidebar,
					closePanel: hideObjectSidebar,
					closePanelById: hideObjectSidebarByPanelId,
				},
			},
		]) */
		// Decorated node support
		.add([decoratePlugin(expandPlugin, ['expand', 'nestedExpand']), { allowInsertion: true }])
		.add([insertBlockPlugin, { allowTables: true, allowExpand: true }])
		.add([
			decoratePlugin(extensionPlugin, ['bodiedExtension'], {
				transformer: (node) => ({
					...node,
					// Filter out node that skips nested bodied extension parsing
					parseDOM: node.parseDOM?.filter((i) => !i.skip && i.context !== 'bodiedExtension//'),
				}),
			}),
			{
				breakoutEnabled: false,
				appearance: 'full-width',
			},
		])
		.add(captionPlugin)
		/* .add([
			mentionsPlugin,
			{
				sanitizePrivateContent: true,
				allowZeroWidthSpaceAfter: true,
				insertDisplayName: true,
				profilecardProvider,
			},
		]) */
		.add([emojiPlugin, { headless: true }])
		.add([
			decoratePlugin(panelPlugin, ['panel']),
			{ allowCustomPanel: true, allowCustomPanelEdit: true },
		])
		.add(contentInsertionPlugin)
		.add(guidelinePlugin)
		.add([
			decoratePlugin(tablesPlugin, ['tableCell', 'tableHeader', 'nestedExpand']),
			{
				tableOptions: {
					advanced: true,
					allowMergeCells: true,
					allowColumnResizing: true,
					allowNumberColumn: true,
					allowDistributeColumns: true,
				},
				allowContextualMenu: true,
				isTableScalingEnabled: true,
				dragAndDropEnabled: true,
			},
		])
		.add(decoratePlugin(listPlugin, ['listItem']))
		.add([
			decoratePlugin(blockTypePlugin, ['blockquote']),
			{ includeBlockQuoteAsTextstyleOption: true },
		])
		.add(breakoutPlugin)
		.add(gridPlugin)
		/* .add([annotationPlugin, annotationProvider]) */
		/* .add([
			mediaPlugin,
			{
				provider: mediaProvider,
				allowLazyLoading: true,
				allowAdvancedToolBarOptions: true,
				allowMediaSingleEditable: true,
				allowRemoteDimensionsFetch: true,
				allowDropzoneDropLine: true,
				allowImagePreview: true,
				fullWidthEnabled: true,
				editorAppearance: 'full-width',
				isCopyPasteEnabled: true,
				allowMediaSingle: true,
				allowResizing: true,
				allowResizingInTables: true,
				allowLinking: true,
				allowAltTextOnImages: true,
				allowCaptions: true,
				allowMediaInlineImages: true,
				featureFlags: {
					mediaInline: true,
				},
			},
		])
		.add(mediaInsertPlugin) */
		.add(alignmentPlugin)
		.add(indentationPlugin)
		.add([
			toolbarListsIndentationPlugin,
			{
				showIndentationButtons: true,
				allowHeadingAndParagraphIndentation: true,
			},
		])
		/* .add([
			tasksAndDecisionsPlugin,
			{ allowNestedTasks: true, taskDecisionProvider, consumeTabs: isFullPage },
		]) */
		.add(textColorPlugin)
		.add([placeholderTextPlugin, { allowInserting: false }])
		.add([
			layoutPlugin,
			{
				allowBreakout: true,
				UNSAFE_addSidebarLayouts: true,
				useLongPressSelection: false,
				UNSAFE_allowSingleColumnLayout: undefined,
				editorAppearance: 'full-width',
			},
		])
		.add(datePlugin)
		.add([
			cardPlugin,
			{
				fullWidthMode: true,
				editorAppearance: 'full-width',
				allowEmbeds: true,
			},
		])
		.add(statusPlugin)
		.add(rulePlugin)
		.add(
			decoratePlugin(
				highlightPlugin,
				[],
				{},
				// Remove mark exclusion between backgroundColor and textColor (color)
				new Map([['backgroundColor', (markSpec) => ({ ...markSpec, excludes: undefined })]]),
			),
		);

	const { editorApi, preset } = usePreset(() => finalPreset);

	return { preset, editorApi, fullPageEditorFeatureFlags: {} };
}
