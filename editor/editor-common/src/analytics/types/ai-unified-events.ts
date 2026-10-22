/**
 * Unified events are used to measure the MAU of AI features globally
 * https://hello.atlassian.net/wiki/spaces/AAI/pages/3770721410/Unified+Event+Instrumentation+For+AI+Features
 */

import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP } from './utils';

export type AIUnifiedCommonAttributes = {
	aiExperienceName?: string;
	aiFeatureName: string;
	aiInteractionID?: string;
	/**
	 * Whether or not the AI experience is from a 3p product when user invokes AI action from smartlink toolbar.
	 */
	has3pSources?: boolean;
	invokedFrom?: string;
	isAIFeature: 1;
	/**
	 * Remove below flag when AIFC is fully rolled out in Jira, only required for old experience in Jira.
	 * Because in AFIC, if dismissed event is fired, it means the streaming has not ended.
	 */
	isStreamingEnded?: boolean;
	/**
	 * Nudge metrics will be used passed in analytics events.
	 * It is currently only set when "Improve writing" is triggered from the
	 * "Improve writing" nudge.
	 */
	nudgeMetrics?: Record<string, number | undefined>;
	proactiveAIGenerated: 0 | 1;
	promptVersion?: string;
	singleInstrumentationID: string;
	/**
	 * The source 3p product when user invokes AI action from smartlink toolbar.
	 */
	sourceProduct?: string | null;
	traceIds?: string[];
	userGeneratedAI: 0 | 1;
};

type AIUnifiedAgentAttributes = {
	agentCreatorType?: string;
	agentExternalConfigReference?: string;
	agentId?: string;
	agentIsDefault?: boolean;
	agentName?: string;
};

type AIInteractionInitiatedAEP = TrackAEP<
	ACTION.INITIATED,
	ACTION_SUBJECT.AI_INTERACTION,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	AIUnifiedCommonAttributes & AIUnifiedAgentAttributes,
	undefined
>;

type AIInteractionDismissedAEP = TrackAEP<
	ACTION.DISMISSED,
	ACTION_SUBJECT.AI_INTERACTION,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	AIUnifiedCommonAttributes & AIUnifiedAgentAttributes,
	undefined
>;

type AIInteractionDiscardedAEP = TrackAEP<
	ACTION.DISCARDED,
	ACTION_SUBJECT.AI_RESULT,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	AIUnifiedCommonAttributes &
		AIUnifiedAgentAttributes & {
			aiResultAction?: string;
		},
	undefined
>;

type AIResultViewedAEP = TrackAEP<
	ACTION.VIEWED,
	ACTION_SUBJECT.AI_RESULT,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	AIUnifiedCommonAttributes & AIUnifiedAgentAttributes,
	undefined
>;

/**
 * Generated image / MAUI app block counts of the Rovo page edit behind an AI result, copied from the
 * backend edit action data. Either all are present or none are; absent means not eligible or unknown.
 */
export type AIResultVisualBlockCounts = {
	addedImageBlocks?: number;
	addedMauiAppBlocks?: number;
	imageBlocks?: number;
	mauiAppBlocks?: number;
	removedImageBlocks?: number;
	removedMauiAppBlocks?: number;
	replacedImageBlocks?: number;
	replacedMauiAppBlocks?: number;
};

type AIResultActionedAEP = TrackAEP<
	ACTION.ACTIONED,
	ACTION_SUBJECT.AI_RESULT,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	AIUnifiedCommonAttributes &
		AIUnifiedAgentAttributes &
		AIResultVisualBlockCounts & {
			aiActionedType?: string;
			aiGroupId: string | undefined;
			aiResultAction: string;
			promptType?: string;
			refinementCount?: number;
			wasRedone?: boolean;
		},
	undefined
>;

export type AIRovoModifiedObject = {
	actionName: 'create' | 'update';
	objectId: string;
	objectType: string;
	targetProduct: string;
};

/**
 * Fires once an AI result has successfully created or modified a work item (page, issue, etc.).
 * Sequence to `aiResult actioned`.
 */
export type AIResultAdoptedEventPayload = TrackAEP<
	ACTION.ADOPTED,
	ACTION_SUBJECT.AI_RESULT,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	AIUnifiedCommonAttributes &
		AIUnifiedAgentAttributes & {
			rovoModifiedObjects: AIRovoModifiedObject[];
		},
	undefined
>;

type AIResultErrorAEP = TrackAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.AI_RESULT,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	AIUnifiedCommonAttributes &
		AIUnifiedAgentAttributes & {
			aiErrorCode?: number;
			aiErrorMessage?: string;
		},
	undefined
>;

type AIFeedbackSubmittedAEP = TrackAEP<
	ACTION.SUBMITTED,
	ACTION_SUBJECT.AI_FEEDBACK,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	AIUnifiedCommonAttributes &
		AIUnifiedAgentAttributes & {
			aiFeedbackResult: 'up' | 'down';
		},
	undefined
>;

export type AIUnifiedEventPayload =
	| AIInteractionInitiatedAEP
	| AIResultViewedAEP
	| AIResultErrorAEP
	| AIInteractionDismissedAEP
	| AIResultActionedAEP
	| AIResultAdoptedEventPayload
	| AIFeedbackSubmittedAEP
	| AIInteractionDiscardedAEP;
