import type { ProviderError } from '@atlaskit/editor-common/collab';

export enum EVENT_ACTION {
	CONNECTION = 'connection', // https://data-portal.internal.atlassian.com/analytics/registry/43970
	CATCHUP = 'catchup', // https://data-portal.internal.atlassian.com/analytics/registry/44016
	DOCUMENT_INIT = 'documentInit', // https://data-portal.internal.atlassian.com/analytics/registry/43971
	ADD_STEPS = 'addSteps', // https://data-portal.internal.atlassian.com/analytics/registry/43972
	UPDATE_PARTICIPANTS = 'updateParticipants', // https://data-portal.internal.atlassian.com/analytics/registry/45634
	UPDATE_DOCUMENT = 'updateDocument', // https://data-portal.internal.atlassian.com/analytics/registry/58213
	COMMIT_UNCONFIRMED_STEPS = 'commitUnconfirmedSteps', // https://data-portal.internal.atlassian.com/analytics/registry/46501
	REINITIALISE_DOCUMENT = 'reinitialiseDocument', // https://data-portal.internal.atlassian.com/analytics/registry/50231
	ERROR = 'error', // https://data-portal.internal.atlassian.com/analytics/registry/51790
	PUBLISH_PAGE = 'publishPage', // https://data-portal.internal.atlassian.com/analytics/registry/50235
	GET_CURRENT_STATE = 'getCurrentState', // https://data-portal.internal.atlassian.com/analytics/registry/50783
	INVALIDATE_TOKEN = 'invalidateToken', // https://data-portal.internal.atlassian.com/analytics/registry/50444
	SEND_STEPS_RETRY = 'sendStepsRetry', // https://data-portal.internal.atlassian.com/analytics/registry/53598
	CATCHUP_AFTER_MAX_SEND_STEPS_RETRY = 'catchupAfterMaxSendStepsRetry', // https://data-portal.internal.atlassian.com/analytics/registry/53723
	DROPPED_STEPS = 'droppedStepInCatchup', // https://data-portal.internal.atlassian.com/analytics/registry/53724
	WEBSOCKET_MESSAGE_VOLUME_METRIC = 'websocketMessageVolumeMetric', // https://data-portal.internal.atlassian.com/analytics/registry/53596
	PROVIDER_INITIALIZED = 'providerInitialized', // https://data-portal.internal.atlassian.com/analytics/registry/54714
	RECONNECTION = 'providerReconnection', // https://data-portal.internal.atlassian.com/analytics/registry/73992
	PROVIDER_SETUP = 'providerSetup', // https://data-portal.internal.atlassian.com/analytics/registry/54715
	HAS_UNCONFIRMED_STEPS = 'hasUnconfirmedSteps', // https://data-portal.internal.atlassian.com/analytics/registry/56141
	OUT_OF_SYNC = 'outOfSync', // https://data-portal.internal.atlassian.com/analytics/registry/74993
	STEPS_REBASED = 'stepsRebased', // https://data-portal.internal.atlassian.com/analytics/registry/76616
	POLLING_FALLBACK = 'pollingFallback',
	PROCESS_STEPS = 'processSteps', // https://data-portal.internal.atlassian.com/analytics/registry/85229
}

export enum EVENT_STATUS {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	INFO = 'INFO',
	SUCCESS_10x_SAMPLED = 'SUCCESS_10x_SAMPLED',
}
export enum ADD_STEPS_TYPE {
	ACCEPTED = 'ACCEPTED',
	REJECTED = 'REJECTED',
	ERROR = 'ERROR',
}

export type DocumentUpdateErrorAttributes = {
	isDocTruthy?: boolean;
	editorVersion?: number;
	newVersion?: number;
	docHasContent?: boolean;
	isDocContentValid?: boolean;
};

export type CantSyncUpErrorAttributes = {
	unconfirmedStepsInfo: string;
};

export type ErrorAnalyticsEvent = {
	eventAction: EVENT_ACTION.ERROR;
	attributes: {
		errorMessage: string;
		originalErrorMessage: string | undefined;
		errorName?: string;
		errorCode?: string;
		errorStatus?: string;
		errorStack?: string;
		documentAri?: string;
		mappedError?: ProviderError;
		subProduct?: string;
	} & DocumentUpdateErrorAttributes;
	nonPrivacySafeAttributes?: {
		error: unknown;
	};
};

export type BaseActionAnalyticsEventAttributes = {
	documentAri?: string;
	subProduct?: string;
};

type InvalidateTokenAnalyticsEvent = {
	eventAction: EVENT_ACTION.INVALIDATE_TOKEN;
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		reason?: string;
		usedCachedToken?: boolean;
	} & BaseActionAnalyticsEventAttributes;
};

type AddStepsSuccessAnalyticsEvent = {
	eventAction: EVENT_ACTION.ADD_STEPS;
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		type: ADD_STEPS_TYPE.ACCEPTED;
		latency?: number;
		stepType?: {
			[key: string]: number;
		};
	} & BaseActionAnalyticsEventAttributes;
};

