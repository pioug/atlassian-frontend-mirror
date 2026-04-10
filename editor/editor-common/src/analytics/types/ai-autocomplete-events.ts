import type { ACTION, ACTION_SUBJECT } from './enums';
import type { TrackAEP } from './utils';

type AiAutocompleteInvokedAEP = TrackAEP<
	ACTION.INVOKED,
	ACTION_SUBJECT.AI_AUTOCOMPLETE,
	undefined,
	{ triggerType: TriggerType },
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

export type TriggerType =
	| 'summary-heading'
	| 'summary-first-lines'
	| 'summary-panel'
	| 'conclusion-heading'
	| 'conclusion-last-lines'
	| 'next-steps-heading'
	| 'next-steps-last-lines'
	| 'cmd+shift+space';

export type AiAutocompleteEventPayload =
	| AiAutocompleteInvokedAEP
	| AiAutocompleteViewedAEP
	| AiAutocompleteAcceptedAEP
	| AiAutocompleteRejectedAEP;
