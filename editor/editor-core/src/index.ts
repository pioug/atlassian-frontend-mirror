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
export type { CollabEditProvider } from './plugins/collab-edit';
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
export type {
  QuickInsertProvider,
  QuickInsertItem,
  QuickInsertItemId,
  QuickInsertActionInsert,
} from '@atlaskit/editor-common/provider-factory';

// Used in mobile bridge
export { stateKey as mediaPluginKey } from './plugins/media/pm-plugins/main';
export { mentionPluginKey } from './plugins/mentions';
export { pluginKey as textFormattingStateKey } from './plugins/text-formatting/pm-plugins/main';
export type { TextFormattingState } from './plugins/text-formatting/pm-plugins/main';
export { textColorPluginKey } from './plugins/text-color';
export type { TextColorPluginState } from './plugins/text-color';
export { changeColor } from './plugins/text-color/commands/change-color';
export { insertHorizontalRule } from './plugins/rule/commands';
export { blockPluginStateKey } from './plugins';
export type { BlockTypeState } from './plugins';
export {
  InsertStatus as HyperlinkInsertStatus,
  stateKey as hyperlinkStateKey,
} from './plugins/hyperlink/pm-plugins/main';
export type { HyperlinkState } from './plugins/hyperlink/pm-plugins/main';
export { pluginKey as listStateKey } from './plugins/list/pm-plugins/main';
export type { ListState } from './plugins/list/types';
export type { InputMethod as ListInputMethod } from './plugins/list/commands';
export {
  toggleSuperscript,
  toggleSuperscriptWithAnalytics,
  toggleSubscript,
  toggleSubscriptWithAnalytics,
  toggleStrike,
  toggleStrikeWithAnalytics,
  toggleCode,
  toggleCodeWithAnalytics,
  toggleUnderline,
  toggleUnderlineWithAnalytics,
  toggleEm,
  toggleEmWithAnalytics,
  toggleStrong,
  toggleStrongWithAnalytics,
} from './plugins/text-formatting/commands/text-formatting';
export { subscribeToToolbarAndPickerUpdates } from './plugins/view-update-subscription/subscribe/toolbarAndPickerUpdates';
export { subscribeTypeAheadUpdates } from './plugins/view-update-subscription/subscribe/type-ahead-updates';
export type {
  InputMethodToolbar as TextFormattingInputMethodToolbar,
  InputMethodBasic as TextFormattingInputMethodBasic,
} from './plugins/text-formatting/commands/text-formatting';
export {
  insertBlockType,
  insertBlockTypesWithAnalytics,
  setBlockType,
  setBlockTypeWithAnalytics,
} from './plugins/block-type/commands';
export type { InputMethod as BlockTypeInputMethod } from './plugins/block-type/commands';
export { createTable } from './plugins/table/commands';
export { insertTaskDecision } from './plugins/tasks-and-decisions/commands';
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
export {
  pluginKey as quickInsertPluginKey,
  memoProcessItems as processQuickInsertItems,
} from './plugins/quick-insert';
export type { QuickInsertPluginState } from './plugins/quick-insert';
export type { TypeAheadItem } from './plugins/type-ahead/types';
export {
  insertLink,
  insertLinkWithAnalyticsMobileNative,
  insertLinkWithAnalytics,
  isTextAtPos,
  isLinkAtPos,
  updateLink,
} from './plugins/hyperlink/commands';
export type { LinkInputType as LinkInputMethod } from './plugins/hyperlink/types';
export { historyPluginKey } from './plugins/history';
export {
  INPUT_METHOD,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from './plugins/analytics';
export type { AnalyticsEventPayload } from './plugins/analytics';
export {
  setKeyboardHeight,
  setMobilePaddingTop,
} from './plugins/mobile-dimensions/commands';

// Used in editor-test-helpers
export {
  setTextSelection,
  dedupe,
  getNodesCount,
  measurements,
  hasVisibleContent,
} from './utils';
export { getListCommands } from './utils/list-commands';
export { ReactEditorView } from './create-editor';
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
} from './ui/PortalProvider';
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
export { pluginKey as floatingToolbarPluginKey } from './plugins/floating-toolbar';
export type { FloatingToolbarPluginState } from './plugins/floating-toolbar';
export type {
  FloatingToolbarConfig,
  FloatingToolbarItem,
  FloatingToolbarButton,
  FloatingToolbarDropdown,
  FloatingToolbarListPicker,
  FloatingToolbarSelect,
  FloatingToolbarColorPicker,
  FloatingToolbarDatePicker,
  FloatingToolbarInput,
  FloatingToolbarEmojiPicker,
} from './plugins/floating-toolbar/types';
export type { DropdownOptionT } from './plugins/floating-toolbar/ui/types';
export type { SelectOption } from './plugins/floating-toolbar/ui/Select';
export {
  lightModeStatusColorPalette,
  darkModeStatusColorPalette,
} from './ui/ColorPalette/Palettes/statusColorPalette';
export type { PaletteColor } from './ui/ColorPalette/Palettes/type';
export { DEFAULT_BORDER_COLOR } from './ui/ColorPalette/Palettes/common';
export { default as messages, statusMessages, dateMessages } from './messages';
export { createTypeAheadTools } from './plugins/type-ahead/api';
export { createQuickInsertTools } from './plugins/quick-insert/api';
