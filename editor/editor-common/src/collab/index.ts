import type { ReactElement } from 'react';

import { css } from '@emotion/react';

import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type {
	EditorState,
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import { avatarColors, relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { getGlobalTheme, token } from '@atlaskit/tokens';

import type { Providers } from '../provider-factory';

// Format of the payload returned by the callback function passed to the collab provider
// that gets called when syncing with the back-end service fails.
export type NewCollabSyncUpErrorAttributes = {
	lengthOfUnconfirmedSteps?: number;
	tries: number;
	maxRetries: number;
	clientId?: number | string;
	version: number;
};

// Format of the document and its metadata returned from the collab provider
// after editing and for draft sync
export type ResolvedEditorState<T = any> = {
	content: JSONDocNode | T;
	title: string | null;
	stepVersion: number;
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
	recoverable: boolean;
	reason?: string;
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
	recoverable: boolean;
	reason: string;
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
	recoverable: boolean;
	reason: string;
	/**
	 * @deprecated switch to using either the error code or the recoverable flag
	 */
	status?: number;
};

type ProviderDocumentUpdateError = {
	code: PROVIDER_ERROR_CODE.DOCUMENT_UPDATE_ERROR;
	message: 'The provider failed to apply changes to the editor';
	recoverable: boolean;
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

// TODO: Deprecate redundant payload types
export type CollabMetadataPayload = Metadata;

export interface CollabEventInitData {
	doc?: any;
	json?: any;
	version?: number;
	sid?: string;
	reserveCursor?: boolean;
}

export interface CollabInitPayload extends CollabEventInitData {
	doc: any;
	version: number;
	metadata?: Metadata;
	reserveCursor?: boolean;
}

export interface CollabEventConnectionData {
	sid: string;
	initial: boolean;
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

export interface CollabEventRemoteData {
	json?: any;
	newState?: EditorState;
	userIds?: (number | string)[];
}

type MarkJson = {
	type: string;
	attrs: { [key: string]: any };
};

type NodeJson = {
	type: string;
	attrs: { [key: string]: any };
	content: NodeJson[];
	marks: MarkJson[];
	text?: string;
};

type SliceJson = {
	content: NodeJson[];
	openStart: number;
	openEnd: number;
};

export type StepJson = {
	stepType?: string; // Likely required
	from?: number;
	to?: number;
	slice?: SliceJson;
	clientId: number | string;
	userId: string;
	createdAt?: number; // Potentially required?
	structure?: boolean;
};

export interface CollabDataPayload extends CollabEventRemoteData {
	version: number;
	json: StepJson[];
	userIds: (number | string)[];
}

export interface CollabSendableSelection {
	type: 'textSelection' | 'nodeSelection';
	// JWM does some weird serialisation stuff:
	// eg. {"type":"nodeSelection","head":"{\"nodeId\":\"project:10002:view/list/node/summary-10000\"}"}
	anchor?: number | string;
	head?: number | string;
}

export interface CollabEventTelepointerData {
	type: 'telepointer';
	selection: CollabSendableSelection;
	sessionId: string;
}

export type CollabTelepointerPayload = CollabEventTelepointerData;

type ProviderParticipantPermitLevel = {
	isPermittedToView?: boolean;
	isPermittedToComment?: boolean;
	isPermittedToEdit?: boolean;
};

export interface CollabParticipant {
	lastActive: number;
	sessionId: string;
	avatar: string;
	name: string;
	cursorPos?: number;
	permit?: ProviderParticipantPermitLevel;
}

export type ProviderParticipant = CollabParticipant & {
	userId: string;
	clientId: number | string;
	email: string;
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
	isPermittedToView: boolean;
	isPermittedToComment: boolean;
	isPermittedToEdit: boolean;
};

export type CollabPermissionEventPayload = UserPermitType;

export interface CollabEvents {
	'metadata:changed': Metadata;
	init: CollabInitPayload;
	connected: CollabConnectedPayload;
	disconnected: CollabDisconnectedPayload;
	data: CollabDataPayload;
	telepointer: CollabTelepointerPayload;
	presence: CollabPresencePayload;
	'local-steps': CollabLocalStepsPayload;
	error: ProviderError;
	entity: any;
	connecting: CollabConnectingPayload;
	permission: CollabPermissionEventPayload;
	'commit-status': CollabCommitStatusEventPayload;
}

export type SyncUpErrorFunction = (attributes: NewCollabSyncUpErrorAttributes) => void;

export interface CollabEditProvider<Events extends CollabEvents = CollabEvents> {
	initialize(getState: () => any, createStep: (json: object) => Step): this; // TO-DO: deprecate this

	setup(props: { getState?: () => EditorState; onSyncUpError?: SyncUpErrorFunction }): this;

	send(tr: Transaction, oldState: EditorState, newState: EditorState): void;

	on(evt: keyof Events, handler: (...args: any) => void): this;

	off(evt: keyof Events, handler: (...args: any) => void): this;

	unsubscribeAll(evt: keyof Events): this;

	sendMessage<K extends keyof Events>(data: { type: K } & Events[K]): void;

	getFinalAcknowledgedState(): Promise<ResolvedEditorState>;
}

export type CollabEditOptions = {
	provider?: Providers['collabEditProvider'];
	userId?: string;
	useNativePlugin?: boolean;
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
	inviteToEditHandler?: (event: React.MouseEvent<HTMLElement>) => void;
	isInviteToEditButtonSelected?: boolean;
	inviteToEditComponent?: React.ComponentType<React.PropsWithChildren<InviteToEditComponentProps>>;
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

const telepointerColorStyle = (color: Color, index: number) => {
	const { colorMode } = getGlobalTheme();

	const backgroundStyle =
		colorMode === 'dark'
			? `linear-gradient(to bottom, ${color} -800000%, transparent 200000%)`
			: `linear-gradient(to bottom, ${color} -850000%, transparent 150000%)`;

	return `
    &.color-${index} {
      background: ${backgroundStyle};
      &::after {
        background-color: ${color};
        color: ${token('color.text.inverse', '#FFFFFF')};
        border-color: ${color};
      }
    }
  `;
};

export const TELEPOINTER_DIM_CLASS = 'telepointer-dim';

// ED-22557: Safely convert to object styling
// Disable top: -14px since it is necessary to align to cursor
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/design-system/no-exported-css
export const telepointerStyle = css`
	.ProseMirror .telepointer {
		position: relative;
		transition: opacity 200ms;

		&.telepointer-selection {
			line-height: 1.2;
			pointer-events: none;
			user-select: none;
		}

		&.telepointer-selection-badge::after {
			content: attr(data-initial);
			position: absolute;
			display: block;
			top: -14px;
			font-size: ${relativeFontSizeToBase16(9)};
			padding: ${token('space.025', '2px')};
			color: ${token('color.text.inverse', '#FFFFFF')};
			left: 0px;
			border-radius: 2px 2px 2px 0;
			line-height: initial;
		}

		&.${TELEPOINTER_DIM_CLASS} {
			opacity: 0.2;
		}

		${avatarColors.map((color, index) => telepointerColorStyle(color, index))};
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
export const tintDirtyTransaction = (tr: Transaction) => {
	tr.setMeta(tintKey, true);
};
