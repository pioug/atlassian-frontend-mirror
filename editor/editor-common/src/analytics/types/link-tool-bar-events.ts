import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { OperationalAEP, ScreenAEP, UIAEP } from './utils';

export type RecentActivitiesPerfAEP = OperationalAEP<
	ACTION.INVOKED,
	ACTION_SUBJECT.SEARCH_RESULT,
	ACTION_SUBJECT_ID.RECENT_ACTIVITIES,
	{
		count: number;
		duration: number;
		errorCode?: number;
	}
>;

export type QuickSearchPerfAEP = OperationalAEP<
	ACTION.INVOKED,
	ACTION_SUBJECT.SEARCH_RESULT,
	ACTION_SUBJECT_ID.QUICK_SEARCH,
	{
		count: number;
		duration: number;
		errorCode?: number;
	}
>;

export type OpenSettingsToolbarAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.BUTTON,
	ACTION_SUBJECT_ID.GOTO_SMART_LINK_SETTINGS,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type,
	{},
	undefined
>;

export type ViewedCreateLinkInlineDialogAEP = ScreenAEP<
	ACTION.VIEWED,
	ACTION_SUBJECT.CREATE_LINK_INLINE_DIALOG,
	undefined,
	{
		searchSessionId: string;
		timesViewed: number;
		trigger: string;
	},
	undefined
>;

export type DismissedCreateLinkInlineDialogAEP = UIAEP<
	ACTION.DISMISSED,
	ACTION_SUBJECT.CREATE_LINK_INLINE_DIALOG,
	undefined,
	{
		searchSessionId: string;
		source: string;
		trigger: string;
	},
	undefined
>;
export type EnteredTextLinkSearchInputAEP = UIAEP<
	ACTION.ENTERED,
	ACTION_SUBJECT.TEXT,
	ACTION_SUBJECT_ID.LINK_SEARCH_INPUT,
	{
		queryHash: string;
		queryLength: number;
		queryVersion: number;
		searchSessionId: string;
		source: string;
		wordCount: number;
	},
	{
		query: string;
	}
>;

export type ShownPreQuerySearchResultsAEP = UIAEP<
	ACTION.SHOWN,
	ACTION_SUBJECT.SEARCH_RESULT,
	ACTION_SUBJECT_ID.PRE_QUERY_SEARCH_RESULTS,
	{
		preQueryRequestDurationMs: number;
		resultCount: number;
		results: Array<{
			resultContentId: string;
			resultType: string;
		}>;
		searchSessionId: string;
		source: string;
	},
	undefined
>;

export type ShownPostQuerySearchResultsAEP = UIAEP<
	ACTION.SHOWN,
	ACTION_SUBJECT.SEARCH_RESULT,
	ACTION_SUBJECT_ID.POST_QUERY_SEARCH_RESULTS,
	{
		postQueryRequestDurationMs: number;
		resultCount: number;
		results: Array<{
			resultContentId: string;
			resultType: string;
		}>;
		searchSessionId: string;
		source: string;
	},
	undefined
>;

export type HighlightedSearchResultsAEP = UIAEP<
	ACTION.HIGHLIGHTED,
	ACTION_SUBJECT.SEARCH_RESULT,
	undefined,
	{
		searchSessionId: string;
		selectedRelativePosition: number;
		selectedResultId: string;
		source: string;
	},
	undefined
>;

export type SelectedSearchResultsAEP = UIAEP<
	ACTION.SELECTED,
	ACTION_SUBJECT.SEARCH_RESULT,
	undefined,
	{
		prefetch: boolean;
		resultCount: number;
		searchSessionId: string;
		selectedRelativePosition: number;
		selectedResultId: string;
		source: string;
		trigger: string;
	},
	undefined
>;

export type EditLinkToolbarAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.SMART_LINK | ACTION_SUBJECT.HYPERLINK,
	ACTION_SUBJECT_ID.EDIT_LINK,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type,
	{},
	undefined
>;

export type UnlinkToolbarAEP = UIAEP<
	ACTION.UNLINK,
	ACTION_SUBJECT.SMART_LINK | ACTION_SUBJECT.HYPERLINK,
	ACTION_SUBJECT_ID.CARD_INLINE | undefined,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type,
	{},
	undefined
>;

export type CreateLinkInlineDialogEventPayload =
	| QuickSearchPerfAEP
	| RecentActivitiesPerfAEP
	| ViewedCreateLinkInlineDialogAEP
	| EnteredTextLinkSearchInputAEP
	| ShownPreQuerySearchResultsAEP
	| ShownPostQuerySearchResultsAEP
	| HighlightedSearchResultsAEP
	| SelectedSearchResultsAEP
	| DismissedCreateLinkInlineDialogAEP;

export type CreateLinkInlineDialogActionType =
	| ACTION.INVOKED
	| ACTION.VIEWED
	| ACTION.ENTERED
	| ACTION.SHOWN;
