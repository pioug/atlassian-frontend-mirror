import type { ReactElement } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import {
	type BatchAttrsStep,
	type OverrideDocumentStepJSON as OverrideDocumentStep,
} from '@atlaskit/adf-schema/steps';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';
import type {
	EditorState,
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import { participantColors } from '@atlaskit/editor-shared-styles';
import { getGlobalTheme, token } from '@atlaskit/tokens';

import type { Providers } from '../provider-factory';
import type { GetResolvedEditorStateReason } from '../types';

// Format of the payload returned by the callback function passed to the collab provider
// that gets called when syncing with the back-end service fails.
export type NewCollabSyncUpErrorAttributes = {
	clientId?: number | string;
	lengthOfUnconfirmedSteps?: number;
	maxRetries: number;
	tries: number;
	version: number;
};

// Format of the document and its metadata returned from the collab provider
// after editing and for draft sync
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResolvedEditorState<T = any> = {
	content: JSONDocNode | T;
	stepVersion: number;
	title: string | null;
};

// Provider Errors
// Emitted errors
export enum PROVIDER_ERROR_CODE {
	NO_PERMISSION_ERROR = 'NO_PERMISSION_ERROR',
	INVALID_USER_TOKEN = 'INVALID_USER_TOKEN',
	DOCUMENT_NOT_FOUND = 'DOCUMENT_NOT_FOUND',
	LOCKED = 'LOCKED',
	FAIL_TO_SAVE = 'FAIL_TO_SAVE',
	DOCUMENT_RESTORE_ERROR = 'DOCUMENT_RESTORE_ERROR',
	INITIALISATION_ERROR = 'INITIALISATION_ERROR',
	NETWORK_ISSUE = 'NETWORK_ISSUE',
	INVALID_PROVIDER_CONFIGURATION = 'INVALID_PROVIDER_CONFIGURATION',
	INTERNAL_SERVICE_ERROR = 'INTERNAL_SERVICE_ERROR',
	DOCUMENT_UPDATE_ERROR = 'DOCUMENT_UPDATE_ERROR',
}
/**
 * This occurs when the provided user token is considered invalid for the given document ARI.
 * It happens during initialisation of the provider.
 * It could mean the document has been deleted (hence not found).
 * @message Message returned to editor, i.e User does not have permissions to access this document or document is not found
 * @recoverable It is recoverable, as we will try to refresh the token.
 */
type InsufficientEditingPermission = {
	code: PROVIDER_ERROR_CODE.NO_PERMISSION_ERROR;
	message: string;
	reason?: string;
	recoverable: boolean;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated switch to using either the error code or the recoverable flag
	 */
	status?: number;
};

/**
 * Similar to InsufficientEditingPermission, but the user token is invalid because it has expired or been revoked.
 * It may also be an invalid token format.
 * This error is given to the provider by NCS.
 * @message Message returned to editor, i.e. The user token was invalid
 * @recoverable It is recoverable, as we will try to refresh the token.
 */
type InvalidUserToken = {
	code: PROVIDER_ERROR_CODE.INVALID_USER_TOKEN;
	message: string;
	recoverable: boolean;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated switch to using either the error code or the recoverable flag
	 */
	status?: number;
};

/**
 * Document not found error, thrown when the provider is unable to find a document with the given ARI and user token.
 * It occurs during fetchCatchup, a function that fetches the latest document state during catchup.
 * We need to recieve a 404 from the document service to throw this error.
 * @message Message returned to editor, i.e. The requested document is not found
 * @recoverable It is recoverable, as the provider can try again later.
 */
type DocumentNotFound = {
	code: PROVIDER_ERROR_CODE.DOCUMENT_NOT_FOUND;
	message: string;
	recoverable: boolean;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated switch to using either the error code or the recoverable flag
	 */
	status?: number;
};

/**
 * This error is thrown when the document is locked by another user.
 * The error is passed to us by NCS.
 * @message Message returned to editor, i.e. The document is currently not available, please try again later
 * @recoverable It is recoverable, as the provider can try again later.
 */
type Locked = {
	code: PROVIDER_ERROR_CODE.LOCKED;
	message: string;
	recoverable: boolean;
	status?: number;
};

/**
 * This error is thrown when the provider is unable to save the document.
 * This can happen when the connection to dynamoDB is lost, or when we do not have sufficient permissions (DYNAMO ERROR).
 * This error is given to us by NCS.
 * @message Message returned to editor, i.e. Collab service is not able to save changes
 * @recoverable It is not recoverable, as we don't want the user to continue editing a document that is not being saved.
 */
type FailToSave = {
	code: PROVIDER_ERROR_CODE.FAIL_TO_SAVE;
	message: string;
	recoverable: boolean;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated switch to using either the error code or the recoverable flag
	 */
	status?: number;
};

/**
 * This error is thrown when the provider is unable to restore the document.
 * It occurs during onRestore, a function that restores the document to a previous version and reapplies unconfirmed steps.
 * onRestore is called when page recovery has emitted an 'init' event on a page client is currently connected to.
 * It could mean we failed to update the page metadata, or we failed to reapply unconfirmed steps.
 * @message Message returned to editor, i.e. Collab service unable to restore document
 * @recoverable It is not recoverable, as the provider has no further options after this.
 * The user will need to refresh the page to try again.
 */
type DocumentNotRestore = {
	code: PROVIDER_ERROR_CODE.DOCUMENT_RESTORE_ERROR;
	message: string;
	recoverable: boolean;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated switch to using either the error code or the recoverable flag
	 */
	status?: number;
};

/**
 * The initial document couldn't be loaded from the collab service.
 * This error is given to us by NCS.
 * It could indicate either a network issue, or an internal service error in NCS.
 * @message Message returned to editor, i.e. The initial document couldn't be loaded from the collab service
 * @recoverable It is not recoverable, as the provider cannot do anything to fix it.
 * The user will need to refresh the page to try again.
 */
type InitialisationError = {
	code: PROVIDER_ERROR_CODE.INITIALISATION_ERROR;
	message: string;
	recoverable: boolean;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated switch to using either the error code or the recoverable flag
	 */
	status?: number;
};

/**
 * Couldn't reconnect to the collab service (NCS) due to network issues.
 * NCS could be down, or the user could be offline. It's also possible the url is incorrect, or the user is behind a proxy blocking the connection.
 * Fired upon a reconnection attempt error (from Socket.IO Manager)
 * @message Message returned to editor, i.e. Couldn't reconnect to the collab service due to network issues
 * @recoverable It is recoverable, as the provider will try to reconnect.
 */
type NetworkIssue = {
	code: PROVIDER_ERROR_CODE.NETWORK_ISSUE;
	message: string;
	recoverable: boolean;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated switch to using either the error code or the recoverable flag
	 */
	status?: number;
};

/**
 * This error is thrown when the provider has an invalid configuration.
 * It could happen due to these errors from NCS:
 *  NAMESPACE_INVALID
    INVALID_ACTIVATION_ID
    INVALID_DOCUMENT_ARI
    INVALID_CLOUD_ID
 * @message Message returned to editor, i.e. Invalid provider configuration
 * @recoverable It is not recoverable, as the provider cannot do anything to fix it.
 * The service using the provider will need to fix the configuration.
 */
type InvalidProviderConfiguration = {
	code: PROVIDER_ERROR_CODE.INVALID_PROVIDER_CONFIGURATION;
	message: string;
	reason: string;
	recoverable: boolean;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated switch to using either the error code or the recoverable flag
	 */
	status?: number;
};

/**
 * This error is thrown when the provider encounters an internal service error, not otherwise accounted for.
 * @message Message returned to editor, i.e. Collab Provider experienced an unrecoverable error
 * @recoverable It is not recoverable, as the provider cannot do anything to fix it.
 */
type InternalServiceError = {
	code: PROVIDER_ERROR_CODE.INTERNAL_SERVICE_ERROR;
	message: string;
	reason: string;
	recoverable: boolean;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated switch to using either the error code or the recoverable flag
	 */
	status?: number;
};

type ProviderDocumentUpdateError = {
	code: PROVIDER_ERROR_CODE.DOCUMENT_UPDATE_ERROR;
	message: 'The provider failed to apply changes to the editor';
	recoverable: boolean;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated switch to using either the error code or the recoverable flag
	 */
	status?: number;
};

/**
 * A union of all possible provider errors that can be emitted back to the editor.
 */
export type ProviderError =
	| InsufficientEditingPermission
	| InvalidUserToken
	| DocumentNotFound
	| Locked
	| FailToSave
	| DocumentNotRestore
	| InitialisationError
	| NetworkIssue
	| InvalidProviderConfiguration
	| InternalServiceError
	| ProviderDocumentUpdateError;

// Collab Provider interface
export interface Metadata {
	[key: string]: string | number | boolean;
}

// Ignored via go/ees007
// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
// TODO: Deprecate redundant payload types
export type CollabMetadataPayload = Metadata;

export interface CollabEventInitData {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	doc?: any;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	json?: any;
	reserveCursor?: boolean;
	sid?: string;
	version?: number;
}

export interface CollabInitPayload extends CollabEventInitData {
	caller?: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	doc: any;
	metadata?: Metadata;
	reserveCursor?: boolean;
	targetClientId?: string;
	version: number;
}

export interface CollabEventConnectionData {
	initial: boolean;
	sid: string;
}

export type CollabConnectedPayload = CollabEventConnectionData;

export enum DisconnectReason {
	CLIENT_DISCONNECT = 'CLIENT_DISCONNECT',
	SERVER_DISCONNECT = 'SERVER_DISCONNECT',
	SOCKET_CLOSED = 'SOCKET_CLOSED',
	SOCKET_ERROR = 'SOCKET_ERROR',
	SOCKET_TIMEOUT = 'SOCKET_TIMEOUT',
	UNKNOWN_DISCONNECT = 'UNKNOWN_DISCONNECT',
}

export interface CollabDisconnectedPayload {
	reason: DisconnectReason;
	sid: string;
}

export interface CollabNamespaceLockCheckPayload {
	isLocked: boolean;
}

export interface CollabEventRemoteData {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	json?: any;
	newState?: EditorState;
	userIds?: (number | string)[];
}

type MarkJson = {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs: { [key: string]: any };
	type: string;
};

export type NodeJson = {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs: { [key: string]: any };
	content: NodeJson[];
	marks: MarkJson[];
	text?: string;
	type: string;
};

type SliceJson = {
	content: NodeJson[];
	openEnd: number;
	openStart: number;
};

export interface StepMetadata {
	metadata?: {
		createdOffline?: boolean;
		prevStepId?: string;
		rebased?: boolean;
		reqId?: string;
		schemaVersion?: string;
		source?: string;
		stepId?: string;
		traceId?: string;
		unconfirmedStepAfterRecovery?: boolean;
	};
}

export interface BaseStepPM extends StepMetadata {
	clientId: number | string;
	from?: number;
	slice?: SliceJson;
	stepType: string;
	to?: number;
	userId: string;
}

// Match with ProseMirror: https://prosemirror.net/docs/ref/#transform.ReplaceStep
export interface ReplaceStepPM extends BaseStepPM {
	from: number;
	slice: SliceJson;
	structure?: boolean;
	to: number;
}

// Match with ProseMirror: https://prosemirror.net/docs/ref/#transform.ReplaceAroundStep
export interface ReplaceAroundStepPM extends BaseStepPM {
	from: number;
	gapFrom: number;
	gapTo: number;
	insert: number;
	slice: SliceJson;
	structure?: boolean;
	to: number;
}

export type InlineCommentStepPM = InlineCommentAddMarkStepPM | InlineCommentAddNodeMarkStepPM;

interface InlineCommentAddMarkStepPM extends BaseStepPM {
	from: number;
	mark?: {
		attrs?: {
			annotationType?: 'inlineComment';
			id?: string;
		};
		type?: 'annotation';
	};
	stepType: 'addMark';
	to: number;
}

export interface InlineCommentAddNodeMarkStepPM extends BaseStepPM {
	mark?: {
		attrs?: {
			annotationType?: 'inlineComment';
			id?: string;
		};
		type?: 'annotation';
	};
	pos: number;
	stepType: 'addNodeMark';
}

// Match with ProseMirror: https://prosemirror.net/docs/ref/#transform.AttrStep
export interface SetAttrsStepPM extends BaseStepPM {
	attrs: Record<string, unknown>;
	pos: number;
	stepType: 'setAttrs';
}

//Intersection: NCS custom step type config in adf-schema
export type BatchAttrsStepPM = BaseStepPM & BatchAttrsStep;
export type OverrideDocumentStepPM = BaseStepPM & OverrideDocumentStep;

//Unions
export type StepJson =
	| OverrideDocumentStepPM
	| ReplaceAroundStepPM
	| ReplaceStepPM
	| InlineCommentStepPM
	| SetAttrsStepPM;

export interface CollabDataPayload extends CollabEventRemoteData {
	json: StepJson[];
	userIds: (number | string)[];
	version: number;
}

export interface CollabSendableSelection {
	// JWM does some weird serialisation stuff:
	// eg. {"type":"nodeSelection","head":"{\"nodeId\":\"project:10002:view/list/node/summary-10000\"}"}
	anchor?: number | string;
	head?: number | string;
	type: 'textSelection' | 'nodeSelection';
}

export type PresenceActivity = 'viewer' | 'editor';

export type CollabActivityAIProviderChangedPayload = {
	action: 'add' | 'remove';
	providerId?: string;
	type: 'ai-provider:change';
};

export type CollabPresenceActivityChangePayload = {
	activity?: PresenceActivity;
	type: 'participant:activity';
};

export interface CollabEventTelepointerData {
	selection: CollabSendableSelection;
	sessionId: string;
	type: 'telepointer';
}

export type CollabTelepointerPayload = CollabEventTelepointerData;

type ProviderParticipantPermitLevel = {
	isPermittedToComment?: boolean;
	isPermittedToEdit?: boolean;
	isPermittedToView?: boolean;
};

export interface CollabParticipant {
	avatar: string;
	cursorPos?: number;
	isGuest?: boolean;
	isHydrated?: boolean;
	lastActive: number;
	name: string;
	permit?: ProviderParticipantPermitLevel;
	presenceActivity?: PresenceActivity;
	presenceId?: string;
	sessionId: string;
}

export type ProviderParticipant = CollabParticipant & {
	clientId: number | string;
	email: string;
	userId: string;
};

export interface CollabEventPresenceData {
	joined?: ProviderParticipant[];
	left?: { sessionId: string }[];
}

export type CollabPresencePayload = CollabEventPresenceData;

export type CollabLocalStepsPayload = {
	steps: readonly Step[];
};

export interface CollabEventConnectingData {
	initial: boolean;
}

export type CollabConnectingPayload = CollabEventConnectingData;

export type CollabCommitStatusEventPayload = {
	status: 'attempt' | 'success' | 'failure';
	version: number;
};

export type UserPermitType = {
	isPermittedToComment: boolean;
	isPermittedToEdit: boolean;
	isPermittedToView: boolean;
};

export type CollabPermissionEventPayload = UserPermitType;

export type ConflictChange = {
	from: number;
	local: Slice;
	remote: Slice;
	to: number;
};

export type ConflictChanges = {
	deleted: ConflictChange[];
	inserted: ConflictChange[];
};

export interface CollabEventConflictPayload extends ConflictChanges {
	offlineDoc: PMNode;
}

export interface CollabEvents {
	'commit-status': CollabCommitStatusEventPayload;
	connected: CollabConnectedPayload;
	connecting: CollabConnectingPayload;
	data: CollabDataPayload;
	'data:conflict': CollabEventConflictPayload;
	disconnected: CollabDisconnectedPayload;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	entity: any;
	error: ProviderError;
	init: CollabInitPayload;
	'local-steps': CollabLocalStepsPayload;
	'metadata:changed': Metadata;
	'namespace-lock:check': CollabNamespaceLockCheckPayload;
	permission: CollabPermissionEventPayload;
	presence: CollabPresencePayload;
	'presence:changed': CollabPresenceActivityChangePayload;
	telepointer: CollabTelepointerPayload;
}

export type SyncUpErrorFunction = (attributes: NewCollabSyncUpErrorAttributes) => void;

export interface CollabEditProvider<Events extends CollabEvents = CollabEvents> {
	getFinalAcknowledgedState: (
		reason: GetResolvedEditorStateReason,
	) => Promise<ResolvedEditorState>;

	getIsNamespaceLocked: () => boolean;

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	initialize: (getState: () => any, createStep: (json: object) => Step) => this; // TO-DO: deprecate this

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	off: (evt: keyof Events, handler: (...args: any) => void) => this;

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	on: (evt: keyof Events, handler: (...args: any) => void) => this;

	send: (tr: Transaction, oldState: EditorState, newState: EditorState) => void;

	sendMessage: <K extends keyof Events>(data: { type: K } & Events[K]) => void;

	setup: (props: {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		editorApi?: any;
		getState?: () => EditorState;
		onSyncUpError?: SyncUpErrorFunction;
	}) => this;

	unsubscribeAll: (evt: keyof Events) => this;
}

export type CollabEditOptions = {
	provider?: Providers['collabEditProvider'];
	useNativePlugin?: boolean;
	userId?: string;
} & CollabInviteToEditProps &
	CollabAnalyticsProps;

export type InviteToEditButtonProps = {
	onClick: (event: React.MouseEvent<HTMLElement>) => void;
	selected: boolean;
};

export type InviteToEditComponentProps = {
	children: ReactElement<InviteToEditButtonProps>;
};
export interface CollabInviteToEditProps {
	inviteToEditComponent?: React.ComponentType<React.PropsWithChildren<InviteToEditComponentProps>>;
	inviteToEditHandler?: (event: React.MouseEvent<HTMLElement>) => void;
	isInviteToEditButtonSelected?: boolean;
}

export interface CollabAnalyticsProps {
	/**
	 * @description Control whether Synchrony entity error events are tracked
	 */
	EXPERIMENTAL_allowInternalErrorAnalytics?: boolean;
}

export interface CollabEventLocalStepData {
	steps: Array<Step>;
}

export type Color = ReturnType<typeof token>;

const telepointerColorStyle = (backgroundColor: string, textColor: string, index: number) => {
	const { colorMode } = getGlobalTheme();

	const backgroundStyle =
		colorMode === 'dark'
			? `linear-gradient(to bottom, ${backgroundColor} -800000%, transparent 200000%)`
			: `linear-gradient(to bottom, ${backgroundColor} -850000%, transparent 150000%)`;

	return `
    &.color-${index} {
      background: ${backgroundStyle};
      &::after {
        background-color: ${backgroundColor};
        color: ${textColor};
        border-color: ${backgroundColor};
      }
    }
  `;
};

export const TELEPOINTER_DIM_CLASS = 'telepointer-dim';
export const TELEPOINTER_PULSE_CLASS = 'telepointer-pulse-animate';
export const TELEPOINTER_PULSE_DURING_TR_CLASS = 'telepointer-pulse-during-tr';
export const TELEPOINTER_PULSE_DURING_TR_DURATION_MS = 7500; // Keeping it longer so it'll be easier to spot during transactions
export const TELEPOINTER_DATA_SESSION_ID_ATTR = 'data-telepointer-sessionid';

// ED-22557: Safely convert to object styling
// Disable top: -14px since it is necessary to align to cursor
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const telepointerStyle: SerializedStyles = css`
	@keyframes pulseIn {
		0%,
		100% {
			transform: scaleX(0);
			opacity: 0;
		}
		10% {
			transform: scaleX(1.4);
			opacity: 1;
		}
		15%,
		85% {
			transform: scaleX(1);
			opacity: 1;
		}
	}

	@keyframes pulseOut {
		0%,
		90%,
		100% {
			transform: scaleX(1);
			opacity: 1;
		}
		10%,
		80% {
			transform: scaleX(0);
			opacity: 0;
		}
	}

	@keyframes pulseInDuringTr {
		0%,
		95% {
			transform: scaleX(1);
			opacity: 1;
		}
		100% {
			transform: scaleX(0);
			opacity: 0;
		}
	}

	@keyframes pulseOutDuringTr {
		100% {
			transform: scaleX(1);
			opacity: 1;
		}
		0%,
		90% {
			transform: scaleX(0);
			opacity: 0;
		}
	}

	.ProseMirror .telepointer {
		position: relative;
		transition: opacity 200ms;

		&.telepointer-selection:not(.inlineNodeView) {
			line-height: 1.2;
			pointer-events: none;
			user-select: none;
		}

		&.telepointer-selection-badge {
			.telepointer-initial,
			.telepointer-fullname {
				position: absolute;
				display: block;
				user-select: none;
				white-space: pre;
				top: -14px;
				left: 0px;
				font: ${token('font.body.small')};
				padding-left: ${token('space.050')};
				padding-right: ${token('space.050')};
				border-radius: 0 2px 2px 0;
			}

			.telepointer-initial {
				opacity: 1;
				transition: opacity 0.15s ease-out;
			}

			.telepointer-fullname {
				opacity: 0;
				transform: scaleX(0);
				transform-origin: top left;
				transition:
					transform 0.15s ease-out,
					opacity 0.15s ease-out;
			}
		}

		&.${TELEPOINTER_PULSE_CLASS} {
			.telepointer-initial {
				animation: pulseOut 2.5s ease-in-out;
			}

			.telepointer-fullname {
				animation: pulseIn 2.5s ease-in-out;
			}
		}

		&.${TELEPOINTER_PULSE_DURING_TR_CLASS} {
			.telepointer-initial {
				animation: pulseOutDuringTr ${TELEPOINTER_PULSE_DURING_TR_DURATION_MS}ms ease-in-out;
			}

			.telepointer-fullname {
				animation: pulseInDuringTr ${TELEPOINTER_PULSE_DURING_TR_DURATION_MS}ms ease-in-out;
			}
		}

		&:hover {
			.telepointer-initial {
				opacity: 0;
				transition-delay: 150ms;
			}

			.telepointer-fullname {
				transform: scaleX(1);
				opacity: 1;
				z-index: 1;
			}
		}

		&.${TELEPOINTER_DIM_CLASS} {
			opacity: 0.2;
		}

		${participantColors.map((participantColor, index) =>
			telepointerColorStyle(participantColor.backgroundColor, participantColor.textColor, index),
		)};
	}
`;

const tintKey = 'collab:isDirtyTransaction';

export const isDirtyTransaction = (tr: Transaction | ReadonlyTransaction): boolean => {
	return Boolean(tr.getMeta(tintKey));
};
/*
 * This function is used to mark which commands that are dispatching
 * unnecessary changes on Editor.
 */
export const tintDirtyTransaction = (tr: Transaction): void => {
	tr.setMeta(tintKey, true);
};
