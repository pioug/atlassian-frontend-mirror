import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import type { AnonymousAsset } from '@atlaskit/anonymous-assets';

import type { Manager, Socket as SocketIOSocket } from 'socket.io-client';
import type { InternalError } from './errors/internal-errors';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { BatchProps, GetUserType } from './participants/participants-helper';
import type AnalyticsHelper from './analytics/analytics-helper';
import type {
	StepJson,
	CollabSendableSelection,
	Metadata,
	UserPermitType,
	PresenceActivity,
} from '@atlaskit/editor-common/collab';
import { type CatchupEventReason } from './helpers/const';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export interface CollabEventDisconnectedData {
	reason:
		| 'CLIENT_DISCONNECT'
		| 'SERVER_DISCONNECT'
		| 'SOCKET_CLOSED'
		| 'SOCKET_ERROR'
		| 'SOCKET_TIMEOUT'
		| 'UNKNOWN_DISCONNECT';
	sid: string;
}

// types from editor common end

export interface Storage {
	delete: (key: string) => Promise<void>;
	get: (key: string) => Promise<string>;
	set: (key: string, value: string) => Promise<void>;
}

// Initial draft
export interface InitialDraft {
	document: JSONDocNode;
	metadata?: Metadata;
	version: number;
}

export type FetchAnonymousAsset = (
	presenceId: string | undefined,
) => Promise<AnonymousAsset | undefined>;

export interface Config {
	/**
	 * There is expected to be temporary divergence between Live Page editor expand behaviour and the standard expand behaviour.
	 *
	 * This is expected to be removed in Q4 as Editor and Live Page teams align on a singular behaviour.
	 *
	 * It is only supported for use by Confluence.
	 *
	 * @default false
	 */
	__livePage?: boolean;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated: Use promise based getAnalyticsWebClient instead
	 */
	analyticsClient?: AnalyticsWebClient;
	batchProps?: BatchProps;
	createSocket: (
		path: string,
		auth?: AuthCallback | InitAndAuthData,
		productInfo?: ProductInformation,
		isPresenceOnly?: boolean,
		analyticsHelper?: AnalyticsHelper,
	) => SocketIOSocket;
	documentAri: string;
	/**
	 * Enable checking if a document update from collab-provider is being dropped by the editor,
	 * throwing a non-recoverable error if it's detected.
	 */
	enableErrorOnFailedDocumentApply?: boolean;
	/**
	 * When a page is being published this number can control the number of failed steps until a catchup is triggered.
	 * The default value is MAX_STEP_REJECTED_ERROR (15).
	 */
	failedStepLimitBeforeCatchupOnPublish?: number;
	featureFlags?: { [key: string]: boolean };
	fetchAnonymousAsset?: FetchAnonymousAsset;
	getAnalyticsWebClient?: Promise<AnalyticsWebClient>;
	getUser?: GetUserType;
	// initial draft passed on provider creation
	initialDraft?: InitialDraft;
	isBufferingEnabled?: boolean;
	// specifically for the presence only
	isPresenceOnly?: boolean;
	lifecycle?: Lifecycle;
	// ESS-1009 Allow to opt-in into 404 response
	need404?: boolean;
	/**
	 * If provided, permissionTokenRefresh is called whenever a new JWT token is required.
	 */
	permissionTokenRefresh?: () => Promise<string | null>;
	/**
	 * Configure the provider to pass along a default activity during presence events. This activity will be used
	 * to display a user's activity, such as 'viewer' or 'editor'.
	 *
	 * This activity can be updated later on by the participants-service.
	 */
	presenceActivity?: PresenceActivity;
	/**
	 * Configure the provider to pass along a persistent presenceId during presence events. This presenceId will be used
	 * to calculate the colors of the presence avatars as well as the editors telepointers. Since these two features are split across
	 * multiple websocket connections, the presenceId is used to correlate the two.
	 */
	presenceId?: string;
	productInfo?: ProductInformation;

	/**
	 * Configure the client side circuit breaker in the event that abnormal behaviour causes the client to flood
	 * NCS with too many steps or too large a volume of data. This can result in either a soft fail or a hard (fatal) fail
	 * depending on the configured rate limit type.
	 */
	rateLimitMaxStepSize?: number;
	rateLimitStepCount?: number;
	rateLimitTotalStepSize?: number;
	rateLimitType?: number;
	storage?: Storage;

	/**
	 * Throws errors when trying to send data to collab but the client is not offline.
	 * This can lead to potential dataloss and retrying should be considered. Without this flag the provider silently drops the requests.
	 */
	throwOnNotConnected?: boolean;

	url: string;
}

export interface InitAndAuthData {
	// The initialized status. If false, BE will send document, otherwise not.
	initialized: boolean;
	// ESS-1009 Allow to opt-in into 404 response
	need404?: boolean;
	token?: string;
}

