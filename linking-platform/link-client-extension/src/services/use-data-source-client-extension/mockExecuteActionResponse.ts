import { ActionOperationStatus, type AtomicActionExecuteResponse } from '@atlaskit/linking-types';

export const mockExecuteActionResponse: AtomicActionExecuteResponse = {
	operationStatus: ActionOperationStatus.SUCCESS,
	errors: [],
};
