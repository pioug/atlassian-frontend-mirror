import type { Node } from '@atlaskit/editor-prosemirror/model';

export interface Transformer<T> {
  encode(node: Node): T;
  parse(content: T): Node;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
  NO_ORDER = 'no_order',
}

export { AnnotationUpdateEmitter, AnnotationUpdateEvent } from './annotation';
export type {
  AnnotationState,
  AnnotationProviders,
  AnnotationUpdateEventPayloads,
  InlineCommentSelectionComponentProps,
  InlineCommentViewComponentProps,
  InlineCommentAnnotationProvider,
  OnAnnotationClickPayload,
  AnnotationByMatches,
  AnnotationActionResult,
} from './annotation';
export type {
  ContextUpdateHandler,
  EditorActionsOptions,
  ReplaceRawValue,
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

export type {
  CommandDispatch,
  Command,
  HigherOrderCommand,
  Predicate,
} from './command';
export type {
  FeatureFlags,
  FeatureFlagKey,
  GetEditorFeatureFlags,
} from './feature-flags';

export type {
  Browsers,
  Range,
  DisableSpellcheckByBrowser,
} from './supported-browsers';

export type {
  EditorContainerWidth,
  GetEditorContainerWidth,
} from './editor-container-width';
export type {
  EmptyStateHandler,
  EmptyStateHandlerParams,
} from './empty-state-handler';

export type {
  RenderOptionsPropsT,
  DropdownOptionT,
  DropdownOptions,
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
} from './floating-toolbar';

export type { MarkOptions, NodeOptions } from './copy-button';

export type { ContextPanelHandler } from './context-panel';

export type { EditorAppearance } from './editor-appearance';

export type {
  ToolbarUiComponentFactoryParams,
  ToolbarUIComponentFactory,
} from './toolbar';

export { ToolbarSize, ToolbarWidths, ToolbarWidthsFullPage } from './toolbar';

export type {
  UiComponentFactoryParams,
  UIComponentFactory,
  ReactHookFactory,
} from './ui-components';

export type { EditorReactContext } from './editor-react-context';

export type {
  PMPluginFactoryParams,
  PMPluginFactory,
  PMPlugin,
} from './plugin-factory';

export type {
  NodeConfig,
  MarkConfig,
  NodeViewConfig,
} from './prosemirror-config';

export type {
  PluginsOptions,
  EditorPlugin,
  getPosHandler,
  getPosHandlerNode,
} from './editor-plugin';

export type {
  NextEditorPlugin,
  AllEditorPresetPluginTypes,
  PluginDependenciesAPI,
  ExtractPluginNameFromAllBuilderPlugins,
  SafePresetCheck,
  DefaultEditorPlugin,
  OptionalPlugin,
  PluginInjectionAPI,
  CreatePluginDependenciesAPI,
  NextEditorPluginMetadata,
  ExtractInjectionAPI,
  ExtractPluginActions,
  PluginInjectionAPIWithDependencies,
  PublicPluginAPI,
  NextEditorPluginFunctionOptionalConfigDefinition,
  ExtractNextEditorPlugins,
  MaybePlugin,
  MaybePluginName,
  PresetPlugin,
} from './next-editor-plugin';

export type { ExtractPublicEditorAPI } from './editor-public-api';

export type {
  EditorCommand,
  EditorCommandWithMetadata,
} from './editor-command';

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

export type {
  InputRuleHandler,
  OnHandlerApply,
  InputRuleWrapper,
} from './input-rules';

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

export type {
  SelectionToolbarGroup,
  SelectionToolbarHandler,
} from './selection-toolbar';

export type { FeedbackInfo } from './feedback-dialog';
