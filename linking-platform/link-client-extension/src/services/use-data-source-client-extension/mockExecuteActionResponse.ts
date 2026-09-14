import {
	ActionOperationStatus,
	type AtomicActionExecuteResponse,
} from '@atlaskit/linking-types/datasource-actions';

export const mockExecuteActionResponse: AtomicActionExecuteResponse = {
	operationStatus: ActionOperationStatus.SUCCESS,
	errors: [],
};
