import type { IntlShape } from 'react-intl-next';

import type { CollabEditProvider } from '@atlaskit/editor-common/collab';
import type { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import type {
	AutoformattingProvider,
	CardProvider,
	ContextIdentifierProvider,
	MediaProvider,
	ProfilecardProvider,
} from '@atlaskit/editor-common/provider-factory';
import type { NextEditorPlugin, UserPreferencesProvider } from '@atlaskit/editor-common/types';
import type { UserPreferencesProvider as UserPreferencesProviderNext } from '@atlaskit/editor-common/user-preferences';
import type { AccessibilityUtilsPlugin } from '@atlaskit/editor-plugin-accessibility-utils';
import type { AlignmentPlugin } from '@atlaskit/editor-plugin-alignment';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type {
	AnnotationPlugin,
	InlineCommentAnnotationProvider,
} from '@atlaskit/editor-plugin-annotation';
import type { AvatarGroupPlugin } from '@atlaskit/editor-plugin-avatar-group';
import type { BasePlugin } from '@atlaskit/editor-plugin-base';
import type { BatchAttributeUpdatesPlugin } from '@atlaskit/editor-plugin-batch-attribute-updates';
import type { BetterTypeHistoryPlugin } from '@atlaskit/editor-plugin-better-type-history';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu';
import type { BlockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import type { BorderPlugin } from '@atlaskit/editor-plugin-border';
import type { BreakoutPlugin } from '@atlaskit/editor-plugin-breakout';
import type { CaptionPlugin } from '@atlaskit/editor-plugin-caption';
import type { CardPlugin } from '@atlaskit/editor-plugin-card';
import type { ClearMarksOnEmptyDocPlugin } from '@atlaskit/editor-plugin-clear-marks-on-empty-doc';
import type { ClipboardPlugin } from '@atlaskit/editor-plugin-clipboard';
import type { CodeBidiWarningPlugin } from '@atlaskit/editor-plugin-code-bidi-warning';
import type { CodeBlockPlugin } from '@atlaskit/editor-plugin-code-block';
import type { CodeBlockAdvancedPlugin } from '@atlaskit/editor-plugin-code-block-advanced';
import type { CollabEditPlugin } from '@atlaskit/editor-plugin-collab-edit';
import type { CompositionPlugin } from '@atlaskit/editor-plugin-composition';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
import type { ContentFormatPlugin } from '@atlaskit/editor-plugin-content-format';
import type { ContentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier';
import type { ContextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import type { CopyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';
import type { CustomAutoformatPlugin } from '@atlaskit/editor-plugin-custom-autoformat';
import type { DataConsumerPlugin } from '@atlaskit/editor-plugin-data-consumer';
import type { DatePlugin } from '@atlaskit/editor-plugin-date';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { EditorViewModeEffectsPlugin } from '@atlaskit/editor-plugin-editor-viewmode-effects';
import type { EmojiNodeDataProvider, EmojiPlugin } from '@atlaskit/editor-plugin-emoji';
import type { ExpandPlugin } from '@atlaskit/editor-plugin-expand';
import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { FindReplacePlugin } from '@atlaskit/editor-plugin-find-replace';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { FocusPlugin } from '@atlaskit/editor-plugin-focus';
import type { FragmentPlugin } from '@atlaskit/editor-plugin-fragment';
import type { GridPlugin } from '@atlaskit/editor-plugin-grid';
import type { GuidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import type { HelpDialogPlugin } from '@atlaskit/editor-plugin-help-dialog';
import type { HighlightPlugin } from '@atlaskit/editor-plugin-highlight';
import type { HistoryPlugin } from '@atlaskit/editor-plugin-history';
import type { HyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import type { IndentationPlugin } from '@atlaskit/editor-plugin-indentation';
import type { InsertBlockPlugin } from '@atlaskit/editor-plugin-insert-block';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction';
import type { LayoutPlugin } from '@atlaskit/editor-plugin-layout';
import type { LimitedModePlugin } from '@atlaskit/editor-plugin-limited-mode';
import type { ListPlugin } from '@atlaskit/editor-plugin-list';
import type { LocalIdPlugin } from '@atlaskit/editor-plugin-local-id';
import type { LoomPlugin } from '@atlaskit/editor-plugin-loom';
import type { MediaPlugin } from '@atlaskit/editor-plugin-media';
import type { MediaInsertPlugin } from '@atlaskit/editor-plugin-media-insert';
import type { MentionsPlugin } from '@atlaskit/editor-plugin-mentions';
import type { MetricsPlugin } from '@atlaskit/editor-plugin-metrics';
import type { PanelPlugin } from '@atlaskit/editor-plugin-panel';
import type { PastePlugin } from '@atlaskit/editor-plugin-paste';
import type { PasteOptionsToolbarPlugin } from '@atlaskit/editor-plugin-paste-options-toolbar';
import type { PlaceholderPlugin } from '@atlaskit/editor-plugin-placeholder';
import type { PlaceholderTextPlugin } from '@atlaskit/editor-plugin-placeholder-text';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { QuickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import type { RulePlugin } from '@atlaskit/editor-plugin-rule';
import type { ScrollIntoViewPlugin } from '@atlaskit/editor-plugin-scroll-into-view';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { SelectionExtensionPlugin } from '@atlaskit/editor-plugin-selection-extension';
import type { SelectionMarkerPlugin } from '@atlaskit/editor-plugin-selection-marker';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';
import type { ShowDiffPlugin } from '@atlaskit/editor-plugin-show-diff';
import type { StatusPlugin } from '@atlaskit/editor-plugin-status';
import type { SubmitEditorPlugin } from '@atlaskit/editor-plugin-submit-editor';
import type { SyncedBlockPlugin } from '@atlaskit/editor-plugin-synced-block';
import type { TablePlugin } from '@atlaskit/editor-plugin-table';
import type { TasksAndDecisionsPlugin } from '@atlaskit/editor-plugin-tasks-and-decisions';
import type { TextColorPlugin } from '@atlaskit/editor-plugin-text-color';
import type { TextFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { ToolbarListsIndentationPlugin } from '@atlaskit/editor-plugin-toolbar-lists-indentation';
import type { TrackChangesPlugin } from '@atlaskit/editor-plugin-track-changes';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { UfoPlugin } from '@atlaskit/editor-plugin-ufo';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry';
import type { UndoRedoPlugin } from '@atlaskit/editor-plugin-undo-redo';
import type { UnsupportedContentPlugin } from '@atlaskit/editor-plugin-unsupported-content';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import type { EmojiProvider } from '@atlaskit/emoji';
import type { MentionProvider } from '@atlaskit/mention/types';
import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';

import type { analyticsPluginOptions } from './pluginOptions/analyticsPluginOptions';
import type { annotationPluginOptions } from './pluginOptions/annotationPluginOptions';
import type { avatarGroupPluginOptions } from './pluginOptions/avatarGroupPluginOptions';
import type { basePluginOptions } from './pluginOptions/basePluginOptions';
import type { blockMenuPluginOptions } from './pluginOptions/blockMenuPluginOptions';
import type { blockTypePluginOptions } from './pluginOptions/blockTypePluginOptions';
import type { breakoutPluginOptions } from './pluginOptions/breakoutPluginOptions';
import type { cardPluginOptions } from './pluginOptions/cardPluginOptions';
import type { codeBidiWarningPluginOptions } from './pluginOptions/codeBidiWarningPluginOptions';
import type { codeBlockAdvancedPluginOptions } from './pluginOptions/codeBlockAdvancedPluginOptions';
import type { codeBlockPluginOptions } from './pluginOptions/codeBlockPluginOptions';
import type { collabEditPluginOptions } from './pluginOptions/collabEditPluginOptions';
import type { contentFormatPluginOptions } from './pluginOptions/contentFormatPluginOptions';
import type { contextIdentifierPluginOptions } from './pluginOptions/contextIdentifierPluginOptions';
import type { contextPanelPluginOptions } from './pluginOptions/contextPanelPluginOptions';
import type { customAutoformatPluginOptions } from './pluginOptions/customAutoformatPluginOptions';
import type { datePluginOptions } from './pluginOptions/datePluginOptions';
import type { editorDisabledPluginOptions } from './pluginOptions/editorDisabledPluginOptions';
import type { editorViewModePluginOptions } from './pluginOptions/editorViewModePluginOptions';
import type { emojiPluginOptions } from './pluginOptions/emojiPluginOptions';
import type { expandPluginOptions } from './pluginOptions/expandPluginOptions';
import type { extensionPluginOptions } from './pluginOptions/extensionPluginOptions';
import type { featureFlagsPluginOptions } from './pluginOptions/featureFlagsPluginOptions';
import type { findReplacePluginOptions } from './pluginOptions/findReplacePluginOptions';
import type { gridPluginOptions } from './pluginOptions/gridPluginOptions';
import type { helpDialogPluginOptions } from './pluginOptions/helpDialogPluginOptions';
import type { hyperlinkPluginOptions } from './pluginOptions/hyperlinkPluginOptions';
import type { insertBlockPluginOptions } from './pluginOptions/insertBlockPluginOptions';
import type { layoutPluginOptions } from './pluginOptions/layoutPluginOptions';
import type { limitedModePluginOptions } from './pluginOptions/limitedModePluginOptions';
import type { loomPluginOptions } from './pluginOptions/loomPluginOptions';
import type { mediaPluginOptions } from './pluginOptions/mediaPluginOptions/mediaPluginOptions';
import type { mentionsPluginOptions } from './pluginOptions/mentionsPluginOptions';
import type { metricsPluginOptions } from './pluginOptions/metricsPluginOptions';
import type { panelPluginOptions } from './pluginOptions/panelPluginOptions';
import type { pastePluginOptions } from './pluginOptions/pastePluginOptions';
import type { placeholderPluginOptions } from './pluginOptions/placeholderPluginOptions/placeholderPluginOptions';
import type { placeholderTextPluginOptions } from './pluginOptions/placeholderTextPluginOptions';
import type { primaryToolbarPluginOptions } from './pluginOptions/primaryToolbarPluginOptions';
import type { quickInsertPluginOptions } from './pluginOptions/quickInsertPluginOptions';
import type { selectionExtensionPluginOptions } from './pluginOptions/selectionExtensionPluginOptions';
import type { selectionMarkerPluginOptions } from './pluginOptions/selectionMarkerPluginOptions';
import type { selectionPluginOptions } from './pluginOptions/selectionPluginOptions';
import type { selectionToolbarPluginOptions } from './pluginOptions/selectionToolbarPluginOptions';
import type { showDiffPluginOptions } from './pluginOptions/showDiffPluginOptions';
import type { statusPluginOptions } from './pluginOptions/statusPluginOptions';
import type { submitEditorPluginOptions } from './pluginOptions/submitEditorPluginOptions';
import type { syncedBlockPluginOptions } from './pluginOptions/syncedBlockPluginOptions';
import type { tablePluginOptions } from './pluginOptions/tablePluginOptions';
import type { tasksAndDecisionsPluginOptions } from './pluginOptions/tasksAndDecisionsPluginOptions';
import type { textColorPluginOptions } from './pluginOptions/textColorPluginOptions';
import type { textFormattingPluginOptions } from './pluginOptions/textFormattingPluginOptions';
import type { toolbarListsIndentationPluginOptions } from './pluginOptions/toolbarListsIndentationPluginOptions';
import type { toolbarPluginOptions } from './pluginOptions/toolbarPluginOptions';
import type { trackChangesPluginOptions } from './pluginOptions/trackChangesPluginOptions';
import type { typeAheadPluginOptions } from './pluginOptions/typeAheadPluginOptions';
import type { userPreferencesPluginOptions } from './pluginOptions/userPreferencesPluginOptions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractPluginName<Plugin> = Plugin extends NextEditorPlugin<infer Name, any> ? Name : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractPluginsNames<T extends [...any[]]> = {
	[Key in keyof T]: undefined extends T[Key]
		? [ExtractPluginName<T[Key]>]
		: ExtractPluginName<T[Key]>;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractOptionalPluginsNames<T extends [...any[]]> = {
	[Key in keyof T]: undefined extends T[Key] ? ExtractPluginName<T[Key]> : never;
};

/**
 * Extract the `options` parameter type from a plugin options builder function.
 *
 * Each plugin options builder function should have a signature like:
 *
 * ```ts
 * interface Props {
 *  // Only the values that are used in the plugin builder should be included by `Pick`.
 *  // If the plugin options are not used, the type should be `never`.
 * 	options: Pick<PluginOptions, 'key1' | 'key2'>;
 * }
 *
 * export function pluginOptionsBuilder({ options }: Props): PluginOptions {
 *  return {
 *    // build PluginOptions
 *  };
 * }
 * ```
 */
type OptionsFromPluginOptionsBuilder<CreateOptionsFunction> = CreateOptionsFunction extends (
	props: infer Props,
) => unknown
	? Props extends { options: infer Options }
		? Options
		: never
	: never;

/**
 * Omit properties from a type that are `never`.
 */
type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] };

/**
 * This type is different from the {@link EditorAppearance}. It contains only
 * the values that are used in the Confluence full page editor.
 */
export type FullPageEditorAppearance = 'full-page' | 'full-width' | 'max';

/**
 * The list of all PUBLIC plugins that are used in the Confluence full page editor.
 *
 * The plugin order should be reversed from the order
 * in which they are applied in the {@link EditorPresetBuilder}.
 *
 * NOTE: This does NOT include private plugins like AI, which are added
 * in the editor-presets-confluence package.
 */
type ConfluenceFullPageBasePluginsReversed = [
	LocalIdPlugin | undefined,
	TrackChangesPlugin | undefined,
	ShowDiffPlugin | undefined,
	UserIntentPlugin,
	SelectionExtensionPlugin | undefined,
	CodeBlockAdvancedPlugin | undefined,
	ContentFormatPlugin | undefined,
	MetricsPlugin | undefined,
	ConnectivityPlugin | undefined,
	HighlightPlugin,
	BlockControlsPlugin,
	SelectionMarkerPlugin,
	EditorViewModeEffectsPlugin,
	EditorViewModePlugin,
	LoomPlugin | undefined,
	CodeBidiWarningPlugin | undefined,
	UiControlRegistryPlugin | undefined,
	PasteOptionsToolbarPlugin,
	FragmentPlugin,
	BorderPlugin,
	FindReplacePlugin | undefined,
	AvatarGroupPlugin,
	InsertBlockPlugin,
	ToolbarListsIndentationPlugin,
	ScrollIntoViewPlugin,
	IndentationPlugin,
	SyncedBlockPlugin | undefined,
	StatusPlugin,
	CustomAutoformatPlugin,
	CardPlugin,
	LayoutPlugin,
	PlaceholderTextPlugin,
	DatePlugin,
	ExtensionPlugin,
	ContextPanelPlugin,
	PanelPlugin,
	CollabEditPlugin,
	HelpDialogPlugin,
	TasksAndDecisionsPlugin,
	TablePlugin,
	EmojiPlugin,
	MentionsPlugin,
	CaptionPlugin,
	MediaInsertPlugin,
	MediaPlugin,
	AnnotationPlugin,
	GridPlugin,
	GuidelinePlugin,
	ExpandPlugin,
	RulePlugin,
	ListPlugin,
	TextColorPlugin,
	AlignmentPlugin,
	BreakoutPlugin,
	BatchAttributeUpdatesPlugin,
	ContentInsertionPlugin,
	AccessibilityUtilsPlugin,
	DataConsumerPlugin,
	UfoPlugin,
	CodeBlockPlugin,
	SelectionPlugin,
	InteractionPlugin | undefined,
	FloatingToolbarPlugin | undefined,
	CopyButtonPlugin,
	SubmitEditorPlugin,
	EditorDisabledPlugin,
	UnsupportedContentPlugin,
	PlaceholderPlugin,
	QuickInsertPlugin,
	WidthPlugin,
	TextFormattingPlugin,
	HyperlinkPlugin,
	SelectionToolbarPlugin,
	ClearMarksOnEmptyDocPlugin,
	BlockTypePlugin,
	UndoRedoPlugin,
	BlockMenuPlugin | undefined,
	ToolbarPlugin | undefined,
	PrimaryToolbarPlugin,
	HistoryPlugin,
	TypeAheadPlugin,
	DecorationsPlugin,
	UserPreferencesPlugin | undefined,
	BasePlugin,
	ContextIdentifierPlugin,
	CompositionPlugin,
	FocusPlugin,
	ClipboardPlugin,
	PastePlugin,
	BetterTypeHistoryPlugin,
	AnalyticsPlugin,
	FeatureFlagsPlugin,
	LimitedModePlugin | undefined,
];

/** The Confluence full page base preset builder. */
export type ConfluenceFullPageBasePresetBuilder = EditorPresetBuilder<
	ExtractPluginsNames<ConfluenceFullPageBasePluginsReversed>,
	ConfluenceFullPageBasePluginsReversed
>;

/**
 * The list of all PUBLIC plugin options used in the Confluence full page editor.
 *
 * If plugin doesn't need any options, it should be set to `never`.
 *
 * NOTE: This does NOT include private plugin options like AI.
 */
export interface AllPublicPluginOptions {
	accessibilityUtils: never;
	alignment: never;
	analytics: OptionsFromPluginOptionsBuilder<typeof analyticsPluginOptions>;
	annotation: OptionsFromPluginOptionsBuilder<typeof annotationPluginOptions>;
	avatarGroup: OptionsFromPluginOptionsBuilder<typeof avatarGroupPluginOptions>;
	base: OptionsFromPluginOptionsBuilder<typeof basePluginOptions>;
	batchAttributeUpdates: never;
	betterTypeHistory: never;
	blockControls: never;
	blockMenu: OptionsFromPluginOptionsBuilder<typeof blockMenuPluginOptions>;
	blockType: OptionsFromPluginOptionsBuilder<typeof blockTypePluginOptions>;
	border: never;
	breakout: OptionsFromPluginOptionsBuilder<typeof breakoutPluginOptions>;
	caption: never;
	card: OptionsFromPluginOptionsBuilder<typeof cardPluginOptions>;
	clearMarksOnEmptyDoc: never;
	clipboard: never;
	codeBidiWarning: OptionsFromPluginOptionsBuilder<typeof codeBidiWarningPluginOptions>;
	codeBlock: OptionsFromPluginOptionsBuilder<typeof codeBlockPluginOptions>;
	codeBlockAdvanced: OptionsFromPluginOptionsBuilder<typeof codeBlockAdvancedPluginOptions>;
	collabEdit: OptionsFromPluginOptionsBuilder<typeof collabEditPluginOptions>;
	composition: never;
	connectivity: never;
	contentFormat: OptionsFromPluginOptionsBuilder<typeof contentFormatPluginOptions>;
	contentInsertion: never;
	contextIdentifier: OptionsFromPluginOptionsBuilder<typeof contextIdentifierPluginOptions>;
	contextPanel: OptionsFromPluginOptionsBuilder<typeof contextPanelPluginOptions>;
	copyButton: never;
	customAutoformat: OptionsFromPluginOptionsBuilder<typeof customAutoformatPluginOptions>;
	dataConsumer: never;
	date: OptionsFromPluginOptionsBuilder<typeof datePluginOptions>;
	decorations: never;
	editorDisabled: OptionsFromPluginOptionsBuilder<typeof editorDisabledPluginOptions>;
	editorViewMode: OptionsFromPluginOptionsBuilder<typeof editorViewModePluginOptions>;
	editorViewModeEffects: never;
	emoji: OptionsFromPluginOptionsBuilder<typeof emojiPluginOptions>;
	expand: OptionsFromPluginOptionsBuilder<typeof expandPluginOptions>;
	extension: OptionsFromPluginOptionsBuilder<typeof extensionPluginOptions>;
	featureFlags: OptionsFromPluginOptionsBuilder<typeof featureFlagsPluginOptions>;
	findReplace: OptionsFromPluginOptionsBuilder<typeof findReplacePluginOptions>;
	floatingToolbar: never;
	focus: never;
	fragment: never;
	grid: OptionsFromPluginOptionsBuilder<typeof gridPluginOptions>;
	guideline: never;
	helpDialog: OptionsFromPluginOptionsBuilder<typeof helpDialogPluginOptions>;
	history: never;
	hyperlink: OptionsFromPluginOptionsBuilder<typeof hyperlinkPluginOptions>;
	indentation: never;
	insertBlock: OptionsFromPluginOptionsBuilder<typeof insertBlockPluginOptions>;
	interaction: never;
	layout: OptionsFromPluginOptionsBuilder<typeof layoutPluginOptions>;
	limitedMode: OptionsFromPluginOptionsBuilder<typeof limitedModePluginOptions>;
	list: never;
	loom: OptionsFromPluginOptionsBuilder<typeof loomPluginOptions>;
	media: OptionsFromPluginOptionsBuilder<typeof mediaPluginOptions>;
	mediaInsert: never;
	mentions: OptionsFromPluginOptionsBuilder<typeof mentionsPluginOptions>;
	metrics: OptionsFromPluginOptionsBuilder<typeof metricsPluginOptions>;
	panel: OptionsFromPluginOptionsBuilder<typeof panelPluginOptions>;
	paste: OptionsFromPluginOptionsBuilder<typeof pastePluginOptions>;
	pasteOptionsToolbar: never;
	placeholder: OptionsFromPluginOptionsBuilder<typeof placeholderPluginOptions>;
	placeholderText: OptionsFromPluginOptionsBuilder<typeof placeholderTextPluginOptions>;
	primaryToolbar: OptionsFromPluginOptionsBuilder<typeof primaryToolbarPluginOptions>;
	quickInsert: OptionsFromPluginOptionsBuilder<typeof quickInsertPluginOptions>;
	rule: never;
	scrollIntoView: never;
	selection: OptionsFromPluginOptionsBuilder<typeof selectionPluginOptions>;
	selectionExtension: OptionsFromPluginOptionsBuilder<typeof selectionExtensionPluginOptions>;
	selectionMarker: OptionsFromPluginOptionsBuilder<typeof selectionMarkerPluginOptions>;
	selectionToolbar: OptionsFromPluginOptionsBuilder<typeof selectionToolbarPluginOptions>;
	showDiff?: OptionsFromPluginOptionsBuilder<typeof showDiffPluginOptions>;
	status: OptionsFromPluginOptionsBuilder<typeof statusPluginOptions>;
	submitEditor: OptionsFromPluginOptionsBuilder<typeof submitEditorPluginOptions>;
	syncedBlock: OptionsFromPluginOptionsBuilder<typeof syncedBlockPluginOptions>;
	table: OptionsFromPluginOptionsBuilder<typeof tablePluginOptions>;
	tasksAndDecisions: OptionsFromPluginOptionsBuilder<typeof tasksAndDecisionsPluginOptions>;
	textColor: OptionsFromPluginOptionsBuilder<typeof textColorPluginOptions>;
	textFormatting: OptionsFromPluginOptionsBuilder<typeof textFormattingPluginOptions>;
	toolbar: OptionsFromPluginOptionsBuilder<typeof toolbarPluginOptions>;
	toolbarListsIndentation: OptionsFromPluginOptionsBuilder<
		typeof toolbarListsIndentationPluginOptions
	>;
	trackChanges: OptionsFromPluginOptionsBuilder<typeof trackChangesPluginOptions>;
	typeAhead: OptionsFromPluginOptionsBuilder<typeof typeAheadPluginOptions>;
	ufo: never;
	uiControlRegistry: never;
	undoRedo: never;
	unsupportedContent: never;
	userIntent: never;
	userPreferencesPlugin: OptionsFromPluginOptionsBuilder<typeof userPreferencesPluginOptions>;
	width: never;
}

/** The properties for creating a Confluence full page base preset. */
export interface ConfluenceFullPageBasePresetOptions {
	/**
	 * Contains all optional plugins that are enabled.
	 *
	 * This list is based on the {@link ConfluenceFullPageBasePluginsReversed} list. If a plugin is optional,
	 * it should be added to this list.
	 */
	enabledOptionalPlugins: {
		[Key in ExtractOptionalPluginsNames<ConfluenceFullPageBasePluginsReversed>[number]]: boolean;
	};

	/** Instance of {@link IntlShape} to be used for i18n. */
	intl: IntlShape;

	/**
	 * List of options specific for plugins.
	 *
	 * If some plugin expect provider as param, it should be added to {@link providers} instead.
	 */
	pluginOptions: OmitNever<AllPublicPluginOptions>;

	/**
	 * List of providers that could be used by plugins.
	 *
	 * Add all providers here, don't add it as a {@link pluginOptions} event if plugin need it as param.
	 */
	providers: {
		autoformattingProvider: Promise<AutoformattingProvider> | undefined;
		cardProvider: Promise<CardProvider> | undefined;
		collabEditProvider: Promise<CollabEditProvider> | undefined;
		contextIdentifierProvider: Promise<ContextIdentifierProvider> | undefined;
		emojiNodeDataProvider: EmojiNodeDataProvider | undefined;
		emojiProvider: Promise<EmojiProvider> | undefined;
		inlineCommentAnnotationProvider: InlineCommentAnnotationProvider | undefined;
		mediaProvider: Promise<MediaProvider> | undefined;
		mentionProvider: Promise<MentionProvider> | undefined;
		profilecardProvider: Promise<ProfilecardProvider> | undefined;
		syncMediaProvider: MediaProvider | undefined;
		taskDecisionProvider: Promise<TaskDecisionProvider> | undefined;
		userPreferencesProvider: UserPreferencesProvider | undefined;
		userPreferencesProviderNext?: UserPreferencesProviderNext | undefined;
	};
}
