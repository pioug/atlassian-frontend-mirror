import { bind } from 'bind-event-listener';

import { withProfiling } from '../self-measurements';

let shouldInitilizeGlobalErrorHandler = true;

type GlobalError = {
	name: string;
	labelStack: null;
	errorType: string;
	errorMessage: string;
	errorStack?: string;
};

let globalCount = 0;
const errors: GlobalError[] = [];

let push = withProfiling(function push(
	name: string,
	labelStack: null,
	errorType: string,
	errorMessage: string,
	errorStack?: string,
) {
	errors.push({
		name,
		labelStack,
		errorType,
		errorMessage,
		errorStack,
	});
});

export const sinkErrorHandler = withProfiling(function sinkErrorHandler(
	sinkFunc: (
		name: string,
		labelStack: null,
		errorType: string,
		errorMessage: string,
		errorStack?: string,
	) => void,
) {
	push = withProfiling(sinkFunc);
	errors.forEach((e) => {
		sinkFunc(e.name, e.labelStack, e.errorType, e.errorMessage, e.errorStack);
	});
	errors.length = 0;
});

export const getGlobalErrorCount = withProfiling(function getGlobalErrorCount() {
	return globalCount;
});

const handleError = withProfiling(function handleError(e: ErrorEvent) {
	globalCount++;
	if (e.error?.UFOhasCaught === undefined) {
		try {
			if (e.error instanceof Error) {
				push('GlobalErrorHandler', null, e.error.name, e.error.message, e.error.stack);
			} else if (e.error) {
				const hint = JSON.stringify(e.error).slice(0, 50);
				push('GlobalErrorHandler', null, '', `Non error object thrown: ${hint}`, undefined);
			} else if (e.message !== undefined) {
				const hint = e.message.slice(0, 50);
				push('GlobalErrorHandler', null, '', `Non error object thrown: ${hint}`, undefined);
			}

			if (e.error && typeof e.error === 'object') {
				e.error.UFOhasCaught = true;
			}
			// eslint-disable-next-line no-empty
		} catch (e) {}
	}
});

const handlePromiseRejection = withProfiling(function handlePromiseRejection(
	e: PromiseRejectionEvent,
) {
	globalCount++;
	if (e.reason instanceof Error) {
		push('GlobalErrorHandler', null, e.reason.name, e.reason.message, e.reason.stack);
	} else if (e.reason) {
		try {
			const hint = JSON.stringify(e.reason).slice(0, 50);
			push('GlobalErrorHandler', null, '', `Non error object thrown: ${hint}`, undefined);
			// eslint-disable-next-line no-empty
		} catch (e) {}
	}
});

const setupUFOGlobalErrorHandler = withProfiling(function setupUFOGlobalErrorHandler() {
	if (shouldInitilizeGlobalErrorHandler) {
		bind(window, {
			type: 'error',
			listener: (e) => handleError(e as ErrorEvent),
		});

		bind(window, {
			type: 'unhandledrejection',
			listener: handlePromiseRejection,
		});
		shouldInitilizeGlobalErrorHandler = false;
	}
});

export default setupUFOGlobalErrorHandler;
