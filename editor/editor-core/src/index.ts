// Used in products integration code
export { name, version } from './version-wrapper';
export { clearEditorContent } from './commands';
export { default as Editor } from './editor';
export { default as EditorContext } from './ui/EditorContext';
export { default as WithEditorActions } from './ui/WithEditorActions';
export { default as WithHelpTrigger } from './ui/WithHelpTrigger';
export { default as CollapsedEditor } from './ui/CollapsedEditor';
export { default as ToolbarHelp } from './ui/ToolbarHelp';
export { default as ToolbarFeedback } from './ui/ToolbarFeedback';
export { default as ContextPanel } from './ui/ContextPanel';
export type { FeatureFlags as EditorFeatureFlags } from './types/feature-flags';

export { EmojiResource } from '@atlaskit/emoji/resource';
export { default as mediaPlugin, insertMediaSingleNode } from './plugins/media';
export type {
  MediaProvider,
  MediaState,
  CustomMediaPicker,
} from './plugins/media';
export type { MediaOptions } from './plugins/media/types';
export {
  AbstractMentionResource,
  MentionResource,
  PresenceResource,
} from '@atlaskit/mention/resource';
export type {
  MentionProvider,
  PresenceProvider,
} from '@atlaskit/mention/resource';
export { TeamMentionResource } from '@atlaskit/mention/team-resource';
export { AnnotationUpdateEmitter } from './plugins/annotation';
export type {
  AnnotationProviders,
  InlineCommentAnnotationProvider,
  InlineCommentCreateComponentProps,
  InlineCommentViewComponentProps,
  AnnotationInfo,
  AnnotationState,
  AnnotationTypeProvider,
  InlineCommentState,
  UpdateEvent,
} from './plugins/annotation';
// Used in mobile bridge
export { stateKey as mediaPluginKey } from './plugins/media/pm-plugins/main';
export { textColorPluginKey } from './plugins/text-color';
export type { TextColorPluginState } from './plugins/text-color';
export { changeColor } from './plugins/text-color/commands/change-color';
/**
 * @private
 * @deprecated DO NOT USE, temporary solution while decoupling plugins from editor-core
 */
export type { CodeBlockPlugin } from './plugins/code-block';
/**
 * @private
 * @deprecated DO NOT USE, temporary solution while decoupling plugins from editor-core
 */
export type { PanelPlugin } from './plugins/panel';

export { subscribeToToolbarAndPickerUpdates } from './plugins/view-update-subscription/subscribe/toolbarAndPickerUpdates';
export { subscribeTypeAheadUpdates } from './plugins/view-update-subscription/subscribe/type-ahead-updates';
export type {
  InputMethodToolbar as TextFormattingInputMethodToolbar,
  InputMethodBasic as TextFormattingInputMethodBasic,
} from '@atlaskit/editor-common/types';
export { createTable } from '@atlaskit/editor-plugin-table/commands';
export { insertTaskDecisionCommand } from './plugins/tasks-and-decisions/commands';
export type { TaskDecisionInputMethod } from './plugins/tasks-and-decisions/types';
export { EventDispatcher } from './event-dispatcher';
export { pluginKey as statusPluginKey } from './plugins/status/plugin';
export type { StatusState, StatusType } from './plugins/status/plugin';
export type { DatePluginState } from './plugins/date/pm-plugins/types';
export { insertDate, openDatePicker, deleteDate } from './plugins/date/actions';
export { dateToDateType } from './plugins/date/utils/formatParse';
export { pluginKey as datePluginKey } from './plugins/date/pm-plugins/plugin-key';
export {
  commitStatusPicker,
  setStatusPickerAt,
  updateStatus,
  updateStatusWithAnalytics,
  removeStatus,
} from './plugins/status/actions';
export { typeAheadPluginKey } from './plugins/type-ahead';
export type { TypeAheadPluginState } from './plugins/type-ahead';
export type { TypeAheadItem } from '@atlaskit/editor-common/provider-factory';
export type {
  /**
   * @deprecated Use QuickInsertItem from @atlaskit/editor-common/provider-factory instead
   */
  QuickInsertItem,
  /**
   * @deprecated Use QuickInsertProvider from @atlaskit/editor-common/provider-factory instead
   */
  QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';
export { historyPluginKey } from './plugins/history';
export {
  INPUT_METHOD,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
export type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
export {
  setKeyboardHeight,
  setMobilePaddingTop,
  setIsExpanded,
} from './plugins/mobile-dimensions/commands';

// Used in editor-test-helpers and mobile bridge
export { setTextSelection, getNodesCount, measurements } from './utils';
export {
  /**
   * @deprecated Use dedupe from @atlaskit/editor-common/utils instead
   */
  dedupe,
} from '@atlaskit/editor-common/utils';
export { ReactEditorView, BaseReactEditorView } from './create-editor';
export { getDefaultPresetOptionsFromEditorProps } from './create-editor';
export type {
  Command,
  EditorPlugin,
  EditorProps,
  EditorInstance,
  CommandDispatch,
} from './types';
export { default as EditorActions } from './actions';
// Re-export from provider factory to not cause a breaking change
export type {
  MacroProvider,
  MacroAttributes,
  ExtensionType,
  CardProvider,
} from '@atlaskit/editor-common/provider-factory';
export {
  PortalProvider,
  PortalProviderAPI,
  PortalRenderer,
} from '@atlaskit/editor-common/portal-provider';
export {
  GapCursorSelection,
  Side as GapCursorSide,
} from './plugins/selection/gap-cursor-selection';
export type { HistoryPluginState } from './plugins/history/types';
export type { MentionPluginState } from './plugins/mentions/types';
export type { TOOLBAR_MENU_TYPE as InsertBlockInputMethodToolbar } from './plugins/insert-block/ui/ToolbarInsertBlock/types';
export { selectionPluginKey } from './plugins/mobile-selection';
export type {
  SelectionData,
  SelectionDataState,
} from './plugins/mobile-selection';
export { insertExpand } from './plugins/expand/commands';

export { default as WithPluginState } from './ui/WithPluginState';
export {
  lightModeStatusColorPalette,
  darkModeStatusColorPalette,
} from './ui/ColorPalette/Palettes/statusColorPalette';
export type { PaletteColor } from './ui/ColorPalette/Palettes/type';
export { DEFAULT_BORDER_COLOR } from './ui/ColorPalette/Palettes/common';
export { default as messages, statusMessages, dateMessages } from './messages';
export { createTypeAheadTools } from './plugins/type-ahead/api';
