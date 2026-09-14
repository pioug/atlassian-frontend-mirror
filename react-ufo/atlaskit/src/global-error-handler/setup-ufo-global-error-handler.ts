import { bind } from 'bind-event-listener';

import { globalErrorHandlerState } from './state';

function handleError(event: ErrorEvent) {
	globalErrorHandlerState.globalCount++;
	if (event.error?.UFOhasCaught === undefined) {
		try {
			if (event.error instanceof Error) {
				globalErrorHandlerState.push(
					'GlobalErrorHandler',
					null,
					event.error.name,
					event.error.message,
					event.error.stack,
				);
			} else if (event.error) {
				const hint = JSON.stringify(event.error).slice(0, 50);
				globalErrorHandlerState.push(
					'GlobalErrorHandler',
					null,
					'',
					`Non error object thrown: ${hint}`,
				);
			} else if (event.message !== undefined) {
				const hint = event.message.slice(0, 50);
				globalErrorHandlerState.push(
					'GlobalErrorHandler',
					null,
					'',
					`Non error object thrown: ${hint}`,
				);
			}

			if (event.error && typeof event.error === 'object') {
				event.error.UFOhasCaught = true;
			}
			// eslint-disable-next-line no-empty
		} catch {}
	}
}

function handlePromiseRejection(event: PromiseRejectionEvent) {
	globalErrorHandlerState.globalCount++;
	if (event.reason instanceof Error) {
		globalErrorHandlerState.push(
			'GlobalErrorHandler',
			null,
			event.reason.name,
			event.reason.message,
			event.reason.stack,
		);
	} else if (event.reason) {
		try {
			const hint = JSON.stringify(event.reason).slice(0, 50);
			globalErrorHandlerState.push(
				'GlobalErrorHandler',
				null,
				'',
				`Non error object thrown: ${hint}`,
			);
			// eslint-disable-next-line no-empty
		} catch {}
	}
}

export default function setupUFOGlobalErrorHandler(): void {
	if (globalErrorHandlerState.shouldInitialize) {
		bind(window, { type: 'error', listener: (event) => handleError(event as ErrorEvent) });
		bind(window, { type: 'unhandledrejection', listener: handlePromiseRejection });
		globalErrorHandlerState.shouldInitialize = false;
	}
}
