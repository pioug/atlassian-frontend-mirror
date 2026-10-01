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
export type AiSuggestionsEmptyStateType = 'initial' | 'noSuggestionsFound' | 'suggestionsResolved';
export type AiSuggestionsConversationErrorReason =
	| 'agentDeactivated'
	// The OOTB agent that owns the suggestions skill could not be provisioned.
	| 'agentProvisioning'
	// The OOTB agent could not be resolved from its external config reference.
	| 'agentExternalConfigReference'
	| 'conversationSetup'
	| 'streamError';

export type AiSuggestionsRegenerationTrigger =
	| 'panelOpen'
	| 'reviewCompleted'
	| 'suggestionSelected'
	| 'suggestionsUpdated';

export type AiSuggestionsRegenerationOutcome = 'removed' | 'stillStale' | 'updated';

type SuggestionRemixAttributes = {
	remixSubtype?: string;
	remixType?: string;
};

type TimeSinceGenerationAttribute = {
	timeSinceGenerationMs?: number;
};

type RegenerationSuggestionDetails = SuggestionRemixAttributes &
	TimeSinceGenerationAttribute & {
		actionKind: string;
		outcome?: AiSuggestionsRegenerationOutcome;
		suggestionId: string;
		suggestionType: string;
	};

type RegenerationCommonAttributes = {
	currentNodeCount: number;
	staleSuggestionCount: number;
	suggestionDetails: RegenerationSuggestionDetails[];
	trigger: AiSuggestionsRegenerationTrigger;
};

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
	RegenerationCommonAttributes & {
		errorCode?: string;
		regenerationDurationMs: number;
		statusCode?: number;
	}
>;

type RegenerateSuggestionsStartedAEP = OperationalAEP<
	ACTION.REGENERATION_STARTED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	ACTION_SUBJECT_ID.SUGGESTIONS_REGENERATION,
	RegenerationCommonAttributes
>;

type RegenerateSuggestionsCompletedAEP = OperationalAEP<
	ACTION.REGENERATION_COMPLETED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	ACTION_SUBJECT_ID.SUGGESTIONS_REGENERATION,
	RegenerationCommonAttributes & {
		regenerationDurationMs: number;
		removedSuggestionCount: number;
		stillStaleSuggestionCount: number;
		updatedSuggestionCount: number;
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

type SuggestionLifecycleAttributes = SuggestionRemixAttributes &
	TimeSinceGenerationAttribute & {
		actionKind: string;
		affectedBlocks: number;
		agentId?: string;
		hasSources: boolean;
		interactionPoint: AiSuggestionInteractionPoint;
		suggestionId: string;
		suggestionType: string;
	};

type AcceptSuggestionAEP = TrackAEP<
	ACTION.ACCEPTED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	SuggestionLifecycleAttributes & {
		charactersAdded?: number;
		charactersRemoved?: number;
		isDiffHidden: boolean;
	},
	undefined
>;

type UndoAcceptedSuggestionAEP = TrackAEP<
	ACTION.UNDO_PERFORMED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	TimeSinceGenerationAttribute & {
		actionKind: string;
		suggestionId: string;
		suggestionType: string;
	},
	undefined
>;

type DiscardedSuggestionAttributes = SuggestionLifecycleAttributes;

type CancelSuggestionsAEP = TrackAEP<
	ACTION.CANCELLED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	{
		interactionPoint: AiSuggestionInteractionPoint;
	},
	undefined
>;

type DiscardSuggestionAEP = TrackAEP<
	ACTION.DISCARDED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	DiscardedSuggestionAttributes,
	undefined
>;

type DiscardAllSuggestionsAEP = TrackAEP<
	ACTION.DISCARD_ALL,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	{
		numberOfSuggestions: number;
		suggestionDetails: DiscardedSuggestionAttributes[];
	},
	undefined
>;

type DismissSuggestionAEP = TrackAEP<
	ACTION.DISMISSED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	SuggestionLifecycleAttributes,
	undefined
>;

type ViewSuggestionAEP = TrackAEP<
	ACTION.VIEWED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	SuggestionLifecycleAttributes & {
		blockTypes: string[];
		charactersToAdd?: number;
		charactersToRemove?: number;
		suggestionCardCharacterCount: number;
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
		suggestionDetails: Array<
			SuggestionRemixAttributes &
				TimeSinceGenerationAttribute & {
					actionKind: string;
					affectedBlocks: number;
					suggestionType: string;
				}
		>;
	},
	undefined
>;

type RightRailClosedAEP = TrackAEP<
	ACTION.RIGHT_RAIL_CLOSED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	undefined,
	undefined
>;

type ViewSuggestionReasoningAEP = TrackAEP<
	ACTION.REASONING_VIEWED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	SuggestionRemixAttributes &
		TimeSinceGenerationAttribute & {
			actionKind: string;
			affectedBlocks: number;
			agentId?: string;
			hasSources: boolean;
			interactionPoint: AiSuggestionInteractionPoint;
			reasoningCharacterCount: number;
			suggestionId: string;
			suggestionType: string;
		},
	undefined
>;

type SuggestionsGeneratedAEP = TrackAEP<
	ACTION.GENERATED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	{
		generationDurationMs: number;
		hadExistingSuggestions: boolean;
		numberOfSuggestions: number;
		suggestionDetails: Array<
			SuggestionRemixAttributes & {
				actionKind: string;
				affectedBlocks: number;
				agentId?: string;
				hasSources: boolean;
				suggestionId: string;
				suggestionType: string;
			}
		>;
	},
	undefined
>;

type EmptyStateExposedAEP = TrackAEP<
	ACTION.EMPTY_STATE_EXPOSED,
	ACTION_SUBJECT.AI_SUGGESTIONS,
	undefined,
	{
		emptyStateType: AiSuggestionsEmptyStateType;
	},
	undefined
>;

export type AiSuggestionsEventPayload =
	| NoDiffSuggestionAEP
	| ConversationErrorAEP
	| RegenerateSuggestionsErrorAEP
	| RegenerateSuggestionsStartedAEP
	| RegenerateSuggestionsCompletedAEP
	| EntryPointClickedAEP
	| SuggestionsErrorRetryClickedAEP
	| EntryPointExposureAEP
	| CancelSuggestionsAEP
	| AcceptSuggestionAEP
	| UndoAcceptedSuggestionAEP
	| DiscardSuggestionAEP
	| DiscardAllSuggestionsAEP
	| DismissSuggestionAEP
	| ViewSuggestionAEP
	| RightRailViewedAEP
	| RightRailClosedAEP
	| ViewSuggestionReasoningAEP
	| SuggestionsGeneratedAEP
	| EmptyStateExposedAEP;
