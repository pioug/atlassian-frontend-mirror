import type { CantSyncUpErrorAttributes, DocumentUpdateErrorAttributes } from '../helpers/const';

type ValidEventAttributeType = boolean | string | number | object;
// Custom Errors
export class CustomError extends Error {
	extraEventAttributes?: { [key: string]: ValidEventAttributeType };
	constructor(
		message: string,
		error?: unknown,
		extraEventAttributes?: { [key: string]: ValidEventAttributeType },
	) {
		super(message);

		if (typeof (error as Error)?.message === 'string') {
			this.message = (error as Error).message;
		}
		if (extraEventAttributes) {
			this.extraEventAttributes = extraEventAttributes;
		}
	}

	toJSON() {
		return {
			name: this.name,
			message: this.message,
		};
	}

	getExtraErrorEventAttributes = () => this.extraEventAttributes;
}

export class NotConnectedError extends CustomError {
	name = 'NotConnectedError';
}

export class NotInitializedError extends CustomError {
	name = 'NotInitializedError';
}

export class ProviderInitialisationError extends CustomError {
	name = 'ProviderInitialisationError';
}

export class SendTransactionError extends CustomError {
	name = 'SendTransactionError';
}

export class DestroyError extends CustomError {
	name = 'DestroyError';
}

export class SetTitleError extends CustomError {
	name = 'SetTitleError';
}

export class SetEditorWidthError extends CustomError {
	name = 'SetEditorWidthError';
}

export class SetMetadataError extends CustomError {
	name = 'SetMetadataError';
}

export class GetCurrentStateError extends CustomError {
	name = 'GetCurrentStateError';
}

export class GetFinalAcknowledgedStateError extends CustomError {
	name = 'GetFinalAcknowledgedStateError';
}

export class UpdateDocumentError extends CustomError {
	name = 'UpdateDocumentError';
	constructor(message: string, extraAttributes: DocumentUpdateErrorAttributes) {
		super(message, undefined, extraAttributes);
	}
}

export class CantSyncUpError extends CustomError {
	name = 'CantSyncUpError';
	constructor(message: string, extraAttributes: CantSyncUpErrorAttributes) {
		super(message, undefined, extraAttributes);
	}
}
