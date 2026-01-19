/**
 * Unified events are used to measure the MAU of AI features globally
 * https://hello.atlassian.net/wiki/spaces/AAI/pages/3770721410/Unified+Event+Instrumentation+For+AI+Features
 */

import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP } from './utils';

export type AIUnifiedCommonAttributes = {
	aiExperienceName?: string;
	aiFeatureName: string;
	aiInteractionID: string;
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
	singleInstrumentationID: string;
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
	AIUnifiedCommonAttributes & AIUnifiedAgentAttributes,
	undefined
>;

type AIResultViewedAEP = TrackAEP<
	ACTION.VIEWED,
	ACTION_SUBJECT.AI_RESULT,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	AIUnifiedCommonAttributes & AIUnifiedAgentAttributes,
	undefined
>;

type AIResultActionedAEP = TrackAEP<
	ACTION.ACTIONED,
	ACTION_SUBJECT.AI_RESULT,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	AIUnifiedCommonAttributes &
		AIUnifiedAgentAttributes & {
			aiActionedType?: string;
			aiGroupId: string | undefined;
			aiResultAction: string;
			promptType?: string;
			refinementCount?: number;
			wasRedone?: Boolean;
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
	| AIFeedbackSubmittedAEP
	| AIInteractionDiscardedAEP;
