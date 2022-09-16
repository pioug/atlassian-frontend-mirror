import { Node } from 'prosemirror-model';

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
  NewCollabSyncUpErrorAttributes,
  SyncUpErrorFunction,
} from './collab';

export type { CommandDispatch, Command, HigherOrderCommand } from './command';
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
  ConfirmDialogOptions,
  FloatingToolbarButton,
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
