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
	caller?: string;
	docHasContent?: boolean;
	editorVersion?: number;
	isDocContentValid?: boolean;
	isDocTruthy?: boolean;
	newVersion?: number;
};

export type CantSyncUpErrorAttributes = {
	unconfirmedStepsInfo: string;
};

export type ErrorAnalyticsEvent = {
	attributes: {
		documentAri?: string;
		errorCode?: string;
		errorMessage: string;
		errorName?: string;
		errorStack?: string;
		errorStatus?: string;
		mappedError?: ProviderError;
		originalErrorMessage: string | undefined;
		subProduct?: string;
	} & DocumentUpdateErrorAttributes;
	eventAction: EVENT_ACTION.ERROR;
	nonPrivacySafeAttributes?: {
		error: unknown;
	};
};

export type BaseActionAnalyticsEventAttributes = {
	documentAri?: string;
	subProduct?: string;
};

type InvalidateTokenAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		reason?: string;
		usedCachedToken?: boolean;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.INVALIDATE_TOKEN;
};

type AddStepsSuccessAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		latency?: number;
		stepType?: {
			[key: string]: number;
		};
		type: ADD_STEPS_TYPE.ACCEPTED;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.ADD_STEPS;
};

type AddStepsFailureAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.FAILURE;
		latency?: number;
		type: ADD_STEPS_TYPE.REJECTED | ADD_STEPS_TYPE.ERROR;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.ADD_STEPS;
};

type ReInitDocFailAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.FAILURE;
		numUnconfirmedSteps: number;
		triggeredByCatchup?: boolean;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.REINITIALISE_DOCUMENT;
};

type ReInitDocSuccessAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		numUnconfirmedSteps: number;
		triggeredByCatchup?: boolean;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.REINITIALISE_DOCUMENT;
};

type ConnectionSuccessAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.CONNECTION;
};

type ConnectionFailureAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.FAILURE;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.CONNECTION;
};

type CatchUpSuccessAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.CATCHUP;
};

type CatchUpFailureAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.FAILURE;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.CATCHUP;
};

type CatchUpDroppedStepsEvent = {
	attributes: {
		numOfDroppedSteps: number;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.DROPPED_STEPS;
};

type DocumentInitSuccessAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		hasTitle: boolean;
		latency?: number;
		resetReason?: string; // Record whether document init required a page reset
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.DOCUMENT_INIT;
};

type UpdateParticipantsSuccessAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		participants: number;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.UPDATE_PARTICIPANTS;
};

type CommitUnconfirmedStepsSuccessAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		latency?: number;
		numUnconfirmedSteps?: number;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.COMMIT_UNCONFIRMED_STEPS;
};

type CommitUnconfirmedStepsFailureAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.FAILURE;
		latency?: number;
		numUnconfirmedSteps?: number;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.COMMIT_UNCONFIRMED_STEPS;
};

type PublishPageSuccessAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.PUBLISH_PAGE;
};

type PublishPageFailureAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.FAILURE;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.PUBLISH_PAGE;
};

type GetCurrentStateSuccessAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.GET_CURRENT_STATE;
};

type GetCurrentStateFailureAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.FAILURE;
		latency?: number;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.GET_CURRENT_STATE;
};

type SendStepsRetryAnalyticsEvent = {
	attributes: {
		count: number;
		eventStatus: EVENT_STATUS.INFO;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.SEND_STEPS_RETRY;
};

type CatchupAfterMaxSendStepsRetryAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.INFO;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.CATCHUP_AFTER_MAX_SEND_STEPS_RETRY;
};

type WebsocketMessageVolumeMetricEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.INFO;
		messageCount: number;
		messageSize: number;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.WEBSOCKET_MESSAGE_VOLUME_METRIC;
};

type ProviderInitializedAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.INFO;
		isBuffered?: boolean;
		isPreinitializing: boolean;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.PROVIDER_INITIALIZED;
};

type ProviderSetupAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.INFO;
		hasState: boolean;
		isPreinitializing: boolean;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.PROVIDER_SETUP;
};

type ProviderHasUnconfirmedStepsAnalyticsEvent = {
	attributes: {
		numUnconfirmedSteps: number;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.HAS_UNCONFIRMED_STEPS;
};

type UpdateDocumentAnalyticsEvent = {
	attributes: {
		docHasContent: boolean;
		editorVersion: number;
		eventStatus: EVENT_STATUS.SUCCESS;
		isDocContentValid: boolean;
		isDocTruthy: boolean;
		newVersion: number;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.UPDATE_DOCUMENT;
};

type ReconnectionAnalyticsEvent = {
	attributes: {
		disconnectionPeriodSeconds: number;
		eventStatus: EVENT_STATUS.SUCCESS;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.RECONNECTION;
};

type OutOfSyncAnalyticsEvent = {
	attributes: {
		catchupReason: CatchupEventReason | undefined;
		eventStatus: EVENT_STATUS.FAILURE;
		obfuscatedDoc: {
			[key: string]: number;
		};
		obfuscatedSteps: {
			[key: string]: number;
		}[];
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.OUT_OF_SYNC;
};

type StepsRebasedAnalyticsEvent = {
	attributes: {
		clientID: 'string';
		eventStatus: EVENT_STATUS.INFO;
		obfuscatedRebasedSteps: {
			[key: string]: number;
		}[];
		obfuscatedRemoteSteps: {
			[key: string]: number;
		}[];
		obfuscatedUnconfirmedSteps: {
			[key: string]: number;
		}[];
		userId: 'string';
		versionAfter: 'string';
		versionBefore: 'string';
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.STEPS_REBASED;
};

type PollingFallbackAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.INFO;
		url: 'string';
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.POLLING_FALLBACK;
};

type ProcessStepsAnalyticsEvent = {
	attributes: {
		eventStatus: EVENT_STATUS.SUCCESS;
	} & BaseActionAnalyticsEventAttributes;
	eventAction: EVENT_ACTION.PROCESS_STEPS;
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
