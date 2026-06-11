import type { ACTION, ACTION_SUBJECT } from './enums';
import type { TrackAEP } from './utils';

/** Which scoring path produced the suggestion shown to the user. */
export type CompletionSource =
	/** No slow-lane vector available yet; frequency-only trie scoring. */
	| 'cold'
	/** Server slow-lane API provided the context vector and LM logits. */
	| 'server'
	/** On-device WebGPU/MLC model provided the context vector and LM logits. */
	| 'localLlm';

type ContextualTypeaheadViewedAttributes = {
	completionSource: CompletionSource;
};

type ContextualTypeaheadViewedAEP = TrackAEP<
	ACTION.SUGGESTION_VIEWED,
	ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
	undefined,
	ContextualTypeaheadViewedAttributes,
	undefined
>;

type ContextualTypeaheadAcceptedAttributes = {
	completionSource: CompletionSource;
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

type ContextualTypeaheadDismissedAttributes = {
	completionSource: CompletionSource;
	reason: 'escape' | 'blur';
};

type ContextualTypeaheadDismissedAEP = TrackAEP<
	ACTION.SUGGESTION_DISMISSED,
	ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
	undefined,
	ContextualTypeaheadDismissedAttributes,
	undefined
>;

export type ContextualTypeaheadEventPayload =
	| ContextualTypeaheadViewedAEP
	| ContextualTypeaheadAcceptedAEP
	| ContextualTypeaheadDismissedAEP;
