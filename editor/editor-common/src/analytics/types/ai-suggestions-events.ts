import type { ACTION, ACTION_SUBJECT } from './enums';
import type { OperationalAEP, TrackAEP } from './utils';

export type AiSuggestionsEntryPoint = 'primaryToolbar' | 'commentsEmptyState';
export type AiSuggestionInteractionPoint = 'sidebar' | 'card' | 'statusBar';

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

type EntryPointExposureAEP = TrackAEP<
	ACTION.EXPOSED,
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
		interactionPoint: AiSuggestionInteractionPoint;
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
		interactionPoint: AiSuggestionInteractionPoint;
		suggestionType: string;
	},
	undefined
>;

type DismissSuggestionAEP = TrackAEP<
	ACTION.DISMISSED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	{
		affectedBlocks: number;
		interactionPoint: AiSuggestionInteractionPoint;
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
		interactionPoint: AiSuggestionInteractionPoint;
		suggestionCardCharacterCount: number;
		suggestionType: string;
	},
	undefined
>;

export type AiSuggestionsEventPayload =
	| NoDiffSuggestionAEP
	| EntryPointClickedAEP
	| EntryPointExposureAEP
	| AcceptSuggestionAEP
	| DiscardSuggestionAEP
	| DismissSuggestionAEP
	| ViewSuggestionAEP;
