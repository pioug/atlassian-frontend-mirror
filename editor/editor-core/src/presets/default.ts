// #region Imports
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import type { SelectionPluginOptions } from '@atlaskit/editor-common/selection';
import type {
	EditorAppearance,
	FeatureFlags,
	PerformanceTracking,
} from '@atlaskit/editor-common/types';
import { userPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import type { BasePluginOptions } from '@atlaskit/editor-plugins/base';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { betterTypeHistoryPlugin } from '@atlaskit/editor-plugins/better-type-history';
import type { BlockTypePluginOptions } from '@atlaskit/editor-plugins/block-type';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { clearMarksOnEmptyDocPlugin } from '@atlaskit/editor-plugins/clear-marks-on-empty-doc';
import { clipboardPlugin } from '@atlaskit/editor-plugins/clipboard';
import type { CodeBlockPluginOptions } from '@atlaskit/editor-plugins/code-block';
import { codeBlockPlugin } from '@atlaskit/editor-plugins/code-block';
import { compositionPlugin } from '@atlaskit/editor-plugins/composition';
import { contextIdentifierPlugin } from '@atlaskit/editor-plugins/context-identifier';
import { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';
import { featureFlagsPlugin } from '@atlaskit/editor-plugins/feature-flags';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import { focusPlugin } from '@atlaskit/editor-plugins/focus';
import { historyPlugin } from '@atlaskit/editor-plugins/history';
import { hyperlinkPlugin, type HyperlinkPluginOptions } from '@atlaskit/editor-plugins/hyperlink';
import { interactionPlugin } from '@atlaskit/editor-plugins/interaction';
import type { PastePluginOptions } from '@atlaskit/editor-plugins/paste';
import { pastePlugin } from '@atlaskit/editor-plugins/paste';
import type { PlaceholderPluginOptions } from '@atlaskit/editor-plugins/placeholder';
import { placeholderPlugin } from '@atlaskit/editor-plugins/placeholder';
import { primaryToolbarPlugin } from '@atlaskit/editor-plugins/primary-toolbar';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import type { QuickInsertPluginOptions } from '@atlaskit/editor-plugins/quick-insert';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { selectionToolbarPlugin } from '@atlaskit/editor-plugins/selection-toolbar';
import { submitEditorPlugin } from '@atlaskit/editor-plugins/submit-editor';
import { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';
import type { TextFormattingPluginOptions } from '@atlaskit/editor-plugins/text-formatting';
import type { ToolbarPluginOptions } from '@atlaskit/editor-plugins/toolbar';
import { toolbarPlugin } from '@atlaskit/editor-plugins/toolbar';
import type { TypeAheadPluginOptions } from '@atlaskit/editor-plugins/type-ahead';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import { undoRedoPlugin } from '@atlaskit/editor-plugins/undo-redo';
import { unsupportedContentPlugin } from '@atlaskit/editor-plugins/unsupported-content';
import { userIntentPlugin } from '@atlaskit/editor-plugins/user-intent';
import { widthPlugin } from '@atlaskit/editor-plugins/width';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValNoExposure } from '@atlaskit/tmp-editor-statsig/expVal';

import { isFullPage as fullPageCheck } from '../utils/is-full-page';

import type { DefaultPresetBuilder } from './default-preset-type';
// #endregion

export type DefaultPresetPluginOptions = {
	/**
	 * There is expected to be temporary divergence between Live Page editor expand behaviour and the standard expand behaviour.
	 *
	 * This is expected to be removed in Q4 as Editor and Live Page teams align on a singular behaviour.
	 *
	 * It is only supported for use by Confluence.
	 *
	 * @default false
	 */
	__livePage?: boolean;
	allowAnalyticsGASV3?: boolean;
	allowUndoRedoButtons?: boolean;
	appearance?: EditorAppearance | undefined;
	base?: BasePluginOptions;
	blockType?: BlockTypePluginOptions;
	codeBlock?: CodeBlockPluginOptions;
	contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	disabled?: boolean;
	featureFlags?: FeatureFlags;
	hyperlinkOptions?: HyperlinkPluginOptions;
	paste?: PastePluginOptions;
	performanceTracking?: PerformanceTracking;
	placeholder?: PlaceholderPluginOptions;
	preferenceToolbarAboveSelection?: boolean;
	quickInsert?: QuickInsertPluginOptions;
	selection?: SelectionPluginOptions;
	submitEditor?: (editorView: EditorView) => void;
	textFormatting?: TextFormattingPluginOptions;
	toolbar?: ToolbarPluginOptions;
	typeAhead?: TypeAheadPluginOptions;
};

/**
 * Note: The order that presets are added determines
 * their placement in the editor toolbar
 * @param options
 * @example
 */
export function createDefaultPreset(options: DefaultPresetPluginOptions): DefaultPresetBuilder {
	const isFullPage = fullPageCheck(options.appearance);
	const preset = new EditorPresetBuilder()
		.add([featureFlagsPlugin, options.featureFlags || {}])
		.maybeAdd(
			[
				analyticsPlugin,
				{
					createAnalyticsEvent: options.createAnalyticsEvent,
					performanceTracking: options.performanceTracking,
				},
			],
			Boolean(options.allowAnalyticsGASV3),
		)
		.add(betterTypeHistoryPlugin)
		.add([pastePlugin, { ...options?.paste, isFullPage }])
		.add(clipboardPlugin)
		.add(focusPlugin)
		.maybeAdd(
			[
				userPreferencesPlugin,
				{
					initialUserPreferences: {
						toolbarDockingPosition: isFullPage ? 'none' : 'top',
					},
				},
			],
			() => fg('platform_editor_use_preferences_plugin'),
		)
		.maybeAdd(
			interactionPlugin,
			Boolean(options?.__livePage) ||
				expValEquals('platform_editor_no_cursor_on_edit_page_init', 'isEnabled', true),
		)
		.add(compositionPlugin)
		.add([
			contextIdentifierPlugin,
			{ contextIdentifierProvider: options.contextIdentifierProvider },
		])
		.add([basePlugin, options.base])
		.add(decorationsPlugin)
		.add([typeAheadPlugin, options.typeAhead])
		.maybeAdd(historyPlugin, Boolean(options.allowUndoRedoButtons))
		.maybeAdd(
			userIntentPlugin,
			expValNoExposure('platform_editor_lovability_user_intent', 'isEnabled', true),
		)
		.maybeAdd(
			[toolbarPlugin, options.toolbar || {}],
			Boolean(options.toolbar?.enableNewToolbarExperience),
		)
		.add([primaryToolbarPlugin, { contextualFormattingEnabled: isFullPage }])
		.maybeAdd(
			undoRedoPlugin,
			Boolean(options.featureFlags?.undoRedoButtons ?? options.allowUndoRedoButtons),
		)
		.add([
			blockTypePlugin,
			{ ...options.blockType, includeBlockQuoteAsTextstyleOption: isFullPage },
		])
		.add(clearMarksOnEmptyDocPlugin)
		.add([
			selectionToolbarPlugin,
			{
				preferenceToolbarAboveSelection: !!options.preferenceToolbarAboveSelection,
				contextualFormattingEnabled: isFullPage,
			},
		])
		.add([
			hyperlinkPlugin,
			{
				...options.hyperlinkOptions,
				// @ts-ignore Temporary solution to check for Live Page editor.
				__livePage: options.__livePage,
			},
		])
		.add([textFormattingPlugin, options.textFormatting])
		.add(widthPlugin)
		.add([quickInsertPlugin, options.quickInsert])
		.add([placeholderPlugin, options.placeholder])
		.add(unsupportedContentPlugin)
		.add([editorDisabledPlugin, { initialDisabledState: options.disabled }])
		.add([submitEditorPlugin, options.submitEditor])
		.add(copyButtonPlugin)
		.add(floatingToolbarPlugin)
		.add([selectionPlugin, { ...options.selection, __livePage: options.__livePage }])
		.add([codeBlockPlugin, options.codeBlock]);
	return preset;
}

/**
 *
 * @param props
 * @example
 */
export function useDefaultPreset(props: DefaultPresetPluginOptions) {
	const preset = createDefaultPreset(props);
	return [preset];
}
