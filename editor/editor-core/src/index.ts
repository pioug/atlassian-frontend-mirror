// Used in products integration code
export { name, version } from './version-wrapper';
export { clearEditorContent, insertRule } from './commands';
export { default as Editor } from './editor';
export { default as EditorContext } from './ui/EditorContext';
export { default as WithEditorActions } from './ui/WithEditorActions';
export { default as WithHelpTrigger } from './ui/WithHelpTrigger';
export { default as CollapsedEditor } from './ui/CollapsedEditor';
export { default as ToolbarHelp } from './ui/ToolbarHelp';
export { default as ToolbarFeedback } from './ui/ToolbarFeedback';
export { default as ContextPanel } from './ui/ContextPanel';

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
export { blockPluginStateKey } from './plugins';
export type { BlockTypeState } from './plugins';
export {
  InsertStatus as HyperlinkInsertStatus,
  stateKey as hyperlinkStateKey,
} from './plugins/hyperlink/pm-plugins/main';
export type { HyperlinkState } from './plugins/hyperlink/pm-plugins/main';
export { pluginKey as listsStateKey } from './plugins/lists/pm-plugins/main';
export type { ListsPluginState as ListsState } from './plugins/lists/pm-plugins/main';
export {
  indentList,
  outdentList,
  toggleOrderedList,
  toggleBulletList,
} from './plugins/lists/commands';
export type { InputMethod as ListInputMethod } from './plugins/lists/commands';
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
export {
  commitStatusPicker,
  setStatusPickerAt,
  updateStatus,
  updateStatusWithAnalytics,
} from './plugins/status/actions';
export { typeAheadPluginKey } from './plugins/type-ahead';
export type { TypeAheadPluginState } from './plugins/type-ahead';
export {
  pluginKey as quickInsertPluginKey,
  processItems as processQuickInsertItems,
} from './plugins/quick-insert';
export type { QuickInsertPluginState } from './plugins/quick-insert';
export type { TypeAheadItem } from './plugins/type-ahead/types';
export { selectItem } from './plugins/type-ahead/commands/select-item';
export { insertTypeAheadQuery } from './plugins/type-ahead/commands/insert-query';
export { dismissCommand } from './plugins/type-ahead/commands/dismiss';
export {
  insertLink,
  insertLinkWithAnalytics,
  isTextAtPos,
  isLinkAtPos,
  setLinkHref,
  setLinkText,
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
} from './plugins/mobile-scroll/commands';

// Used in editor-test-helpers
export { setTextSelection } from './utils';
export { ReactEditorView } from './create-editor';
export { getDefaultPresetOptionsFromEditorProps } from './create-editor';
export type {
  Command,
  EditorPlugin,
  EditorProps,
  EditorInstance,
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
export { insertMentionQuery } from './plugins/mentions/commands/insert-mention-query';
export { insertEmojiQuery } from './plugins/emoji/commands/insert-emoji-query';
export { selectionPluginKey } from './plugins/mobile-selection';
export type {
  SelectionData,
  SelectionDataState,
} from './plugins/mobile-selection';
export { insertExpand } from './plugins/expand/commands';
