// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export type {
	AnalyticsDispatch,
	AnalyticsEventPayload,
	AnalyticsEventPayloadCallback,
	AnalyticsEventPayloadWithChannel,
	ErrorEventAttributes,
	ErrorEventPayload,
	FeatureExposureAEP,
	FireAnalyticsCallback,
	FireAnalyticsEvent,
	FireAnalyticsEventPayload,
	SimplifiedNode,
	TransactionEventPayload,
} from './types/events';

export type { FormatEventPayload } from './types/format-events';
export type { SubstituteEventPayload } from './types/substitute-events';
export type { ColorPickerAEP, GeneralEventPayload } from './types/general-events';

export {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
	INSERT_MEDIA_VIA,
	TRIGGER_METHOD,
	CONTENT_COMPONENT,
	FLOATING_CONTROLS_TITLE,
} from './types/enums';

export { INDENT_DIRECTION, INDENT_TYPE } from './types/format-events';
export { PUNC, SYMBOL } from './types/substitute-events';

export {
	BROWSER_FREEZE_INTERACTION_TYPE,
	FULL_WIDTH_MODE,
	MODE,
	PLATFORMS,
} from './types/general-events';

export {
	LINK_REPRESENTATION,
	LINK_RESOURCE,
	LINK_STATUS,
	USER_CONTEXT,
} from './types/insert-events';

export type {
	InputMethodInsertLink,
	InputMethodInsertMedia,
	InsertMediaVia,
	InsertEventPayload,
} from './types/insert-events';

export {
	CHANGE_ALIGNMENT_REASON,
	TABLE_ACTION,
	TABLE_BREAKOUT,
	TABLE_OVERFLOW_CHANGE_TRIGGER,
	TABLE_STATUS,
	TABLE_DISPLAY_MODE,
} from './types/table-events';

export type { TableEventPayload, OverflowStateInfo } from './types/table-events';

// These are not types
export { PasteContents, PasteSources, PasteTypes } from './types/paste-events';

export type {
	PASTE_ACTION_SUBJECT_ID,
	PasteContent,
	PasteEventPayload,
	PasteSource,
	PasteType,
} from './types/paste-events';

export type {
	MediaSwitchType,
	MediaAltTextActionType,
	MediaEventPayload,
	MediaLinkAEP,
	CaptionTrackAction,
	MediaResizeTrackAction,
	MediaInputResizeTrackAction,
} from './types/media-events';

export type { MoveContentEventPayload } from './types/move-content-events';

export type { DispatchAnalyticsEvent } from './types/dispatch-analytics-event';

export {
	DELETE_DIRECTION,
	LIST_TEXT_SCENARIOS,
	JOIN_SCENARIOS_WHEN_TYPING_TO_INSERT_LIST,
	OUTDENT_SCENARIOS,
} from './types/list-events';

export type {
	ListEventPayload,
	CommonListAnalyticsAttributes,
	RestartListsAttributesForListOutdented,
} from './types/list-events';

export type {
	CreateLinkInlineDialogActionType,
	CreateLinkInlineDialogEventPayload,
	RecentActivitiesPerfAEP,
	QuickSearchPerfAEP,
	ViewedCreateLinkInlineDialogAEP,
	DismissedCreateLinkInlineDialogAEP,
	EnteredTextLinkSearchInputAEP,
	ShownPreQuerySearchResultsAEP,
	ShownPostQuerySearchResultsAEP,
	HighlightedSearchResultsAEP,
	SelectedSearchResultsAEP,
	EditLinkToolbarAEP,
	UnlinkToolbarAEP,
} from './types/link-tool-bar-events';

export type {
	TextColorShowPaletteToggleAEP,
	TextColorShowPaletteToggleAttr,
} from './types/color-events';

export { GAP_CURSOR_POSITION, TARGET_SELECTION_SOURCE } from './types/extension-events';

export type { SelectionJson, ExtensionType, ExtensionEventPayload } from './types/extension-events';

export type {
	AnnotationActionType,
	AnnotationAEP,
	AnnotationAEPAttributes,
	AnnotationDraftAEPAttributes,
	AnnotationResolvedAEPAttributes,
	AnnotationErrorAEP,
} from './types/inline-comment-events';

export { RESOLVE_METHOD, VIEW_METHOD } from './types/inline-comment-events';

export { LAYOUT_TYPE, SMART_LINK_TYPE } from './types/node-events';

export type { NodeEventPayload } from './types/node-events';

export type {
	SelectNodeAEP,
	SelectRangeAEP,
	SelectAllAEP,
	SelectCellAEP,
	SelectionEventPayload,
} from './types/selection-events';

export { SmartLinkNodeContexts } from './types/smart-links';
export type { SmartLinkNodeContext, InsertSmartLinkAEP } from './types/smart-links';

export { TOOLBAR_ACTION_SUBJECT_ID } from './types/toolbar-button';
export type { ToolbarEventPayload } from './types/toolbar-button';

export type { TypeAheadPayload } from './types/type-ahead';

export { SELECTION_POSITION, SELECTION_TYPE } from './types/utils';

export type { OperationalAEP } from './types/utils';

export type {
	PluginMethodReport,
	PluginsReport,
	NodeCount,
	PluginPerformanceReportData,
} from './types/performance-report';

export type {
	InitialiseFragmentMarksAEP,
	ConnectedNodesAEP,
	DisconnectedSourceAEP,
	DisconnectedTargetAEP,
	GotConnectionsAEP,
	UpdatedFragmentMarkNameAEP,
	UpdatedSourceAEP,
	UpdatedTargetAEP,
} from './types/referentiality-events';

export type { ViewInlineCommentsButtonEventAEP, ViewEventPayload } from './types/view-events';

export type { EditorAnalyticsAPI, FireAnalyticsEventOptions } from './api';

export { editorAnalyticsChannel, fireAnalyticsEvent } from './fire-analytics-event';

export { getAnalyticsEventsFromTransaction } from './utils';

export {
	buildEditLinkPayload,
	buildVisitedLinkPayload,
	buildVisitedNonHyperLinkPayload,
	buildOpenedSettingsPayload,
	unlinkPayload,
} from './linking-utils';

export type { LinkType } from './linking-utils';

export type { RequestToEditAEP } from './types/general-events';

export type { AIEventPayload, AIMarkdownConversionErrorCaughtAttributes } from './types/ai-events';

export type { AIProactiveEventPayload } from './types/ai-proactive-events';

export type { AIDefinitionsEventPayload } from './types/ai-definitions-events';

export type { AIUnifiedEventPayload, AIUnifiedCommonAttributes } from './types/ai-unified-events';

export type {
	ActiveSessionEventPayload,
	ActiveSessionEventAttributes,
} from './types/activity-session-events';

export {
	type AIInlineSuggestionPayload,
	AI_SUGGESTION_TRIGGERED_FROM,
} from './types/ai-inline-suggestion-events';

export { type TelepointerClickPayload } from './types/telepointer-events';
