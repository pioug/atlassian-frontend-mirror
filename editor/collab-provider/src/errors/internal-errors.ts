import type { NCSErrors } from './ncs-errors';

export enum INTERNAL_ERROR_CODE {
	TOKEN_PERMISSION_ERROR = 'TOKEN_PERMISSION_ERROR',
	RECONNECTION_NETWORK_ISSUE = 'RECONNECTION_NETWORK_ISSUE',
	CONNECTION_ERROR = 'CONNECTION_ERROR',
	RECONNECTION_ERROR = 'RECONNECTION_ERROR',
	DOCUMENT_NOT_FOUND = 'DOCUMENT_NOT_FOUND',
	CATCHUP_FAILED = 'CATCHUP_FAILED',
	DOCUMENT_RESTORE_ERROR = 'DOCUMENT_RESTORE_ERROR',
	ADD_STEPS_ERROR = 'ADD_STEPS_ERROR',
	DOCUMENT_UPDATE_ERROR = 'DOCUMENT_UPDATE_ERROR',
	VIEW_ONLY_STEPS_ERROR = 'VIEW_ONLY_STEPS_ERROR',
	OUT_OF_SYNC_CLIENT_DATA_LOSS_EVENT = 'OUT_OF_SYNC_CLIENT_DATA_LOSS_EVENT',
}

type DocumentRecoveryError = {
	data: {
		code: INTERNAL_ERROR_CODE.DOCUMENT_RESTORE_ERROR;
		status: number; // 500
	};
	message: string;
};
type AddStepsError = {
	data: {
		code: INTERNAL_ERROR_CODE.ADD_STEPS_ERROR;
		status: number; // 500
	};
	message: string;
};

type OutOfSyncClientDatalossEvent = {
	data: {
		code: INTERNAL_ERROR_CODE.OUT_OF_SYNC_CLIENT_DATA_LOSS_EVENT;
		meta: {
			reason?: string;
		};
	};
	message: string;
};

// Channel Errors
export type CatchUpFailedError = {
	data: {
		code: INTERNAL_ERROR_CODE.CATCHUP_FAILED;
		status: number; // ?
	};
	message: string;
};
export type TokenPermissionError = {
	data: {
		code: INTERNAL_ERROR_CODE.TOKEN_PERMISSION_ERROR;
		meta: {
			originalError?: unknown;
			reason?: string; // RESOURCE_DELETED
		};
		status: number; // 403
	};
	message: string; // 'Insufficient editing permissions'
};
export type ReconnectionError = {
	data: {
		code: INTERNAL_ERROR_CODE.RECONNECTION_ERROR;
		status: number; // 500
	};
	message: string; // 'Caught error during reconnection'
};
export type ConnectionError = {
	data: {
		code: INTERNAL_ERROR_CODE.CONNECTION_ERROR;
		// some error data stuff
	};
	message: string;
};
export type ReconnectionNetworkError = {
	data: {
		code: INTERNAL_ERROR_CODE.RECONNECTION_NETWORK_ISSUE;
	};
	message: string; // Reconnection failed 8 times when browser was offline, likely there was a network issue
};
export type DocumentNotFoundError = {
	data: {
		code: INTERNAL_ERROR_CODE.DOCUMENT_NOT_FOUND;
		status: number; // 404
	};
	message: string; // The requested document is not found
};

/**
 * When we try to apply state updates to the editor, if that fails to apply the user can enter an invalid state where no
 * changes can be saved to NCS.
 */
export type InternalDocumentUpdateFailure = {
	data: {
		code: INTERNAL_ERROR_CODE.DOCUMENT_UPDATE_ERROR;
		meta: {
			editorVersion?: number;
			newVersion?: number;
		};
		status: 500;
	};
	message: 'The provider failed to apply changes to the editor';
};

/**
 * When in view only mode, we should not generate any steps whatsoever.
 */
export type ViewOnlyStepsError = {
	data: {
		code: INTERNAL_ERROR_CODE.VIEW_ONLY_STEPS_ERROR;
	};
	message: 'Attempted to send steps in view only mode';
};

/**
 * A union of all possible internal errors, that are mapped to another error if being emitted to the editor.
 */
export type InternalError =
	| NCSErrors
	| DocumentRecoveryError
	| AddStepsError
	| CatchUpFailedError
	| TokenPermissionError
	| ReconnectionError
	| ConnectionError
	| ReconnectionNetworkError
	| DocumentNotFoundError
	| InternalDocumentUpdateFailure
	| OutOfSyncClientDatalossEvent;

/*
 * This is what a generic ProviderError type would look like:
 * type ProviderError = {
 *   // Unique code, identifies the specific emitted error
 *   // Also exposed as a PROVIDER_ERROR_CODE enum to allow subscribers to use them
 *   code: PROVIDER_ERROR_CODE;
 *   // Informative message describing what went wrong
 *   message: string;
 *   // Flag indicating whether an error is recoverable or not
 *   // used by consumers to disable the provider and show an error message
 *   recoverable: boolean;
 *   // A reason code used to give more detail about why a certain error was thrown
 *   reason?: string;
 * }
 */
