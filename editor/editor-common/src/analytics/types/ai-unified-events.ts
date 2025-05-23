/**
 * Unified events are used to measure the MAU of AI features globally
 * https://hello.atlassian.net/wiki/spaces/AAI/pages/3770721410/Unified+Event+Instrumentation+For+AI+Features
 */

import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP } from './utils';

export type AIUnifiedCommonAttributes = {
	singleInstrumentationID: string;
	aiInteractionID: string;
	aiFeatureName: string;
	proactiveAIGenerated: 0 | 1;
	userGeneratedAI: 0 | 1;
	isAIFeature: 1;
	aiExperienceName?: string;
	traceIds?: string[];
	invokedFrom?: string;
	/**
	 * Nudge metrics will be used passed in analytics events.
	 * It is currently only set when "Improve writing" is triggered from the
	 * "Improve writing" nudge.
	 */
	nudgeMetrics?: Record<string, number | undefined>;
};

type AIUnifiedAgentAttributes = {
	agentName?: string;
	agentId?: string;
	agentCreatorType?: string;
	agentExternalConfigReference?: string;
	agentIsDefault?: boolean;
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
			promptType?: string;
			refinementCount?: number;
			aiResultAction: string;
		},
	undefined
>;

type AIResultErrorAEP = TrackAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.AI_RESULT,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	AIUnifiedCommonAttributes &
		AIUnifiedAgentAttributes & {
			aiErrorMessage?: string;
			aiErrorCode?: number;
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
	| AIFeedbackSubmittedAEP;
