import { type ACTION, type ACTION_SUBJECT, type ACTION_SUBJECT_ID } from './enums';
import { type InsertDateAEP } from './insert-events';
import { type TrackAEP } from './utils';

export enum AI_SUGGESTION_TRIGGERED_FROM {
	ENTER_BUTTON = 'enterKeydown',
	TAB_BUTTON = 'tabKeydown',
	ESCAPE_BUTTON = 'escapeKeydown',
	TOOLBAR = 'toolbar',
}

type SuggestionPayload = BaseLineSuggestionPayload & {
	triggeredFrom?: AI_SUGGESTION_TRIGGERED_FROM;
};

type BaseLineSuggestionPayload = {
	locale: string;
	suggestionType?: string;
	/* TODO - matchedFormat only exist for date suggestion, need to revisit
	 * & use discriminated unions in the future to narrow down */
	matchedFormat?: string;
};

type InsertSuggestionAEP = TrackAEP<
	ACTION.SUGGESTION_INSERTED,
	ACTION_SUBJECT.EDITOR_PLUGIN_AI,
	ACTION_SUBJECT_ID.AI_INLINE_SUGGESTION,
	SuggestionPayload,
	undefined
>;

type DismissSuggestionAEP = TrackAEP<
	ACTION.SUGGESTION_DISMISSED,
	ACTION_SUBJECT.EDITOR_PLUGIN_AI,
	ACTION_SUBJECT_ID.AI_INLINE_SUGGESTION,
	SuggestionPayload,
	undefined
>;

type ViewedSuggestionAEP = TrackAEP<
	ACTION.SUGGESTION_VIEWED,
	ACTION_SUBJECT.EDITOR_PLUGIN_AI,
	ACTION_SUBJECT_ID.AI_INLINE_SUGGESTION,
	BaseLineSuggestionPayload,
	undefined
>;

export type AIInlineSuggestionPayload =
	| InsertSuggestionAEP
	| DismissSuggestionAEP
	| ViewedSuggestionAEP
	| InsertDateAEP;
