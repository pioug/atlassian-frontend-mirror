import type { ACTION, ACTION_SUBJECT } from './enums';
import type { OperationalAEP, TrackAEP } from './utils';

type NoDiffSuggestionAEP = OperationalAEP<
	ACTION.NO_DIFF_FOUND,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	{
		suggestionType: string;
		toolCalls: {
			localIds: string[];
			name: string;
			nodeTypes: string[];
		}[];
	}
>;

type AcceptSuggestionAEP = TrackAEP<
	ACTION.ACCEPTED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	{
		affectedBlocks: number;
		charactersAdded: number;
		charactersRemoved: number;
		entryPoint: 'sidebar' | 'card';
		suggestionType: string;
	},
	undefined
>;

type DiscardSuggestionAEP = TrackAEP<
	ACTION.DISCARDED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	{
		entryPoint: 'sidebar' | 'card';
		suggestionType: string;
	},
	undefined
>;

export type AiSuggestionsEventPayload = NoDiffSuggestionAEP | AcceptSuggestionAEP | DiscardSuggestionAEP;
