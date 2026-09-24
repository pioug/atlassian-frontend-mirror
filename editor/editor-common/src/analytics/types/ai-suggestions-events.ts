import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { OperationalAEP, TrackAEP } from './utils';

export type AiSuggestionsEntryPoint =
	| 'primaryToolbar'
	/**
	 * @private
	 * @deprecated Legacy entry point retained for backwards compatibility.
	 * Use `suggestionsPanelEmptyState` for the standalone suggestions panel.
	 */
	| 'commentsEmptyState'
	| 'suggestionsPanelEmptyState'
	| 'suggestionsPanelHeader'
	| 'objectSidebarControl'
	/**
	 * @private
	 * @deprecated Legacy automatic-generation entry point retained for backwards compatibility.
	 */
	| 'suggestionsPanelMount'
	/**
	 * The "Review" button on the follow-up card shown in place of the suggestion card
	 * once the last inline comment suggestion has been actioned.
	 */
	| 'followUpCard';
export type AiSuggestionInteractionPoint = 'sidebar' | 'card' | 'statusBar';
export type AiSuggestionsRightRailEntryPoint =
	| 'suggestionsPanel'
	| 'suggestionsTab'
	| 'suggestionCard'; // 'suggestionsTab' will be deprecated;
export type AiSuggestionsConversationErrorReason =
	| 'agentDeactivated'
	// The OOTB agent that owns the suggestions skill could not be provisioned.
	| 'agentProvisioning'
	// The OOTB agent could not be resolved from its external config reference.
	| 'agentExternalConfigReference'
	| 'conversationSetup'
	| 'streamError';

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

type ConversationErrorAEP = OperationalAEP<
	ACTION.ERRORED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	ACTION_SUBJECT_ID.CONVERSATION_ERROR,
	{
		errorCode?: string;
		reason: AiSuggestionsConversationErrorReason;
		statusCode?: number;
	}
>;

type RegenerateSuggestionsErrorAEP = OperationalAEP<
	ACTION.ERRORED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	ACTION_SUBJECT_ID.SUGGESTIONS_REGENERATION_ERROR,
	{
		currentNodeCount: number;
		errorCode?: string;
		staleSuggestionCount: number;
		statusCode?: number;
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

/**
 * Fired when the user clicks the "Try again" / retry button on the suggested
 * edits error screen (the thinking bar's error state). Lets us measure how
 * often users attempt to recover from a suggestions failure.
 */
type SuggestionsErrorRetryClickedAEP = TrackAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	ACTION_SUBJECT_ID.SUGGESTIONS_ERROR_RETRY,
	undefined,
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
		charactersAdded?: number;
		charactersRemoved?: number;
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
		actionKind: string;
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
		actionKind: string;
		affectedBlocks: number;
		blockTypes: string[];
		charactersToAdd?: number;
		charactersToRemove?: number;
		interactionPoint: AiSuggestionInteractionPoint;
		suggestionCardCharacterCount: number;
		suggestionType: string;
	},
	undefined
>;

type RightRailViewedAEP = TrackAEP<
	ACTION.RIGHT_RAIL_VIEWED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	{
		entryPoint: AiSuggestionsRightRailEntryPoint;
		numberOfSuggestions: number;
		suggestionDetails: Array<{
			actionKind: string;
			affectedBlocks: number;
			suggestionType: string;
		}>;
	},
	undefined
>;

type ViewSuggestionReasoningAEP = TrackAEP<
	ACTION.REASONING_VIEWED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	{
		affectedBlocks: number;
		interactionPoint: AiSuggestionInteractionPoint;
		reasoningCharacterCount: number;
		suggestionType: string;
	},
	undefined
>;

export type AiSuggestionsEventPayload =
	| NoDiffSuggestionAEP
	| ConversationErrorAEP
	| RegenerateSuggestionsErrorAEP
	| EntryPointClickedAEP
	| SuggestionsErrorRetryClickedAEP
	| EntryPointExposureAEP
	| AcceptSuggestionAEP
	| DiscardSuggestionAEP
	| DismissSuggestionAEP
	| ViewSuggestionAEP
	| RightRailViewedAEP
	| ViewSuggestionReasoningAEP;
