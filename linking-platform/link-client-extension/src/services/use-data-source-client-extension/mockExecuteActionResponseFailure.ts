import { ActionOperationStatus, type AtomicActionExecuteResponse } from '@atlaskit/linking-types';

export const mockExecuteActionResponseFailure: AtomicActionExecuteResponse = {
	operationStatus: ActionOperationStatus.FAILURE,
	errors: [
		{
			message: 'summary: You must specify a summary of the issue.',
			code: 400,
		},
	],
};
