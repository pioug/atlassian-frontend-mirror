import { globalErrorHandlerState } from './state';

export function sinkErrorHandler(
	sinkFunc: (
		name: string,
		labelStack: null,
		errorType: string,
		errorMessage: string,
		errorStack?: string,
	) => void,
): void {
	globalErrorHandlerState.push = sinkFunc;
	globalErrorHandlerState.errors.forEach((error) => {
		sinkFunc(error.name, error.labelStack, error.errorType, error.errorMessage, error.errorStack);
	});
	globalErrorHandlerState.errors.length = 0;
}
