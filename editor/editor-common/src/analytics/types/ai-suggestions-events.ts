import type { ACTION, ACTION_SUBJECT } from './enums';
import type { OperationalAEP } from './utils';

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

export type AiSuggestionsEventPayload = NoDiffSuggestionAEP;
