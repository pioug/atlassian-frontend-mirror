import {
	NotConnectedError,
	NotInitializedError,
	ProviderInitialisationError,
	SendTransactionError,
	DestroyError,
	SetTitleError,
	SetEditorWidthError,
	SetMetadataError,
	GetCurrentStateError,
	GetFinalAcknowledgedStateError,
	UpdateDocumentError,
} from '../custom-errors';

describe('Custom errors', () => {
	it.each([
		[NotConnectedError, 'You are not connected yet', 'NotConnectedError'],
		[NotInitializedError, 'You are not initialised yet', 'NotInitializedError'],
		[
			ProviderInitialisationError,
			'Something went wrong while initialising the Provider',
			'ProviderInitialisationError',
		],
		[SendTransactionError, 'Error while sending steps for a transaction', 'SendTransactionError'],
		[DestroyError, 'Error while shutting down the collab provider', 'DestroyError'],
		[SetTitleError, 'Error while setting the title', 'SetTitleError'],
		[SetEditorWidthError, 'Error while setting the editor width', 'SetEditorWidthError'],
		[SetMetadataError, 'Error while setting the metadata', 'SetMetadataError'],
		[
			GetCurrentStateError,
			'Error while returning the current state of the draft document',
			'GetCurrentStateError',
		],
		[
			GetFinalAcknowledgedStateError,
			'Error while returning the final acknowledged state of the draft document',
			'GetFinalAcknowledgedStateError',
		],
	])(
		'should instantiate the error %p with error message "%s" and name %s',
		(CustomError, errorMessage, errorName) => {
			const err = new CustomError(errorMessage);

			expect(err.message).toEqual(errorMessage);
			expect(err.name).toEqual(errorName);
			expect(err.toJSON()).toEqual({
				message: errorMessage,
				name: errorName,
			});

			// With wrapped error
			const error = new Error('Something wrapped went wrong');
			const wrappedError = new CustomError(errorMessage, error);

			expect(wrappedError.message).toEqual('Something wrapped went wrong');
			expect(wrappedError.name).toEqual(errorName);
			expect(wrappedError.toJSON()).toEqual({
				message: 'Something wrapped went wrong',
				name: errorName,
			});
		},
	);

	it('Sets and gets extra error attributes when creating a UpdateDocumentError', () => {
		const error = new UpdateDocumentError('Failed to update the document', {
			editorVersion: 200,
			newVersion: 400,
			docHasContent: true,
			isDocTruthy: true,
		});
		expect(error.getExtraErrorEventAttributes()).toEqual({
			editorVersion: 200,
			newVersion: 400,
			docHasContent: true,
			isDocTruthy: true,
		});
	});
});
