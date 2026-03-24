import type { ACTION, ACTION_SUBJECT } from './enums';
import type { TrackAEP } from './utils';

type AiAutocompleteInvokedAEP = TrackAEP<
	ACTION.INVOKED,
	ACTION_SUBJECT.AI_AUTOCOMPLETE,
	undefined,
	undefined,
	undefined
>;

type AiAutocompleteViewedAEP = TrackAEP<
	ACTION.SUGGESTION_VIEWED,
	ACTION_SUBJECT.AI_AUTOCOMPLETE,
	undefined,
	undefined,
	undefined
>;

type AiAutocompleteAcceptedAEP = TrackAEP<
	ACTION.SUGGESTION_INSERTED,
	ACTION_SUBJECT.AI_AUTOCOMPLETE,
	undefined,
	undefined,
	undefined
>;

type AiAutocompleteRejectedAEP = TrackAEP<
	ACTION.SUGGESTION_DISMISSED,
	ACTION_SUBJECT.AI_AUTOCOMPLETE,
	undefined,
	undefined,
	undefined
>;

export type AiAutocompleteEventPayload =
	| AiAutocompleteInvokedAEP
	| AiAutocompleteViewedAEP
	| AiAutocompleteAcceptedAEP
	| AiAutocompleteRejectedAEP;
