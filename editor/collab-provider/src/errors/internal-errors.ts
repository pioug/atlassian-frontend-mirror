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
	message: string;
	data: {
		code: INTERNAL_ERROR_CODE.DOCUMENT_RESTORE_ERROR;
		status: number; // 500
	};
};
type AddStepsError = {
	message: string;
	data: {
		code: INTERNAL_ERROR_CODE.ADD_STEPS_ERROR;
		status: number; // 500
	};
};

type OutOfSyncClientDatalossEvent = {
	message: string;
	data: {
		meta: {
			reason?: string;
		};
		code: INTERNAL_ERROR_CODE.OUT_OF_SYNC_CLIENT_DATA_LOSS_EVENT;
	};
};

// Channel Errors
export type CatchUpFailedError = {
	message: string;
	data: {
		code: INTERNAL_ERROR_CODE.CATCHUP_FAILED;
		status: number; // ?
	};
};
export type TokenPermissionError = {
	message: string; // 'Insufficient editing permissions'
	data: {
		code: INTERNAL_ERROR_CODE.TOKEN_PERMISSION_ERROR;
		status: number; // 403
		meta: {
			originalError?: unknown;
			reason?: string; // RESOURCE_DELETED
		};
	};
};
export type ReconnectionError = {
	message: string; // 'Caught error during reconnection'
	data: {
		code: INTERNAL_ERROR_CODE.RECONNECTION_ERROR;
		status: number; // 500
	};
};
export type ConnectionError = {
	message: string;
	data: {
		code: INTERNAL_ERROR_CODE.CONNECTION_ERROR;
		// some error data stuff
	};
};
export type ReconnectionNetworkError = {
	message: string; // Reconnection failed 8 times when browser was offline, likely there was a network issue
	data: {
		code: INTERNAL_ERROR_CODE.RECONNECTION_NETWORK_ISSUE;
	};
};
export type DocumentNotFoundError = {
	message: string; // The requested document is not found
	data: {
		code: INTERNAL_ERROR_CODE.DOCUMENT_NOT_FOUND;
		status: number; // 404
	};
};

/**
 * When we try to apply state updates to the editor, if that fails to apply the user can enter an invalid state where no
 * changes can be saved to NCS.
 */
export type InternalDocumentUpdateFailure = {
	message: 'The provider failed to apply changes to the editor';
	data: {
		code: INTERNAL_ERROR_CODE.DOCUMENT_UPDATE_ERROR;
		meta: {
			newVersion?: number;
			editorVersion?: number;
		};
		status: 500;
	};
};

/**
 * When in view only mode, we should not generate any steps whatsoever.
 */
export type ViewOnlyStepsError = {
	message: 'Attempted to send steps in view only mode';
	data: {
		code: INTERNAL_ERROR_CODE.VIEW_ONLY_STEPS_ERROR;
	};
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
