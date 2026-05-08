import type { ACTION, ACTION_SUBJECT } from './enums';
import type { TrackAEP } from './utils';

type ContextualTypeaheadViewedAEP = TrackAEP<
	ACTION.SUGGESTION_VIEWED,
	ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
	undefined,
	undefined,
	undefined
>;

type ContextualTypeaheadAcceptedAttributes = {
	kssDelta: number;
	suggestionLength: number;
	typedLength: number;
};

type ContextualTypeaheadAcceptedAEP = TrackAEP<
	ACTION.SUGGESTION_INSERTED,
	ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
	undefined,
	ContextualTypeaheadAcceptedAttributes,
	undefined
>;

export type ContextualTypeaheadEventPayload =
	| ContextualTypeaheadViewedAEP
	| ContextualTypeaheadAcceptedAEP;