type AddStepsFailureAnalyticsEvent = {
	eventAction: EVENT_ACTION.ADD_STEPS;
	attributes: {
		eventStatus: EVENT_STATUS.FAILURE;
		type: ADD_STEPS_TYPE.REJECTED | ADD_STEPS_TYPE.ERROR;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
};

type ReInitDocFailAnalyticsEvent = {
	eventAction: EVENT_ACTION.REINITIALISE_DOCUMENT;
	attributes: {
		eventStatus: EVENT_STATUS.FAILURE;
		numUnconfirmedSteps: number;
		triggeredByCatchup?: boolean;
	} & BaseActionAnalyticsEventAttributes;
};

type ReInitDocSuccessAnalyticsEvent = {
	eventAction: EVENT_ACTION.REINITIALISE_DOCUMENT;
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		numUnconfirmedSteps: number;
		triggeredByCatchup?: boolean;
	} & BaseActionAnalyticsEventAttributes;
};

type ConnectionSuccessAnalyticsEvent = {
	eventAction: EVENT_ACTION.CONNECTION;
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
};

type ConnectionFailureAnalyticsEvent = {
	eventAction: EVENT_ACTION.CONNECTION;
	attributes: {
		eventStatus: EVENT_STATUS.FAILURE;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
};

type CatchUpSuccessAnalyticsEvent = {
	eventAction: EVENT_ACTION.CATCHUP;
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
};

type CatchUpFailureAnalyticsEvent = {
	eventAction: EVENT_ACTION.CATCHUP;
	attributes: {
		eventStatus: EVENT_STATUS.FAILURE;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
};

type CatchUpDroppedStepsEvent = {
	eventAction: EVENT_ACTION.DROPPED_STEPS;
	attributes: {
		numOfDroppedSteps: number;
	} & BaseActionAnalyticsEventAttributes;
};

type DocumentInitSuccessAnalyticsEvent = {
	eventAction: EVENT_ACTION.DOCUMENT_INIT;
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		latency?: number;
		resetReason?: string; // Record whether document init required a page reset
		hasTitle: boolean;
	} & BaseActionAnalyticsEventAttributes;
};

type UpdateParticipantsSuccessAnalyticsEvent = {
	eventAction: EVENT_ACTION.UPDATE_PARTICIPANTS;
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		participants: number;
	} & BaseActionAnalyticsEventAttributes;
};

type CommitUnconfirmedStepsSuccessAnalyticsEvent = {
	eventAction: EVENT_ACTION.COMMIT_UNCONFIRMED_STEPS;
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		latency?: number;
		numUnconfirmedSteps?: number;
	} & BaseActionAnalyticsEventAttributes;
};

type CommitUnconfirmedStepsFailureAnalyticsEvent = {
	eventAction: EVENT_ACTION.COMMIT_UNCONFIRMED_STEPS;
	attributes: {
		eventStatus: EVENT_STATUS.FAILURE;
		latency?: number;
		numUnconfirmedSteps?: number;
	} & BaseActionAnalyticsEventAttributes;
};

type PublishPageSuccessAnalyticsEvent = {
	eventAction: EVENT_ACTION.PUBLISH_PAGE;
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
};

type PublishPageFailureAnalyticsEvent = {
	eventAction: EVENT_ACTION.PUBLISH_PAGE;
	attributes: {
		eventStatus: EVENT_STATUS.FAILURE;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
};

type GetCurrentStateSuccessAnalyticsEvent = {
	eventAction: EVENT_ACTION.GET_CURRENT_STATE;
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
};

type GetCurrentStateFailureAnalyticsEvent = {
	eventAction: EVENT_ACTION.GET_CURRENT_STATE;
	attributes: {
		eventStatus: EVENT_STATUS.FAILURE;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
};

type SendStepsRetryAnalyticsEvent = {
	eventAction: EVENT_ACTION.SEND_STEPS_RETRY;
	attributes: {
		eventStatus: EVENT_STATUS.INFO;
		count: number;
	} & BaseActionAnalyticsEventAttributes;
};

type CatchupAfterMaxSendStepsRetryAnalyticsEvent = {
	eventAction: EVENT_ACTION.CATCHUP_AFTER_MAX_SEND_STEPS_RETRY;
	attributes: {
		eventStatus: EVENT_STATUS.INFO;
	} & BaseActionAnalyticsEventAttributes;
};

type WebsocketMessageVolumeMetricEvent = {
	eventAction: EVENT_ACTION.WEBSOCKET_MESSAGE_VOLUME_METRIC;
	attributes: {
		eventStatus: EVENT_STATUS.INFO;
		messageCount: number;
		messageSize: number;
	} & BaseActionAnalyticsEventAttributes;
};

type ProviderInitializedAnalyticsEvent = {
	eventAction: EVENT_ACTION.PROVIDER_INITIALIZED;
	attributes: {
		eventStatus: EVENT_STATUS.INFO;
		isPreinitializing: boolean;
		isBuffered?: boolean;
	} & BaseActionAnalyticsEventAttributes;
};

type ProviderSetupAnalyticsEvent = {
	eventAction: EVENT_ACTION.PROVIDER_SETUP;
	attributes: {
		eventStatus: EVENT_STATUS.INFO;
		isPreinitializing: boolean;
		hasState: boolean;
	} & BaseActionAnalyticsEventAttributes;
};

type ProviderHasUnconfirmedStepsAnalyticsEvent = {
	eventAction: EVENT_ACTION.HAS_UNCONFIRMED_STEPS;
	attributes: {
		numUnconfirmedSteps: number;
	} & BaseActionAnalyticsEventAttributes;
};

type UpdateDocumentAnalyticsEvent = {
	eventAction: EVENT_ACTION.UPDATE_DOCUMENT;
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		newVersion: number;
		editorVersion: number;
		isDocTruthy: boolean;
		docHasContent: boolean;
		isDocContentValid: boolean;
	} & BaseActionAnalyticsEventAttributes;
};

type ReconnectionAnalyticsEvent = {
	eventAction: EVENT_ACTION.RECONNECTION;
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		disconnectionPeriodSeconds: number;
	} & BaseActionAnalyticsEventAttributes;
};

