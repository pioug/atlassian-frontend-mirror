import { globalErrorHandlerState } from './state';

export function getGlobalErrorCount(): number {
	return globalErrorHandlerState.globalCount;
}
