import type { ACTION, ACTION_SUBJECT } from './enums';
import type { OperationalAEP, TrackAEP } from './utils';

export type AiSuggestionsEntryPoint = 'primaryToolbar' | 'commentsEmptyState';

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

type EntryPointClickedAEP = TrackAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	{
		entryPoint: AiSuggestionsEntryPoint;
	},
	undefined
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
		affectedBlocks: number;
		entryPoint: 'sidebar' | 'card';
		suggestionType: string;
	},
	undefined
>;

type ViewSuggestionAEP = TrackAEP<
	ACTION.VIEWED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	{
		affectedBlocks: number;
		blockTypes: string[];
		charactersToAdd: number;
		charactersToRemove: number;
		entryPoint: 'sidebar' | 'card';
		suggestionCardCharacterCount: number;
		suggestionType: string;
	},
	undefined
>;

export type AiSuggestionsEventPayload =
	| NoDiffSuggestionAEP
	| EntryPointClickedAEP
	| AcceptSuggestionAEP
	| DiscardSuggestionAEP
	| ViewSuggestionAEP;