export type AuthCallback = (cb: (data: InitAndAuthData) => void) => void;

interface SimpleEventEmitter {
	on: (event: string, fn: Function) => SimpleEventEmitter;
}
export interface Socket extends SimpleEventEmitter {
	close: () => Socket;
	connect: () => Socket;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	emit: (event: string, ...args: any[]) => Socket;
	id: string;
	io?: Manager;
}

export type LifecycleEvents = 'save' | 'restore';
export type EventHandler = () => void;

export interface Lifecycle {
	on: (event: LifecycleEvents, handler: EventHandler) => void;
}

// Channel
export type InitPayload = {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	doc: any;
	metadata?: Metadata;
	targetClientId?: string;
	userId?: string;
	version: number;
};

/**
 * @description Incoming payload type from the `broadcast` route in NCS
 * @param {number} timestamp added in NCS
 * @param {string} sessionId socket.id from NCS
 * @param data event specific data from NCS
 */
export type BroadcastIncomingPayload = {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: PresencePayload | TelepointerPayload | StepsPayload | any; // broadcasted data from NCS, any added as a fallback
	sessionId?: string;
	timestamp?: number;
};

export type PresenceData = {
	clientId: number | string;
	permit?: UserPermitType;
	presenceActivity?: PresenceActivity;
	presenceId?: string;
	sessionId: string;
	userId: string | undefined;
};

export type PresencePayload = PresenceData & {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data?: Record<string, any>;
	timestamp: number;
};

export type TelepointerPayload = PresencePayload & {
	selection: CollabSendableSelection;
};

export enum AcknowledgementResponseTypes {
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR',
}

export type AcknowledgementSuccessPayload = {
	type: AcknowledgementResponseTypes.SUCCESS;
};

export type AcknowledgementPayload = AcknowledgementSuccessPayload | AcknowledgementErrorPayload;

export type AddStepAcknowledgementSuccessPayload = {
	delay?: number;
	type: AcknowledgementResponseTypes.SUCCESS;
	version: number;
};

export type AcknowledgementErrorPayload = {
	delay?: number;
	error: InternalError;
	type: AcknowledgementResponseTypes.ERROR;
};

export type AddStepAcknowledgementPayload =
	| AddStepAcknowledgementSuccessPayload
	| AcknowledgementErrorPayload;

export type StepsPayload = {
	steps: StepJson[];
	version: number;
};

// ESS-2916 Type def for namespace status - lock/unlock
export type NamespaceStatus = {
	isLocked: boolean;
	timestamp: number;
	// waitTimeInMs is set when the isLocked bool set to true. Otherwise, it is null
	waitTimeInMs?: number;
};

export type ChannelEvent = {
	connected: {
		initialized: boolean;
		sid: string;
	};
	disconnect: { reason: string };
	error: InternalError;
	init: InitPayload;
	'metadata:changed': Metadata;
	'participant:left': PresencePayload;
	'participant:telepointer': TelepointerPayload;
	'participant:updated': PresencePayload;
	permission: UserPermitType;
	presence: PresencePayload;
	'presence:joined': PresencePayload;
	reconnected: null;
	restore: InitPayload;
	status: NamespaceStatus;
	'steps:added': StepsPayload;
	'steps:commit': StepsPayload & {
		collabMode: string;
		forcePublish?: boolean;
		userId: string;
	};
};

export interface Catchupv2Response {
	metadata?: Metadata;
	steps?: StepJson[];
}

export interface ReconcileResponse {
	ari?: string;
	document: string;
	metadata?: Metadata;
	version: number;
}
// This is added as a part of CEPS-1660
export type GenerateDiffStepsResponseBody = {
	documentAri: string;
	generatedSteps: StepJson[];
	latestDocument?: string;
	message?: string;
	userId: string;
};

// CatchupV2
export interface Catchupv2Options {
	analyticsHelper: AnalyticsHelper | undefined;
	catchUpOutofSync: boolean;
	clientId: number | string | undefined;
	fetchCatchupv2: (
		fromVersion: number,
		clientId: number | string | undefined,
		catchUpOutofSync: boolean,
		reason?: CatchupEventReason,
		sessionId?: string,
	) => Promise<Catchupv2Response>;
	getCurrentPmVersion: () => number;
	getState: (() => EditorState) | undefined;
	onCatchupComplete?: (steps: StepJson[]) => void;
	onStepsAdded: (data: StepsPayload) => void;
	reason?: CatchupEventReason;
	sessionId?: string;
	updateMetadata: (metadata: Metadata | undefined) => void;
}

export type ReconnectionMetadata = {
	disconnectionPeriodSeconds: number | undefined;
	unconfirmedStepsLength: number | undefined;
};

export type ProductInformation = {
	product: string;
	subProduct?: string;
};
