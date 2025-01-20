/**
 * Unified events are used to measure the MAU of AI features globally
 * https://hello.atlassian.net/wiki/spaces/AAI/pages/3770721410/Unified+Event+Instrumentation+For+AI+Features
 */

import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP } from './utils';

type CommonAttributes = {
	singleInstrumentationID: string;
	aiInteractionID: string;
	aiFeatureName: string;
	proactiveAIGenerated: 0 | 1;
	userGeneratedAI: 0 | 1;
	isAIFeature: 1;
	aiExperienceName?: string;
};

export type AIInteractionInitiatedAEP = TrackAEP<
	ACTION.INITIATED,
	ACTION_SUBJECT.AI_INTERACTION,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	CommonAttributes,
	undefined
>;

export type AIInteractionDismissedAEP = TrackAEP<
	ACTION.DISMISSED,
	ACTION_SUBJECT.AI_INTERACTION,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	CommonAttributes,
	undefined
>;

export type AIResultViewedAEP = TrackAEP<
	ACTION.VIEWED,
	ACTION_SUBJECT.AI_RESULT,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	CommonAttributes,
	undefined
>;

export type AIResultActionedAEP = TrackAEP<
	ACTION.ACTIONED,
	ACTION_SUBJECT.AI_RESULT,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	CommonAttributes & {
		promptType?: string;
		refinementCount?: number;
		aiResultAction: string;
	},
	undefined
>;

export type AIResultErrorAEP = TrackAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.AI_RESULT,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	CommonAttributes & {
		aiErrorMessage?: string;
		aiErrorCode?: number;
		aiExperienceName?: string;
	},
	undefined
>;

export type AIFeedbackSubmittedAEP = TrackAEP<
	ACTION.SUBMITTED,
	ACTION_SUBJECT.AI_FEEDBACK,
	ACTION_SUBJECT_ID.EDITOR_PLUGIN_AI,
	CommonAttributes & {
		aiExperienceName?: string;
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
