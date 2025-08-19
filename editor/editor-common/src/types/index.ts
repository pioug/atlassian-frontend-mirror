// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
	NO_ORDER = 'no_order',
}

export { AnnotationUpdateEmitter, AnnotationUpdateEvent } from './annotation/emitter';
export type {
	AnnotationState,
	AnnotationUpdateEventPayloads,
	OnAnnotationClickPayload,
} from './annotation/emitter';
export type {
	AnnotationProviders,
	InlineCommentSelectionComponentProps,
	InlineCommentHoverComponentProps,
	InlineCommentViewComponentProps,
	InlineCommentAnnotationProvider,
	AnnotationByMatches,
	AnnotationActionResult,
} from './annotation';

export type {
	ContextUpdateHandler,
	EditorActionsOptions,
	ReplaceRawValue,
	GetResolvedEditorStateReason,
} from './editor-actions';

export type {
	TypeAheadStats,
	TypeAheadItemRenderProps,
	TypeAheadInsert,
	TypeAheadSelectItem,
	TypeAheadItem,
	TypeAheadForceSelect,
	TypeAheadHandler,
} from './type-ahead';

export type { CommandDispatch, Command, HigherOrderCommand, Predicate } from './command';
export type { FeatureFlags, FeatureFlagKey, GetEditorFeatureFlags } from './feature-flags';

export type { Browsers, Range, DisableSpellcheckByBrowser } from './supported-browsers';

export type { EditorContainerWidth, GetEditorContainerWidth } from './editor-container-width';
export type { EmptyStateHandler, EmptyStateHandlerParams } from './empty-state-handler';

export type {
	RenderOptionsPropsT,
	DropdownOptionT,
	DropdownOptions,
	ExtensionDropdownOptions,
	SelectOption,
	ButtonAppearance,
	Icon,
	RenderOptionsProps,
	AlignType,
	ConfirmDialogChildInfo,
	ConfirmDialogOptions,
	ConfirmationDialogProps,
	FloatingToolbarButton,
	FloatingToolbarCopyButton,
	FloatingToolbarInput,
	FloatingToolbarCustom,
	FloatingToolbarListPicker,
	FloatingToolbarColorPicker,
	FloatingToolbarEmojiPicker,
	FloatingToolbarDatePicker,
	FloatingToolbarSelect,
	FloatingToolbarSeparator,
	FloatingToolbarDropdown,
	FloatingToolbarFallbackItem,
	FloatingToolbarItem,
	FloatingToolbarConfig,
	FloatingToolbarHandler,
	FloatingToolbarButtonSpotlightConfig,
	typeOption,
	FloatingToolbarOverflowDropdown,
	FloatingToolbarOverflowDropdownOptions,
	OverflowDropdownHeading,
	OverflowDropdownOption,
} from './floating-toolbar';

export type { MarkOptions, NodeOptions } from './copy-button';

export type { ContextPanelHandler } from './context-panel';

export type { EditorAppearance } from './editor-appearance';

export type { ToolbarUiComponentFactoryParams, ToolbarUIComponentFactory } from './toolbar';

export {
	ToolbarSize,
	ToolbarWidths,
	ToolbarWidthsNext,
	ToolbarWidthsFullPage,
	ToolbarWidthsFullPageNext,
} from './toolbar';

export type {
	UiComponentFactoryParams,
	UIComponentFactory,
	ReactHookFactory,
} from './ui-components';

export type { EditorReactContext } from './editor-react-context';

export type { PMPluginFactoryParams, PMPluginFactory, PMPlugin } from './plugin-factory';

export type { NodeConfig, MarkConfig, NodeViewConfig } from './prosemirror-config';

export type {
	PluginsOptions,
	EditorPlugin,
	getPosHandler,
	getPosHandlerNode,
} from './editor-plugin';

export type {
	NextEditorPlugin,
	PluginDependenciesAPI,
	DefaultEditorPlugin,
	OptionalPlugin,
	ExtractInjectionAPI,
	PublicPluginAPI,
	NextEditorPluginMetadata,
	DependencyPlugin,
	EditorInjectionAPI,
	NextEditorPluginFunctionOptionalConfigDefinition,
	Transformer,
	CorePlugin,
	DefaultTransformerResultCallback,
	InferTransformerResultCallback,
	BasePluginDependenciesAPI,
	TransformerResult,
} from './next-editor-plugin';

export type { EditorCommand, EditorCommandWithMetadata } from './editor-command';

export type IconProps = {
	label?: string;
};

export type {
	TTITracking,
	TransactionTracking,
	UITracking,
	CatchAllTracking,
	NodeViewTracking,
	BrowserFreezetracking,
	ProseMirrorRenderedTracking,
	InputTracking,
	ContentRetrievalTracking,
	OnChangeCallbackTracking,
	OnEditorReadyCallbackTracking,
	PasteTracking,
	RenderTracking,
	PerformanceTracking,
} from './performance-tracking';

export type { GridType } from './grid';
export type {
	LinkInputType,
	LinkPickerOptions,
	LinkingOptions,
	HyperlinkPluginOptions,
} from './hyperlink';

export type { SnapPointsProps } from './resizable-media-single';

export type { BreakoutMode } from './breakout';

export type { DatasourceModalType } from './datasource';

export type {
	ImageUploadPluginReferenceEventBase,
	ImageUploadPluginReferenceEventDragEvent,
	ImageUploadPluginReferenceEventClipboardEvent,
	ImageUploadPluginReferenceEvent,
} from './image-upload-reference-event';

export type {
	AllowedBlockTypes,
	HeadingLevels,
	NormalTextLevel,
	HeadingLevelsAndNormalText,
} from './block-type';

export type { ColumnResizingPluginState } from './tables';

export type { InputRuleHandler, OnHandlerApply, InputRuleWrapper } from './input-rules';

export type { TOOLBAR_MENU_TYPE } from './insert-block';

export type {
	TextFormattingOptions,
	TextFormattingState,
	InputMethodToolbar,
	InputMethodBasic,
} from './text-formatting';

export type { LayoutPluginOptions } from './layout';
export type { LongPressSelectionPluginOptions } from './selection';

export type {
	QuickInsertPluginState,
	QuickInsertPluginStateKeys,
	QuickInsertOptions,
	QuickInsertPluginOptions,
	QuickInsertSearchOptions,
	QuickInsertSharedState,
	QuickInsertHandler,
	QuickInsertHandlerFn,
} from './quick-insert';

export type { Refs, RefsNode, DocBuilder } from './doc-builder';

export type { SelectionToolbarGroup, SelectionToolbarHandler } from './selection-toolbar';

export type { FeedbackInfo } from './feedback-dialog';

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
/**
 *  @deprecated
 */
import type { EditorPresetBuilder, ExtractPresetAPI } from '../preset';

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
/**
 * @deprecated
 *
 * Please use ExtractPresetAPI from "@atlaskit/editor-common/preset" instead.
 */
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractPublicEditorAPI<T extends EditorPresetBuilder<any, any>> = ExtractPresetAPI<T>;

export type { UserPreferencesProvider, UserPreferences } from './user-preferences';

export { DIRECTION } from './block-controls';