type OutOfSyncAnalyticsEvent = {
	eventAction: EVENT_ACTION.OUT_OF_SYNC;
	attributes: {
		eventStatus: EVENT_STATUS.FAILURE;
		obfuscatedSteps: {
			[key: string]: number;
		}[];
		obfuscatedDoc: {
			[key: string]: number;
		};
		catchupReason: CatchupEventReason | undefined;
	} & BaseActionAnalyticsEventAttributes;
};

type StepsRebasedAnalyticsEvent = {
	eventAction: EVENT_ACTION.STEPS_REBASED;
	attributes: {
		eventStatus: EVENT_STATUS.INFO;
		obfuscatedUnconfirmedSteps: {
			[key: string]: number;
		}[];
		obfuscatedRemoteSteps: {
			[key: string]: number;
		}[];
		obfuscatedRebasedSteps: {
			[key: string]: number;
		}[];
		clientID: 'string';
		userId: 'string';
		versionBefore: 'string';
		versionAfter: 'string';
	} & BaseActionAnalyticsEventAttributes;
};

type PollingFallbackAnalyticsEvent = {
	eventAction: EVENT_ACTION.POLLING_FALLBACK;
	attributes: {
		eventStatus: EVENT_STATUS.INFO;
		url: 'string';
	} & BaseActionAnalyticsEventAttributes;
};

type ProcessStepsAnalyticsEvent = {
	eventAction: EVENT_ACTION.PROCESS_STEPS;
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
	} & BaseActionAnalyticsEventAttributes;
};

export type ActionAnalyticsEvent =
	| AddStepsSuccessAnalyticsEvent
	| AddStepsFailureAnalyticsEvent
	| ReInitDocFailAnalyticsEvent
	| ReInitDocSuccessAnalyticsEvent
	| ConnectionSuccessAnalyticsEvent
	| ConnectionFailureAnalyticsEvent
	| CatchUpSuccessAnalyticsEvent
	| CatchUpFailureAnalyticsEvent
	| DocumentInitSuccessAnalyticsEvent
	| UpdateParticipantsSuccessAnalyticsEvent
	| CommitUnconfirmedStepsSuccessAnalyticsEvent
	| CommitUnconfirmedStepsFailureAnalyticsEvent
	| PublishPageSuccessAnalyticsEvent
	| PublishPageFailureAnalyticsEvent
	| GetCurrentStateSuccessAnalyticsEvent
	| GetCurrentStateFailureAnalyticsEvent
	| InvalidateTokenAnalyticsEvent
	| SendStepsRetryAnalyticsEvent
	| CatchupAfterMaxSendStepsRetryAnalyticsEvent
	| CatchUpDroppedStepsEvent
	| WebsocketMessageVolumeMetricEvent
	| ProviderInitializedAnalyticsEvent
	| ProviderSetupAnalyticsEvent
	| ProviderHasUnconfirmedStepsAnalyticsEvent
	| UpdateDocumentAnalyticsEvent
	| ReconnectionAnalyticsEvent
	| OutOfSyncAnalyticsEvent
	| StepsRebasedAnalyticsEvent
	| PollingFallbackAnalyticsEvent
	| ProcessStepsAnalyticsEvent;

export const ACK_MAX_TRY = 60;

export const CONFLUENCE = 'confluence';

/** Enumerable for attaching a reason to catchup (v2) call(s) */
export enum CatchupEventReason {
	STEPS_ADDED = 'onStepsAdded',
	STEPS_REJECTED = 'onStepsRejected',
	PROCESS_STEPS = 'processSteps',
	RECONNECTED = 'reconnected',
}
