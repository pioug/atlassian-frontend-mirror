import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { UIAEP, OperationalAEP, TrackAEP } from './utils';

type AIProactiveApiReceivedAEP = OperationalAEP<
	ACTION.API_RECEIVED,
	ACTION_SUBJECT.EDITOR_PLUGIN_AI,
	ACTION_SUBJECT_ID.PROACTIVE_SUGGESTION,
	{
		meanDuration: number;
		medianDuration: number;
		minDuration: number;
		maxDuration: number;
		totalSuggestions: number;
		totalAcceptedSuggestions: number;
		totalDismissedSuggestions: number;
	}
>;

type AIProactiveSuggestionDisplayToggledAEP = TrackAEP<
	ACTION.TOGGLED,
	ACTION_SUBJECT.EDITOR_PLUGIN_AI,
	ACTION_SUBJECT_ID.PROACTIVE_SUGGESTION,
	{
		toggledToValue: boolean;
		triggeredFrom: string;
		totalSuggestions: number;
	},
	undefined
>;

type AIProactiveSuggestionInsertedAEP = TrackAEP<
	ACTION.INSERTED,
	ACTION_SUBJECT.EDITOR_PLUGIN_AI,
	ACTION_SUBJECT_ID.PROACTIVE_SUGGESTION,
	{
		aiInteractionID: string | undefined;
		triggeredFrom: 'contextPanel' | 'preview';
		transformAction: string;
		transformType: 'REPLACE_PARAGRAPH';
		insertionMethod: 'replace' | 'insertBelow';
	},
	undefined
>;

type AIProactiveSuggestionDismissedAEP = TrackAEP<
	ACTION.DISMISSED,
	ACTION_SUBJECT.EDITOR_PLUGIN_AI,
	ACTION_SUBJECT_ID.PROACTIVE_SUGGESTION,
	{
		aiInteractionID: string | undefined;
		triggeredFrom: 'contextPanel' | 'preview';
		transformAction: string;
		transformType: 'REPLACE_PARAGRAPH';
	},
	undefined
>;

type AIProactiveSuggestionFeedbackClickedAEP = UIAEP<
	ACTION.CLICK,
	ACTION_SUBJECT.EDITOR_PLUGIN_AI,
	ACTION_SUBJECT_ID.RESPONSE_FEEDBACK_BUTTON,
	{
		sentiment: string;
		product: string;
		configItemTitle: 'proactive-recommendation';
	},
	undefined
>;

type AIProactiveSuggestionCopiedAEP = UIAEP<
	ACTION.CLICK,
	ACTION_SUBJECT.EDITOR_PLUGIN_AI,
	ACTION_SUBJECT_ID.COPY_BUTTON,
	{ experienceType: 'proactive-recommendation' },
	undefined
>;

type AIProactiveApiPurgedAEP = OperationalAEP<
	ACTION.API_PURGED,
	ACTION_SUBJECT.EDITOR_PLUGIN_AI,
	ACTION_SUBJECT_ID.PROACTIVE_SUGGESTION,
	{
		reason: string;
		totalParts: number;
		totalPurgedParts: number;
	}
>;

type AIProactiveApiErrorAEP = OperationalAEP<
	ACTION.API_ERROR,
	ACTION_SUBJECT.EDITOR_PLUGIN_AI,
	ACTION_SUBJECT_ID.PROACTIVE_SUGGESTION,
	{
		error: string;
		reason: string;
		statusCode: number;
	}
>;

type AIProactiveFeedbackFailedAEP = OperationalAEP<
	ACTION.ERRORED,
	ACTION_SUBJECT.EDITOR,
	ACTION_SUBJECT_ID.AI_PROACTIVE_FEEDBACK_DIALOG,
	{
		errorMessage?: string;
	}
>;

export type AIProactiveEventPayload =
	| AIProactiveApiReceivedAEP
	| AIProactiveSuggestionDisplayToggledAEP
	| AIProactiveSuggestionInsertedAEP
	| AIProactiveSuggestionDismissedAEP
	| AIProactiveSuggestionFeedbackClickedAEP
	| AIProactiveSuggestionCopiedAEP
	| AIProactiveApiPurgedAEP
	| AIProactiveApiErrorAEP
	| AIProactiveFeedbackFailedAEP;
